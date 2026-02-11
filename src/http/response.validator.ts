// src/http/response.validator.ts

// import { allure } from 'allure-jest'
import { allure } from '../utils/allure'
import Ajv from 'ajv'
import Log from '../utils/logger'

const ajv = new Ajv({ allErrors: true })

export default class ResponseValidator {

  /* ================= STATUS ================= */

  static status(actual: number, expected: number) {
    allure.step(`Validate status code equals ${expected}`, () => {
      expect(actual).toBe(expected)
    })
    Log.info(`ASSERT → Status ${expected}`)
  }

  /* ================= BASIC ================= */

  static hasKey(obj: any, key: string) {
    allure.step(`Validate response has key: ${key}`, () => {
      expect(obj).toHaveProperty(key)
    })
    Log.info(`ASSERT → Has key: ${key}`)
  }

  static value(actual: any, expected: any) {
    allure.step(`Validate value equals expected`, () => {
      expect(actual).toEqual(expected)
    })
    Log.info(`ASSERT → Value matched`)
  }

  static arrayNotEmpty(arr: any[]) {
    allure.step(`Validate array is not empty`, () => {
      expect(Array.isArray(arr)).toBe(true)
      expect(arr.length).toBeGreaterThan(0)
    })
    Log.info(`ASSERT → Array not empty`)
  }

  /* ================= JSON ================= */

  static jsonEquals(actual: any, expected: any) {
    allure.step(`Validate JSON equals expected`, () => {
      expect(actual).toStrictEqual(expected)
    })
    Log.info(`ASSERT → JSON equals`)
  }

  static jsonContains(actual: any, subset: any) {
    allure.step(`Validate JSON contains expected subset`, () => {
      expect(actual).toMatchObject(subset)
    })
    Log.info(`ASSERT → JSON contains subset`)
  }

  static jsonValue(actual: any, path: string, expected: any) {
    allure.step(`Validate JSON path "${path}" equals "${expected}"`, () => {
      const value = path.split('.').reduce((o, k) => o?.[k], actual)
      expect(value).toEqual(expected)
    })
    Log.info(`ASSERT → JSON path ${path} = ${expected}`)
  }

  static jsonPaths(actual: any, expectedPaths: Record<string, any>) {
    allure.step(`Validate multiple JSON paths`, () => {
      Object.entries(expectedPaths).forEach(([path, expected]) => {
        const value = path.split('.').reduce((o, k) => o?.[k], actual)
        expect(value).toEqual(expected)
      })
    })
    Log.info(`ASSERT → JSON paths validated`)
  }

  static jsonEqualsIgnoreKeys(
    actual: any,
    expected: any,
    ignoreKeys: string[] = []
  ) {
    allure.step(
      `Validate JSON equals expected (ignoring keys: ${ignoreKeys.join(', ')})`,
      () => {

        const sanitize = (obj: any): any => {
          if (Array.isArray(obj)) {
            return obj.map(sanitize)
          }
          if (obj && typeof obj === 'object') {
            return Object.keys(obj).reduce((acc: any, key) => {
              if (!ignoreKeys.includes(key)) {
                acc[key] = sanitize(obj[key])
              }
              return acc
            }, {})
          }
          return obj
        }

        expect(sanitize(actual)).toStrictEqual(sanitize(expected))
      }
    )

    Log.info(`ASSERT → JSON equals (ignored keys: ${ignoreKeys.join(', ')})`)
  }

  /* ================= SCHEMA ================= */

  static schema(body: any, schema: object) {
    allure.step(`Validate response schema`, () => {

      const validate = ajv.compile(schema)
      const valid = validate(body)

      if (!valid) {
        Log.error('SCHEMA VALIDATION FAILED', validate.errors)
        throw new Error(JSON.stringify(validate.errors))
      }
    })

    Log.info(`ASSERT → Schema valid`)
  }
}
