import { useState } from "react";
import { Firebase } from "../libs/firebase";
import { Errors, Post } from "../libs/types";
import { Validate } from "../libs/validate";
import { useEffect } from "react";
const Hello = () => {
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [data, setData] = useState([{}] as any);
  const fire = new Firebase();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (comment === "") {
      setError("Comment cannot be empty");
    }

    if (comment != "") {
      setSuccess("Comment added successfully");
    }
    try {
      fire.addComment(comment);
    } catch (error: Errors | any) {
      const check = new Validate();
      const messages = check.errors(error.code, error.message);
      setError(messages);
    }
  };
  useEffect(() => {
    fire.collection("comments").onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(data);
    });
  }, []);

  return (
    <div className="flex items-center justify-center mx-5">
      <div className="my-60 lg:my-60 h-screen space-y-2">
        {error && (
          <div className="shadow-lg rounded-2xl p-4 bg-white dark:bg-neutral-800 w-64 m-auto">
            <div className="w-full h-full text-center">
              <div className="flex h-full flex-col justify-between">
                <svg
                  className="h-12 w-12 mt-4 m-auto text-green-500"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <p className="text-neutral-600 dark:text-neutral-100 text-md py-2 px-6">
                  {error}
                </p>
                <div className="flex items-center justify-between gap-4 w-full mt-8">
                  <button
                    type="button"
                    onClick={() => setError("")}
                    className="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {success && (
          <div className="shadow-lg rounded-2xl p-4 bg-white dark:bg-neutral-800 w-64 m-auto">
            <div className="w-full h-full text-center">
              <div className="flex h-full flex-col justify-between">
                <svg
                  className="h-12 w-12 mt-4 m-auto text-green-500"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <p className="text-neutral-600 dark:text-neutral-100 text-md py-2 px-6">
                  <span className="text-neutral-800 dark:text-white font-bold">
                    {comment}
                  </span>
                  {success}
                </p>
                <div className="flex items-center justify-between gap-4 w-full mt-8">
                  <button
                    type="button"
                    onClick={() => setSuccess("")}
                    className="py-2 px-4  bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="container mx-auto px-4 space-y-2 max-w-xs">
          <h1 className="text-2xl font-bold text-neutral-800">Hello</h1>
          <form method="POST" onSubmit={handleSubmit}>
            <label className="text-neutral-700" htmlFor="name">
              <textarea
                className="flex-1 appearance-none border border-neutral-300 w-full py-2 px-4 bg-white text-neutral-700 placeholder-neutral-400 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                id="comment"
                placeholder="Enter your comment"
                name="comment"
                rows={5}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                cols={40}
              ></textarea>
            </label>
            <button
              type="submit"
              className="py-2 px-4 flex justify-center items-center  bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
            >
              {}
              <svg
                width="20"
                height="20"
                fill="currentColor"
                className="mr-2 animate-spin"
                viewBox="0 0 1792 1792"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"></path>
              </svg>
              loading
            </button>
          </form>
          <form className="pt-2">
            <div className="flex items-center space-x-6">
              <div className="shrink-0">
                <img
                  className="h-16 w-16 object-cover rounded-full"
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80"
                  alt="Current profile photo"
                />
              </div>
              <label className="block">
                <span className="sr-only">Choose profile photo</span>
                <input
                  type="file"
                  className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
                />
              </label>
            </div>
          </form>
        </div>
        <div className="container mx-auto space-y-2 flex justify-center">
          <div className="inline gap-2 grid grid-cols-1 lg:grid-cols-4">
            {data.map((data: Post) => (
              <div className="bg-white dark:bg-neutral-800 w-72 shadow-lg rounded-xl p-4">
                <p className="text-neutral-600 dark:text-white">
                  <span className="font-bold text-indigo-500 text-lg">“</span>
                  {data.comment}
                  <span className="font-bold text-indigo-500 text-lg">”</span>
                </p>
                <div className="flex items-center mt-4">
                  <a href="#" className="block relative">
                    <img
                      alt="profil"
                      src={data.userPhotoUrl as string}
                      className="mx-auto object-cover rounded-full h-10 w-10 "
                    />
                  </a>
                  <div className="flex flex-col ml-2 justify-between">
                    <span className="font-semibold text-indigo-500 text-sm">
                      {data.userName}
                    </span>
                    <span className="dark:text-neutral-400 text-xs flex items-center">
                      Developper
                      <img src="/icons/rocket.svg" className="ml-2 h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Hello;
