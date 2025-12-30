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

      if (rule.type === null) return true; // allow null
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
