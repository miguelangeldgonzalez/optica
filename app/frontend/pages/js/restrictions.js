const DOT = 46;
const HYPHEN = 45;
const WHITE_SPACE = 32;
const LETTER_GN = [209, 241];
const ACCENTS = [160, 130, 161, 162, 163, 181, 144, 214, 224, 223]

const onlyIntegerNumbers = (e => (e.charCode >= 48 && e.charCode <= 57));
const onlyIntegersAndDecimalNumbers = e => (onlyIntegerNumbers(e) || e.charCode == DOT);
const onlyDecimalAndPositiveNumbers = e => (onlyIntegersAndDecimalNumbers(e) && e.charCode != HYPHEN);

const onlyLetters = e => ((e.charCode >= 65 && e.charCode <= 90) || (e.charCode >= 97 && e.charCode <= 122) || ACCENTS.concat(WHITE_SPACE, LETTER_GN).includes(e.charCode));

export const restrictors = {
    ONLY_INTEGERS_AND_DECIMAL_NUMBERS: {
        name: 'only_integers_and_decimal_numbers',
        function: onlyIntegersAndDecimalNumbers
    },
    ONLY_INTEGER_NUMBERS: {
        name: 'only_integer_numbers',
        function: onlyIntegerNumbers
    },
    ONLY_DECIMAL_AND_POSITIVE_NUMBERS: {
        name: 'only_decimal_and_positive_numbers',
        function: onlyDecimalAndPositiveNumbers
    },
    ONLY_LETTERS: {
        name: 'only_letters',
        function: onlyLetters
    }
}

export function loadRestrictions() {
    let query = '';
    const last = Object.entries(restrictors).at(-1)[0];

    for (const r in restrictors){
        if (r == last) {
            query += `.${restrictors[r].name}`
        } else {
            query += `.${restrictors[r].name}, `
        }
    }

    document.querySelectorAll(query).forEach(i => {
        for (const r in restrictors) {
            if (i.classList.contains(restrictors[r].name)) {
                i.onkeypress = restrictors[r].function;
            }
        }
    })
}
