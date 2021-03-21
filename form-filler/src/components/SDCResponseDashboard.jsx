import React from "react";
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

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

	render() {
		return (
			<div>
				<div>
					<h1>Search Previous Responses</h1>
					<div>
						<Form>
							<Form.Row>
								<Col xs="auto">
									<Form.Control placeholder="Diagnostic Procedure ID" onChange={this.onInputProcedure.bind(this)}/>
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
				</div>
			</div>
		);
	}
}

export default ResponseDashboard;