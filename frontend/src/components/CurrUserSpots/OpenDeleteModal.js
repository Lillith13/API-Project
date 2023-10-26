import React, { useState, useEffect, useRef } from "react";
import { useModal } from "../../context/Modal";

export default function OpenVerifyDeleteModal({ modalComponent, itemText }) {
  const { setModalContent, setOnModalClose } = useModal();

  const [show, setShow] = useState(false);

  const onClick = () => {
    setModalContent(modalComponent);
  };

  return <button onClick={onClick}>{itemText}</button>;
}
