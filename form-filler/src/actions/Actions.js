import axios from "axios";

const SERVER_URL = "http://dababysdcbackendapi-env-2.eba-ybqn7as3.ca-central-1.elasticbeanstalk.com";

/* GET all forms */
export const getSDCForm = async (page, id) => {
	console.log(id)
	axios
		.get(`${SERVER_URL}/api/test/sdcform/covid19`)
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