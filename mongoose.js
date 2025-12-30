import * as db from './dbHandler.js';
import { randomUUID } from 'crypto';

export class Schema {
  constructor(schema) {
    this.schema = schema;
  }

  validate(data, partial = false) {
    return Object.entries(this.schema).every(([key, rule]) => {
      const value = data?.[key];

      if (!partial && rule.required && value === undefined) return false;
      if (value === undefined) return true;

      if (rule instanceof Schema) {
        return rule.validate(value);
      }

      if (Array.isArray(rule)) {
        if (!Array.isArray(value)) return false;
        const subSchema = rule[0];
        return subSchema instanceof Schema
          ? value.every(v => subSchema.validate(v))
          : true;
      }

      const typeMap = {
        String: 'string',
        Number: 'number',
        Boolean: 'boolean',
        Object: 'object',
        Array: 'object',
        Date: 'object'
      };

      if (rule.type === null) return true; 
      if (rule.type === Date) return value instanceof Date || !isNaN(new Date(value));
      return typeof value === typeMap[rule.type.name];
    });
  }

  sanitize(data) {
    return Object.keys(this.schema).reduce((acc, key) => {
      const rule = this.schema[key];
      const value = data?.[key];
      if (value === undefined) return acc;

      if (rule instanceof Schema) {
        acc[key] = rule.sanitize(value);
      } else if (Array.isArray(rule)) {
        const subSchema = rule[0];
        acc[key] = value.map(v => (subSchema instanceof Schema ? subSchema.sanitize(v) : v));
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});
  }
}

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
    const timestamp = new Date().toISOString();
    const newItem = { _id: randomUUID().replace(/-/g, ''), createdAt: timestamp, ...this.schema.sanitize(data) };
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