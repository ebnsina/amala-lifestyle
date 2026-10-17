import { Directory, File } from 'expo-file-system';

// Android: user picks a folder on the phone (Downloads, SD card…) via the system picker.
export async function saveText(name: string, text: string): Promise<'saved' | 'canceled'> {
  let dir: Directory;
  try {
    dir = await Directory.pickDirectoryAsync();
  } catch {
    return 'canceled'; // picker throws when the user backs out
  }
  await dir.createFile(name, 'application/json').write(text);
  return 'saved';
}

// Any file type is allowed: Android often labels .json files as generic binaries; content is validated after.
export async function pickText(): Promise<string | null> {
  const picked = await File.pickFileAsync();
  return picked.canceled ? null : picked.result.text();
}
