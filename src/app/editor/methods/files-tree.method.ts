import {ITreeNode} from '../interfaces/panel.interface';

export function GetFilesTreeMethod(files, dir) {
    const result: ITreeNode[] = [];
    files.forEach(file => {
        const filePaths = file.split('/');
        let parentNode = result;
        let pathPrefix = dir + '/';
        for (let i = 0; i < filePaths.length; i++) {
            const currentFilePath = filePaths[i];
            const fileNode: ITreeNode = {
                file: currentFilePath,
                url: `file://local/${pathPrefix + currentFilePath}`,
                path: pathPrefix + currentFilePath,
                ext: file.substr(file.lastIndexOf('.') + 1),
                isDirectory: false,
                active: false,
                opened: false,
                children: [],
            };
            if (i === filePaths.length - 1) {
                parentNode.push(fileNode);
            } else {
                const findParentNode = parentNode.filter((subFile: ITreeNode) => {
                    return subFile.file === currentFilePath && subFile.isDirectory;
                })[0];
                if (!findParentNode) {
                    fileNode.isDirectory = true;
                    fileNode.ext = currentFilePath;
                    parentNode.push(fileNode);
                    parentNode = fileNode.children;
                } else {
                    parentNode = findParentNode.children;
                }
                pathPrefix +=  currentFilePath + '/';
            }
        }
    });
    return result;
}