import React from "react";
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import NavItem from "react-bootstrap/NavItem";
import NavLink from "react-bootstrap/NavLink";
import "./SDCResponseDashboard.scss";

const hardcodedResponses = [
	{
		id: 2468,
		patientID: "OH27891892",
		clinicianID: "YP27923782",
		sdcFormID: 1234,
		timestamp: "2021-03-14T15:29:23.925Z",
		diagnosticProcedureID: "covid19",

	},
	{
		id: 1357,
		patientID: "OH11111111",
		clinicianID: "YP211111111",
		sdcFormID: 1234,
		timestamp: "2021-03-15T15:29:23.925Z",
		diagnosticProcedureID: "covid19",
	}
]

class ResponseDashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchProcedure: "",
			searchPatient: "",
			searchStartDate: "",
			searchEndDate: "",
			responses: hardcodedResponses,
			displayedResponses: hardcodedResponses
		}
	}

	onSearch() {
		const filter = {
			diagnosticProcedureID: this.state.searchProcedure,
			patientID: this.state.searchPatient,
			startDate: new Date(this.state.searchStartDate).toISOString(),
			endDate: new Date(this.state.searchEndDate).toISOString()
		}
		alert(`make request to get responses with ${filter.diagnosticProcedureID}, ${filter.patientID}, ${filter.startDate}, ${filter.endDate}`)
	}

	onInputProcedure(e) {
		this.setState({searchProcedure: e.target.value})
	}

	onInputPatient(e) {
		this.setState({searchPatient: e.target.value})
	}

	onInputStartDate(e) {
		this.setState({searchStartDate: e.target.value})
	}

	onInputEndDate(e) {
		this.setState({searchEndDate: e.target.value})
	}

	onDeleteResp(resp) {
		alert(`make request to delete response ${resp.id}`)
	}

	onUpdateResp(resp) {
		alert(`transfer to fill response ${resp.id}`)
	}

	render() {
		return (
			<div id="filler-panel">
				<h2>Search Previous Responses</h2>
				<div id="filler-panel-head">
					<Form>
						<Form.Row>
							<Col xs="auto">
								<label>Procedure</label>
								<Form.Control placeholder="Diagnostic Procedure ID"
								              onChange={this.onInputProcedure.bind(this)}/>
							</Col>
							<Col xs="auto">
								<label>Patient</label>
								<Form.Control placeholder="Patient ID" onChange={this.onInputPatient.bind(this)}/>
							</Col>
							<Col xs="auto">
								<label>Start Date</label>
								<Form.Control type={"date"} onChange={this.onInputStartDate.bind(this)}/>
							</Col>
							<Col xs="auto">
								<label>End Date</label>
								<Form.Control type={"date"} onChange={this.onInputEndDate.bind(this)}/>
							</Col>
						</Form.Row>
						<Button variant="primary"
						        onClick={this.onSearch.bind(this)}>Search</Button>
					</Form>
				</div>
				<div id="filler-panel-body">
					<p>{this.state.displayedResponses.length} Result(s)</p>
					<Table striped bordered={false} hover>
						<thead>
						<tr>
							<th>Procedure ID</th>
							<th>Patient ID</th>
							<th>Last Edited</th>
							<th/>
						</tr>
						</thead>
						<tbody>
						{this.state.displayedResponses.map(resp => (
							<tr key={resp.id}>
								<td>{resp.diagnosticProcedureID}</td>
								<td>{resp.patientID}</td>
								<td>{resp.timestamp}</td>
								<td>
									<Dropdown as={NavItem}>
										<Dropdown.Toggle as={NavLink}>Edit</Dropdown.Toggle>
										<Dropdown.Menu>
											<Dropdown.Item
												onClick={this.onDeleteResp.bind(this, resp)}>Delete</Dropdown.Item>
											<Dropdown.Item
												onClick={this.onUpdateResp.bind(this, resp)}>Update</Dropdown.Item>
										</Dropdown.Menu>
									</Dropdown>
								</td>
							</tr>
						))}
						</tbody>
					</Table>
				</div>
			</div>
		);
	}
}

export default ResponseDashboard;