import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import { useModal } from "../../../context/Modal";
import * as reviewActions from "../../../store/reviews";

import "./ReviewModal.css";

export default function ReviewModal({ spotId }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const [numStars, setNumStars] = useState(0);
  const [activeStar, setActiveStar] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [errors, setErrors] = useState({});
  const stars = [1, 2, 3, 4, 5];

  const onSubmit = (e) => {
    e.preventDefault();

    const errs = {};
    if (reviewText.length < 10)
      errs.reviewText = "Review must be 10 characters or longer";
    else {
      const newRevData = {
        spotId,
        stars: numStars,
        review: reviewText,
      };
      dispatch(reviewActions.newReview(newRevData))
        .then(() => closeModal())
        .catch((e) => {
          setErrors(e); // ? no idea if this will actually catch errors for if someone who has already reviewed tries reviewing again (no way to test it without removing implemented error handlers for other required error checks);
        });
    }
    setErrors({ ...errors, ...errs });
  };

  useEffect(() => {
    if (reviewText.length > 10) {
      setErrors({});
    }
  }, [reviewText]);

  return (
    <div className="reviewModalDiv">
      <h1>How was your stay?</h1>
      <form onSubmit={onSubmit}>
        <div className="reviewFormDiv">
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="input" // ? may change class name
            placeholder="Leave your review here..."
            style={{ width: "100%" }}
            required
          ></textarea>
          {errors.reviewText ? (
            <p className="errors">Review must be 10 characters or longer</p>
          ) : (
            ""
          )}
        </div>

        <div
          className="starsDiv"
          onClick={(e) => {
            numStars === e.target.id
              ? setNumStars(0)
              : setNumStars(e.target.id);
          }}
        >
          {stars.map((star) => (
            <i
              className={`fa-solid fa-feather`}
              id={star}
              key={star}
              style={
                numStars >= star
                  ? { color: "rgb(32, 185, 32)" }
                  : { color: "black" }
              }
            ></i>
          ))}{" "}
          Stars
        </div>

        <button
          className="postRevButton"
          disabled={
            (!reviewText && reviewText.length < 10) || !numStars ? true : false
          }
        >
          Submit Your Review
        </button>
      </form>
    </div>
  );
}
