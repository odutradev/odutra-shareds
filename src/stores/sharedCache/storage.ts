import type { StateStorage } from 'zustand/middleware';

const DB_NAME = 'odutra-presentation-cache';
const STORE_NAME = 'shared-cache';

const getStore = (mode: IDBTransactionMode) =>
  new Promise<IDBObjectStore>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(STORE_NAME, mode);
      resolve(tx.objectStore(STORE_NAME));
    };
    request.onerror = () => reject(request.error);
  });

const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const store = await getStore('readonly');
      const request = store.get(name);
      return new Promise((resolve) => {
        request.onsuccess = () => resolve((request.result as string) ?? null);
        request.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      const store = await getStore('readwrite');
      store.put(value, name);
    } catch {}
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      const store = await getStore('readwrite');
      store.delete(name);
    } catch {}
  },
};

export default storage;