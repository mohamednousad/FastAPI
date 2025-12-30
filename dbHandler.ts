import fs from 'fs/promises';
import path from 'path';

export interface BaseItem {
  _id: string;
  [key: string]: any;
}

const dbPath = (collection: string): string => path.resolve('database', `${collection}.json`);

export const getAll = async <T extends BaseItem>(collection: string): Promise<T[]> => {
  try {
    const data = await fs.readFile(dbPath(collection), 'utf-8');
    return JSON.parse(data) as T[];
  } catch {
    return [];
  }
};

export const getById = async <T extends BaseItem>(collection: string, _id: string): Promise<T | undefined> => {
  const items = await getAll<T>(collection);
  return items.find(item => item._id === _id);
};

export const saveAll = async <T extends BaseItem>(collection: string, data: T[]): Promise<void> => {
  await fs.writeFile(dbPath(collection), JSON.stringify(data, null, 2));
};

export const create = async <T extends BaseItem>(collection: string, obj: T): Promise<T> => {
  const items = await getAll<T>(collection);
  items.push(obj);
  await saveAll(collection, items);
  return obj;
};

export const update = async <T extends BaseItem>(collection: string, _id: string, obj: Partial<T>): Promise<T | null> => {
  const items = await getAll<T>(collection);
  const index = items.findIndex(i => i._id === _id);
  
  if (index === -1) return null;
  
  items[index] = { ...items[index], ...obj };
  await saveAll(collection, items);
  return items[index];
};

export const remove = async <T extends BaseItem>(collection: string, _id: string): Promise<boolean> => {
  const items = await getAll<T>(collection);
  const filtered = items.filter(i => i._id !== _id);
  
  if (filtered.length === items.length) return false;
  
  await saveAll(collection, filtered);
  return true;
};