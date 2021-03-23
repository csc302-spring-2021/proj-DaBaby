import React from "react";
import SDCSection from "./SDCSection";
import {Col, Container, Row} from "react-bootstrap";
import SDCSidebar from "./SDCSidebar";
import "./Form.scss";


class Form extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			curr_section: 0,
			sdcForm: this.props.location.data.sdcForm,
			sdcResponse: this.props.location.data.sdcForm,
		}
	}

	// This function will change the current section to be displayed
	handleSelection = (index) => {
		this.setState({curr_section: index});
	};

	render() {
		const {curr_section} = this.state;

		// Once data has been loaded it is okay to then gather from the sdcForm object
		const {sections, name} = this.state.sdcForm;
		return (
			<Container fluid className="App">
				<Col>
					<Row>
						<Col md={8}>
							<SDCSection
								section={sections[curr_section]}
								name={name}
								section_name={sections[curr_section].name}
								sdcForm={this.state.sdcForm}
							/>
						</Col>
						<Col md={4}>
							<SDCSidebar
								sections={sections}
								onSelection={this.handleSelection}
								curr_section={curr_section}
							/>
						</Col>
					</Row>
				</Col>
			</Container>
		);
	}
}

export default Form;