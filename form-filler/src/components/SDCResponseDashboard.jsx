import React from "react";
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import NavItem from "react-bootstrap/NavItem";
import NavLink from "react-bootstrap/NavLink";

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
		}
	}

	onSearch() {
		console.log(this.state)
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
		console.log(`make request to delete resp ${resp.id}`)
	}
	onUpdateResp(resp) {
		console.log(`make request to update resp ${resp.id}`)
	}

	render() {
		return (
			<div>
				<div>
					<h1>Search Previous Responses</h1>
					<div>
						<Form>
							<Form.Row>
								<Col xs="auto">
									<Form.Control placeholder="Diagnostic Procedure ID"
									              onChange={this.onInputProcedure.bind(this)}/>
								</Col>
								<Col xs="auto">
									<Form.Control placeholder="Patient ID" onChange={this.onInputPatient.bind(this)}/>
								</Col>
								<Col xs="auto">
									<Form.Control type={"date"} onChange={this.onInputStartDate.bind(this)}/>
								</Col>
								<Col xs="auto">
									<Form.Control type={"date"} onChange={this.onInputEndDate.bind(this)}/>
								</Col>
							</Form.Row>
							<Button variant="primary"
							        onClick={this.onSearch.bind(this)}>Search</Button>
						</Form>
					</div>
					<div>
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
							{hardcodedResponses.map(resp => (
								<tr>
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
			</div>
		);
	}
}

export default ResponseDashboard;