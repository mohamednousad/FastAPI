type Constructor = StringConstructor | NumberConstructor | BooleanConstructor | ObjectConstructor | ArrayConstructor | DateConstructor;

export interface SchemaRule {
  type: Constructor | null;
  required?: boolean;
}

export interface SchemaDefinition {
  [key: string]: SchemaRule | Schema | [Schema];
}

export class Schema {
  public schema: SchemaDefinition;

  constructor(schema: SchemaDefinition) {
    this.schema = schema;
  }

  validate(data: any, partial: boolean = false): boolean {
    return Object.entries(this.schema).every(([key, rule]) => {
      const value = data?.[key];

      if (!partial && this.isRule(rule) && rule.required && value === undefined) return false;
      
      if (value === undefined) return true;

      if (rule instanceof Schema) {
        return rule.validate(value);
      }

      if (Array.isArray(rule)) {
        if (!Array.isArray(value)) return false;
        const subSchema = rule[0];
        return subSchema instanceof Schema
          ? value.every((v: any) => subSchema.validate(v))
          : true;
      }

      if (!this.isRule(rule)) return false;

      const typeMap: Record<string, string> = {
        String: 'string',
        Number: 'number',
        Boolean: 'boolean',
        Object: 'object',
        Array: 'object', 
        Date: 'object'
      };

      if (rule.type === null) return true; 
      if (rule.type === Date) return value instanceof Date || !isNaN(new Date(value).getTime());

      const typeName = rule.type.name;
      return typeof value === typeMap[typeName];
    });
  }

  sanitize(data: any): any {
    return Object.keys(this.schema).reduce((acc: any, key) => {
      const rule = this.schema[key];
      const value = data?.[key];

      if (value === undefined) return acc;

      if (rule instanceof Schema) {
        acc[key] = rule.sanitize(value);
      } else if (Array.isArray(rule)) {
        const subSchema = rule[0];
        acc[key] = value.map((v: any) => (subSchema instanceof Schema ? subSchema.sanitize(v) : v));
      } else {
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  private isRule(arg: any): arg is SchemaRule {
    return arg && typeof arg === 'object' && 'type' in arg && !('schema' in arg);
  }
}