// src/test-utils/api.expect.ts
import axios from 'axios'
import ResponseValidator from 'api/response.validator'
import { callApi, HttpMethod } from './api.call'

type ExpectApiErrorArgs = {
  method: HttpMethod
  endpoint: string
  body?: any
  headers?: Record<string, string>
  params?: Record<string, string | number>
  expectedStatus: number
  expectedErrorBody?: any
  expectedErrorMessage?: string
  client?: 'DEFAULT' | 'SSO'
}

export async function expectApiError({
  method,
  endpoint,
  body,
  headers,
  params,
  expectedStatus,
  expectedErrorBody,
  expectedErrorMessage,
  client
}: ExpectApiErrorArgs) {

  try {
    await callApi({
      method,
      endpoint,
      body,
      headers,
      params,
      client,
      label: 'Negative API Call'
    })

    throw new Error(`Expected ${method} ${endpoint} to fail`)

  } catch (err: any) {
    expect(axios.isAxiosError(err)).toBe(true)
    expect(err.response).toBeDefined()

    const res = err.response!

    ResponseValidator.status(res.status, expectedStatus)

    if (expectedErrorMessage !== undefined) {
      ResponseValidator.value(res.data?.message, expectedErrorMessage)
    }

    if (expectedErrorBody !== undefined) {
      ResponseValidator.jsonEquals(res.data, expectedErrorBody)
    }

    return res
  }
}
