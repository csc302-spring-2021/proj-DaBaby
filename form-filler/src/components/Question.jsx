import React, { Component } from "react";
import { Field } from "react-final-form";
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
import "./SDCSection.scss";

class Question extends Component {
  required = (value) => {
    return value ? undefined : "Required";
  };
  render() {
    // Depending on type of question render different ways
    switch (this.props.question_type) {
      // Single Choice Option
      case "single-choice":
        return <h1>single-choice</h1>;
        break;

      // Multiple Choice Option
      case "multiple-choice":
        return (
          <div>
            <FormLabel>Sauces</FormLabel>
            <div class="checkbox">
              <div>
                <FormLabel>
                  <Field
                    name="sauces"
                    component="input"
                    type="checkbox"
                    value="ketchup"
                  />{" "}
                  Ketchup
                </FormLabel>
              </div>
              <div>
                <FormLabel>
                  <Field
                    name="sauces"
                    component="input"
                    type="checkbox"
                    value="weed"
                  />{" "}
                  Weed
                </FormLabel>
              </div>
              <div>
                <FormLabel>
                  <Field
                    name="sauces"
                    component="input"
                    type="checkbox"
                    value="weed"
                  />{" "}
                  Weed
                </FormLabel>
              </div>
              <div>
                <FormLabel>
                  <Field
                    name="sauces"
                    component="input"
                    type="checkbox"
                    value="weed"
                  />{" "}
                  Weed
                </FormLabel>
              </div>
            </div>
          </div>
        );
        break;

      // Free text option
      case "free-text":
        return (
          <Field name={this.props.question_text} validate={this.required}>
            {({ input, meta }) => (
              <FormGroup controlId={this.key}>
                <FormLabel>{this.props.question_text}</FormLabel>
                <FormControl
                  {...input}
                  type="text"
                  placeholder="Enter answer here"
                  isInvalid={meta.error && meta.touched}
                />
                <FormText data-testid="caseIdValidation">
                  {meta.error && meta.touched && <span>{meta.error}</span>}
                </FormText>
              </FormGroup>
            )}
          </Field>
        );
        break;

      // Integer Option
      case "integer":
        return <h1>integer</h1>;
        break;

      // True/false option
      case "true/false":
        return <h1>true/false</h1>;
        break;
    }
  }
}

export default Question;
