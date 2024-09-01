import { USER_STORAGE_KEY } from "../constants";

/**
 * Using session storage so its simpler to
 * test multiple users
 */
export const useUserStorageSettings = () => {
  let state = {};

  const item = sessionStorage.getItem(USER_STORAGE_KEY);
  if (item) {
    state = JSON.parse(item);
  }
  const setLocalState = (args) => {
    const value = { ...state, ...args };
    sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(value));
    state = value;
  };
  return { userStorageState: state, setUserStorageState: setLocalState };
};
