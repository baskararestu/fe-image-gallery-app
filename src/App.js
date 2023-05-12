import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Verification from "./pages/Verification";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div data-theme="cupcake">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verification/:token" element={<Verification />} />
      </Routes>
    </div>
  );
}

export default App;
