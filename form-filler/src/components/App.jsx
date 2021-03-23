import "./App.scss";

import React from "react";

import { BrowserRouter, Switch, Route } from "react-router-dom";

import NavigationBar from "./NavigationBar";
import SDCSection from "./SDCSection";

import { Col, Row, Container } from "react-bootstrap";
import SDCSidebar from "./SDCSidebar";
import SDCSearchComponent from "./SDCSearchComponent";

class App extends React.Component {
  // Backend call
  componentDidMount() {
    fetch("/api/test/sdcform/covid19")
      .then((response) => response.json())
      .then((data) =>
        this.setState({ isLoaded: true, sdcForm: data.sdcFormObject })
      )
      .catch((error) => {
        this.setState({ errorMessage: error.toString() });
        console.log(error);
      });
  }

  // This is where we will pass the SDCForm json
  state = {
    curr_section: 0,
  };

  // This function will change the current section to be displayed
  handleSelection = (index) => {
    this.setState({ curr_section: index });
  };

  render() {
    const { curr_section, isLoaded, errorMessage } = this.state;
    // If there i
    if (errorMessage) {
      return <div>Error Occured: {errorMessage}</div>;
    }
    // If the data hasn't loaded yet display this
    if (!isLoaded) {
      return <div>Loading...</div>;
    }
    // Once data has been loaded it is okay to then gather from the sdcForm object
    const { sections, name } = this.state.sdcForm;
    return (
      <BrowserRouter>
        <Container fluid className="App">
          <NavigationBar />
          <Switch>
            <Route path="/edit-response">
              <Col>
                <Row>
                  <Col md={8}>
                    <SDCSection
                      section={sections[curr_section]}
                      name={name}
                      section_name={sections[curr_section].name}
                    />
                  </Col>
                  <Col md={4}>
                    <SDCSidebar
                      sections={sections}
                      onSelection={this.handleSelection}
                      curr_section={curr_section}
                    />
                  </Col>
                </Row>
              </Col>
            </Route>
            <Route path="/new-form">
              <SDCSearchComponent />
            </Route>
          </Switch>
        </Container>
      </BrowserRouter>
    );
  }
}

export default App;
