import axios from "axios";
import { useEffect, useState } from "react";

function ResetPassword() {
  // State variables
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState("");

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
  };

  return (
    <div className="bg-red-500 h-screen pt-24">
      {success ? (
        <div>
          <h2>Password Reset Successful</h2>
          <p>Your password has been reset successfully.</p>
        </div>
      ) : (
        <div>
          <h2>Reset Password</h2>
          <div>
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <p>{error}</p>}
          <button onClick={handleResetPassword}>Reset Password</button>
        </div>
      )}
    </div>
  );
}

export default ResetPassword;
