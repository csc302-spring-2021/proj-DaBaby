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
import "./Question.scss";

const Condition = ({ when, is, children }) => (
  <Field name={when} subscription={{ value: true }}>
    {({ input: { value } }) => (String(value).match(is) ? children : null)}
  </Field>
);

class Question extends Component {
  required = (value) => {
    return value ? undefined : "Required";
  };
  render() {
    const { question } = this.props;
    // If the question controller answer is *, change it to a regular expression that accepts
    // at least one or more alphanumeric character
    if (question.controller_answer == "*")
      question.controller_answer = "[0-9A-Za-z]+";

    if (question.controller_answer == true) question.controller_answer = "true";

    // Depending on type of question render different ways
    switch (question.question_type) {
      // Single Choice Option
      case "single-choice":
        if (question.controller_id) {
          return (
            <Condition
              when={"filler" + question.controller_id}
              is={new RegExp(question.controller_answer)}
            >
              <div>
                <FormLabel className="title">
                  {question.question_text}
                </FormLabel>
                <div className="radio">
                  {/* Dynamically rendering all options the question has */}
                  {question.options.map((option, index) => (
                    <div key={index}>
                      <FormLabel>
                        <Field
                          name={"filler" + question.question_id}
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
            </Condition>
          );
        } else {
          return (
            <div>
              <FormLabel className="title">{question.question_text}</FormLabel>
              <div className="radio">
                {/* Dynamically rendering all options the question has */}
                {question.options.map((option, index) => (
                  <div key={index}>
                    <FormLabel>
                      <Field
                        name={"filler" + question.question_id}
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
        }
        break;

      // Multiple Choice Option
      case "multiple-choice":
        if (question.controller_id) {
          return (
            <Condition
              when={"filler" + question.controller_id}
              is={new RegExp(question.controller_answer)}
            >
              <div>
                <FormLabel className="title">
                  {question.question_text}
                </FormLabel>
                <div className="checkbox">
                  {/* Dynamically rendering all options the question has */}
                  {question.options.map((option, index) => (
                    <div key={index}>
                      <FormLabel>
                        <Field
                          name={"filler" + question.question_id}
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
            </Condition>
          );
        } else {
          return (
            <div>
              <FormLabel className="title">{question.question_text}</FormLabel>
              <div className="checkbox">
                {/* Dynamically rendering all options the question has */}
                {question.options.map((option, index) => (
                  <div key={index}>
                    <FormLabel>
                      <Field
                        name={"filler" + question.question_id}
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
        }
        break;

      // Free text option
      case "free-text":
        // If question has a controller id, render it depending on whether controller has right answer
        if (question.controller_id) {
          return (
            <Condition
              when={"filler" + question.controller_id}
              is={new RegExp(question.controller_answer)}
            >
              <Field
                name={"filler" + question.question_id}
                validate={this.required}
              >
                {({ input, meta }) => (
                  <FormGroup controlId={this.key}>
                    <FormLabel className="title">
                      {question.question_text}
                    </FormLabel>
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
            </Condition>
          );
        } else {
          return (
            <Field
              name={"filler" + question.question_id}
              validate={this.required}
            >
              {({ input, meta }) => (
                <FormGroup controlId={this.key}>
                  <FormLabel className="title">
                    {question.question_text}
                  </FormLabel>
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
        }
        break;

      // Integer Option
      case "integer":
        if (question.controller_id) {
          return (
            <Condition
              when={"filler" + question.controller_id}
              is={new RegExp(question.controller_answer)}
            >
              <div>
                <FormLabel className="title">
                  {question.question_text}
                </FormLabel>
                <div className="integer">
                  <FormLabel>
                    <Field
                      name={"filler" + question.question_id}
                      component="input"
                      type="number"
                      value={question.text}
                      min="0"
                    />{" "}
                    {question.text}
                  </FormLabel>
                </div>
              </div>
            </Condition>
          );
        } else {
          return (
            <div>
              <FormLabel className="title">{question.question_text}</FormLabel>
              <div className="integer">
                <FormLabel>
                  <Field
                    name={"filler" + question.question_id}
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
        }
        break;

      // True/false option
      case "true-false":
        if (question.controller_id) {
          return (
            <Condition
              when={"filler" + question.controller_id}
              is={new RegExp(question.controller_answer)}
            >
              <div>
                <FormLabel className="title">
                  {question.question_text}
                </FormLabel>
                <div className="checkbox">
                  <FormLabel>
                    <Field
                      name={"filler" + question.question_id}
                      component="input"
                      type="checkbox"
                      value={question.question_text}
                    />{" "}
                    {question.question_text}
                  </FormLabel>
                </div>
              </div>
            </Condition>
          );
        } else {
          return (
            <div>
              <FormLabel className="title">{question.question_text}</FormLabel>
              <div className="checkbox">
                <FormLabel>
                  <Field
                    name={"filler" + question.question_id}
                    component="input"
                    type="checkbox"
                  />{" "}
                  {question.question_text}
                </FormLabel>
              </div>
            </div>
          );
        }
        break;
    }
  }
}

export default Question;
