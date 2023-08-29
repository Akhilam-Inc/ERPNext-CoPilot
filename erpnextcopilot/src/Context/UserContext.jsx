import { useFrappeAuth } from 'frappe-react-sdk'
import { createContext } from 'react'


export const UserContext = createContext({
    currentUser: '',
    isLoading: false,
    isValidating: false,
    error : {},
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    updateCurrentUser: () => { },
})

export const UserProvider = ({ children }) => {

    const { login, logout, isValidating, currentUser, error, updateCurrentUser, isLoading } = useFrappeAuth()

    const handleLogout = async () => {
        return logout()
    }
    return (
        <UserContext.Provider value={{ isLoading, updateCurrentUser, login, logout: handleLogout, currentUser: currentUser ?? "", isValidating  , error}}>
            {children}
        </UserContext.Provider>
    )
}