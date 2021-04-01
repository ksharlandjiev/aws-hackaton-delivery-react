import React from 'react'

export default function Delivery(props) {

  let component = "Loading....";
  console.log(props)

  return (
    <div>
      <input accept="image/*" id="icon-button-file" type="file" capture="environment" onChange={(e) => props.handleCapture(e.target)}/>
    </div>
  )
}
