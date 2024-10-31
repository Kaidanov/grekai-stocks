"use client";

import React, { useState, Suspense } from 'react';
import { MenuComponent, MenuItemModel } from '@syncfusion/ej2-react-navigations';
import { useRouter } from 'next/navigation';

// Create a loading component
const MenuLoading = () => <div>Loading menu...</div>;

const MainMenu: React.FC = () => {
  const router = useRouter();
  const [isVertical, setIsVertical] = useState(false);

  const menuItems: MenuItemModel[] = [
    {
      text: 'Home',
      id: '/'
    },
    {
      text: 'About',
      id: '/about'
    },
    {
      text: 'Services',
      items: [
        { text: 'Service 1', id: '/services/1' },
        { text: 'Service 2', id: '/services/2' },
      ]
    },
    {
      text: 'Contact',
      id: '/contact'
    }
  ];

  const menuClick = async (args: any) => {
    try {
      if (args.item.id) {
        await router.push(args.item.id);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <Suspense fallback={<MenuLoading />}>
      <div className="menu-container">
        <button 
          onClick={() => setIsVertical(!isVertical)} 
          className="toggle-button"
        >
          Switch to {isVertical ? 'Horizontal' : 'Vertical'} Menu
        </button>

        <div className={`menu-wrapper ${isVertical ? 'vertical' : 'horizontal'}`}>
          <MenuComponent 
            items={menuItems}
            select={menuClick}
            cssClass="main-menu"
            orientation={isVertical ? 'Vertical' : 'Horizontal'}
          />
        </div>
      </div>
    </Suspense>
  );
};

export default MainMenu; 