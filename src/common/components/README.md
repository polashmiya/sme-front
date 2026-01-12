# FieldRenderer

A flexible renderer for heterogeneous form fields aligned with this project's components.

## Usage (react-hook-form)

```jsx
import { useForm } from 'react-hook-form';
import { Fields } from './FieldRenderer';

export default function Example() {
  const { control, setValue, watch } = useForm({ defaultValues: { code: '', type: null, active: true } });
  const values = watch();

  const fields = [
    { input: { name: 'code', label: 'Code', placeholder: 'Enter code' } },
    { ddl: { name: 'type', label: 'Type', options: [{ label: 'Cash', value: 'cash' }, { label: 'Bank', value: 'bank' }] } },
    { checkbox: { name: 'active', label: 'Active' } },
    { button: { label: 'Search', onClick: () => console.log('search', values) } },
  ];

  return (
    <div className="p-4">
      <Fields fields={fields} commonProps={{ control, setValue, values }} />
    </div>
  );
}
```

## Fallback (without react-hook-form)
If you are not using `react-hook-form`, pass `values` and `setValue(name, value)` and the renderer will use the non-form `Input`/`Dropdown` components.

```jsx
import { useState } from 'react';
import { Fields } from './FieldRenderer';

export default function ExampleNoForm() {
  const [values, setValues] = useState({ code: '', type: null, active: false });
  const setValue = (name, value) => setValues(v => ({ ...v, [name]: value }));

  const fields = [
    { input: { name: 'code', label: 'Code' } },
    { ddl: { name: 'type', label: 'Type', options: [{ label: 'One', value: 1 }] } },
    { checkbox: { name: 'active', label: 'Active' } },
  ];

  return <Fields fields={fields} commonProps={{ values, setValue }} />;
}
```

## Custom component
Provide a component reference under `commonField.component` for custom rendering.

```jsx
const CustomSummary = ({ values }) => <pre>{JSON.stringify(values, null, 2)}</pre>;

const fields = [
  { commonField: { component: CustomSummary, props: {} } }
];
```
