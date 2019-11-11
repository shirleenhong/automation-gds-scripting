import { Injectable } from '@angular/core';
import { PnrService } from '../pnr.service';
import { RemarksManagerService } from './remarks-manager.service';
import { MatrixReportingComponent } from 'src/app/corporate/reporting/matrix-reporting/matrix-reporting.component';
import { EscRemarksComponent } from 'src/app/corporate/corp-remarks/esc-remarks/esc-remarks.component';
import { DatePipe } from '@angular/common';
import { AddContactComponent } from '../../corporate/corp-remarks/add-contact/add-contact.component';
import { FormArray, FormGroup } from '@angular/forms';
import { AmadeusQueueService } from '../amadeus-queue.service';
import { QueuePlaceModel } from 'src/app/models/pnr/queue-place.model';
declare var smartScriptSession: any;

@Injectable({
  providedIn: 'root'
})
export class InvoiceRemarkService {
  DATE_PIPE = new DatePipe('en-US');

  constructor(private pnrService: PnrService,
              private queService: AmadeusQueueService,
              private rms: RemarksManagerService) { }
  sendU70Remarks(): any {
    if (this.checkAquaComplianceRemarks()) {
      console.log('send u70 remark');
      const u70map = new Map<string, string>();
      u70map.set('RecordLocator', this.pnrService.pnrObj.header.recordLocator);
      this.rms.createPlaceholderValues(u70map);
    }
  }
  checkAquaComplianceRemarks(): any {
    let createRemark = false;
    if (this.pnrService.pnrObj.header.recordLocator) {
      const u70 = this.pnrService.getRemarkText('U70/-');
      if (!u70) {
        createRemark = true;
      }
    }
    return createRemark;
  }

  WriteInvoiceRemark(mrc: MatrixReportingComponent) {
    if (mrc.isMatrixPnr) {
      const backOfficeIdentifier = new Map<string, string>();
      const staticRemarksCondition = new Map<string, string>();
      if (mrc.invoiceMessageForm.get('cicNumber').value !== undefined) {
        backOfficeIdentifier.set('BackOfficeAgentIdentifier', mrc.invoiceMessageForm.get('cicNumber').value);
        this.rms.createPlaceholderValues(backOfficeIdentifier);
      }
      staticRemarksCondition.set('IsNuc', 'true');
      this.rms.createPlaceholderValues(null, staticRemarksCondition, null, null, 'NUC');
    }
  }
  writeESCRemarks(escComp: EscRemarksComponent) {
    const esc = escComp.escRemarksForm;
    let currentDate: any = new Date();
    const currentTime =
      currentDate.getHours() + ':' + (currentDate.getMinutes() <= 9 ? '0' + currentDate.getMinutes() : currentDate.getMinutes());
    currentDate = this.DATE_PIPE.transform(new Date(), 'ddMMM'); // DDOCT

    if (esc.controls.isESCRead.value === 'Y') {
      this.rms.createEmptyPlaceHolderValue(['CurrentTimeN', 'CurrentDateN'], null, 'ESC AGENT DID NOT HAVE TIME TO READ ESC REMARKS');
      const escMap = new Map<string, string>();
      escMap.set('CurrentDateY', currentDate);
      escMap.set('CurrentTimeY', currentTime);
      this.rms.createPlaceholderValues(escMap);
    }
    if (esc.controls.isESCRead.value === 'N') {
      this.rms.createEmptyPlaceHolderValue(['CurrentTimeY', 'CurrentDateY'], null, 'ESC AGENT READ ESC REMARKS');
      const escMap = new Map<string, string>();
      escMap.set('CurrentDateN', currentDate);
      escMap.set('CurrentTimeN', currentTime);
      this.rms.createPlaceholderValues(escMap);
    }
  }
  async deleteSSRLines(addConact: AddContactComponent) {
    const deleteLines = addConact.deleteSRline.join(',');
    await smartScriptSession.send('XE' + deleteLines);
  }
  getSSRCommandsForContact(addConact: AddContactComponent) {
    const formCommandArr = [];
    let formCommand = '';
    if (addConact.addContactForm) {
      const arr = addConact.addContactForm.get('items') as FormArray;
      for (const c of arr.controls) {
        const name = c.get('name').value;
        const countryCode = c.get('countryCode').value;
        const phone = c.get('phone').value;
        const freeFlow = c.get('freeFlowText').value;
        const pax = c.get('passengers').value;
        if (name && countryCode && phone) {
          formCommand = 'SR PCTC YY HK/' + name + '/' + countryCode + phone + '.' + freeFlow + '/' + pax;
          formCommandArr.push(formCommand);
        }
      }
    }
    return formCommandArr;
  }
  async sendRTFCommand() {
    const tempRTFRes = await smartScriptSession.send('RTF');
    return await smartScriptSession.getFullCryptic(tempRTFRes.Response);
  }
  async sendINVCommand(command) {
    const tempINVRes = await smartScriptSession.send(command);
    return await smartScriptSession.getFullCryptic(tempINVRes.Response);
  }
  async sendRTTNCommand(command) {
    const tempRTTNRes = await smartScriptSession.send(command);
    return await smartScriptSession.getFullCryptic(tempRTTNRes.Response);
  }
  async sendRFCommand(command) {
    return await smartScriptSession.send(command);
  }
  addETicketRemarks(selectedUIElements, eTicketsList) {
    const selectedETickets = selectedUIElements.selectedETickets;
    if (selectedETickets === 'All') {
      // create placeholder for all values
      for (const eTicket of eTicketsList) {
        if (eTicket.lineNo !== 'All' && eTicket.lineNo !== 'None') {
          const ticketMap = new Map<string, string>();
          ticketMap.set('TicketNum', eTicket.freeText);
          this.rms.createPlaceholderValues(ticketMap);
        }
      }
    } else if (selectedETickets === 'None') {
      // create placeholder for no ticket
      const ticketMap = new Map<string, string>();
      ticketMap.set('TicketNum', '0');
      this.rms.createPlaceholderValues(ticketMap);
    } else {
      const splitSelectedVals = selectedETickets.split(',');
      for (const selectedEle of splitSelectedVals) {
        const ticketNum = this.getTicketNum(selectedEle, eTicketsList);
        if (ticketNum !== '') {
          const ticketMap = new Map<string, string>();
          ticketMap.set('TicketNum', ticketNum);
          this.rms.createPlaceholderValues(ticketMap);
        }
      }
    }
  }
  getTicketNum(selectedEle, eTicketsList) {
    let ticketNum = '';
    for (const eTicket of eTicketsList) {
      if (eTicket.lineNo.toString() === selectedEle) {
        ticketNum = eTicket.freeText;
      }
    }
    return ticketNum;
  }
  addFeeLinesRemarks(selectedUIElements, feeRemarks) {
    const selectedFeeLines = selectedUIElements.selectedFeeLines.split(',');
    for (const line of selectedFeeLines) {
      for (const rmk of feeRemarks) {
        const feeMap = new Map<string, string>();
        let segAssociations = [];
        if (rmk.associations) {
          segAssociations = this.getSegmentAssociations(rmk.associations);
        }
        if (line === rmk.ticketline && rmk.remarkText.indexOf('FEE/-') > -1) {
          rmk.remarkText = rmk.remarkText.replace('FEE/-', '').trim();
          feeMap.set('FeesPlaceholder', rmk.remarkText);
          this.rms.createPlaceholderValues(feeMap, null, segAssociations);
        } else if (line === rmk.ticketline && rmk.remarkText.indexOf('SFC/-') > -1) {
          rmk.remarkText = rmk.remarkText.replace('SFC/-', '').trim();
          feeMap.set('SfcPlaceholder', rmk.remarkText);
          this.rms.createPlaceholderValues(feeMap, null, segAssociations);
        }
      }
    }
  }
  getSegmentAssociations(associations) {
    const segAssociations = [];
    for (const assc of associations) {
      if (assc.segmentType === 'ST') {
        segAssociations.push(assc.tatooNumber);
      }
    }
    return segAssociations;
  }
  addNonBspRemarks(selectedUIElements, nonBspRemarks) {
    const selectedNonBspLines = selectedUIElements.selectedNonBspLines.split(',');
    for (const line of selectedNonBspLines) {
      for (const rmk of nonBspRemarks) {
        const nonBspMap = new Map<string, string>();
        if (line === rmk.nonBspLineNum) {
          rmk.nonBspRmk = rmk.nonBspRmk.replace('MAC/-', '').trim();
          nonBspMap.set('MacLinePlaceholder', rmk.nonBspRmk);
          let segAssociations = [];
          if (rmk.associations) {
            segAssociations = this.getSegmentAssociations(rmk.associations);
          }
          this.rms.createPlaceholderValues(nonBspMap, null, segAssociations);
        }
      }
    }
    this.queService.addQueueCollection(new QueuePlaceModel('YTOWL210E', 66, 1));
  }
  getDeletedInvoiceLines(selectedUIElements, invoiceList) {
    const deletedInvoices = new Array<string>();
    const selectedInvoices = selectedUIElements.selectedInvoice;
    if (selectedInvoices === 'All') {
      return deletedInvoices;
    } else {
      for (const invoice of invoiceList) {
        if (invoice.lineNo !== 'All' && !invoice.isChecked) {
          deletedInvoices.push(invoice.lineNo);
        }
      }
    }
    return deletedInvoices;
  }
  addEmailRemarks(frmGroup: FormGroup) {
    const arr = frmGroup.get('emailAddresses') as FormArray;
    for (const c of arr.controls) {
      const email = c.get('emailAddress').value;
      if (email) {
        const emailAddresses = new Map<string, string>();
        emailAddresses.set('CWTItineraryEmailRecipient', email);
        this.rms.createPlaceholderValues(emailAddresses);
      }
    }
  }
  getFeeDetailsUI(freeFlowText) {
    const feeObj = {
      lineNo: '',
      freeText: '',
      isChecked: false,
    };
    const ticketRegex = /TKT[0-9]{1,2}/g;
    const ticketMatch = freeFlowText.match(ticketRegex);
    if (ticketMatch && ticketMatch[0]) {
      feeObj.freeText = ticketMatch[0];
      feeObj.lineNo = ticketMatch[0].replace('TKT', '').trim();
    }
    return feeObj;
  }
  getInvoiceElements(rtfResponse) {
    const invoiceElements = [];
    const splitRes = rtfResponse.split('\n');
    for (const ele of splitRes) {
      if (ele.indexOf('FI') > -1) {
        invoiceElements.push(ele);
      }
    }
    return invoiceElements;
  }
  getInvoiceDetails(invoiceEle) {
    const invoiceObj = {
      lineNo: '',
      freeText: '',
      isChecked: false
    };
    const invoice = invoiceEle.trim();
    const lineRegex = /[0-9]{1,2}/;
    const invoiceRegex = /[0-9]{10} [A-Z]{3} [0-9]{10}/g;
    const lineMatch = invoice.match(lineRegex);
    if (lineMatch && lineMatch[0]) {
      invoiceObj.lineNo = lineMatch[0];
    }
    const invoiceMatch = invoice.match(invoiceRegex);
    if (invoiceMatch && invoiceMatch[0]) {
      invoiceObj.freeText = invoiceMatch[0];
    }
    return invoiceObj;
  }
  getAllTickets(response) {
    const eTickets = [];
    const resregex = /AF\/FA[ 0-9-]{4}[-]{1}[0-9]{10}\/{1}[A-Z]{4}/g;
    const match = response.match(resregex);
    if (match) {
      const ticketTypeRegex = /[A-Z]{4}/g;
      const ticketNumRegex = /[0-9-]{4}[0-9]{10}/g;
      for (const matchEle of match) {
        const typeMatch = matchEle.match(ticketTypeRegex);
        if (typeMatch && typeMatch[0].indexOf('ET') > -1) {
          const ticketNumMatch = matchEle.match(ticketNumRegex);
          if (ticketNumMatch && ticketNumMatch[0]) {
            eTickets.push(ticketNumMatch[0].replace('-', '').trim());
          }
        }
      }
    }
    return eTickets;
  }
  getFeeDetails(rmElement) {
    const feeLineObj = {
      ticketline: '',
      remarkText: '',
      associations: []
    };
    const ticketRegex = /TKT[0-9]{1,2}/g;
    let freeText = rmElement.freeFlowText;
    const ticketMatch = freeText.match(ticketRegex);
    if (ticketMatch && ticketMatch[0]) {
      feeLineObj.ticketline = ticketMatch[0].replace('TKT', '').trim();
      freeText = freeText.replace(ticketMatch[0] + '-', '').trim();
      feeLineObj.remarkText = freeText;
      feeLineObj.associations = rmElement.associations;
    }
    return feeLineObj;
  }
}
