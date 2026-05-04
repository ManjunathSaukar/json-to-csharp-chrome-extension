import { resolveType } from './typeResolver.js';
import { toPascalCase } from './naming.js';

export type PropertyDefinition = {
    name: string;
    type: string;
    isNullable: boolean;
};

export type ClassDefinition = {
    name: string;
    properties: PropertyDefinition[];
};

export function parseArrayRoot(arr: any[], className: string): ClassDefinition[]
{

    const merged: Record<string, { type: string; nullable: boolean; count: number }> = {};
    const totalItems = arr.length;

    for (const item of arr)
    {
        for (const key in item)
        {

            const value = item[key];
            const resolvedType = resolveType(value);

            if (!merged[key])
            {
                merged[key] = {
                    type: resolvedType,
                    nullable: value === null,
                    count: 1
                };
            } else
            {
                if (value === null) merged[key].nullable = true;

                // simple type override (you can improve later)
                if (merged[key].type !== resolvedType && resolvedType !== 'object')
                {
                    merged[key].type = resolvedType;
                }

                merged[key].count++;
            }
        }
    }

    // detect missing fields
    for (const key in merged)
    {
        if (merged[key].count < totalItems)
        {
            merged[key].nullable = true;
        }
    }

    const properties: PropertyDefinition[] = [];

    for (const key in merged)
    {
        properties.push({
            name: toPascalCase(key),
            type: merged[key].type,
            isNullable: merged[key].nullable
        });
    }

    return [{
        name: className,
        properties
    }];
}

export function parseObject(obj: any, className: string, classes: ClassDefinition[] = []): ClassDefinition[]
{
    const properties: PropertyDefinition[] = [];

    for (const key in obj)
    {
        const value = obj[key];
        const propName = toPascalCase(key);
        let type = resolveType(value);

        if (type === 'object' && value !== null && !Array.isArray(value))
        {
            const nestedClassName = toPascalCase(key);
            parseObject(value, nestedClassName, classes);
            type = nestedClassName;
        }

        if (type === 'array')
        {

            if (value.length === 0)
            {
                type = 'List<object>';
            } else
            {

                const allObjects = value.every((v: any) => typeof v === 'object' && v !== null);

                // ✅ IMPORTANT FIX: merge all objects
                if (allObjects)
                {

                    const merged: Record<string, { type: string; nullable: boolean; count: number }> = {};
                    const totalItems = value.length;

                    for (const item of value)
                    {
                        for (const k in item)
                        {

                            const val = item[k];
                            const resolvedType = resolveType(val);

                            if (!merged[k])
                            {
                                merged[k] = {
                                    type: resolvedType,
                                    nullable: val === null,
                                    count: 1
                                };
                            } else
                            {
                                if (val === null) merged[k].nullable = true;

                                if (merged[k].type !== resolvedType && resolvedType !== 'object')
                                {
                                    merged[k].type = resolvedType;
                                }

                                merged[k].count++;
                            }
                        }
                    }

                    // detect missing fields
                    for (const k in merged)
                    {
                        if (merged[k].count < totalItems)
                        {
                            merged[k].nullable = true;
                        }
                    }

                    const nestedClassName = toPascalCase(key);

                    const nestedProperties: PropertyDefinition[] = [];

                    for (const k in merged)
                    {
                        nestedProperties.push({
                            name: toPascalCase(k),
                            type: merged[k].type,
                            isNullable: merged[k].nullable
                        });
                    }

                    classes.push({
                        name: nestedClassName,
                        properties: nestedProperties
                    });

                    type = `List<${nestedClassName}>`;
                } else
                {

                    // fallback (primitive arrays)
                    let elementType = resolveType(value[0]);

                    for (const item of value)
                    {
                        const t = resolveType(item);
                        if (t !== elementType)
                        {
                            elementType = 'object';
                            break;
                        }
                    }

                    type = `List<${elementType}>`;
                }
            }
        }

        properties.push({
            name: propName,
            type,
            isNullable: value === null
        });
    }

    classes.push({
        name: className,
        properties
    });

    return classes;
}