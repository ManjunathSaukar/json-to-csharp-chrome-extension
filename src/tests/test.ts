import { JsonToCSharpConverter } from './core/converter.js';

const converter = new JsonToCSharpConverter();

const sampleJson = `{
  "name": "John",
  "age": 30,
  "isActive": true,
  "address": {
    "city": "Hyderabad",
    "zip": 500001
  },
  "tags": ["a", "b"],
  "orders": [
    {
      "id": 1,
      "amount": 99.5
    }
  ]
}`;

const result = converter.convert(sampleJson, 'User');

console.log(result);