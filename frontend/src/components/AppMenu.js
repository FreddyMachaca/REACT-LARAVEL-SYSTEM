import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PanelMenu } from 'primereact/panelmenu';

export const AppMenu = (props) => {
    const navigate = useNavigate();

    const processItems = (items) => {
        return items.map(item => ({
            label: item.label,
            icon: item.icon,
            expanded: item.expanded, // preserve expanded flag from DB
            items: item.items ? processItems(item.items) : undefined,
            command: () => {
                if (item.to) {
                    navigate(item.to);
                }
            }
        }));
    };

    const processedModel = processItems(props.model);
    console.log('PanelMenu model:', processedModel);

    return (
        <div className="layout-menu-container">
            <PanelMenu 
                model={processedModel} 
                className="w-full border-none"
                multiple={true}
            />
        </div>
    );
};
