export function formDataToObject(formData) {
    const object = {};

    for(const entri of formData.entries()) {
        object[entri[0]] = entri[1];
    }

    return object;
}

