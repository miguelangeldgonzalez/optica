const data = {
    data_cliente: {
        prueba: 'asd',
        cedula: "30681332",
        nombres: "Miguelangel",
        fecha_nacimiento: "2023-05-08",
        sexo: "M",
        formula: {
            usedIn: [
                {
                    "type": "common",
                    "id": "0"
                }
            ],
            esferico_ojo_derecho: "12",
            cilindro_ojo_derecho: "12",
            eje_ojo_derecho: "12",
            adicion_ojo_derecho: "12",
            esferico_ojo_izquierdo: "1",
            cilindro_ojo_izquierdo: "2",
            eje_ojo_izquierdo: "12",
            adicion_ojo_izquierdo: "12",
            distancia_pupilar: "2",
            es_progresivo: true
        },
        telefono: "04128745820"
    },
    "clientes": [
        {
            "cedula": "30681332",
            "nombres": "Amaru",
            "fecha_nacimiento": "2023-05-08",
            "sexo": "F",
            "formula": {
                "usedIn": [
                    {
                        "type": "glasses",
                        "glasses_id": "0",
                        "item_id": "0"
                    },
                    {
                        "type": "glasses",
                        "glasses_id": "0",
                        "item_id": "2"
                    }
                ],
                "esferico_ojo_derecho": "12",
                "cilindro_ojo_derecho": "1",
                "eje_ojo_derecho": "21",
                "adicion_ojo_derecho": "2",
                "esferico_ojo_izquierdo": "12",
                "cilindro_ojo_izquierdo": "12",
                "eje_ojo_izquierdo": "12",
                "adicion_ojo_izquierdo": "12",
                "distancia_pupilar": "5",
                "es_progresivo": true
            }
        }
    ],
    "commonItem": {
        "0": {
            "producto_id": "3",
            "necesita_formula": true,
            "precio": 500,
            "nombre": "Consulta"
        }
    },
    "glassesItem": {
        "0": {
            "0": {
                "producto_id": 1,
                "precio": 500,
                "nombre": "Cristales",
                "necesita_formula": "true"
            },
            "1": {
                "producto_id": 2,
                "precio": 500,
                "nombre": "Montura",
                "necesita_formula": null
            },
            "2": {
                "producto_id": 3,
                "precio": 200,
                "nombre": "Consulta",
                "necesita_formula": "true"
            }
        }
    },
    "payment": {
        "cantidad": "25",
        "metodo_pago": "Pago Movil",
        "referencia": ""
    }
}

export default data;