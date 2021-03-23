import React from "react";
import SDCSection from "./SDCSection";
import "./Forms.scss";
import {getSDCForm} from "../actions/Actions";

class Forms extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			form: null,
			id: this.props.location.state.id,
		}

		console.log(this.state.id)
	}

	componentDidMount() {
		if (this.props.location) {
			getSDCForm(this, this.state.id)
		}
	}

	render() {
		return (
			(this.state.form ? (<div className={"Form-Container"}>
				<h2 id="form-name-display">{this.state.form.name}</h2>
				{this.state.form.sections.map((section) => (
					<SDCSection section={section} key={section.id}/>
				))}
			</div>) : (<div>
				<h1>SDCForm is invalid</h1>
			</div>))
		);
	}
}

export default Forms;