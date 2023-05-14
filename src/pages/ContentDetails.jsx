import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function ContentDetails() {
  const [content, setContent] = useState(null);
  const [data, setData] = useState([]);
  const [comment, setComment] = useState([]);
  const [likes, setLikes] = useState([]);
  const [showComments, setShowComments] = useState(5); // number of comments to show
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("user_token");

  const handleCommentChange = (event) => {
    setComment(event.target.value);
    console.log(comment);
  };
  const handleShowMoreComments = () => {
    setShowComments((prevShowComments) => prevShowComments + 3); // show 5 more comments
  };

  const handleAddComment = async (contentId) => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:8000/content/contents/${contentId}/comments&limit=5`,
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
    const fetchContent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/content/content/${id}`
        );
        setContent(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/content/contents/${id}/show-comments`
        );
        setComment(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchLikes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/content/contents/${id}/show-likes`
        );
        setLikes(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchContent();
    fetchComments();
    fetchLikes();
  }, [id]);

  console.log(comment);
  console.log(content);
  return (
    <div className={`pt-24 min-h-screen bg-gray-100 p-4 `}>
      <div className={`grid grid-cols-1 gap-4 justify-center`}>
        {content && (
          <div
            key={content.id_content}
            className="  bg-white shadow-lg rounded-lg overflow-hidden"
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
                {likes}
              </button>
              <h2 className="text-lg font-medium">{content.caption}</h2>
              <p className="text-sm text-gray-500 mb-2">
                Owner: {content.username}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                Created at: {new Date(content.createAt).toLocaleDateString()}
              </p>

              <ul className="mb-2">
                {comment.slice(0, showComments).map((comment) => (
                  <li
                    key={comment.id_comment}
                    className="text-sm text-gray-700 mb-1"
                  >
                    <span className="font-medium">{comment.username}: </span>
                    {comment.comment}
                  </li>
                ))}
              </ul>

              <button
                className="btn-primary btn-sm text-slate-50 hover:bg-primary-hover"
                onClick={() => handleShowMoreComments(content.id_content)}
              >
                Show more comments
              </button>

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
                  disabled={isLoading || !comment} // disable button when loading or when commentText is empty
                >
                  {isLoading ? "Commenting..." : "Comment"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContentDetails;
