import { addMessage, setConnected } from "@/state/socket/socketIO";
import { RootState } from "@/state/store";
import { Message } from "@/types/Chat";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";

const socketUrl = import.meta.env.VITE_SOCKET_URL;

/**
 * Connects to the project chat room over Socket.IO.
 *
 * The connection carries the auth cookie (withCredentials), so the server
 * identifies the user from the handshake — the client never sends its own
 * userId, which is why these events only take the room and payload.
 */
const useSocket = (projectId: number) => {
  const dispatch = useDispatch();
  const isConnected = useSelector((state: RootState) => state.socket.isConnected);

  const socket = useMemo<Socket>(
    () => io(socketUrl, { withCredentials: true, autoConnect: false }),
    []
  );

  useEffect(() => {
    const room = projectId.toString();

    socket.on("connect", () => {
      dispatch(setConnected(true));
      socket.emit("joinRoom", room);
    });
    socket.on("disconnect", () => dispatch(setConnected(false)));
    socket.on("message", (message: Message) => dispatch(addMessage(message)));
    socket.on("receiveMessages", (messages: Message[]) => {
      messages.forEach((message) => dispatch(addMessage(message)));
    });
    socket.on("error", (error: { message: string }) => console.error(error.message));

    socket.connect();

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [socket, dispatch, projectId]);

  const sendMessage = (message: string) => {
    if (socket.connected) {
      socket.emit("message", { room: projectId.toString(), content: message });
    }
  };

  const fetchMessages = (offset: number) => {
    if (socket.connected) {
      socket.emit("fetchMessages", projectId.toString(), offset);
    }
  };

  return { sendMessage, fetchMessages, isConnected };
};

export default useSocket;
