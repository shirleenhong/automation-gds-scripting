import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';
import { PnrService } from '../service/pnr.service';
import { RemarkService } from '../service/remark.service';
import { LeisureViewModel } from '../models/leisure-view.model';
import { PaymentRemarkService } from '../service/payment-remark.service';
import { RemarkGroup } from '../models/pnr/remark.group.model';
import { ReportingRemarkService } from '../service/reporting-remark.service';
import { PaymentComponent } from '../payments/payment.component';
import { SegmentService } from '../service/segment.service';
import { ReportingComponent } from '../reporting/reporting.component';
import { RemarkComponent } from '../remarks/remark.component';
import { DDBService } from '../service/ddb.service';
import { CfRemarkModel } from '../models/pnr/cf-remark.model';
import { CancelSegmentComponent } from '../cancel-segment/cancel-segment.component';
import { PassiveSegmentsComponent } from '../passive-segments/passive-segments.component';
import { PackageRemarkService } from '../service/package-remark.service';
import { ValidateModel } from '../models/validate-model';
import { BsModalService } from 'ngx-bootstrap';
import { MessageComponent } from '../shared/message/message.component';
import { VisaPassportService } from '../service/visa-passport.service';
import { InvoiceService } from '../service/invoice-remark.service';
import { MatrixInvoiceComponent } from '../invoice/matrix-invoice.component';
import { ItineraryComponent } from '../itinerary/itinerary.component';
import { ItineraryService } from '../service/itinerary.service';

@Component({
  selector: 'app-leisure',
  templateUrl: './leisure.component.html',
  styleUrls: ['./leisure.component.scss']
})
export class LeisureComponent implements OnInit, AfterViewInit, AfterViewChecked {
  isPnrLoaded: boolean;
  message: string;
  leisure: LeisureViewModel;
  cfLine: CfRemarkModel;
  workflow = '';
  cancelEnabled = true;
  validModel = new ValidateModel();
  invoiceEnabled = false;

  @ViewChild(PassiveSegmentsComponent)
  segmentComponent: PassiveSegmentsComponent;
  @ViewChild(PaymentComponent) paymentComponent: PaymentComponent;
  @ViewChild(ReportingComponent) reportingComponent: ReportingComponent;
  @ViewChild(RemarkComponent) remarkComponent: RemarkComponent;
  @ViewChild(CancelSegmentComponent)
  cancelSegmentComponent: CancelSegmentComponent;
  @ViewChild(PassiveSegmentsComponent)
  passiveSegmentsComponent: PassiveSegmentsComponent;
  @ViewChild(MatrixInvoiceComponent) invoiceComponent: MatrixInvoiceComponent;
  @ViewChild(ItineraryComponent) itineraryComponent: ItineraryComponent;

  errorPnrMsg = '';
  eventSubscribe = false;
  segment = [];

  constructor(
    private pnrService: PnrService,
    private remarkService: RemarkService,
    private paymentRemarkService: PaymentRemarkService,
    private reportingRemarkService: ReportingRemarkService,
    private segmentService: SegmentService,
    private packageRemarkService: PackageRemarkService,
    private visaPassportService: VisaPassportService,
    private ddbService: DDBService,
    private modalService: BsModalService,
    private invoiceService: InvoiceService,
    private itineraryService: ItineraryService
  ) {
    this.getPnr();
    this.initData();
  }

  ngAfterViewChecked() {
    // Subscribe to event from child Component
  }

  ngAfterViewInit(): void {}

  async getPnr() {
    // this.ddbService.getCountryAndCurrencyList();
    this.errorPnrMsg = '';
    await this.getPnrService();
    this.cfLine = this.pnrService.getCfLine();
    // this.itineraryService.getCountry(this.pnrService.pnrObj.airSegments);
    this.ddbService.getTravelPortInformation();
    if (this.pnrService.errorMessage.indexOf('Error') === 0) {
      this.errorPnrMsg = 'Unable to load PNR or no PNR is loaded in Amadeus. \r\n' + this.pnrService.errorMessage;
    } else if (this.cfLine == null || this.cfLine === undefined) {
      this.errorPnrMsg = 'PNR doesnt contain CF Remark, Please make sure CF remark is existing in PNR.';
      this.isPnrLoaded = true;
    }
    this.displayInvoice();
  }

  initData() {
    this.ddbService.loadSupplierCodesFromPowerBase();
  }

  async getPnrService() {
    this.pnrService.isPNRLoaded = false;
    await this.pnrService.getPnr();
    this.isPnrLoaded = this.pnrService.isPNRLoaded;
  }

  ngOnInit() {
    this.leisure = new LeisureViewModel();
  }

  checkValid() {
    this.validModel.isSubmitted = true;
    this.validModel.isPaymentValid = this.paymentComponent.checkValid();
    this.validModel.isReportingValid = this.reportingComponent.checkValid();
    this.validModel.isRemarkValid = this.remarkComponent.checkValid();
    this.validModel.isItineraryValid = this.itineraryComponent.checkValid();
    return this.validModel.isAllValid();
  }

  public submitToPnr() {
    if (!this.checkValid()) {
      const modalRef = this.modalService.show(MessageComponent, {
        backdrop: 'static'
      });
      modalRef.content.modalRef = modalRef;
      modalRef.content.title = 'Invalid Inputs';
      modalRef.content.message = 'Please make sure all the inputs are valid and put required values!';
      return;
    }

    const remarkCollection = new Array<RemarkGroup>();
    remarkCollection.push(this.paymentRemarkService.getMatrixRemarks(this.paymentComponent.matrixReceipt.matrixReceipts));
    remarkCollection.push(this.paymentRemarkService.getAccountingRemarks(this.paymentComponent.accountingRemark.accountingRemarks));
    remarkCollection.push(this.paymentRemarkService.getAccountingUdids(this.paymentComponent.accountingRemark));
    remarkCollection.push(this.visaPassportService.getRemarks(this.remarkComponent.viewPassportComponent.visaPassportFormGroup));
    remarkCollection.push(this.segmentService.writeOptionalFareRule(this.remarkComponent.fareRuleSegmentComponent.fareRuleRemarks));
    remarkCollection.push(this.reportingRemarkService.getRoutingRemark(this.leisure.reportingView));
    if (!this.pnrService.hasAmendMisRetentionLine()) {
      remarkCollection.push(this.segmentService.getRetentionLine());
    }

    remarkCollection.push(this.segmentService.removeTeamMateMisRetention());
    remarkCollection.push(this.segmentService.getMandatoryRemarks());

    if (this.cfLine.cfa === 'RBM' || this.cfLine.cfa === 'RBP') {
      const concierge = this.reportingComponent.conciergeComponent;
      remarkCollection.push(this.reportingRemarkService.getConciergeUdids(concierge));
    }

    if (
      this.remarkComponent.remarkForm.controls.packageList.value !== null &&
      this.remarkComponent.remarkForm.controls.packageList.value !== '' &&
      this.remarkComponent.remarkForm.controls.packageList.value !== '1'
    ) {
      if (this.remarkComponent.remarkForm.controls.packageList.value === 'ITC') {
        remarkCollection.push(this.packageRemarkService.getItcPackageRemarks(this.remarkComponent.itcPackageComponent.itcForm));
      } else {
        remarkCollection.push(this.packageRemarkService.getTourPackageRemarks(this.remarkComponent.tourPackageComponent.group));
      }
    } else {
      remarkCollection.push(this.packageRemarkService.getPackageRemarksForDeletion());
    }

    remarkCollection.push(this.packageRemarkService.getCodeShare(this.remarkComponent.codeShareComponent.codeShareGroup));
    remarkCollection.push(
      this.packageRemarkService.getRbcRedemptionRemarks(this.remarkComponent.rbcPointsRedemptionComponent.rbcRedemption)
    );

    if (!this.itineraryComponent.itineraryForm.pristine) {
      remarkCollection.push(this.itineraryService.getItineraryRemarks(this.itineraryComponent.itineraryForm));
    }

    const leisureFee = this.paymentComponent.leisureFee;
    remarkCollection.push(this.paymentRemarkService.getLeisureFeeRemarks(leisureFee, this.cfLine.cfa));

    this.remarkService.buildRemarks(remarkCollection);
    this.remarkService.submitRemarks().then(
      () => {
        this.isPnrLoaded = false;
        this.getPnr();
        this.workflow = '';
      },
      (error) => {
        console.log(JSON.stringify(error));
      }
    );
  }

  async cancelPnr() {
    if (!this.cancelSegmentComponent.checkValid()) {
      const modalRef = this.modalService.show(MessageComponent, {
        backdrop: 'static'
      });
      modalRef.content.modalRef = modalRef;
      modalRef.content.title = 'Invalid Inputs';
      modalRef.content.message = 'Please make sure all the inputs are valid and put required values!';
      return;
    }

    const osiCollection = new Array<RemarkGroup>();
    const remarkCollection = new Array<RemarkGroup>();
    const cancel = this.cancelSegmentComponent;
    const getSelected = cancel.submit();

    // if (getSelected.length >= 1) {
    osiCollection.push(this.segmentService.osiCancelRemarks(cancel.cancelForm));
    this.remarkService.buildRemarks(osiCollection);
    await this.remarkService.cancelOsiRemarks().then(
      () => {},
      (error) => {
        console.log(JSON.stringify(error));
      }
    );

    if (getSelected.length === this.segment.length) {
      remarkCollection.push(this.segmentService.cancelMisSegment());
    }

    remarkCollection.push(this.segmentService.buildCancelRemarks(cancel.cancelForm, getSelected));
    this.remarkService.buildRemarks(remarkCollection);
    await this.remarkService.cancelRemarks(cancel.cancelForm.value.requestor).then(
      () => {
        this.isPnrLoaded = false;
        this.getPnr();
        this.workflow = '';
      },
      (error) => {
        console.log(JSON.stringify(error));
      }
    );
    // this.remarkService.endPNR(cancel.cancelForm.value.requestor);
  }

  async addSegmentToPnr() {
    const remarkCollection = new Array<RemarkGroup>();
    remarkCollection.push(this.segmentService.getSegmentRemark(this.passiveSegmentsComponent.segmentRemark.segmentRemarks));
    this.remarkService.buildRemarks(remarkCollection);
    await this.remarkService.submitRemarks().then(
      async () => {
        this.isPnrLoaded = false;
        await this.getPnr();
        this.addRir();
      },
      (error) => {
        console.log(JSON.stringify(error));
      }
    );
  }

  async addRir() {
    // await this.pnrService.getPNR();
    const remarkCollection2 = new Array<RemarkGroup>();
    remarkCollection2.push(this.segmentService.addSegmentRir(this.passiveSegmentsComponent.segmentRemark));

    await this.remarkService.buildRemarks(remarkCollection2);
    this.remarkService.submitRemarks().then(
      () => {
        this.isPnrLoaded = false;
        this.getPnr();
      },
      (error) => {
        console.log(JSON.stringify(error));
      }
    );
  }

  displayInvoice() {
    if (this.isPnrLoaded) {
      if (this.pnrService.recordLocator() !== undefined) {
        this.invoiceEnabled = true;
      } else {
        this.invoiceEnabled = false;
      }
    }
  }

  public sendInvoiceItinerary() {
    const remarkCollection = new Array<RemarkGroup>();
    remarkCollection.push(this.invoiceService.getMatrixInvoice(this.invoiceComponent.matrixInvoiceGroup));
    this.remarkService.endPnr(' Agent Invoicing'); // end PNR First before Invoice
    this.remarkService.buildRemarks(remarkCollection);
    this.remarkService.submitRemarks().then(
      () => {
        this.isPnrLoaded = false;
        this.getPnr();
        this.workflow = '';
      },
      (error) => {
        console.log(JSON.stringify(error));
      }
    );
  }

  public async loadPnr() {
    if (this.isPnrLoaded) {
      await this.getPnrService();
      this.workflow = 'load';
    }
  }

  public async cancelSegment() {
    if (this.isPnrLoaded) {
      await this.getPnrService();
      this.workflow = 'cancel';
      this.segment = this.pnrService.getSegmentTatooNumber();
      this.setControl();
    }
  }

  public async addSegment() {
    if (this.isPnrLoaded) {
      await this.getPnrService();
      this.workflow = 'segment';
    }
  }

  public async sendInvoice() {
    if (this.isPnrLoaded) {
      await this.getPnrService();
      this.workflow = 'invoice';
    }
  }

  back(): void {
    if (this.isPnrLoaded) {
      this.workflow = '';
    }
  }

  setControl() {
    if (this.isPnrLoaded) {
      if (this.pnrService.recordLocator() !== undefined) {
        this.cancelEnabled = false;
      }
    }
  }
}
