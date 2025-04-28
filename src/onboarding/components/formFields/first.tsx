import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function FirstFormField({ form }: any) {
  const items = [
    {
      badge: "Up to 5x trial conversion",
      description: "Hosting it on your website or including it in changelogs",
      id: "1",
      label: "Marketing",
    },
    {
      badge: "More than 2x demo conversion",
      description: "Following up with your products",
      id: "2",
      label: "Sales",
    },
    {
      badge: "Up to 30% more activated users",
      description: "Embedding it within your product",
      id: "3",
      label: "Product",
    },
    {
      badge: "Save over 3k hours onboarding",
      description: "Including it in your knowledge base",
      id: "4",
      label: "Customer Success",
    },
    {
      badge: "Up to 10x faster than creating a video",
      description: "Training your employees",
      id: "5",
      label: "Training",
    },
    {
      description: "Tell us your use case",
      id: "6",
      label: "Other",
    },
    {
      id: "7",
      label: "Not sure yet",
    },
  ];

  return (
    <FormField
      control={form.control}
      name="usecase"
      render={({ field }) => (
        <FormItem className="w-full">
          <div className="mb-4">
            <FormLabel
              className="mb-2 text-2xl font-bold md:text-4xl"
              htmlFor="usecase"
            >
              What are you planning on using FeedFrenzy for?
            </FormLabel>
            <FormDescription className="text-sm text-gray-600 md:text-lg">
              Select one.
            </FormDescription>
          </div>
          <FormControl>
            <RadioGroup
              defaultValue={field.value}
              onValueChange={field.onChange}
            >
              {items.map((item) => (
                <label
                  className="flex w-full cursor-pointer select-none items-center rounded-lg border border-border bg-background p-4 shadow-sm transition ease-out [&:has([data-state=checked])]:border-primary"
                  htmlFor={item.id}
                  key={item.id}
                >
                  <RadioGroupItem
                    className="mr-4"
                    id={item.id}
                    value={item.id}
                  />
                  <div className="flex flex-col items-start text-foreground">
                    <label
                      className="flex cursor-pointer text-base font-semibold"
                      htmlFor={item.id}
                    >
                      {item.label}
                    </label>
                    <label
                      className="mt-[2px] cursor-pointer text-xs font-normal text-gray-600 md:text-sm"
                      htmlFor={item.id}
                    >
                      {item.description}
                    </label>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
