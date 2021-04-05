import "./SDCSearchComponent.scss";

import React from "react";

import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  FormControl,
  InputGroup,
  Modal,
  Pagination,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { SERVER_URL } from "../utils/constants";
import { withRouter } from "react-router";

const apiSuccessMessage = "Success";

class SDCSearchComponent extends React.Component {
  state = {
    formData: [],
    isLoading: false,
    hasError: false,
    errorMsg: "",
    showNewFormModal: false,
    selectedForm: {},
    patientID: "",
    clinicianID: "",
    formResponse: {},
    pages: 1,
    activePage: 0,
    searchQuery: "",
    filteredData: [],
  };

  async componentDidMount() {
    this.setState({
      isLoading: true,
    });

    const response = await fetch(`${SERVER_URL}/api/sdcform?metadata=true`);

    if (response.status !== 200) {
      this.setState({
        hasError: true,
        isLoading: false,
        errorMsg: `Invalid API Response: ${response.status}`,
      });

      return;
    }

    const result = await response.json();

    const { message, sdcFormObjects } = result;

    if (message !== apiSuccessMessage) {
      this.setState({
        hasError: true,
        isLoading: false,
        errorMsg: `Invalid API Response message: ${message}`,
      });

      return;
    }

    let formItems = sdcFormObjects.filter((form) => form.diagnosticProcedureID);

    const pages = Math.floor(formItems.length / 10);

    this.setState({
      pages,
      formData: formItems,
      filteredData: formItems,
      isLoading: false,
      hasError: false,
    });
  }

  startNewResponse = async () => {
    const { selectedForm, patientID, clinicianID } = this.state;

    if (patientID.length !== 10 || clinicianID.length !== 12) {
      this.setState({
        hasError: true,
        isLoading: false,
        errorMsg: `PatientID: ${patientID} or ClinicianID: ${clinicianID} is invalid`,
        showNewFormModal: false,
      });

      return;
    }

    const response = await fetch(`${SERVER_URL}/api/sdcformresponse/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        patientID,
        clinicianID,
        sdcFormID: selectedForm.id,
      }),
    });

    if (response.status !== 201) {
      this.setState({
        hasError: true,
        errorMsg: `Invalid API Response ${response.status}`,
        isLoading: false,
        showNewFormModal: false,
      });

      return;
    }

    const responseData = await response.json();

    const { message } = responseData;

    if (message !== apiSuccessMessage) {
      this.setState({
        hasError: true,
        isLoading: false,
        errorMsg: `Invalid API Response message: ${message}`,
        showNewFormModal: false,
      });

      return;
    }

    // Make call to SDCForm
    const sdcFormDataResponse = await fetch(
      `${SERVER_URL}/api/sdcform/${responseData.responseObject.diagnosticProcedureID}`
    );

    if (response.status !== 201) {
      this.setState({
        hasError: true,
        errorMsg: `Invalid API Response ${response.status}`,
        isLoading: false,
        showNewFormModal: false,
      });

      return;
    }

    responseData["sdcFormData"] = await sdcFormDataResponse.json();

    this.props.sdcResponseHandler(responseData);

    const { history } = this.props;

    this.setState(
      {
        formResponse: responseData,
        isLoading: false,
        hasError: false,
        showNewFormModal: false,
      },
      history.push("/responses")
    );
  };

  searchFormData = () => {
    const { searchQuery, formData } = this.state;

    if (searchQuery.length === 0) {
      this.setState({
        filteredData: formData,
      });

      return;
    }

    const filteredData = formData.filter((form) => {
      if (form.name.includes(searchQuery)) return true;
      return !!form.diagnosticProcedureID.includes(searchQuery);
    });

    this.setState({
      filteredData,
    });
  };

  render() {
    const {
      hasError,
      errorMsg,
      isLoading,
      showNewFormModal,
      selectedForm,
      activePage,
      filteredData,
    } = this.state;

    return (
      <Col>
        <Row>
          <Col />
          <Col className="text-center" md={6}>
            {hasError ? <Alert variant="danger">{errorMsg}</Alert> : null}
            <h2 className="search-input">Start Filling New Form</h2>
            <InputGroup className="search-input">
              <FormControl
                onChange={(event) =>
                  this.setState({ searchQuery: event.target.value })
                }
                placeholder="Search for a procedure to get started"
              />
              <InputGroup.Append>
                <Button
                  onClick={() => this.searchFormData()}
                  variant="outline-secondary"
                >
                  Search
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
          <Col />
        </Row>
        <Row>
          <Col />
          {!isLoading ? (
            <Col md={8}>
              <p>
                Results {filteredData.length >= 10 ? 10 : filteredData.length}{" "}
                of {filteredData.length}
              </p>
              <Table>
                <thead>
                  <tr>
                    <th>Diagnostic Procedure ID</th>
                    <th>Procedure Name</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {filteredData.slice(activePage * 10).map((form, i) => (
                    <tr key={i}>
                      <td>{form.diagnosticProcedureID}</td>
                      <td>{form.name}</td>
                      <td>
                        <Button
                          onClick={() =>
                            this.setState({
                              showNewFormModal: true,
                              selectedForm: form,
                            })
                          }
                          variant="link"
                        >
                          Select
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          ) : (
            <Spinner animation="border" />
          )}
          <Col />
        </Row>
        <Row>
          <Col />
          <Col className="text-center" md={6}>
            <Pagination>
              {filteredData.map((item, i) => {
                return i % 10 === 0 ? (
                  <Pagination.Item
                    key={i}
                    active={Math.ceil(i / filteredData.length) === activePage}
                    onClick={() =>
                      this.setState({
                        activePage: Math.ceil(i / filteredData.length),
                      })
                    }
                  >
                    {Math.ceil(i / filteredData.length) + 1}
                  </Pagination.Item>
                ) : null;
              })}
            </Pagination>
          </Col>
          <Col />
        </Row>
        <Modal
          show={showNewFormModal}
          onHide={() => this.setState({ showNewFormModal: !showNewFormModal })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Start New Response</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Form.Group>
                  <Form.Label>Selected Procedure</Form.Label>
                  <p>{selectedForm.name}</p>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group>
                  <Form.Label>Enter Patient ID</Form.Label>
                  <FormControl
                    onChange={(event) =>
                      this.setState({
                        patientID: event.target.value,
                      })
                    }
                    placeholder="Required"
                  />
                </Form.Group>
              </Row>
              <Row>
                <Form.Group>
                  <Form.Label>Enter Clinician ID</Form.Label>
                  <FormControl
                    onChange={(event) =>
                      this.setState({
                        clinicianID: event.target.value,
                      })
                    }
                    placeholder="Required"
                  />
                </Form.Group>
              </Row>
              <Row>
                <Button onClick={async () => await this.startNewResponse()}>
                  Continue
                </Button>

                <Button
                  variant="link"
                  size="small"
                  onClick={() =>
                    this.setState({ showNewFormModal: !showNewFormModal })
                  }
                >
                  Cancel
                </Button>
              </Row>
            </Container>
          </Modal.Body>
        </Modal>
      </Col>
    );
  }
}

export default withRouter(SDCSearchComponent);
