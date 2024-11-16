import axios from 'axios';

// API endpoints configuration
const API_CONFIG = {
  OPEN_TRIVIA: 'https://opentdb.com/api.php',
  QUIZ_API: 'https://quizapi.io/api/v1/questions',
  NUMBERS_API: 'http://numbersapi.com',
};

// API keys (in production, these should be in environment variables)
const API_KEYS = {
  QUIZ_API: '/api/v1/quiz',
};

export interface ExternalQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface ProcessedQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: string;
}

class QuestionService {
  private static instance: QuestionService;
  private questionCache: Map<string, ProcessedQuestion[]>;

  private constructor() {
    this.questionCache = new Map();
  }

  public static getInstance(): QuestionService {
    if (!QuestionService.instance) {
      QuestionService.instance = new QuestionService();
    }
    return QuestionService.instance;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private processOpenTriviaQuestion(raw: ExternalQuestion): ProcessedQuestion {
    const options = this.shuffleArray([
      raw.correct_answer,
      ...raw.incorrect_answers,
    ]);

    return {
      id: Math.random() * 10000,
      question: raw.question,
      options,
      correctAnswer: options.indexOf(raw.correct_answer),
      category: raw.category,
      difficulty: raw.difficulty,
    };
  }

  async fetchQuestionsFromOpenTrivia(
    amount: number = 10,
    category?: string,
    difficulty?: 'easy' | 'medium' | 'hard'
  ): Promise<ProcessedQuestion[]> {
    const cacheKey = `trivia-${amount}-${category}-${difficulty}`;

    if (this.questionCache.has(cacheKey)) {
      return this.questionCache.get(cacheKey)!;
    }

    try {
      const params = new URLSearchParams({
        amount: amount.toString(),
        type: 'multiple',
        ...(category && { category }),
        ...(difficulty && { difficulty }),
      });

      const response = await axios.get(`${API_CONFIG.OPEN_TRIVIA}?${params}`);
      const questions = response.data.results.map(
        this.processOpenTriviaQuestion.bind(this)
      );

      this.questionCache.set(cacheKey, questions);
      return questions;
    } catch (error) {
      console.error('Error fetching questions from OpenTrivia:', error);
      throw new Error('Failed to fetch questions');
    }
  }

  async fetchQuestionsFromQuizApi(
    amount: number = 10,
    category?: string
  ): Promise<ProcessedQuestion[]> {
    const cacheKey = `quiz-${amount}-${category}`;

    if (this.questionCache.has(cacheKey)) {
      return this.questionCache.get(cacheKey)!;
    }

    try {
      const response = await axios.get(API_CONFIG.QUIZ_API, {
        params: {
          apiKey: API_KEYS.QUIZ_API,
          limit: amount,
          category,
        },
      });

      const questions = response.data.map((q: any) => ({
        id: Math.random() * 10000,
        question: q.question,
        options: Object.values(q.answers).filter(Boolean),
        correctAnswer: Object.values(q.correct_answers).indexOf(true),
        category: q.category,
        difficulty: q.difficulty,
      }));

      this.questionCache.set(cacheKey, questions);
      return questions;
    } catch (error) {
      console.error('Error fetching questions from QuizAPI:', error);
      throw new Error('Failed to fetch questions');
    }
  }

  clearCache() {
    this.questionCache.clear();
  }
}

export const questionService = QuestionService.getInstance();
