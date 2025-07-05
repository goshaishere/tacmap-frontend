import { defineStore } from 'pinia'
import { ranks } from '../data/ranks.js'
import { roles } from '../data/roles.js'
import { defaultSquads } from '../data/squads.js'

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
    }
}

function loadUserFromLS() {
    try {
        const raw = localStorage.getItem(LS_KEY)
        if (!raw) return getDefaultUser()
        const data = JSON.parse(raw)
        data.rank = ranks.find(r => r.key === data.rank.key) || ranks[0]
        data.role = roles.find(r => r.key === data.role.key) || roles[0]
        data.squad = defaultSquads.find(s => s.key === data.squad.key) || defaultSquads[0]
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
    },
})