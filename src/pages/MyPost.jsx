import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MyPost() {
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const token = localStorage.getItem("user_token");

  const contentByIdUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/content/my-post`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setContent(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteContent = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/content/del-contents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Remove the deleted content from the state
      setContent(content.filter((item) => item.id_content !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    contentByIdUser();
  }, []);

  console.log(content, "mypost");

  return (
    <div className="py-20 px-10 grid gap-4 justify-center min-h-screen sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {content.map((item, id) => (
        <div key={item.id_content} className="p-4 shadow-sm bg-gray-100">
          <img
            className="w-full h-56 object-cover"
            src={`http://localhost:8000${item.image}`}
            alt=""
          />
          <div className="mt-4">
            <p className="text-lg font-semibold">{item.caption}</p>
            <p className="text-sm text-base-content">
              Created At: {new Date(item.createAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-row justify-end items-end gap-3">
            <button
              className="btn-primary btn-sm"
              onClick={() => {
                navigate(`/edit/${item.id_content}`);
              }}
            >
              EDIT
            </button>
            <button
              className="btn-primary bg-red-500 btn-sm hover:bg-red-600"
              onClick={() => deleteContent(item.id_content)}
            >
              DELETE
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyPost;
