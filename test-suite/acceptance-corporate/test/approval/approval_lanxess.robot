*** Settings ***
Force Tags        corp
Library           String
Library           SeleniumLibrary
Library           Collections
Library           Screenshot
Resource          ../../pages/amadeus.robot
Resource          ../../pages/base.robot
Resource          ../../pages/payment.robot
Resource          ../../pages/reporting.robot
Resource          ../../pages/ticketing.robot
Resource          ../../../resources/common/api-utilities.txt

*** Test Cases ***
Verify That PNRs For Client Lanxess Is Correctly Queued To Approval Queue When Missed Savings Is Selected In Primary Approval Reason
    [Tags]    us13271
    Login To Amadeus Sell Connect Acceptance
    Create PNR With Active Air Segments For Client Lanxess With Any Udid 50, Air Only, Select Missed Savings
    Fill Up Approval Fields
    Verify PNR Approval Is Processed Correctly
    [Teardown]    Logout To Amadeus Sell Connect
    
Verify That PNRs For Client Lanxess Is Correctly Queued To Approval Queue When Total Cost Is Selected In Primary Approval Reason
    [Tags]    us13271
    Login To Amadeus Sell Connect Acceptance
    Create PNR With Active Air Segments For Client Lanxess With Any Udid 50, Air Only, Select Total Cost
    Fill Up Approval Fields
    Verify PNR Approval Is Processed Correctly
    [Teardown]    Logout To Amadeus Sell Connect
    
Verify That PNRs For Client Lanxess Is Correctly Queued To Approval Queue When Travel To Germany Is Selected In Primary Approval Reason
    [Tags]    us13271
    Login To Amadeus Sell Connect Acceptance
    Create PNR With Active Air Segments For Client Lanxess With Any Udid 50, Air Only, Select Travel To Germany
    Fill Up Approval Fields
    Verify PNR Approval Is Processed Correctly
    [Teardown]    Logout To Amadeus Sell Connect
    
Verify That Non Air Only PNRs For Client Lanxess Do Not Go Thru Approval Process
    [Tags]    us13271
    Login To Amadeus Sell Connect Acceptance
    Create PNR For Client Lanxess With Any Udid 50, Hotel and Car Only
    Fill Up Approval Fields
    Verify PNR Approval Is Processed Correctly
    [Teardown]    Logout To Amadeus Sell Connect
    
