export function formTransformObject(req) {
    if (req instanceof FormData) return {
        ...FormData.extractFromObject(req),
        editRequest: true
    } 
}

/**
 * 
 * @param element Identificador HTML, por ejemplo, "#form"
 * @returns Object
 */

export function formTransformElement(element) {
    try {
        return {
            ...FormData.extractFromElement(element),
        }
    } catch(e) {
        throw new Error(`No se pudo obtener el FormData del elemento ${req.element}`);
    }
}