import "./SDCSectionLabel.scss";

import React from "react";

class SDCSectionLabel extends React.Component {
  state = {
    name: "",
    state: "",
  };

  constructor(props) {
    super(props);

    this.name = props.name;
    this.state = null;
  }

  render() {
    const { name, state } = this.props;

    return (
      <div className={`sdc-btn ${state} sdc-container`}>
        <span>{name}</span>
      </div>
    );
  }
}

export default SDCSectionLabel;
