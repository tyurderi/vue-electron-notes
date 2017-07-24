import Vue from 'vue'
import Electron from 'vue-electron'
import Router from 'vue-router'

import App from './App.vue'
import routes from './routes'
import store  from './store';

import './assets/less/all.less';
import 'font-awesome-webpack';

import '@/directives/inline-textbox';

Vue.use(Electron);
Vue.use(Router);
Vue.config.debug = true;

const router = new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes
});

new Vue({
    router,
    store,
    ...App
}).$mount('#app');