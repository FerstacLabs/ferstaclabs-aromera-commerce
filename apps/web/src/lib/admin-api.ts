import { apiUrl } from "./shop";

export async function adminRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("aromera-admin-token");
  if (!token) throw new Error("Davam etmək üçün admin hesabına daxil olun.");
  const response = await fetch(`${apiUrl}/api/admin/${path}`, {
    ...init, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...init.headers },
  });
  if (!response.ok) throw new Error(response.status === 401 ? "Sessiya bitib. Yenidən daxil olun." : "Məlumat saxlanmadı. Yenidən yoxlayın.");
  return response.status === 204 ? undefined as T : response.json();
}
