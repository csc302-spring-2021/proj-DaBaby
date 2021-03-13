import React from "react";

class Forms extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			sections: this.props.location.data.sections
		}
	}

	render() {
		return (
			<p>{this.state.sections.length}</p>
		);
	}
}

export default Forms;