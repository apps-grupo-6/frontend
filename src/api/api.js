import axios from "axios";
import env from "@/config/env";

const api = axios.create({
baseURL: env.apiUrl,
timeout: 60000,
headers: {
Accept: "application/json",
"Content-Type": "application/json",
"Connection": "keep-alive",
},
// Configuración adicional para mobile
maxRedirects: 5,
validateStatus: (status) => status >= 200 && status < 300,
// Configuración de retry para requests
transitional: {
silentJSONParsing: true,
forcedJSONParsing: true,
clarifyTimeoutError: true,
},
});

// Interceptor para asegurar que data siempre sea válido en mobile
api.interceptors.request.use(
(config) => {
// Si el método requiere body y data es undefined, asignar objeto vacío
if (['post', 'put', 'patch'].includes(config.method?.toLowerCase())) {
if (config.data === undefined || config.data === null) {
config.data = {};
}
}

// Log del request
console.log(`[API →] ${config.method?.toUpperCase()} ${config.url}`);

// Agregar metadata para retry
config.metadata = { retryCount: 0, maxRetries: 3 };

return config;
},
(error) => {
return Promise.reject(error);
}
);

api.interceptors.response.use(
(response) => {
console.log("[DEBUG RESPONSE] Full response:", response);
console.log("[DEBUG RESPONSE] response.data:", response.data);
console.log("[DEBUG RESPONSE] response.status:", response.status);
console.log(`[API ✓] ${response.config?.method?.toUpperCase()}
${response.config?.url} - Status: ${response.status}`);

// Asegurarse de que response.data existe
if (!response.data) {
console.warn("[DEBUG RESPONSE] response.data es undefined/null, etornando response completo");
return response;
}

return response.data;
},
async (error) => {
console.log("[DEBUG ERROR] Full error:", error);
console.log("[DEBUG ERROR] error.message:", error.message);
console.log("[DEBUG ERROR] error.code:", error.code);
console.log("[DEBUG ERROR] error.response:", error.response);
console.log("[DEBUG ERROR] error.config:", error.config?.url);

const config = error.config;

// Retry logic para Network Errors y Timeouts en mobile
const shouldRetry =
error.message === 'Network Error' ||
error.code === 'ECONNABORTED' ||
error.code === 'ERR_NETWORK';

if (shouldRetry && config?.metadata) {
const { retryCount, maxRetries } = config.metadata;

if (retryCount < maxRetries) {
config.metadata.retryCount += 1;
console.log(`[RETRY] Intento ${retryCount + 1}/${maxRetries} para
${config.url} (${error.message})`);

// Esperar menos tiempo ya que el backend responde rápido (0.5s, 1s, 1.5s)
await new Promise(resolve => setTimeout(resolve, 500 * (retryCount + 1)));

return api(config);
} else {
console.log(`[RETRY] Máximo de reintentos alcanzado para ${config.url}`);
}
}

// Log del error
console.log(`[API ✗] ${error.config?.method?.toUpperCase()}
${error.config?.url} - ${error.message}`);

const response = error.response?.status;

if (response === 401 || response === 403) {
await logout();
}

return Promise.reject(error);
}
);

export default api;
