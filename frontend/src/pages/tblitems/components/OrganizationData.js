export const initialOrganizationData = [
    {
        id: 1,
        title: "Directorio",
        children: [
            {
                id: 2,
                title: "Gerencia General",
                children: [
                    {
                        id: 3,
                        title: "Departamento de RRHH",
                        children: []
                    },
                    {
                        id: 4,
                        title: "Departamento de Finanzas",
                        children: []
                    }
                ]
            }
        ]
    }
];

export const itemDetails = {
    1: {
        id: 1,
        title: "Directorio",
        categoriaPragmatica: "Estratégica",
        categoriaAdministrativa: "Dirección",
        tieneContrato: false,
    },
    2: {
        id: 2,
        title: "Gerencia General",
        categoriaPragmatica: "Táctica",
        categoriaAdministrativa: "Gerencia",
        tieneContrato: false,
    },
    3: {
        id: 3,
        title: "Departamento de RRHH",
        categoriaPragmatica: "Operativa",
        categoriaAdministrativa: "Departamento",
        tieneContrato: true,
    },
    4: {
        id: 4,
        title: "Departamento de Finanzas",
        categoriaPragmatica: "Operativa",
        categoriaAdministrativa: "Departamento",
        tieneContrato: false,
    }
};

export const initialContratos = [
    {
        id: 1001,
        itemId: 3,
        codigo_item: "RRHH-001",
        cargo: "Director de Recursos Humanos",
        haber_basico: 12000,
        unidad_organizacional: "Administración",
        tiempoJornada: "Completa",
        cantidad: 1,
        fecha_creacion: "2023-01-15T12:00:00.000Z"
    }
];
