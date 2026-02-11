import Log from '../utils/logger';
import HttpService from '../../src/http/http.service';
import { createHttpClient } from '../../src/http/http.client';
import { AUTH_ENDPOINTS } from '../endpoints/auth.endpoint';
import { AuthService } from '../auth/auth.service';
import DataGenerator from '../../src/utils/data.generator';
import { ENV } from '../helper/env/env.config';
import { TestContext } from '../../src/context/test.context';

export class LoginFixture {
  static async ensureLoggedIn(
    logInUser: string = ''
  ): Promise<void> {
    const ctx = `[LoginFixture.ensureLoggedIn]`;

    Log.info(
      `${ctx} 🔐 Start login flow | logInUser=${logInUser || 'N/A'}`
    );

    try {
      // ✅ reuse token if already generated in suite
      if (TestContext.authToken) {
        Log.info(`${ctx} ✅ Token already present in TestContext. Skipping login.`);
        return;
      }

      let contact: string = '';
      // let memberUUID: string = '';
      let contacts: string[] = [];

      // -----------------------------
      // Determine contact number / UUID
      // -----------------------------
      contact =
          ENV.LOGIN_CONTACT_NUMBER ||
          (await DataGenerator.getRandomRegisteredSSOMemberContactNumber());

        if (!contact || contact.trim() === '') {
          throw new Error(`${ctx} ❌ contact is empty for single login`);
        }

        Log.info(
          `${ctx} 📞 Selected contact for single login (masked)=${maskContact(contact)}`
        );

      // -----------------------------
      // Login into SSO
      // -----------------------------
      const auth = new AuthService();

      Log.info(
        `${ctx} 🔐 Logging in via SSO | memberUUID=${logInUser || 'N/A'}`
      );

      let session: any;
      session = await auth.loginInToSSO(contact, logInUser);

      if (!session?.accessCode || !session?.codeVerifier) {
        throw new Error(
          `${ctx} ❌ Invalid SSO session received. Missing accessCode/codeVerifier. session=${safeStringify(
            session
          )}`
        );
      }

      Log.info(`${ctx} ✅ SSO session received (accessCode present, codeVerifier present)`);

      // -----------------------------
      // Exchange for access token
      // -----------------------------
      const payload = {
        accessCode: session.accessCode,
        codeVerifier: session.codeVerifier
      };

      Log.info(`${ctx} 🌐 Calling LOGIN API endpoint=${AUTH_ENDPOINTS.LOGIN}`);

      let loginRes: any;
      try {
        const apiService = new HttpService(createHttpClient('DEFAULT'))
        loginRes = await apiService.request('post',AUTH_ENDPOINTS.LOGIN, payload);
      } catch (e: any) {
        throw new Error(
          `${ctx} ❌ API LOGIN call failed | endpoint=${AUTH_ENDPOINTS.LOGIN} | error=${
            e?.message || e
          }`
        );
      }

      const accessToken = loginRes?.data?.data?.accessToken || loginRes?.data?.accessToken;

      if (!accessToken) {
        throw new Error(
          `${ctx} ❌ accessToken missing in login response.
            logInUser=${logInUser || 'N/A'}
            endpoint=${AUTH_ENDPOINTS.LOGIN}
            response=${safeStringify(loginRes?.data)}`
        );
      }

      TestContext.authToken = accessToken;
      Log.info(`${ctx} ✅ Login success. accessToken stored in TestContext.`);
    } catch (err: any) {
      Log.error(
        `${ctx} 🛑 Login failed | logInUser=${
          logInUser || 'N/A'
        } | error=${err?.message || err}`
      );
      throw err;
    }
  }
}

/** Mask contact number in logs */
function maskContact(contact: string): string {
  if (!contact) return 'N/A';
  const s = String(contact);
  if (s.length <= 4) return '****';
  return `${s.slice(0, 2)}******${s.slice(-2)}`;
}

/** Avoid crash due to circular JSON */
function safeStringify(data: any): string {
  try {
    return JSON.stringify(data);
  } catch {
    return String(data);
  }
}
