import axios from "axios";
import React, { useEffect, useState } from "react";

function MyPost() {
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

  useEffect(() => {
    contentByIdUser();
  }, []);
  console.log(content, "mypost");
  return (
    <div>
      <div className="pt-20 px-10">
        <h1>
          Welcome, <strong>{content[0].fullname}</strong>
        </h1>
      </div>
      <div className="p-10 grid gap-4 justify-center min-h-screen sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {content.map((item) => (
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
              <button className=" btn-primary btn-sm">EDIT</button>
              <button className="btn-primary bg-red-500 btn-sm hover:bg-red-600">
                DELETE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyPost;
