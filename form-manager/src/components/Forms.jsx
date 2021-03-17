import React from "react";
import hardcodedForm from "./sdcform.json";
import SDCSection from "./SDCSection";
import "./Forms.scss";

class Forms extends React.Component {
	constructor(props) {
		super(props);
		// we can get the actual form from Home using Link
		// but for now I am using hardcoded JSON to render questions
		this.state = {
			realForm: this.props.location.data,
			form: hardcodedForm
		}
	}

	render() {
		return (
			<div className={"Form-Container"}>
				<h2 style={{textAlign: "center", marginTop: "5%", marginBottom: "5%"}}>{this.state.form.name}</h2>
				{this.state.form.sections.map((section) => (
					<SDCSection section={section}/>
				))}
			</div>
		);
	}
}

export default Forms;