/**
 * @description main入口
 * @author minfive
 * @date 2017-07-26, 10:39:43 GMTCST
 * @lastModify minfive
 * @lastDate 2017-07-26, 10:39:43 GMTCST
 */


import Vue from 'vue';
import router from './router';
import app from 'Spa@comp/app';

new Vue({
    router,
    ...app
}).$mount('#app');