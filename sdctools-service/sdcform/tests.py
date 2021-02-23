from django.test import TestCase, Client
import os
import json

# Create your tests here.
class IndexViewTests(TestCase):
    def test_get_empty_list_of_forms(self):
        response = self.client.get('/api/sdcform/')
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, '[]')

    def test_upload_xml_valid(self):
        self.client = Client()
        f = open(os.path.dirname(os.path.realpath(__file__)) + '/xml.txt', 'r')
        xml_file = f.read()
        f.close()

        data = { "diagnosticProcedureID" : "test123", "name" : "test123", "xmlString" : xml_file}
        response = self.client.post("/api/sdcform/", data)
        self.assertEqual(response.status_code, 200)
        self.assertTrue('sdcFormObject' in json.loads(response.content))


    def test_get_valid_form(self):

        self.client = Client()
        f = open(os.path.dirname(os.path.realpath(__file__)) + '/xml.txt', 'r')
        xml_file = f.read()
        f.close()

        data = { "diagnosticProcedureID" : "test123", "name" : "test123", "xmlString" : xml_file}
        response = self.client.post("/api/sdcform/", data)

        response = self.client.get("/api/sdcform/test123/")
        self.assertEqual(response.status_code, 200)
        self.assertTrue('sdcFormObject' in json.loads(response.content))
        self.assertContains(response, 'sdcFormObject')

    def test_get_invalid_form(self):

        response = self.client.get("api/sdcform/foo/")
        self.assertEqual(response.status_code, 404)