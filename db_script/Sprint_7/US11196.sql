USE Desktop_TEST
GO

BEGIN TRAN

BEGIN TRY
       
        DECLARE @CreationUserIdentifier             NVARCHAR(150) 
        DECLARE @CreationTimestamp                  DATETIME = GETUTCDATE()
        DECLARE @ReasonCodeGroupId              INT
        DECLARE @ReasonCodeItemId           INT
		DECLARE @ReasonCodeTypeId INT 
        ------------------
        --- ROLLBACK
        ------------------
        --- US731
        SET @CreationUserIdentifier      = 'Amadeus CA Migration - US11196'
		--select * from ReasonCodeGroup WHERE CreationUserIdentifier=@CreationUserIdentifier


        DELETE FROM [ReasonCodeGroupClientSubUnit]                      WHERE CreationUserIdentifier=@CreationUserIdentifier
        DELETE FROM ReasonCodeGroupCountry                      WHERE CreationUserIdentifier=@CreationUserIdentifier
        DELETE FROM ReasonCodeProductTypeTravelerDescription    WHERE CreationUserIdentifier=@CreationUserIdentifier
        DELETE FROM ReasonCodeProductTypeDescription            WHERE CreationUserIdentifier=@CreationUserIdentifier
        DELETE FROM ReasonCodeAlternativeDescription            WHERE CreationUserIdentifier=@CreationUserIdentifier
        DELETE FROM ReasonCodeItem                              WHERE CreationUserIdentifier=@CreationUserIdentifier
        DELETE FROM ReasonCodeGroup                             WHERE CreationUserIdentifier=@CreationUserIdentifier
        DELETE FROM ReasonCodeProductType                       WHERE CreationUserIdentifier=@CreationUserIdentifier
	
		DELETE FROM ReasonCodeType                   WHERE CreationUserIdentifier=@CreationUserIdentifier

		SET  @ReasonCodeTypeId = (select max(ReasonCodeTypeId)
from ReasonCodeType) + 1

	  INSERT INTO dbo.ReasonCodeType
   (ReasonCodeTypeId,ReasonCodeTypeDescription,CreationTimestamp,CreationUserIdentifier,LastUpdateTimestamp,LastUpdateUserIdentifier,VersionNumber)
VALUES
   (@ReasonCodeTypeId, 'EB Matrix Touch Reason', @CreationTimestamp, @CreationUserIdentifier, null, null, 1)


        
        INSERT INTO  ReasonCodeGroup
   (ReasonCodeGroupName,EnabledFlag,EnabledDate,DeletedFlag,CreationUserIdentifier,CreationTimestamp,VersionNumber)
VALUES
   ('Canada_Touch_Reason_Code', 1, null, 0, @CreationUserIdentifier, @CreationTimestamp, 1)
              SET @ReasonCodeGroupId =  SCOPE_IDENTITY()

		INSERT INTO ReasonCodeProductType
   (ReasonCode,ProductId,ReasonCodeTypeId,CreationUserIdentifier,CreationTimestamp,VersionNumber,AwaitingApprovalFlag)
VALUES
   ('A', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1, 0),
   ('C', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1, 0),
   ('D', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1, 0),
   ('E', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1, 0),
   ('F', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1, 0),
   ('H', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1, 0),
   ('I', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1, 0),
   ('L', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1, 0),
   ('M', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1, 0),
   ('N', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1, 0),
   ('R', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1, 0),
   ('S', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1, 0),
   ('T', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1, 0),
   ('U', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1, 0)

	INSERT INTO ReasonCodeProductTypeDescription
   (ReasonCodeProductTypeDescription,ReasonCode,LanguageCode,PRoductId,ReasonCodeTypeId, CreationUserIdentifier,CreationTimestamp,VersionNumber)
VALUES
   ('Air'								, 'A', 'en-GB', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1),
   ('Car '										, 'C', 'en-GB', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1),
   ('Customized Data'							, 'D', 'en-GB', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1),
   ('Exchange ticket'							, 'E', 'en-GB', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1),
   ('Fare'										, 'F', 'en-GB', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1),
   ('Hotel'									, 'H', 'en-GB', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1),
   ('Instant purchase carrier'  				, 'I', 'en-GB', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1),
   ('Limo'										, 'L', 'en-GB', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1),
   ('Credit card'								, 'M', 'en-GB', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1),
   ('Lack of automation by SBT or mid office'  , 'N', 'en-GB', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1),
   ('Rail'										, 'R', 'en-GB', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1),
   ('Special requests'							, 'S', 'en-GB', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1),
   ('International assistance'					, 'T', 'en-GB', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1),
   ('Upgrades'									, 'U', 'en-GB', 8, @ReasonCodeTypeId, @CreationUserIdentifier, @CreationTimestamp, 1)
      

        --- HK Insert Hotel Realised and Hotel Missed
        INSERT INTO  ReasonCodeItem
   (DisplayOrder,ReasonCodeGroupId,ReasonCode,ReasonCodeTypeId,ProductId,TravelerFacingFlag,CreationUserIdentifier,CreationTimestamp,VersionNumber)
VALUES
   ( 1, @ReasonCodeGroupId, 'A', @ReasonCodeTypeId, 8, 1, @CreationUserIdentifier, @CreationTimestamp, 1),
   ( 2, @ReasonCodeGroupId, 'C', @ReasonCodeTypeId, 8, 1, @CreationUserIdentifier, @CreationTimestamp, 1),
   ( 3, @ReasonCodeGroupId, 'D', @ReasonCodeTypeId, 8, 1, @CreationUserIdentifier, @CreationTimestamp, 1),
   ( 4, @ReasonCodeGroupId, 'E', @ReasonCodeTypeId, 8, 1, @CreationUserIdentifier, @CreationTimestamp, 1),
   ( 5, @ReasonCodeGroupId, 'F', @ReasonCodeTypeId, 8, 1, @CreationUserIdentifier, @CreationTimestamp, 1),
   ( 6, @ReasonCodeGroupId, 'H', @ReasonCodeTypeId, 8, 1, @CreationUserIdentifier, @CreationTimestamp, 1),
   ( 7, @ReasonCodeGroupId, 'I', @ReasonCodeTypeId, 8, 1, @CreationUserIdentifier, @CreationTimestamp, 1),
   ( 8, @ReasonCodeGroupId, 'L', @ReasonCodeTypeId, 8, 1, @CreationUserIdentifier, @CreationTimestamp, 1),
   ( 9, @ReasonCodeGroupId, 'M', @ReasonCodeTypeId, 8, 1, @CreationUserIdentifier, @CreationTimestamp, 1),
   (10, @ReasonCodeGroupId, 'N', @ReasonCodeTypeId, 8, 1, @CreationUserIdentifier, @CreationTimestamp, 1),
   (11, @ReasonCodeGroupId, 'R', @ReasonCodeTypeId, 8, 1, @CreationUserIdentifier, @CreationTimestamp, 1),
   (12, @ReasonCodeGroupId, 'S', @ReasonCodeTypeId, 8, 1, @CreationUserIdentifier, @CreationTimestamp, 1),
   (13, @ReasonCodeGroupId, 'T', @ReasonCodeTypeId, 8, 1, @CreationUserIdentifier, @CreationTimestamp, 1),
   (14, @ReasonCodeGroupId, 'U', @ReasonCodeTypeId, 8, 1, @CreationUserIdentifier, @CreationTimestamp, 1)


				
   --     Insert into [ReasonCodeGroupClientSubUnit] (ReasonCodeGroupId,ClientSubUnitGuid,CreationTimestamp,CreationUserIdentifier)
			--values(@ReasonCodeGroupId,'A:FA177',GETUTCDATE(),@CreationUserIdentifier)    
                          
        INSERT INTO ReasonCodeGroupCountry
   (CountryCode,ReasonCodeGroupId,CreationUserIdentifier,CreationTimestamp,VersionNumber)
VALUES
   ('CA', @ReasonCodeGroupId, @CreationUserIdentifier, @CreationTimestamp, 1)
      

        SET @ReasonCodeItemId  =  (SELECT min(ReasonCodeItemId)
FROM ReasonCodeItem
where ReasonCodeGroupId=@ReasonCodeGroupId) -1
        INSERT INTO ReasonCodeAlternativeDescription
   (ReasonCodeAlternativeDescription,LanguageCode,ReasonCodeItemId, CreationUserIdentifier,CreationTimestamp,VersionNumber)
VALUES
   ('Air'										, 'en-GB', @ReasonCodeItemId+1 , @CreationUserIdentifier, @CreationTimestamp, 1),
   ('Car '										, 'en-GB', @ReasonCodeItemId+2 , @CreationUserIdentifier, @CreationTimestamp, 1),
   ('Customized Data'							, 'en-GB', @ReasonCodeItemId+3 , @CreationUserIdentifier, @CreationTimestamp, 1),
   ('Exchange ticket'							, 'en-GB', @ReasonCodeItemId+4 , @CreationUserIdentifier, @CreationTimestamp, 1),
   ('Fare'										, 'en-GB', @ReasonCodeItemId+5 , @CreationUserIdentifier, @CreationTimestamp, 1),
   ('Hotel'									, 'en-GB', @ReasonCodeItemId+6 , @CreationUserIdentifier, @CreationTimestamp, 1),
   ('Instant purchase carrier'  				, 'en-GB', @ReasonCodeItemId+7 , @CreationUserIdentifier, @CreationTimestamp, 1),
   ('Limo'										, 'en-GB', @ReasonCodeItemId+8 , @CreationUserIdentifier, @CreationTimestamp, 1),
   ('Credit card'								, 'en-GB', @ReasonCodeItemId+9 , @CreationUserIdentifier, @CreationTimestamp, 1),
   ('Lack of automation by SBT or mid office'  , 'en-GB', @ReasonCodeItemId+10, @CreationUserIdentifier, @CreationTimestamp, 1),
   ('Rail'										, 'en-GB', @ReasonCodeItemId+11, @CreationUserIdentifier, @CreationTimestamp, 1),
   ('Special requests'							, 'en-GB', @ReasonCodeItemId+12, @CreationUserIdentifier, @CreationTimestamp, 1),
   ('International assistance'					, 'en-GB', @ReasonCodeItemId+13, @CreationUserIdentifier, @CreationTimestamp, 1),
   ('Upgrades'									, 'en-GB', @ReasonCodeItemId+14, @CreationUserIdentifier, @CreationTimestamp, 1)
      
        COMMIT TRAN

    END TRY

BEGIN CATCH

       ROLLBACK TRAN

       PRINT 'ERROR OCCURRED! Rolled back transactions if there are any:' 
    PRINT ERROR_NUMBER() 
       PRINT 'Error Severity: ' 
    PRINT ERROR_SEVERITY() 
       PRINT 'Error State: ' 
    PRINT ERROR_STATE() 
       PRINT 'Error Procedure: ' 
    PRINT ERROR_PROCEDURE() 
       PRINT 'Error Line: ' 
    PRINT ERROR_LINE() 
       PRINT 'Error Message: ' 
    PRINT ERROR_MESSAGE(); 

END CATCH 

