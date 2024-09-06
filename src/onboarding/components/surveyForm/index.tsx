import { zodResolver } from "@hookform/resolvers/zod";
import posthog from "posthog-js";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

function MultipleChoiceField({ form, choices }: any) {
	return (
		<FormField
			control={form.control}
			name="answer"
			render={({ field }) => (
				<FormItem className="w-full">
					<FormControl>
						<RadioGroup
							onValueChange={field.onChange}
							defaultValue={field.value}
						>
							{choices.map((choice: any) => (
								<label
									htmlFor={choices.id}
									key={choices.id}
									className="flex w-full cursor-pointer items-center rounded-lg border border-border bg-background p-4 shadow-sm transition duration-75 ease-out [&:has([data-state=checked])]:border-primary"
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

type QuestionProps = {
	question: {
		id: string;
		content: string;
		type: "multiple_choice" | "text" | "rating";
		choices?: string[];
	};
	isLastStep: boolean;
	isFirstStep: boolean;
};

export function SurveyForm({
	question,
	isLastStep,
	isFirstStep,
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
			questionId: question.id,
			answer: data.answer,
		});
		nextStep();
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="container max-w-4xl space-y-6 pt-8"
			>
				<div className="mb-4">
					<h2 className="mb-4 text-2xl font-bold">{question.content}</h2>
					{question.type === "multiple_choice" && (
						<MultipleChoiceField form={form} choices={question.choices} />
					)}
				</div>
				<div className="flex w-full justify-end gap-2">
					<Button
						type="button"
						disabled={isFirstStep || form.formState.isSubmitting}
						onClick={prevStep}
						variant="outline"
						className="w-full"
					>
						Previous
					</Button>
					<Button
						type="submit"
						className="w-full"
						disabled={form.formState.isSubmitting}
					>
						{isLastStep ? "Finish" : "Next"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
