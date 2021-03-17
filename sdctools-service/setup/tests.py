from django.test import TestCase
from django.test import Client

import json

# Create your tests here.
class IndexViewTests(TestCase):
    def test_basic(self):
        response = self.client.get('/api/test/')
        self.assertEqual(response.status_code, 200)

    def test_valid_form(self):

        response = self.client.get("/api/test/sdcform/covid19/")
        self.assertEqual(response.status_code, 200)
        self.assertTrue('sdcFormObject' in json.loads(response.content))


    def test_invalid_form(self):

        response = self.client.get("api/test/sdcform/foo/")
        self.assertEqual(response.status_code, 404)

    
    def test_upload_xml_valid(self):
        self.client = Client()
        data = { "diagnosticProcedureID" : "covid19"}
        response = self.client.post("/api/test/sdcform/", data)
        self.assertEqual(response.status_code, 201)
        self.assertTrue('sdcFormObject' in json.loads(response.content))

    def test_upload_xml_invalid(self):
        self.client = Client()
        data = {}
        response = self.client.post("/api/test/sdcform/", data)
        self.assertEqual(response.status_code, 400)

class ResponseViewTests(TestCase):

    def test_start_new_response_valid(self):
        self.client = Client()
        data = { 
            "patientID": "OH27891892",
            "clinicianID": "YP27923782",
            "sdcFormID": 1234,
        }

        response = self.client.post("/api/test/sdcformresponse/", data)
        res_content = json.loads(response.content)
        self.assertEqual(response.status_code, 201) 
        self.assertTrue('responseObject' in res_content)
        self.assertTrue('answers' in res_content['responseObject'])

    def test_new_response_invalid(self):
        self.client = Client()
        data = { 
            "patientID": "OH27891892",
            "clinicianID": "YP27923782"
        }

        response = self.client.post("/api/test/sdcformresponse/", data)
        self.assertEqual(response.status_code, 400)

    def test_update_response_invalid(self):
        self.client = Client()
        data = { 
            "patientID": "OH27891892",
            "clinicianID": "YP27923782",
            "sdcFormID": 1234,
            "answers": [ { "questionID": 83789, "answer": "CAN"} ]
        }
        response = self.client.put("/api/test/sdcformresponse/5465", data)
        self.assertEqual(response.status_code, 404)
    
    def test_update_invalid_inputs(self):
        # Assumes that response with id 2468 has already been added
        data = { 
            "patientID": "OH27891892",
            "clinicianID": "YP27923782",
            "sdcFormID": 1234,
            "answers": [ { "questionID": 37326, "answer": ""} ]
        }
        data = json.dumps(data)

        response = self.client.put("/api/test/sdcformresponse/2468", data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        

        res_content = json.loads(response.content)
        self.assertTrue("message" in res_content)
        self.assertTrue("responseObject" in res_content)
        self.assertTrue("invalidInputs" in res_content)
        
        invalid_inputs = res_content["invalidInputs"]
        self.assertEqual(len(invalid_inputs), 1)
        self.assertEqual(invalid_inputs[0]["questionID"], 37326)
    
    def test_update_valid_inputs(self):
        # Assumes that response with id 2468 has already been added
        data = { 
            "patientID": "OH27891892",
            "clinicianID": "YP27923782",
            "sdcFormID": 1234,
            "answers": [ { "questionID": 37326, "answer": "CAN34567"} ]
        }
        data = json.dumps(data)

        response = self.client.put("/api/test/sdcformresponse/2468", data, content_type='application/json')
        self.assertEqual(response.status_code, 200)
        

        res_content = json.loads(response.content)
        invalid_inputs = res_content["invalidInputs"]
        self.assertEqual(len(invalid_inputs), 0)
