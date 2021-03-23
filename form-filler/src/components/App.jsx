import "./App.scss";
import React from "react";
import {BrowserRouter as Router} from "react-router-dom";
import NavigationBar from "./NavigationBar";
import {Container} from "react-bootstrap";

const SERVER_URL = "http://dababysdcbackendapi-env-2.eba-ybqn7as3.ca-central-1.elasticbeanstalk.com";

class App extends React.Component {
	// Backend call
	componentDidMount() {
		fetch(`${SERVER_URL}/api/test/sdcform/covid19`)
			.then((response) => response.json())
			.then((data) =>
				this.setState({isLoaded: true, sdcForm: data.sdcFormObject})
			)
			.catch((error) => {
				this.setState({errorMessage: error.toString()});
				console.log(error);
			});
	}

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
