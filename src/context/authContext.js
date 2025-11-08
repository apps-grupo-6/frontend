import { createContext, useContext, useMemo, useState, useEffect, useRef } from "react";
import api from "@/api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState("");
    const tokenRef = useRef("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const setAuthToken = (token) => {
        const safe = token || "";

        tokenRef.current = safe;
        setToken(safe);
    };

    const login = async (token) => {
        setAuthToken(token);
        setIsAuthenticated(true);
    }

    const logout = () => { 
        setAuthToken(""); 
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const id = api.interceptors.request.use((config) => {
            const current = tokenRef.current;   

            if (current != "") {
                if (!config.headers) 
                    config.headers = {};

                config.headers.Authorization = `Bearer ${current}`;
            } 

            return config;
        });
        
        return () => api.interceptors.request.eject(id);
    }, []);

    const value = useMemo(() => ({ token, isAuthenticated, login, logout, setAuthToken }), [token, isAuthenticated]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
