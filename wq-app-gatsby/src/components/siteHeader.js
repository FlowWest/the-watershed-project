import { Link } from "gatsby"
import React, { useState } from "react"
import logo from '../images/TWP_logo_3.png'
import { Grid, GridColumn, Button, Image, Icon } from "semantic-ui-react"
import homeStyles from '../styles/home.module.css';
import SideMenu from './sideMenu'

const SiteHeader = () => {

  const [activeItem, setActiveItem] = useState('home');
  const [menuVisibility, setMenuVisibility] = useState('')

  return(

    <Grid>
    <GridColumn width={16}>
    <SideMenu />
    </GridColumn>
    <GridColumn width={2}>
      <Link to='/'>
        < Image src={logo}/>
      </Link>
    </GridColumn>
    <GridColumn width={12}>
      <h1 className={homeStyles.siteHeader}> Water Quality in Contra Costa County</h1>
    </GridColumn>
    <GridColumn width={2}>
      <div  onClick={null} onMouseEnter={null} onMouseLeave={null}>
          <Icon color="blue"
            name="bars"
            size="big"
            link
            onClick={null}
          />
      </div>
    </GridColumn>

  </Grid>
  )
}

export default SiteHeader
