import { createContext, useContext, useMemo, useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import api from "@/api/api";

const AuthContext = createContext(null);
const TOKEN_KEY = "auth_token";

const storage = {
    async setItem(key, value) {
        if (Platform.OS === 'web') {
            return;
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    },
    async getItem(key) {
        if (Platform.OS === 'web') {
            return;
        } else {
            return await SecureStore.getItemAsync(key);
        }
    },
    async removeItem(key) {
        if (Platform.OS === 'web') {
            return;
        } else {
            await SecureStore.deleteItemAsync(key);
        }
    }
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState("");
    const [roles, setRoles] = useState([]);
    const [userId, setUserId] = useState(null);
    const tokenRef = useRef("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const setAuthToken = async (token) => {
        const safe = token || "";

        tokenRef.current = safe;
        setToken(safe);

        try {
            if (safe) {
                await storage.setItem(TOKEN_KEY, safe);
            } else {
                await storage.removeItem(TOKEN_KEY);
            }
        } catch (error) {
            console.error("Error saving token:", error);
        }
    };

    const login = async (token, roles, userId) => {
        await setAuthToken(token);
        setRoles(roles);
        setUserId(userId);
        setIsAuthenticated(true);
    }

    const logout = async () => {
        await setAuthToken("");
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const loadToken = async () => {
            try {
                // En web, solo verificar si hay token (no persiste)
                if (Platform.OS === 'web') {
                    setIsLoading(false);
                    return;
                }

                // En mobile, primero pedir autenticación biométrica/PIN
                const hasHardware = await LocalAuthentication.hasHardwareAsync();
                const isEnrolled = await LocalAuthentication.isEnrolledAsync();

                if (hasHardware && isEnrolled) {
                    const result = await LocalAuthentication.authenticateAsync({
                        promptMessage: 'Autentícate para acceder a la aplicación',
                        fallbackLabel: 'Usar código',
                        cancelLabel: 'Cancelar',
                    });

                    if (!result.success) {
                        // Si falla la autenticación, no cargar el token
                        setIsLoading(false);
                        return;
                    }
                }

                // Si pasa la autenticación (o no hay biometría), cargar el token
                const savedToken = await storage.getItem(TOKEN_KEY);
                if (savedToken) {
                    tokenRef.current = savedToken;
                    setToken(savedToken);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error("Error loading token:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadToken();
    }, []);

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

    const value = useMemo(() => ({ token, roles, isAuthenticated, isLoading, login, logout, setAuthToken }), [token, isAuthenticated, isLoading]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);