import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { ToDoList, ToDoListItem } from 'src/app/models';
import { TodoService } from 'src/app/services/todo/todo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  id: Observable<string>;
  todoItems: Observable<ToDoListItem[]>;
  todoList: Observable<ToDoList | undefined>;

  newItemControl = new FormControl('');

  constructor(private route: ActivatedRoute, private todoService: TodoService) {
    this.id = this.route.params.pipe(map((params) => params['id']));

    this.todoList = this.id.pipe(
      switchMap((id) => this.todoService.getTodoList(id))
    );

    this.todoItems = this.id.pipe(
      switchMap((id) => this.todoService.getTodoListItems(id))
    );
  }

  ngOnInit(): void {}

  onKeyUp(event: KeyboardEvent, id: string) {
    if (event.key.toLowerCase() === 'enter') {
      this.todoService.createTodoItem(id, this.newItemControl.value, '');
      this.newItemControl.setValue('');
    }
  }

  checkboxChange(event: MatCheckboxChange, item: ToDoListItem) {
    item.Completed = event.checked;

    this.todoService.updateToDoItem(item);
  }

  async deleteItem(itemName: string, itemId: string, listId: string) {
    const result = await Swal.fire({
      title: `Are you sure you want to delete ${itemName}?`,
      text: 'This will delete your todo item permanently',
      showCancelButton: true,
      confirmButtonColor: 'red',
      icon: 'question',
    });

    if (result.isConfirmed) {
      await this.todoService.deleteToDoItem(listId, itemId);
      Swal.fire(
        `${itemName} successfully deleted`,
        'Your todo item was deleted successfully',
        'success'
      );
    }
  }

  trackBy(index: number, item: ToDoListItem) {
    return item.Id;
  }
}
