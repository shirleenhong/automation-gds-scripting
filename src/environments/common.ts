export const common = {
  clientId: 'int.powerbaseaws.amadeus',
  tokenService: '/service/repo/powerbaseaws/oauth2/token/',
  locationService: '/service/repo/powerbaseaws/Location/Country?LanguageCode=en-GB',
  travelportService: '/service/repo/powerbaseaws/TravelPorts/Airport?TravelPortCode=',
  supplierCodes: '/service/repo/powerbaseaws/Suppliers?CountryCode=CA',
  airTravelportsService: '/service/repo/powerbaseaws/TravelPorts/Airport',
  cdrItemService: '/service/repo/powerbaseaws/ClientDefinedReferenceItem/',
  cdrItemsByClientAccountService: '/service/repo/powerbaseaws/ClientDefinedReferenceItemsByClientAccountNumber/ClientAccountNumber/',
  cdrItemsByClientSubUnitService: '/service/repo/powerbaseaws/ClientDefinedReferenceItemsByClientSubUnitClientAccount/',
  cdrItemsCreditCardListService: '/service/repo/powerbaseaws/ClientDefinedReferenceItemsCreditCardList/',
  cdrItemListService: '/service/repo/powerbaseaws/ClientDefinedReferenceItemsList/',
  cdrItemValuesService: '/service/repo/powerbaseaws/ClientDefinedReferenceItemValues/',
  cdrItemValuesBySharedValuesGroupIdService: '/service/repo/powerbaseaws/ClientDefinedReferenceItemValuesBySharedValuesGroupId/',
  servicingOptionService: '/service/repo/powerbaseaws/ServiceOptions?ClientSubUnitGuid=',
  feesService: '/service/repo/powerbaseaws/ClientSubUnits/{ClientSubUnitGuid}/ClientFees',
  reasonCodesByClientSubUnitService: '/service/repo/powerbaseaws/ClientSubUnits/{ClientSubUnitGuid}/ReasonCodes',
  reasonCodesService: '/service/repo/powerbaseaws/ReasonCodes',
  reasonCodesByProductIdService: '/service/repo/powerbaseaws/ReasonCodesByProductId/',
  reasonCodesByTypeIdService: '/service/repo/powerbaseaws/ReasonCodesByReasonCodeTypeId/',
  reasonCodesByProductIdAndTypeIdService: '/service/repo/powerbaseaws/ReasonCodes/{ProductId}/{ReasonCodeTypeId}/',
  configurationParameterService: '/service/repo/powerbaseaws/ConfigurationParameter',
  approversService: '/service/repo/powerbaseaws/Approvers?ClientSubUnitGuid=',
  queueMinderItemService: '/service/repo/powerbaseaws/ClientSubUnits/{ClientSubUnitGuid}/QueueMinderItems?QueueMinderTypeIds=',
  queueMinderTypeService: '/service/repo/powerbaseaws/ClientSubUnits/{ClientSubUnitGuid}/QueueMinderTypes?GDSCode=1A',
  ticketQueueService: '/service/repo/powerbaseaws/ClientSubUnits/{ClientSubUnitGuid}/TicketQueues?GDSCode=1A',
  matchedPlacholderValueService: '/remarks-manager-rest/api/matched-placeholder-values',
  pnrAmadeusRequestService: '/remarks-manager-rest/api/pnr-amadeus-request',
  LeisureVersionNumber: '19.8.1'
};
