import {IFile} from '../interfaces/file.interface';

export function getFilesTree(files: IFile[]) {
    const tree = [];
    files.forEach((file: IFile) => {
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
                    let folder: IFile = parentFolder.filter(f => (f.type === 'directory' && f.name === aFile))[0];
                    if (!folder) {
                        folder = {
                            id: aFile,
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
                    Object.assign(file, {
                        type: 'file',
                        name: aFile,
                        active: false,
                    });
                    parentFolder.push(file);
                }
            });
        }
    });
    return tree;
}
