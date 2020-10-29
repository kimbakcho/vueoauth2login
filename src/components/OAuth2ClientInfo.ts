export default  class  OAuth2ClientInfo{
    clientId: string;
    reDirectionUrl: string;
    scope: string[];
    state: string;
    constructor(clientId: string,reDirectionUrl: string,scope: string[],state: string) {
        this.clientId = clientId;
        this.reDirectionUrl = reDirectionUrl;
        this.scope = scope;
        this.state = state;
    }

}