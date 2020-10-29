# vueOAuth2Login

oAuth2 with SPA(vue) 



**example**

`Redirect Page config`

`router`

`router mode need to set history mode`

RedirectPageChild is customPage 


```
import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import Preference from "@/Preference";
import {RedirectPage} from "vueoauth2login";
import RedirectPageChild from "@/views/RedirectPageChild.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: () =>
      import(
        /* webpackPrefetch: false */ "@/views/Home.vue"
      )
  },
  {
    path: "/RedirectPage",
    name: "RedirectPage",
    component: RedirectPage,
    props: (route) => ({
      authUrl: Preference.authUrl,
      reFreshTokenUrl: Preference.reFreshTokenUrl,
      loginPageUrl: Preference.loginPageUrl,
      clientId: Preference.clientId,
      reDirectUrl: Preference.reDirectUrl,
      routerPushPage: Preference.routerPushPage,
      accessTokenKey: Preference.accessTokenKey,
      reFreshTokenKey: Preference.reFreshTokenKey,
      scope: Preference.scope,
      state: Preference.state,
      reFreshTokenTimeout: Preference.reFreshTokenTimeout
    }),
    children:[
      {
        path:"child",
        name:"child",
        component: RedirectPageChild,
      }
    ]
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  mode: 'history',
  routes,
});

export default router;
```

`Preference`
```
export default class Preference {
    static authUrl = "/test/token/auth";
    static reFreshTokenUrl = "/test/token/reFreshToken";
    static loginPageUrl = process.env.NODE_ENV === 'production'
        ? 'http://10.20.10.114:8080/fAuth/login'
        : 'http://10.20.10.114:8080/fAuth/login';
    static clientId = "test";

    static reDirectUrl= process.env.NODE_ENV === 'production'
        ? "http://10.20.10.114:8080/test/RedirectPage"
        : "http://localhost:8080/RedirectPage";

    static routerPushPage = "/";
    static accessTokenKey = "wAccessToken";
    static reFreshTokenKey = "wRefreshToken";
    static scope = ["message.read","message.write"];
    static state = "123";
    static reFreshTokenTimeout = "6300000";
}
```

`App.vue`

```
<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import LoginManager from "@/components/LoginManager";
import TokenManager from "@/components/TokenManager";
import OAuth2ClientInfo from "@/components/OAuth2ClientInfo";
import Preference from "@/Preference";
import LoginManagerListener from "@/components/LoginManagerListener";
import TokenManagerListener from "@/components/TokenManagerListener";

@Component
export default class App extends Vue implements LoginManagerListener,TokenManagerListener{

  oAuth2ClientInfo = new OAuth2ClientInfo(Preference.clientId, Preference.reDirectUrl
      , Preference.scope, Preference.state);

  loginManager!: LoginManager;

  async created(){
    const tokenManager = new TokenManager(Preference.accessTokenKey,Preference.reFreshTokenKey);

    tokenManager.addListeners(this);


    this.loginManager = new LoginManager(tokenManager ,
        Preference.loginPageUrl, this.oAuth2ClientInfo,Preference.reFreshTokenUrl,Number(Preference.reFreshTokenTimeout));
    
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
```