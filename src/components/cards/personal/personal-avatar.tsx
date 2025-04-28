import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SingleFileSchema } from "@/schemas/file-schema";
import { useTeamMembersStore } from "@/stores/team-members";
import { useUserStore } from "@/stores/user";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileType } from "@prisma/client";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { SettingsCardBase } from "../settings-card-base";

export function PersonalAvatarCard() {
  const [loading, setLoading] = useState(false);
  const { mutateAsync: fetchPresignedUrls } =
    api.aws.getStandardUploadPresignedUrl.useMutation();
  const {
    id: currentUserId,
    image,
    name,
    setImage: setUserAvatar,
  } = useUserStore();
  const { members: teamMembers } = useTeamMembersStore();
  const { mutateAsync: createFile } = api.file.create.useMutation();
  const { mutate: deleteFile } = api.file.delete.useMutation();
  const [filePreview, setFilePreview] = useState<null | string>(null);

  const getFile = api.file.get.useQuery(
    {
      key:
        image
          .split("/")
          .pop()
          ?.replace(/\.[^/.]+$/, "") || "",
    },
    {
      enabled: false,
    },
  );
  const { mutate: deleteObject } = api.aws.deleteObject.useMutation();
  const updateUser = api.user.updateUser.useMutation();

  const defaultValues = {
    image: undefined,
  };

  // Putting them here for now
  const AvatarSchema = z.object({
    image: SingleFileSchema,
  });
  type AvatarSchemaValues = z.infer<typeof AvatarSchema>;

  const form = useForm<AvatarSchemaValues>({
    defaultValues,
    resolver: zodResolver(AvatarSchema),
  });

  const fileRef = form.register("image", { required: true });

  async function onSubmit(data: any) {
    const imageFile = data.image[0] as File;
    const filename = imageFile.name.split(".").shift();
    const extension = imageFile.name.split(".").pop();

    try {
      setLoading(true);

      if (image && image !== "" && image !== null) {
        const oldAvatarKey = image.split("/").pop();

        // TODO: Check if it exists in our AWS
        // TODO: I think we can remove some could since we already make a call for the file...
        if (oldAvatarKey) {
          // Check if we already have the file in our system
          const doesFileExist = await getFile.refetch();
          if (doesFileExist.data) {
            // Delete the avatar from aws, will also delete the thumbnail in one go.
            deleteObject({ key: oldAvatarKey });

            // Delete file from our system
            // Remove the extension from the key
            deleteFile({ key: oldAvatarKey.split(".").shift() || "" });
          }
        }
      }

      const presignedObject = await fetchPresignedUrls({
        fileExtension: extension || "",
      });

      await axios.put(presignedObject.signedUrl, imageFile, {
        headers: {
          "Content-Type": imageFile.type,
        },
      });

      const userAvatarFile = await createFile({
        file: {
          extension: extension || "",
          key: presignedObject.key,
          mime: imageFile.type,
          name: filename || "",
          size: imageFile.size,
          type: FileType.image,
        },
      });

      updateUser.mutate(
        {
          image: userAvatarFile.thumbnail,
        },
        {
          // There is here to prevent a race condition on updating the user avatar (Add Team Members)
          onSuccess: async () => {
            setUserAvatar(userAvatarFile.url);

            // Update your avatar in the team members store
            const members = teamMembers.map((member) => {
              if (member.id === currentUserId) {
                return {
                  ...member,
                  // We set as the full sized image because creating the thumbnail is a race condition
                  image: userAvatarFile.url,
                };
              }

              return member;
            });

            useTeamMembersStore.setState({ members });

            toast.success("Successfully updated your avatar!", {});
          },
        },
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <SettingsCardBase
          content={
            <>
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <FormLabel>File Upload</FormLabel>
                    <FormControl>
                      <Input
                        accept="image/*"
                        id="picture"
                        type="file"
                        {...fileRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFilePreview(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          } else {
                            setFilePreview(null);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {filePreview ? (
                <Avatar className="mr-2 h-20 w-20">
                  <AvatarImage alt="File Preview" src={filePreview} />
                  <AvatarFallback>
                    {name.split(" ").map((n: string) => n[0])}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="mr-2 h-20 w-20">
                  <AvatarImage alt={name} src={image} />
                  <AvatarFallback>
                    {name.split(" ").map((n: string) => n[0])}
                  </AvatarFallback>
                </Avatar>
              )}
            </>
          }
          description="This is your avatar. Click to upload a custom one from your files. Will be resized to 200x200."
          footerSubtitle="An avatar is optional but strongly recommended."
          isLoading={loading}
          title="Avatar"
        />
      </form>
    </Form>
  );
}
