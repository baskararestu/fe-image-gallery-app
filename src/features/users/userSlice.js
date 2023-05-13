import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {
      id: "",
      email: "",
      username: "",
      fullname: "",
      bio: "",
    },
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    resetUser: (state) => {
      state.user = {
        id: "",
        email: "",
        username: "",
        fullname: "",
        bio: "",
      };
    },
  },
});

export default userSlice.reducer;
export const { setUser, resetUser } = userSlice.actions;

export function loginUser(data) {
  return async (dispatch) => {
    console.log("slice", data);
    let response = await axios.post("http://localhost:8000/auth/login", data);
    if (response.data.success) {
      toast.success(response.data.message);
      dispatch(setUser(response.data.data));
      // localStorage.setItem("userLogin", JSON.stringify(response.data.data)); // store user data in local storage
      localStorage.setItem("user_token", response.data.token); // store the token in local storage

      console.log(response.data.data);
    } else {
      alert(response.data.message);
    }
  };
}

export function checkLogin(token) {
  return async (dispatch) => {
    console.log(token);
    const response = await axios.post(
      "http://localhost:8000/auth/check-login",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(setUser(response.data.data));
  };
}

export function logoutUser() {
  return async (dispatch) => {
    dispatch(resetUser());
    localStorage.removeItem("user_token");
    // localStorage.removeItem("userLogin");
    toast.error("im logout");
  };
}

// export function fetchUserById() {
//   return async (dispatch) => {
//     try {
//       const token = localStorage.getItem("user_token");
//       const response = await axios.get(`http://localhost:8000/auth/get-user`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       dispatch(setUser(response.data)); // dispatch setProduct action with fetched product

//       // dispatch(setUser(response.data)); // dispatch setUser action with fetched user
//       console.log(response);
//     } catch (error) {
//       console.error(error);
//       alert("An error occurred. Please try again later.");
//     }
// };
// }
