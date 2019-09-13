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

*** Test Cases ***
Verify That UDID 86 Remark Is Not Written In The PNR When Counselor Identity Is Left Blank
    [Tags]    us9964
    Login To Amadeus Sell Connect Acceptance
    Move Single Passenger And Add Passive Segment With Airline Code 8P
    Add Non-BSP Exchange Ticketing Details For Single Segment Without Ticket Number
    Verify UDID 86 Remark Is Not Written In The PNR
    [Teardown]    Close Browser
    
Verify That UDID 86 Remark Is Updated In The PNR When Coundelor Identity is ESC
    [Tags]    us9964
    Login To Amadeus Sell Connect Acceptance
    Select Counselor Identity: ESC
    Move Single Passenger And Add Passive Segment With Airline Code YP
    Add Non-BSP Exchange Ticketing Details For Single Segment Without Ticket Number
    Verify UDID 86 Remark Is Not Written In The PNR
    [Teardown]    Close Browser
    
Verify That UDID 86 Remark Is Written In The PNR When Coundelor Identity is OFC
    [Tags]    us9964
    Login To Amadeus Sell Connect Acceptance
    Select Counselor Identity: OFC
    Move Single Passenger And Add Multiple Air Passive Segments With Airline Code 4N
    Add Non-BSP Exchange Ticketing Details For Multiple Segments With Ticket Number
    Verify UDID 86 Remark Is Not Written In The PNR
    [Teardown]    Close Browser