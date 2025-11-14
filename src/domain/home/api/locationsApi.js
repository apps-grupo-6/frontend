import api from "@/api/api";
import { BASE_URL_LOCATIONS } from "@/domain/home/config/constants";

const getLocations = async () => {
    const response = await api.get(BASE_URL_LOCATIONS);
    return response;
};

export { getLocations };

