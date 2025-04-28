"use client";

import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { InterfaceIcons } from "../ui/icons";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";

export function FeedbackForm() {
  const [loading, setLoading] = useState(false);

  const { mutateAsync: sendFeedback } = api.feedback.create.useMutation({
    onSettled: () => {
      setLoading(false);
    },
    onSuccess: () => {
      toast.success("Thank you for your feedback.", {});
    },
  });

  const FormSchema = z.object({
    content: z.string().min(1),
  });

  type FormValues = z.infer<typeof FormSchema>;

  const defaultValues = {
    content: "",
  };

  const form = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: FormValues) {
    setLoading(true);
    await sendFeedback(data);
  }

  return (
    <Popover>
      <PopoverTrigger asChild className="hidden md:inline-flex">
        <Button className="" variant="outline">
          Feedback
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={5}>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback</FormLabel>
                  <FormControl>
                    <Textarea
                      className="h-40 resize-none"
                      placeholder="Ideas to improve this page or issues you are experiencing."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-1 flex items-center justify-end">
              <Button disabled={loading} type="submit">
                {loading && (
                  <InterfaceIcons.Loading className="mr-2 h-4 w-4 animate-spin" />
                )}
                <span>Send</span>
              </Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
