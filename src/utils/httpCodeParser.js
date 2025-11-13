/**
 * Obtains server response information and normalizes it.
 *
 * @param {any} error - exception throwed by axios or backend
 * @returns {{ status: number | null, specificCode: string }}
 */
export function getResponseCodes(error) {
  const status = error?.response?.status ?? error?.status ?? null;
  const specificCode = error?.response?.data?.code ?? error?.code ?? null;

  return { status, specificCode };
}
