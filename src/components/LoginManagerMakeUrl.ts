import OAuth2ClientInfo from "../components/OAuth2ClientInfo";

export default interface  LoginManagerMakeUrl {
    makeUrl(oAuth2ClientInfo: OAuth2ClientInfo): string;
}