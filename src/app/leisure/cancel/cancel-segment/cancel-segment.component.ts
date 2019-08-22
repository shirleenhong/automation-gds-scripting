import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { SelectItem } from 'src/app/models/select-item.model';
import { PnrService } from 'src/app/service/pnr.service';
import { UtilHelper } from 'src/app/helper/util.helper';
import { validateSegmentNumbers, validatePassengerNumbers } from 'src/app/shared/validators/leisure.validators';


@Component({
  selector: 'app-cancel-segment',
  templateUrl: './cancel-segment.component.html',
  styleUrls: ['./cancel-segment.component.scss']
})
export class CancelSegmentComponent implements OnInit {
  cancelForm: FormGroup;
  reasonAcList: Array<SelectItem>;
  followUpOptionList: Array<SelectItem>;
  reasonUaList: Array<SelectItem>;
  cancelProcessList: Array<SelectItem>;
  relationshipList: Array<SelectItem>;
  reasonNonACCancelList: Array<SelectItem>;
  segments = [];
  isAC = false;
  isUA = false;
  isOthers = false;
  isACNonRef = false;
  isUANonRef = false;
  passengers = [];
  codeShareGroup: FormGroup;
  remove = false;
  add = true;
  acremove = false;
  acadd = true;
  headerRefund = 'Refund Commission Recall';
  isACPassive = false;

  constructor(private formBuilder: FormBuilder, private pnrService: PnrService, private utilHelper: UtilHelper) {
    this.cancelForm = new FormGroup({
      segments: new FormArray([]),
      requestor: new FormControl('', [Validators.required]),
      desc1: new FormControl('', [Validators.required]),
      desc2: new FormControl('', []),
      reasonACCancel: new FormControl('', []),
      reasonUACancel: new FormControl('', []),
      tickets: new FormArray([this.createFormGroup()]),
      airlineNo: new FormControl('', []),
      acTicketNo: new FormControl('', []),
      acFlightNo: new FormControl('', []),
      // accityPair: new FormControl('', []),
      // acdepDate: new FormControl('', []),
      relationship: new FormControl('', []),
      uasegNo: new FormControl('', [Validators.pattern('[0-9]+(,[0-9]+)*'), validateSegmentNumbers(this.segments)]),
      uaPassengerNo: new FormControl('', [Validators.pattern('[0-9]+(,[0-9]+)*'), validatePassengerNumbers(this.passengers)]),
      acpassengerNo: new FormControl('', []),
      cancelNonRefAC: new FormControl('', []),
      cancelNonRefUA: new FormControl('', []),
      cancelAll: new FormControl('', []),
      followUpOption: new FormControl('', []),
      acCancelMonth: new FormControl('', []),
      acCancelYear: new FormControl('', []),
      cancelProcess: new FormControl('', []),
      reasonNonACCancel: new FormControl('', []),
      actickets: new FormArray([this.createAcFormGroup()])
    });
  }

  private addCheckboxes() {
    let forchecking = true;
    if (this.segments.length > 1) {
      forchecking = false;
    }
    this.segments.map((_o, i) => {
      const control = new FormControl(i === 0 && forchecking); // if first item set to true, else false
      (this.cancelForm.controls.segments as FormArray).push(control);
    });
  }

  checkValid() {
    this.utilHelper.validateAllFields(this.cancelForm);
    if (!this.cancelForm.valid) {
      return false;
    }
    return true;
  }

  ngOnInit() {
    // this.codeShareGroup = this.formBuilder.group({
    //   tickets: this.formBuilder.array([this.createFormGroup()])
    // });
    this.loadStaticValue();
    this.getSegmentTatooValue();
    this.addCheckboxes();
    this.checkFirstSegment();
    this.getPassengers();
  }

  loadStaticValue() {
    this.reasonAcList = [
      { itemText: '', itemValue: '' },
      { itemText: '24 HOURS REFUND', itemValue: '4' },
      { itemText: 'DEATH OF PAX OR TRAVELLING COMPANION', itemValue: '5' },
      { itemText: 'IRROP: WILL REFUND PROCESS DUE IRROP', itemValue: '6' },
      { itemText: 'UNACCEPTABLE SCHEDULE CHANGE', itemValue: '9' },
      { itemText: 'UNACCEPTABLE DELAY GREATER THAN 2 HRS', itemValue: '10' },
      { itemText: 'JURY/MILITARY DUTY', itemValue: '11' },
      { itemText: 'VOLUNTARY CANCEL', itemValue: '7' },
      { itemText: 'AC FLIGHT NOT TICKETED YET', itemValue: '8' }
    ];

    if (this.isAC) {
      this.reasonAcList.push(
        { itemText: 'NAME CORRECTION NCC WITH OAL', itemValue: '1' },
        { itemText: 'NAME CORRECTION NCC LEGAL NAME WITH OAL', itemValue: '2' },
        { itemText: 'DUPLICATE TICKETS', itemValue: '3' });
    }

    this.reasonUaList = [
      { itemText: '', itemValue: '' },
      { itemText: '24 HOURS REFUND', itemValue: '1' },
      { itemText: 'VOLUNTARY CANCEL', itemValue: '2' },
      { itemText: 'UA FLIGHT NOT TICKETED YET', itemValue: '3' },
      { itemText: 'NON REFUNDABLE TICKET CANCELLED DUE TO IROP', itemValue: '4' },
      { itemText: 'NON REFUNDABLE TICKET CANCELLED DUE TO SCHEDULE CHANGE', itemValue: '5' }
    ];

    this.followUpOptionList = [
      { itemText: '', itemValue: '' },
      { itemText: 'BSP Queue for Refund', itemValue: 'BSP Queue' },
      { itemText: 'Non BSP Refund Recall Commission Request', itemValue: 'Non BSP Refund' },
      { itemText: 'Keep Ticket for Future Travel/Cancel Segments Only', itemValue: 'Keep Ticket' }
    ];

    this.cancelProcessList = [
      { itemText: '', itemValue: '' },
      { itemText: 'AC Flt(s) cancelled prior to script run', itemValue: 'PRIOR' },
      { itemText: 'AC Flt(s) were never booked in the PNR', itemValue: 'NEVER' }
    ];

    this.relationshipList = [
      { itemText: '', itemValue: '' },
      { itemText: 'FATHER', itemValue: 'FTHR' },
      { itemText: 'MOTHER', itemValue: 'MTHR' },
      { itemText: 'SISTER', itemValue: 'SIST' },
      { itemText: 'BROTHER', itemValue: 'BROT' },
      { itemText: 'GRANDMOTHER', itemValue: 'GMTH' },
      { itemText: 'GRANDFATHER', itemValue: 'GFTH' },
      { itemText: 'CHILD', itemValue: 'CHLD' },
      { itemText: 'GRANDCHILD', itemValue: 'GCHL' },
      { itemText: 'COMPANION', itemValue: 'COMP' },
    ];

    this.reasonNonACCancelList = [
      { itemText: 'NON REFUNDABLE TICKET CANCELLED DUE TO IROP', itemValue: 'IROP' },
      { itemText: 'NON REFUNDABLE TICKET CANCELLED DUE TO SCHEDULE CHANGE', itemValue: 'CHANGE' },
      { itemText: 'NONE OF THE ABOVE', itemValue: 'NONE' },
    ];
  }

  get f() {
    return this.cancelForm.controls;
  }

  getSegmentTatooValue() {
    const segmentDetails = this.pnrService.getSegmentTatooNumber();
    segmentDetails.forEach((element) => {
      if (segmentDetails.length > 0) {
        const details = {
          id: element.lineNo,
          name: element.longFreeText,
          status: element.status,
          segmentType: element.segmentType,
          airlineCode: element.airlineCode,
          flightNumber: element.flightNumber,
          departureDate: element.departureDate,
          cityCode: element.cityCode,
          arrivalAirport: element.arrivalAirport
        };
        this.segments.push(details);
      }
    });
    // return segments;
  }

  getPassengers() {
    this.passengers = this.pnrService.getPassengers();
  }

  submit() {
    // Filter out the unselected ids
    const checkSegment = [];
    const selectedPreferences = this.cancelForm.value.segments
      .map((checked, index) => (checked ? this.segments[index].id : null))
      .filter((value) => value !== null);
    selectedPreferences.forEach((element) => {
      const look = this.segments.find((x) => x.id === element);
      if (look) {
        const textLine = {
          lineNo: look.id,
          segmentType: look.segmentType
        };
        checkSegment.push(textLine);
      }
    });
    return checkSegment;
  }

  checkSegmentAirline() {
    this.isAC = false;
    this.isUA = false;
    this.isOthers = false;
    // this.cancelForm.controls['cancelNonRefAC'].setValue(false);
    if (this.reasonAcList.length > 9) {
      this.reasonAcList.splice(9, 3);
    }

    this.enableFormControls(
      [
        'acFlightNo',
        'relationship'
      ],
      true
    );
    this.enableFormControls(
      ['reasonUACancel', 'uasegNo', 'uaPassengerNo'],
      true
    );
    const selectedPreferences = this.cancelForm.value.segments
      .map((checked, index) => (checked ? this.segments[index].id : null))
      .filter((value) => value !== null);

    if (selectedPreferences.length === 0) {
      this.isOthers = true;
    }

    selectedPreferences.forEach((element) => {
      const look = this.segments.find((x) => x.id === element);
      if (look) {
        if (look.airlineCode === 'AC') {
          this.isAC = true;
          if ((this.cancelForm.controls.reasonUACancel.value !== '4' || this.cancelForm.controls.reasonUACancel.value !== '5')
            && (this.cancelForm.controls.reasonNonACCancel.value !== 'IROP'
              && this.cancelForm.controls.reasonNonACCancel.value !== 'CHANGE')) {
            this.enableFormControls(['airlineNo'], true);
          }
          this.reasonAcList.push(
            { itemText: 'NAME CORRECTION NCC WITH OAL', itemValue: '1' },
            { itemText: 'NAME CORRECTION NCC LEGAL NAME WITH OAL', itemValue: '2' },
            { itemText: 'DUPLICATE TICKETS', itemValue: '3' });
          if (
            this.cancelForm.value.reasonACCancel === '' ||
            this.cancelForm.value.reasonACCancel === undefined
          ) {
            this.cancelForm.controls.acFlightNo.setValue('');
            this.cancelForm.controls.relationship.setValue('');
          } else {
            this.acChange(this.cancelForm.value.reasonACCancel);
          }
        }
        if (look.airlineCode === 'UA') {
          this.isUA = true;
          this.enableFormControls(['reasonUACancel'], false);
          if (this.cancelForm.value.reasonUACancel === '' || this.cancelForm.value.reasonUACancel === undefined) {
            // this.cancelForm.controls['reasonUACancel'].setValue('');
            this.cancelForm.controls.uasegNo.setValue('');
            this.cancelForm.controls.uaPassengerNo.setValue('');
          } else {
            this.uaChange(this.cancelForm.value.reasonUACancel);
          }
          this.defaultSegment();
        }
        if (look.airlineCode !== 'UA' && look.airlineCode !== 'AC') {
          this.isOthers = true;
          if (this.cancelForm.value.reasonUACancel) {
            this.cancelForm.controls.airlineNo.setValue('');
          } else {
            this.acChange(this.cancelForm.value.reasonACCancel);
          }
        }
      }
    });
    this.loadStaticValue();
  }

  checkFirstSegment() {
    if (this.reasonAcList.length > 9) {
      this.reasonAcList.splice(9, 3);
    }

    this.enableFormControls(['acFlightNo', 'relationship'], true);
    this.enableFormControls(['reasonUACancel', 'uasegNo', 'uaPassengerNo'], true);
    if (this.segments.length === 1 && this.segments[0].segmentType) {
      if (this.segments[0].airlineCode === 'AC') {
        this.isAC = true;
        this.reasonAcList.push({ itemText: 'NAME CORRECTION NCC WITH OAL', itemValue: '1' },
          { itemText: 'NAME CORRECTION NCC LEGAL NAME WITH OAL', itemValue: '2' },
          { itemText: 'DUPLICATE TICKETS', itemValue: '3' });
      }
      if (this.segments.length === 1 && this.segments[0].airlineCode === 'UA') {
        this.isUA = true;
        this.enableFormControls(['reasonUACancel'], false);
      }
      if (this.segments[0].airlineCode !== 'AC' && this.segments[0].airlineCode !== 'UA') {
        this.isOthers = true;
      }
    }
    this.remove = false;
    this.add = true;
    this.loadStaticValue();
  }

  acChange(newValue) {
    switch (newValue) {
      case '1':
      case '2':
      case '3':
        this.enableFormControls(['acFlightNo', 'relationship', 'acCancelMonth', 'acCancelYear'], true);
        break;
      case '4':
        this.enableFormControls(
          ['acFlightNo', 'relationship', 'acCancelMonth', 'acCancelYear'],
          true
        );
        break;
      case '5':
        this.enableFormControls(['relationship'], false);
        this.enableFormControls(
          ['acFlightNo', 'acCancelMonth', 'acCancelYear'],
          true
        );
        break;
      case '6':
      case '9':
      case '10':
        this.enableFormControls(['acFlightNo'], false);
        this.enableFormControls(
          ['relationship', 'acCancelMonth', 'acCancelYear'],
          true
        );
        break;
      case '11':
        this.enableFormControls(['acCancelMonth', 'acCancelYear'], false);
        this.enableFormControls(
          ['relationship', 'acFlightNo'],
          true
        );
        break;
      default:
        this.enableFormControls(
          ['acFlightNo', 'relationship', 'acCancelMonth', 'acCancelYear'],
          true
        );
        break;
    }
    this.checkAcTicketPassenger(newValue);
    this.defaultControls();
    this.resetAcTicket(newValue);
  }

  checkAcTicketPassenger(newValue) {
    const arr = this.cancelForm.get('actickets') as FormArray;

    if ((newValue === '1' || newValue === '2' || newValue === '3') && (this.isAC)) {
      for (const c of arr.controls) {
        c.get('acTicketNo').enable();
        c.get('acpassengerNo').enable();
        c.get('acTicketNo').setValidators([Validators.required]);
        c.get('acpassengerNo').setValidators([Validators.required]);
        c.get('acTicketNo').updateValueAndValidity();
        c.get('acpassengerNo').updateValueAndValidity();
      }
    } else {
      for (const c of arr.controls) {
        c.get('acTicketNo').clearValidators();
        c.get('acpassengerNo').clearValidators();
        c.get('acTicketNo').disable();
        c.get('acpassengerNo').disable();
        c.get('acTicketNo').updateValueAndValidity();
        c.get('acpassengerNo').updateValueAndValidity();

      }
    }
  }

  defaultControls() {
    let acCount = 0;
    let controlsArr = [];
    const pass = this.getPassengerNo();

    const selectedPreferences = this.cancelForm.value.segments
      .map((checked, index) => (checked ? this.segments[index].id : null))
      .filter((value) => value !== null);
    selectedPreferences.forEach((element) => {
      const look = this.segments.find((x) => x.id === element);
      if (look) {
        if (look.airlineCode === 'AC') {
          acCount = acCount + 1;
          controlsArr = [
            { control: 'acFlightNo', controlvalue: look.flightNumber },
            { control: 'acpassengerNo', controlvalue: pass }
          ];
        }
      }
    });

    this.initializeControl(controlsArr);
  }

  private getPassengerNo() {
    const passenger = this.pnrService.getPassengers();
    let pass = '';
    if (passenger.length === 1) {
      pass = '1';
    }
    return pass;
  }

  initializeControl(controls: any) {
    const acControls = ['acFlightNo', 'relationship'];
    acControls.forEach((ac) => {
      this.cancelForm.get(ac).setValue('');
    });
    controls.forEach((c) => {
      this.cancelForm.get(c.control).setValue(c.controlvalue);
    });
  }

  defaultSegment() {
    let ua = '';
    const selectedPreferences = this.cancelForm.value.segments
      .map((checked, index) => (checked ? this.segments[index].id : null))
      .filter((value) => value !== null);
    selectedPreferences.forEach((element) => {
      const look = this.segments.find((x) => x.id === element);
      if (look) {
        if (look.airlineCode === 'UA') {
          ua = ua + ',' + look.id;
        }
      }
    });

    this.cancelForm.controls.uasegNo.setValue(ua.substr(1));
  }

  uaChange(newValue) {
    if (this.cancelForm.controls.reasonNonACCancel.value !== 'IROP' && this.cancelForm.controls.reasonNonACCancel.value !== 'CHANGE') {
      this.enableFormControls(['airlineNo'], true);
    }

    switch (newValue) {
      case '1':
        this.enableFormControls(['uasegNo', 'uaPassengerNo'], false);
        this.defaultSegment();
        this.cancelForm.controls.uaPassengerNo.setValue(this.getPassengerNo());
        break;
      case '4':
      case '5':
        this.enableFormControls(['airlineNo'], false);
      default:
        this.enableFormControls(['uasegNo', 'uaPassengerNo'], true);
        break;
    }
  }

  enableFormControls(controls: string[], disabled: boolean) {
    controls.forEach((c) => {
      if (disabled) {
        this.cancelForm.get(c).disable();
      } else {
        this.cancelForm.get(c).enable();
        this.cancelForm.get(c).setValidators(Validators.required);
        this.cancelForm.get(c).updateValueAndValidity();
      }
    });
  }

  createFormGroup(): FormGroup {
    const group = this.formBuilder.group({
      ticket: new FormControl('', []),
      coupon: new FormControl('', [])
    });

    return group;
  }

  createAcFormGroup(): FormGroup {
    const group = this.formBuilder.group({
      acTicketNo: new FormControl('', []),
      acpassengerNo: new FormControl('', [])
    });

    return group;
  }

  resetAcTicket(acReasonCode) {
    if ((acReasonCode === '1' || acReasonCode === '2' || acReasonCode === '3') && (this.isAC)) {
      const items = this.cancelForm.controls.tickets as FormArray;
      const acitems = this.cancelForm.controls.actickets as FormArray;

      while (items.length) {
        items.removeAt(0);
      }
      while (acitems.length) {
        acitems.removeAt(0);
      }

      items.push(this.createFormGroup());
      acitems.push(this.createAcFormGroup());
    }
  }

  addTicketCoupon() {
    const items = this.cancelForm.controls.tickets as FormArray;
    items.push(this.createFormGroup());
    if (items.length < 6) {
      this.add = true;
      this.remove = true;
    } else {
      this.add = false;
    }
    // this.total = items.length;
  }

  removeTicketCoupon(i) {
    const items = this.cancelForm.controls.tickets as FormArray;
    items.removeAt(i);
    if (items.length > 1) {
      this.remove = true;
    } else {
      this.remove = false;
    }
    // this.total = items.length;
  }

  addAcTicket() {
    const items = this.cancelForm.controls.actickets as FormArray;
    items.push(this.createAcFormGroup());
    if (items.length > 1) {
      this.acremove = true;
    }
    this.checkAcTicketPassenger('1');
    this.addTicketCoupon();
  }

  removeAcTicket(i) {
    const items = this.cancelForm.controls.actickets as FormArray;
    items.removeAt(i);
    if (items.length > 1) {
      this.acremove = true;
    } else {
      this.acremove = false;
    }
    this.checkAcTicketPassenger('1');
    this.removeTicketCoupon(i);
  }

  acTicketChange(ticketValue, i) {
    const items = this.cancelForm.controls.tickets as FormArray;
    const fgTicket = items.controls[i] as FormGroup;
    fgTicket.controls.ticket.setValue(ticketValue);
  }

  cancelAll(checkValue) {
    const segment = this.cancelForm.controls.segments as FormArray;
    segment.controls.forEach((element) => {
      element.setValue(checkValue);
    });
    this.checkSegmentAirline();
  }

  changefollowUpOption(followUp) {
    if (followUp === 'Keep Ticket' || followUp === 'Non BSP Refund') {
      this.enableFormControls(
        ['acFlightNo', 'relationship', 'reasonACCancel', 'reasonACCancel',
          'reasonUACancel', 'uasegNo', 'uaPassengerNo', 'tickets'],
        true
      );
      this.checkAcTicketPassenger('');
    } else {
      this.enableFormControls(
        ['acFlightNo', 'relationship', 'reasonACCancel', 'reasonACCancel', 'tickets'],
        false
      );
      this.checkAcTicketPassenger(this.cancelForm.controls.reasonACCancel.value);
    }
    this.headerRefund = 'Non BSP Refund Commission Recall';
  }

  changeCancelCheck(option) {
    if (option === 'NEVER') {
      this.enableFormControls(
        ['acFlightNo', 'relationship', 'acCancelMonth', 'acCancelYear', 'reasonACCancel'],
        true
      );
    } else if (!this.isAC) {
      this.enableFormControls(
        ['reasonACCancel'],
        false
      );
    }
  }

  onchangeNonAcReasonCancel(nonAcValue) {

    if (this.cancelForm.controls.reasonUACancel.value !== '4' && this.cancelForm.controls.reasonUACancel.value !== '5') {
      this.enableFormControls(['airlineNo'], true);
    }

    if (nonAcValue !== 'NONE') {
      this.enableFormControls(['airlineNo'], false);
    }
  }
}