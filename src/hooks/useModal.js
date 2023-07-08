import { useState } from "react";

const useModal = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return [show, handleShow, handleClose];
};

export default useModal;
