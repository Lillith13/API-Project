import React, { useState, useEffect, useRef } from "react";
import { useModal } from "../../context/Modal";

export default function OpenReviewModal({ modalComponent, itemText }) {
  const { setModalContent } = useModal();

  const [show, setShow] = useState(false);

  const onClick = () => {
    setModalContent(modalComponent);
  };

  return (
    <button className="openRevModal" onClick={onClick}>
      {itemText}
    </button>
  );
}
