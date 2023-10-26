import { csrfFetch } from "./csrf";

import * as spotsActions from "./spots";

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

export const newReview =
  ({ spotId, stars, review }) =>
  async (dispatch) => {
    await csrfFetch(`/api/spots/${spotId}/reviews`, {
      method: "POST",
      body: JSON.stringify({ stars, review }),
    });
    dispatch(spotsActions.getASpot(spotId));
    dispatch(loadSpotReviews(spotId));
  };

export const deleteReview =
  ({ revId, spotId }) =>
  async (dispatch) => {
    await csrfFetch(`/api/reviews/${revId}`, {
      method: "DELETE",
    });
    dispatch(spotsActions.getASpot(spotId));
    dispatch(loadSpotReviews(spotId));
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
