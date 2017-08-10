import Vue from 'vue'
import Electron from 'vue-electron'
import Router from 'vue-router'
import ContextMenu from '@/plugins/ContextMenu';

import App from './App.vue'
import routes from './routes'
import store  from './store';

import './assets/less/all.less';
import 'font-awesome-webpack';

import '@/directives/inline-textbox';

// meh
import vex from 'vex-js';
vex.registerPlugin(require('vex-dialog'));
vex.defaultOptions.className = 'vex-theme-top';

import 'vex-js/dist/css/vex.css';
import 'vex-js/dist/css/vex-theme-top.css';

Vue.use(Electron);
Vue.use(Router);
Vue.use(ContextMenu);
Vue.config.debug = true;

//
import DirectoryManager from '@/components/DirectoryManager';
import ItemManager from '@/components/ItemManager';

Vue.use({
    install(Vue, options)
    {
        Vue.prototype.$directories = new DirectoryManager(store);
        Vue.prototype.$items       = new ItemManager(store);
    }
});

const router = new Router({
    scrollBehavior: () => ({ y: 0 }),
    routes
});

new Vue({
    router,
    store,
    ...App
}).$mount('#app');