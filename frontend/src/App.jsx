import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProfileDetail from "./pages/Profile";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import AdminControl from "./pages/admin/AdminControl";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import BlogNews from "./pages/BlogNews";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:id" element={<ProfileDetail />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminControl />
            </ProtectedRoute>
          }
        />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/blog" element={<BlogNews />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
