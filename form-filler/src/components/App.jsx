import "./App.scss";
import React from "react";

import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import NavigationBar from "./NavigationBar";
import SDCSection from "./SDCSection";

import { Col, Row, Container } from "react-bootstrap";
import SDCSidebar from "./SDCSidebar";
import SDCSearchComponent from "./SDCSearchComponent";
import { SERVER_URL } from "../utils/constants";

class App extends React.Component {
  // Backend call
  componentDidMount() {
    fetch(`${SERVER_URL}/api/test/sdcform/covid19`)
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
    newSDCResponse: {},
    sdcFormData: {},
  };

  // This function will change the current section to be displayed
  handleSelection = (index) => {
    this.setState({ curr_section: index });
  };

  sdcResponseHandler = (sdcResponse) => {
    this.setState({
      newSDCResponse: sdcResponse.responseObject,
      sdcFormData: sdcResponse.sdcFormData.sdcFormObject,
    });
  };

  render() {
    const {
      curr_section,
      isLoaded,
      errorMessage,
      newSDCResponse,
      sdcFormData,
    } = this.state;
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
            <Route exact path="/" render={() => <Redirect to="/new-form" />} />
            <Route path="/edit-response">
              <Col>
                <Row>
                  <Col md={8}>
                    <SDCSection
                      section={sections[curr_section]}
                      name={name}
                      section_name={sections[curr_section].name}
                      sdcResponse={newSDCResponse}
                      sdcForm={sdcFormData}
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
              <SDCSearchComponent
                sdcResponseHandler={this.sdcResponseHandler}
              />
            </Route>
          </Switch>
        </Container>
      </BrowserRouter>
    );
  }
}

export default App;
