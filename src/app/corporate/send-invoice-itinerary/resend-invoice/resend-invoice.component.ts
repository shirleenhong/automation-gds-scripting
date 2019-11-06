import { Component, OnInit } from '@angular/core';
import { PnrService } from 'src/app/service/pnr.service';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { InvoiceRemarkService } from 'src/app/service/corporate/invoice-remark.service';
import { DDBService } from 'src/app/service/ddb.service';
@Component({
  selector: 'app-resend-invoice',
  templateUrl: './resend-invoice.component.html',
  styleUrls: ['./resend-invoice.component.scss']
})
export class ResendInvoiceComponent implements OnInit {
  invoiceFormGroup: FormGroup;
  constructor(private pnrService: PnrService,
              private invoiceRmkService: InvoiceRemarkService,
              private formBuilder: FormBuilder,
              private ddbService: DDBService) { }
  showSegments = false;
  showInvoiceList = false;
  selectedElementsUI = {
    selectedSegments: '',
    selectedInvoice: '',
    selectedETickets: '',
    selectedFeeLines: '',
    selectedNonBspLines: ''
  };
  invoiceList = [];
  feeAccountingList = [];
  feeRemarks = [];
  nonBspRemarks = [];
  nonBspAccountingList = [];
  eTicketsList = [];
  remove = false;
  add = true;
  listEmail: Array<string>;
  invoiceGroup: FormGroup;
  ngOnInit() {
    this.invoiceFormGroup = new FormGroup({
      segmentNo: new FormControl('', []),
      invoiceNo: new FormControl('', [Validators.required]),
      eTicketNo: new FormControl('', [Validators.required]),
      feesAccountingNo: new FormControl('', [Validators.required, Validators.pattern('[0-9]+(,[0-9]+)*')]),
      nonBspAccountingNo: new FormControl('', [Validators.required, Validators.pattern('[0-9]+(,[0-9]+)*')]),
      emailAddresses: new FormArray([this.createFormGroup()]),
    });
    this.resendInvoiceProcess();
  }
  async resendInvoiceProcess() {
    await this.getInvoicesFromPNR();
    await this.getAllETickets();
    this.feeRemarks = this.getFeeAccountingLines();
    this.nonBspRemarks = this.getNonBspAccountingLines();
    this.listEmail = this.pnrService.getEmailAddressesFromGds();
  }
  async getInvoicesFromPNR() {
    const fiElements = this.pnrService.pnrObj.fiElements;
    if (fiElements.length > 0) {
      const selectAllObj = {
        lineNo: 'All',
        freeText: 'Select All',
        isChecked: false
      };
      this.invoiceList.push(selectAllObj);
      this.addInvoicesToList(fiElements);
    } else {
      await this.invoiceProcess();
    }
  }
  async invoiceProcess() {
    const invCommand = 'INV/ZX/RT';
    await this.invoiceRmkService.sendINVCommand(invCommand);
    const rtfRes = await this.invoiceRmkService.sendRTFCommand();
    const invoiceElements = this.invoiceRmkService.getInvoiceElements(rtfRes);
    if (invoiceElements.length > 0) {
      this.showInvoiceList = true;
      this.addInvoiceFromGDS(invoiceElements);
    } else {
      this.showSegments = true;
    }
  }
  async getAllETickets() {
    const rttnCmd = 'RTTN/H';
    const rttnResponse = await this.invoiceRmkService.sendINVCommand(rttnCmd);
    const eTickets = this.invoiceRmkService.getAllTickets(rttnResponse);
    this.makeETicketsListUI(eTickets);
    console.log(eTickets);
  }
  addInvoiceFromGDS(invoiceElements) {
    const selectAllObj = {
      lineNo: 'All',
      freeText: 'Select All',
      isChecked: false
    };
    this.invoiceList.push(selectAllObj);
    for (const ele of invoiceElements) {
        const invoiceObj = this.invoiceRmkService.getInvoiceDetails(ele);
        this.invoiceList.push(invoiceObj);
    }
  }
  addInvoicesToList(fiElements) {
    const regex = /PAX|INF|INS|CHD/g;
    for (const fiElement of fiElements) {
      const invoiceObj = {
        lineNo: '',
        freeText: '',
        isChecked: false
      };
      let freeText = fiElement.fullNode.otherDataFreetext.longFreetext;
      const match = freeText.match(regex);
      if (match && match[0]) {
        freeText = freeText.replace(match[0], '').trim();
      }
      invoiceObj.lineNo = fiElement.elementNumber;
      invoiceObj.freeText = freeText;
      this.invoiceList.push(invoiceObj);
    }
  }
  createFormGroup(): FormGroup {
    const group = this.formBuilder.group({
      emailAddress: new FormControl('',
        [Validators.required, Validators.pattern('^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[A-Z0-9.-]+?\\.[A-Z]{2,3}$')])
    });
    return group;
  }
  removeItems(i, type) {
    let items;
    switch (type) {
      case 'email':
        items = this.invoiceFormGroup.controls.emailAddresses as FormArray;
        items.removeAt(i);
        if (items.length > 1) {
          this.remove = true;
        } else {
          this.remove = false;
        }
        break;
      default:
        break;
    }
  }
  addItems(type) {
    let items;
    switch (type) {
      case 'email':
        items = this.invoiceFormGroup.controls.emailAddresses as FormArray;
        items.push(this.createFormGroup());
        if (items.length < 6) {
          this.add = true;
          this.remove = true;
        } else {
          this.add = false;
        }
        break;
    }
  }
  getFeeAccountingLines() {
    const feeDetails = [];
    const rmElements = this.pnrService.pnrObj.rmElements;
    for (const rmElement of rmElements) {
      if (rmElement.category === 'F' && rmElement.freeFlowText.indexOf('TKT') > -1) {
        if(!this.checkFeePresent(rmElement.freeFlowText)) {
          const feeObj = this.invoiceRmkService.getFeeDetailsUI(rmElement.freeFlowText);
          this.feeAccountingList.push(feeObj);
        }
        const feeLineObj = this.invoiceRmkService.getFeeDetails(rmElement);
        feeDetails.push(feeLineObj);
      }
    }
    return feeDetails;
  }
  getNonBspAccountingLines() {
    const nonBspDetails = [];
    const rmElements = this.pnrService.pnrObj.rmElements;
    for (const rmEle of rmElements) {
      if (rmEle.category === 'F' && rmEle.freeFlowText.indexOf('MAC/-') > -1) {
        const nonBspLine = {
          nonBspLineNum: '',
          nonBspRmk: '',
          associations: []
        }
        const supplierRegex = /MAC\/-SUP-[-A-Z, 0-9]{1,}/g;
        const supplierMatch = rmEle.freeFlowText.match(supplierRegex);
        if (supplierMatch && supplierMatch[0]) {
          const nonBspObj = {
            lineNo: '',
            freeText: '',
            isChecked: false
          };
          const supplierCode = supplierMatch[0].replace('MAC/-SUP-', '').trim();
          const supplierName = this.getSupplierName(supplierCode);
          nonBspObj.freeText = supplierCode + '-' + supplierName;
          const lkRegex = /LK-MAC[0-9]{1,}/g;
          const lkMatch = rmEle.freeFlowText.match(lkRegex);
          if (lkMatch && lkMatch[0]) {
            nonBspObj.lineNo = lkMatch[0].replace('LK-MAC', '').trim();
          }
          nonBspLine.nonBspLineNum = nonBspObj.lineNo;
          nonBspLine.nonBspRmk = rmEle.freeFlowText;
          nonBspLine.associations = rmEle.associations;
          nonBspDetails.push(nonBspLine);
          this.nonBspAccountingList.push(nonBspObj);
        } else {
          const lkRegex = /LK-MAC[0-9]{1,}/g;
          const lkMatch = rmEle.freeFlowText.match(lkRegex);
          if (lkMatch && lkMatch[0]) {
            nonBspLine.nonBspLineNum = lkMatch[0].replace('LK-MAC', '').trim();
          }
          nonBspLine.nonBspRmk = rmEle.freeFlowText;
          nonBspLine.associations = rmEle.associations;
          nonBspDetails.push(nonBspLine);
        }
      }
    }
    return nonBspDetails;
  }
  getSupplierName(supplierCode) {
    let supplierName = '';
    const supplierCodeList = this.ddbService.supplierCodes;
    for (const ele of supplierCodeList) {
      if (supplierCode === ele.supplierCode) {
        supplierName = ele.supplierName;
        break;
      }
    }
    return supplierName;
  }
  checkFeePresent(freeText) {
    const ticketRegex = /TKT[0-9]{1,2}/g;
    const ticketMatch = freeText.match(ticketRegex);
    let lineNum: '';
    if (ticketMatch && ticketMatch[0]) {
      lineNum = ticketMatch[0].replace('TKT', '').trim();
    }
    for (const feeEle of this.feeAccountingList) {
      if (feeEle.lineNo === lineNum) {
        return true;
      }
    }
    return false;
  }
  async generateInvoice() {
    const invCommand = 'INV/ZX/S' + this.selectedElementsUI.selectedSegments + '/RT';
    await this.invoiceRmkService.sendINVCommand(invCommand);
    const rtfRes = await this.invoiceRmkService.sendRTFCommand();
    const invoiceElements = this.invoiceRmkService.getInvoiceElements(rtfRes);
    this.addInvoiceFromGDS(invoiceElements);
  }
  checkSelectedInvoice(data: any) {
    if (data.lineNo === 'All') {
      const newVal = !data.isChecked;
      for (const ele of this.invoiceList) {
        ele.isChecked = newVal;
      }
    } else {
      for (const ele of this.invoiceList) {
        if (data.lineNo === ele.lineNo) {
          ele.isChecked = !ele.isChecked;
        }
      }
      if (this.checkForAllSelectionInvoice()) {
        this.invoiceList[0].isChecked = true;
      } else {
        this.invoiceList[0].isChecked = false;
      }
    }
    this.selectedElementsUI.selectedInvoice = this.updateValUI(this.invoiceList);
    this.invoiceFormGroup.controls.invoiceNo.setValue(this.selectedElementsUI.selectedInvoice);
  }
  checkSelectedFeeLines(data: any) {
    for (const ele of this.feeAccountingList) {
      if (ele.lineNo === data.lineNo) {
        ele.isChecked = !ele.isChecked;
      }
    }
    this.selectedElementsUI.selectedFeeLines = this.updateValUI(this.feeAccountingList);
    this.invoiceFormGroup.controls.feesAccountingNo.setValue(this.selectedElementsUI.selectedFeeLines);
  }
  checkSelectedNonBspLines(data: any) {
    for (const ele of this.nonBspAccountingList) {
      if (ele.lineNo === data.lineNo) {
        ele.isChecked = !ele.isChecked;
      }
    }
    this.selectedElementsUI.selectedNonBspLines = this.updateValUI(this.nonBspAccountingList);
    this.invoiceFormGroup.controls.nonBspAccountingNo.setValue(this.selectedElementsUI.selectedNonBspLines);
  }
  checkSelectedTickets(data: any) {
    if (data.lineNo === 'All') {
      const newVal = !data.isChecked;
      for (const ele of this.eTicketsList) {
        if (ele.lineNo !== 'None') {
          ele.isChecked = newVal;
        } else {
          ele.isChecked = !newVal;
        }
      }
    } else if (data.lineNo === 'None') {
      for (const ele of this.eTicketsList) {
        if (ele.lineNo !== 'None') {
          ele.isChecked = false;
        } else {
          ele.isChecked = true;
        }
      }
    } else {
      for (const ele of this.eTicketsList) {
        if (data.lineNo === ele.lineNo) {
          ele.isChecked = !ele.isChecked;
        }
        if (ele.lineNo === 'None' && ele.isChecked) {
          ele.isChecked = !ele.isChecked;
        }
      }
      if (this.checkForAllSelectionTickets()) {
        this.eTicketsList[0].isChecked = true;
      } else {
        this.eTicketsList[0].isChecked = false;
      }
    }
    this.selectedElementsUI.selectedETickets = this.updateValUI(this.eTicketsList);
    this.invoiceFormGroup.controls.eTicketNo.setValue(this.selectedElementsUI.selectedETickets);
  }
  private checkForAllSelectionInvoice() {
    let isAllSelected = true;
    this.invoiceList.forEach((ele, index) => {
      if (index !== 0 && !ele.isChecked) {
        isAllSelected = false;
      }
    });
    return isAllSelected;
  }
  private checkForAllSelectionTickets() {
    let isAllSelected = true;
    this.eTicketsList.forEach((ele, index) => {
      if (index !== 0  && index !== this.eTicketsList.length - 1 && !ele.isChecked) {
        isAllSelected = false;
      }
    });
    return isAllSelected;
  }
  updateValUI(list) {
    const selectedItem = [];
    let selectedVal = '';
    for (const ele of list) {
      if (ele.lineNo === 'All' && ele.isChecked) {
        selectedItem.push(ele.lineNo);
        break;
      } else {
        if (ele.isChecked) {
          selectedItem.push(ele.lineNo);
        }
      }
    }
    selectedVal = selectedItem.join(',');
    return selectedVal;
  }
  makeETicketsListUI(eTickets) {
    const selectAllObj = {
      lineNo: 'All',
      freeText: 'Send All E-tickets listed in PNR',
      isChecked: false
    };
    this.eTicketsList.push(selectAllObj);
    eTickets.forEach((ticket, index) => {
      const ticketObj = {
        lineNo: index + 1,
        freeText: ticket,
        isChecked: false
      };
      this.eTicketsList.push(ticketObj);
    });
    const selectNoneObj = {
      lineNo: 'None',
      freeText: 'No E-tickets Required',
      isChecked: false
    };
    this.eTicketsList.push(selectNoneObj);
  }
}