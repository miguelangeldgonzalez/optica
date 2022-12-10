export function formTransform(req, res) {
    if (req instanceof FormData) return FormData.extract(req);
}