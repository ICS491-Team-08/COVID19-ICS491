import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { UserInfo } from '../../api/userinfo/UserInfo';
import { Profiles } from '../../api/profile/Profile';

/* eslint-disable no-console */
function createUser(email, password, firstName, lastName, gender, vaccine, role) {
  console.log(`  Creating user ${email}.`);
  UserInfo.insert({ user: email, firstName: firstName, lastName: lastName, gender: gender, vaccine: vaccine });
  // Profiles.insert({ user: email, firstName: firstName, lastName: lastName, gender: gender, vaccine: vaccine });
  const userID = Accounts.createUser({
    username: email,
    email: email,
    password: password,
  });
  if (role === 'admin') {
    Roles.createRole(role, { unlessExists: true });
    Roles.addUsersToRoles(userID, 'admin');
  }
}

/** When running app for first time, pass a settings file to set up a default user account. */
if (Meteor.users.find().count() === 0) {
  if (Meteor.settings.defaultAccounts) {
    console.log('Creating the default user(s)');
    Meteor.settings.defaultAccounts.map(({ email, password, firstName, lastName, gender, vaccine, role }) => createUser(email, password, firstName, lastName, gender, vaccine, role));
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}
