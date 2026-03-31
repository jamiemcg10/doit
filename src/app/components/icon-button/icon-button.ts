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
    arrow_back_2: 'white',
    play_arrow: 'white',
    edit: 'yellow',
    move_item: 'white',
  };
  onClick = new EventEmitter<Event>();
  style = input<Record<string, string>>();
  icon = input<
    | 'add'
    | 'arrow_back_2'
    | 'calendar_month'
    | 'delete'
    | 'edit'
    | 'move_item'
    | 'play_arrow'
    | 'settings'
  >();
}
