import { access, readFile } from "fs/promises";

export async function accessReadFile(filePath: string) {
    try {
        await access(filePath);
    } catch (err) {
        return undefined;
    }

    return await readFile(filePath, { encoding: 'utf-8' });
}
