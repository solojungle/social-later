import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { useStepper } from "@/components/ui/stepper";

import { SecondFormField } from "../formFields/second";
import { StepperFormActions } from "./first";

// A checkbox group that many can be selected
const SecondFormSchema = z.object({
	companySize: z.string(),
});

export function SecondStepForm() {
	const { nextStep } = useStepper();

	const form = useForm<z.infer<typeof SecondFormSchema>>({
		resolver: zodResolver(SecondFormSchema),
		defaultValues: {
			companySize: "",
		},
	});

	function onSubmit(data: any) {
		console.log(data);
		nextStep();
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="container max-w-4xl space-y-6 pt-8"
			>
				<SecondFormField form={form} />
				<StepperFormActions />
			</form>
		</Form>
	);
}
