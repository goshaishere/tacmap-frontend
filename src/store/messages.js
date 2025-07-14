import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMessagesStore = defineStore('messages', () => {
    // Состояние
    const messages = ref([])
    const conversations = ref([])
    const activeConversation = ref(null)
    const loading = ref(false)
    const error = ref(null)
    const unreadCount = ref(0)

    // Типы сообщений
    const messageTypes = {
        TEXT: 'text',
        IMAGE: 'image',
        FILE: 'file',
        LOCATION: 'location',
        TASK: 'task',
        SYSTEM: 'system'
    }

    // Типы чатов
    const conversationTypes = {
        PRIVATE: 'private',
        GROUP: 'group',
        CHANNEL: 'channel',
        BROADCAST: 'broadcast'
    }

    // Геттеры
    const totalMessages = computed(() => messages.value.length)

    const totalConversations = computed(() => conversations.value.length)

    const activeMessages = computed(() => {
        if (!activeConversation.value) return []
        return messages.value.filter(msg => msg.conversationId === activeConversation.value)
    })

    const recentConversations = computed(() => {
        return conversations.value
            .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
            .slice(0, 10)
    })

    const unreadConversations = computed(() => {
        return conversations.value.filter(conv => conv.unreadCount > 0)
    })

    // Действия для сообщений
    const addMessage = (message) => {
        const newMessage = {
            id: Date.now() + Math.random(),
            timestamp: new Date().toISOString(),
            status: 'sent',
            ...message
        }
        messages.value.unshift(newMessage)

        // Обновляем последнее сообщение в чате
        updateConversationLastMessage(message.conversationId, newMessage)

        return newMessage
    }

    const updateMessage = (messageId, updates) => {
        const index = messages.value.findIndex(msg => msg.id === messageId)
        if (index !== -1) {
            messages.value[index] = {
                ...messages.value[index],
                ...updates,
                updatedAt: new Date().toISOString()
            }
        }
    }

    const deleteMessage = (messageId) => {
        const index = messages.value.findIndex(msg => msg.id === messageId)
        if (index !== -1) {
            messages.value.splice(index, 1)
        }
    }

    const markMessageAsRead = (messageId) => {
        updateMessage(messageId, { status: 'read' })
    }

    // Действия для чатов
    const addConversation = (conversation) => {
        const newConversation = {
            id: Date.now() + Math.random(),
            createdAt: new Date().toISOString(),
            unreadCount: 0,
            ...conversation
        }
        conversations.value.unshift(newConversation)
        return newConversation
    }

    const updateConversation = (conversationId, updates) => {
        const index = conversations.value.findIndex(conv => conv.id === conversationId)
        if (index !== -1) {
            conversations.value[index] = {
                ...conversations.value[index],
                ...updates,
                updatedAt: new Date().toISOString()
            }
        }
    }

    const deleteConversation = (conversationId) => {
        const index = conversations.value.findIndex(conv => conv.id === conversationId)
        if (index !== -1) {
            conversations.value.splice(index, 1)
        }

        // Удаляем все сообщения этого чата
        messages.value = messages.value.filter(msg => msg.conversationId !== conversationId)
    }

    const setActiveConversation = (conversationId) => {
        activeConversation.value = conversationId

        // Помечаем все сообщения как прочитанные
        if (conversationId) {
            messages.value
                .filter(msg => msg.conversationId === conversationId && msg.status !== 'read')
                .forEach(msg => markMessageAsRead(msg.id))

            // Сбрасываем счетчик непрочитанных
            updateConversation(conversationId, { unreadCount: 0 })
        }
    }

    const updateConversationLastMessage = (conversationId, message) => {
        updateConversation(conversationId, {
            lastMessage: message.content,
            lastMessageAt: message.timestamp,
            lastMessageBy: message.senderId
        })
    }

    const markConversationAsRead = (conversationId) => {
        updateConversation(conversationId, { unreadCount: 0 })

        // Помечаем все сообщения как прочитанные
        messages.value
            .filter(msg => msg.conversationId === conversationId)
            .forEach(msg => markMessageAsRead(msg.id))
    }

    // Утилиты
    const getConversationById = (conversationId) => {
        return conversations.value.find(conv => conv.id === conversationId)
    }

    const getMessagesByConversation = (conversationId) => {
        return messages.value.filter(msg => msg.conversationId === conversationId)
    }

    const searchMessages = (query) => {
        const searchLower = query.toLowerCase()
        return messages.value.filter(msg =>
            msg.content.toLowerCase().includes(searchLower) ||
            msg.senderName.toLowerCase().includes(searchLower)
        )
    }

    const searchConversations = (query) => {
        const searchLower = query.toLowerCase()
        return conversations.value.filter(conv =>
            conv.name.toLowerCase().includes(searchLower) ||
            conv.lastMessage.toLowerCase().includes(searchLower)
        )
    }

    // Мобильные утилиты
    const getConversationsForMobile = () => {
        return conversations.value.map(conv => ({
            id: conv.id,
            name: conv.name,
            type: conv.type,
            unreadCount: conv.unreadCount,
            lastMessage: conv.lastMessage,
            lastMessageAt: conv.lastMessageAt,
            // Сокращенное последнее сообщение для мобильных
            shortLastMessage: conv.lastMessage && conv.lastMessage.length > 50 ?
                conv.lastMessage.substring(0, 50) + '...' :
                conv.lastMessage,
            // Форматированное время
            formattedTime: formatMessageTime(conv.lastMessageAt)
        }))
    }

    const getMessagesForMobile = (conversationId) => {
        return getMessagesByConversation(conversationId).map(msg => ({
            id: msg.id,
            content: msg.content,
            type: msg.type,
            senderId: msg.senderId,
            senderName: msg.senderName,
            timestamp: msg.timestamp,
            status: msg.status,
            // Форматированное время
            formattedTime: formatMessageTime(msg.timestamp),
            // Сокращенное содержимое для мобильных
            shortContent: msg.content && msg.content.length > 100 ?
                msg.content.substring(0, 100) + '...' :
                msg.content
        }))
    }

    // Вспомогательные функции
    const formatMessageTime = (timestamp) => {
        if (!timestamp) return ''

        const date = new Date(timestamp)
        const now = new Date()
        const diffInHours = (now - date) / (1000 * 60 * 60)

        if (diffInHours < 24) {
            return date.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit'
            })
        } else if (diffInHours < 48) {
            return 'Вчера'
        } else {
            return date.toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit'
            })
        }
    }

    return {
        // Состояние
        messages,
        conversations,
        activeConversation,
        loading,
        error,
        unreadCount,

        // Константы
        messageTypes,
        conversationTypes,

        // Геттеры
        totalMessages,
        totalConversations,
        activeMessages,
        recentConversations,
        unreadConversations,

        // Действия для сообщений
        addMessage,
        updateMessage,
        deleteMessage,
        markMessageAsRead,

        // Действия для чатов
        addConversation,
        updateConversation,
        deleteConversation,
        setActiveConversation,
        markConversationAsRead,

        // Утилиты
        getConversationById,
        getMessagesByConversation,
        searchMessages,
        searchConversations,

        // Мобильные утилиты
        getConversationsForMobile,
        getMessagesForMobile
    }
})