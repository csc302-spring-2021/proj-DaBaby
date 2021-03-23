import React from "react";
import hardcodedForm from "./sdcform.json";
import SDCSection from "./SDCSection";
import "./Forms.scss";

class Forms extends React.Component {
	constructor(props) {
		super(props);
		// we can get the actual form from Home using Link
		// but for now I am using hardcoded JSON to render questions before XML parsing algo is finished
		this.state = {
			realForm: this.props.location.data,
			form: hardcodedForm
		}
	}

	render() {
		return (
			<div className={"Form-Container"}>
				<h2 id="form-name-display">{this.state.form.name}</h2>
				{this.state.form.sections.map((section) => (
					<SDCSection section={section}/>
				))}
			</div>
		);
	}
}

export default Forms;