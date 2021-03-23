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
    }

    componentDidMount() {
        if (this.props.location) {
            getSDCForm(this, this.state.id)
        }
    }

    render() {
        console.log(this.state.form);

        if (this.state.form) {
        	if (!this.state.form.sections || this.state.form.sections.length === 0){
        		return <div className={"Form-Container"}>
					<h2 id="form-name-display">{this.state.form.name}</h2>
					<h4 id="form-empty-error">The form is empty or may be corrupted!</h4>
				</div>;
			}

            return <div className={"Form-Container"}>
                <h2 id="form-name-display">{this.state.form.name}</h2>
                {this.state.form.sections.map((section) => (
                    <SDCSection section={section} key={section.id}/>
                ))}
            </div>;
        }

        return null;
    }
}

export default Forms;