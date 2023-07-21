import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.less']
})
export class TreeComponent {
  @Input() tree: any;
  @Output() selectedNode: EventEmitter<number> = new EventEmitter();

  setInfo(event: any) {
    this.selectedNode.emit(event);
    if (event instanceof MouseEvent) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

}
