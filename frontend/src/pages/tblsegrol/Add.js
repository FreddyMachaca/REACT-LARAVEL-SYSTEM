import React, { useState, useEffect } from "react";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column as DTColumn } from "primereact/column";
import useApi from "hooks/useApi";

let jsonData = {};


const transformToTreeNodes = (obj, parentKey = "") => {
  return Object.entries(obj).map(([key, value], index) => {
    const nodeKey = parentKey ? `${parentKey}-${index + 1}` : `${index + 1}`;
    const [id, text, icon, checked] = key.split("|");
    const position = nodeKey.split("-").length - 1;

	  const isChecked = checked === '1' ? true : false;

    if (typeof value === "object" && value !== null) {
      return {
        key: id,
        data: { name: text, icon: icon, checked: isChecked },
        children: transformToTreeNodes(value, id),
      };
    }

    return {
      key: id,
      data: { name: text, icon: icon, checked: isChecked },
    };
  });
};

const TblsegrolAddPage = () => {
  const api = useApi();
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [nodes, setNodes] = useState(transformToTreeNodes(jsonData));
  //const [selectedNodes, setSelectedNodes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayDialog, setDisplayDialog] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState({});
  // Cargar los datos de la tabla tbl_seg_menu desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/menu-tree");
        if (response.data && Array.isArray(response.data)) {
          setNodes(response.data);
        } else {
          console.error("La respuesta de la API no es un array:", response.data);
          setError("Formato de datos inválido");
        }
      } catch (err) {
        console.error("Error al obtener los datos:", err);
        setError("Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cargar los perfiles de tblsegrol cuando se abre el diálogo
  useEffect(() => {
    if (displayDialog) {
      const fetchProfiles = async () => {
        try {
          const response = await api.get("/tblsegrol/all");
          if (response.data && Array.isArray(response.data)) {
            setProfiles(response.data);
          } else {
            console.error("La respuesta de la API no es un array:", response.data);
            setError("Formato de datos inválido");
          }
        } catch (err) {
          console.error("Error al obtener los perfiles:", err);
          setError("Error al cargar los perfiles");
        }
      };

      fetchProfiles();
    }
  }, [displayDialog]);

  // Cargar el árbol de menús cuando cambia el código
  
/**** */
 useEffect(() => {
    if (!codigo) return;
    api.get(`/rol/${codigo}`).then((response) => {
      jsonData = response.data;
      console.log("Respuesta de la API:", jsonData); // Verifica la respuesta
      const nodes = transformToTreeNodes(jsonData);
      console.log("Datos transformados:", nodes); 
      const initialSelection = {};
      const buildSelectionKeys = (nodes) => {
        nodes.forEach((node) => {
          if(node.data.checked){
            initialSelection[node.key] = { checked: true };
          }
          if(node.children){
            buildSelectionKeys(node.children);
          }
        });
      };
      buildSelectionKeys(nodes);
    
      setNodes(nodes);
      setSelectedNodes(initialSelection);
    });

        // Obtener los datos del rol desde tblsegrol
        api.get(`/tblsegrol/${codigo}`).then((response) => {
        const rolData = response.data;
        console.log("Respuesta de la API (tblsegrol):", rolData); // Verifica la respuesta

        // Actualizar el campo de texto "nombre" con el valor obtenido
        if (rolData.success && rolData.data && rolData.data.nombre) {
          setNombre(rolData.data.nombre); // Acceder a rolData.data.nombre
          setDescripcion(rolData.data.nombre);
        } else {
          console.error("No se encontró el nombre del rol en la respuesta:", rolData);
        }
      }).catch((err) => {
        console.error("Error al obtener los datos del rol:", err);
        setError("Error al cargar los datos del rol");
      });

  }, [codigo]);
/******* */
  // Manejar cambios en la selección de nodos
  const onSelectionChange = (e) => {
    
    const selectedKeys = Object.keys(e.value).filter(
      (key) => e.value[key].checked === true
    );
    //setSelection(e.value);
    setSelectedNodes(e.value);
    console.log(selectedKeys);

  };
  // Función para manejar el guardado o actualización
  const handleSaveOrUpdate = async () => {
    try {
      const payload = {
        codigo,
        nombre,
        selectedNodes: Object.keys(selectedNodes),
      };
  
      console.log("Payload enviado:", payload); // Verifica el payload
  
      let response;
      if (codigo) {
        response = await api.put(`/tblsegrol/edit/${codigo}`, payload);
      } else {
        response = await api.post("/tblsegrol/add", payload);
      }
  
      console.log("Respuesta del servidor:", response.data); // Verifica la respuesta
  
      setCodigo("");
      setNombre("");
      setDescripcion("");
      setSelectedNodes({});
  
      const menuTreeResponse = await api.get("/menu-tree");
      setNodes(menuTreeResponse.data);
    } catch (err) {
      console.error("Error al guardar/actualizar:", err);
      setError("Error al guardar/actualizar los datos");
    }
  };
  // Función para manejar la eliminación
  const handleDelete = async () => {
    try {
      if (codigo) {
        await api.delete(`/tblsegrol/${codigo}`);

        setCodigo("");
        setNombre("");
        setDescripcion("");
        setSelectedNodes({});

        const response = await api.get("/menu-tree");
        setNodes(response.data);
      } else {
        setError("No se puede eliminar sin un código de rol");
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
      setError("Error al eliminar los datos");
    }
  };

  // Función para abrir el diálogo de búsqueda
  const openSearchDialog = () => {
    setDisplayDialog(true);
  };

  // Función para cerrar el diálogo de búsqueda
  const closeSearchDialog = () => {
    setDisplayDialog(false);
  };

  // Función para manejar la selección de un perfil
  const handleProfileSelection = () => {
    if (selectedProfile) {
      setCodigo(selectedProfile.codigo);
      setNombre(selectedProfile.nombre);
      setDescripcion(selectedProfile.descripcion);
      closeSearchDialog();
    } else {
      setError("Debe seleccionar un perfil");
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      {/* Cajas de texto para código, nombre y descripción */}
      <div className="mb-4">
        <div className="flex align-items-center mb-3">
          <label htmlFor="codigo" className="w-6rem font-bold">
            Código:
          </label>
          <InputText
            id="codigo"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Ingrese el código"
            className="p-inputtext-sm"
            style={{ width: '150px', height: '35px' }}
          />
          <Button
            icon="pi pi-search"
            className="p-button-secondary ml-2"
            onClick={openSearchDialog}
          />
        </div>
        <div className="flex align-items-center mb-3">
          <label htmlFor="nombre" className="w-6rem font-bold">
            Nombre:
          </label>
          <InputText
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingrese el nombre"
            className="p-inputtext-sm"
            style={{ width: '250px', height: '35px' }}
          />
        </div>
        <div className="flex align-items-center mb-3">
          <label htmlFor="descripcion" className="w-6rem font-bold">
            Descripción:
          </label>
          <InputText
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Ingrese la descripción"
            className="p-inputtext-sm space-x-4"
            style={{ width: '350px', height: '35px' }}
          />
        </div>
      </div>

      {/* TreeTable para mostrar el árbol de menús */}
      <div className="card p-3 border-1 border-300 border-round w-6" style={{ backgroundColor: "transparent" }}>
        <div className="text-lg font-bold mb-3">Detalle del perfil</div>
        <TreeTable
            value={nodes}
            selectionMode="checkbox"
            selectionKeys={selectedNodes}
            onSelectionChange={onSelectionChange}
          >
            <Column
              field="name"
               body={(rowData) => (
                <>
                  <i
                    style={{ color: rowData.data.color }}
                    className={rowData.data.icon}
                  ></i>
                  &nbsp;<span>{rowData.data.name}</span>
                </>
              )}
              expander
            ></Column>
          </TreeTable>
      </div>

      {/* Botones para guardar/actualizar y eliminar */}
      <div className="flex justify-start mt-4">
        <Button
          label="Actualizar"
          icon="pi pi-check"
          className="p-button-success mr-2"
          onClick={handleSaveOrUpdate}
        />
        <Button
          label="Eliminar"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={handleDelete}
        />
      </div>

      {/* Diálogo de búsqueda */}
      <Dialog
        header="Buscar Perfiles"
        visible={displayDialog}
        style={{ width: '50vw' }}
        onHide={closeSearchDialog}
      >
        <div>
          {/* DataTable para mostrar los perfiles */}
          <DataTable
            value={profiles}
            selectionMode="single"
            selection={selectedProfile}
            onSelectionChange={(e) => setSelectedProfile(e.value)}
            dataKey="codigo"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} perfiles"
          >
            <DTColumn field="rol_id" header="Código" sortable></DTColumn>
            <DTColumn field="rol_descripcion" header="Nombre" sortable></DTColumn>
          </DataTable>

          {/* Botón para seleccionar el perfil */}
          <Button
            label="Seleccionar"
            icon="pi pi-check"
            className="p-button-success mt-3"
            onClick={handleProfileSelection}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default TblsegrolAddPage;