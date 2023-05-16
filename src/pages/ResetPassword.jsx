import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";

function ResetPassword() {
  // State variables
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState("");
  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required("New Password is required")
      .min(8, "New Password should have at least 8 characters")
      .matches(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/,
        "New Password should contain at least 8 characters including an uppercase letter, a symbol, and a number"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  // Extract token from the URL when the component mounts
  useEffect(() => {
    const url = window.location.href;
    const tokenFromUrl = url.substring(url.lastIndexOf("/") + 1);
    setToken(tokenFromUrl);
  }, []);

  // Function to handle password reset
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (
      newPassword &&
      confirmPassword &&
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/.test(
        newPassword
      )
    ) {
      try {
        const response = await axios.post(
          "http://localhost:8000/auth/reset-password",
          {
            newPassword,
            confirmPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuccess(true);
      } catch (error) {
        setError(error.response.data.message);
      }
    } else {
      setError(
        "New Password should contain at least 8 characters including an uppercase letter, a symbol, and a number"
      );
    }
  };

  return (
    <div className="pt-24 h-screen flex   justify-center bg-gray-100">
      <div className="max-w-2xl w-full flex items-center justify-center mb-10 p-6 bg-white shadow-lg rounded-md">
        {success ? (
          <div>
            <h2>Password Reset Successful</h2>
            <p>Your password has been reset successfully.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <h2>Reset Password</h2>
            <div>
              <label>New Password:</label>
              <input
                type="password"
                value={newPassword}
                className="w-full px-3 py-2 border rounded-md outline-none focus:ring focus:ring-blue-300"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label>Confirm Password:</label>
              <input
                type="password"
                value={confirmPassword}
                className="w-full px-3 py-2 border rounded-md outline-none focus:ring focus:ring-blue-300"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && <p>{error}</p>}
            <button
              className="btn btn-primary rounded-md"
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
