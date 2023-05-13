import React, { useState } from "react";

function MyPost() {
  const [post, setPost] = useState({});

  return (
    <div className="flex flex-row justify-center min-h-screen">
      <div className="card card-bordered border-primary-focus">
        <form>
          <div className="card-body items-center gap-3">
            <div className="card-title ">My Post</div>
            <div>
              <input
                type="file"
                className="file-input file-input-bordered file-input-primary w-full max-w-xs"
              />
            </div>
            <div className="w-full max-w-xs grid grid-cols-1 gap-3">
              <label>Caption</label>
              <textarea
                className="textarea textarea-primary "
                placeholder="Bio"
              ></textarea>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MyPost;
