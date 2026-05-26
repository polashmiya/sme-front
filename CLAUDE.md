# CLAUDE.md — Corelium Front

This file instructs Claude on how to work in this codebase. Read it fully before making any changes.

---

## Project Overview

**Corelium Front** is a React-based ERP (Enterprise Resource Planning) frontend. It covers modules like Purchase, Sales, Account, Inventory, and Configuration.

- **Framework**: React 19 + Vite
- **Language**: JavaScript (JSX) — no TypeScript. Use PropTypes for type safety.
- **Styling**: Tailwind CSS + CSS custom properties (no inline styles, no CSS-in-JS)
- **UI Library**: Ant Design 6 (always use the custom wrappers in `src/common/ant/`, never raw Ant components)
- **State**: Redux Toolkit for auth + UI globals; `useState`/`useMemo` for all page-level state
- **Forms**: `react-hook-form` + `yup` schema validation
- **Icons**: Lucide React (primary), Ant Design Icons (secondary)
- **Animations**: Framer Motion for page-level transitions
- **i18n**: i18next (English + Bengali) — always wrap user-facing strings with `t()`
- **Print**: `react-to-print` via the custom `usePrint` hook

---

## Directory Structure

```
src/
├── app/              # Redux store
├── assets/           # Static assets
├── auth/             # authSlice.js
├── common/
│   ├── ant/          # Wrapped Ant Design components (use these, not raw Ant)
│   ├── components/   # Shared UI components (CommonLandingLayout, Button, etc.)
│   └── utils.js      # formatDate, formatDateTime, number helpers
├── i18n/             # i18next setup + translation resources
├── layout/           # LayoutShell, Sidebar, Header
├── modules/          # Feature modules
│   ├── purchase/
│   ├── sales/
│   ├── account/
│   ├── inventory/
│   ├── configuration/
│   └── approval/
├── routes/           # AppRoutes.jsx, Protected.jsx
├── shared/           # Cross-module utilities
├── ui/               # uiSlice.js (darkMode, sidebarOpen, language)
├── App.jsx
└── main.jsx
```

---

## Module Structure Convention

Every feature module follows this layout exactly — do not deviate:

```
modules/<module-name>/
├── <Module>Pages.jsx           # Route definitions for the module
├── components/                 # Module-level shared components (e.g. PrintLayout)
├── hooks/                      # Module-level custom hooks (e.g. usePrint)
└── features/
    └── <feature-name>/         # e.g. order, payment, receive, return
        ├── components/         # Feature-specific components (if needed)
        └── pages/
            ├── Landing.jsx     # List view with table, filters, pagination
            ├── Create.jsx      # Creation form
            ├── Edit.jsx        # Edit form (pre-populated)
            └── View.jsx        # Read-only detail view
```

### Purchase Module — Reference Implementation

The purchase module (`src/modules/purchase/`) is the canonical pattern. When adding a new feature to any module, mirror its structure:
- `features/order/` — Purchase Orders
- `features/payment/` — Purchase Payments
- `features/receive/` — Goods Received Notes
- `features/return/` — Purchase Returns
- `features/reports/` — Module reports

---

## Page Patterns

### Landing Page (List View)

Always use `CommonLandingLayout` from `src/common/components/CommonLandingLayout`. Do not build custom table UIs from scratch.

```jsx
import CommonLandingLayout from '../../../common/components/CommonLandingLayout';

const FilterSection = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-sm">
    {/* Dropdown, date range, status filters */}
  </div>
);

export default function OrderLanding() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  const filtered = useMemo(() => {
    return ALL_ROWS.filter(/* filter logic */);
  }, [search, /* other filter deps */]);

  return (
    <CommonLandingLayout
      title={t('purchase.order', 'Purchase Orders')}
      headerButtons={[{ label: t('common.create', 'Create'), onClick: () => navigate('create') }]}
      showSearch
      onSearch={(val) => { setSearch(val); setPage(1); }}
      filters={<FilterSection />}
      tableColumns={columns}
      tableData={filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)}
      pagination={{ current: page, total: filtered.length, pageSize: PAGE_SIZE, onChange: setPage }}
    />
  );
}
```

### Create / Edit Page (Form)

Always use `react-hook-form` + `yup` + the form components from `src/common/ant/`.

```jsx
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormInput from '../../../../../common/ant/FormInput';
import FormDropdown from '../../../../../common/ant/FormDropdown';

const schema = yup.object({
  supplierId: yup.mixed().test('required', 'Supplier is required', (v) => v?.value),
  date: yup.string().required('Date is required'),
});

export default function CreatePage() {
  const { control, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { supplierId: null, date: '' },
  });

  const onSubmit = (data) => {
    console.log(data); // Replace with API call when backend is ready
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller name="supplierId" control={control}
        render={({ field }) => (
          <FormDropdown {...field} label="Supplier" options={SUPPLIER_OPTIONS}
            error={errors.supplierId?.message} />
        )}
      />
    </form>
  );
}
```

### View Page (Read-only Detail)

- Display data in labeled field groups
- Include a print button using the `usePrint` hook
- Show status badges using Tailwind classes (no custom badge components)
- Check for `?autoprint=1` query param to trigger auto-print on load

### Page-level Animations

Wrap the top-level return of every page with a Framer Motion div:

```jsx
import { motion } from 'framer-motion';

return (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.28, ease: 'easeOut' }}
  >
    {/* page content */}
  </motion.div>
);
```

---

## Routing

Routes are defined per-module in `<Module>Pages.jsx` and injected into `src/routes/AppRoutes.jsx`.

### Route Naming Convention

```
/<module>                          → Module sub-menu or dashboard
/<module>/dashboard                → Dashboard
/<module>/<feature>                → Landing (list)
/<module>/<feature>/create         → Create
/<module>/<feature>/:id            → View (detail)
/<module>/<feature>/edit/:id       → Edit
/<module>/report                   → Reports (pass report={true} prop)
```

### Adding a New Module Route

1. Create `src/modules/<module>/<Module>Pages.jsx`
2. Export an array of `<Route>` elements
3. Import and spread into `src/routes/AppRoutes.jsx` inside the `<Protected>` + `<LayoutShell>` wrapper

---

## Styling Rules

### Always Use CSS Variables for Colors

Never hardcode color values. Use the CSS variables defined in `src/index.css`:

```
--primary-color    --bg-base       --bg-surface      --bg-elevated
--bg-hover         --text-primary  --text-secondary  --text-muted
--border           --border-strong
```

### Tailwind Utility Classes — Shared Vocabulary

- Cards: `card` (custom class defined in index.css)
- Buttons: `btn-primary`, `btn-outline`
- Inputs: `ctrl-input`
- Icon buttons: `icon-btn`
- Pagination buttons: `pg-btn`
- Table sticky headers: `sticky top-0 z-20`

### Responsive Grid Pattern

```
grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3
```

Adapt column counts based on content density — this is the standard filter row pattern.

### Dark Mode

- Controlled by `.dark` class on `<html>`, set via Redux `ui.darkMode`
- CSS variables automatically switch — write selectors in `index.css` under `.dark { ... }`
- Never use JS-based conditional dark mode class switching; rely on the CSS variable system

---

## State Management

| Scope | Tool |
|---|---|
| Auth (user, token) | Redux — `src/auth/authSlice.js` |
| UI (sidebar, dark mode, language) | Redux — `src/ui/uiSlice.js` |
| Page-level (filters, pagination, form state) | `useState` / `useMemo` |
| Server data (future) | Local state + Axios calls; no Redux for server data |

### Redux Access Pattern

```jsx
import { useSelector, useDispatch } from 'react-redux';
import { toggleDarkMode } from '../ui/uiSlice';

const darkMode = useSelector((state) => state.ui.darkMode);
const dispatch = useDispatch();
dispatch(toggleDarkMode());
```

---

## API Integration (Current State → Target State)

**Current**: All data is mock/hardcoded constants in component files. Forms log to console.

**When adding real API calls**:
- Use **Axios** (`axios` is installed)
- Put API functions in `src/modules/<module>/api/<module>Api.js`
- Call from page components directly with `useState` + `useEffect` (no Redux for server state)
- Show loading states using Ant Design Spin or skeleton patterns
- Show errors with Ant Design message/notification

```jsx
// Target pattern for API calls
import axios from 'axios';

const fetchOrders = async () => {
  setLoading(true);
  try {
    const { data } = await axios.get('/api/purchase/order');
    setOrders(data);
  } catch (err) {
    message.error('Failed to load orders');
  } finally {
    setLoading(false);
  }
};
```

---

## Internationalization (i18n)

- Always use `const { t } = useTranslation();`
- Always provide a fallback string: `t('purchase.order', 'Purchase Orders')`
- Key convention: `<module>.<feature>.<key>` — e.g., `purchase.order.create`
- Add new keys to **both** `en` and `bn` objects in `src/i18n/index.js`
- Dashboard keys: `<module>.dash.kpis.*`, `<module>.dash.filters.*`, `<module>.dash.charts.*`

---

## Utility Helpers

Located in `src/common/utils.js`:

```js
formatDate(dateString)            // → "26 May, 2026"
formatDateTime(dateString)        // → "26 May, 2026 14:30"
```

Number formatting pattern used across the codebase:

```js
Number(value).toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
```

Deterministic mock data helper (used when generating fake rows):

```js
const hash = (n) => ((n * 2654435761) >>> 0) % 100000;
```

---

## Common Components Reference

| Component | Path | Purpose |
|---|---|---|
| `CommonLandingLayout` | `src/common/components/CommonLandingLayout` | Table + filter + pagination shell |
| `Button` | `src/common/components/Button` | Styled button with variants |
| `FormInput` | `src/common/ant/FormInput` | Ant Input with label + error |
| `FormDropdown` | `src/common/ant/FormDropdown` | Ant Select with label + error |
| `Icons` | `src/common/components/Icons` | Icon wrapper around Lucide |
| `AntThemeProvider` | (layout level) | Ant Design theme token provider |

---

## Print Functionality

```jsx
import usePrint from '../../hooks/usePrint';
import PrintLayout from '../../components/PrintLayout';

const { printRef, handlePrint } = usePrint();

// In JSX:
<button onClick={handlePrint}>Print</button>
<div ref={printRef} className="hidden print:block">
  <PrintLayout data={record} />
</div>
```

Auto-print on load:

```jsx
const [searchParams] = useSearchParams();
useEffect(() => {
  if (searchParams.get('autoprint') === '1') handlePrint();
}, []);
```

---

## What NOT to Do

- Do not use raw Ant Design components — always use wrappers from `src/common/ant/`
- Do not add TypeScript or `.ts`/`.tsx` files — this project is pure JavaScript
- Do not put business logic in Redux — keep slices thin (only auth and UI state belong there)
- Do not hardcode colors — use CSS variables
- Do not skip i18n — all user-facing strings must go through `t()`
- Do not create new shared components until the pattern is needed in at least two places
- Do not add comments explaining what code does — only add comments explaining non-obvious WHY
- Do not add error handling for scenarios that cannot happen (trust internal guarantees)
- Do not introduce new dependencies without checking if an installed library already covers the need

---

## Checklist Before Completing Any Task

- [ ] File is in the correct module/feature/pages location
- [ ] Component follows the Landing/Create/Edit/View page pattern
- [ ] All user-facing strings go through `t()` with a fallback value
- [ ] Tailwind classes used (no inline styles, no hardcoded colors)
- [ ] PropTypes defined for any new reusable component
- [ ] Page wrapped in Framer Motion entry animation
- [ ] Route added to `<Module>Pages.jsx` and follows naming convention
- [ ] Mock data used if backend not yet available (no empty states that look broken)
- [ ] Dark mode works (tested by toggling `ui.darkMode` in Redux DevTools)
