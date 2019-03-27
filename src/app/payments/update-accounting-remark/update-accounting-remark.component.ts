import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatrixAccountingModel } from 'src/app/models/pnr/matrix-accounting.model';

import { SelectItem } from 'src/app/models/select-item.model';
import { PnrService } from 'src/app/service/pnr.service';
import { DDBService } from 'src/app/service/ddb.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { PaymentRemarkHelper } from 'src/app/helper/payment-helper';


@Component({
  selector: 'app-update-accounting-remark',
  templateUrl: './update-accounting-remark.component.html',
  styleUrls: ['./update-accounting-remark.component.scss']
})
export class UpdateAccountingRemarkComponent implements OnInit {

  title: string;

  @Input()
  accountingRemarks: MatrixAccountingModel;

  // // TODO: Via service
  accountingRemarkList: Array<SelectItem>;
  formOfPaymentList: Array<SelectItem>;
  bspList: Array<SelectItem>;
  vendorCodeList: Array<SelectItem>;
  supplierCodeList: Array<any>;
  filterSupplierCodeList: Array<any>;
  passengerList: Array<any>;

  matrixAccountingForm: FormGroup;
  isSubmitted: boolean;
  // PaymentModeList: Array<SelectItem>;

  // @ViewChild('bankAccount') bankAccEl: ElementRef;

  constructor(public activeModal: BsModalService, private pnrService: PnrService,
    public modalRef: BsModalRef, private ddbService: DDBService,
    private paymentHelper: PaymentRemarkHelper) {
    this.accountingRemarkList = new Array<SelectItem>();
    this.formOfPaymentList = new Array<SelectItem>();
    this.accountingRemarks = new MatrixAccountingModel();
    this.loadBSPList();
    this.loadVendorCode();
    this.loadPassengerList();
    this.matrixAccountingForm = new FormGroup({
      accountingTypeRemark: new FormControl('', [Validators.required]),
      segmentNo: new FormControl('', [Validators.required, Validators.pattern('[0-9]+(,[0-9]+)*')]),
      supplierCodeName: new FormControl('', [Validators.required, Validators.maxLength(3)]),
      passengerNo: new FormControl('', [Validators.required]),
      supplierConfirmatioNo: new FormControl('', [Validators.required, Validators.maxLength(20)]),
      baseAmount: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+\\.[0-9][0-9]$')]),
      commisionWithoutTax: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+\\.[0-9][0-9]$')]),
      gst: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+\\.[0-9][0-9]$')]),
      hst: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+\\.[0-9][0-9]$')]),
      qst: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+\\.[0-9][0-9]$')]),
      otherTax: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+\\.[0-9][0-9]$')]),
      fop: new FormControl('', [Validators.required]),
      vendorCode: new FormControl('', [Validators.required]),
      cardNumber: new FormControl('', [Validators.required]),
      expDate: new FormControl('', [Validators.required]),
      tktLine: new FormControl('', [Validators.maxLength(10), Validators.pattern('[0-9]*')]),
      description: new FormControl('', [Validators.required]),
      bsp: new FormControl('', [Validators.required])
    }, { updateOn: 'blur' });

  }

  ngOnInit() {

    //  this.passengerList = this.pnrService.getPassengers();
    //  this.passengerList.push({fullname: 'All',  id:'ALL'})
    this.supplierCodeList = this.ddbService.getSupplierCode();
  }

  IsBSP(testvalue) {
    if (testvalue === '1') {
      this.loadAccountingRemarkList(testvalue);
      this.loadFormOfPaymentList(testvalue);
      this.enableFormControls(['tktLine', 'otherTax', 'commisionWithoutTax'], false);
      this.enableFormControls(['description'], true);
      this.accountingRemarks.bsp = '1';
    } else {
      this.loadAccountingRemarkList(testvalue);
      this.loadFormOfPaymentList(testvalue);
      this.enableFormControls(['tktLine', 'otherTax', 'commisionWithoutTax'], true);
      this.enableFormControls(['description'], false);
      this.accountingRemarks.bsp = '2';
    }
    // return true;
  }

  loadBSPList() {
    this.bspList = [{ itemText: '', itemValue: '' },
    { itemText: 'NO', itemValue: '1' },
    { itemText: 'YES', itemValue: '2' }];
  }

  loadPassengerList() {
    this.passengerList = [{ itemText: '', itemValue: '' },
    { itemText: 'ALL Passenger', itemValue: 'ALL' },
    { itemText: 'PER Passenger', itemValue: 'PER' }];
  }

  loadFormOfPaymentList(testvalue) {
    if (testvalue === '1') {
      this.formOfPaymentList = [{ itemText: '', itemValue: '' },
      { itemText: 'Credit Card', itemValue: 'CC' },
      { itemText: 'Cash', itemValue: 'CA' },
      { itemText: 'Cheque', itemValue: 'CK' },
      { itemText: 'Agency Plastic Card', itemValue: 'ACC' }
      ];
    } else {
      this.formOfPaymentList = [{ itemText: '', itemValue: '' },
      { itemText: 'Credit Card', itemValue: 'CC' },
      { itemText: 'Agency Plastic Card', itemValue: 'ACC' },
      { itemText: 'RBC Points', itemValue: 'CK' }
      ];
    }

  }

  loadVendorCode() {
    this.vendorCodeList = [{ itemText: '', itemValue: '' },
    { itemText: 'VI- Visa', itemValue: 'VI' },
    { itemText: 'MC - Mastercard', itemValue: 'MC' },
    { itemText: 'AX - American Express', itemValue: 'AX' },
    { itemText: 'DI -Diners', itemValue: 'DC' }
    ];
  }

  loadAccountingRemarkList(testvalue) {

    if (testvalue === '1') {
      this.accountingRemarkList = [{ itemText: '', itemValue: '' },
      { itemText: 'Tour Accounting Remark  ', itemValue: '12' },
      { itemText: 'Cruise Accounting Remark', itemValue: '5' },
      { itemText: 'NonBSP Air Accounting Remark', itemValue: '1' },
      { itemText: 'Rail Accounting Remark', itemValue: '4' },
      { itemText: 'Limo Accounting Remark', itemValue: '6' }
      ];
    } else {
      this.accountingRemarkList = [{ itemText: '', itemValue: '' },
      { itemText: 'SEAT COSTS', itemValue: 'SEAT COSTS' },
      { itemText: 'MAPLE LEAF LOUNGE COSTS', itemValue: 'MMAPLE LEAF LOUNGE COSTS' },
      { itemText: 'PET TRANSPORTATION', itemValue: 'PET TRANSPORTATION' },
      { itemText: 'FREIGHT COSTS', itemValue: 'FREIGHT COSTS' },
      { itemText: 'BAGGAGE FEES', itemValue: 'BAGGAGE FEES' },
      { itemText: 'FOOD COSTS', itemValue: 'FOOD COSTS' },
      { itemText: 'OTHER COSTS', itemValue: 'OTHER COSTS' }
      ];
    }
  }

  filterSupplierCode(typeCode) {
    this.filterSupplierCodeList = this.supplierCodeList.filter(
      supplier => supplier.type === typeCode);

    if (this.accountingRemarks.bsp === '2') {
      this.assignSupplierCode(typeCode);
      this.assignDescription(typeCode);
    } else {
      this.accountingRemarks.supplierCodeName = '';
    }
  }

  private assignDescription(typeCode: any) {
    if (typeCode === 'OTHER COSTS') {
      this.accountingRemarks.description = '';
      this.matrixAccountingForm.controls.description.enable();
      this.matrixAccountingForm.controls.description.setValidators(Validators.required);
    } else {
      this.accountingRemarks.description = typeCode;
      this.matrixAccountingForm.controls.description.disable();
    }
  }

  private assignSupplierCode(typeCode: any) {
    if (typeCode === 'SEAT COSTS') {
      this.accountingRemarks.supplierCodeName = 'PFS';
    } else {
      this.accountingRemarks.supplierCodeName = 'CGO';
    }
  }

  // get PaymentType() { return PaymentType; }

  FormOfPaymentChange(newValue) {

    switch (newValue) {
      case 'CC':
        this.enableFormControls(['cardNumber', 'expDate', 'vendorCode'], false);
        break;
      default:
        this.enableFormControls(['cardNumber', 'expDate', 'vendorCode'], true);
        break;
    }
  }

  enableFormControls(controls: string[], disabled: boolean) {
    controls.forEach(c => {
      if (disabled) {
        this.matrixAccountingForm.get(c).disable();
      } else {
        this.matrixAccountingForm.get(c).enable();
      }
    });
  }


  get f() { return this.matrixAccountingForm.controls; }

  saveAccounting() {

    if (this.matrixAccountingForm.invalid) {
      alert('Please Complete And Complete all the required Information');
      this.isSubmitted = false;
      return;
    }
    this.isSubmitted = true;
    this.modalRef.hide();
  }


  getAllErrors(form: FormGroup | FormArray): { [key: string]: any; } | null {
    let hasError = false;
    const result = Object.keys(this.matrixAccountingForm.controls).reduce((acc, key) => {
      const control = this.matrixAccountingForm.get(key);

      const errors = (control instanceof FormGroup || control instanceof FormArray)
        ? this.getAllErrors(control)
        : (control.touched ? control.errors : '');
      if (errors) {
        acc[key] = errors;
        hasError = true;
      }
      return acc;
    }, {} as { [key: string]: any; });
    return hasError ? result : null;
  }

  creditcardMaxValidator(newValue) {
    let pattern = '';
    pattern = this.paymentHelper.creditcardMaxValidator(newValue);
    this.matrixAccountingForm.controls.cardNumber.setValidators(Validators.pattern(pattern));
  }

  checkDate(newValue) {
    const valid = this.paymentHelper.checkDate(newValue);

    if (!valid) {
      this.matrixAccountingForm.controls.expDate.setValidators(Validators.pattern('^[0-9]{14,16}$'));
    } else {
      this.matrixAccountingForm.controls.expDate.setValidators(Validators.pattern('.*'));
    }

  }

  SetTktNumber(supValue) {
    const supCode = ['ACY', 'SOA', 'WJ3'];

    if (this.accountingRemarks.accountingTypeRemark === '1' && supCode.includes(supValue)) {
      this.matrixAccountingForm.controls.tktLine.setValidators(Validators.required);
    } else {
      this.matrixAccountingForm.controls.tktLine.clearValidators();
    }

    this.matrixAccountingForm.get('tktLine').updateValueAndValidity();
  }
}