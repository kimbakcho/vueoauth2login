<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import AccessTokenWithCode from '../components/AccessToken/AccessTokenWithCode';
import TokenManager from '../components/TokenManager';
import OAuth2ClientInfo from '../components/OAuth2ClientInfo';
import LoginManager from '../components/LoginManager';
import LoginManagerMakeUrl from "../components/LoginManagerMakeUrl";


@Component
export default class RedirectPage extends Vue implements LoginManagerMakeUrl{


  @Prop(String)
  authUrl!: string;

  @Prop(String)
  reFreshTokenUrl!: string;

  @Prop(String)
  clientId!: string;

  @Prop(String)
  reDirectUrl!: string;

  @Prop(String)
  routerPushPage!: string;

  @Prop(String)
  accessTokenKey!: string;

  @Prop(String)
  reFreshTokenKey!: string;

  @Prop()
  scope!: string[];

  @Prop()
  state!: string;

  @Prop()
  reFreshTokenTimeout!: string;

  async mounted() {
    const code: string | (string | null)[] = this.$router.currentRoute.query.code;
    if(typeof(code) != "string"){
        return ;
    }
    const state: string | (string | null)[] = this.$router.currentRoute.query.state;
    if(typeof(state) != "string"){
      return ;
    }

    const accessTokenWithCode = new AccessTokenWithCode(this.authUrl, code);
    const tokenManager = new TokenManager(this.accessTokenKey,this.reFreshTokenKey);
    const oAuth2TokenResponse = await accessTokenWithCode.getAccessToken();
    if (oAuth2TokenResponse.accessToken.tokenValue != undefined) {
      tokenManager.accessToken = oAuth2TokenResponse.accessToken.tokenValue;
    }
    if (oAuth2TokenResponse.refreshToken.tokenValue != undefined) {
      tokenManager.reFreshToken = oAuth2TokenResponse.refreshToken.tokenValue;
    }
    const oAuth2ClientInfo = new OAuth2ClientInfo(this.clientId, this.reDirectUrl
        , this.scope, this.state);
    const loginManager = new LoginManager(tokenManager,this,
        oAuth2ClientInfo, this.reFreshTokenUrl,Number(this.reFreshTokenTimeout));
    await loginManager.init();
    await this.$router.push({path: this.routerPushPage});
    location.reload();
  }

  makeUrl(oAuth2ClientInfo: OAuth2ClientInfo): string {
    throw new Error("here Redirection Page can't impl");
  }

}
</script>

<style scoped>

</style>