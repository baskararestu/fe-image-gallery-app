import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function ContentDetails() {
  const [content, setContent] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/content/content/${id}`
        );
        const data = await response.json();
        setContent(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchContent();
  }, [id]);

  console.log(content);
  return (
    <div className={`pt-24 flex justify-center h-screen `}>
      {content && (
        <div
          key={content.id_content}
          className=" w-3/4 card h-3/4 bg-white shadow-lg rounded-lg overflow-hidden"
        >
          <img
            className="w-full h-56 object-cover"
            src={`http://localhost:8000${content.image}`}
            alt=""
          />
          <div className="card-title">{content.caption}</div>
          <p>{content.body}</p>
          <p>Username: {content.username}</p>
          <p>Created at: {new Date(content.createAt).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
}

export default ContentDetails;
