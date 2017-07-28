/**
 * @description 路由配置
 * @author minfive
 * @date 2017-07-26, 11:25:58 GMTCST
 * @lastModify minfive
 * @lastDate 2017-07-26, 11:25:58 GMTCST
 */

import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './config';

Vue.use(VueRouter);

const router = new VueRouter({
    routes
});

router.beforeEach((route, from, next) => {
    let { meta } = route;

    meta.title && (window.document.title = meta.title);
    next();
});

export default router;