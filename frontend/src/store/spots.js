import { csrfFetch } from "./csrf";

const LOAD_SPOTS = "spots/loadSpots";
const GET_SPOT = "spots/getSpot";

const loadSpots = (spots) => {
  return {
    type: LOAD_SPOTS,
    spots,
  };
};

const getSpot = (spot) => {
  return {
    type: GET_SPOT,
    spot,
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

export const getASpot = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "GET",
  });
  const spot = await res.json();
  dispatch(getSpot(spot));
  return res;
};

const spotsReducer = (state = {}, action) => {
  let newState;
  switch (action.type) {
    case LOAD_SPOTS:
      newState = Object.assign({}, state);
      newState.spots = action.spots;
      return newState;
    case GET_SPOT:
      newState = { ...action.spot };
      return newState;
    default:
      return state;
  }
};

export default spotsReducer;
