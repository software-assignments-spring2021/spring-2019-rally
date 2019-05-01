// import React, {Component} from 'react';
//
// import { gapi, authorizeButton, signoutButton } from './googleapis';
// //const {gapi} = require('https://apis.google.com/js/api.js')
// const apiKey = 'AIzaSyDpHAHZVnzwRRjyysCJuBinYahuoNiUkJ4';
// const discoveryDocs = ["https://people.googleapis.com/$discovery/rest?version=v1"];
// const clientId = '987401539137-ia5sndc9trs64phqig2ftluiqd8j4lnu.apps.googleusercontent.com';
//
// // Enter one or more authorization scopes. Refer to the documentation for
// // the API or https://developers.google.com/people/v1/how-tos/authorizing
// // for details.
//
// const scopes = 'profile';
// class GoogleAuth extends Component {
//
//     // <script async defer src="https://apis.google.com/js/api.js"
//     //   onload={this.handleClientLoad()}
//     //   onreadystatechange="if (this.readyState === 'complete') this.onload()">
//     // </script>
//     // <script type="text/javascript">
//     //   // Enter an API key from the Google API Console:
//     //   //   https://console.developers.google.com/apis/credentials
//     //
//     // </script>
//     //
//     //
//
//
//
//     componentDidMount(){
//
//     }
//
//     render(){
//
//
//
//         const authorizeButton = document.getElementById('authorize-button');
//         const signoutButton = document.getElementById('signout-button');
//
//         let gAuth;
//         gAuth = (
//
//
//
//             <div>
//               <p>Say hello using the People API.</p>
//               <button id="authorize-button" style="display: none;">Authorize</button>
//               <button id="signout-button" style="display: none;">Sign Out</button>
//               <div id="content"></div>
//
//             </div>
//
//
//
//
//         )//end gAuth
//
//
//
//         return(
//             <div>
//                 {gAuth}
//             </div>
//         );
//     }
// }
//
// function handleClientLoad() {{
//   // Load the API client and auth2 library
//   gapi.load('client:auth2', initClient)
// }}
//
// function initClient() {{
//   gapi.client.init({
//       apiKey: apiKey,
//       discoveryDocs: discoveryDocs,
//       clientId: clientId,
//       scope: scopes
//   }).then(function () {
//     // Listen for sign-in state changes.
//     gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
//
//     // Handle the initial sign-in state.
//     updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
//
//     authorizeButton.onclick = handleAuthClick;
//     signoutButton.onclick = handleSignoutClick;
//   })
// }}
//
// function updateSigninStatus(isSignedIn) {{
//   if(isSignedIn) {
//
//     authorizeButton.style.display = 'none';
//     signoutButton.style.display = 'block';
//     makeApiCall();
//   } else {
//     authorizeButton.style.display = 'block';
//     signoutButton.style.display = 'none';
//   }
//
//
// }}
//
// function handleAuthClick(event) {
//   gapi.auth2.getAuthInstance().signIn();
// }
//
// function handleSignoutClick(event) {
//   gapi.auth2.getAuthInstance().signOut();
// }
//
// // Load the API and make an API call.  Display the results on the screen.
// function makeApiCall() {
//   gapi.client.people.people.get({
//     'resourceName': 'people/me',
//     'requestMask.includeField': 'person.names'
//   }).then(function(resp) {
//     var p = document.createElement('p');
//     var name = resp.result.names[0].givenName;
//     p.appendChild(document.createTextNode('Hello, '+name+'!'));
//     document.getElementById('content').appendChild(p);
//   });
// }
//
//
// export default GoogleAuth;
