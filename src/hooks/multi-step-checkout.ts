import { useState } from "react";

import { TeamCreationFormData } from "@/schemas/team-create-form-data";

export function useMultiStepCheckout(initialStep = 0) {
	const [currentStep, setCurrentStep] = useState(initialStep);
	const [formData, setFormData] = useState<TeamCreationFormData>();

	const nextStep = (data: any) => {
		setFormData((prevData) => ({ ...prevData, ...data }));
		setCurrentStep((prevStep) => prevStep + 1);
	};

	const returnStep = () => {
		setCurrentStep((prevStep) => prevStep - 1);
	};

	return { currentStep, nextStep, returnStep, formData };
}
