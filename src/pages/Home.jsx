import React, { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contentsResponse = await axios.get(
          "http://localhost:8000/content/all-content"
        );
        const contentsData = contentsResponse.data;
        console.log(contentsData, "contents data");
        const combinedData = await Promise.all(
          contentsData.map(async (content) => {
            const [commentsResponse, likesResponse] = await Promise.all([
              axios.get(
                `http://localhost:8000/content/contents/${content.id_content}/show-comments`
              ),
              axios.get(
                `http://localhost:8000/content/contents/${content.id_content}/show-likes`
              ),
            ]);
            const commentsData = commentsResponse.data;
            const likesData = likesResponse.data;

            return {
              ...content,
              comments: commentsData,
              likes: likesData,
            };
          })
        );

        setData(combinedData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.map((content) => (
          <div
            key={content.id_content}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <img
              className="w-full h-56 object-cover"
              src={`http://localhost:8000${content.image}`}
              alt=""
            />
            <div className="p-4">
              <button className="btn gap-2">
                Likes
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {content.likes}
              </button>
              <h2 className="text-lg font-medium">{content.caption}</h2>
              <p className="text-sm text-gray-500 mb-2">
                Owner: {content.username}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Created at: {new Date(content.createAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Comments ({content.comments.length}):
              </p>
              <ul className="mb-2">
                {content.comments.map((comment) => (
                  <li
                    key={comment.id_comment}
                    className="text-sm text-gray-700 mb-1"
                  >
                    <span className="font-medium">{comment.username}: </span>
                    {comment.comment}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
