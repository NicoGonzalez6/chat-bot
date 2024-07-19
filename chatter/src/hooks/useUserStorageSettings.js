import { USER_STORAGE_KEY } from "../constants";

export const useUserStorageSettings = () => {
  let state = {};

  const item = localStorage.getItem(USER_STORAGE_KEY);
  if (item) {
    state = JSON.parse(item);
  }
  const setLocalState = (args) => {
    const value = { ...state, ...args };
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(value));
    state = value;
  };
  return { userStorageState: state, setUserStorageState: setLocalState };
};
