import React from "react";
import "./ReviewMetaData.scss";
import "./ReviewSection.scss";

class ReviewMetaData extends React.Component {
  render() {
      const {sdcResponse} = this.props
      const {diagnosticProcedureID, patientID, clinicianID, timestamp} = sdcResponse;
    return (
      <div className="metadata">
        <div className="text">
          <div className="metasection">Procedure ID</div>{" "}
          <div className="metainfo">{diagnosticProcedureID}</div>
          <div className="metasection">Patient ID</div>{" "}
          <div className="metainfo">{patientID}</div>
          <div className="metasection">Clinician ID</div>{" "}
          <div className="metainfo">{clinicianID}</div>
          <div className="metasection">Timestamp</div>{" "}
          <div className="metainfo">{timestamp}</div>
        </div>
      </div>
    );
  }
}

export default ReviewMetaData;
