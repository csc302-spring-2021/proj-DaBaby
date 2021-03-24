# The Product

### What was built?

We built an the SDC Tools API that supports the followings functionalities:

- Uploading an XML string describing an SDC form for a given diagnostic procedure, which gets parsed, converted, and stored in a database.
- Retrieving an SDC form for a specified procedure in JSON form,  which describes sections, questions (including type and content), and question dependencies.
- Retrieving a deprecated SDC form (one without an assigned procedure id because the form itself was updated or deleted) and SDC responses that relates to that legacy form.
- Managing forms for procedures by deleting forms and updating forms by uploading an updated XML.
- Creating a new response for a selected (active) form which returns a response object with default answers. 
- Submitting partially completed responses with an updated list of answers, which undergoes answer validation, after which valid answers are saved, while a list of invalid inputs are sent back to the client.
- Retrieving partially saved responses, which can be queried by patient ID, diagnostic procedure ID, and a time range during which the response was created.
- Deleting previous responses permanently. 

This has been deployed to, and can be found [here](http://dababysdcbackendapi-env-2.eba-ybqn7as3.ca-central-1.elasticbeanstalk.com/)

And the available endpoints and types of requests that can be made are outlined in our OPEN API doc [here](http://dababysdcbackendapi-env-2.eba-ybqn7as3.ca-central-1.elasticbeanstalk.com/api/). 

We also built two client applications that utilizes the SDC Tools API: 

- The first is the Form Filler interface that allows users to search for forms by diagnostic procedure, and renders a selected SDC form to be filled out. The user can start filling out a form, and save their responses, and continue editing later. They can find these incomplete responses by searching by patient ID, procedure ID and time range when the response was created. 
- The second is the Form Manager interface, which is complete with the ability to view all active forms, add a form for a procedure, update and delete forms, as well as view a rendered version of the SDC form. 

Both front-end applications have also been deployed. 
- [form-manager](http://dababysdcformmanager-env.eba-kd29msmd.ca-central-1.elasticbeanstalk.com/)
- [form-filler](http://dababysdcformfiller-env-1.eba-mq2saay2.ca-central-1.elasticbeanstalk.com/)

### How is this different from what you originally proposed?

For the most part, what we built aligned with out initial plan and goals. We were able to implement most of the features that we wanted to include in this phase. However, some features are not functioning 100% correctly due to time constraints and last minute bugs that appeared. This includes integrating the server requests from front-end to create new responses, and update partially completed responses. Our ability to stay on track with our original proposal comes from a lot of initial planning that took place at the beginning of each phase (described in more detail below). 

---

### High-level design of our software

#### Challenges 

- The first was determinining how to handle incomplete form responses to outdated forms without losing all the previously filled out data. We decided that the best action is to persist old versions of an SDC form when a form is deleted or updated. This way, any partially completed responses can still retrieved and rendered according to the outdated form's format. However, we will have to ensure that if a user attempts to update an outdated response, their request should be rejected. 
- Next is finding patterns in the XML to distinguish between question types (in particular radio buttons vs checkboxes), and organizing question dependencies. The data in the XML files is semi-structured, and parsing it without any give schema or rules when converting it to the SDC Form object was difficult. We relied on finding patterns in the example XML files. For example, we found that multiple choice questions with the checkbox selections have a property `maxSelections="0"` versus single choice radio button questions did not. The challenge with the question dependencies was with regards to determining when a question is dependent on a specific selection of a (parent) multiple choice question. We were ultimately able to derive certain rules based on patterns in the XML structure as described in this [note](https://www.notion.so/XML-Format-1f9e3db3a698472f8428bdb0df7c85c3).
- The last significant challenge was trying to mitigate the issue of the SQLite DB being wiped clean on every deployment. It was crucial to persist data beyond the lifecycle of a single deployment, thus we ultimately switched to a PostgreSQL database that was hosted on a remote server (in the cloud). Since we were using Django, the migration to this new database was relatively straightforward. 

#### Our artifacts

Our object models changed over time to take into account new considerations. You can view the initial UML diagram (version 1) and the updated version (version 2) with changes highlighted in gray [here](https://www.figma.com/file/IavfCnH57lFSQI2QF0x3ct/UML?node-id=0%3A1).

The first consideration is with regards to outdated forms. Since we are effectively storing all versions of the forms for any diagnostic procedure ID, in order to distinguish between older forms and the active one, older versions of a form will have a procedure ID of null, hence maintaining that a procedure ID can only be associated with one form. 

The second consideration was having to create different answer object schemas to accommodate the various question types. While true/false, integer, and free-text have obvious answer types, single-choice and multiple-choice was more complex because a “choice” can include an additional optional text field, so an answer has to capture both the choice and any additional input. Hence, we introduced a selection class that mirrors the choice class. A single choice answer consists of one (or none) selection object, while multiple choice answer consists of multiple selection objects. 

---

### Development Process and Documentation

We split the work between frontend and backend, which worked well as all the team members are working on components that they are most familiar and comfortable with. However, we need more communication and understanding between the frontend members and backend members, as having little knowledge to the other part has made it harder for the integration process. We are planning on making all group members to be somewhat familiar with parts they are not responsible for, so everyone has a big picture of the project and understands the designs and difficulties of other components too.

In terms of communication and collaboration, we use discord + google doc (api draft / meeting nots) + figma (UI design and UML diagram) + Github Project (Kanban workflow board). This workflow has proven to be efficient as everyone gets updated with all the progress in real time and the communication within the team is clear and efficient.

- [Our Kanban Board](https://github.com/csc302-spring-2021/proj-DaBaby/projects/1)
- [Our PR Page](https://github.com/csc302-spring-2021/proj-DaBaby/pulls)
- [Our Issue Page](https://github.com/csc302-spring-2021/proj-DaBaby/issues)
- [Our Collaborative Google Doc for API draft](https://docs.google.com/document/d/1J7TGGASue_xIjq5fFc85_4OaSO-GMnhKaM1MsyaO9fU/edit)
- [Our Figma Page for Frontend UI Design](https://www.figma.com/file/MOL9rJRDOBurosFFsBjxlB/SDC-Tools?node-id=1%3A3)

#### Strengths 

The general steps in our process were effective. At the beginning of each phase, our weekly team meeting is dedicated to sprint planning. This involved discussing design decisions with regards to the data and view models for the API (which was documented in the API Design Google doc) and the UI for the front end applications (which was designed/prototyped prior to this meeting in Figma). Referring to our [Meeting Minutes](https://docs.google.com/document/u/1/d/1WH-BLfZNkNob_WF_eOkAI-nBUF9moJW-o5aaVVLHos8/edit) for our initial meeting for Phase 2, having this team meeting allowed us to specify the goals (i.e. features that we want to accomplish) for the next sprint and general tasks, which gave everyone the general direction in which we are heading. This was useful because once we all started to complete tasks individually, everyone understood the system design, so they produced work that was consistent with the team’s expectations and compatible with components that other members were working on. The subsequent team meetings served as weekly syncs. It was beneficial to get an update on what everyone worked on the preceding week, discuss new problems and considerations (relating to design modifications), and to determine the next steps for the following week. 

Another action that we took was creating examples of what some feature or function should produce before the feature/function was fully implemented. For example, we created a test route for sending a mock SDC form, mocking the creation of a new form response and sending a default response object, and for mocking the update of a response that mirrored the real API routes that would be implemented. This gave the front-end developers an idea of what they should expect as return values. This encouraged early API integration on the front end applications, as it eliminated the blocker of waiting for the backend to complete its implementation. Another example is taking snippets from the example XML files provided, and mapping it to the respective JSON model. This required us to identify patterns in the XML, which provided a concrete idea of how the XML should be parsed and queried to build different types of questions dependencies. The notes can be found [here](https://www.notion.so/XML-Format-1f9e3db3a698472f8428bdb0df7c85c3). 


#### Weaknesses

We have not been actively updating the GitHub kanban board. Since we did not maintain an updated backlog of tasks, we could not gauge how much work was remaining, and thus did not plan team resources accordingly. For example, there were several instances where some members were ready to take on other tasks, but did not know what needed to be done until our weekly meetings. In retrospect, we also can’t accurately determine the ratio of the amount of tasks planned to the amount of tasks completed over time, making it hard to assess the effectiveness of our process. Furthermore, since the “In Progress” column was not being updated, we did not have a clear idea of which tasks each member was currently working on at any given time. 

---

### Plan for Final Demo

The following are the features that we aim to complete for the final demo.

Front-end Application Features:

- Display to the user invalid input messages when a response is save.
- Display a read only version of the response (to an outdated form version, either because it was deleted or updated).
- Allow the user to review their answers summarized upon completing all fields, and then submit the fully completed response.
- Integrate with backend on starting new repsonses and updating partially completed responses.

API Features:

- Permanently save a response upon response completion and successful validation.
- Adding in checks for when an incomplete response is outdated, and sending an indication to the client when they get the response and if they attempt to update an outdated response.
- Fix API routes with bugs and do better error-handling.


