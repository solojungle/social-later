import { PrismaClient, QuestionType } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedSurvey() {
  const questionsData = [
    {
      choices: [
        "Content Creator",
        "Small Business Owner",
        "Marketing Manager",
        "Social Media Manager",
        "Other",
      ],
      content: "What is your role at your company?",
      type: QuestionType.multiple_choice,
    },
    {
      choices: ["1-10", "11-50", "51-200", "201-500", "500+"],
      content: "How many employees does your company have?",
      type: QuestionType.multiple_choice,
    },
    {
      choices: ["1", "2-5", "6-10", "11-20", "20+"],
      content: "How many social media accounts do you manage?",
      type: QuestionType.multiple_choice,
    },
  ];

  await prisma.survey.upsert({
    create: {
      description: "Help us get to know you better.",
      questions: {
        create: questionsData.map((question) => ({
          choices: question.choices,
          content: question.content,
          type: question.type,
        })),
      },
      title: "Onboarding Survey",
    },
    update: {},
    where: { id: "1" },
  });

  console.log("Survey created");
}
