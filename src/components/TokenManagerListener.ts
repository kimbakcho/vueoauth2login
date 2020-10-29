export default interface TokenManagerListener {
    onAccessToken(accessToken: string): void;
    onRefreshToken(refreshToken: string): void;
}