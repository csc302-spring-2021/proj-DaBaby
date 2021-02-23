# Test

One of our project goals is to employ test-driven development and develop an extensive suite of unit tests for both the frontend and backend, as well as integration tests.

## Testing Strategy

We are using Django’s built-in testing tool, django.test (which utilizes Python’s unittest module) to write unit tests to test both the views (i.e. API endpoints) and the models (i.e. creation and manipulation of data models) of our backend application. We decided to use this because since our team does not have extensive experience with other testing frameworks, this was a good starting point. Further, its testing capabilities seem (as of now) sufficient for our purposes. Also, the test cases can be easily executed by running a python single command.

For front-end testing, we opted to leverage Jest (https://jestjs.io/) as our JavaScript testing framework. We are also making use of a testing library for utilities that assist in testing the frontend (https://testing-library.com/). Running the tests will be handled by running a script with node.

With respect to TDD, we have a designated team member writing tests based on the expected functionality of the unit to be tested, with other members concurrently implementing the feature. The tests would be pushed to the repo, and the implementation would be tested against these test cases.

## CI/CD

For the automated streamline, we use GitHub Action workflows. The three yml files defined inside .github/workflows correspond to the three different CI/CD streamlines of each of our applications. The workflow contains instructions for building the applications, running the tests, packaging built code and deploying them to the AWS server. These workflows execute whenever there is a push or pull request going into the ‘dev’ branch, which is the development branch containing all three applications’ source codes.

The frontend React applications(form-filler and form-manager) are built using npm and react-script build. We use gulp to automate the process and generate built code zip packages for the deployment.
The backend Django application uses ‘deploy.py’ as the entry point of the API server. This python script contains necessary setups such as database initialization, migration and static file collections. It then exposes the wsgi application to the Elasticbeanstalk service as the API entry point.

For our CI/CD deployment server, we chose Amazon AWS services because of their good integration and support with GitHub Actions, the monthly free tier server quota and our group member’s past experience with it. We use Amazon S3 storage as the deployment code storage and version controller for our applications, and Amazon Elasticbeanstalk as our CI/CD deployment service, which uses Amazon EC2 server as deployment endpoint server.

### Backend - Phase 1 tests

For phase 1, we focused mainly on getting familiar with Django’s testing tool. We implemented several basic unit tests for two endpoints. The first one tests a valid POST request to `/api/sdcform` for submitting an XML representing a new SDC Form, and ensures that the appropriate status code and JSON object is returned on successful submission. The second one tests an invalid POST request, in which the body is missing some required fields, and ensures that the appropriate status code is returned.

We also implemented unit tests for the endpoint serving GET requests for an SDC Form by diagnostic procedure ID. Since the parsing of the XML is not fully implemented yet, we created a mock endpoint `/api/test/sdcform/covid19` that mocks the real endpoint `/api/sdcform/<str:procedureid>`, and returns a hardcoded JSON representing the SDC Form associated with diagnosticProcedureId = covid19. We test a valid GET request to this endpoint and ensure the appropriate status code and JSON object is returned.

### Front-end - Phase 1 tests

For phase 1, we wanted to ensure we understood the tools we would be using for front-end tests. We aim to leverage Jest in combination with the react testing-library for creating front-end unit tests. The first tests we wrote covered basic form input validation. Currently, our tests cover input verification on a text input field.

Specifically, we cover two cases. The first ensures that upon form submission, the text field is not empty. The second tests that if no input is supplied in a field, we will display the appropriate error message on the front-end prompting the user to fill out the required information in the field.

These tests can be run by navigating to the form-filler application and running the command `yarn test`. This kicks off the Jest test runner.
