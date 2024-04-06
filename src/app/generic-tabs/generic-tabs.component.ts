import {Component, ContentChildren, QueryList, AfterContentInit} from '@angular/core';

import {GenericTabComponent} from './generic-tab.component';

@Component({
  selector: 'app-generic-tabs',
  templateUrl: './generic-tabs.component.html',
  styleUrls: ['./generic-tabs.component.css'],
})
export class GenericTabsComponent implements AfterContentInit {
  @ContentChildren(GenericTabComponent) tabs: QueryList<GenericTabComponent>;

  ngAfterContentInit() {
    // Selects first tab when no other tab is selected.
    this.selectFirstTab();
    this.tabs.changes.subscribe(() => {
      this.selectFirstTab();
    });
  }

  /**
   * Sets active to the select tab and inactive to the other tabs.
   * @param tab Tab to be selected.
   */
  selectTab(tab: GenericTabComponent) {
    this.tabs.forEach(tab => tab.active = false);
    tab.active = true;
  }

  private selectFirstTab(): void {
    if (this.tabs) {
      let activeTabs = this.tabs.filter((tab) => tab.active);
      if (this.tabs.length && activeTabs.length === 0) {
        setTimeout(() => this.tabs.first.active = true);
      }
    }
  }
}
