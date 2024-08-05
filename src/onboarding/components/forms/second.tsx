import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { useStepper } from "@/components/ui/stepper";
import { SecondFormField } from "@/onboarding/oldindex";

import { StepperFormActions } from "./first";

// A checkbox group that many can be selected
const SecondFormSchema = z.object({
	options: z.array(z.string()),
});

export function SecondStepForm() {
	const { nextStep } = useStepper();

	const form = useForm<z.infer<typeof SecondFormSchema>>({
		resolver: zodResolver(SecondFormSchema),
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
				<SecondFormField form={form} />
				<StepperFormActions />
			</form>
		</Form>
	);
}
