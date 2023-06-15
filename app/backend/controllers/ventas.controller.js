export default class VentasController {
    static async create(data) {
        console.log(data);
        let clientePagadorId = null

        if (!data.data_cliente.cliente_id) {
            const result = await globalThis.models.clientes.create({
                ...data.data_cliente
            })

            console.log(result);
            clientePagadorId = result.cliente_id;
        } else {
            clientePagadorId = data.data_cliente.cliente_id;
        }

        const venta = await globalThis.models.ventas.create({
            cliente_id: clientePagadorId
        })

        if (!Object.isEmpty(data.commonItem)) {
            for (const i in data.commonItem) {
                let estado_id = 2;
                if(data.commonItem[i].producto_id == 1) estado_id = 1;
                console.log({
                    estado_id
                })

                globalThis.models.ventas_productos.create({
                    venta_id: venta.venta_id,
                    producto_id: data.commonItem[i].producto_id,
                    precio: data.commonItem[i].precio,
                    estado_id
                })
            }
        }

        const e = await globalThis.models.estados.findAll({
            where: {
                por_defecto: true
            }
        })

        if (!Object.isEmpty(data.glassesItem)) {
            for (const g in data.glassesItem) {
                const lente = await globalThis.models.lentes.create({
                    venta_id: venta.venta_id,
                    estado_id: 2
                });

                for (const i in data.glassesItem[g]) {
                    let estado_id = 2;
                    if (data.glassesItem[g][i].producto_id == 1)  estado_id = 1

                    globalThis.models.parte_lentes.create({
                        lente_id: lente.lente_id,
                        producto_id: data.glassesItem[g][i].producto_id,
                        precio: data.glassesItem[g][i].precio,
                        estado_id
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

    static async getSalesResume(params) {
        let where = {};

        if (params?.venta_id) where.venta_id = params.venta_id;
        if (params?.cliente_id) where.cliente_id = params.cliente_id;

        const result = await globalThis.models.ventas.findAll({
            where,
            include: [
                new globalThis.Association(
                    globalThis.models.clientes,
                    {
                        as: 'cliente'
                    }
                ),
                new globalThis.Association(
                    globalThis.models.lentes,
                    {
                        as: 'lentes',
                        type: 'ONE_TO_MANY',
                        weakEntity: true,
                        include: [
                            new globalThis.Association(
                                globalThis.models.estados,
                                {
                                    as: 'estado'
                                }
                            ),
                            new globalThis.Association(
                                globalThis.models.parte_lentes,
                                {
                                    weakEntity: true,
                                    type: 'ONE_TO_MANY',
                                    include: [
                                        new globalThis.Association(
                                            globalThis.models.productos,
                                            {
                                                as: 'producto'
                                            }
                                        ),
                                        new globalThis.Association(
                                            globalThis.models.estados,
                                            {
                                                as: 'estado'
                                            }
                                        )
                                    ]
                                }
                            )
                        ]
                    }
                ),
                new globalThis.Association(
                    globalThis.models.pagos,
                    {
                        as: 'pagos',
                        type: 'ONE_TO_MANY',
                        weakEntity: true
                    }
                ),
                new globalThis.Association(
                    globalThis.models.ventas_productos,
                    {
                        weakEntity: true,
                        type: 'ONE_TO_MANY',
                        include: [
                            new globalThis.Association(
                                globalThis.models.productos,
                                {
                                    as: 'producto'
                                }
                            ),
                            new globalThis.Association(
                                globalThis.models.estados,
                                {
                                    as: 'estado'
                                }
                            )
                        ]
                    }
                )
            ],
            order: {
                columns: ['fecha'],
                desc: true
            }
        });
        
        for (const r of result) {
            //Set Total
            let total = 0;
            if (Array.isArray(r.ventas_productos)) {
                r.ventas_productos.forEach(p => total += p.precio);
            }

            if (Array.isArray(r.lentes)) {
                r.lentes.forEach(l => {
                    if(Array.isArray(l.parte_lentes)) l.parte_lentes.forEach(pl => total += pl.precio)
                });
            }

            //Search at least one pending
            let estado_id = 2;
            if(r.ventas_productos.length >= 1) {
                for(const vp of r.ventas_productos) {
                    if(vp.estado?.estado_id == 1) {
                        estado_id = 1;
                        break;
                    }

                }
            }

            if (r.lentes.length >= 1 && estado_id != 2) {
                for (const l of r.lentes) {
                    let stop = false;

                    for(const pl of l.parte_lentes) {
                        if(pl.estado?.estado_id == 1) {
                            estado_id = 1;
                            stop = true;
                            break;
                        }
                    }

                    if(stop) break;
                }
            }

            const estado_global = await globalThis.models.estados.findByPk(estado_id)

            r.estado_global = estado_global[0]
            r.total = total;
        }

        return result;
    }

    static async getStats() {
        
    }
}