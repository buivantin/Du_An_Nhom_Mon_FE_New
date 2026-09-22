import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [displayName, setDisplayName] = useState('Sinh viên');
    const [theme, setTheme] = useState('light'); // 'light' hoặc 'dark'

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
        // Áp dụng màu nền ngay lập tức
        document.body.style.backgroundColor = newTheme === 'dark' ? '#333' : '#fff';
        document.body.style.color = newTheme === 'dark' ? '#fff' : '#000';
    };

    return (
        <AppContext.Provider value={{ displayName, setDisplayName, theme, toggleTheme }}>
            {children}
        </AppContext.Provider>
    );
};