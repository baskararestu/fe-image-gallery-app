import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Profile() {
  const [user, setUser] = useState();
  const [previewUrl, setPreviewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [counter, setCounter] = useState(60); // Initial counter value (in seconds)
  const [isCounterActive, setIsCounterActive] = useState(false); // Flag to indicate if the counter is active
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    bio: "",
    file: null,
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isVerified, setIsVerified] = useState(null);

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/auth/get-user", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("user_token"),
        },
      });
      setUser(response.data);
      const verifiedUser = response.data.isVerified;
      setIsVerified(verifiedUser);
      setFormData({
        fullname: response.data.fullname,
        username: response.data.username,
        bio: response.data.bio,
        image: response.data.image,
      });
      setIsFormValid(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const sendVerification = async () => {
    try {
      setIsLoading(true);
      setIsCounterActive(true); // Start the counter
      const response = await axios.post(
        "http://localhost:8000/auth/resend-verification",
        { email: user.email }
      );
      await toast.success(response.data.message, { autoClose: 3000 }); // Success toast with a custom auto close of 3000 milliseconds
      toast.info("Your verification email will be expired in 10minute", {
        autoClose: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send verification email.");
    } finally {
      setIsLoading(false); // Set isLoading to false regardless of success or error
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setIsFormValid(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("user_token");
      const data = new FormData();

      if (formData.image) {
        data.append("image", formData.image);
      }
      // Check if each field is defined before appending it to the FormData object
      if (formData.fullname !== undefined) {
        data.append("fullname", formData.fullname);
      }
      if (formData.username !== undefined) {
        data.append("username", formData.username);
      }
      if (formData.bio !== undefined) {
        data.append("bio", formData.bio);
      }

      const response = await axios.post(
        "http://localhost:8000/auth/edit-user",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setUser(response.data);
      if (response.data.message) {
        sessionStorage.setItem(
          "toastMessage",
          "User details updated successfully."
        );
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
      toast.error(error);
    }
  };

  useEffect(() => {
    let interval;

    if (isCounterActive) {
      interval = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isCounterActive]);

  useEffect(() => {
    if (counter === 0) {
      setIsCounterActive(false);
      setCounter(60); // Reset the counter to its initial value
    }
  }, [counter]);

  useEffect(() => {
    const toastMessage = sessionStorage.getItem("toastMessage");

    if (toastMessage) {
      toast.success(toastMessage);
      sessionStorage.removeItem("toastMessage");
    }
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname,
        email: user.email,
        username: user.username,
        bio: user.bio,
        image: user.image,
      });
      setIsFormValid(true);
    }
  }, [user]);

  console.log(user, "user di profile");
  console.log(formData);

  return (
    <div className="pt-16 h-screen w-screen flex justify-center overflow-hidden">
      <div className="border h-3/4 w-3/4 rounded-md bg-base-100 border-base-300 my-10 p-5">
        <div className="mb-5">
          <h1 className="text-secondary-content font-bold">Profile Details</h1>
        </div>
        <div className="flex flex-row gap-5 ">
          <div>
            <div className="card w-96 bg-base-100 shadow-xl">
              <figure>
                <img
                  src={previewUrl || `http://localhost:8000${formData?.image}`}
                  alt="Profile"
                  className="w-3/4 h-1/2 object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Profile picture</h2>
                <div className="card-actions justify-end">
                  <input
                    type="file"
                    name="image"
                    className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="divider-vertical"></div>
          <div className="flex flex-wrap w-full">
            <div className="flex flex-col w-1/2 mr-4">
              <div className="flex flex-col gap-1 w-full">
                <label className="py-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered input-primary w-full max-w-xs"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label className="py-1">Username</label>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered input-primary w-full max-w-xs"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label className="py-1">Email</label>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered input-primary w-full max-w-xs"
                  name="email"
                  value={formData.email}
                  disabled
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label className="py-1">Bio</label>
                <textarea
                  className="textarea textarea-primary resize-none"
                  placeholder="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>
          </div>

          {!isVerified ? (
            <div className="flex flex-col self-end place-items-end">
              <div className="mt-5">
                <button className="btn btn-primary" disabled>
                  Save
                </button>
              </div>
              <div className="mt-5">
                <button
                  className="btn btn-primary"
                  disabled={isLoading || isCounterActive}
                  onClick={sendVerification}
                >
                  {isCounterActive
                    ? `Resend in ${counter}s`
                    : "Send verification"}
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-5">
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={!isFormValid}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
