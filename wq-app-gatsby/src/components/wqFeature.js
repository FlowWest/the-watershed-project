import React, { Fragment, useState } from "react";
import homeStyles from '../styles/home.module.css';
import waterDrop from '../images/drop.png';
import ScrollModal from './scrollModal';

const WQFeature = (props) => {
  const [isVisible, setVisibility] = useState(false);
  const [ blobBackground, toggleBlobBackground] = useState(false)
  const toggleModal = () => setVisibility(!isVisible);
  const mouseEnter = () => toggleBlobBackground(true);
  const mouseLeave = () => toggleBlobBackground(false);

  return (
    <Fragment>
      < div className = { blobBackground ? homeStyles.wqFeatureDark : homeStyles.wqFeature }
        onClick={toggleModal}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}>
        <img className={homeStyles.waterDrop} src={waterDrop} />
        <h3 className={homeStyles.header}>{props.category}</h3>
      </div>
      <ScrollModal
        isVisible={isVisible}
        setVisibility={toggleModal}
        category={props.category}
        description={props.description}
        features={props.features}
      />
    </Fragment>
  )

}

export default WQFeature;