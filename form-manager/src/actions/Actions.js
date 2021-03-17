import axios from "axios";
/* hard-coded forms */
let forms = [

]

/* GET all forms */
export const getAllForms = async (page) => {
	axios
		.get(`/api/sdcform?metadata=true`)
		.then((res) => {
			if (res.data) {
				forms = res.data.sdcFormObjects.filter(form => form.diagnosticProcedureID)
				page.setState({ forms: forms, displayedForms: forms, filter: "" });
			} else {
				alert("GET ALL FORMS FAILED");
			}
		})
		.catch((err) => {
			alert(err);
		});
};

/* POST a new form */
export const uploadForm = async (page, data) => {
	axios
		.post(`/api/sdcform/`, data )
		.then((res) => {
			if (res.data) {
				getAllForms(page)
			} else {
				alert("UPLOAD FORM FAILED");
			}
		})
		.catch((err) => {
			alert(err);
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
			alert(err);
		});
};

/* PUT a form */
export const updateForm = (page, data) => {
	const index = forms.indexOf(data.updateForm);
	if (index > -1) {
		forms[index].formName = data.formName
		forms[index].lastUpdated = data.lastUpdated
		forms[index].file = data.file
	}
	getAllForms(page)
};