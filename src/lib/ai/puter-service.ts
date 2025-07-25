// Puter AI Integration Service
import puter from "puter";

interface PersonalityData {
  personalityType: string;
  strengthDescription: string;
  learningStyle: string;
  mathScore: number;
  logicalScore: number;
  creativityScore: number;
  comprehensionScore: number;
}

interface Question {
  id: string;
  type: "multiple_choices" | "essay";
  questionText: string;
  choices?: string[];
  answer?: number;
  promptAnswer?: string;
}

export class PuterAIService {
  private static instance: PuterAIService;
  private initialized = false;

  private constructor() {}

  public static getInstance(): PuterAIService {
    if (!PuterAIService.instance) {
      PuterAIService.instance = new PuterAIService();
    }
    return PuterAIService.instance;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      // Initialize Puter if needed
      if (typeof window !== "undefined") {
        await puter.init();
      }
      this.initialized = true;
    } catch (error) {
      console.error("Failed to initialize Puter:", error);
      throw error;
    }
  }

  async generateQuestionsWithAI(
    subjectMatter: string,
    personalityData?: PersonalityData
  ): Promise<Question[]> {
    try {
      await this.initialize();

      // Create a personalized prompt based on student's personality
      let personalityContext = "";
      if (personalityData) {
        personalityContext = `
The student has the following learning profile:
- Personality Type: ${personalityData.personalityType}
- Learning Style: ${personalityData.learningStyle}
- Strengths: ${personalityData.strengthDescription}
- Math Score: ${personalityData.mathScore}/100
- Logical Thinking Score: ${personalityData.logicalScore}/100
- Creativity Score: ${personalityData.creativityScore}/100
- Reading Comprehension Score: ${personalityData.comprehensionScore}/100

Please tailor the questions to match their learning style and strengthen their weaker areas.
`;
      }

      const prompt = `
${personalityContext}

Based on the following subject matter, generate exactly 10 multiple choice questions and 3 essay questions.

Subject Matter:
${subjectMatter}

Please respond with a valid JSON array containing 13 questions total. Each question should have this structure:

For multiple choice questions:
{
  "id": "unique_id",
  "type": "multiple_choices",
  "questionText": "The question text",
  "choices": ["Option A", "Option B", "Option C", "Option D"],
  "answer": 0 (index of correct answer, 0-3)
}

For essay questions:
{
  "id": "unique_id", 
  "type": "essay",
  "questionText": "The essay question text",
  "promptAnswer": "Expected answer guidelines for grading"
}

Make sure the questions test understanding, application, and critical thinking about the subject matter.
`;

      // Use Puter's AI to generate questions
      const response = await puter.ai.chat([
        {
          role: "system",
          content:
            "You are an educational AI assistant that creates personalized questions based on student learning profiles. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ]);

      // Parse the AI response
      let questions: Question[];
      try {
        // Extract JSON from response if it's wrapped in markdown or other text
        const jsonMatch = response.match(/\[[\s\S]*\]/);
        const jsonString = jsonMatch ? jsonMatch[0] : response;
        questions = JSON.parse(jsonString);
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        // Fallback to mock questions if AI parsing fails
        questions = this.generateFallbackQuestions();
      }

      // Validate and ensure we have the right number of questions
      const multipleChoice = questions
        .filter((q) => q.type === "multiple_choices")
        .slice(0, 10);
      const essays = questions.filter((q) => q.type === "essay").slice(0, 3);

      // Fill with fallback questions if needed
      while (multipleChoice.length < 10) {
        multipleChoice.push(
          this.createFallbackMultipleChoice(multipleChoice.length + 1)
        );
      }
      while (essays.length < 3) {
        essays.push(this.createFallbackEssay(essays.length + 1));
      }

      return [...multipleChoice, ...essays];
    } catch (error) {
      console.error("Error generating questions with Puter AI:", error);
      // Return fallback questions if AI fails
      return this.generateFallbackQuestions();
    }
  }

  async generatePersonalityAssessment(
    answers: Record<string, string | number>,
    questions: Question[]
  ): Promise<PersonalityData> {
    try {
      await this.initialize();

      const prompt = `
Analyze the following student responses and generate a personality assessment:

Questions and Answers:
${questions
  .map((q, index) => {
    const answer = answers[q.id];
    if (q.type === "multiple_choices" && typeof answer === "number") {
      return `Q${index + 1}: ${q.questionText}\nAnswer: ${
        q.choices?.[answer] || "N/A"
      }`;
    } else if (q.type === "essay") {
      return `Q${index + 1}: ${q.questionText}\nAnswer: ${
        answer || "No answer provided"
      }`;
    }
    return "";
  })
  .join("\n\n")}

Based on these responses, provide a personality assessment in the following JSON format:
{
  "personalityType": "A brief personality type (e.g., 'Analytical Thinker', 'Creative Problem Solver')",
  "strengthDescription": "Detailed description of the student's intellectual strengths and learning preferences",
  "learningStyle": "How this student learns best (visual, auditory, kinesthetic, etc.)",
  "mathScore": 85,
  "logicalScore": 78,
  "creativityScore": 92,
  "comprehensionScore": 88
}

Provide scores from 0-100 based on their demonstrated abilities in the responses.
`;

      const response = await puter.ai.chat([
        {
          role: "system",
          content:
            "You are an educational psychologist AI that analyzes student responses to determine learning styles and intellectual strengths. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ]);

      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : response;
        return JSON.parse(jsonString);
      } catch (parseError) {
        console.error("Failed to parse personality assessment:", parseError);
        return this.generateFallbackPersonality();
      }
    } catch (error) {
      console.error("Error generating personality assessment:", error);
      return this.generateFallbackPersonality();
    }
  }

  private generateFallbackQuestions(): Question[] {
    const multipleChoice: Question[] = Array.from({ length: 10 }, (_, i) =>
      this.createFallbackMultipleChoice(i + 1)
    );

    const essays: Question[] = Array.from({ length: 3 }, (_, i) =>
      this.createFallbackEssay(i + 1)
    );

    return [...multipleChoice, ...essays];
  }

  private createFallbackMultipleChoice(num: number): Question {
    return {
      id: `mc_${Date.now()}_${num}`,
      type: "multiple_choices",
      questionText: `Based on the subject matter, what is the correct answer to question ${num}?`,
      choices: [
        "First possible answer",
        "Second possible answer",
        "Third possible answer",
        "Fourth possible answer",
      ],
      answer: Math.floor(Math.random() * 4),
    };
  }

  private createFallbackEssay(num: number): Question {
    return {
      id: `essay_${Date.now()}_${num}`,
      type: "essay",
      questionText: `Essay question ${num}: Explain your understanding of the key concepts discussed in the subject matter.`,
      promptAnswer:
        "Students should demonstrate understanding of the main concepts and provide examples.",
    };
  }

  private generateFallbackPersonality(): PersonalityData {
    return {
      personalityType: "Balanced Learner",
      strengthDescription:
        "Shows a well-rounded approach to learning with balanced analytical and creative thinking abilities.",
      learningStyle:
        "Multimodal learner who benefits from various teaching approaches including visual, auditory, and hands-on activities.",
      mathScore: 75,
      logicalScore: 75,
      creativityScore: 75,
      comprehensionScore: 75,
    };
  }
}

export const puterAI = PuterAIService.getInstance();
