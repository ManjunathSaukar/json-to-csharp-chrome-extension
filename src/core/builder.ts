import { ClassDefinition } from './parser.js';

function applyNullable(type: string, isNullable: boolean): string
{

    if (!isNullable) return type;

    if (['int', 'double', 'bool', 'DateTime'].includes(type))
    {
        return `${type}?`;
    }

    if (type === 'string') return 'string?';

    return type;
}

export function buildCSharp(classes: ClassDefinition[]): string
{
    return classes
        .map(cls =>
        {
            const props = cls.properties
                .map(p => `    public ${applyNullable(p.type, p.isNullable)} ${p.name} { get; set; }`)
                .join('\n');

            return `public class ${cls.name}\n{\n${props}\n}`;
        })
        .join('\n\n');
}