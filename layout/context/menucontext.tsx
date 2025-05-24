import React, { useState, createContext } from 'react';
import { ChildContainerProps, MenuContextProps } from '@/types';

export const MenuContext = createContext({} as MenuContextProps);

export const MenuProvider = ({ children }: ChildContainerProps) => {
    const [activeMenu, setActiveMenu] = useState('');
    const [customPage, setCustomPage] = useState<'page1' | 'page2' | ''>('');

    const value = {
        activeMenu,
        setActiveMenu,
        customPage,
        setCustomPage
    };

    return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};
