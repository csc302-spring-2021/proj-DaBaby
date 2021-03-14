import axios from "axios";
/* hard-coded forms */
let forms = [

]

/* GET all forms */
export const getAllForms = (page) => {
	page.setState({ forms: forms, displayedForms: forms, filter: "" });
};

/* POST a new form */
export const uploadForm = async (page, data) => {
	axios
		.post(`/api/sdcform/`, data )
		.then((res) => {
			console.log(res.data)
			if (res.data) {
				forms.push({
					formId: res.data.sdcFormObject.id,
					formName: res.data.sdcFormObject.name,
					procedureId: res.data.sdcFormObject.diagnosticProcedureID,
					lastUpdated: data.lastUpdated,
					sdcFormObject: res.data.sdcFormObject
				})
				getAllForms(page)
			} else {
				alert("NO ITEMS DATA");
			}
		})
		.catch((err) => {
			alert(err.response.data.message);
		});
	getAllForms(page)
};

/* DELETE a form */
export const deleteForm = (page, data) => {
	const index = forms.indexOf(data);
	if (index > -1) {
		forms.splice(index, 1);
	}
	getAllForms(page)
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