import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: true //!!localStorage.getItem('auth'),
    }),
    actions: {
        login() {
            this.isAuthenticated = true
            localStorage.setItem('auth', '1')
        },
        logout() {
            this.isAuthenticated = false
            localStorage.removeItem('auth')
        },
    },
})