
import { usersApi } from './users-api'
import { queryKeys } from '../query-keys'
import { useQuery } from '@tanstack/react-query'

export const useGetUsers = () => {
    return useQuery({
        queryKey: queryKeys.users.all,
        queryFn: usersApi.getUsers
    })
}

export const useGetUserById = (id: string) => {
    return useQuery({
        enabled: !!id,
        queryKey: queryKeys.users.byId(id),
        queryFn: () => usersApi.getUserById(id)
    })
}