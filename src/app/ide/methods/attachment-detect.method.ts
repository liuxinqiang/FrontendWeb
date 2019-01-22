export function attachmentDetectMethod(mime) {
    return mime !== null && (
        [
            'application/zip',
            'application/gzip',
        ].indexOf(mime) >= 0 ||
        !/^(text\/|application\/)/.test(mime)
    );
}
