import { USER_STORAGE_KEY } from "../common/constants/user";

/**
 * Hook used to store and simulate the user active session
 */
export const useUserStorageSettings = () => {
  let state = undefined;

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
