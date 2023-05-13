import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchUserById } from "../features/users/userSlice";
import axios from "axios";
import { toast } from "react-toastify";

function Profile() {
  const [user, setUser] = useState();
  const [previewUrl, setPreviewUrl] = useState("");
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    bio: "",
    file: null,
  });
  const [isFormValid, setIsFormValid] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/auth/get-user", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("user_token"),
        },
      });
      setUser(response.data);
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
      data.append("fullname", formData.fullname);
      data.append("username", formData.username);
      data.append("bio", formData.bio);
      data.append("image", formData.image);
      const response = await axios.post(
        "http://localhost:8000/auth/edit-user",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setUser(response.data);
      toast.success("User details updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
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

  console.log(user);
  console.log(formData);

  return (
    <div className="h-screen w-screen flex justify-center overflow-hidden">
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
                  // alt="Profile"
                  className="w-1/2 h-1/2 object-cover"
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
          <div className="mt-5">
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={!isFormValid}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
