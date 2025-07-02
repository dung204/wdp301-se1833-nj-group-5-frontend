import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios';

import { TokenManager } from './token-manager.lib';

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  isPrivateRoute?: boolean;
}

export interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  isPrivateRoute?: boolean;
}

export class HttpClient {
  private readonly axiosInstance: AxiosInstance;

  constructor({ headers, ...otherAxiosConfig }: Omit<CreateAxiosDefaults, 'baseURL'> = {}) {
    this.axiosInstance = axios.create({
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      timeout: 10000,
      ...otherAxiosConfig,
    });

    this.axiosInstance.interceptors.request.use(this.onSuccessRequest);
    this.axiosInstance.interceptors.response.use(this.onSuccessResponse, this.onResponseFailed);
  }

  protected async onSuccessRequest(config: CustomInternalAxiosRequestConfig) {
    // Set base URL
    if (config.isPrivateRoute) {
      config.headers.set('Is-Private-Route', 'true');
      config.baseURL = '/api';
    } else {
      config.baseURL =
        typeof window !== undefined
          ? (await import('../config/env-client.config')).envClient.NEXT_PUBLIC_API_URL
          : (await import('../config/env-server.config')).envServer.API_URL;
    }

    // Add authentication token if available
    const accessToken = TokenManager.getAccessToken();
    if (accessToken) {
      config.headers.set('Authorization', `Bearer ${accessToken}`);
      // Debug: Token added successfully
    } else {
      console.warn('⚠️ No auth token found for request:', config.url);
    }

    return config;
  }

  protected onSuccessResponse(response: AxiosResponse) {
    // Automatically detect and store tokens from login/register responses
    const responseData = response.data;
    const isAuthResponse =
      (response.config.url?.includes('/auth/login') ||
        response.config.url?.includes('/auth/register')) &&
      responseData?.data?.accessToken;

    if (isAuthResponse) {
      const { accessToken, refreshToken, user } = responseData.data;
      TokenManager.setTokens(accessToken, refreshToken);
      if (user) {
        TokenManager.setUser(user);
      }
    }

    return responseData;
  }

  protected onResponseFailed(error: AxiosError) {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      // Clear tokens and redirect to login
      TokenManager.clearTokens();

      // Redirect to login page if we're on the client side
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }

    // TODO: Additional handling for different status codes here
    throw error;
  }

  public get<T>(url: string, config?: CustomAxiosRequestConfig) {
    return this.axiosInstance.get<T, T>(url, config);
  }

  public post<T>(url: string, data?: unknown, config?: CustomAxiosRequestConfig) {
    return this.axiosInstance.post<T, T>(url, data, config);
  }

  public patch<T>(url: string, data?: unknown, config?: CustomAxiosRequestConfig) {
    return this.axiosInstance.patch<T, T>(url, data, config);
  }

  public put<T>(url: string, data?: unknown, config?: CustomAxiosRequestConfig) {
    return this.axiosInstance.put<T, T>(url, data, config);
  }

  public delete<T = void>(url: string, config?: CustomAxiosRequestConfig) {
    return this.axiosInstance.delete<T, T>(url, config);
  }
}

export const httpClient = new HttpClient();
