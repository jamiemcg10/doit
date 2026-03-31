import { Component, input } from '@angular/core';
import { IconButton } from '../icon-button/icon-button';

// move/find
interface Todo {
  name: string;
  completed: boolean;
  id: string | number; // dunno what this is
}

@Component({
  templateUrl: './todo-item.html',
  selector: 'todo-item',
  imports: [IconButton],
})
export class TodoItem {
  item = input.required<Todo>();
}
