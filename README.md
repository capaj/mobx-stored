# mobx-stored

a simple utility for persisting POJO objects into localStorage via mobx observables. Not only they persist through sessions, they also synchronize via storage events across all browser tabs.

## usage

```javascript
import { localStored } from 'mobx-stored'
import { sessionStored } from 'mobx-stored' // for using sessionStorage rather than localStorage

const defaultUser = { email: null, firstname: null, lastname: null } 
const observableUserProfile = localStored('userProfile', defaultUser, { // observableUserProfile is the default extended with the data from localStorage
  delay: 500
}) // last parameter is optional-mobx autorun options for running the save operation into the storage. Use higher delay if you store a lot of data

// now any changes made to the observableUserProfile are synced in localStorage

observableUserProfile.name = 'Michael'

// after 500ms and reloading the page

observableUserProfile.name === 'Michael' // true

// revert to the default values

observableUserProfile.reset()

// need to add new properties?

observableUserProfile.extend({
  myNewProp: 1
})

//Don't need it anymore?

observableUserProfile.destroy() // removes it from localStorage
```
