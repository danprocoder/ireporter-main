# ireporter-main

[![Build Status](https://travis-ci.com/danprocoder/ireporter-main.svg?branch=develop)](https://travis-ci.com/danprocoder/ireporter-main)

[![Coverage Status](https://coveralls.io/repos/github/danprocoder/ireporter-main/badge.svg?branch=develop)](https://coveralls.io/github/danprocoder/ireporter-main?branch=develop)

## Project Description
Corruption is a huge bane to Africa’s development. African countries must develop novel andlocalised solutions that will curb this menace, hence the birth of iReporter. iReporter enablesany/every citizen to bring any form of corruption to the notice of appropriate authorities and thegeneral public. Users can also report on things that needs government intervention.

## Project Features
1. Users can create an account and log in.
2. Users can create a ​red-flag ​​record (An incident linked to corruption).
3. Users can create ​intervention​​ record​​​(a call for a government agency to intervene e.grepair bad road sections, collapsed bridges, flooding e.t.c).
4. Users can edit their ​red-flag ​​or ​intervention ​​records.
5. Users can delete their ​red-flag ​​or ​intervention ​​records.
6. Users can add geolocation (Lat Long Coordinates) to their ​red-flag ​​or ​interventionrecords​.
7. Users can change the geolocation (Lat Long Coordinates) attached to their ​red-flag ​​orintervention ​​records​.
8. Admin can change the ​status​​ of a record to either ​under investigation, rejected ​​(in theevent of a false claim)​​​or​ resolved ​​(in the event that the claim has been investigated and resolved)​.

## How to Use
1. Clone this repository to your local machine 
2. Run `npm install` to install the dependencies
3. Run `npm run migrate` to run the migration files to create the database tables.
3. Run `npm start` to start the application

## Testing
Run `npm test` to test the API endpoints

## About this Project
UI Templates: https://danprocoder.github.io/ireporter-main
Pivotal Tracker: https://www.pivotaltracker.com/n/projects/2226635