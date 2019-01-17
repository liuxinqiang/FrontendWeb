export function getFilesTree(files) {
    const tree = [];
    files.forEach(file => {
        const array = file.id.split('/');
        if (array.length === 1) {
            Object.assign(file, {
                type: 'file',
                name: file.id,
                active: false,
            });
            tree.push(file);
        } else {
            let parentFolder = tree;
            array.forEach((aFile, index) => {
                if (index < (array.length - 1)) {
                    let folder = parentFolder.filter(f => (f.type === 'directory' && f.name === aFile))[0];
                    if (!folder) {
                        folder = {
                            type: 'directory',
                            name: aFile,
                            opened: false,
                            active: false,
                            children: [],
                        };
                        parentFolder.push(folder);
                    }
                    parentFolder = folder.children;
                } else {
                    file.name = aFile;
                    parentFolder.push(file);
                }
            });
        }
    });
    return tree;
}
