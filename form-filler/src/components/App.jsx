import "./App.scss";

import React from "react";

import NavigationBar from "./NavigationBar";
import SDCSection from "./SDCSection";

import { Col, Row, Container } from "react-bootstrap";
import SDCSidebar from "./SDCSidebar";

class App extends React.Component {
  // Backend call
  async componentDidMount() {
    const response = await fetch("/api/test/sdcform/covid19");

    const responseData = await response.json();

    this.setState({ isLoaded: true, sdcForm: responseData.sdcFormObject });
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
    const { curr_section, isLoaded } = this.state;
    if (!isLoaded) {
      return <div>Loading...</div>;
    }
    const { sections, name } = this.state.sdcForm;
    return (
      <Container fluid className="App">
        <NavigationBar />
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
      </Container>
    );
  }
}

export default App;
