"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ClockIcon } from "lucide-react";

import { TimePickerContent } from "./content";

type TimePickerFormFieldProps = {
  form: any;
};

export function TimePickerFormField({ form }: TimePickerFormFieldProps) {
  return (
    <FormField
      control={form.control}
      name="time"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Time</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  className={cn(
                    "w-full justify-start pl-3 font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                  variant="outline"
                >
                  <ClockIcon className="mr-4 h-4 w-4 opacity-50" />
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>HH:MM</span>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <TimePickerContent />
            </PopoverContent>
          </Popover>
          <FormDescription>UTC Timezone</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
