import { Link } from "gatsby"
import React, { useState } from "react"
import logo from '../images/TWP_logo_3.png'
import { Container, Grid, GridColumn, Image, Icon, Menu, MenuItem } from "semantic-ui-react"
import homeStyles from '../styles/home.module.css';

const SiteHeader = () => {

  return(
  <Container>
      <Grid>
      <GridColumn width={2}>
        <Link to='/'>
          < Image src={logo}/>
        </Link>
      </GridColumn>
      <GridColumn width={11}>
        <h1 className={homeStyles.siteHeader}> Water Quality in Contra Costa County</h1>
      </GridColumn>
      <GridColumn width={3}>
      <Menu secondary>
          <Link to="/" activeClassName={homeStyles.active}>
            <MenuItem name="home"/>
          </Link>
          <Link to="/map" activeClassName={homeStyles.active}>
            <MenuItem name="map"/>
          </Link>
          <Link to="/about" activeClassName={homeStyles.active}>
            <MenuItem name="about" />
          </Link>
        </Menu>
      </GridColumn>
    </Grid>
  </Container>
  )
}

export default SiteHeader
