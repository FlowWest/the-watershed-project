import React, { useState } from 'react'
import { Menu, MenuItem } from 'semantic-ui-react'
import { Link } from 'gatsby'

const SideMenu = () => {

  const [activeItem, setActiveItem] = useState('home');

  return (
    <Menu pointing secondary vertical>
      <Link to="/">
        <MenuItem name="home" active={activeItem === 'home'} onClick={() => setActiveItem('home')} />
      </Link>
      <Link to="/map">
        <MenuItem name="map" active={activeItem === 'map'} onClick={() => setActiveItem('map')}/>
      </Link>
      <Link to="/about">
        <MenuItem name="about" active={activeItem === 'about'} onClick={() => setActiveItem('about')}/>
      </Link>

        {/* <Link to="/">Home</Link> */}
      {/* </Menu.Item>
      <Menu.Item name="map" active={activeItem === 'map'} onClick={() => setActiveItem('map')}>
        <Link to='/map'>Map</Link>
      </Menu.Item>
      <Menu.Item name="about" active={activeItem === 'about'} onClick={() => setActiveItem('about')}>
       <Link to='/about'>About</Link>
     </Menu.Item> */}
    </Menu>
    )
}

export default SideMenu

// <Link> <MenuItem /></Link>