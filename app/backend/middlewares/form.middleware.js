export function formTransformObject(req) {
    if (req instanceof FormData) return {
        ...FormData.extractFromObject(req),
        editRequest: true
    } 
}

export function formTransformElement(req) {
    if (req.element) try {
        return {
            body: {
                ...FormData.extractFromElement(req.element),
            },
            editRequest: true
        }
    } catch(e) {
        throw new Error(`No se pudo obtener el FormData del elemento ${req.element}`);
    }
}