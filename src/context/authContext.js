import { createContext, useContext, useMemo, useState, useEffect, useRef } from "react";
import api from "@/api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const tokenRef = useRef("");

  useEffect(() => { tokenRef.current = token; }, [token]);
  
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
            console.log('Auth header ->', config.headers.Authorization);
        } else {
            console.log("ASD")
            console.log(`"${current}"`)
        }
        return config;
    });
    return () => api.interceptors.request.eject(id);
  }, []);

  const logout = () => { setToken(""); };

  const value = useMemo(() => ({ token, setToken, logout }), [token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
