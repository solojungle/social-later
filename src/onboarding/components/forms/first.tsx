import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useStepper } from "@/components/ui/stepper";
import { api } from "@/trpc/react";

import { FirstFormField } from "../formFields/first";

// Because we're using use-forms we need these buttons to exist inside the form
export function StepperFormActions() {
	const {
		prevStep,
		resetSteps,
		isDisabledStep,
		hasCompletedAllSteps,
		isLastStep,
	} = useStepper();

	return (
		<div className="flex w-full justify-end gap-2">
			{hasCompletedAllSteps ? (
				<Button type="button" onClick={resetSteps}>
					Reset
				</Button>
			) : (
				<>
					<Button
						disabled={isDisabledStep}
						onClick={prevStep}
						className="w-full"
						size="lg"
						variant="secondary"
						type="button"
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
		resolver: zodResolver(FirstFormSchema),
		defaultValues: {
			usecase: "",
		},
	});

	async function onSubmit(data: any) {
		await answerQuestion({
			questionId: "1",
			answer: data.usecase,
		});

		nextStep();
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="container max-w-4xl space-y-6 pt-8"
			>
				<FirstFormField form={form} />
				<StepperFormActions />
			</form>
		</Form>
	);
}
