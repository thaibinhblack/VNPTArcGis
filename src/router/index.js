import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '@/components/Index.vue'
import Login from '@/components/Login.vue'
import Admin from '@/components/admin/Index.vue'
import User from '@/components/admin/User.vue'
import ResetPassword from '@/components/ResetPassword.vue'
Vue.use(VueRouter)
const routes = [
    {
        path: '/',
        name: 'Index',
        component: Index
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/reset',
        name: 'ResetPassword',
        component:ResetPassword
    },
    {
        path: '/admin',
        name:'Admin',
        component: Admin,
        children: [
            {
                path: '/user',
                component: User
            }
        ]
    }
]

export default new VueRouter({
    routes: routes,
    mode: 'history'
});
