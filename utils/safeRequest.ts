import { refreshJWT } from '../services/auth';

export async function safeRequest<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    if (error.code === 401) {
      console.warn('401 Unauthorized. Refreshing JWT...');
      const success = await refreshJWT();
      if (success) {
        return await fn(); // retry after refresh
      }
    }
    throw error;
  }
}
