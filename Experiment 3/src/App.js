import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import Unauthorized from "./pages/Unauthorized";

import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtected from "./components/RoleProtected";

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route

          path="/dashboard"

          element={

            <ProtectedRoute>

              <Dashboard />

            </ProtectedRoute>

          }

        />

        <Route

          path="/admin"

          element={

            <RoleProtected>

              <Admin />

            </RoleProtected>

          }

        />

        <Route

          path="/unauthorized"

          element={<Unauthorized />}

        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;