import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser({ id: data.id, name: data.nombre, role: data.rol, email: data.email });
        return true;
      } else {
        const errData = await response.json();
        throw new Error(errData.message || 'Credenciales inválidas');
      }
    } catch (err) {
      console.error('Error de autenticación:', err.message);
      alert(err.message === 'Failed to fetch' ? 'Error: El servidor no está respondiendo. Asegúrate de ejecutar npm run dev.' : err.message);
      return false;
    }
  };

  const register = (userData) => {
    // Simulated register logic
    setUser({ id: 4, name: userData.nombre, role: userData.rol, email: userData.email });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
