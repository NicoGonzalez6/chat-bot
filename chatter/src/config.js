import { toast } from "react-toastify";
import reciveSound from "./assets/sounds/receive.mp3";
import sendSound from "./assets/sounds/send.mp3";
import { VITE_BASE_API_URL } from "./constants";
import axios, { AxiosError } from "axios";
import io from "socket.io-client";

export const CONFIG = {
  BOT_SERVER_ENDPOINT: VITE_BASE_API_URL,
  SEND_AUDIO: sendSound,
  RECEIVE_AUDIO: reciveSound,
};

/**
 * AXIOS SINGLETON INSTANCE
 */
export class AxiosInstance {
  constructor() {
    if (AxiosInstance.instance) {
      return AxiosInstance.instance;
    }

    this.instance = axios.create({
      baseURL: `${VITE_BASE_API_URL}/api/v1`,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.instance.interceptors.request.use(this.handleRequest, this.handleError);
    this.instance.interceptors.response.use(this.handleResponse, this.handleError);

    AxiosInstance.instance = this;
  }
  handleRequest(config) {
    return config;
  }

  handleResponse(response) {
    return response?.data;
  }

  handleError(error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data?.message);
    } else {
      toast.error("Something went wrong");
    }
    return Promise.reject(error);
  }

  getInstance() {
    return this.instance;
  }
}

/**
 * SOCKET SINGLETON INSTANCE
 */
class SocketInstance {
  constructor() {
    if (!SocketInstance.instance) {
      this.socket = io(CONFIG.BOT_SERVER_ENDPOINT, {
        transports: ["websocket", "polling", "flashsocket"],
      });
      SocketInstance.instance = this;
    }

    return SocketInstance.instance;
  }

  on(event, handler) {
    this.socket.on(event, handler);
  }

  off(event, handler) {
    this.socket.off(event, handler);
  }

  emit(event, data) {
    this.socket.emit(event, data);
  }

  disconnect() {
    this.socket.disconnect();
  }

  getInstance() {
    return this.socket;
  }
}

export const socket = new SocketInstance();
export const AXIOS_INSTANCE = new AxiosInstance().getInstance();
