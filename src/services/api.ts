import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3001",
});

/**
 * Interceptor para adicionar o token nos requests
 */
instance.interceptors.request.use((request: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  return request;
});

/**
 * Função para tentar renovar o token caso a resposta seja 401
 */
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("Refresh token não encontrado");
    }

    const response = await instance.post<{
      accessToken: string;
      refreshToken: string;
    }>("/auth/refresh", { refreshToken });

    localStorage.setItem("accessToken", response.data.accessToken);
    localStorage.setItem("refreshToken", response.data.refreshToken);

    return response.data.accessToken;
  } catch (error) {
    console.error("Erro ao renovar token:", error);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return null;
  }
};

/**
 * Interceptor para tratar erros nas respostas
 */
instance.interceptors.response.use(
  (response: AxiosResponse) => response.data, // Retorna apenas os dados da resposta
  async (error) => {
    if (error.response?.status === 401) {
      const newToken = await refreshToken();
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return instance(error.config);
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Classe para requisições HTTP com Axios
 */
export class HTTP {
  private readonly http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  async get<T>(url: string, configs?: AxiosRequestConfig) {
    return this.http.get<any, T>(url, configs);
  }

  async post<T>(url: string, data: unknown, configs?: AxiosRequestConfig) {
    return this.http.post<any, T>(url, data, configs);
  }

  async patch<T>(url: string, data: unknown, configs?: AxiosRequestConfig) {
    return this.http.patch<any, T>(url, data, configs);
  }

  async delete<T>(url: string, configs?: AxiosRequestConfig) {
    return this.http.delete<any, T>(url, configs);
  }

  async put<T>(url: string, data: unknown, configs?: AxiosRequestConfig) {
    return this.http.put<any, T>(url, data, configs);
  }
}

export const api = new HTTP(instance);
export default api;
