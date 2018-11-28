import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {ComponentsService} from '../services/components.service';
@Component({
  selector: 'app-search',
  templateUrl: `./search.component.html`,
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Output() selected: EventEmitter<any> = new EventEmitter();

  constructor(
    private _componentsService: ComponentsService,
  ) { }

  ngOnInit() {
  }

  search(keyWord: string): void {
    this.selected.emit(keyWord);
  }

}
