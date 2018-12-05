export async function DirExistsMethod (path, fs) {
    let exist;
    try {
        exist = await fs.exists(this.dir);
    } catch (e) {
        exist = true;
    }
    return exist;
}

