import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PanelMenu } from 'primereact/panelmenu';

export const AppMenu = (props) => {
    const navigate = useNavigate();

    const processItems = (items) => {
        return items.map(item => {
            const iconContent = item.icon && /^(http|https):\/\//.test(item.icon)
                ? (<img src={item.icon} alt="icon" className="mr-2" style={{width:'30px', height:'30px'}} />)
                : <i className={`${item.icon} text-xl mr-2`}></i>;
            return {
                label: item.label,
                icon: iconContent,
                expanded: item.expanded,
                items: item.items ? processItems(item.items) : undefined,
                command: () => {
                    if (item.to) {
                        navigate(item.to);
                    }
                }
            };
        });
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
