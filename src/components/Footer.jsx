import React from "react";
import "./Footer.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faClipboard as farClipboard } from "@fortawesome/free-regular-svg-icons";

const Footer = ({ handleShow, handleTab, props }) => {


  return (
    <footer className="px-2">
      <div className="menu-left">
        <button
          className="menu-btn btn btn-white {props.active === props.id? 'active' : ''}"
          onClick={() => handleTab(1)}
        >
          <FontAwesomeIcon size="lg" icon={faHouse} />

          <p className="little-p m-0"> Xarajatlar</p>
        </button>
      </div>
      <button className="add-btn btn btn-primary shadow" onClick={handleShow}>
        <FontAwesomeIcon icon={faPlus} />
      </button>

      <div className="menu-right">
        <span className="btn-back"></span>
        <button className="menu-btn btn btn-white" onClick={() => handleTab(2)}>
          <FontAwesomeIcon size="lg" icon={farClipboard} />
          <p className="little-p m-0"> Qarzlar </p>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
