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
    try {
      if (comment.length > 300) {
        setError("Comment cannot be more than 300 characters");
      }
      if (comment.length === 0) {
        setError("Comment cannot be empty");
      }
      if (comment.length > 0 && comment.length <= 300) {
        fire.addComment(comment);
        setSuccess("Comment added successfully");
      }
    } catch (error: Errors | any) {
      const check = new Validate();
      const messages = check.errors(error.code, error.message);
      setError(messages);
    }
  };
  useEffect(() => {
    fire
      .collection("comments")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
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
                    className="py-2 px-4 text-sm font-semibold bg-red-50 text-red-700 hover:bg-violet-100 w-full transition ease-in duration-200 text-center shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
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
                  {success}
                </p>
                <div className="flex items-center justify-between gap-4 w-full mt-8">
                  <button
                    type="button"
                    onClick={() => setSuccess("")}
                    className="py-2 px-4 text-sm font-semibold bg-green-50 text-green-700 hover:bg-green-100 w-full transition ease-in duration-200 text-center shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
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
                className="transition flex-1 appearance-none border border-neutral-300 w-full py-2 px-4 bg-white text-neutral-700 placeholder-neutral-400 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
              className="py-2 px-4 flex justify-center items-center text-sm font-semibold bg-violet-50 text-violet-700 hover:bg-violet-100 text-white transition ease-in duration-200 text-center focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
            >
              Add comment
            </button>
          </form>
        </div>
        <div className="container mx-auto space-y-2 flex justify-center items-center">
          <div className="gap-2 grid grid-cols-1 lg:grid-cols-4">
            {data.map((data: Post) => (
              <div className="bg-white dark:bg-neutral-800 w-72 shadow-lg rounded-xl p-4">
                <p className="text-neutral-600 dark:text-white">
                  <span className="font-bold text-indigo-400 text-lg">“</span>
                  {data.comment}
                  <span className="font-bold text-indigo-400 text-lg">”</span>
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
                    <span className="font-semibold text-indigo-400 text-sm">
                      {data.userName}
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
