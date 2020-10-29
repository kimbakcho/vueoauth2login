
import axios from "axios";
import { AccessTokenGetter } from './AccessTokenGetter';
import OAuth2TokenResponse from '../OAuth2TokenResponse';

export default class AccessTokenWithCode implements AccessTokenGetter {

    authUrl: string;
    code: string

    constructor(authUrl: string,code: string) {
        this.authUrl = authUrl;
        this.code = code;
    }

    async getAccessToken(): Promise<OAuth2TokenResponse> {

        const response = await axios.get<OAuth2TokenResponse>(this.authUrl,{
            params:{
                code: this.code
            }
        });
        return response.data;
    }

}