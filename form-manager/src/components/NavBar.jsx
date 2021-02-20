import "./NavBar.scss";

import React from "react";
import { Navbar, Nav } from "react-bootstrap";

class NavigationBar extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Navbar bg="sdc" fixed="top">
				<Navbar.Brand href="#home">SDCManager</Navbar.Brand>
				<Nav>
					<Nav.Link href="#home">Home</Nav.Link>
					<Nav.Link href="#all-forms">View All Forms</Nav.Link>
				</Nav>
			</Navbar>
		);
	}
}

export default NavigationBar;