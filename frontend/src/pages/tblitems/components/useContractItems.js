import { useState, useEffect, useCallback } from 'react';
import useApi from '../../../hooks/useApi';
import useApp from '../../../hooks/useApp';

const useContractItems = () => {
    const api = useApi();
    const app = useApp();
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);

    const fetchItems = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('tblitem');
            if (response.records) {
                setItems(response.records);
                return response.records;
            }
            return [];
        } catch (error) {
            console.error("Error fetching contract items:", error);
            app.flashMsg("Error", "No se pudieron cargar los ítems de contrato", "error");
            return [];
        } finally {
            setLoading(false);
        }
    }, [api, app]);

    const addItem = useCallback(async (itemData) => {
        setLoading(true);
        try {
            const response = await api.post('tblitem/add', itemData);
            
            if (response.error) {
                throw new Error(response.error);
            }
            
            const savedItem = {
                ...itemData,
                id: response.id || response.record?.id,
                fecha_creacion: response.record?.fecha_creacion || new Date().toISOString()
            };
            
            setItems(prev => [...prev, savedItem]);
            return savedItem;
        } catch (error) {
            console.error("Error adding contract item:", error);
            app.flashMsg("Error", "Error al guardar el ítem de contrato", "error");
            throw error;
        } finally {
            setLoading(false);
        }
    }, [api, app]);

    const updateItem = useCallback(async (id, itemData) => {
        setLoading(true);
        try {
            const response = await api.post(`tblitem/edit/${id}`, itemData);
            
            if (response.error) {
                throw new Error(response.error);
            }
            
            const updatedItem = { ...itemData, id };
            setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
            
            return updatedItem;
        } catch (error) {
            console.error("Error updating contract item:", error);
            app.flashMsg("Error", "Error al actualizar el ítem de contrato", "error");
            throw error;
        } finally {
            setLoading(false);
        }
    }, [api, app]);

    const deleteItem = useCallback(async (id) => {
        setLoading(true);
        try {
            const response = await api.delete(`tblitem/delete/${id}`);
            
            if (response.error) {
                throw new Error(response.error);
            }
            
            setItems(prev => prev.filter(item => item.id !== id));
            
            return true;
        } catch (error) {
            console.error("Error deleting contract item:", error);
            app.flashMsg("Error", "Error al eliminar el ítem de contrato", "error");
            throw error;
        } finally {
            setLoading(false);
        }
    }, [api, app]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    return {
        loading,
        items,
        fetchItems,
        addItem,
        updateItem,
        deleteItem
    };
};

export default useContractItems;
