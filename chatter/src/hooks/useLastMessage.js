import { useContext } from "react";
import LatestMessagesContext from "../contexts/LatestMessages/LatestMessages";

export const useLastMessage = () => {
  return useContext(LatestMessagesContext);
};
