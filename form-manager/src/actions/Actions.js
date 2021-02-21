/* hard-coded form id */
let id = 2;
/* hard-coded forms */
let forms = [
	{
		formId: 1,
		formName: "COVID19 V1",
		procedureId: "COVID19",
		lastUpdated: "2021-02-21T00:41:01.626Z",
		file: null
	}
]

/* GET all forms */
export const getAllForms = (page) => {
	page.setState({forms: forms})
};

/* POST a new form */
export const uploadForm = (page, data) => {
	forms.push({
		formId: id++,
		formName: data.formName,
		procedureId: data.procedureId,
		lastUpdated: data.lastUpdated,
		file: data.file
	})
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