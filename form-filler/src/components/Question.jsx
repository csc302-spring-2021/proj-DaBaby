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

class Question extends Component {
  required = (value) => {
    return value ? undefined : "Required";
  };
  render() {
    // Depending
    switch (this.props.question_type) {
      case "single-choice":
        return <h1>single-choice</h1>;
        break;
      case "multiple-choice":
        return <h1>multiple-choice</h1>;
        break;

      case "free-text":
        return (
          <Field name="uniqueCaseId" validate={this.required}>
            {({ input, meta }) => (
              <FormGroup controlId="uniqueCaseId">
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

      case "integer":
        return <h1>integer</h1>;
        break;
      case "true/false":
        return <h1>true/false</h1>;
        break;
    }
  }
}

export default Question;
