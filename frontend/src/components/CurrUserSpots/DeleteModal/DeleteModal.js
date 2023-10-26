import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";

import * as spotActions from "../../../store/spots";

export default function VerifyDeleteModal({ spotId }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const handleClose = () => {
    closeModal();
  };
  const handleDelete = () => {
    dispatch(spotActions.deleteASpot(spotId)); /* .then(() => {}) */
    window.location.reload(false); // <- find a better way to do this but as of right now this is the best way without changing /mySpots back to pulling spots from session rather than a one time pull and saved to useState (changing this back will cause menu modal opening interfere with what's being displayed at /mySpots)
  };

  return (
    <div>
      <h1>Confirm Delete</h1>
      <button onClick={handleDelete}>Yes (Delete Spot)</button>
      <button onClick={handleClose}>No (Keep Spot)</button>
    </div>
  );
}
