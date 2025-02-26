// Datos iniciales para la estructura organizacional
export const initialOrganizationData = [
    {
        id: 1,
        title: "Dirección General",
        children: [
            {
                id: 2,
                title: "Gerencia de Administración",
                children: [
                    {
                        id: 3,
                        title: "Departamento de Contabilidad",
                        children: []
                    },
                    {
                        id: 4,
                        title: "Departamento de Recursos Humanos",
                        children: []
                    }
                ]
            },
            {
                id: 5,
                title: "Gerencia de Operaciones",
                children: [
                    {
                        id: 6,
                        title: "Departamento de Logística",
                        children: []
                    },
                    {
                        id: 7,
                        title: "Departamento de Producción",
                        children: []
                    }
                ]
            }
        ]
    }
];

// Detalles de los ítems
export const itemDetails = {
    1: {
        id: 1,
        title: "Dirección General",
        categoriaPragmatica: "Estratégica",
        categoriaAdministrativa: "Dirección",
        cargo: "Director/a General",
        tiempoJornada: "Completa",
        cantidad: 1
    },
    2: {
        id: 2,
        title: "Gerencia de Administración",
        categoriaPragmatica: "Táctica",
        categoriaAdministrativa: "Gerencia",
        cargo: "Gerente de Administración",
        tiempoJornada: "Completa",
        cantidad: 1
    },
    3: {
        id: 3,
        title: "Departamento de Contabilidad",
        categoriaPragmatica: "Operativa",
        categoriaAdministrativa: "Departamento",
        cargo: "Jefe/a de Contabilidad",
        tiempoJornada: "Completa",
        cantidad: 1
    },
    4: {
        id: 4,
        title: "Departamento de Recursos Humanos",
        categoriaPragmatica: "Operativa",
        categoriaAdministrativa: "Departamento",
        cargo: "Jefe/a de RRHH",
        tiempoJornada: "Completa",
        cantidad: 1
    },
    5: {
        id: 5,
        title: "Gerencia de Operaciones",
        categoriaPragmatica: "Táctica",
        categoriaAdministrativa: "Gerencia",
        cargo: "Gerente de Operaciones",
        tiempoJornada: "Completa",
        cantidad: 1
    },
    6: {
        id: 6,
        title: "Departamento de Logística",
        categoriaPragmatica: "Operativa",
        categoriaAdministrativa: "Departamento",
        cargo: "Jefe/a de Logística",
        tiempoJornada: "Completa",
        cantidad: 1
    },
    7: {
        id: 7,
        title: "Departamento de Producción",
        categoriaPragmatica: "Operativa",
        categoriaAdministrativa: "Departamento",
        cargo: "Jefe/a de Producción",
        tiempoJornada: "Completa",
        cantidad: 1
    }
};
