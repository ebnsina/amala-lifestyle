// Browser preview only: download the file and use the browser's file chooser.
export async function saveText(name: string, text: string): Promise<'saved' | 'canceled'> {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: name });
  a.click();
  URL.revokeObjectURL(url);
  return 'saved';
}

export function pickText(): Promise<string | null> {
  return new Promise((resolve) => {
    const input = Object.assign(document.createElement('input'), { type: 'file', accept: '.json,application/json' });
    input.onchange = () => (input.files?.[0] ? input.files[0].text().then(resolve) : resolve(null));
    input.oncancel = () => resolve(null);
    input.click();
  });
}
