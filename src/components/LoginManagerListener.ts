export interface LoginManagerListener {
    onLogin(accessToken: string): void;
}