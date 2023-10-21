import { csrfFetch } from "./csrf";

const LOG_IN = "session/setUser";
const LOG_OUT = "session/unsetUser";
const SIGN_UP = "session/newUser";

const setUser = (user) => {
  return {
    type: LOG_IN,
    user,
  };
};

const unsetUser = () => {
  return {
    type: LOG_OUT,
  };
};

const newUser = (user) => {
  return {
    type: SIGN_UP,
    user,
  };
};

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const res = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await res.json();
  dispatch(setUser(data.user));
  return res;
};

export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const res = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });
  const data = await res.json();
  dispatch(newUser(data.user));
  return res;
};

export const logout = () => async (dispatch) => {
  const res = await csrfFetch("/api/session", {
    method: "DELETE",
  });
  dispatch(unsetUser());
  return res;
};

export const restoreUser = () => async (dispatch) => {
  const res = await csrfFetch("/api/session", {
    method: "GET",
  });
  const data = await res.json();
  dispatch(setUser(data.user));
  return res;
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case LOG_IN:
      newState = Object.assign({}, state);
      newState.user = action.user;
      return newState;
    case SIGN_UP:
      newState = Object.assign({}, state);
      newState.user = action.user;
      return newState;
    case LOG_OUT:
      newState = { user: null };
      return newState;
    default:
      return state;
  }
};

export default sessionReducer;
