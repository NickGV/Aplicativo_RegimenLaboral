import { useState, useEffect } from 'react';

const useTheme = () => {
    // 1. Inicializar el estado del tema
    // Lee la preferencia guardada en localStorage o usa 'light' por defecto.
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') || 'light'
    );

    // 2. Función para cambiar el tema
    const toggleTheme = () => {
        setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
    };

    // 3. Efecto para aplicar el tema y guardarlo
    useEffect(() => {
        // Esto es lo clave: aplicar la clase al body
        document.body.className = theme; 
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Devuelve el estado actual del tema y la función para alternarlo
    return [theme, toggleTheme];
};

export default useTheme;