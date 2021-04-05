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

// Check when value (what the user inputs on the form), matches with is (the controllerAnswerEnabler), 
// if they do match, render the dependent question from the sdcForm
const Condition = ({ when, is, children }) => (
  <Field name={when} subscription={{ value: true }}>
    {/* Use value.match(is) because controlleranswer could be * meaning it could be anything so we will use a regex to express this */}
    {({ input: { value } }) => (String(value).match(is[0]) || value === is[1] || (Array.isArray(value) ? value.includes(is[1]) : false) ? children : null)}
  </Field>
);

const ConditionSpecify = ({ when, is, children }) => (
  <Field name={when} subscription={{ value: true }}>
    {/* Use value.includes because multiple choice value is an array and we need to see if the value includes it */}
    {({ input: { value } }) => (value.includes(is) ? children : null)} 
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
    if (question.controllerAnswerEnabler == "*")
      question.controllerAnswerEnabler = "[0-9A-Za-z]+";

    if (question.controllerAnswerEnabler == true)
      question.controllerAnswerEnabler = "true";

    // Depending on type of question render different ways
    switch (question.type) {
      // Single Choice Option ------------------------------------------------------------------------------------------------------------------------------------------
      case "single-choice":
        if (question.controllerID) {
          return (
            // Is is a list cuz we need to check if the answerenabler is a * which means anything goes in or if its a list which comes from
            // Multiple choice values, so we need to handle regex option or the list option for the controlleranswerenabler
            <Condition
              when={"filler" + question.controllerID}
              is={[new RegExp(question.controllerAnswerEnabler), question.controllerAnswerEnabler]}
            >
              <div>
                <FormLabel className="title">{question.questionText}</FormLabel>
                <div className="radio">
                  {/* Dynamically rendering all choices the question has */}
                  {question.choices.map((option, index) => (
                    <div key={index}>
                      <FormLabel>
                        <Field
                          name={"filler" + question.id}
                          component="input"
                          type="radio"
                          value={option.text}
                        />{" "}
                        {option.text}
                        {/* If the choice has an optionalfieldinputtype, render it below  */}
                        {option.optionalFieldInputType ? (
                          <ConditionSpecify
                            when={"filler" + question.id}
                            is={option.text}
                          >
                            <Field
                              validate={this.required}
                              name={"optionalFieldInputType" + question.id + "*" + option.text}
                              type="text"
                              component="input"
                              placeholder="Specify"
                            >
                              {({ input, meta }) => (
                                <FormGroup controlId={this.key}>
                                  <FormControl
                                    {...input}
                                    type="text"
                                    placeholder="Specify"
                                    isInvalid={meta.error && meta.touched}
                                  />
                                  <FormText data-testid="caseIdValidation">
                                    {meta.error && meta.touched && (
                                      <span>{meta.error}</span>
                                    )}
                                  </FormText>
                                </FormGroup>
                              )}
                            </Field>
                          </ConditionSpecify>
                        ) : (
                          ""
                        )}
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
              <FormLabel className="title">{question.questionText}</FormLabel>
              <div className="radio">
                {/* Dynamically rendering all choices the question has */}
                {question.choices.map((option, index) => (
                  <div key={index}>
                    <FormLabel>
                      <Field
                        name={"filler" + question.id}
                        component="input"
                        type="radio"
                        value={option.text}
                      />{" "}
                      {option.text}
                      {/* If the choice has an optionalfieldinputtype, render it below  */}
                      {option.optionalFieldInputType ? (
                        <ConditionSpecify
                          when={"filler" + question.id}
                          is={option.text}
                        >
                          <Field
                            validate={this.required}
                            name={"optionalFieldInputType" + question.id + "*" + option.text}
                            type="text"
                            component="input"
                            placeholder="Specify"
                          >
                            {({ input, meta }) => (
                              <FormGroup controlId={this.key}>
                                <FormControl
                                  {...input}
                                  type="text"
                                  placeholder="Specify"
                                  isInvalid={meta.error && meta.touched}
                                />
                                <FormText data-testid="caseIdValidation">
                                  {meta.error && meta.touched && (
                                    <span>{meta.error}</span>
                                  )}
                                </FormText>
                              </FormGroup>
                            )}
                          </Field>
                        </ConditionSpecify>
                      ) : (
                        ""
                      )}
                    </FormLabel>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        break;

      // Multiple Choice Option ------------------------------------------------------------------------------------------------------------------------------------------
      case "multiple-choice":
        if (question.controllerID) {
          return (
            <Condition
              when={"filler" + question.controllerID}
              is={[new RegExp(question.controllerAnswerEnabler), question.controllerAnswerEnabler]}
            >
              <div>
                <FormLabel className="title">{question.questionText}</FormLabel>
                <div className="checkbox">
                  {/* Dynamically rendering all choices the question has */}
                  {question.choices.map((option, index) => (
                    <div key={index}>
                      <FormLabel>
                        <Field
                          name={"filler" + question.id}
                          component="input"
                          type="checkbox"
                          value={option.text}
                        />{" "}
                        {option.text}
                        {/* If the choice has an optionalfieldinputtype, render it below  */}
                        {option.optionalFieldInputType ? (
                          <ConditionSpecify
                            when={"filler" + question.id}
                            is={option.text}
                          >
                            <Field
                              validate={this.required}
                              name={"optionalFieldInputType" + question.id + "*" + option.text}
                              type="text"
                              component="input"
                              placeholder="Specify"
                            >
                              {({ input, meta }) => (
                                <FormGroup controlId={this.key}>
                                  <FormControl
                                    {...input}
                                    type="text"
                                    placeholder="Specify"
                                    isInvalid={meta.error && meta.touched}
                                  />
                                  <FormText data-testid="caseIdValidation">
                                    {meta.error && meta.touched && (
                                      <span>{meta.error}</span>
                                    )}
                                  </FormText>
                                </FormGroup>
                              )}
                            </Field>
                          </ConditionSpecify>
                        ) : (
                          ""
                        )}
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
              <FormLabel className="title">{question.questionText}</FormLabel>
              <div className="checkbox">
                {/* Dynamically rendering all choices the question has */}
                {question.choices.map((option, index) => (
                  <div key={index}>
                    <FormLabel>
                      <Field
                        name={"filler" + question.id}
                        component="input"
                        type="checkbox"
                        value={option.text}
                      />{" "}
                      {option.text}
                      {/* If the choice has an optionalfieldinputtype, render it below  */}
                      {option.optionalFieldInputType ? (
                        <ConditionSpecify
                          when={"filler" + question.id}
                          is={option.text}
                        >
                          <Field
                            validate={this.required}
                            name={"optionalFieldInputType" + question.id + "*" + option.text}
                            type="text"
                            component="input"
                            placeholder="Specify"
                          >
                            {({ input, meta }) => (
                              <FormGroup controlId={this.key}>
                                <FormControl
                                  {...input}
                                  type="text"
                                  placeholder="Specify"
                                  isInvalid={meta.error && meta.touched}
                                />
                                <FormText data-testid="caseIdValidation">
                                  {meta.error && meta.touched && (
                                    <span>{meta.error}</span>
                                  )}
                                </FormText>
                              </FormGroup>
                            )}
                          </Field>
                        </ConditionSpecify>
                      ) : (
                        ""
                      )}
                    </FormLabel>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        break;

      // Free text option ------------------------------------------------------------------------------------------------------------------------------------------
      case "free-text":
        // If question has a controller id, render it depending on whether controller has right answer
        if (question.controllerID) {
          return (
            <Condition
              when={"filler" + question.controllerID}
              is={[new RegExp(question.controllerAnswerEnabler), question.controllerAnswerEnabler]}
            >
              <Field name={"filler" + question.id} validate={this.required}>
                {({ input, meta }) => (
                  <FormGroup controlId={this.key}>
                    <FormLabel className="title">
                      {question.questionText}
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
            <Field name={"filler" + question.id} validate={this.required}>
              {({ input, meta }) => (
                <FormGroup controlId={this.key}>
                  <FormLabel className="title">
                    {question.questionText}
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

      // Integer Option ------------------------------------------------------------------------------------------------------------------------------------------
      case "integer":
        if (question.controllerID) {
          return (
            <Condition
              when={"filler" + question.controllerID}
              is={[new RegExp(question.controllerAnswerEnabler), question.controllerAnswerEnabler]}
            >
              <div>
                <FormLabel className="title">{question.questionText}</FormLabel>
                <div className="integer">
                  <FormLabel>
                    <Field
                      name={"filler" + question.id}
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
              <FormLabel className="title">{question.questionText}</FormLabel>
              <div className="integer">
                <FormLabel>
                  <Field
                    name={"filler" + question.id}
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

      // True/false option ------------------------------------------------------------------------------------------------------------------------------------------
      case "true-false":
        if (question.controllerID) {
          return (
            <Condition
              when={"filler" + question.controllerID}
              is={[new RegExp(question.controllerAnswerEnabler), question.controllerAnswerEnabler]}
            >
              <div>
                <FormLabel className="title">{question.questionText}</FormLabel>
                <div className="checkbox">
                  <FormLabel>
                    <Field
                      name={"filler" + question.id}
                      component="input"
                      type="checkbox"
                      value={question.questionText}
                    />{" "}
                    {question.questionText}
                  </FormLabel>
                </div>
              </div>
            </Condition>
          );
        } else {
          return (
            <div>
              <FormLabel className="title">{question.questionText}</FormLabel>
              <div className="checkbox">
                <FormLabel>
                  <Field
                    name={"filler" + question.id}
                    component="input"
                    type="checkbox"
                  />{" "}
                  {question.questionText}
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
