import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  OnChanges,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
import { SelectItem } from '../models/select-item.model';
import { PnrService } from '../service/pnr.service';
import { RemarkModel } from '../models/pnr/remark.model';
import { ReportingViewModel } from '../models/reporting-view.model';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl
} from '@angular/forms';
import { DDBService } from '../service/ddb.service';
@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})
export class ReportingComponent implements OnInit, AfterViewInit, OnChanges {
  @Input()
  reportingView: ReportingViewModel;
  bspRouteCodeList: SelectItem[];
  destinationList: Array<any>;
  remarkList: Array<RemarkModel>;
  reportingForm: FormGroup;
  enableReason = false;
  enableInsurance = false;
  countryList: Array<string>;
  isCVC = false;

  constructor(private pnrService: PnrService, private ddbService: DDBService) { 

  }
  get f() { return this.reportingForm.controls; }

  ngOnChanges(changes: SimpleChanges) { }

  ngOnInit() {
    this.reportingForm = new FormGroup({
      bspRouteCode: new FormControl('', [Validators.required]),
      companyName: new FormControl('', [Validators.required]),
      destinationList: new FormControl('', [Validators.required]),
      u86: new FormControl('', [Validators.required]),
      showInsuranceYes: new FormControl('', []),
      showInsuranceNo: new FormControl('', []),
      insuranceDeclinedReason: new FormControl('', [Validators.required])
    });
    this.getRouteCodes();
    this.getPnrCFLine();
    this.getDestination();
    this.countryList = [
      '',
      'GHANA',
      'NIGERIA',
      'PAKISTAN',
      'JOHANNESBURG-SOUTH AFRICA',
      'NONE OF THE ABOVE'
    ];

  }

  isRbmRbp() {
    if (this.reportingView.cfLine === null) { return false; }
    return ((this.reportingView.cfLine.cfa === 'RBM' || this.reportingView.cfLine.cfa === 'RBP'));

  }

  enableDisbleControls(ctrls: string[], isDisabled: boolean) {
    ctrls.forEach(x => {
      if (isDisabled) {
        this.reportingForm.get(x).disable();
      } else {
        this.reportingForm.get(x).enable();
      }
    });
  }


  getRouteCodes() {
    this.bspRouteCodeList = this.ddbService.getRouteCodeList();
  }

  getDestination() {
    this.destinationList = this.pnrService.getPnrDestinations();
  }

  checkDestination() {
    if (this.destinationList !== undefined && this.destinationList.length <= 1) {
      this.reportingView.isDisabledDest = true;
    } else {
      this.reportingView.isDisabledDest = false;
    }
  }

  checkInsurance() {
    if (this.pnrService.getRemarkLineNumber('U12/-') === '') {
      this.enableDisbleControls(['insuranceDeclinedReason'], false);
      return false;
    } else {
      this.enableDisbleControls(['insuranceDeclinedReason'], true);
      return true;
    }
  }

  getPnrCFLine() {
    this.reportingView.cfLine = this.pnrService.getCFLine();

    if (this.reportingView.cfLine != null) {
      if (this.reportingView.cfLine.code !== '') {
        if (this.reportingView.cfLine.lastLetter === 'N') {
          this.reportingView.tripType = 2;
        } else if (this.reportingView.cfLine.lastLetter === 'C') {
          this.reportingView.tripType = 1;
        }
        if (this.reportingView.cfLine.cfa === 'RBM' || this.reportingView.cfLine.cfa === 'RBP') {
          this.reportingView.tripType = 2;
        }
        this.reportingView.isDisabled = false;

        this.checkDestination();
        this.isCVC = (this.reportingView.cfLine.cfa === 'CVC');

      } else {
        this.reportingView.isDisabledDest = true;
        this.reportingView.isDisabled = true;
      }
    }
  }
}
