import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import * as selectOptionsModel from './models/select-options.model';

@Component({
  selector: 'app-select-options',
  templateUrl: './select-options.component.html',
  styleUrls: ['./select-options.component.scss']
})
export class SelectOptionsComponent implements OnInit, AfterViewInit {

  @Input() optionList: selectOptionsModel.ISelectOption[] = []
  @Input() callback: Function = () => {}

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    document.dispatchEvent(new Event('selectInitialization'));
    this.callback('category', null, document)
  }

}
