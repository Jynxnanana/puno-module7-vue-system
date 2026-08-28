# Test Plan — Food Ordering System (Module 7 Vue.js Prototype)

## Objectives
Evaluate the five main features of the Food Ordering System prototype (Add, Display,
Edit, Delete, Search/Validation) to ensure that they work as expected, and identify
defects before submitting the final version.

## Scope
### Items to Test
- Add Order (Create)
- Display Orders (Read — List View and Board View)
- Edit Order (Update)
- Delete Order (Delete, with confirmation modal)
- Search by customer name
- Form validation (required fields and total amount)
- localStorage persistence
- Responsive layout (mobile view)

### Items Not Tested
- Backend/API/database (there is no connection yet — proposed in Module 6)
- User authentication
- Payment processing

## Test Environment
- Browser: Google Chrome (latest version)
- OS: Windows 10/11
- Framework: Vue.js 3 + Vite
- Data storage: Browser localStorage
- Testing tool: Vitest + Vue Test Utils

## Responsibilities
- Test design, execution, and documentation: Ruben L. Puno Jr.

## Risks
- Some edge cases may not be identified because only manual testing is being used for the UI.
- localStorage is browser-specific; results may vary in other browsers.

## Entry Criteria
- The Module 7 CRUD prototype is complete and `npm run dev` is working.

## Exit Criteria
- All planned automated tests (5) pass.
- All 10 manual test cases have been executed and have a result (Pass/Fail).
- At least one defect has been documented, corrected, and retested.
- `npm run test:run` and `npm run build` are both successful.
- GitHub Actions CI passes (tests + build).

## Deliverables
- `docs/testing/test-plan.md`
- `docs/testing/test-cases.md`
- `docs/testing/defect-report.md`
- `src/utils/orderUtils.js` + `src/utils/orderUtils.test.js`
- Updated CI workflow
- README testing section