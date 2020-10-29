
import axios from "axios";
import { AccessTokenGetter } from './AccessTokenGetter';
import TokenManager from '../TokenManager';
import OAuth2TokenResponse from '../OAuth2TokenResponse';


export  default  class  AccessTokenWithRefreshToken implements  AccessTokenGetter{

    authUrl: string;
    tokenManager: TokenManager;

    constructor(authUrl: string,tokenManager: TokenManager) {
        this.authUrl = authUrl;
        this.tokenManager = tokenManager;
    }

    async getAccessToken(): Promise<OAuth2TokenResponse> {
        if(!this.tokenManager.hasReFreshTokenInLocalStore()){
            throw new Error("hasReFreshTokenInLocalStore Error")
        }
        const response = await axios.post<OAuth2TokenResponse>(this.authUrl,null,{
            params:{
                refreshToken: this.tokenManager.reFreshToken
            }
        });
        return response.data;

    }

}

