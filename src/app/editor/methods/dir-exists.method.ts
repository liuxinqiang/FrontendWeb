export async function DirExistsMethod (path, fs) {
    let exist;
    try {
        exist = await fs.exists(path);
    } catch (e) {
        exist = true;
    }
    return exist;
}

