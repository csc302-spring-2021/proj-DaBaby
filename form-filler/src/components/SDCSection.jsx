import "./SDCSection.scss";

import React from "react";

import {
  Container,
  Row,
  Col,
  Button,
  FormGroup,
  FormLabel,
  FormControl,
  FormText,
} from "react-bootstrap";

import { Form, Field } from "react-final-form";
import Question from "./Question";

const SERVER_URL =
  "http://dababysdcbackendapi-env-2.eba-ybqn7as3.ca-central-1.elasticbeanstalk.com";

class SDCSection extends React.Component {
  // Prepare the values into a JSON that'll be sent to the backend
  onSubmit = async (values) => {
    // This list will hold a list of questionAnswerObjects
    const questionAnswerList = [];

    // Loop through the values object that is essentially the questionAnswer to each question and each question id
    // Then prepare them and add them to the questionAnswerObject
    for (const property in values) {
      // Creating response object that'll be sent to the backend
      const questionAnswerObject = {};

      let single_or_multiple_choice_question = false;

      // If the property is filler, then it is not an addition
      if (property.slice(0, 6) == "filler") {
        const questionID = property.slice(6); // Parse the question id from the property
        // Get the object with matching questionID
        const { section, name, section_name } = this.props;
        const questions = [];
        const { sdcForm } = this.props;

        // Loop through all sections and add question to list of questions
        for (let i = 0; i < sdcForm["sections"].length; i++) {
          for (let j = 0; j < sdcForm["sections"][i]["questions"].length; j++)
            questions.push(sdcForm["sections"][i]["questions"][j]);
        }

        // Loop through questions from section to match up with the value from the form, and see if that question is
        // single-choice or multiple-choice, if so then they need a section field in their questionAnswerObject
        for (let i = 0; i < questions.length; i++) {
          if (
            questions[i]["id"] == questionID &&
            questions[i]["type"] == "single-choice"
          ) {
            questionAnswerObject["questionID"] = questionID;
            questionAnswerObject["answer"] = { selection: values[property] };
            single_or_multiple_choice_question = "single-choice";
          }
          if (
            questions[i]["id"] == questionID &&
            questions[i]["type"] == "multiple-choice"
          ) {
            questionAnswerObject["questionID"] = questionID;
            single_or_multiple_choice_question = "multiple-choice";
          }
        }

        if (!single_or_multiple_choice_question) {
          questionAnswerObject["questionID"] = property.slice(6);
          questionAnswerObject["answer"] = values[property];
          questionAnswerList.push(questionAnswerObject); // Add free-text/integer/true-false questionID and answer to the list
        } else if (single_or_multiple_choice_question == "single-choice") {
          questionAnswerObject["questionID"] = property.slice(6);
          questionAnswerObject["answer"]["selection"] = values[property];
          questionAnswerList.push(questionAnswerObject); // Add single-choice questionID and answer to the list
        } else if (single_or_multiple_choice_question == "multiple-choice") {
          // Loop through array of values gotten form values[property]
          let first = true;
          for (let i = 0; i < values[property].length; i++) {
            // If first value added to questionAnswerObject, create a new array for the answer field
            if (first) {
              questionAnswerObject["questionID"] = property.slice(6);
              questionAnswerObject["answer"] = [
                { selection: values[property][i] },
              ];
              questionAnswerList.push(questionAnswerObject); // Add multiple-choice questionID and answer to the list
              first = false;
            }
            // Otherwise push it to list of answers
            else {
              questionAnswerObject["answer"].push({
                selection: values[property][i],
              });
            }
          }
        }
      }

      // Otherwise it is an addition
      else {
        // If the addition is a single choice question handle it this way
        const questionID = property.slice(22, 27); // Parse the question id from the property
        const question = property.slice(27); // Parse the question from the property

        // Find existingQuestionAnswerObject from the questionAnswerList so we can include the addition field
        const existingQuestionAnswerObject = questionAnswerList.find((obj) => {
          return obj.questionID === questionID;
        });

        // If the question we are adding the addition to is an array (meaning multiple-choice question), do this
        if (Array.isArray(existingQuestionAnswerObject["answer"])) {
          // Find existingAnswerObject from existing answer list so we can include the addition field
          // to the specific answer in that list
          const existingAnswerObject = existingQuestionAnswerObject[
            "answer"
          ].find((obj) => {
            return obj.selection === question;
          });
          existingAnswerObject["addition"] = values[property]; // Add the addition field to that answer
        }
        // Otherwise do this (single-choice question)
        else {
          existingQuestionAnswerObject["answer"]["addition"] = values[property]; // Add the addition field to that answer
        }
      }
    }
    // Start building the answer response object to send to the backend
    const answerResponseObject = {};

    // Get useful form properties from prop
    const { id, sdcFormID, clinicianID, patientID } = this.props.sdcResponse;
    answerResponseObject["id"] = id;
    answerResponseObject["answers"] = questionAnswerList;
    answerResponseObject["patientID"] = patientID;
    answerResponseObject["clinicianID"] = clinicianID;
    answerResponseObject["sdcFormID"] = sdcFormID;

    // Make backend call to call PUT on url
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answerResponseObject),
    };
    fetch(`${SERVER_URL}/api/test/sdcformresponse/${id}`, requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => {
        console.log(error);
      });
  };

  /**
   * Validates field client side as required
   */
  required = (value) => {
    return value ? undefined : "Required";
  };

  render() {
    const { section, name, section_name } = this.props;
    const { questions } = section;
    return (
      <Container className="sdc-form">
        <Row>
          <Col>
            <h1 className="formTitle">{name}</h1>
            <h2 className="sectionTitle">{section_name}</h2>
            <hr className="divider"></hr>
            <Form
              onSubmit={this.onSubmit}
              render={({
                handleSubmit,
                form,
                submitting,
                pristine,
                values,
              }) => (
                <form onSubmit={handleSubmit}>
                  {/* Where the questions will be rendered */}
                  {questions.map((question) => (
                    <Question question={question} key={question.id} />
                  ))}
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    Continue
                  </Button>
                </form>
              )}
            ></Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SDCSection;
