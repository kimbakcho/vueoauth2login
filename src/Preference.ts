import OAuth2ClientInfo from "@/components/OAuth2ClientInfo";

export default class Preference {
    static authUrl = "/resource/token/auth";
    static reFreshTokenUrl = "/resource/token/reFreshToken";
    static loginPageUrl = process.env.NODE_ENV === 'production'
        ? 'http://10.20.10.114:8181/fAuth/login'
        : 'http://localhost:8080/login';
    static clientId = "resource";

    static reDirectUrl= process.env.NODE_ENV === 'production'
        ? "http://10.20.10.114:8080/authComponent/RedirectPage"
        : "http://localhost:8080/RedirectPage/ChildTest";

    static routerPushPage = "/";
    static accessTokenKey = "wAccessToken";
    static reFreshTokenKey = "wRefreshToken";
    static scope = ["message.read","message.write"];
    static state = "123";
    static reFreshTokenTimeout = "6300000"

}