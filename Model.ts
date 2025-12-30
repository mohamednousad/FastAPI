import * as db from './dbHandler';
import { Schema } from './Schema';
import { randomUUID } from 'crypto';
import { BaseItem } from './dbHandler';

export class Model<T extends BaseItem> {
  private collection: string;
  private schema: Schema;

  constructor(collection: string, schema: Schema) {
    this.collection = collection;
    this.schema = schema;
  }

  getAll(): Promise<T[]> {
    return db.getAll<T>(this.collection);
  }

  getById(_id: string): Promise<T | undefined> {
    return db.getById<T>(this.collection, _id);
  }

  create(data: Omit<T, '_id'>): Promise<T> {
    if (!this.schema.validate(data)) throw new Error('Invalid data');
    
    const sanitizedData = this.schema.sanitize(data);
    const newItem = { _id: randomUUID(), ...sanitizedData } as T;
    
    return db.create<T>(this.collection, newItem);
  }

  update(_id: string, data: Partial<Omit<T, '_id'>>): Promise<T | null> {
    if (!this.schema.validate(data, true)) throw new Error('Invalid data');
    
    const sanitizedData = this.schema.sanitize(data);
    return db.update<T>(this.collection, _id, sanitizedData);
  }

  remove(_id: string): Promise<boolean> {
    return db.remove<T>(this.collection, _id);
  }
}