import "./SDCSidebar.scss";

import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";

class SDCSidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  // This button function will handle which section will be rendered
  handleSection = (index) => {
    this.props.onSelection(index);
  };

  render() {
    const { sections, curr_section, sdcFormResponse } = this.props;

    const sectionToQuestionIds = sections.map((section) => {
      let questionIdToCompletion = {};
      section.questions.forEach((question) => {
        questionIdToCompletion[question.id] = false;
      });
      return questionIdToCompletion;
    });

    sdcFormResponse.answers.forEach((answer) => {
      if (
        !(
          answer.answer === "" ||
          answer.answer === null ||
          (Array.isArray(answer.answer) && answer.answer.length === 0)
        )
      ) {
        sectionToQuestionIds.forEach((section) => {
          if (section[answer.questionID] === false) {
            section[answer.questionID] = true;
          }
        });
      }
    });

    const sectionToFullCompletion = sectionToQuestionIds.map((section) => {
      for (const key in section) {
        if (!section.hasOwnProperty(key)) {
          return false;
        }
        if (section[key] === false) {
          return false;
        }
      }
      return true;
    });

    return (
      <Container fluid>
        <Row>
          <Col sm={12} className="section-navigation">
            {sections.map((section, index) => (
              <Button
                className={`sdc-btn ${
                  curr_section === index ? "active" : ""
                } sdc-container`}
                variant="outline-dark"
                key={section.id}
                onClick={() => this.handleSection(index)}
              >
                {section.name}
                {sectionToFullCompletion[index] ? null : (
                  <div id="completion-label">incomplete</div>
                )}
              </Button>
            ))}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SDCSidebar;
