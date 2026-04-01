import { Component, input } from '@angular/core';

@Component({
  templateUrl: './icon-button.html',
  selector: 'icon-button',
  styleUrl: 'icon-button.css',
})
export class IconButton {
  colorMap = {
    check: 'lightgreen',
    close: '#ef9c9c',
    delete: '#ef9c9c',
    settings: 'lightslategray',
    calendar_month: 'white',
    add: 'royalblue',
    arrow_back_2: 'white',
    play_arrow: 'white',
    edit: '#f4f48c',
    move_item: 'lightblue',
  };
  size = input<'small' | 'large'>('small');
  style = input<Record<string, string>>();
  icon = input<
    | 'add'
    | 'arrow_back_2'
    | 'calendar_month'
    | 'check'
    | 'close'
    | 'delete'
    | 'edit'
    | 'move_item'
    | 'play_arrow'
    | 'settings'
  >();
}
