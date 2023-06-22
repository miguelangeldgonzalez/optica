import getCurrency from "./currency.js";

export default async function crons() {
    let dateLastPrice = localStorage.getItem('lastCurrencyUpdate');

    if (!dateLastPrice) {
       const date = new Date();
       localStorage.setItem('lastCurrencyUpdate', date);
    } else {
        const differenceInDays = Math.floor((new Date() - dateLastPrice) / (1000 * 60 * 60 * 24));

        if (differenceInDays >= 1) {
            await getCurrency();
            const date = new Date();
            localStorage.setItem('lastCurrencyUpdate', date);
        }
    }


    let lastBackup = localStorage.getItem('lastBackup');
    if(!lastBackup) {
       const date = new Date();
       localStorage.setItem('lastBackup', date);
       await fetch('./app/backend/db/php/respaldo.php', {
        method: 'GET'
    }).then(data => data.text());
    } else {
        const differenceInDays = Math.floor((new Date() - lastBackup) / (1000 * 60 * 60 * 24));

        if (differenceInDays >= 7) {
            await fetch('./app/backend/db/php/respaldo.php', {
                method: 'GET'
            }).then(data => data.text());
            const date = new Date();
            localStorage.setItem('lastBackup', date);
        }
    }

}