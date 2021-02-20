import './App.css';
import NavigationBar from "./NavBar";
import { Container } from "react-bootstrap";
import React from "react";

class App extends React.Component {
  render() {
    return (
        <Container fluid className="App">
          <NavigationBar />
        </Container>
    );
  }
}

export default App;
