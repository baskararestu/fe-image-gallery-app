import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../features/users/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userToken = localStorage.getItem("user_token");
  const [user, setUser] = useState();

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/auth/get-user", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("user_token"),
        },
      });
      setUser(response.data);
      console.log(response.data, "navbar user");
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    // Perform logout action, such as clearing the user session
    console.log("Logged out");
    dispatch(logoutUser());
    navigate("/login");
  };

  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div className="fixed top-0 flex flex-row gap-5  navbar bg-primary">
      <div className="flex-1">
        <a
          className="btn btn-ghost normal-case text-xl"
          onClick={() => {
            navigate("/");
          }}
        >
          Image App
        </a>
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
          <div className="btn btn-ghost">
            <button
              onClick={() => {
                navigate("/add-post");
              }}
            >
              Add Post
            </button>
          </div>
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src={`http://localhost:8000${user?.image}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png";
                  }}
                  alt={""}
                />
              </div>
            </label>
            <label></label>
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
          <span className=" text-black">{user?.username}</span>
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
