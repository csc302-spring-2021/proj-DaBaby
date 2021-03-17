import axios from "axios";

/* GET all forms */
export const getAllForms = async (page) => {
	axios
		.get(`/api/sdcform?metadata=true`)
		.then((res) => {
			if (res.data) {
				let forms = res.data.sdcFormObjects.filter(form => form.diagnosticProcedureID)
				page.setState({forms: forms, displayedForms: forms, filter: ""});
			} else {
				alert("GET ALL FORMS FAILED");
			}
		})
		.catch((err) => {
			alert(err.response.data);
		});
};

/* POST a new form */
export const uploadForm = async (page, data) => {
	axios
		.post(`/api/sdcform/`, data)
		.then((res) => {
			if (res.data) {
				getAllForms(page)
			} else {
				alert("UPLOAD FORM FAILED");
			}
		})
		.catch((err) => {
			console.log(err.response.data)
			alert(err.response.data.message);
		});
};

/* DELETE a form */
export const deleteForm = async (page, id) => {
	axios
		.delete(`/api/sdcform/${id}/`)
		.then((res) => {
			if (res.data) {
				getAllForms(page)
			} else {
				alert("DELETE FORM FAILED");
			}
		})
		.catch((err) => {
			alert(err.response.data.message);
		});
};

/* PUT a form */
export const updateForm = async (page, data) => {
	axios
		.put(`/api/sdcform/${data.id}/`, {xmlString: data.xmlString})
		.then((res) => {
			if (res.data) {
				getAllForms(page)
			} else {
				alert("UPDATE FORM FAILED");
			}
		})
		.catch((err) => {
			alert(err.response.data.message);
		});
};