import { openai } from '@ai-sdk/openai';

export const aiConfig = {
  openai: openai('gpt-4o'),
};