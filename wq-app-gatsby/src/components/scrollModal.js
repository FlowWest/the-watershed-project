import React from 'react'
import { Button, Header, Modal } from 'semantic-ui-react'

const ScrollModal = (props) => {


  return(
    <Modal trigger={<Button>{props.title}</Button>}>
      {/* <Modal.Header>Water Quality Feature</Modal.Header> */}
      <Modal.Content>
        <Modal.Description>
          <Header>{props.title}</Header>
          <p>dkjfojoeijf</p>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  )
}
 

export default ScrollModal
