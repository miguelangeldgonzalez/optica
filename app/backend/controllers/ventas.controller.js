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

                const { ventas_productos_id } = await globalThis.models.ventas_productos.create({
                    venta_id: venta.venta_id,
                    producto_id: data.commonItem[i].producto_id,
                    precio: data.commonItem[i].precio,
                    estado_id
                })

                data.commonItem[i].ventas_productos_id = ventas_productos_id;
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

                    const { parte_lentes_id } = await globalThis.models.parte_lentes.create({
                        lente_id: lente.lente_id,
                        producto_id: data.glassesItem[g][i].producto_id,
                        precio: data.glassesItem[g][i].precio,
                        estado_id
                    })

                    data.glassesItem[g][i].parte_lentes_id = parte_lentes_id;
                }
            }
        }

        let formula_cliente_id;

        if (!data.data_cliente?.formula?.formula_id && data.data_cliente.formula) {
            const formula = await globalThis.models.formulas.create({
                ...data.data_cliente.formula,
                cliente_id: clientePagadorId
            });

            formula_cliente_id = formula.formula_id;
        } else if (data.data_cliente?.formula?.formula_id) {
            formula_cliente_id = data.data_cliente?.formula?.formula_id
        }

        if (formula_cliente_id && Array.isArray(data.data_cliente?.formula?.usedIn)) {
            for (const item of data.data_cliente.formula.usedIn) {
                switch (item.type) {
                    case 'common':
                        await globalThis.models.partes_formulas.create({
                            formula_id: formula_cliente_id,
                            ventas_productos_id: data.commonItem[item.id].ventas_productos_id
                        })
                        break;
                    case 'glasses':
                        await globalThis.models.partes_formulas.create({
                            formula_id: formula_cliente_id,
                            parte_lentes_id: data.glassesItem[item.glasses_id][item.item_id].parte_lentes_id
                        })
                }
            }
        }

        if(Array.isArray(data.clientes)) {
            for (const c of data.clientes) {
                let cliente_id = null
                
                if (!c.cliente_id) {
                    const result = await globalThis.models.clientes.create({
                        ...c
                    })
                    cliente_id = result.cliente_id;
                } else {
                    cliente_id = c.cliente_id;
                }

                let formula_id;

                if(c.formula?.formula_id) {
                    formula_id = c.formula.formula_id;
                } else {
                    const formula_cliente = await globalThis.models.formulas.create({
                        ...data.data_cliente.formula,
                        cliente_id
                    });

                    formula_id = formula_cliente.formula_id
                }

                
                if (formula_id) {
                    if (Array.isArray(c.formula?.usedIn)) {
                        for (const item of c.formula?.usedIn) {
                            switch (item.type) {
                                case 'common':
                                    await globalThis.models.partes_formulas.create({
                                        formula_id,
                                        ventas_productos_id: data.commonItem[item.id].ventas_productos_id
                                    })
                                    break;
                                case 'glasses':
                                    await globalThis.models.partes_formulas.create({
                                        formula_id,
                                        parte_lentes_id: data.glassesItem[item.glasses_id][item.item_id].parte_lentes_id
                                    })
                            }
                        }
                    }
            
                }
            }
        }

        globalThis.models.pagos.create({
            ...data.payment,
            venta_id: venta.venta_id
        })

        return true;
    }

    static async getSalesResume(params) {
        let where;

        if (params?.cliente_id) where =  'WHERE v.cliente_id = ' + params.cliente_id;
        
        const query = `
        SELECT v.venta_id, v.fecha, c.nombres, e.*,
				#estado_global
                (CASE WHEN estado_ventas_productos.estado_id = 2 AND pl.estado_id = 2 THEN 2
                 WHEN estado_ventas_productos.estado_id IS null AND pl.estado_id = 2 THEN 2
                 WHEN estado_ventas_productos.estado_id = 2 AND pl.estado_id IS null THEN 2
                 ELSE 1
                 END) AS estado_global_id,
                 #total
                 (CASE WHEN vp.precio IS NOT NULL AND pl.precio IS NOT NULL THEN 
                  	(SELECT SUM(precio) FROM ventas_productos WHERE ventas_productos.venta_id = v.venta_id) +
                  	(SELECT SUM(parte_lentes.precio) FROM lentes 
                     	INNER JOIN parte_lentes ON lentes.lente_id = parte_lentes.lente_id
                     WHERE lentes.venta_id = v.venta_id)
                  WHEN vp.precio IS NOT NULL THEN 
                    (SELECT SUM(precio) FROM ventas_productos WHERE ventas_productos.venta_id = v.venta_id)
                  WHEN pl.precio IS NOT NULL THEN 
                  	(SELECT SUM(parte_lentes.precio) FROM lentes 
                     	INNER JOIN parte_lentes ON lentes.lente_id = parte_lentes.lente_id
                     WHERE lentes.venta_id = v.venta_id)
                 END) as total,
                (CASE WHEN SUM(p.cantidad) < SUM(vp.precio) THEN true ELSE false END) AS pago_incompleto
            FROM ventas v 
                INNER JOIN clientes c ON v.cliente_id = c.cliente_id 
                INNER JOIN pagos p ON p.venta_id = v.venta_id
                #ventas_productos Association
                LEFT JOIN ventas_productos vp ON v.venta_id = vp.venta_id 
                LEFT JOIN ventas_productos estado_ventas_productos ON estado_ventas_productos.venta_id = v.venta_id
                #lentes Association
                LEFT JOIN lentes l ON l.venta_id = v.venta_id
                LEFT JOIN parte_lentes pl ON pl.lente_id = l.lente_id
                #estado
                INNER JOIN estados e ON 
                (CASE WHEN estado_ventas_productos.estado_id = 2 AND pl.estado_id = 2 THEN e.estado_id = 2
                 WHEN estado_ventas_productos.estado_id IS null AND pl.estado_id = 2 THEN e.estado_id = 2
                 WHEN estado_ventas_productos.estado_id = 2 AND pl.estado_id IS null THEN e.estado_id = 2
                 ELSE e.estado_id = 1
                 END)
                 ${where || ''}
                 GROUP BY v.venta_id
                 ORDER BY v.fecha DESC`;

        const result = await Model.execQuery(query);

        return result;
    }

    static async getSaleById(params) {
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
} 