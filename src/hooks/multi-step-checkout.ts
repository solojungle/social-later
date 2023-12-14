import { ReactElement, useState } from "react";

export function useMultiStepCheckout(steps: ReactElement[]) {
	const [currentStep, setCurrentStep] = useState(0);

	function nextStep() {
		if (currentStep === steps.length - 1) return;
		setCurrentStep(currentStep + 1);
	}

	function prevStep() {
		if (currentStep <= 0) return;
		setCurrentStep(currentStep - 1);
	}

	return {
		currentStep,
		step: steps[currentStep],
		nextStep,
		prevStep,
	};
}
