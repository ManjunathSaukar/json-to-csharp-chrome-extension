import { parseArrayRoot, parseObject } from './parser.js';
import { buildCSharp } from './builder.js';

export class JsonToCSharpConverter
{
    convert(json: string, rootClass: string): string
    {
        const parsed = JSON.parse(json);

        let classes;

        if (Array.isArray(parsed))
        {
            classes = parseArrayRoot(parsed, rootClass);
        } else
        {
            classes = parseObject(parsed, rootClass);
        }

        return buildCSharp(classes.reverse());
    }
}