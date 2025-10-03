import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { Toaster } from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { Spinner } from "./assets/assets";

function App() {
  const { authUser, loading } = useAuth();

  return (
    <div
      className={`bg-[url('./src/assets/bgImage.svg')] bg-cover bg-no-repeat bg-center min-h-screen ${
        loading ? "flex justify-center items-center" : ""
      } `}
    >
      <Toaster />
      {loading ? (
        <Spinner className="text-white w-[50px] h-[50px]" />
      ) : (
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
        </Routes>
      )}
    </div>
  );
}

export default App;
