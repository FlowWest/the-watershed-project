import React from "react";
import homeStyles from '../styles/home.module.css';
import waterDrop from '../images/drop.png'

const WQFeature = (props) => (
  <div className={homeStyles.wqFeature}>
    <img className={homeStyles.waterDrop} src={waterDrop} />
    <h3 className={homeStyles.header}>{props.category}</h3>
  </div>
)

export default WQFeature;