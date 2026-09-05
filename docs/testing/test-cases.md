# Manual Test Cases — Food Ordering System

| ID | Feature | Objective | Preconditions | Test Steps | Test Data | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|---|---|
| TC-01 | Add Record | Verify a valid order can be added | App is loaded, form is empty | 1. Fill all fields 2. Click "Add Order" | Customer: Ana Reyes, Items: 1x Spaghetti, Amount: 150, Status: Pending | Order appears in list; success toast shows; count increases | Order appeared in the list with correct details, success toast was shown, and the order count increased. | Pass |
| TC-02 | Add Record (Negative) | Verify empty required field is rejected | Form is empty | 1. Leave Customer Name blank 2. Fill other fields 3. Click "Add Order" | Customer: (blank), Items: fries, Amount: 100 | Order is not saved; red error message appears | The order was not saved. A red error message "Customer name is required." appeared below the form. | Pass |
| TC-03 | Add Record (Boundary) | Verify negative total amount is rejected | Form is empty | 1. Fill Customer Name and Items 2. Enter -50 as Amount 3. Click "Add Order" | Customer: mr. benru, Items: fries, Amount: -50 | Order is not saved; validation message appears | Initially, the order was saved with a total of ₱-50.00 (defect BUG-01). After the fix in orderUtils.js, the order was correctly rejected with the message "Total amount must be greater than zero." | Pass (after fix) |
| TC-04 | Display Records | Verify multiple records display correctly | At least 3 orders exist | 1. Open List View 2. Observe table/cards | N/A | All orders shown with correct customer, items, total, status | All orders displayed correctly with matching customer name, items, total amount, and status badge for each row. | Pass |
| TC-05 | Edit Record | Verify an existing order can be edited and saved | At least 1 order exists | 1. Click Edit on an order 2. Change Status to "Preparing" 3. Click "Update Order" | Change status field only | Order's status updates in the list; form returns to "New Order" mode | The order's status updated correctly in the list, and the form reset back to "New Order" mode. | Pass |
| TC-06 | Delete Record (Cancel) | Verify deletion can be cancelled | At least 1 order exists | 1. Click Delete on an order 2. Click "Cancel" in the modal | N/A | Order remains in the list, unchanged | The confirmation modal closed and the order remained in the list, unchanged. | Pass |
| TC-07 | Delete Record (Confirm) | Verify an order can be deleted | At least 1 order exists | 1. Click Delete on an order 2. Click "Delete" in the modal | N/A | Order is removed from the list; toast shows "Order deleted." | The order was removed from the list, and a toast displayed "Order deleted." with an Undo option. | Pass |
| TC-08 | Search | Verify search finds an existing customer | At least 2 orders exist, different customer names | 1. Type an existing customer name in the search box | Search term: "ruben" | Only matching order(s) are displayed | Only the matching order for "ruben" was displayed; other customers were filtered out. | Pass |
| TC-09 | Search (No Match) | Verify search shows empty state for unknown name | At least 1 order exists | 1. Type a name that does not exist | Search term: "hmmmmmS" | "No matching orders" state is displayed | The list showed "Showing 0 of 1 order(s)" and an empty-state message. | Pass |
| TC-10 | Persistence | Verify data survives a page refresh | At least 1 order exists | 1. Refresh the browser (F5) | N/A | Previously added order(s) still appear | After refreshing, the order "ruben" was still visible, confirming localStorage persistence. | Pass |
| TC-11 (recommended) | Responsive | Verify layout adapts to mobile width | App is loaded | 1. Open DevTools (F12) 2. Toggle device toolbar 3. Select a mobile size | N/A | Orders display as cards, not a squeezed table; all buttons remain tappable | At mobile width, the header, summary cards, and form stacked correctly with no overflow or squeezed elements. | Pass |
| TC-12 (recommended) | Feedback/Count | Verify order count updates correctly | At least 1 order exists | 1. Add a new order 2. Observe "Total Orders" card | N/A | Count increases by 1 with animated count-up | The "Total Orders" count and "Showing X of X order(s)" text correctly increased from 1 to 2 after adding a new order. | Pass |
| TC-13 | Display Records (Edge) | Verify empty state displays correctly with zero orders | All orders deleted | 1. Delete all existing orders 2. Observe the Orders section | N/A | "No orders yet" message displays without errors | After deleting all orders, the "No orders yet — Add your first order using the form above" message displayed cleanly. | Pass |
| TC-14 | Edit Record (Negative) | Verify empty required field is rejected while editing | At least 1 order exists | 1. Click Edit on an order 2. Clear the Customer Name field 3. Click "Update Order" | Customer Name cleared to blank | Update is rejected; validation message appears | The update was rejected. A red error message "Customer name is required." appeared while still in Edit Order mode. | Pass |


# MODULE 9 — Updated Manual Test Cases
*Food Ordering System — Ruben L. Puno Jr. | CR-M9-01: Active/Archived Order Filter*

| ID | Feature | Objective | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **Retained from Module 8** | | | | | |
| TC-01 | Add Record | Verify a valid order can be added | Order appears in list; success toast; count increases | Order appeared correctly; toast shown; count increased. | Pass |
| TC-02 | Add Record (Negative) | Verify empty required field is rejected | Order not saved; red error message appears | Order not saved. "Customer name is required." shown. | Pass |
| TC-03 | Add Record (Boundary) | Verify negative total amount is rejected | Order not saved; validation message appears | Rejected with "Total amount must be greater than zero." | Pass (after fix) |
| TC-04 | Display Records | Verify multiple records display correctly | All orders shown with correct data | All orders displayed correctly. | Pass |
| TC-05 | Edit Record | Verify an existing order can be edited and saved | Order updates in list; form resets | Order updated correctly; form reset to New Order mode. | Pass |
| TC-06 | Delete Record (Cancel) | Verify deletion can be cancelled | Order remains in the list, unchanged | Modal closed; order remained unchanged. | Pass |
| TC-07 | Delete Record (Confirm) | Verify an order can be deleted | Order removed; toast shows "Order deleted." | Order removed; toast with Undo shown. | Pass |
| TC-08 | Search | Verify search finds an existing customer | Only matching order(s) displayed | Only matching order displayed. | Pass |
| TC-09 | Search (No Match) | Verify search shows empty state for unknown name | "No matching orders" state displayed | "Showing 0 of 1 order(s)" shown. | Pass |
| TC-10 | Persistence | Verify data survives a page refresh | Previously added order(s) still appear | Order remained visible after refresh. | Pass |
| **New for Module 9 — CR-M9-01** | | | | | |
| TC-15 | Archive Filter | Default view shows only Active orders | Completed-but-not-archived orders still show; no archived orders shown | Only active orders displayed by default. | Pass |
| TC-16 | Archive Filter | Selecting "Archived" shows only archived orders | Only archived orders appear | Only archived orders shown after selecting filter. | Pass |
| TC-17 | Archive Action | Archiving a Completed order | Order moves out of Active view; order still exists (not deleted) | Order archived successfully; still present under Archived filter. | Pass |
| TC-18 (Negative/Edge) | Archive Action | Archive button hidden for non-Completed orders | No Archive button on Pending/Preparing orders | Archive button correctly hidden on Pending and Preparing orders. | Pass |
| TC-19 (Compatibility) | Backward Compatibility | Old localStorage record with no `archived` field loads | Record is treated as Active; no crash | Old record loaded and treated as Active, no errors. | Pass |
| TC-20 (Edge) | Archive Filter | "All" view with zero orders in one category | Correct empty-state message, no errors | Empty-state message displayed cleanly. | Pass |

**Total: 16 manual test cases** (10 retained + 6 new). Minimum requirement of 12 met.