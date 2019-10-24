import { Link } from "gatsby"
import React from "react"
import logo from '../images/TWP_logo.png'
import { Grid, Menu, MenuItem, Image, Header } from "semantic-ui-react"

const SiteHeader = () => (
  <Grid>
    <Grid.Column width={16}>
      <Menu>
        <MenuItem>
          <Link to="/">Home</Link>
        </MenuItem>
        <MenuItem>
          <Link to='/map'>Map</Link>
        </MenuItem>
        <MenuItem>
          <Link to='/about'>About</Link>
        </MenuItem>
      </Menu>
    </Grid.Column>
    <Grid.Column width={2}>
      <Image src={logo} />
    </Grid.Column>
    <Grid.Column width={14}>
      <Header as="h1">Water Quality in Contra Costa County</Header>
    </Grid.Column>
  </Grid>
)

export default SiteHeader
