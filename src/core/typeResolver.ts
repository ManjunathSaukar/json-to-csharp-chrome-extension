const datePatterns: RegExp[] = [
    /^\d{4}-\d{2}-\d{2}$/,                                   // yyyy-MM-dd
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,                  // ISO
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/,                  // with time
    /^\d{1,2}\/\d{1,2}\/\d{2,4}$/,                           // dd/MM/yyyy
    /^\d{1,2}\/\d{1,2}\/\d{2,4} \d{2}:\d{2}/,
    /^\d{1,2}\/\d{1,2}\/\d{2,4} \d{2}:\d{2}:\d{2}/,
    /^\d{1,2}-\d{1,2}-\d{2,4}$/,                             // dd-MM-yyyy
    /^\d{1,2}-\d{1,2}-\d{2,4} \d{2}:\d{2}:\d{2}/,
    /^\d{8}$/,                                               // ddMMyyyy
    /^\d{1,2}-[A-Za-z]{3}-\d{4}$/,                           // dd-MMM-yyyy
    /^\d{1,2} [A-Za-z]{3} \d{4}$/                            // dd MMM yyyy
];

function isStrictDate(value: string): boolean
{
    if (!value || typeof value !== 'string') return false;

    // ❌ Avoid numeric strings like "5221"
    if (/^\d+$/.test(value)) return false;

    // ❌ Too short to be a valid date
    if (value.length < 6) return false;

    // Must match at least one known pattern
    if (!datePatterns.some(pattern => pattern.test(value)))
    {
        return false;
    }

    // Final validation
    const parsed = new Date(value);
    return !isNaN(parsed.getTime());
}

export function resolveType(value: any): string
{
    if (value === null) return 'object';

    if (typeof value === 'string')
    {
        if (isStrictDate(value)) return 'DateTime';
        return 'string';
    }

    if (typeof value === 'number')
    {
        return Number.isInteger(value) ? 'int' : 'double';
    }

    if (typeof value === 'boolean') return 'bool';

    if (Array.isArray(value)) return 'array';

    return 'object';
}