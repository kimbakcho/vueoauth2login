<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      |
      <router-link to="/about">About</router-link>
      |
      <router-link to="/RedirectPage">Redriect</router-link>
      <button @click="gotoLoginPage"> goto LoginPage</button>

      <button @click="logout"> logOut</button>
      <div v-if="loginManager.isLogin">
        로그인 됨
      </div>
      <div v-else>
        로그인 안됨.
      </div>

    </div>
    <div>
      <router-view/>
    </div>

  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import LoginManager from "@/components/LoginManager";
import TokenManager from "@/components/TokenManager";
import OAuth2ClientInfo from "@/components/OAuth2ClientInfo";
import Preference from "@/Preference";
import LoginManagerListener from "@/components/LoginManagerListener";
import TokenManagerListener from "@/components/TokenManagerListener";
import LoginManagerMakeUrl from "@/components/LoginManagerMakeUrl";

@Component
export default class App extends Vue implements LoginManagerListener, TokenManagerListener, LoginManagerMakeUrl {

  oAuth2ClientInfo = new OAuth2ClientInfo(Preference.clientId, Preference.reDirectUrl
      , Preference.scope, Preference.state);

  loginManager!: LoginManager;

  async created() {
    const tokenManager = new TokenManager(Preference.accessTokenKey, Preference.reFreshTokenKey);
    tokenManager.addListeners(this);
    this.loginManager = new LoginManager(tokenManager,
        this, this.oAuth2ClientInfo, Preference.reFreshTokenUrl, Number(Preference.reFreshTokenTimeout));
    this.loginManager.addListeners(this);
    await this.loginManager.init();
  }

  gotoLoginPage() {
    this.loginManager.goLoginPage();
  }

  async logout() {
    this.loginManager.logout();

    location.reload();
  }

  makeUrl(oAuth2ClientInfo: OAuth2ClientInfo): string {
    let scope = ""
    this.oAuth2ClientInfo.scope.forEach((x => {
      scope += `${x}+`
    }));

    scope = scope.substring(0, scope.length - 1);

    return `${Preference.loginPageUrl}?` +
        `clientId=${this.oAuth2ClientInfo.clientId}` +
        `&redirectUri=${this.oAuth2ClientInfo.reDirectionUrl}` +
        `&scope=${scope}` +
        `&state=${this.oAuth2ClientInfo.state}`

  }

  onAccessToken(accessToken: string): void {
    console.log(`onAccessToken = ${accessToken}`);
  }

  onLogin(accessToken: string): void {
    console.log(`onLogin = ${accessToken}`);
  }

  onRefreshToken(refreshToken: string): void {
    console.log(`refreshToken = ${refreshToken}`);
  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
