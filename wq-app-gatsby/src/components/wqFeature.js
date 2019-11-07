import React, { Fragment, useState } from "react"
import homeStyles from "../styles/home.module.css"
import waterDrop from "../images/drop.png"
import ScrollModal from "./scrollModal"

const WQFeature = props => {
  const [isVisible, setVisibility] = useState(false)
  const toggleModal = () => setVisibility(!isVisible)
  
  return (
    <Fragment>
      <div className={homeStyles.container} onClick={toggleModal}>
        <img className={homeStyles.waterDrop} src={waterDrop} />
        <h3 className={homeStyles.header}>{props.category}</h3>
        <div className={homeStyles.overlay}>
          <div className={homeStyles.text}>Learn More</div>
        </div>
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

export default WQFeature
