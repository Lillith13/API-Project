import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

import * as spotActions from "../../store/spots";
import * as reviewActions from "../../store/reviews";

export default function VerifyDeleteModal(props) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const handleClose = () => {
    closeModal();
  };
  const handleDelete = () => {
    if (props.reviewId) {
      dispatch(
        reviewActions.deleteReview({
          revId: props.reviewId,
          spotId: props.spotId,
        })
      );
    } else {
      dispatch(spotActions.deleteASpot(props.spotId));
    }
    closeModal();
  };

  return (
    <div>
      <h1>Confirm Delete</h1>
      <button onClick={handleDelete}>
        {props.reviewId ? "Yes (Delete Review)" : "Yes (Delete Spot)"}
      </button>
      <button onClick={handleClose}>
        {props.reviewId ? "No (Keep Review" : "No (Keep Spot)"}
      </button>
    </div>
  );
}
