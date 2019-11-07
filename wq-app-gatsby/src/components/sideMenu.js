import React, { Fragment, useState } from 'react'
import { Menu } from 'semantic-ui-react'
import { Link } from 'gatsby'

const SideMenu = () => {

  const [activeItem, setActiveItem] = useState('home');

  return (
    <Fragment>
   <Menu pointing secondary vertical>
     <Menu.Item name="home" active={activeItem === 'home'} onClick={() => setActiveItem('home')}>
       <Link to="/">Home</Link>
     </Menu.Item>
     <Menu.Item name="map" active={activeItem === 'map'} onClick={() => setActiveItem('map')}>
       <Link to='/map'>Map</Link>
     </Menu.Item>
     <Menu.Item name="about" active={activeItem === 'about'} onClick={() => setActiveItem('about')}>
       <Link to='/about'>About</Link>
     </Menu.Item>
   </Menu>
    </Fragment>
    )
}

export default SideMenu