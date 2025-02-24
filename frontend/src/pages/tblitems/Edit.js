import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { PageRequestError } from 'components/PageRequestError';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import useApp from 'hooks/useApp';
import useEditPage from 'hooks/useEditPage';

const TblItemsEditPage = (props) => {
    const app = useApp();
    const pageController = useEditPage(props);
    const { item, loading, errorMessages } = pageController;

    async function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const modeldata = {};
        formData.forEach((value, key) => {
            modeldata[key] = value;
        });
        await pageController.updateRecord(modeldata);
    }

    if (loading) {
        return (
            <div className="p-3 text-center">
                <ProgressSpinner style={{width:'50px', height:'50px'}} />
            </div>
        );
    }

    if (errorMessages.length) {
        return <PageRequestError error={errorMessages} />;
    }

    return (
        <main id="TblItemsEditPage" className="main-page">
            {(props.showHeader) && 
                <section className="page-section mb-3">
                    <div className="container">
                        <div className="grid justify-content-between align-items-center">
                            {!props.isSubPage && 
                                <div className="col-fixed">
                                    <Button onClick={() => app.navigate(-1)} 
                                           label="" 
                                           className="p-button p-button-text" 
                                           icon="pi pi-arrow-left" />
                                </div>
                            }
                            <div className="col">
                                <Title title="Editar Item" 
                                      titleClass="text-2xl text-primary font-bold" 
                                      subTitleClass="text-500" 
                                      separator={false} />
                            </div>
                        </div>
                    </div>
                </section>
            }
            <section className="page-section">
                <div className="container">
                    <div className="grid">
                        <div className="col-12">
                            <div className="card">
                                <form onSubmit={onSubmit} className="grid gap-3">
                                    <div className="col-12 md:col-6">
                                        <label className="form-label">Código Item *</label>
                                        <InputText 
                                            name="codigo_item" 
                                            defaultValue={item.codigo_item} 
                                            className={errorMessages.codigo_item ? "p-invalid" : ""} 
                                        />
                                        <small className="p-error">{errorMessages.codigo_item}</small>
                                    </div>
                                    <div className="col-12 md:col-6">
                                        <label className="form-label">Cargo *</label>
                                        <InputText 
                                            name="cargo" 
                                            defaultValue={item.cargo} 
                                            className={errorMessages.cargo ? "p-invalid" : ""} 
                                        />
                                        <small className="p-error">{errorMessages.cargo}</small>
                                    </div>
                                    <div className="col-12 md:col-6">
                                        <label className="form-label">Haber Básico *</label>
                                        <InputNumber 
                                            name="haber_basico" 
                                            value={item.haber_basico}
                                            mode="decimal" 
                                            minFractionDigits={2} 
                                            maxFractionDigits={2}
                                            className={errorMessages.haber_basico ? "p-invalid" : ""} 
                                        />
                                        <small className="p-error">{errorMessages.haber_basico}</small>
                                    </div>
                                    <div className="col-12 md:col-6">
                                        <label className="form-label">Unidad Organizacional *</label>
                                        <InputText 
                                            name="unidad_organizacional" 
                                            defaultValue={item.unidad_organizacional} 
                                            className={errorMessages.unidad_organizacional ? "p-invalid" : ""} 
                                        />
                                        <small className="p-error">{errorMessages.unidad_organizacional}</small>
                                    </div>
                                    <div className="col-12 text-right">
                                        <Button type="submit" label="Guardar" icon="pi pi-save" loading={loading} />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

TblItemsEditPage.defaultProps = {
    id: null,
    primaryKey: 'id',
    pageName: 'tblitems',
    apiPath: 'tblitem/edit',
    routeName: 'tblitemsedit',
    submitButtonLabel: "Guardar",
    submitButtonIcon: "pi pi-save",
    msgBeforeDelete: "¿Seguro que quieres borrar este registro?",
    msgTitle: "Eliminar el registro",
    msgAfterDelete: "Registro eliminado con éxito",
    showHeader: true,
    showFooter: true,
    isSubPage: false,
    redirectAfterEdit: true,
    redirectPath: '/tblitems'
}

export default TblItemsEditPage;