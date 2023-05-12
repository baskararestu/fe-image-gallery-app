import React from "react";

function Profile() {
  return (
    <div className=" h-screen w-screen flex justify-center overflow-hidden">
      <div className="border h-3/4 w-3/4 rounded-md bg-base-100 border-base-300 my-10 p-5">
        <div className="mb-5">
          <h1 className="text-secondary-content font-bold">Profile Details</h1>
        </div>
        <div className="flex flex-row gap-5 ">
          <div>
            <div className="card w-96 bg-base-100 shadow-xl">
              <figure>
                <img
                  src="https://jkfenner.com/wp-content/uploads/2019/11/default.jpg"
                  alt="Profile"
                  className="w-1/2 h-1/2 object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">Profile picture</h2>
                <div className="card-actions justify-end">
                  <input
                    type="file"
                    className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="divider-vertical"></div>
          <div className="flex flex-wrap w-full">
            <div className="flex flex-col w-1/2 mr-4">
              <div className="flex flex-col gap-1 w-full">
                <label className="py-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered input-primary w-full max-w-xs"
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label className="py-1">Username</label>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered input-primary w-full max-w-xs"
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label className="py-1">Email</label>
                <input
                  type="text"
                  placeholder="Type here"
                  className="input input-bordered input-primary w-full max-w-xs"
                  disabled
                  value={"test"}
                />
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label className="py-1">Bio</label>
                <textarea
                  className="textarea textarea-primary resize-none"
                  placeholder="Bio"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
