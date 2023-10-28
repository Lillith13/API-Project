import * as sessionActions from "./session";

import { csrfFetch } from "./csrf";

const LOAD_SPOTS = "spots/loadSpots";
const GET_SPOT = "spots/getSpot";
const ADD_SPOT = "spots/addSpot";
const USER_SPOTS = "spots/userSpots";
const DELETE_SPOT = "spots/deleteSpot";

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

const addSpot = (spot) => {
  return {
    type: ADD_SPOT,
    spot,
  };
};

const userSpots = (spots) => {
  return {
    type: USER_SPOTS,
    spots,
  };
};

const deleteSpot = (spotId) => {
  return {
    type: DELETE_SPOT,
    spotId,
  };
};

export const loadAllSpots = (queryObj) => async (dispatch) => {
  let url = "/api/spots?";
  if (queryObj && queryObj.page != "undefined") url += `page=${queryObj.page}&`;
  if (queryObj && queryObj.size != "undefined") url += `size=${queryObj.size}`;
  const res = await csrfFetch(url, {
    method: "GET",
  });
  const data = await res.json();
  dispatch(loadSpots({ ...data.Spots }));
  return [...data.Spots];
};

export const getASpot = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "GET",
  });
  const spot = await res.json();
  dispatch(getSpot(spot));
  return spot;
};

export const createASpot = (spot, spotImgs, userId) => async (dispatch) => {
  // fetch post spot request
  const res = await csrfFetch("/api/spots", {
    method: "POST",
    body: JSON.stringify({
      ownerId: userId,
      ...spot,
    }),
  });
  const nSpot = await res.json();

  // fetch post spot image request(s)
  await csrfFetch(`/api/spots/${nSpot.id}/images`, {
    method: "POST",
    body: JSON.stringify({
      url: spotImgs[0],
      preview: true,
    }),
  });
  if (spotImgs.length > 1) {
    spotImgs.splice(1).map(async (url) => {
      await csrfFetch(`/api/spots/${nSpot.id}/images`, {
        method: "POST",
        body: JSON.stringify({
          url,
          preview: false,
        }),
      });
    });
  }
  dispatch(addSpot(nSpot)); // <- isn't really necessary ?
  dispatch(sessionActions.restoreUser());
  return nSpot.id;
};

export const loadUserSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots/current", {
    method: "GET",
  });
  const data = await res.json();
  if (!data.message) dispatch(userSpots(data.Spots));
  return data;
};

export const updateSpot = (spotId, spotImgs, newSpot) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    body: JSON.stringify(newSpot),
  });
  let uSpot = await res.json();

  // fetch all spotImageData (to be deleted below)
  const spotRes = await csrfFetch(`/api/spots/${spotId}`, {
    method: "GET",
  });
  const spotData = await spotRes.json();

  // fetch delete all spot images (to be replaced below)
  spotData.SpotImages.forEach(async (img) => {
    await csrfFetch(`/api/spot-images/${img.id}`, {
      method: "DELETE",
    });
  });

  // fetch post spot image request(s)
  await csrfFetch(`/api/spots/${uSpot.id}/images`, {
    method: "POST",
    body: JSON.stringify({
      url: spotImgs[0],
      preview: true,
    }),
  });
  if (spotImgs.length > 1) {
    spotImgs.splice(1).map(async (url) => {
      await csrfFetch(`/api/spots/${uSpot.id}/images`, {
        method: "POST",
        body: JSON.stringify({
          url,
          preview: false,
        }),
      });
    });
  }

  const spotRes2 = await csrfFetch(`/api/spots/${spotId}`, {
    method: "GET",
  });
  uSpot = await spotRes2.json();
  console.log(uSpot);
  dispatch(addSpot(uSpot));
  return res;
};

export const deleteASpot = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });
  if (res.ok) {
    dispatch(deleteSpot(spotId));
    dispatch(sessionActions.restoreUser());
  }
  return res;
};

const spotsReducer = (state = {}, action) => {
  let newState;
  switch (action.type) {
    case LOAD_SPOTS:
      newState = { ...action.spots };
      return newState;
    case GET_SPOT:
      newState = action.spot;
      return newState;
    case ADD_SPOT: // <- isn't really necessary ?
      newState = { ...state, [action.spot.id]: { ...action.spot } };
      return newState;
    case USER_SPOTS:
      newState = { ...action.spots };
      return newState;
    case DELETE_SPOT:
      newState = { ...state };
      for (let spot in newState) {
        if (newState[spot].id === action.spotId) delete newState[spot];
      }
      return newState;
    default:
      return state;
  }
};

export default spotsReducer;
