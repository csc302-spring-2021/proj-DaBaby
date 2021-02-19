import "./SDCSectionLabel.scss";

import React from "react";
import { Row, Col, Container } from "react-bootstrap";

class SDCSectionLabel extends React.Component {
  state = {
    name: "",
    state: "",
  };

  constructor(props) {
    super(props);

    this.name = props.name;
    this.state = props.state;
  }

  render() {
    const { name, state } = this.props;

    return (
      <div className={`sdc-btn ${state} container`}>
        <span>{name}</span>
      </div>
    );
  }
}

export default SDCSectionLabel;
