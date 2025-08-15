import { BASE_URL } from '@/lib/client'
import type { User } from '../../../../shared/types'


export const usersApi = {
    getUsers: async (): Promise<User[]> => {
        const response = await fetch(`${BASE_URL}/users`)
        const data = await response.json()
        return data
    },
    getUserById: async (id: string): Promise<User> => {
        const response = await fetch(`${BASE_URL}/users/${id}`)
        const data = await response.json()
        return data
    }
}