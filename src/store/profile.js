import { defineStore } from 'pinia'
import { ranks } from '../data/ranks.js'
import { roles } from '../data/roles.js'
import { defaultSquads } from '../data/squads.js'
import { factions } from '../data/factions.js'

const LS_KEY = 'profileData'

function getDefaultUser() {
    return {
        firstName: 'Иван',
        lastName: 'Иванов',
        callsign: 'Viking',
        avatar: '',
        rank: ranks[0],
        role: roles[0],
        squad: defaultSquads[0],
        faction: factions[0],
    }
}

function loadUserFromLS() {
    try {
        const raw = localStorage.getItem(LS_KEY)
        if (!raw) return getDefaultUser()
        const data = JSON.parse(raw)
        data.rank = ranks.find(r => r.key === data.rank.key) || ranks[0]
        data.role = roles.find(r => r.key === data.role.key) || roles[0]
            // --- исправление: ищем сквад среди кастомных и дефолтных ---
        let allSquads = []
        try {
            const customRaw = localStorage.getItem('customSquads')
            allSquads = customRaw ? JSON.parse(customRaw) : []
        } catch { allSquads = [] }
        allSquads = [...defaultSquads, ...allSquads.filter(s => !defaultSquads.some(d => d.key === s.key))]
        data.squad = allSquads.find(s => s.key === data.squad.key) || allSquads[0] || defaultSquads[0]
            // --- конец исправления ---
            // --- исправление: ищем фракцию среди кастомных и дефолтных ---
        let allFactions = []
        try {
            const customRaw = localStorage.getItem('customFactions')
            allFactions = customRaw ? JSON.parse(customRaw) : []
        } catch { allFactions = [] }
        allFactions = [...factions, ...allFactions.filter(f => !factions.some(d => d.key === f.key))]
        data.faction = allFactions.find(f => {
                if (data.faction && typeof data.faction === 'object' && 'key' in data.faction) {
                    return f.key === data.faction.key
                }
                return f.key === data.faction
            }) || allFactions[0] || factions[0]
            // --- конец исправления ---
        if (!data.avatar) data.avatar = ''
        return data
    } catch {
        return getDefaultUser()
    }
}

function saveUserToLS(user) {
    localStorage.setItem(LS_KEY, JSON.stringify(user))
}

export const useProfileStore = defineStore('profile', {
    state: () => ({
        user: loadUserFromLS()
    }),
    actions: {
        updateProfile(data) {
            this.user = {...this.user, ...data }
            saveUserToLS(this.user)
        },
        setFirstName(firstName) {
            this.user.firstName = firstName
            saveUserToLS(this.user)
        },
        setLastName(lastName) {
            this.user.lastName = lastName
            saveUserToLS(this.user)
        },
        setCallsign(callsign) {
            this.user.callsign = callsign
            saveUserToLS(this.user)
        },
        setRank(rank) {
            this.user.rank = rank
            saveUserToLS(this.user)
        },
        setRole(role) {
            this.user.role = role
            saveUserToLS(this.user)
        },
        setSquad(squad) {
            this.user.squad = squad
            saveUserToLS(this.user)
        },
        setAvatar(avatar) {
            this.user.avatar = avatar
            saveUserToLS(this.user)
        },
        setFaction(faction) {
            this.user.faction = faction
            saveUserToLS(this.user)
        },
    },
})