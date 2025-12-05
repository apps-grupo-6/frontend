import { createContext, useContext, useMemo, useState, useEffect, useRef } from "react";
import * as LocalAuthentication from 'expo-local-authentication';
import { jwtDecode } from "jwt-decode";
import { AuthService } from "@/domain/auth/services/authService";

const AuthContext = createContext(null);

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
    };

    const login = async (token) => {
        const payload = jwtDecode(token);
        const roles = payload.roles
        const userId = payload.user_id

        await setAuthToken(token);
        setRoles(roles);
        setUserId(userId);
        setIsAuthenticated(true);
    }

    const logout = async () => {
        await setAuthToken("");
        setRoles([]);
        setUserId(null);
        setIsAuthenticated(false);
    };

    useEffect(() => {
        const loadSession = async () => {
            await AuthService.refreshToken();
            const token = response.data.token;
            await login(token);
        };

        loadSession();
    }, []);

    useEffect(() => {
        const loadToken = async () => {
            try {
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
            } catch (error) {
                console.error("Error loading token:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadToken();
    }, []);

    const value = useMemo(() => ({ token, roles, userId, isAuthenticated, isLoading, login, logout, setAuthToken }), [token, isAuthenticated, isLoading]);
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);