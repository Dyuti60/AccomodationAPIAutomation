import { jwtDecode } from 'jwt-decode';

type JwtPayload = {
    appId: number,
    memuuid: string,
    familyCode: string,
    memberCode: string,
    firstName: string,
    middleName: string,
    lastName: string,
    iat: number,
    exp: number
};

export function getMemIdFromJwt(token: string): string {
  const decoded = jwtDecode<JwtPayload>(token);

  const memId =
    decoded.memuuid

  if (!memId) {
    throw new Error(`memId not found in JWT payload. Payload: ${JSON.stringify(decoded)}`);
  }

  return memId;
}
