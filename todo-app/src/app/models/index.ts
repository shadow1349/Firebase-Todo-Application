export interface User {
  Id: string;
  Email: string;
  ProfilePhoto: string;
  ListCount: number;
  CreatedOn: number;
}

export interface ToDoList {
  Id: string;
  UserId: string;
  Count: number;
  Name: string;
  CreatedOn: number;
}

export interface ToDoListItem {
  Id: string;
  ListId: string;
  UserId: string;
  Title: string;
  Description: string;
  Completed: boolean;
  CompletedOn: number;
  CreatedOn: number;
}
