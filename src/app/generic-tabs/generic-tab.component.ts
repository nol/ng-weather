import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-generic-tab',
  styles: [
    `
    .tab-pane {
      padding: 1em;
      border: 1px solid #ddd;
    }
  `
  ],
  template: `
    <div [hidden]="!active" class="tab-pane">
      <ng-content></ng-content>
    </div>
  `
})
export class GenericTabComponent {
  @Input('tabTitle') title: string;
  @Input('tabActive') active = false;
  @Output('tabClose') closed = new EventEmitter();

  closeTab() {
    this.closed.emit();
  }
}
