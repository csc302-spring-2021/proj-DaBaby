import React from "react";
import "./Home.scss";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form"
import {Dropdown, NavItem, NavLink} from "react-bootstrap";
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import {deleteForm, getAllForms, updateForm, uploadForm} from "../actions/Actions";
import {Link} from "react-router-dom";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showUpload: false,
            isUpdate: false,
            newForm: null,
            updateForm: null,
            newId: "",
            newName: "",
            completeUpload: true,
            forms: [],
            displayedForms: [],
            filter: ""
        }
    }

    componentDidMount() {
        getAllForms(this);
    }

    onOpenUploadModal(form, e) {
        this.setState({showUpload: true})
        if (form && e) {
            this.setState({updateForm: form, isUpdate: true})
        }
    }

    onCloseUploadModal() {
        this.setState({
            showUpload: false,
            completeUpload: true,
            isUpdate: false,
            newForm: null,
            newId: "",
            newName: "",
            updateForm: null
        })
    }

    onCompleteUploadModal() {
        const reader = new FileReader()
        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {
            // able to pass file content
            let binaryStr = reader.result
            binaryStr = binaryStr.replace(/"/g, "'").replace(/(\r\n|\n|\r)/gm, "")
            this.setState({showUpload: false, completeUpload: true})
            if (this.state.isUpdate) {
                updateForm(this, {
                    id: this.state.updateForm.diagnosticProcedureID,
                    name: this.state.newName,
                    xmlString: binaryStr
                })
            } else {
                uploadForm(this, {
                    diagnosticProcedureID: this.state.newId,
                    name: this.state.newName,
                    xmlString: binaryStr
                })
            }
        }
        reader.readAsBinaryString(this.state.newForm.file)
    }

    onInputId(e) {
        this.setState({newId: e.target.value})
    }

    onInputName(e) {
        this.setState({newName: e.target.value})
    }

    onInputFilter(e) {
        const filter = e.target.value;
        this.setState({
                filter: filter, displayedForms: this.state.forms.filter(
                form => form.id.toString().toUpperCase().indexOf(filter.toUpperCase()) > -1 ||
                    form.name.toUpperCase().indexOf(filter.toUpperCase()) > -1 ||
                    form.diagnosticProcedureID.toUpperCase().indexOf(filter.toUpperCase()) > -1
                )
            }
        );
    }

    onDeleteForm(form) {
        deleteForm(this, form.diagnosticProcedureID)
    }


    render() {
        // receives array of files that are done uploading when submit button is clicked
        const onDropzoneSubmit = (files, allFiles) => {
            this.setState({completeUpload: false, newForm: allFiles[0]});
        };

        return (
            <div id="manager-panel">
                <div id="manager-panel-head">
                    <h1>Form Manager</h1>
                    <Button variant="primary" size="lg"
                            onClick={this.onOpenUploadModal.bind(this)}>+&nbsp;Upload&nbsp;New&nbsp;Form</Button>{' '}
                </div>
                <div id="manager-panel-body">
                    <div id="manager-panel-body-head">
                        <p>Displaying {this.state.displayedForms.length} of {this.state.forms.length}</p>
                        <Form id="manager-panel-body-filter">
                            <Form.Group controlId="formId">
                                <Form.Control value={this.state.filter} type="name" placeholder="Filter..."
                                              onChange={this.onInputFilter.bind(this)}/>
                            </Form.Group>
                        </Form>
                    </div>
                    <Table striped bordered={false} hover>
                        <thead>
                        <tr>
                            <th>Form&nbsp;ID</th>
                            <th>Form Name</th>
                            <th>Procedure&nbsp;ID</th>
                            <th>Last Updated</th>
                            <th/>
                            <th/>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.displayedForms.map(form => {
                            const date = new Date(form.timestamp);
                            const readableTime = `${date.toLocaleDateString("en-CA")} ${date.toLocaleTimeString("en-CA")}`;
                            return (
                                <tr key={form.id}>
                                    <td>{form.id}</td>
                                    <td>{form.name}</td>
                                    <td>{form.diagnosticProcedureID}</td>
                                    <td>{readableTime}</td>
                                    <td>
                                        <Link id="view-form-button" to={{
                                            pathname: `/forms/${form.diagnosticProcedureID}`,
                                            state: {
                                                id: form.diagnosticProcedureID
                                            }
                                        }}>View</Link>
                                    </td>
                                    <td>
                                        <Dropdown as={NavItem}>
                                            <Dropdown.Toggle as={NavLink}>Edit</Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item
                                                    onClick={this.onDeleteForm.bind(this, form)}>Delete</Dropdown.Item>
                                                <Dropdown.Item
                                                    onClick={this.onOpenUploadModal.bind(this, form)}>Update</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </Table>
                    <Modal show={this.state.showUpload} onHide={this.onCloseUploadModal.bind(this)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Upload&nbsp;SDC&nbsp;Form</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Dropzone
                                maxFiles={1}
                                submitButtonContent={"Confirm"}
                                inputContent={"Drop XML file here or browse"}
                                onSubmit={onDropzoneSubmit}
                                accept=".xml"
                                canRemove={this.state.completeUpload}
                            />
                            <Form id="upload-info-form">
                                <Form.Group controlId="formId">
                                    <Form.Label>Form Name</Form.Label>
                                    <Form.Control type="name" placeholder="Required"
                                                  disabled={this.state.completeUpload}
                                                  onChange={this.onInputName.bind(this)}/>
                                    <Form.Label>Associated Procedure ID</Form.Label>
                                    {(!this.state.isUpdate ? (
                                        <Form.Control type="id" placeholder="Required"
                                                      disabled={this.state.completeUpload}
                                                      onChange={this.onInputId.bind(this)}/>
                                    ) : (
                                        <Form.Control type="id"
                                                      placeholder={this.state.updateForm.diagnosticProcedureID}
                                                      value={this.state.updateForm.diagnosticProcedureID}
                                                      disabled={true}
                                                      onChange={this.onInputId.bind(this)}/>
                                    ))}
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.onCloseUploadModal.bind(this)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={this.onCompleteUploadModal.bind(this)}
                                    disabled={this.state.completeUpload}>
                                Upload
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default Home;