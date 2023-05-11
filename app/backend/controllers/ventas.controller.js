import Test from './test.js';

export default class VentasController {
    static async create(data) {
        let clientePagadorId = null
        

        if (!data.data_cliente.cliente_id) {
            const result = globalThis.models.clientes.create({
                ...data.data_cliente
            })
            clientePagadorId = result.cliente_id;
        } else {
            clientePagadorId = data.data_cliente.cliente_id;
        }

        const venta = globalThis.models.ventas.create({
            cliente_id: clientePagadorId
        })

        if (!Object.isEmpty(data.commonItem)) {
            for (const i in data.commonItem) {
                globalThis.models.ventas_productos.create({
                    venta_id: venta.venta_id,
                    producto_id: data.commonItem[i].producto_id,
                    precio: data.commonItem[i].precio
                })
            }
        }


        if (!Object.isEmpty(data.glassesItem)) {
            for (const g in data.glassesItem) {
                const lente = globalThis.models.lentes.create({
                    venta_id: venta.venta_id
                });

                for (const i in data.glassesItem[g]) {
                    globalThis.models.parte_lentes.create({
                        lente_id: lente.lente_id,
                        producto_id: data.glassesItem[g][i].producto_id,
                    })
                }
            }
        }

        if (!data.data_cliente?.formula?.formula_id && data.data_cliente.formula) {
            await globalThis.models.formulas.create({
                ...data.data_cliente.formula,
                cliente_id: clientePagadorId
            });
        }

        if(Array.isArray(data.clientes)) {
            data.clientes.forEach(async c => {
                let cliente_id = null
                
                if (!c.cliente_id) {
                    const result = await globalThis.models.clientes.create({
                        ...c
                    })
                    cliente_id = result.cliente_id;
                } else {
                    cliente_id = c.cliente_id;
                }
                
                if (c.formula) {
                    await globalThis.models.formulas.create({
                        ...data.data_cliente.formula,
                        cliente_id
                    });
                }
            })
        }

        globalThis.models.pagos.create({
            ...data.payment,
            venta_id: venta.venta_id
        })

        return true;
    }
}