import {DateTime} from "luxon";
import {AccessTokenGetter} from "../components/AccessToken/AccessTokenGetter";
import AccessTokenWithRefreshToken from "../components/AccessToken/AccessTokenWithRefreshToken";
import TokenManagerListener from './TokenManagerListener';


export default class TokenManager {
    readonly accessTokenKey: string;
    readonly refreshTokenKey: string;
    tokenManagerListeners: TokenManagerListener[] = []

    constructor(accessTokenKey: string,refreshTokenKey: string) {
        this.accessTokenKey = accessTokenKey;
        this.refreshTokenKey = refreshTokenKey;
    }

    hasAccessTokenInLocalStore(): boolean {
        return this._tokenValid(this.accessTokenKey)
    }

    hasReFreshTokenInLocalStore(): boolean {
        return this._tokenValid(this.refreshTokenKey)
    }

    async updateAccessTokenWithReFreshToken(reFreshTokenUrl: string): Promise<void>{
        const accessTokenWithRefreshToken: AccessTokenGetter = new AccessTokenWithRefreshToken(reFreshTokenUrl,this);
        const oAuth2TokenResponse = await accessTokenWithRefreshToken.getAccessToken();
        if(oAuth2TokenResponse.accessToken.tokenValue != undefined){
            this.accessToken = oAuth2TokenResponse.accessToken.tokenValue;
        }
        if(oAuth2TokenResponse.refreshToken.tokenValue != undefined){
            this.reFreshToken = oAuth2TokenResponse.refreshToken.tokenValue;
        }
    }

    get reFreshToken(): string  {
        if(!this.hasReFreshTokenInLocalStore()){
            throw  new Error("token Error");
        }
        const item = localStorage.getItem(this.refreshTokenKey);
        if(item == null){
            throw  new Error("token null")
        }
        return item;
    }

    set reFreshToken(token: string) {
        localStorage.setItem(this.refreshTokenKey, token);
        this._onRefreshToken();
    }

    set accessToken(token: string) {
        localStorage.setItem(this.accessTokenKey, token);
        this._onAccessToken();
    }

    get accessToken(): string{
        if(!this.hasAccessTokenInLocalStore()){
            throw  new Error("token Error");
        }
        const item = localStorage.getItem(this.accessTokenKey);
        if (item == null) {
            throw  new Error("token null")
        }
        return item;
    }
    removeTokenAll(){
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    private _tokenValid(tokenName: string): boolean {
        const item = localStorage.getItem(tokenName);
        if (item == undefined) {
            return false;
        }
        if (item.length == 0) {
            return false;
        }
        const tokenSplit = item.split(".");
        if (tokenSplit.length == 3) {
            const bodyToken = tokenSplit[1];
            const resolve = atob(bodyToken);
            const bodyJwt = JSON.parse(resolve);
            const exp = bodyJwt.exp;
            const expDateTime = DateTime.fromSeconds(Number(exp));
            const expReMain = expDateTime.diffNow("seconds");
            if (expReMain.seconds < 0) {
                return false;
            }
        }
        return true;
    }

    private _onAccessToken() {
        this.tokenManagerListeners.forEach((x)=>{
            x.onAccessToken(this.accessToken)
        })
    }

    private _onRefreshToken() {
        this.tokenManagerListeners.forEach((x)=>{
            x.onRefreshToken(this.refreshTokenKey)
        })
    }

    addListeners(tokenManagerListener: TokenManagerListener){
        this.tokenManagerListeners.push(tokenManagerListener);
    }

    removeListeners(tokenManagerListener: TokenManagerListener){
        const number = this.tokenManagerListeners.indexOf(tokenManagerListener);
        this.tokenManagerListeners.splice(number,1);
    }
}