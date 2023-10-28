import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as reviewActions from "../../store/reviews";

import "./ManageReviews.css";

export default function ManageReviews() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.session);
  const reviews = useSelector((state) => state.reviews);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(reviewActions.getUserReviews()).then(() => setIsLoaded(true));
  }, [dispatch]);
  return (
    <div>
      <h1>Manage Reviews</h1>
      {isLoaded &&
        reviews.length > 0 &&
        reviews.toReversed().map((review) => (
          <div>
            <h3>{review.Spot.name}</h3>
            <h4>{review.updatedAt}</h4>
            <p>{review.review}</p>
            <button>Update</button>
            <button>Delete</button>
          </div>
        ))}
    </div>
  );
}
