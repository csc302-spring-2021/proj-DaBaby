import React from "react";
import SDCSection from "./SDCSection";
import {Col, Container, Row} from "react-bootstrap";
import SDCSidebar from "./SDCSidebar";
import "./Form.scss";
import {getSDCForm} from "../actions/Actions";


class Form extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			curr_section: 0,
			procedureID: this.props.location.state.response.diagnosticProcedureID,
			sdcResponse: this.props.location.state.response,
			sdcForm: null
		}
	}

	componentDidMount() {
		if (this.props.location) {
			getSDCForm(this, this.state.procedureID)
		}
	}

	// This function will change the current section to be displayed
	handleSelection = (index) => {
		this.setState({curr_section: index});
	};

	render() {
		const {curr_section} = this.state;
		return (this.state.sdcForm ? (
			<Container fluid className="App">
				<Col>
					<Row>
						<Col md={8}>
							<SDCSection
								section={this.state.sdcForm.sections[curr_section]}
								name={this.state.sdcForm.name}
								section_name={this.state.sdcForm.sections[curr_section].name}
								sdcForm={{
									"id": 1234,
									"name": "WORLD HEALTH ORGANIZATION (WHO) COVID-19 CASE REPORT",
									"sections": [
										{
											"id": 35866,
											"name": "Section 1: Patient Information", 
											"questions": [
												{
													"id": 37326,
													"type": "free-text",
													"controllerID": null,
													"controllerAnswerEnabler": null,
													"questionText": "Unique Case Identifier (used in country)"
												},
												{
													"id": 35972,
													"type": "single-choice",
													"controllerID": null,
													"controllerAnswerEnabler": null,
								
													"questionText": "Age",
													"choices": [
														{
															"text": "Greater than 1 year old (specify years)",
															"optionalFieldInputType": "int"
														},
														{
															"text": "Less than 1 year old (specify months)",
															"optionalFieldInputType": "int"
														},
														{
															"text": "Less than 1 month old (specify days)",
															"optionalFieldInputType": "int"
														}
													]
								
												},
												{
													"id": 35978,
													"type": "single-choice",
													"controllerID": null,
													"controllerAnswerEnabler": null,
								
													"text": "Sex at Birth",
													"choices": [
														{ "text": "Male" },
														{ "text": "Female" },
														{ "text": "Other (please specify):", "optionalFieldInputType": "string" }
													]
								
												},
												{
													"id": 35932,
													"type": "free-text",
													"controllerID": null,
													"controllerAnswerEnabler": null,
								
													"text": "Place Where the Case Was Diagnosed (Country)"
												},
												{
													"id": 35935,
													"type": "free-text",
													"controllerID": 35932,
													"controllerAnswerEnabler": "*",
								
													"text": "Admin Level 1 (Province)"
												}
											]
								
										},
										{
											"id": 35835,
											"name": "Section 2: Clinical Status",
											"questions": [
												{
													"id": 35943,
													"type": "free-text",
													"controllerID": null,
													"controllerAnswerEnabler": null,
								
													"text": "Date of First Laboratory Confirmation Test (DD / MM / YYYY)"
												},
								
												{
													"id": 35995,
													"type": "single-choice",
													"controllerID": null,
													"controllerAnswerEnabler": null,
								
													"text": "Symptoms or Signs at Time of Specimen Collection that Resulted in First Laboratory Confirmation",
													"choices": [
														{ "text": "None (i.e. asymptotic" },
														{ "text": "Present" },
														{ "text": "Unknown" }
													]
								
												},
												{
													"id": 37429,
													"type": "free-text",
													"controllerID": 35995,
													"controllerAnswerEnabler": "Present",
								
													"text": "Specify Date of Onset of Symptoms (DD / MM / YYYY)"
												},
												{
													"id": 38610,
													"type": "single-choice",
													"controllerID": null,
													"controllerAnswerEnabler": null,
								
													"text": "Underlying Conditions and Comorbidity",
													"choices": [
														{ "text": "None" },
														{ "text": "Present" },
														{ "text": "Unknown" }
													]
												},
												{
													"id": 35960,
													"type": "multiple-choice",
													"controllerID": 38610,
													"controllerAnswerEnabler": "Present",
								
													"text": "Underlying Conditions (select all that apply)",
													"choices": [
														{ "text": "Pregnancy" },
														{ "text": "Cardiovascular disease" },
														{ "text": "Liver disease" },
														{ "text": "Diabetes" }, 
														{ "text": "Renal disease" },
														{ "text": "Immunodeficiency, including HIV" },
														{ "text": "Chronic lung disease" },
														{ "text": "Others (specify): ", "optionalFieldInputType": "string" }
													]
												},
												{
													"id": 36015,
													"type": "true-false",
													"controllerID": null,
													"controllerAnswerEnabler": null,
								
													"text": "Admission to Hospital"
												},
												{
													"id": 39750,
													"type": "free-text",
													"controllerID": 36015,
													"controllerAnswerEnabler": true,
								
													"text": "Specify Date of First Admission (DD / MM / YYYY)"
												}
								
											]
										}
									]
								
								}}
								sdcFormResponse={{
									"id": 2468,
									"patientID": "OH27891892",
									"clinicianID": "YP27923782",
									"sdcFormID": 1234,
									"diagnosticProcedureID": "covid19",
									"timestamp": "2021-03-14T15:29:23.925Z",
									"answers": [
										{
											"questionID": 37326,
											"answer": "CA1000"
										},
										{
											"questionID": 35972,
											"answer": 
												{
													"selection": "Greater than 1 year old (specify years)",
													"addition": 5
												}
										},
										{
											"questionID": 35978,
											"answer": { "selection": "Male" }
										},
										{
											"questionID": 35932,
											"answer": "Canada"
										},
										{
											"questionID": 35935,
											"answer": "Ontario"
										},
										{
											"questionID": 35943,
											"answer": "22 / 10 / 2020"
										},
								
										{
											"questionID": 35995,
											"answer": { "selection": "Unknown" }
								
										},
										{
											"questionID": 37429,
											"answer": "15 / 10 / 2020"
										},
										{
											"questionID": 38610,
											"answer": { "selection" : "Present" }
										},
										{
											"questionID": 35960,
											"answer": [
												{ "selection": "Cardiovascular disease" },
												{ "selection": "Diabetes" },
												{ "selection": "Others (specify):", "addition": "Respiratory Issues" }
											]
										},
										{
											"questionID": 36015,
											"answer": true
										},
										{
											"questionID": 39750,
											"answer": "22 / 10 / 2020"
										},
										{
											"questionID": 35988,
											"answer": []
										},
										{
											"questionID": 35989,
											"answer": []
										}
									]
								
								}}
							/>
						</Col>
						<Col md={4}>
							<SDCSidebar
								sections={this.state.sdcForm.sections}
								onSelection={this.handleSelection}
								curr_section={curr_section}
							/>
						</Col>
					</Row>
				</Col>
			</Container>
		) : <div>
			<h1>SDCForm is invalid</h1>
		</div>);
	}
}

export default Form;