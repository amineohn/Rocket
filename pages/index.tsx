import React, { useEffect, useMemo, useState } from "react";
import { EventType, Operation, SocketEvent } from "../libs/event";
import { discordId, Presence } from "../libs/types";

import type { NextPage } from "next";
import FadeIn from "react-fade-in";

const Home: NextPage = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [doing, setDoing] = useState<Presence>();
  const [error, setError] = useState<string>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isDisconnected, setIsDisconnected] = useState<boolean>(false);
  const [id, setId] = useState(discordId);
  const send = (op: Operation, d?: unknown): void => {
    if (socket !== null) {
      socket.send(
        JSON.stringify({
          op,
          d,
        })
      );
    }
  };
  useEffect(() => {
    if (socket === null) return () => {};
    if (id == null) {
      setError("Invalid ID");
    }
    if (id !== discordId) {
      setError("Invalid ID");
    }
    if (id !== "") {
      setError("");
    }

    switch (socket.readyState) {
      case WebSocket.OPEN:
        setIsConnected(true);
        setIsConnecting(false);
        setIsDisconnected(false);
        break;
      case WebSocket.CONNECTING:
        setIsConnected(false);
        setIsConnecting(true);
        setIsDisconnected(false);
        break;
      case WebSocket.CLOSED:
        setIsConnected(false);
        setIsConnecting(false);
        setIsDisconnected(true);
        break;
      case WebSocket.CLOSING:
        setIsConnected(false);
        setIsConnecting(false);
        setIsDisconnected(false);
        break;
    }

    socket.onmessage = function ({ data }: MessageEvent): void {
      const { op, t, d }: SocketEvent = JSON.parse(data);
      switch (op) {
        case Operation.Hello:
          setInterval(
            () => send(Operation.Heartbeat),
            (d as { heartbeat_interval: number }).heartbeat_interval
          );
          send(Operation.Initialize, {
            subscribe_to_id: id,
          });
          setIsConnected(true);
          setIsConnecting(false);
          setIsDisconnected(false);
          break;
        case Operation.Event:
          if (t) {
            if ([EventType.INIT_STATE, EventType.PRESENCE_UPDATE].includes(t))
              setDoing(d as Presence);
          }
          break;
        default:
          break;
      }
    };

    socket.onclose = () => {
      setSocket(null);
    };
  }, [socket]);
  useEffect(() => {
    if (!socket) setSocket(new WebSocket("wss://api.lanyard.rest/socket"));
  }, [socket]);

  const currentActivity = useMemo(
    () => doing?.activities?.filter((activity) => activity.type === 0)[0],
    [doing]
  );
  const name = currentActivity?.name?.replace("Code", "Visual Studio Code");
  const replaced =
    currentActivity?.state?.replace("📁 ", "")?.split(" | ")?.[0] ||
    "a file".replace(`${[0]}.tsx`, `${[0]}`);
  useEffect(() => {}, [currentActivity]);
  if (!doing || !doing?.discord_status) return null;
  return (
    <>
      <FadeIn>
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="rounded-lg px-8 pt-6 pb-8 mb-4 space-y-2">
            {isConnecting && (
              <div className="flex justify-center">
                <div className="w-full max-w-xs">
                  <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="flex justify-center">
                      <div className="w-full max-w-xs">
                        <div className="text-center">
                          <div className="text-neutral-700 text-xl font-bold mb-2">
                            Connecting...
                          </div>
                          <div className="text-neutral-700 text-sm">
                            Please wait while we connect to Discord.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isDisconnected && (
              <div className="flex justify-center">
                <div className="w-full max-w-xs">
                  <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="flex justify-center">
                      <div className="w-full max-w-xs">
                        <div className="text-center">
                          <div className="text-neutral-700 text-xl font-bold mb-2">
                            Disconnected
                          </div>
                          <div className="text-neutral-700 text-sm">
                            Please refresh the page to reconnect.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isConnected && (
              <div className="flex justify-center items-center bg-red-500 text-white text-sm font-bold px-4 py-3 rounded relative">
                <span className="text-xs">
                  Connected as {doing?.discord_user.username}#
                  {doing?.discord_user?.discriminator}
                </span>
              </div>
            )}
            {error && (
              <div className="flex justify-center items-center bg-red-500 text-white text-sm font-bold px-4 py-3 rounded relative">
                <span className="text-xs">{error}</span>
              </div>
            )}
            <form className="flex flex-col space-y-2" method="POST">
              <input
                className="appearance-none bg-transparent border-b-2 border-neutral-200 text-neutral-700 mb-3 py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-neutral-500"
                type="text"
                placeholder="Enter your discord id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  send(Operation.Hello);
                }}
              >
                Connect
              </button>
            </form>
            {currentActivity ? (
              <>
                <div className="flex items-center">
                  <img
                    className="h-12 w-12 rounded-full"
                    src={`https://cdn.discordapp.com/avatars/${id}/${doing?.discord_user?.avatar}?size=80`}
                  />
                  <div className="ml-4">
                    <div className="text-lg text-neutral-900 font-semibold">
                      {doing?.discord_user?.username}
                    </div>
                    <div className="text-neutral-600">
                      #{doing?.discord_user?.discriminator}
                    </div>
                  </div>
                </div>

                <FadeIn className="space-y-2">
                  <div className="flex items-center space-x-4 text-neutral-700 rounded-md dark:text-neutral-300">
                    {currentActivity?.name == "Fortnite" &&
                    currentActivity?.assets ? (
                      <>
                        <img
                          src={`https://cdn.discordapp.com/app-assets/${currentActivity?.application_id}/858011444276494356.png`}
                          className="flex-shrink-0 w-16 h-16 rounded-2xl"
                        />
                      </>
                    ) : (
                      <img
                        src={`https://cdn.discordapp.com/app-assets/${currentActivity?.application_id}/${currentActivity?.assets?.large_image}.png`}
                        className="flex-shrink-0 w-16 h-16 rounded-2xl"
                      />
                    )}
                    <div className="text-sm leading-tight truncate">
                      {currentActivity ? (
                        <>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-black text-black dark:text-white">
                                {name}
                              </span>
                            </div>
                            {currentActivity?.state ? (
                              <span className="text-black dark:text-white">
                                {replaced}
                              </span>
                            ) : null}
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-neutral-700 rounded-md dark:text-neutral-300">
                    {doing?.spotify ? (
                      <>
                        <img
                          src={
                            doing?.spotify?.album_art_url
                              ? doing?.spotify?.album_art_url
                              : "https://i.imgur.com/XqQXZQH.png"
                          }
                          className="flex-shrink-0 w-16 h-16 rounded-2xl"
                        />

                        <div className="text-sm leading-tight truncate">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-black text-black dark:text-white">
                                {doing?.spotify?.artist
                                  ? doing?.spotify?.artist
                                      .replace(/\;/g, ",")
                                      .replace(/\&/g, "and")
                                  : "Unknown Artist"}
                              </span>
                            </div>
                            <a
                              className="text-neutral-800 dark:text-neutral-200 font-medium"
                              href={`https://open.spotify.com/track/${doing?.spotify.track_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {doing?.listening_to_spotify ? (
                                <>
                                  {doing?.spotify?.song
                                    ? doing?.spotify?.song?.replace(
                                        /\&/g,
                                        "and"
                                      )
                                    : "Unknown Song"}
                                </>
                              ) : (
                                "Unknown Song"
                              )}
                            </a>
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                </FadeIn>
              </>
            ) : (
              <>
                <FadeIn>
                  <div className="flex -space-y-0.5 space-x-1">
                    <svg
                      className="animate-spin h-5 w-5 text-neutral-900 dark:text-neutral-100"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span className="font-medium">Loading..</span>
                  </div>
                </FadeIn>
              </>
            )}
          </div>
        </div>
      </FadeIn>
    </>
  );
};
export default Home;
