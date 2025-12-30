import * as db from './dbHandler.js';
import { randomUUID } from 'crypto';

export class Model {
  constructor(collection, schema) {
    this.collection = collection;
    this.schema = schema;
  }

  getAll() {
    return db.getAll(this.collection);
  }

  getById(_id) {
    return db.getById(this.collection, _id);
  }

  create(data) {
    if (!this.schema.validate(data)) throw new Error('Invalid data');
    const newItem = { _id: randomUUID(), ...this.schema.sanitize(data) };
    return db.create(this.collection, newItem);
  }

  update(_id, data) {
    if (!this.schema.validate(data, true)) throw new Error('Invalid data');
    return db.update(this.collection, _id, this.schema.sanitize(data));
  }

  remove(_id) {
    return db.remove(this.collection, _id);
  }
}
