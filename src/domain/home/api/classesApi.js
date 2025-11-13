import api from "@/api/api";
import { BASE_URL_CLASSES } from "@/domain/home/config/constants";

const getClasses = async () => {
    const response = await api.get(BASE_URL_CLASSES);
    return response;
};

export { getClasses };

