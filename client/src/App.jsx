import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import { AppProvider, AppContext } from "./context/AppContext";
import { useContext } from "react";
import "./styles/global.css";

const ProtectedRoute = ({ children }) => {
  const { adminLogged } = useContext(AppContext);
  return adminLogged ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <>
          <Routes>

            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />

            <Route path="/admin" element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } />

          </Routes>
        </>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
