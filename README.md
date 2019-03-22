[![Build Status](https://travis-ci.com/nyu-software-engineering/rally.svg?branch=master)](https://travis-ci.com/nyu-software-engineering/rally)

# Rally

### **About the project:**
As college students in New York City who are always on the move, we quite often find it difficult to organize group hangouts. Our friends never seem to be be able to find times when we are all available. When we finally decide on a time, knowing what to do or picking the place to go eat/socialize/simply meet up is even more difficult. Many people that we have interviewed, especially those who are in or from NYC, can also attest to this problem. For this reason, we are creating a mobile app where users can easily "rally" their friends together when meeting as a group and plan things in an organized and simplified manner.

### **Project Status:**
2/20/19: The project is in it's foundational phase right now. The team has started working on requirements engineering, data modeling, end users, user stories, use cases and GitHub Management.  

3/6/19: The server side endpoints for registering a new user (api/users/register), logging in a user (api/users/login), and using JWT to authenticate a user (api/users/current) works with unit testing for some of the POST methods. Get unit tests to be implemented in the next sprint.


### **Endpoints:**

api/users/register: Takes a JSON objet containing "name, email, password, password2" and returns a JSON object containing unique id, name, email, date.

api/users/login: Takes a JSON object containing email, passowrd and returns a JSON object containing a boolean property 'success' and a 'token' property containing JWT authentication.

api/users/current: Takes a value 'Authorization' in the header of the request containing the JWT token when user logs in, returns a JSON object containing the details of the users except for password.


### **Installation Guidelines:**
This section of the file will be updated as per the status of the project. Currently, we are in the foundation phase of the project. After cloning, forking, or downloading our repository, run **npm install** in order to install the necessary dependencies. 

### **Running Unit Tests:**
Clone, fork, or download the branch "unitTestsSprint0" and install the project dependencies with **npm install**. This branch currently contains the entire project, as the unit tests are not yet ready to be merged into the master branch. To run the tests with code coverage, use **npm run test**. Mocha will recurse through the "test" directory and run each test. Authors of each unit test are written in the comments at the beginning of each file. (Branch names are inconsistent for sprint 0 as we were adjusting to feature branch workflow, but from sprint 1 onwards we will follow the branch naming protocol provided on Professor's website. 

*Note: Until Travis CI is set up, you will need a keys file from us to run our program--please reach out to one of the emails below.*

### **Running Only the Server:**
npm run server

### **Running the Server and Frontend Simultaneously (on localhost:3000/)**
npm run dev

### **Team Members:**

* Nanako Chung (nsc309@nyu.edu)
* Christine Welch (cew385@nyu.edu)
* Ryan Cho (rmc567@nyu.edu)
* Erik Law (el2392@nyu.edu)
* Muhammad Hassan (mh4722@nyu.edu)

### **Links:**
* ### [**License**](https://github.com/nyu-software-engineering/rally/blob/master/LICENSE)
* ### [**Contributing**](https://github.com/nyu-software-engineering/rally/blob/master/CONTRIBUTING.md)
