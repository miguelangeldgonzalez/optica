export default async function getCurrency () {
    let bsPrice = localStorage.getItem('bsPrice');

    if(!bsPrice) {
        const apiKey = await globalThis.models.configuraciones.findAll({
            where: {
                name: 'API_KEY'
            }
        });


        if (apiKey[0].value) {
            const price = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey[0].value}/pair/USD/VES`,{
                method: 'GET'
            })
            .then(data => data.json())
            .catch(err => alert('La llave para obtener el precio en bolivares no funciona por favor, vuelva a configurarla'))
            if(price?.conversion_rate){
                bsPrice = price.conversion_rate; 
                localStorage.setItem('bsPrice',  bsPrice);
            }
        }
    }

    return bsPrice
}