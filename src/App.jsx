import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import { ClipsProvider } from "./components/ClipsContext";

import NotFoundPage from "./pages/NotFoundPage";

function App() {
    const [user] = useAuthState(auth);
    return (
        <ClipsProvider>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </ClipsProvider>
    );
}
export default App;
