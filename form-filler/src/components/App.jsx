import "./App.scss";
import React from "react";

import NavigationBar from "./NavigationBar";
import SDCSection from "./SDCSection";

import { Col, Row, Container } from "react-bootstrap";
import SDCSidebar from "./SDCSidebar";

const SERVER_URL = "http://dababysdcbackendapi-env-2.eba-ybqn7as3.ca-central-1.elasticbeanstalk.com";

class App extends React.Component {
  // Backend call
  componentDidMount() {
    fetch(`${SERVER_URL}/api/test/sdcform/covid19`)
      .then((response) => response.json())
      .then((data) =>
        this.setState({ isLoaded: true, sdcForm: data.sdcFormObject, sdcFormResponse:  {
          "id": 2468,
          "patientID": "OH27891892",
          "clinicianID": "YP27923782",
          "sdcFormID": 1234,
          "diagnosticProcedureID": "covid19",
          "timestamp": "2021-03-14T15:29:23.925Z",
          "answers": [
              {
                  "questionID": 37326,
                  "answer": "CA1000"
              },
              {
                  "questionID": 35972,
                  "answer": 
                      {
                          "selection": "Greater than 1 year old (specify years)",
                          "addition": 5
                      }
              },
              {
                  "questionID": 35978,
                  "answer": { "selection": "Male" }
              },
              {
                  "questionID": 35932,
                  "answer": "Canada"
              },
              {
                  "questionID": 35935,
                  "answer": "Ontario"
              },
              {
                  "questionID": 35943,
                  "answer": "22 / 10 / 2020"
              },
      
              {
                  "questionID": 35995,
                  "answer": { "selection": "Unknown" }
      
              },
              {
                  "questionID": 37429,
                  "answer": "15 / 10 / 2020"
              },
              {
                  "questionID": 38610,
                  "answer": { "selection" : "Present" }
              },
              {
                  "questionID": 35960,
                  "answer": [
                      { "selection": "Cardiovascular disease" },
                      { "selection": "Diabetes" },
                      { "selection": "Others (specify): ", "addition": "Respiratory Issues" }
                  ]
              },
              {
                  "questionID": 36015,
                  "answer": true
              },
              {
                  "questionID": 39750,
                  "answer": "22 / 10 / 2020"
              },
              {
                  "questionID": 35988,
                  "answer": []
              },
              {
                  "questionID": 35989,
                  "answer": []
              }
          ]
      
      }})
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
      return <div>Error Occured: {errorMessage}</div>
    }
    // If the data hasn't loaded yet display this
    if (!isLoaded) {
      return <div>Loading...</div>;
    }
    // Once data has been loaded it is okay to then gather from the sdcForm object
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
                sdcForm={this.state.sdcForm}
                sdcFormResponse={this.state.sdcFormResponse}
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
