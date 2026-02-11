import { AuthService } from '../../src/auth/auth.service'
import { AUTH_ENDPOINTS } from '../../src/endpoints/auth.endpoint'
import { TestContext } from '../../src/context/test.context'
import { apiCall } from '../../src/helper/api/api.call'
import ResponseValidator from '../../src/http/response.validator'

describe('Auth - Login Flow', () => {

  it('[no-login] should generate access token successfully', async () => {

    const contactNumber = '7636037003'
    const auth = new AuthService()

    // Step 1: Login to SSO
    const sessionResponse = await auth.loginInToSSO(contactNumber)

    ResponseValidator.hasKey(sessionResponse, 'accessCode')
    ResponseValidator.hasKey(sessionResponse, 'codeVerifier')

    const requestPayload = {
      accessCode: sessionResponse.accessCode,
      codeVerifier: sessionResponse.codeVerifier
    }

    // Step 2: Exchange access code for token
    const response: any = await apiCall.post({
      endpoint: AUTH_ENDPOINTS.LOGIN,
      body: requestPayload,
      label: 'Login API'
    })

    // Step 3: Validations
    ResponseValidator.status(response.status, 200)
    ResponseValidator.hasKey(response.data, 'data')
    ResponseValidator.hasKey(response.data.data, 'token')

    const accessToken = response.data.data.token

    ResponseValidator.value(
      typeof accessToken,
      'string'
    )

    // Step 4: Store in TestContext
    TestContext.authToken = accessToken
  })
})
