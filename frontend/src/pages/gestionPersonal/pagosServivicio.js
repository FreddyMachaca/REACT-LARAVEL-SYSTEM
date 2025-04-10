import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Card } from 'primereact/card';
import { SelectButton } from 'primereact/selectbutton';
import useApp from 'hooks/useApp';

const PagosServicioModal = ({ show, onHide, personaId, onSaved, embedded = false }) => {
    const app = useApp();
    const [saving, setSaving] = useState(false);
    const [tipoMonto, setTipoMonto] = useState('unico'); 
    const [formData, setFormData] = useState({
        tr_monto: null,
        tc_cant_cuotas: 1,
        tc_monto: null
    });

    const tipoMontoOpciones = [
        { label: 'Monto Único', value: 'unico' },
        { label: 'Monto por Cuotas', value: 'cuotas' }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (!formData.tr_monto || formData.tr_monto <= 0) {
                app.flashMsg('Error', 'Debe ingresar un monto válido', 'error');
                return;
            }

            setSaving(true);
            
            setTimeout(() => {
                app.flashMsg('Éxito', 'Monto registrado correctamente', 'success');
                onHide();
                if (onSaved) onSaved(formData);
                setSaving(false);
            }, 500);
            
        } catch (error) {
            console.error('Error:', error);
            app.flashMsg('Error', 'No se pudo registrar el monto', 'error');
            setSaving(false);
        }
    };

    const renderFooter = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={onHide} className="p-button-text" />
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
            {/* Formulario de registro */}
            <div className="col-12">
                <Card title="Registrar Monto" className="mb-4">
                    <div className="p-fluid">
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
                            <>
                                <div className="field">
                                    <label htmlFor="cantidadCuotas">Cantidad de Cuotas</label>
                                    <InputNumber
                                        id="cantidadCuotas"
                                        value={formData.tc_cant_cuotas}
                                        onValueChange={(e) => handleInputChange('tc_cant_cuotas', e.value)}
                                        mode="decimal"
                                        minFractionDigits={0}
                                        locale="es-BO"
                                        min={1}
                                    />
                                </div>
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
                            </>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );

    if (embedded) {
        return renderContent();
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
