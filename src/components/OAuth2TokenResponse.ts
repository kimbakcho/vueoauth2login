export default class OAuth2TokenResponse {
  public accessToken!: AccessToken;
  public refreshToken!: RefreshToken;
  public additionalParameters!: AdditionalParameters;
}

export class AccessToken {
  public tokenValue?: string;
  public issuedAt?: string;
  public expiresAt?: string;
  public tokenType?: TokenType;
  public scopes?: string[];
}

export class TokenType {
  public value?: string;
}

export class RefreshToken {
  public tokenValue?: string;
  public issuedAt?: string;
}

export class AdditionalParameters {
  public jti?: string;
}