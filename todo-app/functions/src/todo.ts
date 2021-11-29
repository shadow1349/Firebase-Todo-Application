import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { ToDoList, User } from './models';

export const OnListCreate = functions.firestore
  .document('Lists/{ListId}')
  .onCreate((snapshot, context) => {
    const userId = (snapshot.data() as ToDoList).UserId;

    const userRef = admin.firestore().doc(`Users/${userId}`);

    // Run transaction to update the list count for the user
    return admin.firestore().runTransaction((transaction) =>
      transaction.get(userRef).then((user) => {
        if (!user.exists) {
          return null;
        }

        const data = user.data() as User;

        data.ListCount = data.ListCount += 1;

        return transaction.set(userRef, data, { merge: true });
      })
    );
  });

export const OnListDelete = functions.firestore
  .document('Lists/{ListId}')
  .onDelete((snapshot, context) => {
    const userId = (snapshot.data() as ToDoList).UserId;

    const userRef = admin.firestore().doc(`Users/${userId}`);

    // Run transaction to update the list count for the user
    return admin.firestore().runTransaction((transaction) =>
      transaction.get(userRef).then((user) => {
        if (!user.exists) {
          return null;
        }

        const data = user.data() as User;

        data.ListCount = data.ListCount -= 1;

        // This shouldn't happen, but if we get a list count below 0 we will reset it to 0
        if (data.ListCount < 0) data.ListCount = 0;

        return transaction.set(userRef, data, { merge: true });
      })
    );
  });

export const OnItemCreate = functions.firestore
  .document(`Lists/{ListId}/Items/{ItemId}`)
  .onCreate((snapshot, context) => {
    const listRef = admin.firestore().doc(`Lists/${context.params['ListId']}`);

    return admin.firestore().runTransaction((transaction) =>
      transaction.get(listRef).then((list) => {
        if (!list.exists) {
          return null;
        }

        const data = list.data() as ToDoList;

        data.Count = data.Count += 1;

        return transaction.set(listRef, data, { merge: true });
      })
    );
  });

export const OnItemDelete = functions.firestore
  .document(`Lists/{ListId}/Items/{ItemId}`)
  .onDelete((snapshot, context) => {
    const listRef = admin.firestore().doc(`Lists/${context.params['ListId']}`);

    return admin.firestore().runTransaction((transaction) =>
      transaction.get(listRef).then((list) => {
        if (!list.exists) {
          return null;
        }

        const data = list.data() as ToDoList;

        data.Count = data.Count -= 1;

        if (data.Count < 0) data.Count = 0;

        return transaction.set(listRef, data, { merge: true });
      })
    );
  });
