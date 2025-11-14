import api from "@/api/api";
import { BASE_URL_CLASSES } from "@/domain/home/config/constants";

const getClasses = async () => {
    const response = await api.get(BASE_URL_CLASSES);
    return response;
};

const reserveClass = async (classId) => {
    const response = await api.post(`${BASE_URL_CLASSES}/${classId}/participant`);
    return response;
};

export { getClasses, reserveClass };