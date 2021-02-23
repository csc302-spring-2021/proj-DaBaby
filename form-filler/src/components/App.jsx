import "./App.scss";

import React from "react";

import NavigationBar from "./NavigationBar";
import SDCSection from "./SDCSection";

import { Col, Row, Container } from "react-bootstrap";
import SDCSidebar from "./SDCSidebar";

class App extends React.Component {
  // This is where we will pass the SDCForm json
  state = {
    curr_section: 0,
    form_id: 1234,
    procedure_id: "COVID-19.393_1.000.000.CTP1_sdcFDF",
    name: "WORLD HEALTH ORGANIZATION (WHO) COVID-19 CASE REPORT",
    sections: [
      {
        section_id: 35866,
        title: "Section 1: Patient Information",
        questions: [
          {
            question_id: 37326,
            question_type: "free-text",
            order: 42,
            controller_id: null,
            controller_answer: null,
            question_text: "Unique Case Identifier (used in country)",
          },
          {
            question_id: 35972,
            question_type: "single-choice",
            order: 47,
            controller_id: null,
            controller_answer: null,

            question_text: "Age",
            options: [
              {
                text: "Greater than 1 year old (specify years)",
                input_type: "int",
              },
              {
                text: "Less than 1 year old (specify months)",
                input_type: "int",
              },
              {
                text: "Less than 1 month old (specify days)",
                input_type: "int",
              },
            ],
          },
          {
            question_id: 35978,
            question_type: "single-choice",
            order: 72,
            controller_id: null,
            controller_answer: null,

            question_text: "Sex at Birth",
            options: [
              { text: "Male" },
              { text: "Female" },
              { text: "Other (please specify):", input_type: "string" },
            ],
          },
          {
            question_id: 35932,
            question_type: "free-text",
            order: 76,
            controller_id: null,
            controller_answer: null,

            question_text: "Place Where the Case Was Diagnosed (Country)",
          },
          {
            question_id: 35935,
            question_type: "free-text",
            order: 81,
            controller_id: 35932,
            controller_answer: "*",

            question_text: "Admin Level 1 (Province)",
          },
        ],
      },
      {
        section_id: 35835,
        title: "Section 2: Clinical Status",
        questions: [
          {
            question_id: 35943,
            question_type: "free-text",
            order: 90,
            controller_id: null,
            controller_answer: null,

            question_text:
              "Date of First Laboratory Confirmation Test (DD / MM / YYYY)",
          },

          {
            question_id: 35995,
            question_type: "single-choice",
            order: 96,
            controller_id: null,
            controller_answer: null,

            question_text:
              "Symptoms or Signs at Time of Specimen Collection that Resulted in First Laboratory Confirmation",
            options: [
              { text: "None (i.e. asymptotic" },
              { text: "Present" },
              { text: "Unknown" },
            ],
          },
          {
            question_id: 37429,
            question_type: "free-text",
            order: 102,
            controller_id: 35995,
            controller_answer: "Present",

            question_text: "Specify Date of Onset of Symptoms (DD / MM / YYYY)",
          },
          {
            question_id: 38610,
            question_type: "single-choice",
            order: 102,
            controller_id: null,
            controller_answer: null,

            question_text: "Underlying Conditions and Comorbidity",
            options: [
              { text: "None" },
              { text: "Present" },
              { text: "Unknown" },
            ],
          },
          {
            question_id: 35960,
            question_type: "multiple-choice",
            order: 115,
            controller_id: 38610,
            controller_answer: "Present",

            question_text: "Underlying Conditions (select all that apply)",
            options: [
              { text: "Pregnancy" },
              { text: "Cardiovascular disease" },
              { text: "Liver disease" },
              { text: "Diabetes" },
              { text: "Renal disease" },
              { text: "Immunodeficiency, including HIV" },
              { text: "Chronic lung disease" },
              { text: "Others (specify): ", input_type: "string" },
            ],
          },
          {
            question_id: 36015,
            question_type: "true-false",
            order: 144,
            controller_id: null,
            controller_answer: null,

            question_text: "Admission to Hospital",
          },
          {
            question_id: 39750,
            question_type: "free-text",
            order: 150,
            controller_id: 36015,
            controller_answer: true,

            question_text: "Specify Date of First Admission (DD / MM / YYYY)",
          },
        ],
      },
    ],
  };

  // This function will change the current section to be displayed
  handleSelection = (index) => {
    this.setState({ curr_section: index });
  };

  render() {
    const { sections, curr_section, name } = this.state;
    return (
      <Container fluid className="App">
        <NavigationBar />
        <Col>
          <Row>
            <Col md={8}>
              <SDCSection section={sections[curr_section]} name={name} section_name={sections[curr_section].title}/>
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
