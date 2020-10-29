import OAuth2TokenResponse from "../OAuth2TokenResponse";


export interface AccessTokenGetter{
    getAccessToken(): Promise<OAuth2TokenResponse>;
}