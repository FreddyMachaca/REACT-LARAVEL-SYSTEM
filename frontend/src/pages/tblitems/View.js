import React from 'react';
import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';
import { PageRequestError } from 'components/PageRequestError';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Title } from 'components/Title';
import TblItemsEditPage from './Edit';
import useApp from 'hooks/useApp';
import useViewPage from 'hooks/useViewPage';

const TblItemsViewPage = (props) => {
    const app = useApp();
    const pageController = useViewPage(props);
    const { item, pageReady, loading, apiRequestError, deleteItem } = pageController;

    function ActionButton(data) {
        const items = [
            {
                label: "Editar",
                command: (event) => {
                    app.openPageDialog(
                        <TblItemsEditPage 
                            isSubPage={true} 
                            id={data.id} 
                            apiPath={`tblitem/edit`} 
                        />,
                        { closeBtn: true }
                    );
                },
                icon: "pi pi-pencil"
            },
            {
                label: "Eliminar",
                command: (event) => {
                    deleteItem(data.id);
                },
                icon: "pi pi-trash"
            }
        ];
        return <Menubar className="p-0" model={items} />;
    }

    function PageFooter() {
        if (props.showFooter && item && item.id) {
            return (
                <div className="flex justify-content-between">
                    <div className="flex justify-content-start">
                        {ActionButton(item)}
                    </div>
                </div>
            );
        }
        return null;
    }

    if (loading) {
        return (
            <div className="p-3 text-center">
                <ProgressSpinner style={{ width: '50px', height: '50px' }} />
            </div>
        );
    }

    if (apiRequestError) {
        return <PageRequestError error={apiRequestError} />;
    }

    if (pageReady && item) {
        return (
            <div>
                <main id="TblItemsViewPage" className="main-page">
                    {props.showHeader && (
                        <section className="page-section mb-3">
                            <div className="container">
                                <div className="grid justify-content-between align-items-center">
                                    {!props.isSubPage && (
                                        <div className="col-fixed">
                                            <Button
                                                onClick={() => app.navigate(-1)}
                                                label=""
                                                className="p-button p-button-text"
                                                icon="pi pi-arrow-left"
                                            />
                                        </div>
                                    )}
                                    <div className="col">
                                        <Title
                                            title="Ver Item"
                                            titleClass="text-2xl text-primary font-bold"
                                            subTitleClass="text-500"
                                            separator={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                    <section className="page-section">
                        <div className="container">
                            <div className="grid">
                                <div className="col comp-grid">
                                    <div className="mb-3 grid">
                                        {Object.entries({
                                            ID: item.id,
                                            'Código Item': item.codigo_item,
                                            Cargo: item.cargo,
                                            'Haber Básico': item.haber_basico,
                                            'Unidad Organizacional': item.unidad_organizacional,
                                            'Fecha Creación': item.fecha_creacion
                                        }).map(([label, value]) => (
                                            <div key={label} className="col-12 md:col-4">
                                                <div className="card flex gap-3 align-items-center card shadow-none p-3 surface-100">
                                                    <div>
                                                        <div className="text-400 font-medium mb-1">{label}</div>
                                                        <div className="font-bold">{value}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
                <PageFooter />
            </div>
        );
    }

    return null;
};

TblItemsViewPage.defaultProps = {
    id: null,
    primaryKey: 'id',
    pageName: 'tblitems',
    apiPath: 'tblitem/view',
    routeName: 'tblitemsview',
    msgBeforeDelete: "¿Seguro que quieres borrar este registro?",
    msgTitle: "Eliminar el registro",
    msgAfterDelete: "Registro eliminado con éxito",
    showHeader: true,
    showFooter: true,
    exportButton: true,
    isSubPage: false
};

export default TblItemsViewPage;