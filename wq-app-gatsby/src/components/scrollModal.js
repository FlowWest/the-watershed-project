import React, { Fragment } from "react"
import { Button, Header, Modal } from "semantic-ui-react"
// import { useStaticQuery, graphql } from "gatsby"

const ScrollModal = props => {

  return (
    <Modal trigger={<Button>{props.category}</Button>}>
      <Modal.Content>
        <Modal.Description>
          <h2>{props.category}</h2>
          <p>{props.description}</p>
          {props.features.map((feature) => {
            return (
              <Fragment>
                <h3>{feature.name}</h3>
                <p>{feature.feature_description}</p>
              </Fragment>
            )
          })}
        </Modal.Description>
      </Modal.Content>
    </Modal>
  )
}

export default ScrollModal
