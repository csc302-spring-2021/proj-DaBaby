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

class SDCSection extends React.Component {
  onSubmit = async (values) => {
    console.log(JSON.stringify(values));
  };

  /**
   * Validates field client side as required
   */
  required = (value) => {
    return value ? undefined : "Required";
  };

  render() {
    return (
      <Container className="sdc-form">
        <Row>
          <Col>
            <Form
              onSubmit={this.onSubmit}
              render={({
                handleSubmit,
                form,
                submitting,
                pristine,
                values,
              }) => (
                <>
                  <Field name="uniqueCaseId" validate={this.required}>
                    {({ input, meta }) => (
                      <FormGroup controlId="uniqueCaseId">
                        <FormLabel>Unique Case Identifier</FormLabel>
                        <FormControl
                          {...input}
                          type="text"
                          placeholder="H123FA456"
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
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    Submit
                  </Button>
                </>
              )}
            ></Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default SDCSection;
