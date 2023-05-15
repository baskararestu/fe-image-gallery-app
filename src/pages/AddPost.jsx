import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
function AddPost() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const token = localStorage.getItem("user_token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("image", image);

      await axios.post(
        "http://localhost:8000/content/add-content",
        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Content added successfully");

      // Clear form fields and image preview
      setCaption("");
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error(error);
      toast.error("Error adding content");
    }
  };

  return (
    <div className="pt-12 flex justify-center items-center h-screen">
      <div className="p-5 card  bg-base-200 shadow-xl w-3/4 h-3/4  items-center">
        <h1 className="text-3xl font-bold mb-4">Add Post</h1>
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-2 max-w-xs max-h-48"
          />
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="caption" className="block font-bold mb-1">
              Caption
            </label>
            <input
              type="text"
              id="caption"
              className="w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block font-bold mb-1">
              Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={(e) => {
                const newImage = e.target.files[0];
                if (newImage) {
                  setImage(newImage);
                  setImagePreview(URL.createObjectURL(newImage));
                } else {
                  setImage(null);
                  setImagePreview(null);
                }
              }}
            />
          </div>

          <button
            type="submit"
            className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600"
          >
            Add Post
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPost;
