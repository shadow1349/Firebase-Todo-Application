import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom, of, switchMap, take } from 'rxjs';
import { ToDoList, ToDoListItem } from 'src/app/models';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(private db: AngularFirestore, private auth: AngularFireAuth) {}

  /**  ToDo List Functions  **/

  async createTodoList(name: string) {
    const user = await firstValueFrom(this.auth.user.pipe(take(1)));

    if (!user) {
      throw new Error('User is not logged in');
    }

    const list: ToDoList = {
      Id: this.db.createId(),
      UserId: user.uid,
      Count: 0,
      Name: name,
      CreatedOn: Date.now(),
    };

    return this.db.doc(`Lists/${list.Id}`).set(list);
  }

  getTodoLists() {
    return this.auth.user.pipe(
      switchMap((user) =>
        !!user
          ? this.db
              .collection<ToDoList>('Lists', (ref) =>
                ref.where('UserId', '==', user.uid)
              )
              .valueChanges()
          : of([])
      )
    );
  }

  getTodoList(id: string) {
    return this.db.doc<ToDoList>(`Lists/${id}`).valueChanges();
  }

  updateListName(id: string, name: string) {
    return this.db
      .doc<Partial<ToDoList>>(`Lists/${id}`)
      .set({ Name: name }, { merge: true });
  }

  deleteTodoList(id: string) {
    return this.db.doc(`Lists/${id}`).delete();
  }

  /**  ToDo Item Functions  **/

  async createTodoItem(listId: string, title: string, description: string) {
    const user = await firstValueFrom(this.auth.user.pipe(take(1)));

    if (!user) {
      throw new Error('User is not logged in');
    }

    const item: ToDoListItem = {
      Id: this.db.createId(),
      ListId: listId,
      UserId: user.uid,
      Title: title,
      Description: description,
      Completed: false,
      CompletedOn: 0,
      CreatedOn: Date.now(),
    };

    return this.db
      .doc<ToDoListItem>(`Lists/${listId}/Item/${item.Id}`)
      .set(item);
  }

  getTodoListItems(listId: string) {
    return this.db
      .collection<ToDoListItem>(`Lists/${listId}/Items`)
      .valueChanges();
  }

  getTodoItem(listId: string, itemId: string) {
    return this.db.doc<ToDoListItem>(`Lists/${listId}/Items/${itemId}`);
  }

  updateToDoItem(item: Partial<ToDoListItem>) {
    if (!item.ListId) {
      throw new Error('Cannot update ToDo Item without the list id!');
    }

    if (!item.Id) {
      throw new Error('Cannot update ToDo Item without the item id!');
    }

    return this.db
      .doc<Partial<ToDoListItem>>(`Lists/${item.ListId}/Items/${item.Id}`)
      .set(item, { merge: true });
  }

  deleteToDoItem(listId: string, itemId: string) {
    return this.db.doc(`Lists/${listId}/Items/${itemId}`).delete();
  }
}
