export function toPascalCase(name: string): string
{
    return name
        .replace(/[_\- ]+/g, ' ')
        .split(' ')
        .map(x => x.charAt(0).toUpperCase() + x.slice(1))
        .join('');
}