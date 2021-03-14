# API.md 
For the full description of the API endpoints and how to make various requests, refer to the Open API document (index.html or API.json) in the doc folder.

Our API satisfies the Bezos Dictum as it handles all the data parsing on the backend, responding to the client with only clean, JSON data. Upon receiving the XML document, we parse it into a python data structure, which is then stored in our database. When a client requests an SDC form, we serialize our database objects into JSON, which is then returned to the client in an easy to interpret format, with no extra data.
