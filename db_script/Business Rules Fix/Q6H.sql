------------------------------------------------------------------------------
BEGIN TRAN
BEGIN TRY
DECLARE @CreationUserIdentifier nvarchar(200)
DECLARE @CreationTimestamp DATETIME = GETUTCDATE()
DECLARE @ClientSubUnitGuid as varchar(50)
DECLARE @ClientAccountGuid as varchar(50)
DECLARE @ClientTopUnitGuid as  varchar(50)
DECLARE @TravellerTypeGuid as varchar(50)
DECLARE @SourceSystemCode as varchar(50)
DECLARE @NextGroupSequenceNumber as int
DECLARE @CDRGroupName  as varchar(300)
DECLARE @CDRGId as int
DECLARE @WFId_WS_NB as int
DECLARE @WFId_WS_AB as int
DECLARE @WFId_RB_NB as int
DECLARE @WFId_RB_AB as int
DECLARE @WFId_DY_NB as int
DECLARE @WFId_DY_AB as int
DECLARE @WFId_WFPR_NB as int
DECLARE @WFId_WFP_NB as int
declare @WFId_WFUPR_NB as int
declare @WFId_WFUP_NB as int 
DECLARE @AnyTripType as int
DECLARE @bid AS int
DECLARE @logicitemid AS int
DECLARE @resultitemid AS int
declare @shouldmaplogic as bit
declare @shouldmapresult as bit
Declare @WFId_RBPR_NB as int
Declare @WFId_RBP_NB as int
Declare @WFId_RBPR_AB as int
Declare @WFId_RBP_AB as int
DECLARE @WFId_WFPR_AB as int
DECLARE @WFId_WFP_AB as int
DECLARE @CORP_LOAD_FULLWRAP as int

DECLARE @IS AS int
declare @ISNOT as int
declare @CONTAINS as int
declare @NOTCONTAINS as int
DECLARE @CFA as varchar(5) = 'Q6H'
set @CreationUserIdentifier = 'Amadeus CA Migration  ' + @CFA +  ' - US15250'
set @CDRGRoupName = 'Amadeus CA Migration - ' + @CFA +  ' Rule 1'
PRINT 'START ' + @CDRGRoupName 
set @ClientSubUnitGuid = '14:3A7532'
set @TravellerTypeGuid = ''
set @ClientAccountGuid=''
set @SourceSystemCode = 'CA1'
set @ClientTopUnitGuid = ''
SELECT @NextGroupSequenceNumber =1 --- isnull(max(GroupSequenceNumber)+1,1) FROM ClientDefinedRuleGroup WHERE CreationUserIdentifier = @CreationUserIdentifier



---- ROLLBACK
DELETE FROM ClientDefinedRuleGroupResult where CreationUserIdentifier= @CreationUserIdentifier
DELETE FROM ClientDefinedRuleResultItem where CreationUserIdentifier= @CreationUserIdentifier
DELETE FROM ClientDefinedRuleGroupLogic where CreationUserIdentifier= @CreationUserIdentifier
DELETE FROM ClientDefinedRuleLogicItem where CreationUserIdentifier= @CreationUserIdentifier
DELETE FROM ClientDefinedRuleGroupTrigger where CreationUserIdentifier= @CreationUserIdentifier
DELETE FROM ClientDefinedRuleGroupClientSubUnit where CreationUserIdentifier= @CreationUserIdentifier
DELETE FROM ClientDefinedRuleGroup where CreationUserIdentifier= @CreationUserIdentifier




--dbo.ClientDefinedRuleGroup
INSERT INTO ClientDefinedRuleGroup
    ( TripTypeId,ClientDefinedRuleGroupName,CreationTimeStamp,CreationUserIdentifier,LastUpdateTimeStamp,LastUpdateUserIdentifier,VersionNumber,ClientDefinedRuleGroupDescription,EnabledFlag,EnabledDate,ExpiryDate,DeletedFlag,DeletedDateTime,Category)
VALUES
    ( null, @CDRGRoupName, @CreationTimestamp, @CreationUserIdentifier, @CreationTimestamp, @CreationUserIdentifier, 1, @CDRGRoupName, 1, '01/01/2016', null, 0, null, null)


SELECT @CDRGId=ClientDefinedRuleGroupID
FROM dbo.ClientDefinedRuleGroup
WHERE ClientDefinedRuleGroupName = @CDRGRoupName
SELECT @CORP_LOAD_FULLWRAP= ClientDefinedRuleWorkflowTriggerID
FROM ClientDefinedRuleWorkflowTrigger
 wt INNER JOIN
    (SELECT ClientDefinedRuleWorkflowTriggerStateID, ClientDefinedRuleWorkflowTriggerStateName, ClientDefinedRuleWorkflowTriggerApplicationModeID, ClientDefinedRuleWorkflowTriggerApplicationModeName
    from ClientDefinedRuleWorkflowTriggerState
  CROSS JOIN  ClientDefinedRuleWorkflowTriggerApplicationMode) wt2
    ON wt.ClientDefinedRuleWorkflowTriggerStateID = wt2.ClientDefinedRuleWorkflowTriggerStateID
        AND wt.ClientDefinedRuleWorkflowTriggerApplicationModeID = wt2.ClientDefinedRuleWorkflowTriggerApplicationModeID
WHERE wt2.ClientDefinedRuleWorkflowTriggerStateName='CORPLoadPnr' AND
    wt2.ClientDefinedRuleWorkflowTriggerApplicationModeName='CORPFullWrap'

SELECT @IS = ClientDefinedRuleRelationalOperatorid
FROM ClientDefinedRuleRelationalOperator
where RelationalOperatorName = 'IS'
SELECT @ISNOT = ClientDefinedRuleRelationalOperatorid
FROM ClientDefinedRuleRelationalOperator
where RelationalOperatorName = 'IS NOT'
SELECT @CONTAINS = ClientDefinedRuleRelationalOperatorid
FROM ClientDefinedRuleRelationalOperator
where RelationalOperatorName = 'CONTAINS'
SELECT @NOTCONTAINS = ClientDefinedRuleRelationalOperatorid
FROM ClientDefinedRuleRelationalOperator
where RelationalOperatorName = 'NOT CONTAINS'

DECLARE @IN as int
DECLARE @NOTIN as int
SELECT @NOTIN = ClientDefinedRuleRelationalOperatorid
FROM ClientDefinedRuleRelationalOperator
where RelationalOperatorName = 'NOT IN'

SELECT @IN = ClientDefinedRuleRelationalOperatorid
FROM ClientDefinedRuleRelationalOperator
where RelationalOperatorName = 'IN'



DECLARE @GreaterThanEqual as int
DECLARE @LessThanEqual as int 
DECLARE @LessThan as int 
DECLARE @GreaterThan as int

SELECT @GreaterThanEqual = ClientDefinedRuleRelationalOperatorid
FROM ClientDefinedRuleRelationalOperator
where RelationalOperatorName = '>='

SELECT @LessThanEqual = ClientDefinedRuleRelationalOperatorid
FROM ClientDefinedRuleRelationalOperator
where RelationalOperatorName = '<='

SELECT @LessThan= ClientDefinedRuleRelationalOperatorid
FROM ClientDefinedRuleRelationalOperator
where RelationalOperatorName = '<'

SELECT @GreaterThan= ClientDefinedRuleRelationalOperatorid
FROM ClientDefinedRuleRelationalOperator
where RelationalOperatorName = '>'

--ClientDefinedRuleGroupTrigger
INSERT INTO dbo.ClientDefinedRuleGroupTrigger
    ( ClientDefinedRuleGroupId,ClientDefinedRuleWorkflowTriggerId,CreationTimestamp,CreationUserIdentifier,LastUpdateTimeStamp,LastUpdateUserIdentifier,VersionNumber)
VALUES
    ( @CDRGId, @CORP_LOAD_FULLWRAP, @CreationTimestamp, @CreationUserIdentifier, @CreationTimestamp, @CreationUserIdentifier, 1)


DECLARE  @bid2 as int 
DECLARE  @bid3 as int 
DECLARE  @bid4 as int
DECLARE  @bid5 as int 
DECLARE  @bid6 as int 
DECLARE  @bid7 as int




--ClientDefinedRuleLogicItem
SET @bid=null; 
SELECT @bid=ClientDefinedRuleBusinessEntityID
FROM ClientDefinedRuleBusinessEntity
WHERE BusinessEntityName='PNR_CF';  

SET @bid2=null; 
SELECT @bid2=ClientDefinedRuleBusinessEntityID
FROM ClientDefinedRuleBusinessEntity
WHERE BusinessEntityName='PNR_COUNT_DEPARTURE_DATE_FROM_TODAY';

SET @bid3=null; 
SELECT @bid3=ClientDefinedRuleBusinessEntityID
FROM ClientDefinedRuleBusinessEntity
WHERE BusinessEntityName='PNR_UDID50';  

SET @bid4=null; 
SELECT @bid4=ClientDefinedRuleBusinessEntityID
FROM ClientDefinedRuleBusinessEntity
WHERE BusinessEntityName='PNR_AIR_SEGMENT_AIRLINE_CODE';  

SET @bid5=null; 
SELECT @bid4=ClientDefinedRuleBusinessEntityID
FROM ClientDefinedRuleBusinessEntity
WHERE BusinessEntityName='PNR_SEGMENT_TYPES_IN_PNR'; 


SET @logicitemid = null; 


    INSERT INTO dbo.ClientDefinedRuleLogicItem
    ( ClientDefinedRuleLogicItemDescription,ClientDefinedRuleBusinessEntityId,ClientDefinedRuleRelationalOperatorId,ClientDefinedRuleLogicItemValue,CreationTimestamp,CreationUserIdentifier,LastUpdateTimeStamp,LastUpdateUserIdentifier,VersionNumber)
VALUES
    ( @CDRGRoupName, @bid, @IS, @CFA, @CreationTimestamp, @CreationUserIdentifier, @CreationTimestamp, @CreationUserIdentifier, 1),
    (@CDRGRoupName, @bid4, @IN, 'AIR', @CreationTimestamp, @CreationUserIdentifier, @CreationTimestamp, @CreationUserIdentifier, 1);
  
    SET @logicitemid = SCOPE_IDENTITY() - 2


    INSERT INTO dbo.ClientDefinedRuleGroupLogic
    (ClientDefinedRuleLogicItemId, ClientDefinedRuleGroupId, LogicSequenceNumber, CreationTimestamp,CreationUserIdentifier,LastUpdateTimeStamp,LastUpdateUserIdentifier,VersionNumber)
values
    (@logicitemid + 1, @CDRGId, 1 , @CreationTimestamp, @CreationUserIdentifier, @CreationTimestamp, @CreationUserIdentifier, 1),
    (@logicitemid + 2, @CDRGId, 2 , @CreationTimestamp, @CreationUserIdentifier, @CreationTimestamp, @CreationUserIdentifier, 1)


SELECT @bid2= ClientDefinedRuleBusinessEntityID
FROM ClientDefinedRuleBusinessEntity
WHERE BusinessEntityName='UI_DISPLAY_CONTAINER'; 


SELECT @bid3= ClientDefinedRuleBusinessEntityID
FROM ClientDefinedRuleBusinessEntity
WHERE BusinessEntityName='UI_ADD_CONTROL'; 

SELECT @bid4 =  ClientDefinedRuleBusinessEntityID
FROM ClientDefinedRuleBusinessEntity
WHERE BusinessEntityName='PNR_ADD_Remark'; 


 
    INSERT INTO dbo.ClientDefinedRuleResultItem
    ( ClientDefinedRuleResultItemDescription,ClientDefinedRuleBusinessEntityId,ClientDefinedRuleResultItemValue,CreationTimestamp,CreationUserIdentifier,LastUpdateTimeStamp,LastUpdateUserIdentifier,VersionNumber)
VALUES

    ( @CDRGRoupName, @bid2, 'REPORTING', @CreationTimestamp, @CreationUserIdentifier, @CreationTimestamp, @CreationUserIdentifier, 1),
    ( @CDRGRoupName, @bid3, '{ "type": "select", "label": "Why air booked within 14 days", "name": "reasonAirBooked14Days", "required": "false", "options": [ { "name": "Emergency Travel Required", "value": "EMER" }, { "name": "Medical/Health Reason/Physical", "value": "MEDI" }, { "name": "Customer requested Meeting/short notice", "value": "CSTR" }, { "name": "Site Visit", "value": "AUDT" }, { "name": "Interview/Recruiting", "value": "APPL" }, { "name": "High Priority/Special Project", "value": "PROJ" }, { "name": "EXPAT/Homeleave", "value": "EXPA" }, { "name": "Conference/Training", "value": "TRAN" }, { "name": "Meeting upon return from annual leave", "value": "ANNU" }, { "name": "Booked over 14 days", "value": "NA" } ] }', @CreationTimestamp, @CreationUserIdentifier, @CreationTimestamp, @CreationUserIdentifier, 1),
    ( @CDRGRoupName, @bid3, '{ "type": "select", "label": "Hotel Not Booked", "name": "hotelNotBooked", "required": "true", "options": [ { "name": "Travelers Client/Vendor Booked Hotel", "value": "CH" }, { "name": "Hotel booked as part of a meeting", "value": "MH" }, { "name": "Staying with friends/family", "value": "FH" }, { "name": "Hotel was booked", "value": "BH" }, { "name": "No Overnight Stay", "value": "OS" } ] }', @CreationTimestamp, @CreationUserIdentifier, @CreationTimestamp, @CreationUserIdentifier, 1),
    ( @CDRGRoupName, @bid4, 'RM* U11/-[UI_FORM_reasonAirBooked14Days]', @CreationTimestamp, @CreationUserIdentifier, @CreationTimestamp, @CreationUserIdentifier, 1),
    ( @CDRGRoupName, @bid4, 'RM* U15/-[UI_FORM_hotelNotBooked]', @CreationTimestamp, @CreationUserIdentifier, @CreationTimestamp, @CreationUserIdentifier, 1)



SET @resultitemid = SCOPE_IDENTITY() - 5; -- count of records


    INSERT INTO dbo.ClientDefinedRuleGroupResult
    (ClientDefinedRuleResultItemId, ClientDefinedRuleGroupId, CreationTimestamp,CreationUserIdentifier,LastUpdateTimeStamp,LastUpdateUserIdentifier,VersionNumber)
values
    (@resultitemid + 1, @CDRGId, @CreationTimestamp, @CreationUserIdentifier, @CreationTimestamp, @CreationUserIdentifier, 1),
    (@resultitemid + 2, @CDRGId, @CreationTimestamp, @CreationUserIdentifier, @CreationTimestamp, @CreationUserIdentifier, 1),
    (@resultitemid + 3, @CDRGId, @CreationTimestamp, @CreationUserIdentifier, @CreationTimestamp, @CreationUserIdentifier, 1),
    (@resultitemid + 4, @CDRGId, @CreationTimestamp, @CreationUserIdentifier, @CreationTimestamp, @CreationUserIdentifier, 1),
    (@resultitemid + 5, @CDRGId, @CreationTimestamp, @CreationUserIdentifier, @CreationTimestamp, @CreationUserIdentifier, 1)

	

IF NOT EXISTS(Select 1
from ClientAccount
where ClientAccountNumber='1' + @CFA)
BEGIN

    INSERT INTO [dbo].[ClientAccount]
        ([ClientAccountNumber],[ClientAccountName],[SourceSystemCode],[GloryAccountName],[ClientMasterCode]
        ,[EffectiveDate],[CountryCode],[LastModifiedTimestamp],[CreationTimestamp],[CreationUserIdentifier],[LastUpdateTimestamp],[LastUpdateUserIdentifier],[VersionNumber],[CFA])
    VALUES
        ('1' + @CFA, 'BACARDI CANADA', 'CA1', 'BACARDI CANADA', 'CA-' + @CFA, '2000-01-01 00:00:00.000', 'CA', @CreationTimeStamp, @CreationTimeStamp, 'GloryLink', null, null, 1, null)

END

INSERT INTO [ClientDefinedRuleGroupClientAccount]
    (ClientDefinedRuleGroupId, ClientAccountNumber, SourceSystemCode, CreationTimestamp,CreationUserIdentifier,LastUpdateTimeStamp,LastUpdateUserIdentifier,VersionNumber)
VALUES
    (@CDRGId, @CFA, 'CA1', @CreationTimestamp, @CreationUserIdentifier, @CreationTimestamp, @CreationUserIdentifier, 1)

SELECT @CDRGID, @CDRGRoupName , @resultitemid

COMMIT TRAN
END TRY
BEGIN CATCH
ROLLBACK TRAN
DECLARE @ErrorMessage NVARCHAR(4000);
SELECT @ErrorMessage=ERROR_MESSAGE()
RAISERROR(@ErrorMessage, 10, 1);
END CATCH
Go
------------------------------------------------------------------------------