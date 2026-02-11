// src/hooks/jest.hooks.ts

// import { allure } from 'allure-js-commons'
import { allure } from '../utils/allure'
import Log from '../utils/logger'
import { ENV } from '../helper/env/env.config'
import { LoginFixture } from '../fixtures/login.fixture'
import { TestContext } from '../context/test.context'
import { testLogBuffer } from '../utils/logger'


/**
 * ============================
 * GLOBAL BEFORE (per test file)
 * ============================
 */
beforeAll(async () => {
  Log.info('🚀 API Test File Initialization')
  Log.info(`🌍 Environment: ${ENV.SYS_ENV || 'local'}`)

  // Reset shared context
  TestContext.authToken = ''
  TestContext.lastResponse = null
})

/**
 * ============================
 * BEFORE EACH TEST
 * ============================
 */
beforeEach(async () => {

  const testName = expect.getState().currentTestName || ''

  Log.info(`▶️ START TEST → ${testName}`)

  // Allure metadata
  allure.epic('API Automation')
  allure.feature('Backend APIs')
  allure.story(testName)

  /**
   * Custom Jest Tags:
   * 
   * [no-login]  → skip login
   * [public]    → skip login
   * [auth]      → force login (default behavior anyway)
   */

  const skipLogin =
    testName.includes('[no-login]') ||
    testName.includes('[public]')

  if (!skipLogin) {
    await LoginFixture.ensureLoggedIn()
    Log.info('🔐 Login applied')
  } else {
    Log.info('⏭️ Login skipped due to test tag')
  }
})

/**
 * ============================
 * AFTER EACH TEST
 * ============================
 */
afterEach(() => {

  const state = expect.getState()
  const testName = state.currentTestName
  const errors = state.suppressedErrors

  // Attach execution logs (always or only on failure)
  allure.attachment(
    'Execution Logs',
    testLogBuffer.getAll(),
    'text/plain'
  )

  if (errors?.length) {

    if (TestContext.lastResponse) {
      allure.attachment(
        'Last API Response',
        JSON.stringify(
          {
            status: TestContext.lastResponse.status,
            headers: TestContext.lastResponse.headers,
            body: TestContext.lastResponse.data
          },
          null,
          2
        ),
        'application/json'
      )
    }

    allure.attachment(
      'Error Stack',
      errors.map(e => e.stack || e.message).join('\n'),
      'text/plain'
    )
  }

  // Important: clear logs after test
  testLogBuffer.clear()
})
