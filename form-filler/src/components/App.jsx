import "./App.scss";
import React from "react";
import {BrowserRouter as Router} from "react-router-dom";
import NavigationBar from "./NavigationBar";
import {Container} from "react-bootstrap";


class App extends React.Component {
	render() {
		return (
			<Router>
				<Container fluid className="App">
					<NavigationBar/>
				</Container>
			</Router>
		);
	}
}

export default App;
