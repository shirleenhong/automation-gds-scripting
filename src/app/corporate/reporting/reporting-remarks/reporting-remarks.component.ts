import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SelectItem } from 'src/app/models/select-item.model';
import { PnrService } from 'src/app/service/pnr.service';
import { DDBService } from 'src/app/service/ddb.service';
import { FormControl, Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { ReportingViewModel } from 'src/app/models/reporting-view.model';
import { ReasonCode } from 'src/app/models/ddb/reason-code.model';

import { CounselorDetail } from 'src/app/globals/counselor-identity';
import { ObtComponent } from '../obt/obt.component';

@Component({
  selector: 'app-reporting-remarks',
  templateUrl: './reporting-remarks.component.html',
  styleUrls: ['./reporting-remarks.component.scss']
})
export class ReportingRemarksComponent implements OnInit {
  bspRouteCodeList: SelectItem[];
  isTripTypeCorporate = false;
  reportingForm: FormGroup;
  destinations: Array<any>;
  nonBspDestinations: Array<any>;
  segments: any[];
  showSegments = false;
  ebCList: Array<ReasonCode> = [];
  showEBDetails: boolean;
  isCorporate = false;

  ebRList: { itemValue: string; itemText: string }[];
  @ViewChild(ObtComponent) obtComponent: ObtComponent;
  @Input() reportingRemarksView = new ReportingViewModel();
  constructor(
    private pnrService: PnrService,
    private ddbService: DDBService,
    private fb: FormBuilder,
    private counselorDetail: CounselorDetail
  ) {
    this.destinations = pnrService.getPnrDestinations();
  }

  async loadData(): Promise<void> {}
  async ngOnInit() {
    this.reportingForm = new FormGroup({
      bspRouteCode: new FormControl('', [Validators.required]),
      segments: this.fb.array([])
    });

    this.bspRoutingCodeProcess();

    await this.loadData();
    const tstSegments = await this.pnrService.getTstSegments();
    const allSegments = this.pnrService
      .getSegmentList()
      .map((segment) => segment.lineNo)
      .map((segment) => segment);
    const nonTstSegments = allSegments.filter((s) => !tstSegments.includes(s));
    this.segments = tstSegments.concat(nonTstSegments);

    for (const segment of this.segments) {
      this.showSegments = true;
      const group = this.createFormGroup(segment);
      (this.reportingForm.get('segments') as FormArray).push(group);
    }
    this.isCorporate = this.counselorDetail.getIsCorporate();
  }
  bspRoutingCodeProcess() {
    if (this.checkTripType()) {
      this.isTripTypeCorporate = true;
      this.getRouteCodes();
      this.reportingRemarksView.tripType = 1;
    }
  }
  getCountryDest(item) {
    this.reportingRemarksView.routeCode = item;
  }
  checkTripType(): boolean {
    const rmElements = this.pnrService.pnrObj.rmElements;
    for (const rmElement of rmElements) {
      if (rmElement.category === '*' && rmElement.freeFlowText.indexOf('CF/-') > -1) {
        const lastLetter = rmElement.freeFlowText.substr(-1);
        if (lastLetter === 'C') {
          return true;
        }
      }
    }
    return false;
  }
  getRouteCodes() {
    this.bspRouteCodeList = this.ddbService.getRouteCodeList();
  }
  createFormGroup(segmentNo) {
    const val = this.getDestinationValue(segmentNo);
    return this.fb.group({
      segment: new FormControl(segmentNo),
      destinationList: new FormControl(val, [Validators.required])
    });
  }

  enableFormControls(controls: string[], disabled: boolean) {
    controls.forEach((c) => {
      if (disabled) {
        this.reportingForm.get(c).disable();
        this.reportingForm.get(c).reset();
      } else {
        this.reportingForm.get(c).enable();
      }
    });
  }

  getDestinationValue(segmentNo): string {
    let val: string;
    for (const air of this.pnrService.pnrObj.airSegments) {
      if (air.elementNumber === segmentNo) {
        val = air.arrivalAirport;
      }
    }
    for (const car of this.pnrService.pnrObj.auxCarSegments) {
      if (car.elementNumber === segmentNo) {
        val = car.fullNode.travelProduct.boardpointDetail.cityCode;
      }
    }

    for (const hotel of this.pnrService.pnrObj.auxHotelSegments) {
      if (hotel.elementNumber === segmentNo) {
        val = hotel.fullNode.travelProduct.boardpointDetail.cityCode;
      }
    }

    for (const misc of this.pnrService.pnrObj.miscSegments) {
      if (misc.elementNumber === segmentNo) {
        val = misc.fullNode.travelProduct.boardpointDetail.cityCode;
      }
    }
    return val;
  }
}
