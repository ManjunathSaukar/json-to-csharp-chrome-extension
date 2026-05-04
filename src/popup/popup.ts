import { JsonToCSharpConverter } from '../core/converter';

const converter = new JsonToCSharpConverter();

const jsonInput = document.getElementById('json') as HTMLTextAreaElement;
const output = document.getElementById('output') as HTMLTextAreaElement;
const rootInput = document.getElementById('root') as HTMLInputElement;

const generateBtn = document.getElementById('generate') as HTMLButtonElement;
const downloadBtn = document.getElementById('download') as HTMLButtonElement;
const loader = document.getElementById('loader') as HTMLElement;

// ============================
// GENERATE
// ============================
document.getElementById('generate')?.addEventListener('click', () =>
{
    if (!jsonInput.value)
    {
        showToast('Enter JSON');
        return;
    }

    generateBtn.disabled = true;
    loader.classList.remove('hidden');

    setTimeout(() =>
    {
        try
        {
            const json = jsonInput.value;
            const root = rootInput.value || 'Root';

            const result = converter.convert(json, root);
            output.value = result;

            showToast('Generated');
        } catch
        {
            showToast('Invalid JSON');
        } finally
        {
            generateBtn.disabled = false;
            loader.classList.add('hidden');
        }
    }, 0);
});

// ============================
// FORMAT JSON
// ============================
document.getElementById('format')?.addEventListener('click', () =>
{
    try
    {
        const parsed = JSON.parse(jsonInput.value);
        jsonInput.value = JSON.stringify(parsed, null, 2);
    } catch
    {
        showToast('Invalid JSON');
    }
});

// ============================
// CLEAR
// ============================
document.getElementById('clear')?.addEventListener('click', () =>
{
    jsonInput.value = '';
    output.value = '';
});

// ============================
// COPY
// ============================
document.getElementById('copy')?.addEventListener('click', () =>
{
    if (!output.value)
    {
        showToast('Nothing to copy');
        return;
    }

    navigator.clipboard.writeText(output.value);
    showToast('Copied to clipboard');
});

// ============================
// DOWNLOAD
// ============================
document.getElementById('download')?.addEventListener('click', () =>
{
    if (!output.value)
    {
        showToast('Nothing to download');
        return;
    }

    downloadBtn.disabled = true;
    loader.classList.remove('hidden');

    setTimeout(() =>
    {
        const blob = new Blob([output.value], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `Models_${Date.now()}.cs`;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);

        showToast('Downloaded');

        downloadBtn.disabled = false;
        loader.classList.add('hidden');
    }, 0);
});

// ============================
// TOAST
// ============================
function showToast(message: string)
{
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() =>
    {
        toast.classList.remove('show');
    }, 1500);
}