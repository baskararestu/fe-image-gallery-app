import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Verification from "./pages/Verification";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import { useEffect } from "react";
import Profile from "./pages/Profile";
import MyPost from "./pages/MyPost";
import ContentDetails from "./pages/ContentDetails";
import ContentEdit from "./pages/ContentEdit";
import AddPost from "./pages/AddPost";
import ForgetPassword from "./pages/ForgetPassword";

function App() {
  const userToken = localStorage.getItem("user_token");

  const location = useLocation();

  useEffect(() => {
    // Redirect to the login page if the user token is not present
    // and the current page is not the login or register page
    if (
      !userToken &&
      location.pathname !== "/login" &&
      location.pathname !== "/register" &&
      location.pathname !== "/forget-password" &&
      !location.pathname.startsWith("/verification/")
    ) {
      window.location.replace("/login");
    }

    // Redirect to the home page if the user token is present
    // and the current page is the login or register page
    if (
      userToken &&
      (location.pathname === "/login" || location.pathname === "/register")
    ) {
      window.location.replace("/");
    }
  }, [userToken, location.pathname]);

  return (
    <div data-theme="cupcake">
      <Navbar />
      <Routes>
        <Route path="/verification/:token" element={<Verification />} />
        {!userToken ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/add-post" element={<AddPost />} />
            <Route path="/my-post" element={<MyPost />} />
            <Route path="/edit/:id" element={<ContentEdit />} />
            <Route path="/content-details/:id" element={<ContentDetails />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
