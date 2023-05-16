import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchUser } from "../features/users/userSlice";
import ContentItem from "../components/ContentItem";

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
  const fetchContentTimerRef = useRef(null);
  const token = localStorage.getItem("user_token");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isVerified = useSelector((state) => state.user.isVerified);

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
    // setIsLoading(true);

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
    }
  };

  const handleScroll = () => {
    if (
      !isLoading &&
      contentContainerRef.current &&
      window.innerHeight + window.scrollY >=
        contentContainerRef.current.offsetHeight
    ) {
      clearTimeout(fetchContentTimerRef.current);
      fetchContentTimerRef.current = setTimeout(() => {
        setCurrentPage((prevPage) => prevPage + 1);
        setLoadMoreCounter((prevCounter) => prevCounter + 1);
      });
      clearTimeout(fetchContentTimerRef.current);
      fetchContentTimerRef.current = setTimeout(() => {
        setCurrentPage((prevPage) => prevPage + 1);
        setLoadMoreCounter((prevCounter) => prevCounter + 1);
      }, 500); // Delay the fetchContent function by 500 milliseconds
    }
  };

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

  const fetchContent = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:8000/content/infinite-scroll?page=${currentPage}`
      );
      const { content: newContent, totalPages: newTotalPages } = response.data;

      if (currentPage > 1) {
        setContent((prevContent) => [...prevContent, ...newContent]);
      } else {
        setContent(newContent);
      }

      setTotalPages(newTotalPages);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (content.length === 0) {
      return <p className="text-gray-500">No content available.</p>;
    }
    return content.map((item, index) => (
      <ContentItem
        key={`${item.id_content}-${index}`}
        item={item}
        likeContent={likeContent}
        handleShowMoreComments={handleShowMoreComments}
        handleCommentChange={handleCommentChange}
        handleAddComment={handleAddComment}
        showComments={showComments}
        isLoading={isLoading}
        comment={comment}
      />
    ));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchUser());
        if (isVerified === 0) {
          navigate("/profile");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dispatch, navigate, isVerified]);

  useEffect(() => {
    if (currentPage >= 1) {
      fetchContent();
    }
  }, [currentPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isLoading]);

  console.log(content, "content");
  return (
    <div
      className="pt-16 flex justify-center items-center min-h-screen bg-gray-100"
      ref={contentContainerRef}
    >
      <div className="grid justify-center items-center w-full md:w-2/3 lg:w-1/2 xl:w-1/3 2xl:w-1/4 p-4">
        {isLoading && !content ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
}
export default Home;
