import React, { useState, useEffect } from "react";
import axios from "axios";

function Home() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("user_token");
  const [page, setPage] = useState(1);

  const [lastContentRef, setLastContentRef] = useState(null);

  const handleIntersection = (entries) => {
    const entry = entries[0];
    if (entry.isIntersecting && data.length % 6 === 0) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
    console.log(comment);
  };

  const handleAddComment = async (contentId) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8000/content/contents/${contentId}/comments`,
        {
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedData = data.map((content) => {
        if (content.id_content === contentId) {
          return {
            ...content,
            comments: [...content.comments, response.data],
          };
        }
        return content;
      });
      setData(updatedData);
      setComment("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      window.location.reload();
    }
  };

  useEffect(() => {
    if (lastContentRef) {
      const observer = new IntersectionObserver(handleIntersection, {
        rootMargin: "0px 0px 100% 0px",
      });
      observer.observe(lastContentRef);
      return () => observer.disconnect();
    }
  }, [lastContentRef]);

  useEffect(() => {
    const fetchData = async (page) => {
      try {
        const contentsResponse = await axios.get(
          `http://localhost:8000/content/all-content?page=${page}&limit=6`
        );
        const contentsData = contentsResponse.data;
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

        setData((prevData) => [...prevData, ...combinedData]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData(page);
  }, [page]);

  return (
    <div className="pt-24 min-h-screen bg-gray-100 p-4">
      <div className={`grid grid-cols-${data.length} gap-4 justify-center`}>
        {data.map((content, index) => (
          <div
            key={content.id_content}
            ref={data.length === index + 1 ? setLastContentRef : null}
            className=" bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <img
              className="w-full h-56 object-cover"
              src={`http://localhost:8000${content.image}`}
              alt=""
            />
            <div className="p-4">
              <button className="btn bg-primary-focus text-slate-50 gap-2">
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

              <form className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a comment"
                  className="border-gray-300 rounded-md flex-1 p-2"
                  onChange={handleCommentChange}
                />
                <button
                  type="submit"
                  className="btn bg-primary-focus text-slate-50 hover:bg-primary-hover"
                  onClick={() => {
                    handleAddComment(content.id_content); // pass contentId to handleAddComment function
                  }}
                  disabled={isLoading} // disable button when loading
                >
                  {isLoading ? "Commenting..." : "Comment"}
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
      <div ref={setLastContentRef}></div>
    </div>
  );
}

export default Home;
