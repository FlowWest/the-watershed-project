import React, { Fragment } from "react"
import { Button, Header, Modal } from "semantic-ui-react"
// import { useStaticQuery, graphql } from "gatsby"

const ScrollModal = props => {

  console.log(props.wqFeatures)
  return (
    <Modal trigger={<Button>{props.category}</Button>}>
      <Modal.Content>
        <Modal.Description>
          <Header>{props.category}</Header>
          <p>{props.description}</p>
          {props.wqFeatures.map((wqFeature) => {
            return (
              <Fragment>
                <h3>{wqFeature.name}</h3>
                <p>{wqFeature.description}</p>
              </Fragment>
            )
          })}
          {/* Each WQ Feature within a Category and it's description */}
        </Modal.Description>
      </Modal.Content>
    </Modal>
  )
}

export default ScrollModal
