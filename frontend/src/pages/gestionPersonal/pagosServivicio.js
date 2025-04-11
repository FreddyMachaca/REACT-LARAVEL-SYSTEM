import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Card } from 'primereact/card';
import { SelectButton } from 'primereact/selectbutton';
import { Dropdown } from 'primereact/dropdown';
import useApp from 'hooks/useApp';
import axios from 'axios';

const PagosServicioModal = ({ show, onHide, personaId, onSaved, embedded = false }) => {
    const app = useApp();
    const [saving, setSaving] = useState(false);
    const [tipoMonto, setTipoMonto] = useState('unico'); 
    const [formData, setFormData] = useState({
        tr_monto: null,
        tc_cant_cuotas: 1,
        tc_monto: null,
        servicio_id: null
    });
    const [repSalarios, setRepSalarios] = useState([]);

    useEffect(() => {
        const loadRepSalarios = async () => {
            try {
                const response = await axios.get('/pagosservicios/repsalarios');
                if (response.data) {
                    setRepSalarios(response.data.map(item => ({
                        value: item.cat_id,
                        label: item.cat_descripcion
                    })));
                }
            } catch (error) {
                console.error('Error loading rep_salarios:', error);
            }
        };
        
        loadRepSalarios();
    }, []);

    const tipoMontoOpciones = [
        { label: 'Monto Único', value: 'unico' },
        { label: 'Monto por Cuotas', value: 'cuotas' }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            // Validaciones
            if (!formData.servicio_id) {
                app.flashMsg('Error', 'Debe seleccionar un servicio', 'error');
                return;
            }

            if (!formData.tr_monto || formData.tr_monto <= 0) {
                app.flashMsg('Error', 'Debe ingresar un monto válido', 'error');
                return;
            }

            if (tipoMonto === 'cuotas' && (!formData.tc_monto || formData.tc_monto <= 0)) {
                app.flashMsg('Error', 'Debe ingresar un monto por cuota válido', 'error');
                return;
            }

            setSaving(true);

            const payload = {
                per_id: personaId,
                tipo_monto: tipoMonto,
                monto: formData.tr_monto,
                monto_cuota: tipoMonto === 'cuotas' ? formData.tc_monto : null,
                descripcion: repSalarios.find(r => r.value === formData.servicio_id)?.label
            };
            
            const response = await axios.post('/pagosservicios/store', payload);
            
            if (response.data && response.data.status === 'success') {
                app.flashMsg('Éxito', 'Servicio registrado correctamente', 'success');
                if (typeof onHide === 'function') {
                    onHide(); 
                }
                if (typeof onSaved === 'function') { 
                    onSaved();
                }
            } else {
                throw new Error(response.data?.message || 'Error al guardar');
            }
        } catch (error) {
            console.error('Error:', error);
            app.flashMsg('Error', 
                error.response?.data?.message || 'No se pudo registrar el servicio', 
                'error'
            );
        } finally {
            setSaving(false);
        }
    };

    const renderFooter = () => {
        return (
            <div>
                {typeof onHide === 'function' && (
                    <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
                )}
                <Button 
                    label="Guardar" 
                    icon="pi pi-check" 
                    onClick={handleSubmit} 
                    loading={saving}
                    autoFocus 
                />
            </div>
        );
    };

    const renderContent = () => (
        <div className="grid">
            <div className="col-12">
                <Card title={!embedded ? "Registrar Servicio" : ""} className="mb-4">
                    <div className="p-fluid">
                        {/* Datos de servicio */}
                        <div className="field">
                            <label>Tipo de Servicio *</label>
                            <Dropdown
                                value={formData.servicio_id}
                                options={repSalarios}
                                onChange={(e) => handleInputChange('servicio_id', e.value)}
                                placeholder="Seleccione un servicio"
                            />
                        </div>
                        
                        {/* Datos de monto */}
                        <div className="field">
                            <label>Tipo de Monto</label>
                            <SelectButton 
                                value={tipoMonto} 
                                options={tipoMontoOpciones} 
                                onChange={(e) => setTipoMonto(e.value)}
                                className="w-full"
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="monto">Monto (Bs.)</label>
                            <InputNumber
                                id="monto"
                                value={formData.tr_monto}
                                onValueChange={(e) => handleInputChange('tr_monto', e.value)}
                                mode="decimal"
                                minFractionDigits={2}
                                locale="es-BO"
                                placeholder="0.00"
                            />
                        </div>

                        {tipoMonto === 'cuotas' && (
                            <div className="field">
                                <label htmlFor="montoCuota">Monto por Cuota (Bs.)</label>
                                <InputNumber
                                    id="montoCuota"
                                    value={formData.tc_monto}
                                    onValueChange={(e) => handleInputChange('tc_monto', e.value)}
                                    mode="decimal"
                                    minFractionDigits={2}
                                    locale="es-BO"
                                    placeholder="0.00"
                                />
                            </div>
                        )}

                        {/* Botón Guardar */}
                        {!embedded && (
                            <div className="field flex justify-content-end mt-4">
                                <Button
                                    label="Guardar"
                                    icon="pi pi-save"
                                    onClick={handleSubmit}
                                    loading={saving}
                                />
                            </div>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );

    if (embedded) {
        return (
            <div>
                {renderContent()}
                 <div className="flex justify-content-end mt-2">
                     <Button
                         label="Guardar Servicio"
                         icon="pi pi-save"
                         onClick={handleSubmit}
                         loading={saving}
                     />
                 </div>
            </div>
        );
    }

    return (
        <Dialog 
            header="Registrar Monto" 
            visible={show} 
            style={{ width: '500px' }} 
            onHide={onHide}
            footer={renderFooter()}
        >
            {renderContent()}
        </Dialog>
    );
};

export default PagosServicioModal;
