import React from "react";
import "./Home.scss";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form"
import {NavItem, NavLink} from "react-bootstrap";
import {Dropdown} from "react-bootstrap";
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import {getAllForms, uploadForm, deleteForm, updateForm} from "../actions/Actions";
import {Link} from "react-router-dom";

const FileSaver = require('file-saver');

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showUpload: false,
			newForm: null,
			newId: "",
			completeUpload: true,
			forms: []
		}
	}

	componentDidMount() {
		getAllForms(this);
	}

	onOpenUploadModal = (e) => {
		this.setState({showUpload: true})
	}

	onCloseUploadModal = (e) => {
		this.setState({showUpload: false, completeUpload: true, newForm: null})
	}

	onCompleteUploadModal = (e) => {
		const reader = new FileReader()
		reader.onabort = () => console.log('file reading was aborted')
		reader.onerror = () => console.log('file reading has failed')
		reader.onload = () => {
			// able to pass file content
			const binaryStr = reader.result
		}
		reader.readAsArrayBuffer(this.state.newForm.file)
		// able to download File using the File object
		FileSaver.saveAs(this.state.newForm.file);
		this.setState({showUpload: false, completeUpload: true, newForm: null})
		uploadForm(this, {
			procedureId: this.state.newId,
			lastUpdated: new Date().toISOString(),
			file: this.state.newForm.file
		})
	}

	onInputId = (e) => {
		this.setState({newId: e.target.value})
	}

	onDeleteForm = (form) => {
		deleteForm(this,form)
	}

	onUpdateForm = (form) => {
		updateForm(this,form)
	}

	render() {
		// receives array of files that are done uploading when submit button is clicked
		const onDropzoneSubmit = (files, allFiles) => {
			console.log(files.map(f => f.meta))
			this.setState({completeUpload: false})
			allFiles.forEach(f => this.setState({newForm: f}))
		}

		return (
			<div id="manager-panel">
				<div id="manager-panel-head">
					<h1>Form Manager</h1>
					<Button variant="primary" size="lg"
					        onClick={this.onOpenUploadModal}>+&nbsp;Upload&nbsp;New&nbsp;Form</Button>{' '}
				</div>
				<div id="manager-panel-body">
					<p>Displaying {this.state.forms.length} of {this.state.forms.length}</p>
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
						{this.state.forms.map(form => (
							<tr>
								<td>{form.formId}</td>
								<td>{form.formName}</td>
								<td>{form.procedureId}</td>
								<td>{form.lastUpdated}</td>
								<td>
									<Link style={{color: "#267bf7", textDecoration: "underline"}} to={"/forms"}>View</Link>
								</td>
								<td>
									<Dropdown as={NavItem}>
										<Dropdown.Toggle as={NavLink}>Edit</Dropdown.Toggle>
										<Dropdown.Menu>
											<Dropdown.Item onClick={this.onDeleteForm.bind(this, form)}>Delete</Dropdown.Item>
											<Dropdown.Item>Update</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</td>
							</tr>
						))}
						</tbody>
					</Table>
					<Modal show={this.state.showUpload} onHide={this.onCloseUploadModal}>
						<Modal.Header closeButton>
							<Modal.Title>Upload&nbsp;New&nbsp;Form</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Dropzone
								maxFiles={1}
								submitButtonContent={"Confirm"}
								inputContent={"Drop XML file here or browse"}
								onSubmit={onDropzoneSubmit}
								accept=".xml,.png"
								canRemove={this.state.completeUpload}
							/>
							<Form style={{marginTop: "5%"}}>
								<Form.Group controlId="formId">
									<Form.Label>Associated Procedure ID</Form.Label>
									<Form.Control type="id" placeholder="Required" disabled={this.state.completeUpload}
									              onChange={this.onInputId.bind(this)}/>
								</Form.Group>
							</Form>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={this.onCloseUploadModal}>
								Cancel
							</Button>
							<Button variant="primary" onClick={this.onCompleteUploadModal}
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