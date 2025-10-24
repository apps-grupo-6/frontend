import { createContext, useContext, useMemo, useState, useEffect, useRef } from "react";
import api from "@/api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState("");
    const tokenRef = useRef("");

    const setAuthToken = (t) => {
        tokenRef.current = t || "";
        setToken(t || "");
    };

    useEffect(() => {
        const id = api.interceptors.request.use((config) => {
        
            const current = tokenRef.current;   

            if (current != "") {
                if (!config.headers) config.headers = {};

                if (typeof config.headers.set === 'function') {
                    config.headers.set('Authorization', `Bearer ${current}`);
                } else {
                    config.headers = { ...config.headers, Authorization: `Bearer ${current}` };
                }

                config.headers.Authorization = `Bearer ${current}`;
            } 

            return config;
        });
        
        return () => api.interceptors.request.eject(id);
    }, []);

    const logout = () => { setToken(""); };

    const value = useMemo(() => ({ token, setToken, logout, setAuthToken }), [token]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
