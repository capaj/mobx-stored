# mobx-stored
a library giving you persistent observable variables

## usage
```javascript
import storedObservable from 'mobx-stored'

const defaultUser = {email: null, firstname: null, lastname: null}
const observableUserProfile = storedObservable('userProfile', defaultUser, 500)   // last parameter is optional-miliseconds how often do you want to save into localStorage. It is advised to use bigger value with bigger stores

// now any changes made to the observableUserProfile are synced in localStorage

observableUserProfile.name = 'Michael'

// after 500ms and reloading the page

observableUserProfile.name === 'Michael' // true

// revert to the default values

observableUserProfile.reset()

//Don't need it anymore?

observableUserProfile.dispose()


```
