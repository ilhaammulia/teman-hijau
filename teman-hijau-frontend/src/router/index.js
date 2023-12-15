import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import UserLayout from '@/layout/user/Layout.vue';
import AdminLayout from '@/layout/admin/Layout.vue';

import { setTitle } from './middleware';

const routes = [
    {
        path: '/admin',
        name: 'admin',
        component: AdminLayout,
        redirect: (to) => {
            return { name: 'admin.dashboard' };
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
            return { name: 'user.home' };
        },
        children: [
            {
                path: 'home',
                name: 'user.home',
                component: () => import('@/views/pages/user/Home.vue')
            }
        ]
    },
    {
        path: '/',
        component: AppLayout,
        children: [
            {
                path: '/',
                name: 'dashboard',
                component: () => import('@/views/Dashboard.vue')
            },
            {
                path: '/uikit/formlayout',
                name: 'formlayout',
                component: () => import('@/views/uikit/FormLayout.vue')
            },
            {
                path: '/uikit/input',
                name: 'input',
                component: () => import('@/views/uikit/Input.vue')
            },
            {
                path: '/uikit/floatlabel',
                name: 'floatlabel',
                component: () => import('@/views/uikit/FloatLabel.vue')
            },
            {
                path: '/uikit/invalidstate',
                name: 'invalidstate',
                component: () => import('@/views/uikit/InvalidState.vue')
            },
            {
                path: '/uikit/button',
                name: 'button',
                component: () => import('@/views/uikit/Button.vue')
            },
            {
                path: '/uikit/table',
                name: 'table',
                component: () => import('@/views/uikit/Table.vue')
            },
            {
                path: '/uikit/list',
                name: 'list',
                component: () => import('@/views/uikit/List.vue')
            },
            {
                path: '/uikit/tree',
                name: 'tree',
                component: () => import('@/views/uikit/Tree.vue')
            },
            {
                path: '/uikit/panel',
                name: 'panel',
                component: () => import('@/views/uikit/Panels.vue')
            },

            {
                path: '/uikit/overlay',
                name: 'overlay',
                component: () => import('@/views/uikit/Overlay.vue')
            },
            {
                path: '/uikit/media',
                name: 'media',
                component: () => import('@/views/uikit/Media.vue')
            },
            {
                path: '/uikit/menu',
                component: () => import('@/views/uikit/Menu.vue'),
                children: [
                    {
                        path: '/uikit/menu',
                        component: () => import('@/views/uikit/menu/PersonalDemo.vue')
                    },
                    {
                        path: '/uikit/menu/seat',
                        component: () => import('@/views/uikit/menu/SeatDemo.vue')
                    },
                    {
                        path: '/uikit/menu/payment',
                        component: () => import('@/views/uikit/menu/PaymentDemo.vue')
                    },
                    {
                        path: '/uikit/menu/confirmation',
                        component: () => import('@/views/uikit/menu/ConfirmationDemo.vue')
                    }
                ]
            },
            {
                path: '/uikit/message',
                name: 'message',
                component: () => import('@/views/uikit/Messages.vue')
            },
            {
                path: '/uikit/file',
                name: 'file',
                component: () => import('@/views/uikit/File.vue')
            },
            {
                path: '/uikit/charts',
                name: 'charts',
                component: () => import('@/views/uikit/Chart.vue')
            },
            {
                path: '/uikit/misc',
                name: 'misc',
                component: () => import('@/views/uikit/Misc.vue')
            },
            {
                path: '/blocks',
                name: 'blocks',
                component: () => import('@/views/utilities/Blocks.vue')
            },
            {
                path: '/utilities/icons',
                name: 'icons',
                component: () => import('@/views/utilities/Icons.vue')
            },
            {
                path: '/pages/timeline',
                name: 'timeline',
                component: () => import('@/views/pages/Timeline.vue')
            },
            {
                path: '/pages/empty',
                name: 'empty',
                component: () => import('@/views/pages/Empty.vue')
            },
            {
                path: '/pages/crud',
                name: 'crud',
                component: () => import('@/views/pages/Crud.vue')
            },
            {
                path: '/documentation',
                name: 'documentation',
                component: () => import('@/views/utilities/Documentation.vue')
            }
        ]
    },
    {
        path: '/landing',
        name: 'landing',
        component: () => import('@/views/pages/Landing.vue')
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
                component: () => import('@/views/pages/auth/Login.vue')
            },
            {
                path: 'register',
                name: 'auth.register',
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
