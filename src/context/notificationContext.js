import { createContext, useContext, useState, useRef, useCallback } from "react";
import NotificationView from "@/components/ui/NotificationView";

export const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const [notification, setNotification] = useState({
        visible: false,
        type: "info", // success | error | info
        title: "",
        message: "",
    });

    const hideTimeout = useRef(null);

    const hide = useCallback(() => {
        if (hideTimeout.current) {
            clearTimeout(hideTimeout.current);
            hideTimeout.current = null;
        }
        setNotification((prev) => ({ ...prev, visible: false }));
    }, []);

    const show = useCallback((type, title, message) => {
        if (hideTimeout.current) clearTimeout(hideTimeout.current);

        setNotification({
            visible: true,
            type,
            title,
            message,
        });

        hideTimeout.current = setTimeout(() => hide(), 3000);
    }, [hide]);

    const notifySuccess = (title = "Éxito", message) => show("success", title, message);
    const notifyError = (title = "Error", message) => show("error", title, message);
    const notifyInfo = (title = "Información", message) => show("info", title, message);

    const value = { notifySuccess, notifyError, notifyInfo };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <NotificationView {...notification} onClose={hide} />
        </NotificationContext.Provider>
    );
}

export const useNotification = () => useContext(NotificationContext);