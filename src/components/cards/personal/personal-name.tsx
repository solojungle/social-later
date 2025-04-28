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
import { useUserStore } from "@/stores/user";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { SettingsCardBase } from "../settings-card-base";

export function PersonalNameCard() {
  const { name, setName } = useUserStore();

  // TODO: Remove this functionality
  // const { setName: setSelectedTeamsName } = useSelectedTeamStore();

  const updateUser = api.user.updateUser.useMutation();

  const defaultValues = {
    name,
  };

  const form = useForm<UserSchemaValues>({
    defaultValues,
    resolver: zodResolver(UserSchema.pick({ name: true })),
  });

  function onSubmit(data: UserSchemaValues) {
    // Make database call
    updateUser.mutate({
      name: data.name,
    });

    // Update local state
    setName(data.name);

    // Update selected team name
    // setSelectedTeamsName(data.name);

    toast("You submitted the following values:", {
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
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input placeholder="Your display name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          }
          description="Please enter your full name, or a display name you are comfortable with."
          footerSubtitle="Please use 32 characters at maximum."
          title="Display Name"
        />
      </form>
    </Form>
  );
}
