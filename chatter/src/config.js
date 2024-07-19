import { toast } from "react-toastify";
import reciveSound from "./assets/sounds/receive.mp3";
import sendSound from "./assets/sounds/send.mp3";
import { VITE_BASE_API_URL } from "./common/constants";
import axios, { AxiosError } from "axios";

export class AxiosInstance {
  constructor() {
    this.instance = axios.create({
      baseURL: `${VITE_BASE_API_URL}/api/v1`,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.instance.interceptors.request.use(this.handleRequest, this.handleError);

    this.instance.interceptors.response.use(this.handleResponse, this.handleError);
  }

  handleRequest(config) {
    return config;
  }

  handleResponse(response) {
    return response;
  }

  handleError(error) {
    if (error instanceof AxiosError) {
      toast.error(error.response.data.message);
    } else {
      toast.error("Something went wrong");
    }
    return Promise.reject(error);
  }

  getInstance() {
    return this.instance;
  }
}

export const AXIOS_INSTANCE = new AxiosInstance().getInstance();

export default {
  BOT_SERVER_ENDPOINT: VITE_BASE_API_URL,
  SEND_AUDIO: sendSound,
  RECEIVE_AUDIO: reciveSound,
};
