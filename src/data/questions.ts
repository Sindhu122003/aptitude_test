interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface CompanyQuestions {
  [key: string]: Question[];
}

export const questions: CompanyQuestions = {
  "1": [ // Google
    {
      id: 1,
      question: "If a train travels 360 kilometers in 4 hours, what is its speed in kilometers per hour?",
      options: ["80 km/h", "90 km/h", "85 km/h", "95 km/h"],
      correctAnswer: 0
    },
    {
      id: 2,
      question: "A programmer writes 100 lines of code in 2 hours. How many lines can they write in 5 hours at the same rate?",
      options: ["200 lines", "250 lines", "300 lines", "150 lines"],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "If 8 machines can complete a project in 6 days, how many machines are needed to complete it in 4 days?",
      options: ["10 machines", "12 machines", "14 machines", "16 machines"],
      correctAnswer: 1
    },
    {
      id: 4,
      question: "What is the next number in the sequence: 2, 6, 12, 20, 30, ?",
      options: ["42", "40", "38", "36"],
      correctAnswer: 0
    },
    {
      id: 5,
      question: "A server processes 1000 requests in 5 seconds. How many requests can it process in 1 minute?",
      options: ["10000", "12000", "15000", "12500"],
      correctAnswer: 1
    },
    {
      id: 6,
      question: "If a code review takes 30 minutes for 200 lines, how long will it take for 500 lines at the same rate?",
      options: ["45 minutes", "60 minutes", "75 minutes", "90 minutes"],
      correctAnswer: 2
    },
    {
      id: 7,
      question: "What percentage of 80 is 20?",
      options: ["20%", "25%", "30%", "15%"],
      correctAnswer: 1
    },
    {
      id: 8,
      question: "If a website has 85% uptime, how many hours of downtime does it have in a 24-hour period?",
      options: ["2.4 hours", "3.6 hours", "4.2 hours", "5.1 hours"],
      correctAnswer: 1
    },
    {
      id: 9,
      question: "A database query takes 0.5 seconds. How many queries can be processed in 2 minutes?",
      options: ["120", "180", "240", "360"],
      correctAnswer: 2
    },
    {
      id: 10,
      question: "If 3 developers can build a feature in 4 days, how long will it take 6 developers?",
      options: ["1 day", "2 days", "3 days", "4 days"],
      correctAnswer: 1
    }
  ],
  // Add similar sets for other companies (2-6)
};

export type { Question };