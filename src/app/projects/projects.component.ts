import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {
  public message: string;

  users: number[] = [];

  ngOnInit() {
    this.message = 'Hello';
  }
  sayHello() {
    TopUI.notification('Hello!');
  }
}
