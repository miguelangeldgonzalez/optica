import Header from "../../components/header/header.js";
import UserController from "../../../backend/controllers/user.controller.js";
import VentasController from "../../../backend/controllers/ventas.controller.js";

import getCurrency from "../../../utilities/currency.js";

import SaleCard from "../../components/saleCard/saleCard.js";
import crons from "../../../utilities/cron.js";

export default class PanelPrincipal extends Init{
    constructor() {
        super()
    }

    async loadChart() {
        const canva = document.querySelector('#pie-chart');
        
        new Chart(canva, {
            type: 'pie',
            data: {
                labels: ['A', 'B'],
                datasets: [
                    {
                        label: 'Dataset 1',
                        data: [4, 8],
                        //borderColor: '#36A2EB',
                        backgroundColor: ['#520365', '#9d05c3', '#f8df4c']
                    }
                ]
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                size: 16
                            }
                        } 
                    }
                }
            //   scales: {
            //     y: {
            //       beginAtZero: true
            //     }
            //   }
            }
          });
    }

    async load() {
        this.user = await UserController.recoverSession();
        if (Array.isArray(this.user)) window.location = '/';

        const header = await new Header(this).loadComponent();
        document.querySelector('main').before(header.component.shadowRoot);
        header.afterLoad();
        //this.loadChart();
    }

    async afterLoad() {
        crons()
        this.ventas = await VentasController.getSalesResume();
        const main = document.querySelector('.panel__sales');
        let bsPrice = await getCurrency();
        
        if (this.ventas.length > 0)  {
            for (const v of this.ventas) {
                const saleCard = await new SaleCard({
                    ...v,
                    bsPrice
                }).loadComponent()
                
                main.append(saleCard.component.shadowRoot);
            }
        } else {
            alert("Aún no se ha agregado ninguna venta");
        }
    }

    async beforeLoad() {
        
    }
}