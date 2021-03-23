import "./SDCSearchComponent.scss";

import React from "react";

import {
  Alert,
  Container,
  Button,
  Col,
  Table,
  Row,
  InputGroup,
  FormControl,
  Modal,
  Form,
  Spinner,
  Pagination,
} from "react-bootstrap";

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
  };

  async componentDidMount() {
    this.setState({
      isLoading: true,
    });

    const response = await fetch(`/api/sdcform?metadata=true`);

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

    const pages = Math.floor(sdcFormObjects.length / 10);

    this.setState({
      pages,
      formData: sdcFormObjects,
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

    console.log(this.state);

    const response = await fetch(`/api/sdcformresponse/`, {
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

    console.log(responseData);

    this.setState({
      formResponse: responseData,
      isLoading: false,
      hasError: false,
      showNewFormModal: false,
    });
  };

  render() {
    const {
      hasError,
      errorMsg,
      isLoading,
      formData,
      showNewFormModal,
      selectedForm,
      activePage,
    } = this.state;

    console.log(activePage);

    return (
      <Col>
        <Row>
          <Col></Col>
          <Col className="text-center" md={6}>
            {hasError ? <Alert variant="danger">{errorMsg}</Alert> : null}
            <h2 className="search-input">Start Filling New Form</h2>
            <InputGroup className="search-input">
              <FormControl placeholder="Search for a proceedure to get started" />
              <InputGroup.Append>
                <Button variant="outline-secondary">Search</Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <Col></Col>
          {!isLoading ? (
            <Col md={8}>
              <p>
                Results {formData.length >= 10 ? 10 : formData.length} of{" "}
                {formData.length}
              </p>
              <Table>
                <thead>
                  <tr>
                    <th>Diagnostic Proceedure ID</th>
                    <th>Proceedure Name</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.slice(activePage * 10).map((form, i) => (
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
            <Spinner />
          )}
          <Col></Col>
        </Row>
        <Row>
          <Col></Col>
          <Col className="text-center" md={6}>
            <Pagination>
              {formData.map((item, i) => {
                return i % 10 === 0 ? (
                  <Pagination.Item
                    active={Math.ceil(i / formData.length) === activePage}
                    onClick={() =>
                      this.setState({
                        activePage: Math.ceil(i / formData.length),
                      })
                    }
                  >
                    {Math.ceil(i / formData.length) + 1}
                  </Pagination.Item>
                ) : null;
              })}
            </Pagination>
          </Col>
          <Col></Col>
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
                  <Form.Label>Selected Proceedure</Form.Label>
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
                or
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

export default SDCSearchComponent;
