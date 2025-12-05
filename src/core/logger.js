export const logApiResponse = (config) => {

  const { url, method } = config.config || config;
  const status = config.status || config.response?.status;
  const data = config.data || config.response?.data;

  console.log("[API LOG]", {
    url,
    method: method?.toUpperCase(),
    status,
    data,
    timestamp: new Date().toISOString(),
  });
};