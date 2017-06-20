import { Component } from '@angular/core';

import { MePage } from '../me/me';
import { CommunityPage } from '../community/community';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = CommunityPage;
  tab2Root = HomePage;
  tab3Root = MePage;

  constructor() {

  }
}
