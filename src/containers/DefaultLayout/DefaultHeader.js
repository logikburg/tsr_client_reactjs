import React, { Component } from 'react';
import { Alert, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, Dropdown } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from '../../_actions/simlogin.actions';

import { AppHeaderDropdown, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/logo.png'
import sygnet from '../../assets/img/brand/sygnet.svg'

import User from '../../components/User';
//import { userConstants } from '../../_constants/user.constants';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    let { displayname } = JSON.parse(localStorage.getItem('user'));

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 89, height: 25, alt: 'CoreUI Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'CoreUI Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="" navbar>
          {/* <NavItem className="px-3">
            <NavLink href="/">Dashboard</NavLink>
          </NavItem>
          <NavItem className="px-3">
            <NavLink href="#/users">Users</NavLink>
          </NavItem> */}
          {/* <NavItem className="px-3">
            <NavLink href="#/create/bundle">New Bundle</NavLink>
          </NavItem> */}
          <NavItem className="px-3">
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle color="primary" caret>Create New</DropdownToggle>
              <DropdownMenu>
                <DropdownItem href="#/create/bundle">Bundle Requests</DropdownItem>
                <DropdownItem href="#/create/request">Individual Request</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavItem>

          {/* <NavItem className="px-3">
            <NavLink href="#">Settings</NavLink>
          </NavItem> */}
        </Nav>

        {(process.env.REACT_APP_SYS_ENV === 'maintenance') &&
          < Nav className="ml-auto"><NavItem><Alert color="danger">*** Maintenance Mode in == PRODUCTION == Don't do any update if not sure ***</Alert></NavItem></Nav>}
        {(process.env.REACT_APP_SYS_ENV === 'cypress_test') &&
          < Nav className="ml-auto"><NavItem><Alert color="danger">Under Auto-Testing</Alert></NavItem></Nav>}
        {(process.env.REACT_APP_SYS_ENV !== 'production') && (process.env.REACT_APP_SYS_ENV !== 'maintenance') && (process.env.REACT_APP_SYS_ENV !== 'cypress_test') &&
          < Nav className="ml-auto"><NavItem><Alert color="warning"> ===== Non-Production ({process.env.REACT_APP_SYS_ENV})  Environment ===== </Alert></NavItem></Nav>}

        <Nav className="ml-auto" navbar>
          {/*  
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-bell"></i><Badge pill color="danger">5</Badge></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-list"></i></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink href="#"><i className="icon-location-pin"></i></NavLink>
          </NavItem>
          <Nav><NavItem>Hi, {displayname.replace('&amp;', '&')} </NavItem></Nav>
          */}


          <Nav><NavItem>Hi, {displayname.replace('&amp;', '&')}  </NavItem></Nav>
          <Nav><NavItem> </NavItem></Nav>
          <Nav className="ml-auto" navbar>
            <AppHeaderDropdown direction="down">
              <DropdownToggle nav>
                {/* <img src={'assets/img/avatars/6.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" />*/}
                <div>{User.avatar}</div>
              </DropdownToggle>
              <DropdownMenu right style={{ right: 'auto' }}>
                {/*               <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
              <DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge color="info">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
              <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
              <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
              <DropdownItem><i className="fa fa-usd"></i> Payments<Badge color="secondary">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem>
              <DropdownItem divider />
              <DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem>
              <DropdownItem href="/#/login"><i className="fa fa-lock"></i> Logout</DropdownItem>
               */}

                <DropdownItem onClick={this.onPress}><i className="fa fa-lock"></i> Logout</DropdownItem>
              </DropdownMenu>
            </AppHeaderDropdown>
          </Nav>
        </Nav>
        {/* <AppAsideToggler className="d-md-down-none" /> */}

        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }

  onPress(e) {
    e.preventDefault();
    //let { corpid, team, role } = this.state;
    //let { corpid } = this.state;
    this.props.dispatch(logout())
  }
}
function select(state) {
  return {
    data: state
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default connect(select)(DefaultHeader);
