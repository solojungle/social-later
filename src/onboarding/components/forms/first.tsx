import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useStepper } from "@/components/ui/stepper";

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
				<Button size="sm" type="button" onClick={resetSteps}>
					Reset
				</Button>
			) : (
				<>
					<Button
						disabled={isDisabledStep}
						onClick={prevStep}
						size="sm"
						variant="secondary"
						type="button"
					>
						Prev
					</Button>
					<Button size="sm" type="submit">
						{isLastStep ? "Finish" : "Next"}
					</Button>
				</>
			)}
		</div>
	);
}

// A checkbox group that many can be selected
const FirstFormSchema = z.object({
	options: z.array(z.string()),
});

export function FirstStepForm() {
	const { nextStep } = useStepper();

	const form = useForm<z.infer<typeof FirstFormSchema>>({
		resolver: zodResolver(FirstFormSchema),
		defaultValues: {
			options: [],
		},
	});

	function onSubmit() {
		nextStep();
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FirstFormField form={form} />
				<StepperFormActions />
			</form>
		</Form>
	);
}
