import TokenManager from '../TokenManager';

export default class ReFreshTokenSch {
    static scheduleCode: number;
    static start(reFreshTokenUrl: string,tokenTimeOut: number,tokenManager: TokenManager){
        this.stop();
        this.scheduleCode = setInterval(async ()=>{
            await tokenManager.updateAccessTokenWithReFreshToken(reFreshTokenUrl);
        },tokenTimeOut)
    }

    static stop(){
        if(this.scheduleCode!= undefined){
            clearInterval(this.scheduleCode);
        }
    }
}