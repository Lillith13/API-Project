import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { useModal } from "../../../context/Modal";
import * as spotActions from "../../../store/spots";

export default function ReviewModal() {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const [numStars, setNumStars] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [errors, setErrors] = useState({});
  const stars = [1, 2, 3, 4, 5];

  const onSubmit = (e) => {
    e.preventDefault();

    const errs = {};
    if (reviewText.length < 10)
      errs.reviewText = "Review must be 10 characters or longer";
    else {
      console.log("numStars => ", numStars);
      console.log("reviewText => ", reviewText);
      // dispatch();
      window.location.reload(false);
      closeModal();
    }
    setErrors(errs);

    // ! dispatch create spot review
    // ! close modal & reload page
  };

  // ! Additional styling needed (CSS)
  return (
    <div>
      <h1>How was your stay?</h1>
      <form onSubmit={onSubmit}>
        <div>
          {stars.map((star) => (
            <div onClick={(e) => setNumStars(e.target.id)}>
              <i
                className="fa-solid fa-feather"
                style={
                  star <= numStars
                    ? { color: "rgb(32, 185, 32)" }
                    : { color: "#000000" }
                }
                id={star}
                key={star}
              ></i>
            </div>
          ))}{" "}
          Stars
        </div>

        <div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="input" // ? may change class name
            placeholder="Leave your review here..."
            required
          ></textarea>
          {errors.reviewText ? (
            <p className="errors">Review must be 10 characters or longer</p>
          ) : (
            ""
          )}
        </div>

        <button disabled={!reviewText || !numStars ? true : false}>
          Submit Your Review
        </button>
      </form>
    </div>
  );
}
