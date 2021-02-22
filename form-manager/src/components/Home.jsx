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

	onOpenUploadModal = (form, e) => {
		this.setState({showUpload: true})
		if (form && e) {
			this.setState({updateForm: form, isUpdate: true})
		}
	}

	onCloseUploadModal = (e) => {
		this.setState({showUpload: false, completeUpload: true, isUpdate: false, newForm: null, newId: "", newName: "", updateForm: null})
	}

	onCompleteUploadModal = (e) => {
		const reader = new FileReader()
		reader.onabort = () => console.log('file reading was aborted')
		reader.onerror = () => console.log('file reading has failed')
		reader.onload = () => {
			// able to pass file content
			const binaryStr = reader.result
			console.log(binaryStr)
		}
		reader.readAsBinaryString(this.state.newForm.file)
		// able to download File using the File object
		FileSaver.saveAs(this.state.newForm.file);
		this.setState({showUpload: false, completeUpload: true})
		if (this.state.isUpdate) {
			updateForm(this, {
				updateForm: this.state.updateForm,
				lastUpdated: new Date().toISOString(),
				formName: this.state.newName,
				file: this.state.newForm.file
			})
		} else {
			uploadForm(this, {
				procedureId: this.state.newId,
				lastUpdated: new Date().toISOString(),
				formName: this.state.newName,
				file: this.state.newForm.file
			})
		}
		this.setState({newForm: null, newId: "", newName: "", updateForm: null, isUpdate: false})
	}

	onInputId = (e) => {
		this.setState({newId: e.target.value})
	}

	onInputName = (e) => {
		this.setState({newName: e.target.value})
	}

	onInputFilter= (e) => {
		this.setState({filter: e.target.value}, () => {
			this.setState({displayedForms: this.state.forms.filter(
					form => form.formId.toString().toUpperCase().indexOf(this.state.filter.toUpperCase()) > -1 ||
						form.formName.toUpperCase().indexOf(this.state.filter.toUpperCase()) > -1 ||
						form.procedureId.toUpperCase().indexOf(this.state.filter.toUpperCase()) > -1
				)})
		})
	}

	onDeleteForm = (form) => {
		deleteForm(this,form)
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
					        onClick={this.onOpenUploadModal.bind(this)}>+&nbsp;Upload&nbsp;New&nbsp;Form</Button>{' '}
				</div>
				<div id="manager-panel-body">
					<div id="manager-panel-body-head">
						<p>Displaying {this.state.displayedForms.length} of {this.state.forms.length}</p>
						<Form style={{marginLeft: "auto"}}>
							<Form.Group controlId="formId">
								<Form.Control value={this.state.filter} type="name" placeholder="Filter..." onChange={this.onInputFilter.bind(this)}/>
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
						{this.state.displayedForms.map(form => (
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
											<Dropdown.Item onClick={this.onOpenUploadModal.bind(this, form)}>Update</Dropdown.Item>
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
									<Form.Label>Form Name</Form.Label>
									<Form.Control type="name" placeholder="Required" disabled={this.state.completeUpload}
									              onChange={this.onInputName.bind(this)}/>
									<Form.Label>Associated Procedure ID</Form.Label>
									{(!this.state.isUpdate ? (
										<Form.Control type="id" placeholder="Required" disabled={this.state.completeUpload}
										onChange={this.onInputId.bind(this)}/>
										) : (
										<Form.Control type="id" placeholder={this.state.updateForm.procedureId} value={this.state.updateForm.procedureId} disabled={true}
										onChange={this.onInputId.bind(this)}/>
										))}
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