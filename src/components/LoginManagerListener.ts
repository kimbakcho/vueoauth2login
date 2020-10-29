export default interface LoginManagerListener {
    onLogin(accessToken: string): void;
}