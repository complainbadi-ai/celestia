
export const db = {
  query: async (query: string, params: any[]) => {
    console.log('Faking DB call', query, params);
    return { rows: [] };
  },
};
