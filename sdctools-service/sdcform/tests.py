from django.test import TestCase, Client

# Create your tests here.
class IndexViewTests(TestCase):
    def test_get_empty_list_of_forms(self):
        response = self.client.get('/api/sdcform/')
        self.assertEqual(response.status_code, 200)

    # def test_valid_form(self):

    #     response = self.client.get("/api/sdcform/covid19/")
    #     self.assertEqual(response.status_code, 200)
    #     self.assertTrue('sdcFormObject' in json.loads(response.content))
    #     self.assertContains(response, 'sdcFormObject')

    def test_invalid_form(self):

        response = self.client.get("api/sdcform/foo/")
        self.assertEqual(response.status_code, 404)