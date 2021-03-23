import React from "react";
import SDCSection from "./SDCSection";
import {Col, Container, Row} from "react-bootstrap";
import SDCSidebar from "./SDCSidebar";
import "./Form.scss";
import { getSDCForm } from "../actions/Actions";


class Form extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			curr_section: 0,
			procedureID: this.props.location.data.response.diagnosticProcedureID,
			sdcResponse: this.props.location.data.response,
			sdcForm: null
		}

		console.log(this.state.sdcResponse.id)
	}

	componentDidMount() {
		getSDCForm(this, this.state.procedureID)
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
								sdcForm={this.state.sdcForm}
								sdcFormResponse={this.state.sdcResponse}
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
		) : <div></div>);
	}
}

export default Form;