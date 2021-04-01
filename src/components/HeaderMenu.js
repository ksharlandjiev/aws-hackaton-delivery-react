import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'

export default class HeaderMenu extends Component {
  state = {
    activeItem: "delivery"
  }

  handleItemClick = (e, { name }) => {
    console.log(e);
    this.setState({ activeItem: name })
  }

  render() {
    const { activeItem } = this.state

    return (
      <Menu>
        <Menu.Item
          as={NavLink} to="/"
          name='delivery'
          active={activeItem === 'delivery'}
          onClick={this.handleItemClick}
        >
          Pending Deliveries
        </Menu.Item>
      </Menu>
    )
  }
}
