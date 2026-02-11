// src/http/http.client.ts

import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig
} from 'axios'
import https from 'https'
import Log from '../utils/logger'
import { ENV } from '../helper/env/env.config'
import { TestContext } from '../context/test.context'
// import { allure } from 'allure-jest'
import { allure } from '../utils/allure'

type ClientType = 'DEFAULT' | 'SSO'

let interceptorsAttached = false

export function createHttpClient(type: ClientType): AxiosInstance {

  const isSSO = type === 'SSO'

  const client = axios.create({
    baseURL: isSSO
      ? 'https://sso.test.satsang.org.in/api/v1'
      : ENV.BASE_API_URL,

    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      Accept: isSSO ? '*/*' : 'application/json'
    },
    httpsAgent: isSSO
      ? new https.Agent({ rejectUnauthorized: false })
      : undefined
  })

  // Attach interceptors only once
  if (!interceptorsAttached) {
    interceptorsAttached = true

    client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {

        if (TestContext.authToken) {
          config.headers.set('Authorization', TestContext.authToken)
        }

        allure.step(
          `API REQUEST → ${config.method?.toUpperCase()} ${config.url}`,
          () => {}
        )

        Log.info(`➡️ ${config.method?.toUpperCase()} ${config.url}`)
        Log.info(`Headers: ${JSON.stringify(config.headers)}`)
        Log.info(`Payload: ${JSON.stringify(config.data)}`)

        return config
      }
    )

    client.interceptors.response.use(
      (response: AxiosResponse) => {
        TestContext.lastResponse = response
        return response
      },
      (error: AxiosError) => {
        TestContext.lastResponse = error.response || null
        return Promise.reject(error)
      }
    )
  }

  return client
}
