import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ToDoList, User } from 'src/app/models';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TodoService } from 'src/app/services/todo/todo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  lists: Observable<ToDoList[]>;
  user: Observable<User | undefined>;

  constructor(private auth: AuthService, private todoService: TodoService) {
    this.lists = todoService.getTodoLists();

    this.user = this.auth.getUser();
  }

  ngOnInit(): void {}

  logout() {
    this.auth.logout();
  }

  async createList() {
    const { value: listName } = await Swal.fire({
      title: 'Enter the ToDo list name',
      input: 'text',
      inputLabel: 'List name',
      showCancelButton: true,
      cancelButtonColor: 'red',
      inputValidator: (value) => {
        if (!value) {
          return 'Please enter a valid list name';
        }
        return null;
      },
    });

    if (listName) await this.todoService.createTodoList(listName);
  }

  async deleteList(id: string, name: string) {
    const result = await Swal.fire({
      title: `Are you sure you want to delete ${name}?`,
      text: 'Deleting your list will also delete all todo items in the list as well',
      showCancelButton: true,
      confirmButtonColor: 'red',
      confirmButtonText: "I'm sure, delete it",
      icon: 'question',
    });

    if (result.isConfirmed) {
      await this.todoService.deleteTodoList(id);

      Swal.fire(
        'List Deleted',
        'Your list was deleted successfully',
        'success'
      );
    }
  }
}
