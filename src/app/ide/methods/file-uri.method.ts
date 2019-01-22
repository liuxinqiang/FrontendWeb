export function getFileUriMethod(fileId) {
    return monaco.Uri.parse('file://' + fileId);
}
