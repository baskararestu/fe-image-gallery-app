import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isVerified: null,
    isLoggedIn: !!localStorage.getItem("user_token"), // Set the initial login state based on the presence of a user token
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsVerified: (state, action) => {
      state.isVerified = action.payload;
    },
    resetUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.isVerified = null;
    },
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    updateUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser, resetUser, setLoggedIn, setIsVerified, updateUser } =
  userSlice.actions;

export default userSlice.reducer;

export function fetchUser() {
  return async (dispatch) => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await axios.get("http://localhost:8000/auth/get-user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const verifiedUser = response.data.isVerified;
      dispatch(setIsVerified(verifiedUser));
      dispatch(setUser(response.data));
    } catch (error) {
      console.error(error);
    }
  };
}

export function loginUser(data) {
  return async (dispatch) => {
    console.log("slice", data);
    let response = await axios.post("http://localhost:8000/auth/login", data);
    if (response.data.success) {
      toast.success(response.data.message);
      dispatch(setUser(response.data.data));
      localStorage.setItem("user_token", response.data.token); // store the token in local storage
      dispatch(setLoggedIn(true)); // Set isLoggedIn to true after successful login
      console.log(response.data);
    } else {
      alert(response.data.message);
    }
  };
}

export function logoutUser() {
  return async (dispatch) => {
    dispatch(resetUser());
    localStorage.removeItem("user_token");
    dispatch(setLoggedIn(false)); // Set isLoggedIn to false after logout
  };
}

export const updateUserRequest = (user) => async (dispatch, getState) => {
  try {
    const token = getState().user.user_token;
    const formData = new FormData();
    formData.append("fullname", user.fullname);
    formData.append("username", user.username);
    formData.append("bio", user.bio);
    formData.append("image", user.image);

    const response = await axios.post(
      "http://localhost:8000/auth/update-user",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    dispatch(setUser(response.data));
    toast.success("User updated successfully.");
  } catch (error) {
    console.error(error);
    toast.error("Failed to update user.");
  }
};
