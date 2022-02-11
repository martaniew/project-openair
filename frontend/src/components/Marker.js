import React from "react";
import InfoWindow from "./InfoWindow";

//displaying map marker
const Marker = (props) => {
  let show = props.activity.show;

  const markerStyle = {
    border: "1px solid white",
    borderRadius: "50%",
    height: props.enlarged ? 20 : 10,
    width: props.enlarged ? 20 : 10,
    backgroundColor: show ? "red" : "blue",
    cursor: "pointer",
    zIndex: 10,
  };

  return (
    <>
      <div style={markerStyle} />
      {show && <InfoWindow activity={props.activity} />}
    </>
  );
};

export default Marker;
