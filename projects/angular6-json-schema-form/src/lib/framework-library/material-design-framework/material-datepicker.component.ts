import {Component, Inject, Input, OnInit, Optional} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonSchemaFormService } from '../../json-schema-form.service';
import { dateToString, stringToDate } from '../../shared';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MAT_LABEL_GLOBAL_OPTIONS } from '@angular/material';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'material-datepicker-widget',
  template: `
    <mat-form-field [appearance]="options?.appearance || matFormFieldDefaultOptions?.appearance || 'standard'"
                    [class]="options?.htmlClass || ''"
                    [floatLabel]="options?.floatLabel || matLabelGlobalOptions?.float || (options?.notitle ? 'never' : 'auto')"
                    [hideRequiredMarker]="options?.hideRequired ? 'true' : 'false'"
                    [style.width]="'100%'">
      <mat-label *ngIf="!options?.notitle">{{options?.title}}</mat-label>
      <span matPrefix *ngIf="options?.prefix || options?.fieldAddonLeft"
        [innerHTML]="options?.prefix || options?.fieldAddonLeft"></span>
        <input matInput *ngIf="boundControl"
        [formControl]="formControl"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [attr.list]="'control' + layoutNode?._id + 'Autocomplete'"
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [id]="'control' + layoutNode?._id"
        [max]="options?.maximum"
        [matDatepicker]="picker"
        [min]="options?.minimum"
        [name]="controlName"
        [placeholder]="options?.title"
        [readonly]="options?.readonly"
        [required]="options?.required"
        [style.width]="'100%'"
        (blur)="options.showErrors = true"
        (dateChange)="updateValue($event)"
        (dateInput)="updateValue($event)">
      <input matInput *ngIf="!boundControl"
        [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
        [attr.list]="'control' + layoutNode?._id + 'Autocomplete'"
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [disabled]="controlDisabled || options?.readonly"
        [id]="'control' + layoutNode?._id"
        [max]="options?.maximum"
        [matDatepicker]="picker"
        [min]="options?.minimum"
        [name]="controlName"
        [placeholder]="options?.title"
        [required]="options?.required"
        [style.width]="'100%'"
        [readonly]="options?.readonly"
        (blur)="options.showErrors = true"
        (dateChange)="updateValue($event)"
        (dateInput)="updateValue($event)">
      <span matSuffix *ngIf="options?.suffix || options?.fieldAddonRight"
        [innerHTML]="options?.suffix || options?.fieldAddonRight"></span>
      <mat-hint *ngIf="options?.description && (!options?.showErrors || !options?.errorMessage)"
        align="end" [innerHTML]="options?.description"></mat-hint>
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
    </mat-form-field>
    <mat-datepicker #picker ></mat-datepicker>
    <mat-error *ngIf="options?.showErrors && options?.errorMessage"
      [innerHTML]="options?.errorMessage"></mat-error>`,
  styles: [`
    mat-error { font-size: 75%; margin-top: -1rem; margin-bottom: 0.5rem; }
    ::ng-deep json-schema-form mat-form-field .mat-form-field-wrapper .mat-form-field-flex
      .mat-form-field-infix { width: initial; }
  `],
})
export class MaterialDatepickerComponent implements OnInit {
  formControl: AbstractControl;
  controlName: string;
  controlValue: any;
  dateValue: any;
  controlDisabled = false;
  boundControl = false;
  options: any;
  autoCompleteList: string[] = [];
  @Input() layoutNode: any;
  @Input() layoutIndex: number[];
  @Input() dataIndex: number[];

  constructor(
    @Inject(MAT_FORM_FIELD_DEFAULT_OPTIONS) @Optional() public matFormFieldDefaultOptions,
    @Inject(MAT_LABEL_GLOBAL_OPTIONS) @Optional() public matLabelGlobalOptions,
    private jsf: JsonSchemaFormService
  ) { }

  ngOnInit() {
    this.options = this.layoutNode.options || {};
    this.jsf.initializeControl(this, !this.options.readonly);
    if (this.controlValue) { this.setDate(dateToString(new Date(this.controlValue))); }
    if (!this.options.notitle && !this.options.description && this.options.placeholder) {
      this.options.description = this.options.placeholder;
    }
  }

  updateValue(event: MatDatepickerInputEvent<Date> ) {
    this.options.showErrors = true;
    if (event.value) { this.setDate(dateToString(event.value)); }
  }

  setDate(date: string) {
    this.formControl.setValue(date, this.options);
  }

}
