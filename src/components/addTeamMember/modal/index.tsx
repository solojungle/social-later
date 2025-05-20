"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InterfaceIcons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import {
  InvitationSchema,
  InvitationSchemaValues,
} from "@/schemas/invitation-schema";
import { useInvitationsStore } from "@/stores/invitations";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { useTeamMembersStore } from "@/stores/team-members";
import { useUserStore } from "@/stores/user";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

export function AddTeamMemberModal() {
  return (
    <Dialog>
      <DialogTrigger
        asChild
        className="inline-flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-md border text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        <div>
          <PlusIcon className="h-4 w-4" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new team member</DialogTitle>
        </DialogHeader>
        <Content />
      </DialogContent>
    </Dialog>
  );
}

function Content() {
  const { addInvitation } = useInvitationsStore();
  const [loading, setLoading] = useState(false);
  const { members } = useTeamMembersStore();
  const { id: userId } = useUserStore();
  const { id: teamId } = useSelectedTeamStore();

  const userRole = members.find((member) => member.id === userId)?.role;

  const createInvitation = api.invitation.create.useMutation({
    onSettled: () => {
      setLoading(false);
    },
    onSuccess: (input) => {
      addInvitation(input);

      toast.success("Invitation has been sent!", {
        description: "The recipient will be sent an email shortly.",
      });
    },
  });

  const defaultValues = {
    email: "",
    role: UserRole.MEMBER,
  };

  const form = useForm<InvitationSchemaValues>({
    defaultValues,
    resolver: zodResolver(InvitationSchema.pick({ email: true, role: true })),
  });

  function onSubmit(data: InvitationSchemaValues) {
    // Set loading state
    setLoading(true);

    // Add teamId to the input
    const input = {
      ...data,
      teamId,
    };

    createInvitation.mutate(input);
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4 flex w-full items-start justify-between space-x-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <FormControl>
                  <Input id="email" placeholder="jane@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel htmlFor="role">Role</FormLabel>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Member Role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={UserRole.MEMBER}>Member</SelectItem>
                    {userRole === "OWNER" && (
                      <SelectItem value={UserRole.OWNER}>Owner</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <span className="text-xs">
          Manage your team members and their roles. On the team <b>Settings</b>{" "}
          page.
        </span>
        <DialogFooter className="gap-1">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button disabled={loading} type="submit">
            {loading && (
              <InterfaceIcons.Loading className="mr-2 h-4 w-4 animate-spin" />
            )}
            Invite
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
