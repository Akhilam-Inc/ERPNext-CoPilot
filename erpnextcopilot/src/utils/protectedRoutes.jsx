import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { UserContext } from '../Context/UserContext'

export const ProtectedRoute = (props) => {

    const { currentUser, isLoading } = useContext(UserContext)

    if (!currentUser) {
        return <Navigate to="/erpnextcopilot/login" />
    }
    return (
        <Outlet />
    )
}