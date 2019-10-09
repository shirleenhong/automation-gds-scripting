*** Settings ***
Library           String
Library           SeleniumLibrary
Library           Collections
Library           Screenshot
Library           DateTime
Resource          amadeus.robot
Resource          payment.robot
Resource          ticketing.robot
Resource          reporting.robot

*** Variables ***
${button_sign_out}    css=#uicAlertBox_ok > span.uicButtonBd
${button_close}    //span[@class='xDialog_close xDialog_std_close']
${button_full_wrap}    //button[contains(text(), 'Full Wrap PNR')]
${button_submit_pnr}    //button[@class='leisureBtnSubmit']
${panel_reporting}    //div[@class='panel-title']//div[contains(text(), 'Reporting')]
${panel_payment}    //div[@class='panel-title']//div[contains(text(), 'Payment')]
${panel_ticketing}    //div[@class='panel-title']//div[contains(text(), 'Ticketing')]
${message_updatingPnr}    //div[contains(text(), 'Updating PNR')]
${message_loadingPnr}    //div[contains(text(), 'Loading PNR')]
${list_counselor_identity}    css=#selCounselorIdentity
${input_ticketingDate}    css=#dtxtTicketDate
${checkbox_onHold}    css=#chkOnHold
${panel_fees}    //div[@class='panel-title']//div[contains(text(), 'Fees')]
${button_main_menu}    //button[contains(text(), 'Back To Main Menu')]
${button_save}    //button[contains(text(), 'Save')]

*** Keywords ***
Enter Value
    [Arguments]    ${element}    ${value}
    Double Click Element    ${element}
    Press Key    ${element}    \\08
    Input Text    ${element}    ${value}
    Press Key    ${element}    \\09
    
Close CA Corporate Test
    Unselect Frame
    Wait Until Element Is Not Visible    ${overlay_loader}    20
    Wait Until Element Is Visible    ${header_corp_test}    50
    Click Element    ${button_close}
    Set Test Variable    ${current_page}    Amadeus

Click Full Wrap
    Wait Until Page Contains Element   ${button_full_wrap}    180 
    Click Element    ${button_full_wrap}
    Wait Until Element Is Visible    ${message_loadingPnr}    180
    Wait Until Page Does Not Contain Element    ${message_loadingPnr}    180
    Wait Until Element Is Visible    ${button_submit_pnr}    30
    Set Test Variable    ${current_page}    Full Wrap PNR
    Set Test Variable    ${ticketing_complete}    no

Click Reporting Panel
    Wait Until Element Is Visible    ${panel_reporting}    60
    Click Element    ${panel_reporting}
    Set Test Variable    ${current_page}    Reporting
    
Collapse Reporting Panel
    Wait Until Element Is Visible    ${panel_reporting}    60
    Click Element    ${panel_reporting}
    Set Test Variable    ${current_page}    Full Wrap PNR
    
Click Payment Panel
    Wait Until Element Is Visible    ${panel_payment}    60
    Click Element    ${panel_payment}
    Set Test Variable    ${current_page}    Payment
    [Teardown]    Take Screenshot
    
Collapse Payment Panel
    Wait Until Element Is Visible    ${panel_payment}    60
    Click Element    ${panel_payment}
    Set Test Variable    ${current_page}    Full Wrap PNR
    [Teardown]    Take Screenshot
    
Click Submit To PNR
    [Arguments]    ${close_corporate_test}=yes     ${queueing}=no
    Wait Until Page Contains Element    ${button_submit_pnr}    30
    Scroll Element Into View     ${button_submit_pnr}
    Click Button    ${button_submit_pnr}
    Wait Until Element Is Not Visible     ${message_updatingPnr}    180
    Wait Until Element Is Visible    ${button_full_wrap}    180
    Set Test Variable    ${current_page}     CWT Corporate
    Run Keyword If   "${queueing}" == "yes"     Sleep    5
    Run Keyword If     "${close_corporate_test}" == "yes"     Close CA Corporate Test
    Set Test Variable    ${pnr_submitted}    yes
    
Click Back To Main Menu
    Wait Until Element Is Visible    ${button_main_menu}
    Click Element    ${button_main_menu}
    Set Test Variable    ${current_page}    CWT Corporate
   
Assign Current Date
    ${current_date}    Get Current Date
    ${current_day}     Convert Date     ${current_date}    %d
    ${current_month}     Convert Date     ${current_date}    %m
    ${current_year}     Convert Date     ${current_date}    %y
    ${month}     Convert Month To MMM    ${current_date}
    Set Test Variable    ${current_date}   ${current_day}${month}
    Set Test Variable    ${current_day}
    Set Test Variable    ${current_month}
    Set Test Variable    ${current_year}     20${current_year}
    Set Test Variable    ${date_today}    ${current_year}-${current_month}-${current_day}
    Log    ${current_date} 
    Log    ${current_day}/${current_month}/${current_year}

Convert Month To MMM
    [Arguments]     ${date}
    ${month}    Convert Date    ${date}    %m
    ${month}    Run Keyword If     "${month}" == "01"     Set Variable    JAN    ELSE IF    "${month}" == "02"    Set Variable    FEB     
    ...    ELSE IF    "${month}" == "03"    Set Variable    MAR     ELSE IF    "${month}" == "04"    Set Variable    APR     
    ...    ELSE IF    "${month}" == "05"    Set Variable    MAY     ELSE IF    "${month}" == "06"    Set Variable    JUN
    ...    ELSE IF    "${month}" == "07"    Set Variable    JUL     ELSE IF    "${month}" == "08"    Set Variable    AUG     
    ...    ELSE IF    "${month}" == "09"    Set Variable    SEP     ELSE IF    "${month}" == "10"    Set Variable    OCT
    ...    ELSE IF    "${month}" == "11"    Set Variable    NOV     ELSE IF    "${month}" == "12"    Set Variable    DEC
    Log    ${month}
    [Return]     ${month}

Navigate To Page ${destination_page}
     Set Test Variable    ${i}     1
     : FOR     ${i}    IN RANGE   1    10
     \    ${i}    Evaluate    ${i} + 1
     \    Run Keyword If    "${current_page}" == "Amadeus"     Open CA Corporate Test
     \    Run Keyword If    "${current_page}" == "CWT Corporate" and "${destination_page}" != "CWT Corporate"     Navigate From Corp    ${destination_page}
     \    Run Keyword If    "${current_page}" == "Full Wrap PNR" and "${destination_page}" != "Full Wrap PNR"    Navigate From Full Wrap    ${destination_page}
     \    Run Keyword If    "${current_page}" == "Payment" and "${destination_page}" != "Payment"    Navigate From Payment    ${destination_page}
     \    Run Keyword If    "${current_page}" == "Reporting" or "${current_page}" == "BSP Reporting" or "${current_page}" == "Non BSP Reporting" or "${current_page}" == "Matrix Reporting" or "${current_page}" == "Waivers"   Navigate From Reporting    ${destination_page}
     \    Run Keyword If    "${current_page}" == "Ticketing" or "${current_page}" == "Ticketing Line" or "${current_page}" == "Ticketing Instructions"    Navigate From Ticketing    ${destination_page}
     \    Run Keyword If    "${current_page}" == "Fees" and "${destination_page}" != "Fees"    Navigate From Fees   ${destination_page}
     \    Run Keyword If    "${current_page}" == "Cryptic Display" and "${destination_page}" != "Cryptic Display"     Switch To Command Page
     \    Run Keyword If    "${current_page}" == "Add Accounting Line" and "${ticketing_details}" == "yes"     Click Save Button
     \    Run Keyword If    "${current_page}" == "Add Accounting Line" and "${destination_page}" == "Fees"    Click Fees Panel
     \    Exit For Loop If    "${current_page}" == "${destination_page}" 
     Log    ${current_page}
     Log    ${destination_page}   
     
Navigate From Corp
     [Arguments]    ${destination_page}
     Run Keyword If    "${destination_page}" == "Full Wrap PNR" or "${destination_page}" == "Payment" or "${destination_page}" == "Non BSP Processing" or "${destination_page}" == "Add Accounting Line" or "${destination_page}" == "Matrix Reporting" or "${destination_page}" == "BSP Reporting" or "${destination_page}" == "Non BSP Reporting" or "${destination_page}" == "Ticketing Line" or "${destination_page}" == "Ticketing Instructions" or "${destination_page}" == "Fees" or "${destination_page}" == "Waivers"
     ...    Click Full Wrap
     ...    ELSE    Close CA Corporate Test
    
Navigate From Full Wrap
    [Arguments]    ${destination_page}
    Run Keyword If    "${destination_page}" == "Payment" or "${destination_page}" == "Non BSP Processing" or "${destination_page}" == "Add Accounting Line"    Click Payment Panel
    ...    ELSE IF    "${destination_page}" == "Reporting" or "${destination_page}" == "Matrix Reporting" or "${destination_page}" == "BSP Reporting" or "${destination_page}" == "Non BSP Reporting" or "${destination_page}" == "Waivers"    Click Reporting Panel
    ...    ELSE IF    "${destination_page}" == "Ticketing" or "${destination_page}" == "Ticketing Line" or "${destination_page}" == "Ticketing Instructions"       Click Ticketing Panel
    ...    ELSE IF    "${destination_page}" == "Fees"    Click Fees Panel
    ...    ELSE   Click Back To Main Menu

Navigate From Payment
    [Arguments]    ${destination_page}
    Run Keyword If    "${destination_page}" == "Add Accounting Line"    Navigate To Add Accounting Line
    ...   ELSE     Collapse Payment Panel

Navigate From Reporting
    [Arguments]    ${destination_page}
    Run Keyword If    "${destination_page}" == "BSP Reporting"    Click BSP Reporting Tab
    ...    ELSE IF    "${destination_page}" == "Non BSP Reporting"    Click Non BSP Reporting Tab
    ...    ELSE IF    "${destination_page}" == "Matrix Reporting"    Click Matrix Reporting Tab
    ...    ELSE IF    "${destination_page}" == "Waivers"    Click Waivers Reporting Tab
    ...    ELSE IF    "${destination_page}" == "Ticketing Line"    Click Ticketing Panel
    ...    ELSE    Collapse Reporting Panel
    
Navigate From Ticketing
    [Arguments]    ${destination_page}
    Run Keyword If    "${destination_page}" == "Ticketing Instructions"    Click Ticketing Instructions Tab
    ...   ELSE IF    "${destination_page}" == "Ticketing Line"    Click Ticketing Line Tab

Finish PNR
    [Arguments]     ${close_corporate_test}=yes     ${queueing}=no
    Run Keyword If    "${pnr_submitted}" == "no"    Submit To PNR    ${close_corporate_test}    ${queueing}
    ${status}     Run Keyword And Return Status    Should Not Be Empty  ${pnr_details}  
    Run Keyword If    "${status}" == "False"    Run Keywords        Switch To Graphic Mode    Get PNR Details
    
Submit To PNR
    [Arguments]    ${close_corporate_test}=yes    ${queueing}=no
    Run Keyword If    "${current_page}" == "Add Accounting Line"    Click Save Button
    Run Keyword If    "${ticketing_complete}" == "no"     Fill Up Ticketing Panel With Default Values
    Run Keyword If    "${current_page}" == "Payment" or "${current_page}" == "Reporting" or "${current_page}" == "Full Wrap PNR" or "${current_page}" == "Ticketing" or "${current_page}" == "Ticketing Line" or "${current_page}" == "Ticketing Instructions"
    ...    Click Submit To PNR    ${close_corporate_test}    ${queueing}        
    
Click Ticketing Panel
    Wait Until Element Is Visible    ${panel_ticketing}    60
    Click Element    ${panel_ticketing}
    Set Test Variable    ${current_page}    Ticketing

Select Counselor Identity: ${identity}
    Navigate To Page CWT Corporate
    Wait Until Page Contains Element    ${list_counselor_identity}    30
    Select From List By Label    ${list_counselor_identity}     ${identity}
    Set Test Variable    ${actual_counselor_identity}    ${identity}
    
Verify UDID 86 Remark Is Not Written In The PNR
    Finish PNR
    Verify Specific Remark Is Not Written In The PNR    RM *U86
    
Verify UDID 86 Remark Is Written Correctly In The PNR
    Finish PNR
    Verify Specific Remark Is Written In The PNR    RM *U86/-OVERRIDE ${actual_counselor_identity}
     
Click Fees Panel
    Wait Until Element Is Visible    ${panel_fees}    60
    Click Element    ${panel_fees}
    Set Test Variable    ${current_page}    Fees
    
Navigate From Fees
    [Arguments]    ${destination_page}
    Run Keyword If    "${destination_page}" == "Ticketing"    Click Ticketing Panel
    
Get Client Name
    [Arguments]    ${test_data_string}
    @{split_string}    Split String     ${test_data_string}    ${SPACE}
    ${client_name}    Convert To Lowercase    ${split_string[1]}
    [Return]    ${client_name}

Get Other Remark Values From Json
    [Arguments]    ${json_file_object}     ${client_data}
    : FOR    ${i}    IN RANGE    0     99
    \    ${i}    Evaluate    ${i} + 1
    \    ${exists}     Run Keyword And Return Status      Get Json Value As String    ${json_file_object}    $.['${client_data}'].OtherRemarks${i}
    \    ${other_rmk}     Run Keyword If    "${exists}" == "True"     Get Json Value As String    ${json_file_object}    $.['${client_data}'].OtherRemarks${i}
    \    Set Test Variable    ${other_rmk_${i}}     ${other_rmk}
    \    Exit For Loop If    "${exists}" == "False" or "${other_rmk_${i}}" == "None" 

Get Test Data From Json     
    [Arguments]    ${file_name}     ${client_data}
    ${json_file_object}    Get File    ${file_name}.json     encoding=iso-8859-1    encoding_errors=strict
    Get Passenger Info From Json     ${json_file_object}    ${client_data}
    Get Air Segment Values From Json     ${json_file_object}    ${client_data}
    Get Other Remark Values From Json     ${json_file_object}    ${client_data}
    Get Expected Approval Values From Json    ${json_file_object}    ${client_data}
    ${num_car_segments}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].NumCarSegments
    ${num_htl_segments}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].NumHotelSegments
    Set Test variable    ${num_car_segments}
    Set Test variable    ${num_htl_segments}
    
Get Passenger Info From Json
    [Arguments]    ${json_file_object}     ${client_data}
    ${psngr_1}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].PassengerName1
    ${cfa}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].Client
    ${udid50}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].Udid50
    ${udid25}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].Udid25
    ${email}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].Email
    ${consultant_num}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].ConsultantNo
    ${tkt_line}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].TicketingLine
    ${form_of_payment}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].FormOfPayment
    Set Test Variable    ${psngr_1}
    Set Test Variable    ${cfa}
    Set Test Variable    ${udid50}
    Set Test Variable    ${udid25}
    Set Test Variable    ${email}
    Set Test Variable    ${consultant_num}
    Set Test Variable    ${tkt_line}
    Set Test Variable    ${form_of_payment}

Get Expected Approval Values From Json
    [Arguments]    ${json_file_object}     ${client_data}
    ${with_ui}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].WithUI
    ${ignore_approval}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].IgnoreApproval
    ${primary_approval_reason}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].PrimaryApprovalReason
    ${secondary_approval_reason}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].SecondaryApprovalReason
    ${approver_name}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].ApproverName
    ${total_cost}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].TotalCost
    ${addtl_message}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].AdditionalMessage
    ${queue_approval}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].QueueToApproval
    ${remark_added}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].RemarkAdded
    ${remark_added2}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].RemarkAdded2
    ${remark_added3}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].RemarkAdded3
    ${remark_added4}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].RemarkAdded4
    ${onhold_rmk}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].OnHoldRmk
    ${queue_tkt}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].QueueToTkt
    Set Test Variable    ${with_ui}
    Set Test Variable    ${ignore_approval}
    Set Test Variable    ${primary_approval_reason}
    Set Test Variable    ${secondary_approval_reason}
    Set Test Variable    ${approver_name}
    Set Test Variable    ${total_cost}
    Set Test Variable    ${addtl_message}
    Set Test Variable    ${queue_approval}
    Set Test Variable    ${remark_added}
    Set Test Variable    ${remark_added2}
    Set Test Variable    ${remark_added3}
    Set Test Variable    ${remark_added4}
    Set Test Variable    ${onhold_rmk}
    Set Test Variable    ${queue_tkt}

Get Air Segment Values From Json
    [Arguments]    ${json_file_object}     ${client_data}
    ${num_air_segments}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].NumAirSegments
    Set Test variable    ${num_air_segments}
    : FOR     ${i}    IN RANGE    1    5
    \    ${air_seg_route}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].AirSegmentRoute${i}
    \    ${airline_code}    Get Json Value As String   ${json_file_object}    $.['${client_data}'].AirlineCode${i}
    \    ${price_cmd}    Get Json Value As String    ${json_file_object}    $.['${client_data}'].PriceCommand${i}
    \    Set Test Variable    ${air_seg_route_${i}}    ${air_seg_route}
    \    Set Test Variable    ${airline_code_${i}}    ${airline_code}
    \    Set Test Variable    ${price_cmd_${i}}    ${price_cmd}
    \    ${i}    Evaluate    ${i} + 1