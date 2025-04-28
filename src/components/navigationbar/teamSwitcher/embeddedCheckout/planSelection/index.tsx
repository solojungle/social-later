import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InterfaceIcons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ProductsSelectorProps {
  disabledProduct?: string[];
  field: any;
  products: {
    currency: string;
    description: null | string;
    id: string;
    image: string;
    name: string;
    price: number;
    priceFormatted: string;
    stripePriceId: string;
    stripeProductId: string;
  }[];
}

type TeamSwitcherModalProps = {
  onBack: any;
  onNext: any;
  setDialog: any;
};

export function ProductsSelector({
  disabledProduct,
  field,
  products,
}: ProductsSelectorProps) {
  if (!products || products.length <= 0) {
    return (
      <div className="flex items-center justify-center p-5">
        <InterfaceIcons.Loading className="h-16 w-16 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <FormControl>
      <RadioGroup
        className="grid grid-cols-2 gap-4"
        defaultValue={field.value}
        onValueChange={field.onChange}
      >
        {products.map((product) => (
          <div key={product.id}>
            <RadioGroupItem
              className="peer sr-only"
              disabled={disabledProduct?.includes(product.stripeProductId)}
              id={product.id}
              value={product.stripePriceId}
            />
            <Label
              className="flex h-32 cursor-pointer flex-col items-center rounded-md border-2 border-muted bg-popover p-4 ring-primary/40 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:ring-2"
              htmlFor={product.id}
            >
              <span className="mb-2 text-lg">{product.name}</span>
              <span className="text-sm text-muted-foreground">
                {product.priceFormatted} per month
              </span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </FormControl>
  );
}

const TeamCreationSchema = z.object({
  subscription: z.string().min(1, {
    message: "You must pick at least one option.",
  }),
});

type TeamCreationSchemaValues = z.infer<typeof TeamCreationSchema>;

export function PlanSelection({ onNext, setDialog }: TeamSwitcherModalProps) {
  const products = api.products.getProducts.useQuery();

  const [loading, setLoading] = useState(false);

  const { mutateAsync: getClientSecret } =
    api.stripe.createCheckoutSession.useMutation({
      onSettled: () => setLoading(false),
    });

  const defaultValues: TeamCreationSchemaValues = {
    subscription: "",
  };

  const form = useForm<TeamCreationSchemaValues>({
    defaultValues,
    resolver: zodResolver(TeamCreationSchema),
  });

  async function onSubmit(data: TeamCreationSchemaValues) {
    setLoading(true);

    const choosenSubscription = products.data?.find(
      (product) => product.stripePriceId === data.subscription,
    );

    // Create the checkout session
    const secretObject = await getClientSecret({
      priceId: choosenSubscription?.stripePriceId,
    });

    // Convert clientSecret to string instead of an object
    const { clientSecret } = secretObject;

    onNext(clientSecret);
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="subscription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subscriptions</FormLabel>
              <ProductsSelector field={field} products={products.data ?? []} />
              <FormDescription>
                Creating a new team will not affect your other teams or any of
                its projects.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="mt-4">
          <Button
            onClick={() => setDialog(false)}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button disabled={loading} type="submit">
            {loading && (
              <InterfaceIcons.Loading className="mr-2 h-4 w-4 animate-spin" />
            )}
            Continue
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
