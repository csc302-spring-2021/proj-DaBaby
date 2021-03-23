import axios from "axios";

const SERVER_URL = "http://dababysdcbackendapi-env-2.eba-ybqn7as3.ca-central-1.elasticbeanstalk.com";

/* GET SDC forms */
export const getSDCForm = async (page, id) => {
	axios
		.get(`${SERVER_URL}/api/sdcform/${id}/`)
		.then((res) => {
			if (res.data) {
				page.setState({sdcForm: res.data.sdcFormObject});
			} else {
				alert("GET SDC FORM FAILED");
			}
		})
		.catch((err) => {
			alert(err.response.data);
		});
};

/* GET all resps */
export const getAllResps = async (page, data) => {
	console.log(data)
	axios
		.get(`${SERVER_URL}/api/sdcformresponse?patientID=${data.patient}&diagnosticProcedureID=${data.procedure}&tamp=${data.start}`)
		.then((res) => {
			if (res.data) {
				page.setState({responses: res.data.sdcFormResponses});
			} else {
				alert("GET ALL RESPS FAILED");
			}
		})
		.catch((err) => {
			alert(err.response.data);
		});
};

/* DELETE resp */
export const deleteResp = async (page, id) => {
	axios
		.delete(`${SERVER_URL}/api/sdcformresponse/${id}/`)
		.then((res) => {
			if (res.data) {
				getAllResps(page, {
					patient: "",
					procedure: "",
					start: "",
					end: ""
				})
			} else {
				alert("DELETE RESP FAILED");
			}
		})
		.catch((err) => {
			alert(err.response.data);
		});
};