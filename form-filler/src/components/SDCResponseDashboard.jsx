import React from "react";
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import NavItem from "react-bootstrap/NavItem";
import NavLink from "react-bootstrap/NavLink";
import "./SDCResponseDashboard.scss";
import {Link} from "react-router-dom";

const hardcodedResponses = [
	{
		id: 2468,
		patientID: "OH27891892",
		clinicianID: "YP27923782",
		sdcFormID: 1234,
		timestamp: "2021-03-14T15:29:23.925Z",
		diagnosticProcedureID: "covid19",
		answers: [
			{
				questionID: 37326,
				answer: "CA1000"
			},
			{
				questionID: 35972,
				answer:
					{
						"selection": "Greater than 1 year old (specify years)",
						"addition": 5
					}
			},
			{
				questionID: 35978,
				answer: {"selection": "Male"}
			},
			{
				questionID: 35932,
				answer: "Canada"
			},
			{
				questionID: 35935,
				answer: "Ontario"
			},
			{
				questionID: 35943,
				answer: "22 / 10 / 2020"
			},

			{
				questionID: 35995,
				answer: {"selection": "Unknown"}

			},
			{
				questionID: 37429,
				answer: "15 / 10 / 2020"
			},
			{
				questionID: 38610,
				answer: {"selection": "Present"}
			},
			{
				questionID: 35960,
				answer: [
					{selection: "Cardiovascular disease"},
					{selection: "Diabetes"},
					{selection: "Others (specify):", "addition": "Respiratory Issues"}
				]
			},
			{
				questionID: 36015,
				answer: true
			},
			{
				questionID: 39750,
				answer: "22 / 10 / 2020"
			},
			{
				questionID: 35988,
				answer: []
			},
			{
				questionID: 35989,
				answer: []
			}
		]
	},
	{
		id: 1357,
		patientID: "OH11111111",
		clinicianID: "YP211111111",
		sdcFormID: 1234,
		timestamp: "2021-03-15T15:29:23.925Z",
		diagnosticProcedureID: "covid19",
		answers: [
			{
				questionID: 37326,
				answer: "CA1000"
			},
			{
				questionID: 35972,
				answer:
					{
						"selection": "Greater than 1 year old (specify years)",
						"addition": 5
					}
			},
			{
				questionID: 35978,
				answer: {"selection": "Male"}
			},
			{
				questionID: 35932,
				answer: "Canada"
			},
			{
				questionID: 35935,
				answer: "Ontario"
			},
			{
				questionID: 35943,
				answer: "22 / 10 / 2020"
			},

			{
				questionID: 35995,
				answer: {"selection": "Unknown"}

			},
			{
				questionID: 37429,
				answer: "15 / 10 / 2020"
			},
			{
				questionID: 38610,
				answer: {"selection": "Present"}
			},
			{
				questionID: 35960,
				answer: [
					{selection: "Cardiovascular disease"},
					{selection: "Diabetes"},
					{selection: "Others (specify):", "addition": "Respiratory Issues"}
				]
			},
			{
				questionID: 36015,
				answer: true
			},
			{
				questionID: 39750,
				answer: "22 / 10 / 2020"
			},
			{
				questionID: 35988,
				answer: []
			},
			{
				questionID: 35989,
				answer: []
			}
		]
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
			displayedResponses: hardcodedResponses,
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
										</Dropdown.Menu>
									</Dropdown>
								</td>
								<td>
									<Link style={{color: "#267bf7", textDecoration: "underline"}} to={{
										pathname: `/forms/${resp.diagnosticProcedureID}`,
										data: {
											response: resp
										}
									}}>Update</Link>
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