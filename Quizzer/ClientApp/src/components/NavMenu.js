import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import {authenticationService} from "../services/helpers";

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true,
      currentUser : null,
      isAdmin : false
    };
  }

  componentDidMount() {
    authenticationService.currentUser.subscribe(x => this.setState({ currentUser: x }));
    authenticationService.userIsAdmin.subscribe(x => this.setState({ isAdmin : x }));
    this.setState({isAdmin : authenticationService.isAdmin()});
  }

  logout() {
    authenticationService.logout();
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render () {
    const { currentUser } = this.state;
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm navbar-dark bg-dark border-bottom box-shadow mb-3" light>
          <Container>
            <NavbarBrand tag={Link} to="/">Quizzer</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
                {currentUser &&
                  <Link onClick={this.logout} to="/" className="nav-item nav-link">Logout</Link>
                }
                {!currentUser &&
                <React.Fragment>
                  <NavItem>
                    <NavLink tag={Link} className="text-white" to="/login">Login</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink tag={Link} className="text-white" to="/register">Register</NavLink>
                  </NavItem>
                </React.Fragment>
                }
                <NavItem>
                  <NavLink tag={Link} className="text-white" to="/">Home</NavLink>
                </NavItem>
                  {this.state.isAdmin &&
                    <NavItem>
                      <NavLink tag={Link} className="text-white" to="/appconfig">Admin</NavLink>
                    </NavItem>
                  }
              </ul>
            </Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
}
