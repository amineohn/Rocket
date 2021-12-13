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

      if (op === Operation.Hello) {
        setInterval(
          () => send(Operation.Heartbeat),
          (d as { heartbeat_interval: number }).heartbeat_interval
        );
        send(Operation.Initialize, {
          subscribe_to_id: id,
        });
      } else if (op === Operation.Event && t) {
        if ([EventType.INIT_STATE, EventType.PRESENCE_UPDATE].includes(t))
          setDoing(d as Presence);
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
    () => doing?.activities.filter((activity) => activity.type === 0)[0],
    [doing]
  );

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
                          <div className="text-gray-700 text-xl font-bold mb-2">
                            Connecting...
                          </div>
                          <div className="text-gray-700 text-sm">
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
                          <div className="text-gray-700 text-xl font-bold mb-2">
                            Disconnected
                          </div>
                          <div className="text-gray-700 text-sm">
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
                <span className="absolute pin-y pin-l flex items-center">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-5.6-4.29a9.95 9.95 0 0 1 11.2 0 8 8 0 1 0-11.2 0zm6.12-7.64l3.02-3.02 1.41 1.41-3.02 3.02a2 2 0 1 1-1.41-1.41z" />
                  </svg>
                </span>
                <span className="text-xs">Connection...</span>
              </div>
            )}
            {error && (
              <div className="flex justify-center items-center bg-red-500 text-white text-sm font-bold px-4 py-3 rounded relative">
                <span className="absolute pin-y pin-l flex items-center">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-5.6-4.29a9.95 9.95 0 0 1 11.2 0 8 8 0 1 0-11.2 0zm6.12-7.64l3.02-3.02 1.41 1.41-3.02 3.02a2 2 0 1 1-1.41-1.41z" />
                  </svg>
                </span>
                <span className="text-xs">{error}</span>
              </div>
            )}
            <form className="flex flex-col space-y-2" method="POST">
              <input
                className="appearance-none bg-transparent border-b-2 border-gray-200 text-gray-700 mb-3 py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
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
            <>
              <div className="flex items-center">
                <img
                  className="h-12 w-12 rounded-full"
                  src={`https://cdn.discordapp.com/avatars/${id}/${doing?.discord_user.avatar}?size=80`}
                />
                <div className="ml-4">
                  <div className="text-lg font-semibold">
                    {doing?.discord_user.username}
                  </div>
                  <div className="text-gray-600">
                    #{doing?.discord_user.discriminator}
                  </div>
                </div>
              </div>
            </>
          </div>
        </div>
      </FadeIn>
    </>
  );
};
export default Home;
