import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function ContentEdit() {
  const [content, setContent] = useState([]);
  const [newCaption, setNewCaption] = useState(""); // State for storing the new caption
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("user_token");
  const fetchContent = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/content/content/${id}`
      );
      setContent(response.data);
      setNewCaption(response.data.caption); // Set the initial value of newCaption to the existing caption
    } catch (error) {
      console.error(error);
    }
  };

  const handleCaptionChange = (event) => {
    setNewCaption(event.target.value); // Update the new caption state as the user types
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    if (newCaption === content.caption) {
      // If the caption is not changed, do nothing
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/content/edit-content/${id}`,
        { caption: newCaption },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data); // Log the response from the server
      if (response.data.message === "Content updated successfully") {
        toast.success("Content updated successfully");
        navigate("/my-post");
      }
      // Optionally, you can show a success message to the user or redirect to another page
    } catch (error) {
      console.error(error);
      // Show an error message to the user
    }
  };

  useEffect(() => {
    fetchContent();
  }, [id]);

  return (
    <div className={`pt-24 min-h-screen bg-gray-100 p-4 `}>
      <div className={`flex gap-4 justify-center items-center w-full`}>
        {content && (
          <div
            key={content.id_content}
            className="  card lg:card-side bg-base-100 shadow-xl w-3/4 h-3/4"
          >
            <img
              className="w-3/4 h-1/2 object-cover"
              src={`http://localhost:8000${content.image}`}
              alt=""
            />
            <div className="card-body p-4">
              <form onSubmit={handleFormSubmit}>
                {" "}
                {/* Add form submit handler */}
                <h2 className="card-title ">
                  <input
                    className="input rounded-lg input-primary"
                    value={newCaption}
                    onChange={handleCaptionChange}
                  />
                </h2>
                <div className="text-sm text-gray-500 mb-2 flex gap-2">
                  Owner: <p className="font-semibold">{content.username}</p>
                </div>
                <div className="text-sm text-gray-500 mb-2 flex gap-2">
                  Created at:
                  <p className="font-semibold">
                    {new Date(content.createAt).toLocaleDateString()}{" "}
                  </p>
                </div>
                <button type="submit" className="btn-primary btn">
                  Save
                </button>
                <button
                  className="btn btn-outline bg-red-500"
                  onClick={() => {
                    navigate("/my-post");
                  }}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContentEdit;
