import React, { useState } from "react";
import { useModal } from "../../context/Modal";

export default function OpenVerifyDeleteModal({ modalComponent, itemText }) {
  const { setModalContent } = useModal();

  const [show, setShow] = useState(false);

  const onClick = () => {
    setModalContent(modalComponent);
  };

  return (
    <button className="openDeleteModalButton" onClick={onClick}>
      {itemText}
    </button>
  );
}
