import { Routes, Route } from "react-router-dom"
import SignIn from "./pages/signin"
import SignUp from "./pages/signup"
import Dashboard from "./pages/dashboard/Dashboard"

export const RoutesComponent = () => {
    return (
        <Routes>
            <Route index path="/login" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/" element={<Dashboard />} />
        </Routes>
    )
}