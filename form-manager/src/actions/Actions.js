/* hard-coded forms */
let forms = [
	{
		procedureId: "COVID19",
		lastUpdated: "2021-02-21T00:41:01.626Z"
	}
]

/* GET all forms */
export const getAllForms = (page) => {
	page.setState({forms: forms})
};

/* POST a new form */
export const uploadForm = (page, data) => {
	forms.push({
		procedureId: data.procedureId,
		lastUpdated: data.lastUpdated
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