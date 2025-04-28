import { Form } from "@/components/ui/form";
import { useStepper } from "@/components/ui/stepper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SecondFormField } from "../formFields/second";
import { StepperFormActions } from "./first";

// A checkbox group that many can be selected
const SecondFormSchema = z.object({
  companySize: z.string(),
});

export function SecondStepForm() {
  const { nextStep } = useStepper();

  const form = useForm<z.infer<typeof SecondFormSchema>>({
    defaultValues: {
      companySize: "",
    },
    resolver: zodResolver(SecondFormSchema),
  });

  function onSubmit(data: any) {
    console.log(data);
    nextStep();
  }

  return (
    <Form {...form}>
      <form
        className="container max-w-4xl space-y-6 pt-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <SecondFormField form={form} />
        <StepperFormActions />
      </form>
    </Form>
  );
}
