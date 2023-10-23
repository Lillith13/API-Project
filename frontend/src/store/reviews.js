import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = "reviews/loadReviews";

const loadReviews = (reviews) => {
  return {
    type: LOAD_REVIEWS,
    reviews,
  };
};

export const loadSpotReviews = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "GET",
  });
  const spotReviews = await res.json();
  dispatch(loadReviews(spotReviews.Reviews));
  return res;
};

const reviewsReducer = (state = [], action) => {
  let newState;
  switch (action.type) {
    case LOAD_REVIEWS:
      newState = [...action.reviews];
      return newState;
    default:
      return state;
  }
};

export default reviewsReducer;
