import { Component, OnInit, Input } from '@angular/core';
import { SelectItem } from 'src/app/models/select-item.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { PassiveSegmentsModel } from 'src/app/models/pnr/passive-segments.model';
import { PnrService } from 'src/app/service/pnr.service';
import { DDBService } from 'src/app/service/ddb.service';

@Component({
  selector: 'app-update-segment',
  templateUrl: './update-segment.component.html',
  styleUrls: ['./update-segment.component.scss']
})
export class UpdateSegmentComponent implements OnInit {

  @Input()
  passiveSegments: PassiveSegmentsModel;

  mealPlanList: Array<SelectItem>;
  roomTypeList: Array<SelectItem>;
  segmentTypeList: Array<SelectItem>;
  stateRoomList: Array<SelectItem>;
  arrivaldayList: Array<SelectItem>;
  segmentForm: FormGroup;
  isSubmitted: boolean;
  supplierCodeList: Array<any>;
  lblvendorName: any;
  lblvendorCode: any;
  lblconfirmationNo: any;
  lbldepartureDate: any;
  lbldepartureTime: any;
  lbldepartureCity: any;
  lbldestinationCity: any;
  lblarrivalDate: any;
  lblarrivalTime: any;
  lbltourName: any;
  lblnoPeople: any;
  lblnoNights: any;
  passengers = [];

  constructor(public activeModal: BsModalService, private pnrService: PnrService, private modalRef: BsModalRef, private ddbService: DDBService) {
    this.passiveSegments = new PassiveSegmentsModel();
    this.supplierCodeList = this.ddbService.getSupplierCode();
    this.segmentForm = new FormGroup({
      segmentType: new FormControl('', [Validators.required]),
      vendorName: new FormControl('', [Validators.required]),
      vendorCode: new FormControl('', [Validators.required]),
      confirmationNo: new FormControl('', [Validators.required]),
      departureDate: new FormControl('', [Validators.required]),
      departureTime: new FormControl('', [Validators.required]),
      departureCity: new FormControl('', [Validators.required]),
      destinationCity: new FormControl('', [Validators.required]),
      arrivalDate: new FormControl('', [Validators.required]),
      arrivalTime: new FormControl('', [Validators.required]),
      tourName: new FormControl('', [Validators.required]),
      noPeople: new FormControl('', [Validators.required]),
      noNights: new FormControl('', [Validators.required]),
      roomType: new FormControl('', []),
      mealPlan: new FormControl('', []),
      stateRoom: new FormControl('', []),
      cabinNo: new FormControl('', []),
      dining: new FormControl('', [Validators.required]),
      policyNo: new FormControl('', [Validators.required]),
      airlineCode: new FormControl('', [Validators.required]),
      flightNumber: new FormControl('', [Validators.required]),
      classService: new FormControl('', [Validators.required]),
      arrivalday: new FormControl('', []),
      airlineRecloc: new FormControl('', []),
      othersText: new FormControl('', [Validators.required])
    });

    this.loadMealPlan();
    this.loadRoomType();
    this.loadSegmentType();
    this.loadStateRoom();
    this.getPassengers();
    this.loadArrivalDay();
  }

  ngOnInit() {
    this.changeControlLabel(this.passiveSegments.segmentType);
  }

  saveSegment() {
    if (this.segmentForm.invalid) {
      alert('Please Complete And Complete all the required Information');
      this.isSubmitted = false;
      return;
    }
    // this.assignToModel();
    this.isSubmitted = true;
    this.modalRef.hide();
  }

  loadMealPlan() {
    this.mealPlanList = [{ itemText: '', itemValue: '' },
    { itemText: 'All Inclusive', itemValue: 'ALL INCLUSIVE' },
    { itemText: 'American Plan', itemValue: 'AMERICAN PLAN' }];
  }

  loadRoomType() {
    this.roomTypeList = [{ itemText: '', itemValue: '' },
    { itemText: 'SGLB', itemValue: 'SGLB' },
    { itemText: 'DBLB', itemValue: 'DBLB' },
    { itemText: 'TRPL', itemValue: 'TRPL' }];
  }

  loadArrivalDay() {
    this.arrivaldayList = [{ itemText: '', itemValue: '' },
    { itemText: '+1', itemValue: '+1' },
    { itemText: '+2', itemValue: '+2' }];
  }


  loadSegmentType() {
    this.segmentTypeList = [{ itemText: '', itemValue: '' },
    { itemText: 'Air', itemValue: 'AIR' },
    { itemText: 'Cruise', itemValue: 'SEA' },
    { itemText: 'Insurance', itemValue: 'INS' },
    { itemText: 'Tour', itemValue: 'TOR' }];
  }

  loadStateRoom() {
    this.stateRoomList = [{ itemText: '', itemValue: '' },
    { itemText: 'Stateroom Guarantee', itemValue: 'STATEROOM GUARANTEE' },
    { itemText: 'Interior', itemValue: 'INTERIOR' },
    { itemText: 'Ocean View', itemValue: 'OCEAN VIEW' },
    { itemText: 'Stateroom with Balcony', itemValue: 'STATEROOM WITH BALCONY' },
    { itemText: 'Suite', itemValue: 'SUITE' },
    { itemText: 'Other', itemValue: 'OTHER' }];
  }

  getPassengers() {
    this.passengers = this.pnrService.getPassengers();
    this.segmentForm.controls.noPeople.patchValue(this.passengers.length);

  }

  changeControlLabel(type) {
    switch (type) {
      case 'AIR':
        this.lbldepartureDate = 'Departure Date';
        this.lbldepartureTime = 'Departure Time';
        this.lbldepartureCity = 'Departure City Code';
        this.lbldestinationCity = 'Arrival City Code';
        this.lblarrivalDate = 'Arrival Date';
        this.lblarrivalTime = 'Arrival Time';
        this.enableFormControls(['vendorName', 'vendorCode', 'confirmationNo',
          'tourName', 'stateRoom', 'cabinNo', 'dining', 'noNights', 'roomType', 'mealPlan', 'policyNo', 'noPeople', 'othersText'], true);
        this.enableFormControls(['departureDate', 'departureCity', 'arrivalDate', 'departureTime', 'destinationCity',
          'arrivalTime', 'airlineCode', 'flightNumber', 'classService', 'arrivalday', 'airlineRecloc'], false);
      case 'TOR':
        this.lblvendorName = 'Vendor Name';
        this.lblvendorCode = 'Vendor Code';
        this.lblconfirmationNo = 'Confirmation Number';
        this.lbldepartureDate = 'Departure Date';
        this.lbldepartureTime = 'Departure Time';
        this.lbldepartureCity = 'Departure City Code';
        this.lbldestinationCity = 'Destination City Code';
        this.lblarrivalDate = 'Arrival Date';
        this.lblarrivalTime = 'Arrival Time';
        this.lbltourName = 'Tour Name or Hotel Name';
        this.lblnoPeople = 'Number of People';
        this.lblnoNights = 'Number of Nights';
        this.enableFormControls(['stateRoom', 'cabinNo', 'dining', 'policyNo', 'airlineCode', 'flightNumber',
          'classService', 'arrivalday', 'airlineRecloc', 'othersText'], true);
        this.enableFormControls(['vendorName', 'vendorCode', 'confirmationNo', 'departureDate',
          'departureTime', 'departureCity', 'destinationCity', 'arrivalDate',
          'arrivalTime', 'tourName', 'noPeople', 'noNights', 'roomType', 'mealPlan'], false);
        break;
      case 'SEA':
        this.lblvendorName = 'Cruise Line';
        this.lblvendorCode = 'Vendor Code';
        this.lblconfirmationNo = 'Confirmation Number';
        this.lbldepartureDate = 'Sailing Date';
        this.lbldepartureTime = 'Departure Time';
        this.lbldepartureCity = 'Embarkation City Code';
        this.lbldestinationCity = 'Debarkation City Code';
        this.lblarrivalDate = 'Arrival Date';
        this.lblarrivalTime = 'Arrival Time';
        this.lbltourName = 'Name of Ship';
        this.lblnoPeople = 'Number of People';
        this.lblnoNights = 'Number of Nights';
        this.enableFormControls(['roomType', 'mealPlan', 'policyNo', 'airlineCode', 'flightNumber',
          'classService', 'arrivalday', 'airlineRecloc', 'othersText'], true);
        this.enableFormControls(['vendorName', 'vendorCode', 'confirmationNo', 'departureDate',
          'departureTime', 'departureCity', 'destinationCity', 'arrivalDate',
          'arrivalTime', 'tourName', 'noPeople', 'stateRoom', 'cabinNo', 'dining', 'noNights'], false);
        break;
      case 'INS':
        this.lbldepartureDate = 'Departure Date';
        this.lbldepartureCity = 'Departure City';
        this.lblarrivalDate = 'Return Date';
        this.lblnoPeople = 'Number of Passengers';
        this.enableFormControls(['vendorName', 'vendorCode', 'confirmationNo', 'departureTime', 'destinationCity',
          'arrivalTime', 'tourName', 'stateRoom', 'cabinNo', 'dining', 'noNights', 'roomType', 'mealPlan',
          'airlineCode', 'flightNumber', 'classService', 'arrivalday', 'airlineRecloc', 'othersText'], true);
        this.enableFormControls(['policyNo', 'departureDate', 'departureCity', 'arrivalDate', 'noPeople'], false);
        break;
      default:
        break;
    }
  }


  enableFormControls(controls: string[], disabled: boolean) {
    controls.forEach(c => {
      if (disabled) {
        this.segmentForm.get(c).disable();
      } else {
        this.segmentForm.get(c).enable();
        // this.segmentForm.get(c).setValidators(Validators.required);
        // this.segmentForm.get(c).updateValueAndValidity();
      }
    });

  }


  onChangeSegmentType(type) {
    this.changeControlLabel(type);
  }

  checkDate(tempdate, tempname) {
    const now = new Date();
    const tempdate2 = new Date(tempdate);
    if (tempdate2 < now) {
      this.segmentForm.get(tempname).setErrors({ incorrect: true });
    } else {
      if (this.segmentForm.controls.arrivalDate.value !== undefined && this.segmentForm.controls.departureDate.value !== undefined) {
        const depdate = new Date(this.segmentForm.controls.departureDate.value);
        const arrDate = new Date(this.segmentForm.controls.arrivalDate.value);

        if (depdate > arrDate) {
          this.segmentForm.get(tempname).setErrors({ incorrect: true });
          return;
        }
      }
      this.segmentForm.get(tempname).setErrors(null);
    }
  }


  onChangeStateRoom(type) {
    debugger;
    if (type === 'OTHER') {
      this.segmentForm.controls.othersText.enable();
      this.segmentForm.controls.othersText.setValidators(Validators.required);
      this.segmentForm.controls.othersText.updateValueAndValidity();
    }
  }
}
