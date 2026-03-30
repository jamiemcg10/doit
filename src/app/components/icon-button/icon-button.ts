import { Component, EventEmitter, input } from '@angular/core';

@Component({
  templateUrl: './icon-button.html',
  selector: 'icon-button',
  styleUrl: 'icon-button.css',
})
export class IconButton {
  colorMap = {
    delete: '#ef9c9c',
    settings: 'lightgray',
    calendar_month: 'lightblue',
    add: 'blue',
  };
  onClick = new EventEmitter<Event>();
  icon = input<'delete' | 'settings' | 'add' | 'calendar_month'>();
}
