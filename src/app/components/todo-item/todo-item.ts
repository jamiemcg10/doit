import { Component, input, inject, signal, computed } from '@angular/core';
import { IconButton } from '../icon-button/icon-button';
import { DBService } from '../../services/DBService';
import { Todo } from '../../types';
import { FormsModule } from '@angular/forms';
@Component({
  templateUrl: './todo-item.html',
  selector: 'todo-item',
  imports: [IconButton, FormsModule],
})
export class TodoItem {
  dbService = inject(DBService);
  item = input.required<Todo>();
  newName = '';

  editing = false;

  setEditing() {
    this.newName = this.item().name;
    this.editing = true;
  }

  saveName() {
    if (this.item().id) {
      this.dbService.updateItem({ ...this.item(), name: this.newName });
      this.item().name = this.newName;
      this.editing = false;
    }
  }

  cancelEdit() {
    this.editing = false;
  }

  // TODO: make sure this actually works on device
  toggleComplete() {
    console.log('toggling complete');
    this.dbService.toggleItemComplete(this.item());
  }

  deleteItem(event: PointerEvent) {
    console.log('deleting item', this.item().name, this.item().id);
    console.log(typeof this.item().id);
    event.preventDefault(); // hopefully stops double click event from being fired
    this.dbService.deleteItem(this.item().id);
  }
}
