import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ToDoList } from 'src/app/models';
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

  constructor(private auth: AuthService, private todoService: TodoService) {
    this.lists = todoService.getTodoLists();
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
      inputValidator: (value) => {
        if (!value) {
          return 'Please enter a valid list name';
        }
        return null;
      },
    });

    if (listName) await this.todoService.createTodoList(listName);
  }
}
