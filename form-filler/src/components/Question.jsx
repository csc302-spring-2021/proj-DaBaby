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
    const { question } = this.props;
    // Depending on type of question render different ways
    switch (question.question_type) {
      // Single Choice Option
      case "single-choice":
        return (
          <div>
            <FormLabel>{question.question_text}</FormLabel>
            <div className="radio">
              {/* Dynamically rendering all options the question has */}
              {question.options.map((option, index) => (
                <div key={index}>
                  <FormLabel>
                    <Field
                      name={question.question_text}
                      component="input"
                      type="radio"
                      value={option.text}
                    />{" "}
                    {option.text}
                  </FormLabel>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      // Multiple Choice Option
      case "multiple-choice":
        return (
          <div>
            <FormLabel>{question.question_text}</FormLabel>
            <div className="checkbox">
              {/* Dynamically rendering all options the question has */}
              {question.options.map((option, index) => (
                <div key={index}>
                  <FormLabel>
                    <Field
                      name={question.question_text}
                      component="input"
                      type="checkbox"
                      value={option.text}
                    />{" "}
                    {option.text}
                  </FormLabel>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      // Free text option
      case "free-text":
        return (
          <Field name={question.question_text} validate={this.required}>
            {({ input, meta }) => (
              <FormGroup controlId={this.key}>
                <FormLabel>{question.question_text}</FormLabel>
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
        return (
          <div>
            <FormLabel>{question.question_text}</FormLabel>
            <div className="integer">
              <FormLabel>
                <Field
                  name={question.question_text}
                  component="input"
                  type="number"
                  value={question.text}
                  min="0"
                />{" "}
                {question.text}
              </FormLabel>
            </div>
          </div>
        );
        break;

      // True/false option
      case "true-false":
        return (
          <div>
            <FormLabel>{question.question_text}</FormLabel>
            <div className="checkbox">
              <FormLabel>
                <Field
                  name={question.question_text}
                  component="input"
                  type="checkbox"
                  value={question.text}
                />{" "}
                {question.text}
              </FormLabel>
            </div>
          </div>
        );
        break;
    }
  }
}

export default Question;
