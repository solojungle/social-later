"use client";

import { Step, StepItem, Stepper } from "@/components/ui/stepper";

import { FirstStepForm } from "./components/forms/first";
import { SuccessPage } from "./pages/success";

export function Onboarding() {
	const steps = [
		{ label: "Question 1" },
		{ label: "Question 2" },
		{ label: "Finish" },
	] satisfies StepItem[];

	return (
		<div className="container pt-5">
			<div className="flex w-full flex-col gap-4">
				<Stepper initialStep={0} steps={steps}>
					{steps.map((stepProps, index) => {
						if (index === 0) {
							return (
								<Step key={stepProps.label} {...stepProps}>
									<FirstStepForm />
								</Step>
							);
						}

						return (
							<Step key={stepProps.label} {...stepProps}>
								<SuccessPage />
							</Step>
						);
					})}
				</Stepper>
			</div>
		</div>
	);
}
