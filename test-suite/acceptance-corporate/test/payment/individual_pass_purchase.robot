*** Settings ***
Force Tags        corp
Library           String
Library           SeleniumLibrary
Library           Collections
Library           Screenshot
Resource          ../../pages/amadeus.robot
Resource          ../../pages/base.robot
Resource          ../../pages/payment.robot

*** Test Cases ***
Verify That Matrix Accounting Remark Is Written For Air Canada Individual Pass Purchase PNR
    Login To Amadeus Sell Connect Acceptance
    Move Single Passenger
    Open CA Corporate Test
    Click Full Wrap
    Click Payment Panel
    Add Matrix Accounting Remark For Air Canada Pass Purchase
    Verify PE Remark Are Written For Air Canada Pass Purchase PNR
    Verify Supplier Code Default Value Is Correct For Air Canada Individual Pass Purchase
    Click Save Button