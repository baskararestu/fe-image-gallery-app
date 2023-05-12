import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../features/users/userSlice";
import { useDispatch } from "react-redux";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userToken = localStorage.getItem("user_token");
  const handleLogout = () => {
    // Perform logout action, such as clearing the user session
    console.log("Logged out");
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <div className="flex flex-row gap-5  navbar bg-primary">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">Image App</a>
      </div>

      {userToken ? (
        <div className="flex-none gap-2">
          <div className="btn btn-ghost">
            <button
              onClick={() => {
                navigate("/");
              }}
            >
              Home
            </button>
          </div>
          <div className="btn btn-ghost">
            <button
              onClick={() => {
                navigate("/my-post");
              }}
            >
              My Post
            </button>
          </div>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src={``}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png";
                  }}
                  alt={""}
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-primary rounded-box w-52"
            >
              <li
                onClick={() => {
                  navigate("/profile");
                }}
              >
                <a>Settings</a>
              </li>
              <li>
                <a
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div>
          <div className="btn btn-ghost">
            <button
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </button>
          </div>
          <div className="btn btn-ghost">
            <button
              onClick={() => {
                navigate("/register");
              }}
            >
              Register
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
