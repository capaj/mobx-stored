# mobx-stored-observable
a library giving you persistent observable variables

## usage
```javascript
import storedObservable from './stored-observable'

const defaultUser = {email: null, firstname: null, lastname: null}
const observableUserProfile = storedObservable('userProfile', defaultUser, 500)   // last paremeter is optional

// now any changes made to the observableUserProfile are synced in localStorage

observableUserProfile.name = 'Michael'

// after 500ms and reloading the page

observableUserProfile.name === 'Michael' // true


//Don't need it anymore?

observableUserProfile.dispose()

// revert to the default values

observableUserProfile.reset()
```
