import Log from '../../src/utils/logger';
import HttpService from '../../src/http/http.service';
import { createHttpClient } from '../../src/http/http.client';
import CryptoJS from 'crypto-js';
export class AuthService {

generateRandomString(length: number = 20): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }
    return result;
}

generateCodeChallenge(str: string): string {
    const fullHash = CryptoJS.SHA256(str).toString(CryptoJS.enc.Hex);
    return fullHash.substring(0, 32);
}


async loginInToSSO(contactNumber:any='', memberUUID:string=''){
    const codeVerifier = this.generateRandomString()
    const codeChallenge = this.generateCodeChallenge(codeVerifier)
    const appId = 11
    let accessCode=''

    let contact:string|[]=contactNumber
    Log.info(`Code Verifier Generated: ${codeVerifier}`)
    Log.info(`Code Challenge Generated: ${codeChallenge}`)
    //const redirectURL=`http://192.168.0.118:3000`
    if(typeof(contactNumber)!='string'){
        if(contactNumber!=null && contactNumber!=undefined){
            contact=contactNumber[0]
        }
    } 
    try{
        const ssoApi = new HttpService(createHttpClient('SSO'))
    const signInContactResponse:any = await ssoApi.request(
        'post',
        '/auth/signinContact',
        {
            "contactNo": contactNumber
        }
    )
    Log.info(`SignInCodeResponse: ${JSON.stringify(signInContactResponse.data)}`)
    const otpRequestId = signInContactResponse.data?.data?.otpRequestId
    Log.info(`otpRequestId: ${otpRequestId}`)

    const verifyOTPResponse:any = await ssoApi.request(
        'post',
        '/auth/verifyOTP',
        {
            "id": parseInt(otpRequestId),
            "otp": "757657",
            "appId": appId,
            "codeChallenge": codeChallenge
        }
    )

    const stateToken = verifyOTPResponse.data?.data?.stateToken

    if (stateToken){
        let memUUID=''
        if(verifyOTPResponse.data?.data?.members[0]?.fullName=='DYUTISUNDAR DUTTA'){
            memUUID = verifyOTPResponse.data?.data?.members[0].memuuid
        }else if(verifyOTPResponse.data?.data?.members[1]?.fullName=='DYUTISUNDAR DUTTA')
            memUUID = verifyOTPResponse.data?.data?.members[1].memuuid
        else if(memberUUID.length>0){
            memUUID=memberUUID
        }else{
            memUUID = verifyOTPResponse.data?.data?.members[0].memuuid
        }
        const sessionResponse:any = await ssoApi.request(
            'post',
            '/auth/createSession',
            {
                "userId": memUUID,
                "appId": appId,
                "codeChallenge": codeChallenge
            },
              {
            "headers": {
            "state-token": stateToken   // ✅ pass in header
            }
            }
        )

        accessCode = sessionResponse.data?.data?.accessCode;
        console.log(accessCode)
    }
    else{
        accessCode = verifyOTPResponse.data?.data?.accessCode;
    }

    }catch(exception)
    {
        throw exception
    }
    
    // login with accessCode and codeVerifier
    return {
        'accessCode':accessCode,
        'codeVerifier':codeVerifier
    }
}


}
