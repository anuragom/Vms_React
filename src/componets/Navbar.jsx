

import React from 'react';
import { NavLink } from 'react-router-dom';
import { MoreVertical } from 'lucide-react';

const Navbar = ({ items, isCollapsed }) => {
  return (
    <nav className={`
      bg-[#01588E] border-r border-gray-200  
      h-[calc(100vh-4rem)] sticky top-16
      transition-all duration-300 ease-in-out   
      ${isCollapsed ? 'w-16' : 'w-56'}
    `}>
      <div className="flex flex-col gap-1 p-2 overflow-y-auto h-full custom-scrollbar">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-colors duration-200
                ${isActive 
                  ? 'bg-blue-100 text-blue-900' 
                  : 'text-white hover:bg-gray-100 hover:text-blue-900'
                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-lato whitespace-nowrap text-sm">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;

