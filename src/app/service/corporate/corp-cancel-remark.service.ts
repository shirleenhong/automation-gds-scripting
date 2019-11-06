import { Injectable } from '@angular/core';
import { RemarksManagerService } from './remarks-manager.service';
import { RemarkGroup } from 'src/app/models/pnr/remark.group.model';
import { FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { RemarkModel } from 'src/app/models/pnr/remark.model';
import { RemarkHelper } from 'src/app/helper/remark-helper';
import { AmadeusQueueService } from '../amadeus-queue.service';
import { QueuePlaceModel } from 'src/app/models/pnr/queue-place.model';
import { PnrService } from '../pnr.service';

@Injectable({
  providedIn: 'root'
})
export class CorpCancelRemarkService {
  constructor(
    private remarksManager: RemarksManagerService,
    private remarkHelper: RemarkHelper,
    private queService: AmadeusQueueService,
    private pnrService: PnrService
  ) {}

  WriteNonBspTicketCredit(group: FormGroup) {
    const curDate = formatDate(new Date(), 'ddMMM', 'en-US');
    const remarkList = new Array<RemarkModel>();
    if (group.get('hasU14').value) {
      if (group.get('isReCredit').value === 'N') {
        this.createRemarks(['VendorName', 'BackOfficeAgentIdentifier'], [group.get('vendor').value, group.get('officeId').value]);
        this.createRemarks(
          ['CurrentDate', 'CounselorLastName', 'CounselorFirstName'],
          [curDate, group.get('lastName').value, group.get('firstName').value]
        );

        this.createRemarks(
          ['PartialFull', 'CurrentDate'],
          [group.get('partialFull').value === 'full' ? 'FULL' : 'PART', curDate],
          'ATTN ACCTNG - NONBSP'
        );

        if (group.get('partialFull').value !== 'full') {
          this.createRemarks(['BaseAmt', 'Gst', 'Tax'], [group.get('baseAmount').value, group.get('gst').value, group.get('tax').value]);
          this.createRemarks(['Commission'], [group.get('commission').value]);
          if (group.get('freeFlow1').value) {
            remarkList.push(this.remarkHelper.createRemark(group.get('freeFlow1').value, 'RM', 'X'));
          }
          if (group.get('freeFlow2').value) {
            remarkList.push(this.remarkHelper.createRemark(group.get('freeFlow2').value, 'RM', 'X'));
          }
        }
        return { remarks: remarkList, commands: ['BT'] };
      }
    } else {
      this.createRemarks(['CurrentDate', 'DocTicketNum'], [curDate, group.get('ticketNum').value]);
    }
    this.queueNonBspTicketCredit();
    return null;
  }

  buildVoidRemarks(cancel: any) {
    const dateToday = formatDate(new Date(), 'ddMMM', 'en-US');
    let remarkSet = new Map<string, string>();

    const rmGroup = new RemarkGroup();
    rmGroup.group = 'Void';
    rmGroup.remarks = new Array<RemarkModel>();

    if (cancel.value.followUpOption === 'Void BSP') {
      remarkSet = new Map<string, string>();
      remarkSet.set('VoidDate', dateToday);
      if (cancel.value.authorization) {
        remarkSet.set('Auth', cancel.value.authorization);
        this.remarksManager.createPlaceholderValues(remarkSet, null, null);
      }
      remarkSet = new Map<string, string>();
      if (cancel.value.ticketNumber) {
        remarkSet.set('VTkt', cancel.value.ticketNumber);
        this.remarksManager.createPlaceholderValues(remarkSet, null, null);
      }
      remarkSet = new Map<string, string>();
      remarkSet.set('VoidDate', dateToday);
      if (cancel.value.cFirstInitial.trim !== '' && cancel.value.cLastName.trim !== '') {
        remarkSet.set('CounselorFirstName', cancel.value.cFirstInitial);
        remarkSet.set('CounselorLastName', cancel.value.cLastName);
        this.remarksManager.createPlaceholderValues(remarkSet, null, null);
      }
      remarkSet = new Map<string, string>();

      if (cancel.value.vRsnOption) {
        remarkSet.set('VRsn', cancel.value.vRsnOption);
      }
      this.remarksManager.createPlaceholderValues(remarkSet, null, null);
    } else if (cancel.value.followUpOption === 'Void Non BSP') {
      remarkSet = new Map<string, string>();
      remarkSet.set('RevType', cancel.value.reverseItem);
      this.remarksManager.createPlaceholderValues(remarkSet, null, null);
      remarkSet = new Map<string, string>();
      remarkSet.set('VoidDate', dateToday);
      if (cancel.value.cFirstInitial.trim !== '' && cancel.value.cLastName.trim !== '') {
        remarkSet.set('CounselorFirstName', cancel.value.cFirstInitial);
        remarkSet.set('CounselorLastName', cancel.value.cLastName);
        this.remarksManager.createPlaceholderValues(remarkSet, null, null);
      }
      if (cancel.value.otherDetails1.trim !== '') {
        rmGroup.remarks.push(this.getRemarksModel(cancel.value.otherDetails1, 'RM', 'X'));
      }
      if (cancel.value.otherDetails2.trim !== '') {
        rmGroup.remarks.push(this.getRemarksModel(cancel.value.otherDetails2, 'RM', 'X'));
      }
    }
    let OID = '';
    if (this.pnrService.pnrObj.tkElements.length > 0) {
      OID = this.pnrService
        .getRemarkText('BOOK-')
        .split('/')[1]
        .split('-')[1];
      if (OID === '') {
        OID = this.pnrService.pnrObj.tkElements[0].ticketingOfficeID;
      }
    }
    // this.queService.addQueueCollection(new QueuePlaceModel(OID, 41, 85));
    this.queService.addQueueCollection(new QueuePlaceModel(OID, 41, 98));
    return rmGroup;
  }

  public getRemarksModel(remText, type, cat, segment?: string) {
    let segmentrelate = [];
    if (segment) {
      segmentrelate = segment.split(',');
    }
    const rem = new RemarkModel();
    rem.category = cat;
    rem.remarkText = remText;
    rem.remarkType = type;
    rem.relatedSegments = segmentrelate;
    return rem;
  }

  private queueNonBspTicketCredit() {
    this.queService.addQueueCollection(new QueuePlaceModel('YTOWL210O', 41, 98));
    this.queService.addQueueCollection(new QueuePlaceModel('YTOWL210E', 60, 1));
  }

  private createRemarks(keys, values, statictext?) {
    const map = new Map<string, string>();
    keys.forEach((key, i) => {
      map.set(key, values[i]);
    });
    this.remarksManager.createPlaceholderValues(map, null, null, null, statictext);
  }
}