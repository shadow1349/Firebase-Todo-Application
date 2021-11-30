import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

export const OnUserCreate = functions.auth.user().onCreate((user, context) => {
  const userDocument = {
    Id: user.uid,
    ProfilePhoto: user.photoURL,
    ListCount: 0,
    Email: user.email,
    CreatedOn: Date.now(),
  };

  return admin.firestore().doc(`Users/${userDocument.Id}`).set(userDocument);
});

export const OnUserDelete = functions.auth.user().onDelete((user, context) => {
  return admin.firestore().doc(`Users/${user.uid}`).delete();
});
