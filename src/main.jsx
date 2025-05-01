import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import {AuthProvider} from "./hooks/useAuth.jsx";
import AppRouter from "./AppRouter.jsx";
import "./styles/global.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <AppRouter/>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);
