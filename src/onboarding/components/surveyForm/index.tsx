import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useStepper } from "@/components/ui/stepper";
import { useUserStore } from "@/stores/user";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import posthog from "posthog-js";
import { useForm } from "react-hook-form";
import { z } from "zod";

type QuestionProps = {
  isFirstStep: boolean;
  isLastStep: boolean;
  question: {
    choices?: string[];
    content: string;
    id: string;
    type: "multiple_choice" | "rating" | "text";
  };
};

export function SurveyForm({
  isFirstStep,
  isLastStep,
  question,
}: QuestionProps) {
  const { id: userId } = useUserStore();
  const { nextStep, prevStep } = useStepper();
  const { mutate: answerQuestion } = api.survey.answer.useMutation();

  const schema = z.object({
    answer: z.string().min(1, { message: "Please select an answer." }),
  });

  const form = useForm({
    resolver: zodResolver(schema),
  });

  function onSubmit(data: any) {
    if (isLastStep) {
      posthog.capture("welcome_survey_complete", {
        distinctId: userId,
      });
    }

    answerQuestion({
      answer: data.answer,
      questionId: question.id,
    });
    nextStep();
  }

  return (
    <Form {...form}>
      <form
        className="container max-w-4xl space-y-6 pt-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="mb-4">
          <h2 className="mb-4 text-2xl font-bold">{question.content}</h2>
          {question.type === "multiple_choice" && (
            <MultipleChoiceField choices={question.choices} form={form} />
          )}
        </div>
        <div className="flex w-full justify-end gap-2">
          <Button
            className="w-full"
            disabled={isFirstStep || form.formState.isSubmitting}
            onClick={prevStep}
            type="button"
            variant="outline"
          >
            Previous
          </Button>
          <Button
            className="w-full"
            disabled={form.formState.isSubmitting}
            type="submit"
          >
            {isLastStep ? "Finish" : "Next"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function MultipleChoiceField({ choices, form }: any) {
  return (
    <FormField
      control={form.control}
      name="answer"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormControl>
            <RadioGroup
              defaultValue={field.value}
              onValueChange={field.onChange}
            >
              {choices.map((choice: any, index) => (
                <label
                  className="flex w-full cursor-pointer items-center rounded-lg border border-border bg-background p-4 shadow-sm transition duration-75 ease-out [&:has([data-state=checked])]:border-primary"
                  htmlFor={choices.id}
                  key={index}
                >
                  <RadioGroupItem value={choice} />
                  <span className="ml-4">{choice}</span>
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
