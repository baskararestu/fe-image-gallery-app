import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Verification() {
  let { token } = useParams();
  let navigate = useNavigate();

  const tokenVerification = async () => {
    try {
      if (token) {
        const response = await axios.post(
          "http://localhost:8000/auth/verification",
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.success) {
          toast.success(response.data.message);
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    tokenVerification();
    setTimeout(() => {
      navigate("/");
    }, 4000);
  }, []);
  return (
    <div>
      <ToastContainer autoClose={3000} />
      <p>Your account is being verified</p>
      <p>{token}</p>
    </div>
  );
}

export default Verification;
