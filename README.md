# Evaluate

An app for crowd sourced course feedback at Iowa State

Sorry, there's no local version that'll connect to the production DB...

###To develop with your own instance:

* [Install Sails](http://sailsjs.org/get-started)
* Create a mongoDB instance (I'm partial to [mongolab](https://www.mongolab.com)
* In config/connections.js set your mongo connection variables (either plain strings or as environment variables on your machine)
* In the root directory start the application with ```sails lift``` 
* In the root directory: ```node import_semesters.js``
  * That adds all of the ISU classes from the Spring 2016 semester
* Now, localhost:1337 should have an instance of Evaluate running.

a [Sails](http://sailsjs.org) application
