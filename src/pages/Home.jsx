import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Home() {
  const [content, setContent] = useState([]);
  const [showComments, setShowComments] = useState(5); // number of comments to show
  const [comment, setComment] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [likes, setLikes] = useState(content?.likes || 0);
  const [loadMoreCounter, setLoadMoreCounter] = useState(0);
  const contentContainerRef = useRef(null);
  const token = localStorage.getItem("user_token");

  const likeContent = async (contentId, userContentId) => {
    setIsLoading(false);

    try {
      const response = await axios.post(
        `http://localhost:8000/content/contents/${contentId}/like`,
        {
          id_user: userContentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLikes(response.data.likesCount);
      toast.success(response.data.message);
      window.location.reload();
    } catch (error) {
      toast.warn("you have been like this post");
    }
  };

  const handleShowMoreComments = (contentId) => {
    setShowComments((prevState) => {
      const newState = { ...prevState };
      newState[contentId] = (newState[contentId] || 0) + 5;
      return newState;
    });
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
      const updatedContent = content.map((item) => {
        if (item.id_content === contentId) {
          return {
            ...item,
            comments: [...item.comments, response.data],
          };
        }
        return item;
      });
      setContent(updatedContent);
      setComment("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      window.location.reload();
    }
  };

  const handleScroll = () => {
    if (
      !isLoading &&
      contentContainerRef.current &&
      window.innerHeight + window.scrollY >=
        contentContainerRef.current.offsetHeight
    ) {
      setCurrentPage((prevPage) => prevPage + 1);
      setLoadMoreCounter((prevCounter) => prevCounter + 1);
    }
  };

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(
          `http://localhost:8000/content/infinite-scroll?page=${currentPage}`
        );
        const { content: newContent, totalPages: newTotalPages } =
          response.data;

        setContent((prevContent) => [...prevContent, ...newContent]);
        setTotalPages(newTotalPages);
        setIsLoading(false);
        console.log(response, "response");
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [currentPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading]);

  const renderContent = () => {
    return content.map((item, index) => (
      <div
        key={`${item.id_content}-${index}`}
        className="bg-white p-4 mb-4 rounded shadow"
      >
        <div>
          <Link
            key={`${item.id_content}-${index}`}
            to={`/content-details/${item.id_content}`}
          >
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
              Comments ( {item.comments.length} ):
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
                  handleAddComment(item.id_content); // pass contentId to handleAddComment function
                }}
                disabled={isLoading || !comment} // disable button when loading or when commentText is empty
              >
                {isLoading ? "Commenting..." : "Comment"}
              </button>
            </form>
          </div>
        )}

        <p className="mt-4">Likes: {item.likes}</p>
      </div>
    ));
  };
  console.log(content, "content");
  return (
    <div
      className="pt-16 flex justify-center items-center min-h-screen bg-gray-100"
      ref={contentContainerRef}
    >
      <div className="grid justify-center items-center w-full md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4 p-4">
        {renderContent()}
        {isLoading && <p className="text-gray-500">Loading...</p>}
      </div>
    </div>
  );
}
export default Home;
