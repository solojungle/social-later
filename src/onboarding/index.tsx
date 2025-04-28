"use client";

import { InterfaceIcons } from "@/components/ui/icons";
import { Step, Stepper, useStepper } from "@/components/ui/stepper";
import { api } from "@/trpc/react";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";

import { SurveyForm } from "./components/surveyForm";
import { SuccessPage } from "./pages/success";

type Question = {
  choices?: string[];
  content: string;
  id: string;
  type: "multiple_choice" | "rating" | "text";
};

type Survey = {
  description: string;
  id: string;
  questions: Question[];
  title: string;
};

export function Onboarding() {
  const [survey, setSurvey] = useState<null | Survey>(null);
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
                isFirstStep={index === 0}
                isLastStep={index === survey.questions.length - 1}
                question={question}
              />
            </Step>
          ))}
          <StepperFooter />
        </Stepper>
      </div>
    </div>
  );
}

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
