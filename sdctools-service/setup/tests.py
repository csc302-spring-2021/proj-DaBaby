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
        self.assertContains(response, 'sdcFormObject')

    def test_invalid_form(self):

        response = self.client.get("api/test/sdcform/foo/")
        self.assertEqual(response.status_code, 404)

    
    # def test_upload_xml(self):
    #     response = self.client.post("api/test/sdcform/", data={}, content_type="application/json")
    #     self.assertEqual(response.status_code, 201)
