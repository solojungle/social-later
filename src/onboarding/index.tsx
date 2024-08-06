"use client";

import { Step, StepItem, Stepper, useStepper } from "@/components/ui/stepper";

import { FirstStepForm } from "./components/forms/first";
import { SecondStepForm } from "./components/forms/second";
import { SuccessPage } from "./pages/success";

function StepperFooter() {
	const { activeStep, resetSteps, steps } = useStepper();

	if (activeStep !== steps.length) {
		return null;
	}

	return <SuccessPage />;
}

type OnboardingStepItem = StepItem & {
	component: JSX.Element;
};

export function Onboarding() {
	const steps = [
		{ label: "Question 1", component: <FirstStepForm /> },
		{ label: "Question 2", component: <SecondStepForm /> },
	] satisfies OnboardingStepItem[];

	return (
		<div className="container mb-14 pt-5 md:mb-10">
			<div className="flex w-full flex-col gap-4">
				<Stepper initialStep={0} steps={steps}>
					{steps.map((stepProps) => {
						if (stepProps?.component === undefined) {
							return null;
						}

						return (
							<Step key={stepProps.label} {...stepProps}>
								{stepProps.component}
							</Step>
						);
					})}
					<StepperFooter />
				</Stepper>
			</div>
		</div>
	);
}
