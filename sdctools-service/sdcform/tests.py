from django.test import TestCase, Client
import os
import json

# Returns the body content for a PUT or POST request to upload an XML file for a form
def get_request_with_xml_file():
    f = open(os.path.dirname(os.path.realpath(__file__)) + '/xml.txt', 'r')
    xml_file = f.read()
    f.close()
    data = { "diagnosticProcedureID" : "test123", "name" : "test123", "xmlString" : xml_file}
    return data

def upload_initial_form():
    client = Client()
    data = get_request_with_xml_file()
    return client.post("/api/sdcform/", data)

# Create your tests here.
class FormsTests(TestCase):
    def test_get_empty_list_of_forms(self):
        self.client = Client()
        response = self.client.get('/api/sdcform/')
        self.assertEqual(response.status_code, 200)
        self.assertTrue('sdcFormObjects' in json.loads(response.content))
        self.assertEqual(json.loads(response.content)['sdcFormObjects'], [])

    def test_upload_xml_valid(self):
        self.client = Client()
        f = open(os.path.dirname(os.path.realpath(__file__)) + '/xml.txt', 'r')
        xml_file = f.read()
        f.close()

        data = { "diagnosticProcedureID" : "test123", "name" : "test123", "xmlString" : xml_file}
        response = self.client.post("/api/sdcform/", data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue('sdcFormObject' in json.loads(response.content))

    # def test_upload_invalid_xml(self):
    #     self.client = Client()
    #     data = { "diagnosticProcedureID" : "test123", "name" : "test123", "xmlString": "not xml!"}
    #     response = self.client.post("/api/sdcform/", data)
    #     self.assertEqual(response.status_code, 400)

    def test_get_valid_form(self):

        self.client = Client()
        upload_initial_form()

        response = self.client.get("/api/sdcform/test123/")
        self.assertEqual(response.status_code, 200)
        self.assertTrue('sdcFormObject' in json.loads(response.content))
        self.assertContains(response, 'sdcFormObject')

    def test_get_invalid_form(self):

        response = self.client.get("api/sdcform/foo/")
        self.assertEqual(response.status_code, 404)

    def test_get_all_forms(self):
        self.client = Client()
        upload_initial_form()
        response = self.client.get('/api/sdcform/')
        self.assertEqual(response.status_code, 200)
        # There should be one form
        forms = json.loads(response.content)['sdcFormObjects']
        self.assertEquals(len(forms), 1)
        self.assertTrue('id' in forms[0])
        self.assertTrue('diagnosticProcedureID' in forms[0])
        self.assertTrue('timestamp' in forms[0])
        self.assertTrue('sections' in forms[0])

    
    def test_get_all_form_metadata(self):
        self.client = Client()
        upload_initial_form()
        response = self.client.get('/api/sdcform/', { 'metadata': 'true' })
        self.assertEqual(response.status_code, 200)

        forms = json.loads(response.content)['sdcFormObjects']
        self.assertEquals(len(forms), 1)
        self.assertFalse('sections' in forms[0])
        self.assertTrue('id' in forms[0])
        self.assertTrue('diagnosticProcedureID' in forms[0])
        self.assertTrue('timestamp' in forms[0])


class ModifyFormsTests(TestCase):

    def test_delete_valid_form(self):
        upload_initial_form() 
        self.client = Client()
        response = self.client.delete("/api/sdcform/test123/")
        self.assertEqual(response.status_code, 200)

        # Ensure that form has been deleted for procedure_id = test123
        response = self.client.get("/api/sdcform/test123/")
        self.assertEqual(response.status_code, 404) 

    def test_delete_nonexistant_form(self):
        self.client = Client()
        response = self.client.delete("/api/sdcform/foo/")
        self.assertEqual(response.status_code, 404)

    def test_update_valid_form(self):
        # Uploading form to procedure = test123
        upload_initial_form()
        # Get the id of the old form
        response = self.client.get("/api/sdcform/test123/")
        form = json.loads(response.content)['sdcFormObject']
        
        # Update the form
        self.client = Client()
        new_data = json.dumps(get_request_with_xml_file())
        put_response = self.client.put("/api/sdcform/test123/", new_data, content_type="application/json")
        self.assertEqual(put_response.status_code, 200)

        # Get the id of the new form
        response = self.client.get("/api/sdcform/test123/")
        new_form = json.loads(response.content)['sdcFormObject']

        self.assertNotEqual(form["id"], new_form["id"])

    def test_update_nonexistant_form(self):
        upload_initial_form() # Only form in db is the one with procedureID = test123
        self.client = Client()
        new_data = json.dumps(get_request_with_xml_file())
        put_response = self.client.put("/api/sdcform/foo/", new_data, content_type="application/json")
        self.assertEqual(put_response.status_code, 404)

    # def test_update_form_invalid_request(self):
    #     upload_initial_form() # Only form in db is the one with procedureID = test123
    #     self.client = Client()
    #     data = json.dumps({ "diagnosticProcedureID" : "test123", "name" : "test123"}) # missing body field xmlString
    #     put_response = self.client.put("/api/sdcform/test123/", data, content_type="application/json")
    #     self.assertEqual(put_response.status_code, 400)

    def test_add_form_with_same_procedure_id(self):
        upload_initial_form() # form with diagnosticProcedureID = test123
        get_response = self.client.get("/api/sdcform/test123/")
        form1 = json.loads(get_response.content)['sdcFormObject']

        response = upload_initial_form() # Here, we are trying to add another new form with diagnosticProcedureID = test123
        self.assertNotEqual(response, 201)

        # Ensure the form was not modified
        new_get_response = self.client.get("/api/sdcform/test123/")
        form2 = json.loads(new_get_response.content)['sdcFormObject']

        self.assertEqual(form1['id'], form2['id'])

    def test_add_form_after_delete(self):
        upload_initial_form() 
        self.client = Client()
        get_response = self.client.get("/api/sdcform/test123/")
        form1 = json.loads(get_response.content)['sdcFormObject']

        self.client.delete("/api/sdcform/test123/")
        
        response = upload_initial_form() # Uploading a "new" form to diagnosticPocedureID = test123
        self.assertEqual(response.status_code, 201)

        get_response = self.client.get("/api/sdcform/test123/")
        form2 = json.loads(get_response.content)['sdcFormObject']
        # form id should have changed with new upload
        self.assertNotEqual(form1['id'], form2['id'])


def HistoricalFormTests(TestCase):

    def test_get_non_hist_form(self):
        upload_initial_form() 
        self.client = Client()
        response = self.client.get('/api/sdcform/', { 'historyID': '1234' })
        self.assertEqual(response.status_code, 404)

    def test_get_hist_form(self):
        upload_initial_form() 
        self.client = Client()
        self.client.delete("/api/sdcform/test123/")
        response = self.client.get('/api/sdcform/', { 'historyID': '1234' })
        self.assertEqual(response.status_code, 200)

