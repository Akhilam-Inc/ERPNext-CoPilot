

import { FrappeProvider } from 'frappe-react-sdk'
import SignupCard from './Login'
import { ChakraProvider } from '@chakra-ui/react'
import { HomePage } from './Home'
import { ProtectedRoute } from './utils/protectedRoutes'
import { UserProvider } from './Context/UserContext'
import { Route, Routes } from 'react-router-dom'


function App() {


  return (
    <div className="App">
      <FrappeProvider enableSocket={false}>
        <ChakraProvider>
          <UserProvider>
            <Routes>
              <Route path="/erpnextcopilot/login" element={<SignupCard />} />
              <Route path="/erpnextcopilot/*" element={
                <ProtectedRoute />
              }>
                <Route path="/erpnextcopilot/*" element={<HomePage />} />
              </Route>
            </Routes>
          </UserProvider>
        </ChakraProvider>
      </FrappeProvider>
    </div>
  )
}

export default App
