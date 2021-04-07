import React from "react";
import SDCSection from "./SDCSection";
import { Col, Container, Row } from "react-bootstrap";
import SDCSidebar from "./SDCSidebar";
import "./Form.scss";
import { getSDCForm, getSDCFormResponse } from "../actions/Actions";
import ReviewSection from "./ReviewSection.jsx";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curr_section: 0,
      sdcResponse: null,
      sdcForm: null,
    };
  }

  componentDidMount() {
    if (this.props.location) {
      getSDCForm(
        this,
        this.props.location.state.response.diagnosticProcedureID
      );
      getSDCFormResponse(this, this.props.location.state.response.id);
    }
  }

  // This function will change the current section to be displayed
  handleSelection = (index) => {
    this.setState({ curr_section: index });
  };

  render() {
    const { curr_section } = this.state;
    return this.state.sdcForm && this.state.sdcResponse ? (
      <Container fluid className="App">
        <Col>
          <Row>
            <Col md={8}>
              {curr_section === this.state.sdcForm.sections.length ? (
                <ReviewSection
                  sdcResponse={this.state.sdcResponse}
                  sdcForm={this.state.sdcForm}
                  submit={true}
                />
              ) : (
                <SDCSection
                  section={this.state.sdcForm.sections[curr_section]}
                  name={this.state.sdcForm.name}
                  section_name={this.state.sdcForm.sections[curr_section].name}
                  sdcForm={this.state.sdcForm}
                  sdcFormResponse={this.state.sdcResponse}
                  setState={(state) => this.setState(state)}
                />
              )}
            </Col>
            <Col md={4}>
              <SDCSidebar
                sections={this.state.sdcForm.sections}
                onSelection={this.handleSelection}
                curr_section={curr_section}
                reviewIndex={this.state.sdcForm.sections.length}
              />
            </Col>
          </Row>
        </Col>
      </Container>
    ) : null;
  }
}

export default Form;
