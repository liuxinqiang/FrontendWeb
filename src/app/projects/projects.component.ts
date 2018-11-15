import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './projects.component.html'
})
export class ProjectsComponent implements OnInit {
  public message: string;

  users: number[] = [];

  constructor(private title: Title) {}

  ngOnInit() {
    this.message = 'Hello';
    this.title.setTitle('项目管理');
  }
  sayHello() {
    TopUI.notification('Hello!');
  }
}
