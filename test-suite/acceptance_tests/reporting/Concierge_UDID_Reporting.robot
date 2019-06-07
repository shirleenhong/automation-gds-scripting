*** Settings ***
Resource          ../../resources/common/global_resources.robot

*** Test Cases ***
Verify That Royal Bank Of Canada Concierge UDIDs Are Written In The PNR When CFA Code is RBP
    [Tags]    us7999
    Login To Amadeus Sell Connect
    Enter GDS Command    NM1Leisure/Amadeus Mr    RM*CF/-RBP0000000N    SS AC1074 Y 10DEC YYZCDG GK1 / 11551440 / ABCDEFG    APE12345    TKOK
    Open CA Migration Window
    Click Wrap PNR
    Populate Reporting Required Fields
    Click Reporting Tab    Royal Bank - Concierge
    Select Redemption Added    OUTSIDE 48 Hours of Original Booking
    Select Reservation Request    Reservation was generated via Phone Request
    Select Booking Type    Air Only Booking
    Enter Delegate Caller Name    LEISURE DELAGATENAME
    Select Reservation For Business Travel    NO
    Select Hotel Reservation Booked    NO
    Select Reason Hotel Booked    Personal Accommodations
    Click Submit To PNR
    Close CA Migration Window
    Switch To Graphic Mode
    Open Cryptic Display Window
    Verify Royal Bank Concierge UDID Remarks Are Written    \    \    \    True
    Close Cryptic Display Window

Verify That Fields For The UDID Written Are Disabled In The Leisure Window When CFA code Is RBP
    [Tags]    us7999
    Open CA Migration Window
    Click Wrap PNR
    Click Panel    Reporting
    Click Reporting Tab    Royal Bank - Concierge
    Enter Caller Name    Leisure Callername
    Enter Hotel Name    Hotel Name for Leisure
    Click Submit To PNR
    Close CA Migration Window
    Open Cryptic Display Window
    Verify Royal Bank Concierge UDID Remarks Are Written
    Close Cryptic Display Window
    Logout To Amadeus Sell Connect
    [Teardown]    Close Browser

Verify That Royal Bank Of Canada Concierge UDIDs Are Written In The PNR When CFA Code is RBM
    [Tags]    us7999    us8716
    Login To Amadeus Sell Connect
    Enter GDS Command    NM1Leisure/Amadeus Mr    RM*CF/-RBM0000000N    RU1AHK1MNL12DEC-/TYP-TOR/SUC-ZZ/SC-MNL/SD-12dec/ST-0900/EC-sin/ED-24dec/ET-1800/PS-X    RU1AHK1SIN21NOV-CWT RETENTION SEGMENT    APE12345    TKOK
    Open CA Migration Window
    Click Wrap PNR
    Populate Reporting Required Fields
    Click Reporting Tab    Royal Bank - Concierge
    Select Redemption Added    WITHIN 48 Hours of Original Booking
    Select Reservation Request    Reservation was generated via EMAIL
    Select Booking Type    Cruise/Tour/FIT
    Enter Caller Name    Leisure Callername
    Enter Delegate Caller Name    Leisure Delegatename
    Enter Hotel Name    Hotel Name for Leisure
    Select Reservation For Business Travel    YES
    Select Hotel Reservation Booked    YES
    Click Submit To PNR
    Close CA Migration Window
    Switch To Graphic Mode
    Open Cryptic Display Window
    Verify Royal Bank Concierge UDID Remarks Are Written    Within    Email    Cruise    \    True
    Close Cryptic Display Window

Verify That Royal Bank Of Canada Concierge Hotel UDIDs Are Updated In The PNR
    [Tags]    us8716
    Open CA Migration Window
    Click Wrap PNR
    Click Panel    Reporting
    Click Reporting Tab    Royal Bank - Concierge
    Enter Hotel Name    Hotel Name for Leisure
    Select Hotel Reservation Booked    NO
    Select Reason Hotel Booked    Personal Accommodations
    Click Submit To PNR
    Close CA Migration Window
    Open Cryptic Display Window
    Verify Royal Bank Concierge UDID Remarks Are Written    Within    Email    Cruise
