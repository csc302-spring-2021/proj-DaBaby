import axios from "axios";

const SERVER_URL = "http://dababysdcbackendapi-env-2.eba-ybqn7as3.ca-central-1.elasticbeanstalk.com";

/* GET all forms */
export const getAllForms = (page) => {
    axios
        .get(`${SERVER_URL}/api/sdcform?metadata=true`)
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
export const uploadForm = (page, data) => {
    axios
        .post(`${SERVER_URL}/api/sdcform/`, data)
        .then((res) => {
            if (res.data) {
                page.setState({newForm: null, newId: "", newName: "", updateForm: null, isUpdate: false});
                getAllForms(page);
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
export const deleteForm = (page, id) => {
    axios
        .delete(`${SERVER_URL}/api/sdcform/${id}/`)
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
export const updateForm = (page, data) => {
    axios
        .put(`${SERVER_URL}/api/sdcform/${data.id}/`, {xmlString: data.xmlString, name: data.name})
        .then((res) => {
            if (res.data) {
                page.setState({newForm: null, newId: "", newName: "", updateForm: null, isUpdate: false})
                getAllForms(page)
            } else {
                alert("UPDATE FORM FAILED");
            }
        })
        .catch((err) => {
            alert(err.response.data.message);
        });
};