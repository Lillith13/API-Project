import { csrfFetch } from "./csrf";

const LOAD_SPOTS = "spots/loadSpots";

const loadSpots = (spots) => {
  return {
    type: LOAD_SPOTS,
    spots,
  };
};

export const loadAllSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots", {
    method: "GET",
  });
  const data = await res.json();
  dispatch(loadSpots(data.Spots));
  return res;
};

const spotsReducer = (state = {}, action) => {
  let newState;
  switch (action.type) {
    case LOAD_SPOTS:
      newState = Object.assign({}, state);
      newState.spots = action.spots;
      return newState;
    default:
      return state;
  }
};

export default spotsReducer;
