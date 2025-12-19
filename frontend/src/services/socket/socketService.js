import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const socket = io(API_URL, {
  transports: ["websocket"]
});

export default socket;