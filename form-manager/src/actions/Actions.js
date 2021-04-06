import axios from "axios";

const SERVER_URL =
  "http://dababysdcbackendapi-env-2.eba-ybqn7as3.ca-central-1.elasticbeanstalk.com";

/* GET all forms */
export const getAllForms = (page) => {
  axios
    .get(`${SERVER_URL}/api/sdcform?metadata=true`)
    .then((res) => {
      if (res.data) {
        let forms = res.data.sdcFormObjects.filter(
          (form) => form.diagnosticProcedureID
        );
        page.setState({ forms: forms, displayedForms: forms, filter: "" });
      } else {
        alert("Failed to get all the SDCForms!");
      }
    })
    .catch((err) => {
      alert(err.response ? err.response.data : "Unknown Server Error!");
    });
};

/* POST a new form */
export const uploadForm = (page, data) => {
  axios
    .post(`${SERVER_URL}/api/sdcform/`, data)
    .then((res) => {
      if (res.data) {
        page.setState({
          newForm: null,
          newId: "",
          newName: "",
          updateForm: null,
          isUpdate: false,
        });
        getAllForms(page);
      } else {
        alert("Failed to upload SDCForm!");
      }
    })
    .catch((err) => {
      alert(err.response ? err.response.data : "Unknown Server Error!");
    });
};

/* DELETE a form */
export const deleteForm = (page, id) => {
  axios
    .delete(`${SERVER_URL}/api/sdcform/${id}/`)
    .then((res) => {
      if (res.data) {
        getAllForms(page);
      } else {
        alert("Failed to delete SDCForm!");
      }
    })
    .catch((err) => {
      alert(err.response ? err.response.data : "Unknown Server Error!");
    });
};

/* PUT a form */
export const updateForm = (page, data) => {
  axios
    .put(`${SERVER_URL}/api/sdcform/${data.id}/`, {
      xmlString: data.xmlString,
      name: data.name,
    })
    .then((res) => {
      if (res.data) {
        page.setState({
          newForm: null,
          newId: "",
          newName: "",
          updateForm: null,
          isUpdate: false,
        });
        getAllForms(page);
      } else {
        alert("Failed to update SDCForm!");
      }
    })
    .catch((err) => {
      alert(err.response ? err.response.data : "Unknown Server Error!");
    });
};

/* GET SDC forms */
export const getSDCForm = (page, id) => {
  axios
    .get(`${SERVER_URL}/api/sdcform/${id}/`)
    .then((res) => {
      if (res.data) {
        page.setState({ form: res.data.sdcFormObject });
      } else {
        alert("Failed to get SDCForm!");
      }
    })
    .catch((err) => {
      alert(err.response ? err.response.data : "Unknown Server Error!");
    });
};
