import React from "react"
import { Container, Grid, GridColumn, Divider } from "semantic-ui-react"

const Footer = () => {
  return (
    <Container>
      <Grid>
        <GridColumn textAlign='center'>
          <Divider />
          <Divider hidden/>
          <p>
            Copyright © 2020{" "}
            <a
              href="http://thewatershedproject.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              The Watershed Project
            </a>{" "}
            · App Created by{" "}
            <a
              href="http://www.flowwest.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              FlowWest
            </a>{" "}
            and{" "}
            <a
              href="http://www.iecoi.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Intelligent Ecosystems Institute
            </a>
          </p>
          <Divider hidden/>
        </GridColumn>
      </Grid>
    </Container>
  )
}

export default Footer
