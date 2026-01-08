const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

export const generateId = (length: number = 6): string => {
  let id = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters[randomIndex];
  }
  return id;
};

export const isValidId = (id: string): boolean => {
  return /^[a-z0-9]{3,12}$/.test(id);
};
