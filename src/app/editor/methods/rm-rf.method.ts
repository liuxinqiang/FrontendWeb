import {DirExistsMethod} from './dir-exists.method';

export async function ForceDeleteForlder(path, fs) {
    const exist = await DirExistsMethod(path, fs);
    if (exist) {
        const files = await fs.readdir(path);
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const curPath = path + '/' + file;
            const state = await fs.stat(curPath);
            if (state.isDirectory()) {
                await ForceDeleteForlder(curPath, fs);
            } else {
                await fs.unlink(curPath);
            }
        }
        await fs.rmdir(path);
    }
}
