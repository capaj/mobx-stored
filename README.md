# mobx-stored
a library giving you persistent observable variables. Not only they persist trough sessions, they also synchronize via storage events across all browser tabs.

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

Also it is smart enough not to serialize getters(computeds) so if you have 

```javascript
const defaultUser = {
  firstname: null, 
  lastname: null,
  get name () {
    return this.firstname + this.lastname
  }
}
```

name property won't be serialized into localStorage