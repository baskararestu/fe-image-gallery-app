import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [content, setContent] = useState([]);
  const [showComments, setShowComments] = useState(5); // number of comments to show
  const [comment, setComment] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadMoreCounter, setLoadMoreCounter] = useState(0);
  const contentContainerRef = useRef(null);
  const token = localStorage.getItem("user_token");

  const handleShowMoreComments = (contentId) => {
    setShowComments((prevState) => ({
      ...prevState,
      [contentId]: (prevState[contentId] || 0) + 5, // show 5 more comments
    }));
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
        <div className="text-lg font-semibold">{item.caption}</div>

        {item.comments && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold">
              Comments ( {item.comments.length} ):
            </h4>
            {item.comments
              .slice(0, showComments[item.id_content] | 5)
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
  console.log(content);
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
//   <button
//     className="btn-primary btn-sm text-slate-50 hover:bg-primary-hover"
//     onClick={() => handleShowMoreComments(content.id_content)}
//   >
//     Show more comments
//   </button>
// </ul>

{
  /* <form className="flex gap-2">
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
</form> */
}
