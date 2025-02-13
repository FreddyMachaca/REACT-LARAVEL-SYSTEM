import { useState } from "react";
import { FileUpload } from "primereact/fileupload";
import axios from "axios";

const UploadIcon = ({ onUpload }) => {
    const [imageUrl, setImageUrl] = useState(null);

    const handleUpload = async (event) => {
        const file = event.files[0];
        const formData = new FormData();
        formData.append("icon", file);

        try {
            const apiEndpoint = `${process.env.REACT_APP_API_PATH}upload-icon`;
            const response = await axios.post(apiEndpoint, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setImageUrl(response.data.url);
            if (onUpload) onUpload(response.data.url);
        } catch (error) {
            console.error("Error subiendo la imagen:", error);
        }
    };

    return (
        <div>
            <FileUpload 
                name="icon" 
                customUpload 
                uploadHandler={handleUpload} 
                accept="image/*" 
                maxFileSize={2000000} 
            />
            {imageUrl && <img src={imageUrl} alt="Icono" width={100} />}
        </div>
    );
};

export default UploadIcon;
