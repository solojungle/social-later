"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserSchema, UserSchemaValues } from "@/schemas/user-schema";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useUserStore } from "@/stores/user";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { SettingsCardBase } from "../settings-card-base";

export function PersonalUsernameCard() {
  const { setUrl, url } = useUserStore();
  const { setUrl: setSelectedTeamsUrl } = useSelectedTeamStore();

  const updateUser = api.user.updateUser.useMutation();

  const defaultValues = {
    url,
  };

  const form = useForm<UserSchemaValues>({
    defaultValues,
    resolver: zodResolver(UserSchema.pick({ url: true })),
  });

  function onSubmit(data: UserSchemaValues) {
    // Make database call
    updateUser.mutate({
      url: data.url,
    });

    // Update local state
    setUrl(data.url);

    // Update selected team url
    setSelectedTeamsUrl(data.url);

    toast.success("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <SettingsCardBase
          content={
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input placeholder="Your username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          }
          description="Your username acts also acts as your URL namespace."
          footerSubtitle="Please use 48 characters at maximum."
          title="Username"
        />
      </form>
    </Form>
  );
}
