const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

export const generateId = (): string => {
  let id = '';
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters[randomIndex];
  }
  return id;
};

export const isValidId = (id: string): boolean => {
  return /^[a-z0-9]{4}$/.test(id);
};
