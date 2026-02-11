// src/http/http.service.ts

import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
// import { allure } from 'allure-jest'
import { allure } from '../utils/allure'
import Log from '../utils/logger'

export default class HttpService {
  constructor(private client: AxiosInstance) {}

  async request<T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {

    const requestDetails = {
      method: method.toUpperCase(),
      url: endpoint,
      headers: config?.headers ?? {},
      params: config?.params ?? {},
      body: data ?? null
    }

    // ✅ Attach Request
    allure.attachment(
      'Request Payload',
      JSON.stringify(requestDetails, null, 2),
      'application/json'
    )

    try {
      const response = await this.client.request<T>({
        method,
        url: endpoint,
        data,
        ...config
      })

      // ✅ Attach Response
      allure.attachment(
        'Response Payload',
        JSON.stringify(
          {
            status: response.status,
            headers: response.headers,
            body: response.data
          },
          null,
          2
        ),
        'application/json'
      )

      return response

    } catch (error: any) {

      if (error.response) {
        // ✅ Attach Error Response
        allure.attachment(
          'Error Response Payload',
          JSON.stringify(
            {
              status: error.response.status,
              headers: error.response.headers,
              body: error.response.data
            },
            null,
            2
          ),
          'application/json'
        )
      }

      throw error
    }
  }
}
