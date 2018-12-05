import { Component, OnInit } from '@angular/core';
import {GitBranchService} from '../../services/git-branch.service';
import {GitLogService} from '../../services/git-log.service';

@Component({
  selector: 'app-header-async-panel',
  templateUrl: './header-async-panel.component.html',
  styleUrls: ['./header-async-panel.component.less']
})
export class HeaderAsyncPanelComponent implements OnInit {

  constructor(
      public gitBranchService: GitBranchService,
      public gitLogService: GitLogService,
  ) { }

  ngOnInit() {
  }

}
