
export const api = {
  get: async (url: string) => {
    console.log('Faking API call to', url);
    return {
      data: {
        id: '1',
        zodiac_sign: 'aries',
        date: '2024-07-26',
        content: 'Today is a good day for Aries.',
        tags: ['general', 'optimism'],
        action_prompt: 'Take a walk outside.',
      },
    };
  },
};
