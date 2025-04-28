import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useStepper } from "@/components/ui/stepper";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { FirstFormField } from "../formFields/first";

// Because we're using use-forms we need these buttons to exist inside the form
export function StepperFormActions() {
  const {
    hasCompletedAllSteps,
    isDisabledStep,
    isLastStep,
    prevStep,
    resetSteps,
  } = useStepper();

  return (
    <div className="flex w-full justify-end gap-2">
      {hasCompletedAllSteps ? (
        <Button onClick={resetSteps} type="button">
          Reset
        </Button>
      ) : (
        <>
          <Button
            className="w-full"
            disabled={isDisabledStep}
            onClick={prevStep}
            size="lg"
            type="button"
            variant="secondary"
          >
            Prev
          </Button>
          <Button className="w-full" size="lg" type="submit">
            {isLastStep ? "Finish" : "Next"}
          </Button>
        </>
      )}
    </div>
  );
}

// A checkbox group that many can be selected
const FirstFormSchema = z.object({
  usecase: z.string(),
});

export function FirstStepForm() {
  // const {
  // 	mutateAsync: createTeamViaEmbed,
  // 	isLoading,
  // 	isError,
  // } = api.team.createViaEmbed.useMutation({

  const { mutateAsync: answerQuestion } = api.survey.answer.useMutation();

  const { nextStep } = useStepper();

  const form = useForm<z.infer<typeof FirstFormSchema>>({
    defaultValues: {
      usecase: "",
    },
    resolver: zodResolver(FirstFormSchema),
  });

  async function onSubmit(data: any) {
    await answerQuestion({
      answer: data.usecase,
      questionId: "1",
    });

    nextStep();
  }

  return (
    <Form {...form}>
      <form
        className="container max-w-4xl space-y-6 pt-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FirstFormField form={form} />
        <StepperFormActions />
      </form>
    </Form>
  );
}
