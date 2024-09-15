"use client";

import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

import { InterfaceIcons } from "@/components/ui/icons";
import { Step, Stepper, useStepper } from "@/components/ui/stepper";
import { api } from "@/trpc/react";

import { SurveyForm } from "./components/surveyForm";
import { SuccessPage } from "./pages/success";

function StepperFooter() {
	const [callbackUrl] = useQueryState("callbackUrl", {
		defaultValue: "",
	});
	const { activeStep, steps } = useStepper();

	if (activeStep !== steps.length) {
		return null;
	}

	return <SuccessPage callbackUrl={callbackUrl} />;
}

type Survey = {
	id: string;
	title: string;
	description: string;
	questions: Question[];
};

type Question = {
	id: string;
	content: string;
	type: "multiple_choice" | "text" | "rating";
	choices?: string[];
};

export function Onboarding() {
	const [survey, setSurvey] = useState<Survey | null>(null);
	const { data: surveyData } = api.survey.getSurvey.useQuery();

	useEffect(() => {
		if (surveyData) {
			const updatedSurvey: Survey = {
				...surveyData,
			};
			setSurvey(updatedSurvey);
		}
	}, [surveyData]);

	if (!survey) {
		return (
			<div className="flex h-96 flex-col items-center justify-center">
				<InterfaceIcons.Loading className="h-16 w-16 animate-spin text-muted-foreground" />
			</div>
		);
	}

	return (
		<div className="container mb-14 pt-5 md:mb-10">
			<div className="flex w-full flex-col gap-4">
				<Stepper
					initialStep={0}
					steps={survey.questions.map((q) => ({ label: q.content }))}
				>
					{survey.questions.map((question, index) => (
						<Step key={question.id} label={`Question ${index + 1}`}>
							<SurveyForm
								question={question}
								isLastStep={index === survey.questions.length - 1}
								isFirstStep={index === 0}
							/>
						</Step>
					))}
					<StepperFooter />
				</Stepper>
			</div>
		</div>
	);
}
