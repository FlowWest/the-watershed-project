import React, { Fragment } from "react"
import { Modal, Divider } from "semantic-ui-react"
import modalStyles from "../styles/modal.module.css"

const ScrollModal = props => (
  <Modal closeIcon open={props.isVisible} onClose={props.setVisibility}>
    <Modal.Content>
      <Modal.Description>
        <h2 className={modalStyles.category}>{props.category}</h2>
        <p className={modalStyles.categoryDescription}>{props.description}</p>
        <Divider />
        {props.features.map((feature) => (
            <Fragment>
              <h3 className={modalStyles.feature}>{feature.name}</h3>
              <p className={modalStyles.description}>{feature.feature_description}</p>
            </Fragment>
          )
        )}
      </Modal.Description>
    </Modal.Content>
  </Modal>
);

export default ScrollModal
