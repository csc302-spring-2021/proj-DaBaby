# Vertical

For our initial vertical slice, we implemented two features. The first is the ability for the Form Manager to upload an XML file (representing a new SDC Form) to the server for the first time. The second is the ability for the Form Filler to retrieve an SDC Form given a diagnostic procedure ID and render the form based on the view model returned. Currently, we are only able to display the independent questions.

## Form Manager Use Case

The frontend application source code can be found in the `form-manager` folder. We have set up a simple UI based on our Figma prototype that allows the user to add a new SDC Form. The user uploads the XML file and enters an appropriate procedure ID that is associated with the form. Upon confirming the upload action. This app will then send a request to our deployed server via POST to the /api/sdcform endpoint. The server app “parses” the XML (though this function is not fully functional as of yet) and returns the associated SDC Form object in its response. Upon successful submission, the frontend will receive the appropriate response, and then display information about the form in a table (showing that it has been added).

## Form Filler Use Case

The frontend application source code can be found in the `form-filler` folder. We have set up a simple UI based on our Figma prototype that allows the users to see a rendered SDC Form. Behind the scenes, the frontend is making a GET request to the /api/test/scdform/<str: procedureID> endpoint, where <str: procedureID> is replaced with covid19. The server returns the SDC Form object corresponding to the diagnostic procedure with id as “covid19”. Based on the returned view model, the frontend renders the form they see fit. In our case, for example, we designed the UI so that it renders different pages for the different sections in the form that users can navigate through individually. The frontend is able to render different types of questions, but the question dependency aspect is not fully functional as of yet.
