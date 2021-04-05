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

import { Link } from "react-router-dom";
import { Form, Field } from "react-final-form";
import Question from "./Question";
import { Redirect } from "react-router";

const SERVER_URL =
  "http://dababysdcbackendapi-env-2.eba-ybqn7as3.ca-central-1.elasticbeanstalk.com";

class SDCSection extends React.Component {
  state = {
    redirect: false,
  };
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
        // debugger;
        // Use this to determine how long the id is for the question
        let k = 0;
        console.log(property);
        // Loop through the property to find the * (thats where the id ends and the question begins)
        while (property[22 + k] !== "*") {
          k++;
        }
        const id_length = k;
        console.log(id_length);

        const questionID = property.slice(22, 22 + id_length); // Parse the question id from the property
        const question = property.slice(22 + id_length + 1); // Parse the question from the property

        // Find existingQuestionAnswerObject from the questionAnswerList so we can include the addition field
        const existingQuestionAnswerObject = questionAnswerList.find((obj) => {
          return obj.questionID === questionID;
        });

        if (existingQuestionAnswerObject) {
          // If the question we are adding the addition to is an array (meaning multiple-choice question), do this
          if (Array.isArray(existingQuestionAnswerObject["answer"])) {
            // Find existingAnswerObject from existing answer list so we can include the addition field
            // to the specific answer in that list
            const existingAnswerObject = existingQuestionAnswerObject[
              "answer"
            ].find((obj) => {
              return obj.selection === question;
            });
            if (existingAnswerObject) {
              existingAnswerObject["addition"] = values[property]; // Add the addition field to that answer
            }
          }
          // Otherwise do this (single-choice question)
          else {
            existingQuestionAnswerObject["answer"]["addition"] =
              values[property]; // Add the addition field to that answer
          }
        }
      }
    }
    // Start building the answer response object to send to the backend
    const answerResponseObject = {};

    // Get useful form properties from prop
    const sdcFormResponse = this.props.sdcFormResponse;
    answerResponseObject["id"] = sdcFormResponse["id"];
    answerResponseObject["answers"] = questionAnswerList;
    answerResponseObject["patientID"] = sdcFormResponse["patientID"];
    answerResponseObject["clinicianID"] = sdcFormResponse["clinicianID"];
    answerResponseObject["sdcFormID"] = sdcFormResponse["sdcFormID"];

    console.log(answerResponseObject);

    // Make backend call to call PUT on url
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answerResponseObject),
    };
    await fetch(
      `${SERVER_URL}/api/sdcformresponse/${sdcFormResponse["id"]}/`,
      requestOptions
    )
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

  /**
   * Parse sdcFormResponse object to match the format of the Form, to give it its initial values
   * @returns response object to give initial values to Form
   */
  sdcFormResponseParser = () => {
    const { sdcFormResponse } = this.props; // get sdcFormResponse object from props
    const initialValues = {};
    //Loop through answers and add it to the initialValues object
    for (let i = 0; i < sdcFormResponse["answers"].length; i++) {
      let name = "filler" + sdcFormResponse["answers"][i]["questionID"];

      let value = sdcFormResponse["answers"][i]["answer"];
      // If the type of the value (answer) is a string or boolean or integer, then we can directly add it in
      if (
        typeof value === "string" ||
        typeof value === "boolean" ||
        Number.isInteger(value)
      ) {
        initialValues[name] = value;
      }
      // If it is none of these, then answer must be a list of selections or just a selection (multiple-choice or single-choice)
      else {
        // If value is an array (multiple-choice), handle it this way
        if (Array.isArray(value)) {
          // Loop through list and insert the values
          let first = true;
          for (let j = 0; j < value.length; j++) {
            let additionName =
              "optionalFieldInputType" +
              sdcFormResponse["answers"][i]["questionID"] +
              "*" +
              value[j]["selection"];
            initialValues[additionName] = value[j]["addition"];
            // If first value being added, create the list
            if (first) {
              initialValues[name] = [value[j]["selection"]];
              first = false;
            }
            // Otherwise, push to the list
            else {
              initialValues[name].push(value[j]["selection"]);
            }
          }
        }
        // Otherwise (single-choice), handle it this way
        else if (value) {
          let additionName =
            "optionalFieldInputType" +
            sdcFormResponse["answers"][i]["questionID"] +
            "*" +
            value["selection"];
          initialValues[name] = value["selection"];
          initialValues[additionName] = value["addition"];
        }
      }
    }
    console.log(initialValues);
    return initialValues; // Return the parsed object
  };

  goBack = async () => {
    await this.onSubmit();
    this.setState({ redirect: true });
  };

  render() {
    if (this.state.redirect) {
      return <Redirect push to={"/"}></Redirect>;
    }
    const { section, name, section_name } = this.props;
    const { questions } = section;
    return (
      <Container className="sdc-form">
        <Row>
          <Col>
            <h1 className="formTitle">{name}</h1>
            <h2 className="sectionTitle">{section_name}</h2>

            <Form
              onSubmit={this.onSubmit}
              initialValues={this.sdcFormResponseParser()}
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
                  <div>
                    <div className="float-child">
                      <button
                        className="sdcButton"
                        type="submit"
                        onClick={handleSubmit}
                        disabled={submitting}
                      >
                        Save
                      </button>
                    </div>
                    <div className="float-child">
                      <button
                        className="sdcButton"
                        type="submit"
                        onClick={this.goBack}
                        disabled={submitting}
                      >
                        Save and Exit
                      </button>
                    </div>
                  </div>
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
