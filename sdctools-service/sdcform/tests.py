from django.test import TestCase

# Create your tests here.
class SDCFormViewTests(TestCase):
    
    def test_valid_form(self):
        response = self.client.get("/api/sdcform/covid19")
        self.assertEqual(response.status_code, 200)

    def test_invalid_form(self):
        response = self.client.get("api/sdcform/foo")
        self.assertEqual(response.status_code, 404)

    # def test_upload_xml(self):
    #     response = self.client.post("api/sdcform/", {})
