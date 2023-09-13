import { Challenge } from './types';

export const getNewChallenge = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/challenges`, {
    method: 'POST',
  });
  const challenge = await response.json();
  return challenge as Challenge;
};

export const submitChallengeAnswer = async (
  challengeId: string,
  answer: number
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/challenges/${challengeId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer }),
    }
  );
  const result = await response.json();
  return result.solved as boolean;
};
