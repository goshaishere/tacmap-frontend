import { defineStore } from 'pinia';

export const useMessagesStore = defineStore('messages', {
    state: () => ({
        messages: [],
        loading: false,
        error: null,
    }),
    getters: {
        messagesByConversation: (state) => (conversationId) =>
            state.messages.filter(msg => msg.conversationId === conversationId),
    },
    actions: {
        async fetchMessages(conversationId) {
            this.loading = true;
            try {
                // TODO: заменить на реальный API-запрос
                // const res = await fetch(`/api/messages?conversationId=${conversationId}`);
                // this.messages = await res.json();
                this.messages = [];
                this.error = null;
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
            }
        },
        async sendMessage(message) {
            // TODO: заменить на реальный API-запрос
            this.messages.push(message);
        },
        async deleteMessage(id) {
            this.messages = this.messages.filter(msg => msg.id !== id);
        },
        // Можно добавить editMessage и другие actions
    },
});