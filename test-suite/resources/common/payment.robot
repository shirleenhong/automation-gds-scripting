*** Settings ***
Resource          common_library.robot

*** Keywords ***
Click Add Matrix Receipt Button
    Sleep    5
    Click Element    xpath=//button[contains(text(), 'Add Matrix Receipt')]

Select Bank Account
    [Arguments]    ${bank_account}
    Click Element    css=#bankAccount    #${payment.bank_account}
    Click Element    xpath=//option[contains(text(), '${bank_account}')]
    Set Suite Variable    ${bank_account}

Select Passenger Name
    [Arguments]    ${passenger_name}
    Click Element    css=#pasenger
    Click Element    xpath=//option[contains(text(), '${passenger_name}')]
    Set Suite Variable    ${passenger_name}

Enter Description
    [Arguments]    ${description}
    Double Click Element    css=#description
    Press Key    css=#description    \\08
    Input Text    css=#description    ${description}
    Set Suite Variable    ${description}

Enter Amount
    [Arguments]    ${amount}
    Double Click Element    css=#amount
    Press Key    css=#amount    \\08
    Input Text    css=#amount    ${amount}
    Set Suite Variable    ${amount}

Enter GC Number
    [Arguments]    ${gc_number}
    Double Click Element    css=#gcNumber
    Press Key    css=#gcNumber    \\08
    Input Text    css=#gcNumber    ${gc_number}
    Set Suite Variable    ${gc_number}

Select Mode Of Payment
    [Arguments]    ${mode_of_payment}
    Click Element    css=#modePayment
    Click Element    xpath=//option[contains(text(), '${mode_of_payment}')]

Click Save Button
    Click Element    xpath=//button[contains(text(), 'Save')]
    Wait Until Page Contains Element    xpath=//tr[1]//i[@class='fas fa-edit']    30
    Focus    xpath=//button[contains(text(), 'SUBMIT TO PNR')]
    [Teardown]    Take Screenshot

Enter Credit Card Number
    [Arguments]    ${credit_card_number}
    Double Click Element    css=#ccNo
    Press Key    css=#ccNo    \\08
    Input Text    css=#ccNo    ${credit_card_number}
    Set Suite Variable    ${credit_card_number}

Enter Credit Card Expiration Date
    [Arguments]    ${exp_date}
    Double Click Element    css=#expDate
    Press Key    css=#expDate    \\08
    Input Text    css=#expDate    ${exp_date}

Enter RBC Points
    [Arguments]    ${rbc_points}
    Double Click Element    css=#points
    Press Key    css=#points    \\08
    Input Text    css=#points    ${rbc_points}
    Set Suite Variable    ${rbc_points}

Enter CWT Reference
    [Arguments]    ${cwt_reference}
    Double Click Element    css=#cwtRef
    Press Key    css=#cwtRef    \\08
    Input Text    css=#cwtRef    ${cwt_reference}
    Set Suite Variable    ${cwt_reference}

Enter Last Four Digit VI
    [Arguments]    ${last_four_vi}
    Double Click Element    css=#lastFourVi
    Press Key    css=#lastFourVi    \\08
    Input Text    css=#lastFourVi    ${last_four_vi}
    Set Suite Variable    ${last_four_vi}

Click Payment Tab
    [Arguments]    ${payment_tab}
    Wait Until Page Contains Element    xpath=//span[contains(text(), '${payment_tab}')]    60
    Click Element    xpath=//span[contains(text(), '${payment_tab}')]

Select Traveler Province
    [Arguments]    ${province}
    Select From List    css=#address    ${province}

Select Segment Association
    [Arguments]    ${segment_assoc}
    Select From List    xpath=//select[@id=' segmentAssoc']    ${segment_assoc}

Enter Credit Card Vendor
    [Arguments]    ${cc_vendor}
    Input Text    css=#vendorCode    ${cc_vendor}

Select Segment Number
    [Arguments]    ${segment_num}
    Select From List    xpath=//select[@id='segmentNum']    ${segment_num}

Select Leisure Fee Form of Payment
    [Arguments]    ${form_of_payment}
    Select From List    css=#paymentType    ${form_of_payment}

Select Credit Card Vendor Code
    [Arguments]    ${cc_vendor_code}
    Wait Until Page Contains Element    css=#vendorCode    30
    Click Element    css=#vendorCode
    Click Element    xpath=//option[contains(text(),'${cc_vendor_code}')]
    Set Suite Variable    ${cc_vendor_code}

Enter Reason for No Association Fees
    [Arguments]    ${no_fee_reason}
    #add reason no assoc fee
    Wait Until Element Is Visible    css=#noFeeReason    30
    Clear Element Text    css=#noFeeReason
    Input Text    css=#noFeeReason    ${no_fee_reason}

Click Add Accounting Line Button
    Click Element    xpath=//button[contains(text(), 'Add Accounting Line')]

Enter Matrix Accounting Description
    [Arguments]    ${remark_description}
    Wait Until Page Contains Element    css=#descriptionapay    30
    Click Element  css=#descriptionapay
    Input Text  css=#descriptionapay    ${remark_description}
    Set Suite Variable    ${remark_description}

Select Accounting Remark Type
    [Arguments]    ${accounting_remark_type}
    Click Element    css=#accountingTypeRemark
    Click Element    xpath=//option[contains(text(),'${accounting_remark_type}')]
    ${remark_description}    Set Variable    ${accounting_remark_type}
    Set Suite Variable    ${accounting_remark_type}

Select Passenger Number
    [Arguments]    ${passenger_number}
    Click Element    css=#passengerNo
    Click Element    xpath=//option[contains(text(),'${passenger_number}')]
    Press Key    css=#passengerNo    \\09
    Set Suite Variable    ${passenger_number}

Enter Supplier Code
    [Arguments]    ${supplier_code}
    Double Click Element    css=#supplierCodeName
    Press Key    css=#supplierCodeName    \\08
    Input Text    css=#supplierCodeName    ${supplier_code}
    Set Suite Variable    ${supplier_code}

Enter Supplier Confirmation Number
    [Arguments]    ${supplier_confirmation_number}
    Click Element    css=#supplierConfirmatioNo
    Input Text    css=#supplierConfirmatioNo    ${supplier_confirmation_number}
    Set Suite Variable    ${supplier_confirmation_number}

Select Matrix Form Of Payment
    [Arguments]    ${fop}
    Click Element    css=#fop
    Click Element    xpath=//option[contains(text(),'${fop}')]
    Click Element    css=#fop
    Press Key    css=#fop    \\09
    Set Suite Variable    ${fop}

Enter Base Amount
    [Arguments]    ${base_amount}
    Double Click Element    css=#baseAmount
    Press Key    css=#baseAmount    \\08
    Input Text    css=#baseAmount    ${base_amount}
    Set Suite Variable    ${base_amount}
    [Teardown]    Take Screenshot

Enter Commission With Tax Amount
    [Arguments]    ${commission_with_tax}
    # Press Key    css=#baseAmount    \\09
    Double Click Element    css=#commisionWithoutTax
    Press Key    css=#commisionWithoutTax    \\08
    Input Text    css=#commisionWithoutTax    ${commission_with_tax}
    Set Suite Variable    ${commission_with_tax}
    [Teardown]    Take Screenshot

Enter GST Tax Amount
    [Arguments]    ${gst_tax}
    Double Click Element    css=#gst
    Press Key    css=#gst    \\08
    Input Text    css=#gst    ${gst_tax}
    Set Suite Variable    ${gst_tax}
    [Teardown]    Take Screenshot

Enter HST Tax Amount
    [Arguments]    ${hst_tax}
    Double Click Element    css=#hst
    Press Key    css=#hst    \\08
    Input Text    css=#hst    ${hst_tax}
    Set Suite Variable    ${hst_tax}
    [Teardown]    Take Screenshot

Enter QST Tax Amount
    [Arguments]    ${qst_tax}
    Double Click Element    css=#qst
    Press Key    css=#qst    \\08
    Input Text    css=#qst    ${qst_tax}
    Set Suite Variable    ${qst_tax}
    [Teardown]    Take Screenshot

Enter Other Tax Amount
    [Arguments]    ${other_tax}
    Double Click Element    css=#otherTax
    Press Key    css=#otherTax    \\08
    Input Text    css=#otherTax    ${other_tax}
    Set Suite Variable    ${other_tax}
    [Teardown]    Take Screenshot

Enter Ticket Number
    [Arguments]    ${ticket_number}
    Double Click Element    css=#tktLine
    Press Key    css=#tktLine    \\08
    Input Text    css=#tktLine    ${ticket_number}
    Set Suite Variable    ${ticket_number}

Enter Price Vs Other Supplier
    [Arguments]    ${price_vs_supplier}
    #enter price vs other supplier value
    Input Text    css=#priceVsSupplier    ${price_vs_supplier}

Select Is This Air Only?
    [Arguments]    ${is_this_air}
    #select is this air only
    Wait Until Element Is Visible    css=#airOnly    30
    Select from list    css=#airOnly    ${is_this_air}

Enter Hotel/ Property Name
    [Arguments]    ${property_name}
    #enter hotel/property name
    Input Text    css=#propertyName    ${property_name}

Select Flights
    [Arguments]    ${select_flight}
    #select flight
    Select From List    css=#flightType    ${select_flight}

Select Exclusive Property
    [Arguments]    ${exclusive_property}
    #select exclusive property?
    Select From List    css=#exclusiveProperty    ${exclusive_property}

Enter Group
    [Arguments]    ${group}
    #select group
    Select From List    css=#group    ${group}
    [Teardown]    Take Screenshot

Select Preferred Vendor
    [Arguments]    ${preferred_vendor}
    #select preferred vendor
    Select From List    css=#preferredVendor    ${preferred_vendor}
    [Teardown]    Take Screenshot

Click Payment Update Button
    [Arguments]    ${edit_order}
    Click Element    xpath=//tr[${edit_order}]//i[@class='fas fa-edit']

Click Payment Delete Button
    [Arguments]    ${delete_order}
    Click Element    xpath=//tr[${delete_order}]//i[@class=' fas fa-trash-alt']

Tick Update Leisure Fee
    Click Element    xpath=//input[@id='chkUpdateRemove']

Enter Commission Percentage
    [Arguments]    ${commission_percent}
    Double Click Element    css=#commisionPercentage
    Press Key    css=#commisionPercentage    \\08
    Input Text    css=#commisionPercentage    ${commission_percent}

Select Segment
    [Arguments]    @{segment_number}
    Wait Until Element Is Visible  xpath=//app-segment-select[@id='segmentNo']//button[@id='button-basic']  30
    Click Button    xpath=//app-segment-select[@id='segmentNo']//button[@id='button-basic']
    Wait Until Element Is Visible    xpath=//ul[@id='dropdown-basic']       30
    :FOR    ${segment_number}    IN    @{segment_number}
    \    Click Element    xpath=//ul[@id='dropdown-basic']//input[@value='${segment_number}']
    Click Element    xpath=//app-segment-select[@id='segmentNo']//button[@id='button-basic']
    Take Screenshot