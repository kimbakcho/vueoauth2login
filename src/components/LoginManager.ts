import TokenManager from './TokenManager';
import OAuth2ClientInfo from './OAuth2ClientInfo';
import ReFreshTokenSch from './ReFreshToken/ReFreshTokenSch';
import LoginManagerListener  from './LoginManagerListener';
import LoginManagerMakeUrl from './LoginManagerMakeUrl';


export default class LoginManager {
    tokenManager: TokenManager;
    loginManagerMakeUrl: LoginManagerMakeUrl;
    oAuth2ClientInfo: OAuth2ClientInfo;
    reFreshTokenUrl: string;
    reFreshTokenLoopTime: number;
    private loginManagerListeners: LoginManagerListener[] = [];

    constructor(tokenManager: TokenManager,
                loginManagerMakeUrl: LoginManagerMakeUrl,
                oAuth2ClientInfo: OAuth2ClientInfo,
                reFreshTokenUrl: string,
                reFreshTokenLoopTime: number
                ) {
        this.tokenManager = tokenManager;
        this.oAuth2ClientInfo = oAuth2ClientInfo;
        this.loginManagerMakeUrl = loginManagerMakeUrl;
        this.reFreshTokenUrl = reFreshTokenUrl;
        this.reFreshTokenLoopTime = reFreshTokenLoopTime
    }

    get isLogin(): boolean{
        return this.tokenManager.hasAccessTokenInLocalStore()
    }

    goLoginPage(): void{

        if(this.loginManagerMakeUrl == undefined){
            throw new Error("loginManagerMakeUrl is null");
        }

        location.href = this.loginManagerMakeUrl.makeUrl(this.oAuth2ClientInfo);

    }

    jwtUserInfo(): any{
        if(this.tokenManager.hasAccessTokenInLocalStore()){
            const accessToken = this.tokenManager.accessToken;
            const tokens = accessToken.split(".");
            const token = tokens[1];
            const base64Decode = atob(token);
            const userInfo = JSON.parse(base64Decode);
            return userInfo;
        }
    }

    async init(): Promise<void>{
        if(this.isLogin && this.tokenManager.hasReFreshTokenInLocalStore()){
            await this.tokenManager.updateAccessTokenWithReFreshToken(this.reFreshTokenUrl);
            this._onLoginManagerListenersLogin();
            ReFreshTokenSch.start(this.reFreshTokenUrl,this.reFreshTokenLoopTime,this.tokenManager);
        }else {
            ReFreshTokenSch.stop();
        }
    }

    private _onLoginManagerListenersLogin(){
        this.loginManagerListeners.forEach((x=>{
            x.onLogin(this.tokenManager.accessToken);
        }))
    }

    addListeners(loginManagerListener: LoginManagerListener){
        this.loginManagerListeners.push(loginManagerListener);
    }

    removeListeners(loginManagerListener: LoginManagerListener){
        const number = this.loginManagerListeners.indexOf(loginManagerListener);
        this.loginManagerListeners.splice(number,1);
    }

    logout(): void{
        this.tokenManager.removeTokenAll();
        ReFreshTokenSch.stop();
    }
}