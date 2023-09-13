import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

let stompClient = null;

export const connectStompClient = () => {
  const socket = new SockJS(
    "http://localhost:6868/portal-articles-websocket-endpoint"
  );
  stompClient = Stomp.over(socket);
};

export const getStompClient = () => stompClient;
