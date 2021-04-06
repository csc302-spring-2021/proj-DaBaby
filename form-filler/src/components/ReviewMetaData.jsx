import React from "react";
import "./ReviewMetaData.scss";
import "./ReviewSection.scss";

class ReviewMetaData extends React.Component {
  render() {
    const { sdcResponse } = this.props;
    const {
      diagnosticProcedureID,
      patientID,
      clinicianID,
      timestamp,
      outdated,
    } = sdcResponse;
    const date = new Date(timestamp);
    const readableTime = `${date.toLocaleDateString(
      "en-CA"
    )} ${date.toLocaleTimeString("en-CA")}`;
    return (
      <div className="metadata">
        <div className="text">
          <div className="metasection">Procedure ID</div>{" "}
          <div className="metainfo">{diagnosticProcedureID}</div>
          <div className="metasection">Patient ID</div>{" "}
          <div className="metainfo">{patientID}</div>
          <div className="metasection">Clinician ID</div>{" "}
          <div className="metainfo">{clinicianID}</div>
          <div className="metasection">Status</div>
          {outdated ? (
            <div className="metainfo outdated-warning">outdated</div>
          ) : (
            <div className="metainfo">up-to-date</div>
          )}
          <div className="metasection">Timestamp</div>{" "}
          <div className="metainfo">{readableTime}</div>
        </div>
      </div>
    );
  }
}

export default ReviewMetaData;
