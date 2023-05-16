import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Verification() {
  let { token } = useParams();
  let navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState("");

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
        console.log(token);
        if (response.data.success) {
          toast.success(response.data.message);
          setVerificationStatus("success");
        }
      }
    } catch (error) {
      toast.error("Your verification is expired");
      setVerificationStatus("expired");
      console.log(error);
    }
  };

  useEffect(() => {
    tokenVerification();
    setTimeout(() => {
      navigate("/");
    }, 8000);
  }, []);
  return (
    <div className="pt-24 h-screen">
      {verificationStatus === "success" && <p>Your account is verified now</p>}
      {verificationStatus === "expired" && (
        <p>Your verification link has expired</p>
      )}
      <p>{token}</p>
    </div>
  );
}

export default Verification;
