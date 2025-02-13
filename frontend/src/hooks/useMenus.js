import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useMenus() {
    const [dynamicMenus, setDynamicMenus] = useState([]);

    // Menús estáticos que siempre deben estar presentes
    const staticMenus = [
        {
            "to": "/home",
            "label": "Home",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblacreedores",
            "label": "Tbl Acreedores",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblareaformacion",
            "label": "Tbl Area Formacion",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblaudit",
            "label": "Tbl Audit",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblbsegs",
            "label": "Tbl Bs Egs",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblcarreras",
            "label": "Tbl Carreras",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblcatalogo",
            "label": "Tbl Catalogo",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblcategorialicencias",
            "label": "Tbl Categoria Licencias",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblempleador",
            "label": "Tbl Empleador",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblfichaatencion",
            "label": "Tbl Fichaatencion",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblglosa",
            "label": "Tbl Glosa",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblgradoacademico",
            "label": "Tbl Grado Academico",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblhistorico",
            "label": "Tbl Historico",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblidioma",
            "label": "Tbl Idioma",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblinstituciones",
            "label": "Tbl Instituciones",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblmabonoantiguedadescala",
            "label": "Tbl Ma Bono Antiguedad Escala",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblperiodo",
            "label": "Tbl Periodo",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblpruebacarrerasinstituto",
            "label": "Tbl Prueba Carreras Instituto",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblpruebagradocarrera",
            "label": "Tbl Prueba Grado Carrera",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblpruebagradoinstitucion",
            "label": "Tbl Prueba Grado Institucion",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblpruebainstituciomcarrera",
            "label": "Tbl Prueba Instituciom Carrera",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblrango",
            "label": "Tbl Rango",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblrequisitoformacion",
            "label": "Tbl Requisito Formacion",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblsegmenu",
            "label": "Tbl Seg Menu",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblsegmenuusuario",
            "label": "Tbl Seg Menu Usuario",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblsegrol",
            "label": "Tbl Seg Rol",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblsegrolmenu",
            "label": "Tbl Seg Rol Menu",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblsegusuario",
            "label": "Tbl Seg Usuario",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tblsegusuariorol",
            "label": "Tbl Seg Usuario Rol",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        },
        {
            "to": "/tbltipoeventoacademico",
            "label": "Tbl Tipoevento Academico",
            "icon": "pi pi-th-large",
            "iconcolor": "",
            "target": "",
        }
    ];

    useEffect(() => {
        loadMenuItems();
    }, []);

    const loadMenuItems = async () => {
        try {
            const response = await axios.get('/tblsegmenu/getMenuTree');
            const rawData = response.data?.data || response.data || [];
            console.log('Datos crudos en useMenus:', rawData);
            
            // Si la respuesta ya tiene "children", asume que es un árbol
            const hierarchicalData = (rawData.length && rawData[0].children !== undefined)
                  ? rawData
                  : buildMenuTree(rawData);
            console.log('Datos jerárquicos:', hierarchicalData);
            
            const menuItems = transformMenuData(hierarchicalData);
            console.log('Menús dinámicos cargados:', menuItems);
            
            setDynamicMenus(menuItems);
        } catch (error) {
            console.error('Error loading dynamic menu:', error);
            setDynamicMenus([]); // En caso de error, dejamos los dinámicos vacíos
        }
    };

    const buildMenuTree = (items) => {
        const itemMap = {};
        const roots = [];

        // Mapear todos los items por ID
        items.forEach(item => {
            itemMap[item.me_id] = { ...item, children: [] };
        });

        // Construir jerarquía
        items.forEach(item => {
            if (item.me_id_padre && itemMap[item.me_id_padre]) {
                itemMap[item.me_id_padre].children.push(itemMap[item.me_id]);
            } else {
                roots.push(itemMap[item.me_id]);
            }
        });

        return roots;
    };

    const transformMenuData = (menuData) => {
        const transformNode = (node) => {
            if (node.me_estado !== 'V') { // filtrar registros inactivos
                return null;
            }
            return {
                label: node.me_descripcion,
                icon: node.me_icono || 'pi pi-fw pi-folder',
                to: node.me_url && node.me_url !== '#' ? node.me_url : undefined,
                expanded: false,
                items: node.children ? node.children.map(transformNode).filter(Boolean) : undefined
            };
        };
        return menuData.map(transformNode).filter(Boolean);
    };

    // Combinar menús estáticos y dinámicos en el return
    const combinedMenus = [...staticMenus, ...dynamicMenus];

    return {
        navbarTopRight: [],
        navbarTopLeft: [],
        navbarSideLeft: combinedMenus,
        exportFormats: {
            print: {
                label: 'Print',
                icon: 'pi pi-print',
                type: 'print',
                ext: '',
            },
            pdf: {
                label: 'Pdf',
                icon: 'pi pi-file-pdf',
                type: 'pdf',
                ext: 'pdf',
            },
            excel: {
                label: 'Excel',
                icon: 'pi pi-file-excel',
                type: 'excel',
                ext: 'xlsx',
            },
            csv: {
                label: 'Csv',
                icon: 'pi pi-table',
                type: 'csv',
                ext: 'csv',
            },
        },
    };
}