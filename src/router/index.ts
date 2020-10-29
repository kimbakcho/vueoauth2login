import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import RedirectPage from '../views/RedirectPage.vue'
import Preference from '../../src/Preference'


Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/RedirectPage',
    name: 'redirect',
    component: RedirectPage,
    props: (route) => ({
      authUrl: Preference.authUrl,
      reFreshTokenUrl: Preference.reFreshTokenKey,
      loginPageUrl: Preference.loginPageUrl,
      clientId: Preference.clientId,
      reDirectUrl: Preference.reDirectUrl,
      routerPushPage: Preference.routerPushPage,
      accessTokenKey: Preference.accessTokenKey,
      reFreshTokenKey: Preference.reFreshTokenKey,
      state: Preference.state
    })
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  mode: 'history',
  routes
})

export default router
