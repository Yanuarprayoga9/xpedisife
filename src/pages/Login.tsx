import React from 'react'
import { useUsers } from '../hooks/users/useUsers'

const Login = () => {
    const { data, isLoading } = useUsers()
    return (
        <div>
            {
                data && !isLoading && (
                    JSON.stringify(data)
                )

            }
        </div>
    )
}

export default Login
