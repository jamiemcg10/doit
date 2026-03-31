import { Component, input, inject } from '@angular/core';
import { IconButton } from '../icon-button/icon-button';
import { DBService } from '../../services/DBService';

// move/find
interface Todo {
  name: string;
  completed: boolean;
  id: number;
}

@Component({
  templateUrl: './todo-item.html',
  selector: 'todo-item',
  imports: [IconButton],
})
export class TodoItem {
  dbService = inject(DBService);
  item = input.required<Todo>();

  deleteItem() {
    console.log('deleting item', this.item().name, this.item().id);
    console.log(typeof this.item().id);
    this.dbService.deleteItem(this.item().id);
  }
}
