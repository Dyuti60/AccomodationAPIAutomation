// src/test-utils/api.call.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import HttpService from '../../http/http.service'
import { createHttpClient } from '../../http/http.client'
import { allure } from '../../utils/allure'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

const api = new HttpService(createHttpClient('DEFAULT'))
const ssoApi = new HttpService(createHttpClient('SSO'))

type ApiCallOptions = {
  method: HttpMethod
  endpoint: string
  body?: any
  headers?: Record<string, string>
  params?: Record<string, string | number>
  label?: string
  client?: 'DEFAULT' | 'SSO'
}

export async function callApi({
  method,
  endpoint,
  body,
  headers,
  params,
  label = 'API Call',
  client = 'DEFAULT'
}: ApiCallOptions): Promise<AxiosResponse<any>> {

  const svc = client === 'SSO' ? ssoApi : api

  allure.attachment(
    `${label} - Request`,
    JSON.stringify({ method, endpoint, headers, params, body }, null, 2),
    'application/json'
  )

  try {
    const res = await svc.request(
      method.toLowerCase() as any,
      endpoint,
      body,
      { headers, params }
    )

    allure.attachment(
      `${label} - Response`,
      JSON.stringify(res.data, null, 2),
      'application/json'
    )

    return res

  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response) {
      allure.attachment(
        `${label} - Error`,
        JSON.stringify(
          { status: err.response.status, data: err.response.data },
          null,
          2
        ),
        'application/json'
      )
    }
    throw err
  }
}

/* Convenience wrappers */
export const apiCall = {
  get: (o: Omit<ApiCallOptions, 'method'>) => callApi({ ...o, method: 'GET' }),
  post: (o: Omit<ApiCallOptions, 'method'>) => callApi({ ...o, method: 'POST' }),
  put: (o: Omit<ApiCallOptions, 'method'>) => callApi({ ...o, method: 'PUT' }),
  patch: (o: Omit<ApiCallOptions, 'method'>) => callApi({ ...o, method: 'PATCH' }),
  delete: (o: Omit<ApiCallOptions, 'method'>) => callApi({ ...o, method: 'DELETE' })
}
