import Home from './pages/Home.vue'
import Map from './pages/Map.vue'
import Settings from './pages/Settings.vue'
import CompanySettings from './pages/CompanySettings.vue'
import NotFound from './pages/NotFound.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'

export default [
    { path: '/login', component: Login, name: 'Login', meta: { layout: 'auth' } },
    { path: '/register', component: Register, name: 'Register', meta: { layout: 'auth' } },
    { path: '/', component: Home, name: 'Home', meta: { requiresAuth: true } },
    { path: '/map', component: Map, name: 'Map', meta: { requiresAuth: true } },
    { path: '/settings', component: Settings, name: 'Settings', meta: { requiresAuth: true } },
    { path: '/settings/company', component: CompanySettings, name: 'CompanySettings', meta: { requiresAuth: true } },
    {
        path: '/settings/theme',
        component: () => import('./pages/ThemeSettings.vue'),
        name: 'ThemeSettings',
        meta: { requiresAuth: true }
    },
    {
        path: '/profile',
        component: () => import('./pages/Profile.vue'),
        name: 'Profile',
        meta: { requiresAuth: true }
    },
    {
        path: '/tasks',
        component: () => import('./pages/Tasks.vue'),
        name: 'Tasks',
        meta: { requiresAuth: true }
    },
    {
        path: '/help',
        component: () => import('./pages/Help.vue'),
        name: 'Help'
    },
    {
        path: '/messages',
        component: () => import('./pages/Messages.vue'),
        name: 'Messages',
        meta: { requiresAuth: true }
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]