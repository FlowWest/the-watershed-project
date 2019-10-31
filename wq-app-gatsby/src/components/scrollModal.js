import React, { Fragment } from "react"
import { Modal } from "semantic-ui-react"

const ScrollModal = props => (
  <Modal closeIcon open={props.isVisible} onClose={props.setVisibility}>
    <Modal.Content>
      <Modal.Description>
        <h2>{props.category}</h2>
        <p>{props.description}</p>
        {props.features.map((feature) => (
            <Fragment>
              <h3>{feature.name}</h3>
              <p>{feature.feature_description}</p>
            </Fragment>
          )
        )}
      </Modal.Description>
    </Modal.Content>
  </Modal>
);

export default ScrollModal
