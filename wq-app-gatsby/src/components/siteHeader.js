import { Link } from "gatsby"
import React, { useState } from "react"
import logo from "../images/TWP_logo_3.png"
import logo2 from "../images/TWP_favicon_2.png"
import {
  Responsive,
  Container,
  Grid,
  GridColumn,
  Image,
  Menu,
  MenuItem,
  Icon,
  SidebarPushable,
  Sidebar,
} from "semantic-ui-react"
import homeStyles from "../styles/home.module.css"

const SiteHeader = () => {
  const [visible, setVisible] = useState(false)

  return (
    <Container fluid className={homeStyles.headerContainer}>
      <Grid>
        <Responsive as={GridColumn} maxWidth={768} width={3}>
          <Link to="/">
            <Image src={logo2} className={homeStyles.logo2}></Image>
          </Link>
        </Responsive>
        <Responsive width={3} as={GridColumn} minWidth={768}>
          <Link to="/">
            <Image src={logo} className={homeStyles.logo}></Image>
          </Link>
        </Responsive>
        <GridColumn width={10}>
          <h1 className={homeStyles.siteHeader}>
            {" "}
            Water Quality in Contra Costa County
          </h1>
        </GridColumn>
        <Responsive as={GridColumn} width={3} minWidth={768}>
          <Menu secondary className={homeStyles.menu}>
            <Link to="/" activeClassName={homeStyles.active}>
              <MenuItem name="home" className={homeStyles.menuItem} />
            </Link>
            <Link to="/about" activeClassName={homeStyles.active}>
              <MenuItem name="about" className={homeStyles.menuItem} />
            </Link>
            <Link to="/download" activeClassName={homeStyles.active}>
              <MenuItem name="download" className={homeStyles.menuItem} />
            </Link>
          </Menu>
        </Responsive>
        <Responsive as={GridColumn} width={3} maxWidth={768}>
          <Icon
            name="bars"
            size="big"
            onClick={() => setVisible(!visible)}
          ></Icon>
          {visible ? (
            <SidebarPushable>
              <Sidebar
                as={Menu}
                animation="overlay"
                icon="labeled"
                inverted
                onHide={() => setVisible(false)}
                vertical
                visible={visible}
                width="thin"
              >
                  <Link to="/">
                    <MenuItem name="home"  />
                  </Link>
                  <Link to="/about" >
                    <MenuItem name="about" />
                  </Link>
                  <Link to="/download" >
                    <MenuItem name="download"  />
                  </Link>
              </Sidebar>
            </SidebarPushable>
          ) : null}
        </Responsive>
      </Grid>
    </Container>
  )
}

export default SiteHeader
