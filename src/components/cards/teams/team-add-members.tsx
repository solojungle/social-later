"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InvitationSchema,
  InvitationSchemaValues,
} from "@/schemas/invitation-schema";
import { useInvitationsStore } from "@/stores/invitations";
import { useSelectedTeamStore } from "@/stores/selected-team";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";
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
import { SettingsCardBase } from "../settings-card-base";

export function TeamAddMembersCard() {
  const [isLoading, setIsLoading] = useState(false);

  const { addInvitation } = useInvitationsStore();

  const createInvitation = api.invitation.create.useMutation({
    onSettled: () => {
      setIsLoading(false);
    },
    onSuccess: (input) => {
      addInvitation(input);

      toast.success("Invitation has been sent!", {
        description: "The invitation has been sent to the recipient.",
      });
    },
  });

  const { id: selectedTeamId } = useSelectedTeamStore();

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
    setIsLoading(true);

    // Add teamId to the input
    const input = {
      ...data,
      teamId: selectedTeamId,
    };

    createInvitation.mutate(input);
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <SettingsCardBase
          buttonContent="Invite"
          content={
            <div className="flex w-full items-start justify-between space-x-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel htmlFor="email">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        placeholder="jane@example.com"
                        {...field}
                      />
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
                        <SelectItem value={UserRole.OWNER}>Owner</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          }
          description="Invite new members by email address."
          footerSubtitle="An email will be sent to the recipient."
          isLoading={isLoading}
        />
      </form>
    </Form>
  );
}
