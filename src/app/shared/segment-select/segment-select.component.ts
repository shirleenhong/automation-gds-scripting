import { Component, OnInit, forwardRef, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, FormControl, FormBuilder, FormGroup, Validators, Validator } from '@angular/forms';
import { PnrService } from 'src/app/service/pnr.service';
import { BsDropdownConfig } from 'ngx-bootstrap';

@Component({
  selector: 'app-segment-select',
  templateUrl: './segment-select.component.html',
  styleUrls: ['./segment-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SegmentSelectComponent),
      multi: true
    },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => SegmentSelectComponent), multi: true },
    /// { provide: BsDropdownConfig, useValue: { autoClose: false } }
  ]
})
export class SegmentSelectComponent implements OnInit, ControlValueAccessor, Validator {

  val = '';
  segmentGroup: FormGroup;
  segmentList = [];
  segmentSelected = [];


  propagateChange: any = () => { };
  validateFn: any = () => { };
  onTouched: any = () => { };
  onChange: any = () => { };



  writeValue(obj: any): void {
    this.segmentGroup.get('segment').setValue(obj);
    this.val = obj;



  }


  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void { this.onTouched = fn; }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.segmentGroup.get('segment').disable();
    } else {
      this.segmentGroup.get('segment').enable();
    }

  }



  validate(c: FormControl) {
      
    return this.validateFn(c);
  }

  constructor(private fb: FormBuilder, private pnrService: PnrService) {
    this.segmentGroup = fb.group({
      segment: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.segmentList = this.pnrService.getSegmentTatooNumber();
    this.segmentGroup.get('segment').markAsDirty();
  }

  get value() {
    return this.val;
  }

  set value(val) {
    this.val = val;
    this.onChange(val);
    this.onTouched();
    this.segmentGroup.get('segment').markAsDirty();
  }

  updateValue(val) {
    const newVal = (val.currentTarget.value);
    const isChecked = val.currentTarget.checked;

    if (isChecked) {
      this.segmentSelected.push(newVal);
    } else {
      this.segmentSelected.splice(this.segmentSelected.indexOf(newVal), 1);
    }

    this.value = this.segmentSelected.join(',');
    this.segmentGroup.get('segment').setValue(this.val);
  }
}