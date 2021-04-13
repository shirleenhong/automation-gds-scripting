import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  language = ['EN', 'FR'];
  remarkLines = [
    ['DELUXE PACKAGE INSURANCE', 'FORFAIT SUPERIEUR D ASSURANCE'],
    ['CANCELLATION/INTERUPTION', 'ANNULATION/INTERRUPTION'],
    ['EMERGENCY MEDICAL/TRANSPORTATION', 'FRAIS MEDICAUX D URGENCES/DE TRANSPORT'],
    ['FLIGHT AND TRAVEL ACCIDENT', 'ACCIDENTS DE VOL ET DE VOYAGES'],
    ['', ''],
    ['', ''],
  ];

  groupRemarks = [
    {
      groupName: 'DeclinedReason',
      remarks: [
        [
          'NONE OF CWT VACATIONS CANADA OR YOUR CWT TRAVEL',
          'AGENT ADVISOR OR YOUR CWT TRAVEL AGENCY WILL BE',
          'RESPONSIBLE FOR ANY EXPENSES LOSSES CLAIMS ',
          'LIABILITIES COSTS ACCOUNTS CHARGES TAXES ACTIONS',
          'DEMANDS OR DAMAGES OF ANY NATURE WHATSOEVER ARISING',
          'AS A RESULT OF YOU DECLINING TO PURCHASE TRAVEL',
          'INSURANCE FOR THE FULL VALUE AND DURATION OF THE',
          'TRIP INCLUDING WITHOUT LIMITATION',
          'A. EXPENSES INCURRED DUE TO THE DELAY OR',
          'CANCELLATION OF YOUR TRIP',
          'B. ANY ACCIDENT SICKNESS OR DEATH THAT OCCURS ON',
          'YOUR TRIP',
          'C. ANY BAGGAGE OR PROPERTY STOLEN OR DAMAGED ON',
          'YOUR TRIP',
          'D. YOUR BENEFITS UNDER THE FOLLOWING BEING ',
          'RESTRICTED AND/OR EXCLUDED',
          '1. CREDIT CARD ISURANCE--INSUFFICIENT PROTECTION ',
          'OFFERED BY OR NON-EXISTING COVERAGE OF YOUR ',
          'CREDIT CARD',
          '2. INSURANCE PRIVATE OR PUBLIC HEALTH CARE COVERAGE',
          '3. ADDITIONAL SINGLE SUPPLEMENT COST IF YOUR ',
          'TRAVELLING COMPANION IS UNABLE TO TRAVEL AND YOU',
          'STILL CHOOSE TO TRAVEL.',
          '4. THE UNFORSEEN FINANCIAL DEFAULT OR BANKRUPTCY OF',
          'THE TOUR OPERATOR CRUISE LINE OR AIRLINE CARRIER',
          'FROM WHICH YOU HAVE PURCHASED YOUR TRAVEL',
          'ARRANGEMENTS.',
          '5. OTHER ADDITIONAL COSTS IF INSURANCE IS NOT ',
          'PURCHASED AT THE TIME OF INITIAL DEPOSIT. SUCH AS A',
          'CHANGE IN MEDICAL CONDITION OR INCREASED',
          'SUPPLIER PENALTIES.',
        ],
        [
          'NI CWT VOYAGES CANADA VOTRE CONSEILLER EN',
          'VOYAGES CWT OU VOTRE AGENCE DE VOYAGES CWT NE',
          'SERA TENU RESPONSABLE DE DEPENSES PERTESRECLAMATIONS',
          'COUTS COMPTES COURANTS FRAIS TAXES ACTIONS REQUETES ',
          'YOU DOMMAGES ENGENDRES D UNE QUELCONQUE NATURE',
          'DECOULANT DE VOTRE REFUS D ACHETER L ASSURANCE',
          'VOYAGE COUVRANT LE MONTANT ET LA DUREE TOTALE DE',
          'VOTRE VOYAGE. INCLUANT MAIS NE SE LIMITANT PAS A-',
          'A. DEPENSES ENCOURRUES CAUSEES PAR UN DELAI OU L',
          'ANNULATION DE VOTRE VOYAGE',
          'B. TOUT ACCIDENT MALADIE OU MORTALITE SE PRODUISANT',
          'AU COURS DU VOYAGE',
          'C. TOUT VOL DOMMAGE OU PERTE DE PROPRIETE AU COURS',
          'DE VOTRE VOYAGE',
          'D. CONDITIONS OU GARANTIES LIMITEES ET/OU EXCLUSION',
          'SE RAPPORTANT A',
          '1. UNE PROTECTION INSUFFISANTE OU COUVERTURE',
          'INEXISTANTE PAR VOTRE ASSURANCE DE CARTE DE CREDIT.',
          '2. LA COUVERTURE DE VOTRE ASSURANCE PRIVEE OU DU ',
          'REGIME PUBLIC DE SANTE',
          '3. COUT DU SUPPLEMENT SIMPLE SI VOTRE COMPAGNON NE',
          'PEUT PLUSVOYAGER ET QUE VOUS CHOISISSEZ DE VOYAGER',
          'QUAND MEME',
        ],
      ],
    },
    {
      groupName: 'InsuranceDeclinedNo',
      remarks: [
        ['I DECLINED TO PURCHASE THE FOLLOWING TRAVEL INSURANCE', 'OPTIONS THAT MY TRAVEL AGENT HAS OFFERED AND EXPLAINED TO ME'],
        [
          'J AI REFUSE D ACHETER LES OPTIONS D ASSURANCES VOYAGES',
          'CI-DESSOUS M AYANT ETE OFFERTES ET EXPLIQUEES PAR MON',
          'CONSEILLER EN VOYAGES',
        ],
      ],
    },
    {
      groupName: 'InsuranceDeclinedYes',
      remarks: [
        ['ALL INCLUSIVE OR PREMIUM PROTECTION INSURANCE HAS BEEN', 'PURCHASED FOR THE FULL VALUE OF THE TRIP.'],
        ['LE FORFAIT D ASSURANCE SUPERIEUR A ETE ACHETE.', 'RIR POUR LE MONTANT TOTAL DU VOYAGE.'],
      ],
    },
    {
      groupName: 'VibRemarksSegment',
      remarks: [
        [
          'FOR VIA RAIL TRAVEL PLEASE CHECK IN AT TRAIN STATION',
          'AT LEAST 45 MINUTES PRIOR TO DEPARTURE.',
          'VIA RAIL POLICY-NONSMOKING ENVIRONMENT ON ALL TRAINS.',
          'VIA COUPONS ARE NOT VALID FOR AIR TRAVEL.',
          'IF CHANGES ARE MADE ENROUTE PLEASE ENSURE YOUR',
          'TICKET IS ENDORSED BY VIA 1 TICKET LOUNGE.',
          'PLEASE CALL VIA RAIL AT 1-888-842-7245',
          'TO RECONFIRM YOUR',
          'TRAIN DEPARTURE/ARRIVAL TIMES.',
        ],
        [
          'POUR LES DEPLACEMENTS A BORD DE VIA RAIL VEUILLEZ VOUS',
          'PRESENTER A LA GARE AU MOINS 45 MINUTES AVANT L HEURE PREVUE DE',
          'VOTRE DEPART SUIVANT LA POLITIQUE DE VIA RAIL-TOUS LES',
          'TRAINS SONT NON FUMEUR. LES COUPONS VIA RAIL NE PEUVENT ETRE',
          'UTILISES POUR DES DEPLACEMENTS AERIENS. SI VOUS DEVEZ MODIFIER',
          'VOTRE ITINERAIRE EN COURS DE ROUTE ASSUREZ-VOUS QUE VOTRE',
          'BILLET EST ENDOSSE PAR LA BILLETTERIE VIA 1.',
          'VEUILLEZ COMMUNIQUER AVEC VIA RAIL AU 1-888-842-7245 POUR',
          'RECONFIRMER LES HEURES DE DEPART/D ARRIVEE DE VOTRE TRAIN.',
        ],
      ],
    },
  ];

  translate(remark, lang) {
    const langIndx = this.getLangIndex(lang);
    const rem = this.remarkLines.find((r) => r[0] === remark);
    return rem ? rem[langIndx] : remark;
  }

  getLangIndex(lang: string) {
    const l = lang.split('-');
    const langIndx = this.language.indexOf(l[0].toUpperCase());
    return langIndx < 0 ? 0 : langIndx;
  }

  getRemarkGroup(groupName, lang) {
    const group = this.groupRemarks.find((x) => x.groupName === groupName);
    if (group) {
      return group.remarks[this.getLangIndex(lang)];
    } else {
      return [];
    }
  }
}
