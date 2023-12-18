import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import UserLayout from '@/layout/user/Layout.vue';
import AdminLayout from '@/layout/admin/Layout.vue';

import store from '../store';

const routes = [
    {
        path: '/admin',
        name: 'admin',
        component: AdminLayout,
        redirect: (to) => {
            const user = store.getters.getUser;

            if (user && user.role !== 'user') {
                return { name: 'admin.dashboard' };
            }

            return { name: 'home' };
        },
        children: [
            {
                path: 'dashboard',
                name: 'admin.dashboard',
                meta: {
                    title: 'Dashboard'
                },
                component: () => import('@/views/pages/admin/Dashboard.vue')
            },
            {
                path: 'manage/garbage',
                name: 'admin.manage.garbage',
                meta: {
                    title: 'Garbage'
                },
                component: () => import('@/views/pages/admin/manage/Garbage.vue')
            },
            {
                path: 'manage/user',
                name: 'admin.manage.user',
                meta: {
                    title: 'User'
                },
                component: () => import('@/views/pages/admin/manage/User.vue')
            },
            {
                path: 'manage/sales',
                name: 'admin.manage.sales',
                meta: {
                    title: 'Sales'
                },
                component: () => import('@/views/pages/admin/manage/Sales.vue')
            },
            {
                path: 'manage/withdrawals',
                name: 'admin.manage.withdrawals',
                meta: {
                    title: 'Withdrawals'
                },
                component: () => import('@/views/pages/admin/manage/Withdrawal.vue')
            },
            {
                path: 'organization/company',
                name: 'admin.organization.company',
                meta: {
                    title: 'Company'
                },
                component: () => import('@/views/pages/admin/organization/Company.vue')
            },
            {
                path: 'organization/collectors',
                name: 'admin.organization.collectors',
                meta: {
                    title: 'Collectors'
                },
                component: () => import('@/views/pages/admin/organization/Collector.vue')
            }
        ]
    },
    {
        path: '/user',
        name: 'user',
        component: UserLayout,
        redirect: (to) => {
            const user = store.getters.getUser;

            if (user && user.role == 'user') {
                return { name: 'user.home' };
            }

            return { name: 'home' };
        },
        children: [
            {
                path: 'home',
                name: 'user.home',
                meta: {
                    title: 'Home'
                },
                component: () => import('@/views/pages/user/Home.vue')
            }
        ]
    },
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/pages/Landing.vue')
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        redirect: (to) => {
            const user = store.getters.getUser;
            if (user && user.role == 'user') {
                return { name: 'user.home' };
            } else if (user && user.role !== 'user') {
                return { name: 'admin.dashboard' };
            } else {
                return { name: 'home' };
            }
        }
    },
    {
        path: '/pages/notfound',
        name: 'notfound',
        component: () => import('@/views/pages/NotFound.vue')
    },
    {
        path: '/auth',
        children: [
            {
                path: 'login',
                name: 'auth.login',
                beforeEach: (to) => {
                    const isAuthenticated = store.getters.isAuthenticated;
                    if (isAuthenticated) {
                        return { name: 'home' };
                    }
                },
                component: () => import('@/views/pages/auth/Login.vue')
            },
            {
                path: 'register',
                name: 'auth.register',
                beforeEach: (to) => {
                    const isAuthenticated = store.getters.isAuthenticated;
                    if (isAuthenticated) {
                        return { name: 'home' };
                    }
                },
                component: () => import('@/views/pages/auth/Register.vue')
            }
        ]
    },
    {
        path: '/auth/access',
        name: 'accessDenied',
        component: () => import('@/views/pages/auth/Access.vue')
    },
    {
        path: '/auth/error',
        name: 'error',
        component: () => import('@/views/pages/auth/Error.vue')
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title ? `${to.meta.title} - Teman Hijau` : 'Teman Hijau';
    next();
});

export default router;
