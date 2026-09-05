# Updated Architecture – Module 9

## Architecture Diagram

```text
┌──────────────────────────────┐
│      Vue.js Frontend         │
│                              │
│  Order List Component        │
│  - Filter: All / Active /    │
│    Archived                  │
│  - Archive Order Action      │
│                              │
│        ↕                     │
│   orderUtils.js              │
└──────────────┬───────────────┘
               │
               ↕
        ┌──────────────┐
        │ localStorage │
        │              │
        │ Order Data   │
        │ Archive State│
        └──────────────┘
```

### Current Prototype Architecture

The original proposed architecture was:

```text
Customer
   ↓
Vue.js Frontend
   ↓
Node.js / Express Backend
   ↓
MongoDB Atlas
```

However, the current Module 9 prototype does not yet use the Node.js/Express backend or MongoDB Atlas. The application layer is currently implemented client-side in Vue.js through `orderUtils.js`, while the data layer uses browser `localStorage`.

### Modified Layer

**Modified: Vue.js Frontend**

The order list component was updated to include:

- All / Active / Archived filter controls
- Archive order action
- Display of orders based on their archive state

The `orderUtils.js` utility was also updated to support:

- Archive-state filtering
- Backward-compatible loading of existing order records

### Data Flow

```text
Order List Component
        ↕
    orderUtils.js
        ↕
   localStorage
```

Only the data flow between the order list component and `localStorage` is affected by this change.

### Annotation

> **Modified:** order list component (filter UI + archive action) and `orderUtils.js` (archive-state filtering + backward-compatible record loading).\
> **Unchanged:** Add/Edit/Delete/Search/Validation logic, data layer technology.
