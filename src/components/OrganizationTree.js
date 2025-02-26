import React, { useState } from 'react';
import { FaPlus, FaMinus, FaEdit } from 'react-icons/fa';

const OrganizationTree = ({ data, onSelectItem, onAddChild, selectedItemId }) => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const renderTree = (items) => {
    return items.map(item => (
      <li key={item.id} className="mb-2">
        <div 
          className={`flex items-center p-2 rounded ${selectedItemId === item.id ? 'bg-blue-100' : ''}`}
        >
          {item.children && item.children.length > 0 ? (
            <button 
              onClick={() => toggleExpand(item.id)}
              className="mr-2 text-gray-500 hover:text-gray-700"
            >
              {expandedItems[item.id] ? <FaMinus size={12} /> : <FaPlus size={12} />}
            </button>
          ) : (
            <span className="w-5"></span>
          )}
          
          <span 
            className="cursor-pointer flex-grow"
            onClick={() => onSelectItem(item.id)}
          >
            {item.title}
          </span>
          
          <button 
            onClick={() => onAddChild(item.id)} 
            className="ml-2 text-blue-500 hover:text-blue-700"
            title="Agregar hijo"
          >
            <FaPlus size={14} />
          </button>
        </div>

        {item.children && item.children.length > 0 && expandedItems[item.id] && (
          <ul className="pl-6 mt-1 border-l border-gray-300">
            {renderTree(item.children)}
          </ul>
        )}
      </li>
    ));
  };

  return (
    <div className="border p-4 rounded-md bg-white shadow-sm">
      <h3 className="text-lg font-medium mb-3">Estructura Organizacional</h3>
      <ul className="organization-tree">
        {renderTree(data)}
      </ul>
    </div>
  );
};

export default OrganizationTree;
