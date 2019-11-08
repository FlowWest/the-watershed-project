import { Link } from "gatsby"
import React from "react"
import logo from '../images/TWP_logo_3.png'
import { Container, Grid, GridColumn, Image, Menu, MenuItem } from "semantic-ui-react"
import homeStyles from '../styles/home.module.css';

const SiteHeader = () => {

  return(
  <Container fluid className={homeStyles.headerContainer}>
      <Grid>
      <GridColumn width={3}>
        <Link to='/'>
          <Image src={logo} className={homeStyles.logo}/>
        </Link>
      </GridColumn>
      <GridColumn width={10}>
        <h1 className={homeStyles.siteHeader}> Water Quality in Contra Costa County</h1>
      </GridColumn>
      <GridColumn width={3}>
      <Menu secondary className={homeStyles.menu}>
          <Link to="/" activeClassName={homeStyles.active}>
            <MenuItem name="home"className={homeStyles.menuItem} />
          </Link>
          <Link to="/map" activeClassName={homeStyles.active}>
            <MenuItem name="map" className={homeStyles.menuItem} />
          </Link>
          <Link to="/about" activeClassName={homeStyles.active}>
            <MenuItem name="about" className={homeStyles.menuItem} />
          </Link>
        </Menu>
      </GridColumn>
    </Grid>
  </Container>
  )
}

export default SiteHeader
