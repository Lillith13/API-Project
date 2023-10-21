import React from "react";
import { useModal } from "../../context/Modal";

function OpenModalMenuItem({
  modalComponent, // component to render inside the modal
  itemText, // text of the menu item that opens the modal
  onItemClick, // optional: callback function that will be called once the menu item that opens the modal is clicked
  onModalClose, // optional: callback function that will be called once the modal is closed
}) {
  const { setModalContent, setOnModalClose } = useModal();

  const onClick = () => {
    if (onModalClose) setOnModalClose(onModalClose);
    setModalContent(modalComponent);
    if (onItemClick) onItemClick();
  };

  let display;
  if (itemText && itemText !== "undefined") {
    display = (
      <div className="button">
        {/* change to link/plain text later */}
        <button onClick={onClick}>{itemText}</button>
      </div>
    );
  } else {
    display = (
      <div>
        <button className="menu" onClick={onClick}>
          <i class="fa-solid fa-bars"></i>
          <i className="fas fa-user-circle" />
        </button>
      </div>
    );
  }

  return display;
}

export default OpenModalMenuItem;
