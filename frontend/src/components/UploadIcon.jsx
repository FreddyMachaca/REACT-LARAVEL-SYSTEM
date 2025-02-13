import { useState, useRef } from "react";
import { FileUpload } from "primereact/fileupload";
import { Toast } from 'primereact/toast';
import axios from "axios";

const UploadIcon = ({ onUpload }) => {
    const [imageUrl, setImageUrl] = useState(null);
    const toast = useRef(null);

    const customBase64Uploader = async (event) => {
        try {
            // Validaciones de seguridad
            if (!event.files || !event.files[0]) {
                toast.current.show({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: 'No se seleccionó ningún archivo' 
                });
                return;
            }

            const file = event.files[0];
            
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                toast.current.show({ 
                    severity: 'error', 
                    summary: 'Error', 
                    detail: 'Solo se permiten archivos de imagen' 
                });
                return;
            }

            const formData = new FormData();
            formData.append("icon", file);

            const apiEndpoint = `${process.env.REACT_APP_API_PATH}upload-icon`;
            const response = await axios.post(apiEndpoint, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data && response.data.url) {
                setImageUrl(response.data.url);
                if (onUpload) onUpload(response.data.url);
                toast.current.show({ 
                    severity: 'success', 
                    summary: 'Éxito', 
                    detail: 'Imagen subida correctamente' 
                });
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.current.show({ 
                severity: 'error', 
                summary: 'Error', 
                detail: 'Error al subir la imagen' 
            });
        }
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <FileUpload
                mode="basic"
                name="icon"
                accept="image/*"
                maxFileSize={1000000}
                customUpload
                uploadHandler={customBase64Uploader}
                auto
                chooseLabel="Seleccionar Icono"
            />
            {imageUrl && (
                <div className="mt-3">
                    <img src={imageUrl} alt="Icono cargado" style={{ width: '50px', height: '50px' }} />
                </div>
            )}
        </div>
    );
};

export default UploadIcon;
