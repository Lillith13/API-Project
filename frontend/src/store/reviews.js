import { csrfFetch } from "./csrf";

import * as spotsActions from "./spots";

const LOAD_REVIEWS = "reviews/loadReviews";
const USER_REVIEWS = "reviews/loadUserReviews";

const loadReviews = (reviews) => {
  return {
    type: LOAD_REVIEWS,
    reviews,
  };
};

const loadUserReviews = (userReviews) => {
  return {
    type: USER_REVIEWS,
    userReviews,
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

export const getUserReviews = () => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/current`, {
    method: "GET",
  });
  const data = await res.json();
  console.log(data.Reviews);
  dispatch(loadUserReviews(data.Reviews));
};

const reviewsReducer = (state = [], action) => {
  let newState;
  switch (action.type) {
    case LOAD_REVIEWS:
      newState = [...action.reviews];
      return newState;
    case USER_REVIEWS:
      newState = action.userReviews;
      console.log(newState);
      return newState;
    default:
      return state;
  }
};

export default reviewsReducer;
