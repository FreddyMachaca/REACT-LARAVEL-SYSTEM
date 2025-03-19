import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Plus, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MenuItem = ({ item, level = 0, onToggle, expanded, onEdit, onDelete }) => {
    const isExpanded = expanded.includes(item.me_id);
    const hasChildren = item.children && item.children.length > 0;

    return (
        <div className="w-full">
            <div className={`flex items-center p-2 hover:bg-gray-50 ${level > 0 ? 'ml-6' : ''}`}>
                <div className="w-6" onClick={() => hasChildren && onToggle(item.me_id)}>
                    {hasChildren && (
                        <button className="p-1">
                            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </button>
                    )}
                </div>
                <div className="flex-1 ml-2">
                    <span className="font-medium">{item.me_descripcion}</span>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(item)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(item.me_id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            </div>
            {isExpanded && hasChildren && (
                <div className="ml-4">
                    {item.children.map((child) => (
                        <MenuItem
                            key={child.me_id}
                            item={child}
                            level={level + 1}
                            onToggle={onToggle}
                            expanded={expanded}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const MenuTree = ({ apiPath }) => {
    const [nodes, setNodes] = useState([]);
    const [expanded, setExpanded] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        me_id: null,
        me_descripcion: '',
        me_url: '',
        me_icono: '',
        me_id_padre: null,
        me_orden: 0,
        me_estado: 'V'
    });
    const [parentOptions, setParentOptions] = useState([]);

    useEffect(() => {
        fetch(apiPath)
            .then(response => response.json())
            .then(data => {
                setNodes(data);
                generateParentOptions(data);
            });
    }, [apiPath]);

    const generateParentOptions = (menuItems) => {
        const options = menuItems.map(item => ({
            value: item.me_id,
            label: item.me_descripcion
        }));
        setParentOptions([{ value: null, label: 'Raíz' }, ...options]);
    };

    const handleToggle = (id) => {
        setExpanded(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleEdit = (item) => {
        setFormData(item);
        setDialogOpen(true);
    };

    const handleDelete = (id) => {
        fetch(`${apiPath}/${id}`, { method: 'DELETE' })
            .then(() => {
                setNodes(prevNodes => prevNodes.filter(node => node.me_id !== id));
                generateParentOptions(nodes.filter(node => node.me_id !== id));
            });
    };

    const handleSubmit = () => {
        const method = formData.me_id ? 'PUT' : 'POST';
        const url = formData.me_id ? `${apiPath}/${formData.me_id}` : apiPath;

        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (method === 'POST') {
                setNodes([...nodes, data]);
            } else {
                setNodes(nodes.map(node => node.me_id === data.me_id ? data : node));
            }
            generateParentOptions([...nodes, data]);
            setDialogOpen(false);
        });
    };

    const transformMenuData = (menuData) => {
        const transformNode = (node) => {
            if (node.me_estado !== 'V') { 
                return null;
            }
            const menuItem = {
                label: node.me_descripcion,
                icon: node.me_icono || 'pi pi-fw pi-folder',
                to: node.me_url && node.me_url !== '#' ? node.me_url : undefined,
                expanded: false
            };
            if (node.children?.length > 0) {
                menuItem.items = node.children
                    .map(transformNode)
                    .filter(Boolean);
            }
            return menuItem;
        };
        return menuData
            .map(transformNode)
            .filter(Boolean);
    };

    return (
        <Card className="p-4">
            <div className="mb-4 flex justify-end">
                <Button onClick={() => {
                    setFormData({
                        me_id: null,
                        me_descripcion: '',
                        me_url: '',
                        me_icono: '',
                        me_id_padre: null,
                        me_orden: 0,
                        me_estado: 'V'
                    });
                    setDialogOpen(true);
                }}>
                    <Plus className="mr-2 h-4 w-4" /> Nuevo Menú
                </Button>
            </div>

            {nodes.map(node => (
                <MenuItem
                    key={node.me_id}
                    item={node}
                    onToggle={handleToggle}
                    expanded={expanded}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            ))}

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {formData.me_id ? 'Editar Menú' : 'Nuevo Menú'}
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                        <Input
                            label="Descripción"
                            value={formData.me_descripcion}
                            onChange={(e) => setFormData({...formData, me_descripcion: e.target.value})}
                        />
                        
                        <Input
                            label="Ruta"
                            value={formData.me_url}
                            onChange={(e) => setFormData({...formData, me_url: e.target.value})}
                        />
                        
                        <Input
                            label="Icono"
                            value={formData.me_icono}
                            onChange={(e) => setFormData({...formData, me_icono: e.target.value})}
                        />
                        
                        <Select
                            value={formData.me_id_padre}
                            onValueChange={(value) => setFormData({...formData, me_id_padre: value})}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione padre" />
                            </SelectTrigger>
                            <SelectContent>
                                {parentOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                Cancelar
                            </Button>
                            <Button onClick={handleSubmit}>
                                Guardar
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default MenuTree;