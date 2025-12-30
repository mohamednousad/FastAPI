import fs from 'fs/promises';
import path from 'path';

const dbPath = (collection) => path.resolve('database', `${collection}.json`);

export const getAll = async (collection) => {
  try {
    const data = await fs.readFile(dbPath(collection), 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const getById = async (collection, _id) => {
  const items = await getAll(collection);
  return items.find(item => item._id === _id);
};

export const saveAll = async (collection, data) => {
  await fs.writeFile(dbPath(collection), JSON.stringify(data, null, 2));
};

export const create = async (collection, obj) => {
  const items = await getAll(collection);
  items.push(obj);
  await saveAll(collection, items);
  return obj;
};

export const update = async (collection, _id, obj) => {
  const items = await getAll(collection);
  const index = items.findIndex(i => i._id === _id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...obj };
  await saveAll(collection, items);
  return items[index];
};

export const remove = async (collection, _id) => {
  const items = await getAll(collection);
  const filtered = items.filter(i => i._id !== _id);
  await saveAll(collection, filtered);
  return filtered.length !== items.length;
};
