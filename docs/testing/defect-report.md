# Defect Report — Food Ordering System

| Field | Entry |
|---|---|
| Defect ID | BUG-01 |
| Summary | The order form accepts a negative total amount instead of rejecting it. |
| Application version/commit | *(fill in your latest commit hash before the fix — run `git log --oneline -1`)* |
| Environment | Chrome (latest), Windows 10/11, localhost:5173 |
| Preconditions | The "New Order" form is open and empty |
| Steps to reproduce | 1. Fill in Customer Name and Order Items 2. Enter -50 in the Total Amount field 3. Click "Add Order" |
| Expected result | The order should not be saved; a validation message should appear (amount must be greater than zero) |
| Actual result | The order is saved successfully with a total of ₱-50.00, and it appears in the order list |
| Severity | Medium |
| Priority | High |
| Evidence filename | 03-failed-unit-test.png, 04-identified-defect.png |
| Status | New |
| Application version/commit | 2609e3d — Configure Vitest and add automated tests for search, validation, and status flow |
| Fix commit | 917e401 — Fix validation defect found during testing |

