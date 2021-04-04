import React from "react";
import SDCSection from "./SDCSection";
import { Col, Container, Row, Button } from "react-bootstrap";
import SDCSidebar from "./SDCSidebar";
import "./Form.scss";
import { getSDCForm } from "../actions/Actions";
import { Link } from "react-router-dom";
import ReviewSection from "./ReviewSection";
import ReviewMetaData from "./ReviewMetaData";
import "./Review.scss";

class Review extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curr_section: 0,
      procedureID: this.props.location.state.response.diagnosticProcedureID,
      sdcResponse: this.props.location.state.response,
      sdcForm: null,
    };
  }

  componentDidMount() {
    if (this.props.location) {
      getSDCForm(this, this.state.procedureID);
    }
  }

  render() {
    console.log(this.state);
    return this.state.sdcForm ? (
      <Container fluid className="App">
        <Col>
          <Row>
            <Col md={8}>
              <ReviewSection
                sdcResponse={this.state.sdcResponse}
                sdcForm={this.state.sdcForm}
              />
            </Col>
            <Col md={4}>
              <ReviewMetaData sdcResponse={this.state.sdcResponse} />
              <div className="actions">Actions</div>
              <div className="padding">
                <button className="buttons">RETURN TO SEARCH</button>
              </div>
              <div className="padding">
                <button className="buttons">EDIT RESPONSE</button>
              </div>
              <div className="padding">
                <button className="buttons">DELETE RESPONSE</button>
              </div>
            </Col>
          </Row>
        </Col>
      </Container>
    ) : (
      <div>
        <h1>SDCForm is invalid</h1>
      </div>
    );
  }
}

export default Review;
