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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  TeamCreationSchema,
  TeamCreationSchemaValues,
} from "@/schemas/team-schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface ProductsSelectorProps {
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

export default function CreateTeamModal({
  onNext,
  setDialog,
}: TeamSwitcherModalProps) {
  const products = api.products.getProducts.useQuery();

  const defaultValues: TeamCreationSchemaValues = {
    name: "",
    subscription: "",
  };

  const form = useForm<TeamCreationSchemaValues>({
    defaultValues,
    resolver: zodResolver(TeamCreationSchema),
  });

  async function onSubmit(data: TeamCreationSchemaValues) {
    const choosenSubscription = products.data?.find(
      (product) => product.stripePriceId === data.subscription,
    );

    const formData = {
      name: data.name,
      subscription: {
        currency: choosenSubscription?.currency,
        id: choosenSubscription?.id,
        image: choosenSubscription?.image,
        name: choosenSubscription?.name,
        price: choosenSubscription?.price,
        priceFormatted: choosenSubscription?.priceFormatted,
        priceId: choosenSubscription?.stripePriceId,
      },
    };

    onNext(formData);
  }

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Inc." {...field} />
              </FormControl>
              <FormDescription>
                This is your team&apos;s display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
          <Button type="submit">Continue</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

function ProductsSelector({ field, products }: ProductsSelectorProps) {
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
              id={product.id}
              value={product.stripePriceId}
            />
            <Label
              className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              htmlFor={product.id}
            >
              {/* <img
								alt={product.name}
								src={product.image}
								className="mb-3 h-9 w-9"
							/> */}
              <span className="mb-2">{product.name}</span>
              <span className="text-xs text-muted-foreground">
                {product.priceFormatted} per month
              </span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </FormControl>
  );
}
