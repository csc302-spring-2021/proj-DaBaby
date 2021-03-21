from django.test import TestCase
import os
import json

# Helper functions for setup
def request_body_with_xml_file():
    f = open(os.path.dirname(os.path.realpath(__file__)) + '/xml.txt', 'r')
    xml_file = f.read()
    f.close()
    data = { "diagnosticProcedureID" : "test123", "name" : "test123", "xmlString" : xml_file}
    return data

def upload_initial_form():
    client = Client()
    data = request_body_with_xml_file()
    response = client.post("/api/sdcform/", data)
    return json.loads(response.content)['sdcFormObject']['id']

def generate_sdcresponse():
    client = Client()
    formID = upload_initial_form() 
    data = { 
        "patientID": "OH27891892",
        "clinicianID": "CAMD92378223",
        "sdcFormID": formID,
    }
    response = client.post("/api/sdcformresponse/", data)
    return json.loads(response.content)


# If any fields are missing in the POST request, should return 400 Bad Request
# If patientID and clinicianID do not have correct length, return 400 Bad Request
# If the sdcFormID requested does not exists, return 404
class CreateNewResponseTests(TestCase):

    def test_missing_sdcformid(self):
        self.client = Client()
        data = { 
            "patientID": "OH27891892",
            "clinicianID": "CAMD92378223"
        }

        response = self.client.post("/api/sdcformresponse/", data)
        self.assertEqual(response.status_code, 400)

    def test_invalid_sdcformid(self):
        self.client = Client()
        data = { 
            "patientID": "OH27891892",
            "clinicianID": "CAMD92378223",
            "sdcFormID": 1234,  # form does not exist
        }

        response = self.client.post("/api/sdcformresponse/", data)
        self.assertEqual(response.status_code, 404) 

    def test_invalid_patientID(self):
        self.client = Client()
        formID = upload_initial_form() 
        data = { 
            "patientID": "OH2789",
            "clinicianID": "CAMD92378223",
            "sdcFormID": 1234,
        }

        response = self.client.post("/api/sdcformresponse/", data)
        self.assertEqual(response.status_code, 400) 

    def test_invalid_clinicianID(self):
        self.client = Client()
        formID = upload_initial_form() 
        data = { 
            "patientID": "OH27891892",
            "clinicianID": "CAMD",
            "sdcFormID": formID,
        }

        response = self.client.post("/api/sdcformresponse/", data)
        self.assertEqual(response.status_code, 400) 

    def test_all_fields_valid(self):
        self.client = Client()
        formID = upload_initial_form() 
        data = { 
            "patientID": "OH27891892",
            "clinicianID": "CAMD92378223",
            "sdcFormID": formID,
        }
        response = self.client.post("/api/sdcformresponse/", data)
        self.assertEqual(response.status_code, 201) 
        self.assertTrue('responseObject' in json.loads(response.content))

# ===== Uncomment below as functions are added ======= #

# class GetResponseTests(TestCase):

#     def test_get_all_responses(self):
#         self.client = Client()
#         response = self.client.get('/api/sdcformresponse/')
#         self.assertEqual(response.status_code, 200)
#         self.assertTrue('sdcFormResponses' in json.loads(response.content))

#     def test_get_responses_query(self):

#         self.client = Client()
#         response = self.client.get('/api/sdcformresponse/', { 
#             'patientID': 'OH12344874', 'diagnosticProcedureID': 'adrenal', 'metadata': 'true' 
#             })
#         self.assertEqual(response.status_code, 200)
#         self.assertTrue('sdcFormResponses' in json.loads(response.content))

    
#     def test_get_invalid_responseid(self):
#         self.client = Client()
#         response = self.client.get('/api/sdcformresponse/1234/')
#         self.assertEqual(response.status_code, 404)

#     def test_get_valid_response(self):
#         self.client = Client()
#         formID = upload_initial_form() 
#         data = { 
#             "patientID": "OH27891892",
#             "clinicianID": "CAMD92378223",
#             "sdcFormID": formID,
#         }
#         response = self.client.post("/api/sdcformresponse/", data)
#         sdcResponseId = json.loads(response.content)['responseObject']['id']
        
#         response = self.client.get('/api/sdcformresponse/{}/'.format(sdcResponseId))
#         self.assertEqual(response.status_code, 200)

#         self.assertTrue('responseObject' in json.loads(response.content))


# # These tests include DELETE and PUT
# # PUT should have all body fields validated, if fields are missing or invalid, return 400 - Bad Request
# # DELETE and PUT return 404 if response id requested is non-existant
# class ModifyResponseTests(TestCase):

#     def test_delete_nonexistant_response(self):
#         self.client = Client()
#         response = self.client.delete('/api/sdcformresponse/1234/')
#         self.assertEqual(response.status_code, 404)

#     def test_delete_existing_response(self):
#         self.client = Client()
#         formID = upload_initial_form() 
#         data = { 
#             "patientID": "OH27891892",
#             "clinicianID": "CAMD92378223",
#             "sdcFormID": formID,
#         }
#         response = self.client.post("/api/sdcformresponse/", data)
#         sdcResponseId = json.loads(response.content)['responseObject']['id']
        
#         response = self.client.delete('/api/sdcformresponse/{}/'.format(sdcResponseId))
#         self.assertEqual(response.status_code, 200)

#     def test_update_nonexistant_response(self):
#         sdcResponse = generate_sdcresponse() 
#         put_response = self.client.put("/api/sdcformresponse/1000/", json.dumps(sdcResponse), content_type="application/json")
#         self.assertEqual(put_response.status_code, 404) # response 1000 does not exist

#      # Test checks if response id in the object body matches one passed in URL
#     def test_update_not_a_match(self):
#         sdcResponse1 = generate_sdcresponse()
#         sdcResponse2 = generate_sdcresponse()

#         self.assertNotEqual(sdcResponse1["id"], sdcResponse2["id"])
#         # We are updating sdcResponse2 with sdcResponse1, but they have different response id's
#         put_response = self.client.put("/api/sdcformresponse/{}/".format(sdcResponse2['id']), 
#                                         json.dumps(sdcResponse1), content_type="application/json")
#         self.assertEqual(put_response.status_code, 400)

#     def test_invalid_put_body(self):
#         sdcResponse = generate_sdcresponse()
#         body = { # Missing lots of fields
#             "id": sdcResponse['id'],
#             "patientID": sdcResponse['patientId'],
#         }
#         put_response = self.client.put("/api/sdcformresponse/{}/".format(sdcResponse['id']), json.dumps(body), 
#                                         content_type="application/json")
#         self.assertEqual(put_response.status_code, 400)

#     def test_update_valid(self):
#         sdcResponse = generate_sdcresponse()
#         put_response = self.client.put("/api/sdcformresponse/{}/".format(sdcResponse['id']), json.dumps(sdcResponse), 
#             content_type="application/json")
#         self.assertEqual(put_response.status_code, 200)
#         jsonData = json.loads(put_response.content)
#         self.assertTrue('responseObject' in jsonData)
#         self.assertTrue('invalidInputs' in jsonData)
#         self.assertTrue(len(jsonData['invalidInputs']) > 0) 
#         # The initial default response should have multiple invalid inputs
