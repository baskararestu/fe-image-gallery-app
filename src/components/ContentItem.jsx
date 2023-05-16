import React from "react";
import { Link } from "react-router-dom";

function ContentItem({
  item,
  likeContent,
  handleShowMoreComments,
  handleCommentChange,
  handleAddComment,
  showComments,
  isLoading,
  comment,
}) {
  return (
    <div className="bg-white p-4 mb-4 rounded shadow">
      <div>
        <Link to={`/content-details/${item.id_content}`}>
          <img
            className="w-full h-56 object-cover"
            src={`http://localhost:8000${item.image}`}
            alt=""
          />
        </Link>
      </div>
      <button
        className="btn bg-primary-focus text-slate-50 gap-2"
        onClick={() => likeContent(item.id_content, item.id_user)}
      >
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
        {item.likes}
      </button>
      <div className="text-lg font-semibold">{item.caption}</div>
      {item.comments && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold">
            Comments ({item.comments.length}):
          </h4>
          {item.comments
            .slice(0, showComments[item.id_content] || 5)
            .map((comment, index) => (
              <ul key={index} className="flex flex-row gap-2">
                <li>{comment.username} :</li>
                <li>{comment.comment}</li>
              </ul>
            ))}
          <button
            className="btn-primary btn-sm text-slate-50 hover:bg-primary-hover"
            onClick={() => handleShowMoreComments(item.id_content)}
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
                handleAddComment(item.id_content);
              }}
              disabled={isLoading || !comment}
            >
              {isLoading ? "Commenting..." : "Comment"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ContentItem;
