import { FileInfo } from '../models/interfaces.ts';

const currentWorkingDirectory = Deno.cwd();
const uploadDir = `${currentWorkingDirectory}/upload`;

async function statFile(
  fileName: string,
  rootDir = uploadDir
): Promise<FileInfo | undefined> {
  try {
    const fileInfo = await Deno.stat(`${rootDir}/${fileName}`);

    if (fileInfo.isFile) {
      return {
        name: fileName,
        size: fileInfo.size
      };
    }

    return undefined;
  } catch {
    return undefined;
  }
}

async function writeFile(
  fileName: string,
  byteArray: Uint8Array,
  rootDir = uploadDir
) {
  if (await statFile(fileName)) {
    throw new Error('File Exists');
  }

  await Deno.writeFile(`${rootDir}/${fileName}`, byteArray);
}

async function readFile(fileName: string, rootDir = uploadDir) {
  if (await statFile(fileName)) {
    const byteArray = await Deno.readFile(`${rootDir}/${fileName}`);
    return byteArray;
  }

  throw new Error("File Doesn't Exist");
}

async function removeFile(fileName: string, rootDir = uploadDir) {
  if (await statFile(fileName)) {
    return await Deno.remove(`${rootDir}/${fileName}`);
  }

  throw new Error("File Doesn't Exist");
}

async function readDir(rootDir = uploadDir) {
  let files: FileInfo[] = [];

  for await (const dirEntry of Deno.readDir(rootDir)) {
    const file = await statFile(dirEntry.name);

    if (file) {
      files = [...files, file];
    }
  }

  return files;
}

export { writeFile, readFile, removeFile, readDir };
