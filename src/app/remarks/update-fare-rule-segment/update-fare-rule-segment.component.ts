import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { PnrService } from 'src/app/service/pnr.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { SelectItem } from 'src/app/models/select-item.model';
import { DDBService } from 'src/app/service/ddb.service';
import { SegmentService } from 'src/app/service/segment.service';
import { FareRuleModel } from 'src/app/models/pnr/fare-rule.model';


declare var smartScriptSession: any;
@Component({
  selector: 'app-update-fare-rule-segment',
  templateUrl: './update-fare-rule-segment.component.html',
  styleUrls: ['./update-fare-rule-segment.component.scss']
})

export class UpdateFareRuleSegmentComponent implements OnInit {
  @Input()
  fareRules: FareRuleModel;

  title: string;
  isSubmitted: boolean;
  fareRuleForm: FormGroup;
  fareRuleList: Array<SelectItem>;
  items: FormArray;
  itemCityPair: FormArray;
  segmentList: Array<number>;
  bspCurrencyList: SelectItem[];
  airlines: Array<SelectItem>;
  showOptionalFare: boolean;
  showCrypticForm: boolean;
  ShowFareRule: boolean;
  //  OID: string;
  tempFareRuleType: string;

  constructor(private fb: FormBuilder, public activeModal: BsModalService, private pnrService: PnrService,
    // tslint:disable-next-line:align
    public modalRef: BsModalRef, private ddb: DDBService, private segmentService: SegmentService) {
    this.fareRules = new FareRuleModel();
    this.fareRules.mode = 'rbTicket';
  }

  ngOnInit() {
    this.fareRuleForm = this.fb.group({
      segmentNum: new FormControl(''),
      airlineCode: new FormControl(''),
      cityPair: new FormControl(''),
      //itemCityPair: this.fb.array([this.createCityPairs()]),
      checkInWith: new FormControl(''),
      fareRuleList: new FormControl(''),
      isTicketNonRefundable: new FormControl(''),
      isTicketMinMax: new FormControl(''),
      isTicketNonRef: new FormControl(''),
      ticketAmount: new FormControl(''),
      currencyType: new FormControl(''),
      nonRefundable: new FormControl(''),
      minChangeFee: new FormControl(''),
      rbNonRefundable: new FormControl(''),
      rbTicket: new FormControl(''),
      mode: new FormControl(''),
      items: this.fb.array([this.createItem('')])
    });
    this.loadFareRule();
    this.loadSegmentList();
    this.fareRuleForm.controls.fareRuleList.patchValue('S');
    this.getCurrencies();
    this.loadAirlines();
    this.showCrypticForm = true;
    this.showOptionalFare = false;
    this.ShowFareRule = false;
    //    this.fareRules.mode = true;

    this.fareRuleForm.controls.ticketAmount.enable();
    this.fareRuleForm.controls.nonRefundable.disable();
    this.getOID();
    this.fareRules.isTicketMinMax = false;
    this.fareRules.isTicketNonRef = false;
    this.fareRules.isTicketNonRefundable = false;
    this.fareRules.mode = 'rbTicket';
  }

  loadModel() {
    if (this.fareRules.fareRuleType === '') {
      this.ShowFareRule = false;
    } else {
      this.tempFareRuleType = this.fareRules.fareRuleType;
      this.executeCryptic(this.fareRules.segmentNo.toString());
    }

    if (this.ShowFareRule === true) {
      this.showOptionalFare = false;
    } else {
      this.showCrypticForm = false;
      this.showOptionalFare = true;
      this.fareRules.mode = 'rbTicket';
      this.fareRules.fareRuleType = '';
    }
    this.loadRemarks();
  }

  createItem(value: string): FormGroup {
    return this.fb.group({
      remarkText: value
    });
  }

  // createCityPairs(): FormGroup {
  //   return this.fb.group({
  //     cityPair: ''
  //   });
  // }

  loadSegmentList(): void {
    this.segmentList = this.pnrService.getPassiveAirSegmentNumbers();
  }

  checkChanged() {

    if (this.fareRules.mode === 'rbTicket') {
      this.fareRuleForm.controls.ticketAmount.enable();
      this.fareRuleForm.controls.nonRefundable.disable();
    } else {
      this.fareRuleForm.controls.ticketAmount.disable();
      this.fareRuleForm.controls.nonRefundable.enable();
    }

  }

  addCityPair(): void {
    this.itemCityPair = this.fareRuleForm.get('itemCityPair') as FormArray;
    // this.itemCityPair.push(this.createCityPairs());
  }

  removeCityPair(i: number): void {
    const control = this.itemCityPair;
    control.removeAt(i);
  }

  addItem(): void {
    this.items = this.fareRuleForm.get('items') as FormArray;
    this.items.push(this.createItem(''));
  }

  removeInputField(i: number): void {
    const control = this.items;
    control.removeAt(i);
  }

  loadAirlines(): void {
    this.airlines = this.pnrService.getPassiveAirSegments('');
  }

  loadFareRule(): void {
    this.fareRuleList = [{ itemText: 'SELECT FARE RULE', itemValue: 'S' },
    ];
  }

  getCurrencies(): void {
    // TODO: Get from API DDB
    this.bspCurrencyList = this.ddb.getCurrencies();
  }

  getOID(): void {
    const response = smartScriptSession.send('jd').then(res => {
      const output = res.Response.split('         ');
      //      this.OID = output[1];
      this.fareRules.oid = output[1];
    });
  }

  executeCryptic(lineNo: string): void {

    const airline = this.pnrService.getPassiveAirSegments(lineNo);
    this.fareRuleList = [];
    if (airline !== undefined) {
      this.ShowFareRule = false;
      this.fareRules.airlineCode = airline[0].airlineCode;

      const response = smartScriptSession.send('PDN/' + this.fareRules.oid + '/' + airline[0].airlineCode + ' RULES').then(res => {
        const output = res.Response.toString().split('-------')[1].split('       ');

        output.forEach(element => {
          if (element.indexOf('RM') > -1) {
            const outputTwo = element.replace('RM', '').replace('S', '').replace(airline[0].airlineCode, '').split('       ');

            this.fareRuleList.push({ itemText: airline[0].airlineCode + ' ' + outputTwo[1], itemValue: outputTwo[1] });
            this.ShowFareRule = true;
            this.showCrypticForm = true;
            this.showOptionalFare = false;
          }
        });

        // need to store the temp value of fareRuleType and rebind it after cryptic call.
        if (this.tempFareRuleType !== undefined) {
          this.fareRules.fareRuleType = this.tempFareRuleType;
        }
      });

    }

    if (this.ShowFareRule === true) {
      this.showOptionalFare = false;
    } else {
      this.showCrypticForm = false;
      this.showOptionalFare = true;
      this.fareRules.mode = 'rbTicket';
      this.fareRules.fareRuleType = '';
    }
  }

  executeFareRuleCryptic(fareRule: string) {
    if (fareRule.indexOf('SELECT') === -1) {
      smartScriptSession.send('PBN/' + this.fareRules.oid + '/' + this.fareRules.airlineCode + ' ' + fareRule + '*');
    }
  }

  enableDisableBasedOnMinMax() {
    if (this.fareRuleForm.controls.isTicketMinMax.value &&
      !this.fareRuleForm.controls.isTicketNonRefundable.value &&
      !this.fareRuleForm.controls.isTicketNonRef.value) {
      this.fareRuleForm.controls.currencyType.disable();
      this.fareRuleForm.controls.ticketAmount.disable();
      this.fareRuleForm.controls.nonRefundable.disable();
      this.fareRuleForm.controls.minChangeFee.disable();
    } else {
      this.fareRuleForm.controls.currencyType.enable();
      this.fareRuleForm.controls.ticketAmount.enable();
      this.fareRuleForm.controls.nonRefundable.enable();
      this.fareRuleForm.controls.minChangeFee.enable();
      this.checkChanged();
    }
  }

  saveFareRule(): void {
    this.fareRules.remark = this.fareRuleForm.controls.items;
    this.isSubmitted = true;
    this.modalRef.hide();
  }

  loadRemarks(): void {
    for (const fg of this.fareRules.remark.controls) {
      if (fg instanceof FormGroup) {
        this.items = this.fareRuleForm.get('items') as FormArray;
        this.items.push(this.createItem(fg.controls.remarkText.value));
      }
    }

    // need to remove the extra textbox as a workaround.
    this.removeInputField(0);
  }
}