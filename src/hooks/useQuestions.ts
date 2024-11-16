import { useState, useEffect } from 'react';
import { questionService, ProcessedQuestion } from '../services/api';

interface UseQuestionsOptions {
  amount?: number;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  source?: 'openTrivia' | 'quizApi';
}

export const useQuestions = ({
  amount = 10,
  category,
  difficulty,
  source = 'openTrivia',
}: UseQuestionsOptions = {}) => {
  const [questions, setQuestions] = useState<ProcessedQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        let fetchedQuestions: ProcessedQuestion[];
        
        if (source === 'openTrivia') {
          fetchedQuestions = await questionService.fetchQuestionsFromOpenTrivia(
            amount,
            category,
            difficulty
          );
        } else {
          fetchedQuestions = await questionService.fetchQuestionsFromQuizApi(
            amount,
            category
          );
        }

        setQuestions(fetchedQuestions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [amount, category, difficulty, source]);

  return { questions, loading, error };
};