from django.test import TestCase
from django.test import Client

# Create your tests here.
class IndexViewTests(TestCase):
    def test_basic(self):
        response = self.client.get('/api/test/')
        self.assertEqual(response.status_code, 200)
