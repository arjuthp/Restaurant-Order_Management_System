# Table Typography - Quick Reference

## Copy-Paste Ready Styles

### Table Header
```css
.table th {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: 700;
  color: #FFFFFF;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  line-height: 1.4;
  padding: 1.125rem 1.25rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
```

### Table Cell (Regular)
```css
.table td {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text);
  line-height: 1.5;
  padding: 1rem 1.25rem;
  text-shadow: none;
}
```

### Table Cell (Emphasized - IDs, Names, Amounts)
```css
.cellEmphasis {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.5;
}
```

### Table Container
```css
.tableContainer {
  background: linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-secondary) 100%);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}
```

### Table Header Background
```css
.table thead {
  background: linear-gradient(135deg, #1B7C38 0%, #2D9B4E 100%);
}
```

### Row Hover
```css
.table tbody tr:hover {
  background: var(--color-bg-success);
  transform: scale(1.002);
  border-bottom-color: var(--color-primary-lighter);
}
```

## Responsive Breakpoints

### Tablet (≤1024px)
```css
@media (max-width: 1024px) {
  .table th {
    padding: 0.875rem 1rem;
    font-size: 0.75rem;
  }
  
  .table td {
    padding: 0.875rem 1rem;
    font-size: 0.875rem;
  }
}
```

### Mobile (≤768px)
```css
@media (max-width: 768px) {
  .table th {
    padding: 0.75rem 0.625rem;
    font-size: 0.6875rem;
    letter-spacing: 0.08em;
  }
  
  .table td {
    padding: 0.75rem 0.625rem;
    font-size: 0.8125rem;
  }
}
```

### Small Mobile (≤480px)
```css
@media (max-width: 480px) {
  .table th {
    padding: 0.625rem 0.5rem;
    font-size: 0.625rem;
  }
  
  .table td {
    padding: 0.625rem 0.5rem;
    font-size: 0.75rem;
  }
}
```

## Status Badges

### Success/Available
```css
.badgeSuccess {
  background: linear-gradient(135deg, rgba(95, 184, 95, 0.95) 0%, rgba(74, 124, 44, 0.95) 100%);
  color: white;
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 12px rgba(95, 184, 95, 0.3);
}
```

### Warning/Pending
```css
.badgeWarning {
  background: linear-gradient(135deg, rgba(230, 81, 0, 0.95) 0%, rgba(255, 140, 66, 0.95) 100%);
  color: white;
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 12px rgba(230, 81, 0, 0.3);
}
```

### Error/Cancelled
```css
.badgeError {
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.95) 0%, rgba(192, 57, 43, 0.95) 100%);
  color: white;
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
}
```

## Color Variables

```css
/* Primary Colors */
--color-primary: #1B7C38;
--color-primary-light: #2D9B4E;
--color-primary-lighter: #3FBF63;
--color-primary-lightest: #E8F5E9;

/* Background Colors */
--color-bg: #FFFFFF;
--color-bg-secondary: #F7F9FB;
--color-bg-success: #E8F5E9;

/* Text Colors */
--color-text: #1F2937;
--color-text-light: #6B7280;

/* Border Colors */
--color-border: #E5E7EB;

/* Radius */
--radius-xl: 20px;
--radius-full: 9999px;

/* Shadows */
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.12);
```

## Font Sizes Reference

| Element | Size (rem) | Size (px) | Weight | Use Case |
|---------|-----------|-----------|--------|----------|
| Header  | 0.8125    | 13        | 700    | Table headers |
| Cell    | 0.9375    | 15        | 500    | Regular data |
| Emphasis| 0.9375    | 15        | 600    | IDs, names, amounts |
| Badge   | 0.75      | 12        | 700    | Status indicators |

## Spacing Reference

| Element | Padding | Use Case |
|---------|---------|----------|
| Header  | 1.125rem × 1.25rem (18px × 20px) | Table headers |
| Cell    | 1rem × 1.25rem (16px × 20px) | Table cells |
| Badge   | 0.375rem × 0.875rem (6px × 14px) | Status badges |

## Line Heights

| Element | Line Height | Purpose |
|---------|-------------|---------|
| Header  | 1.4 | Compact, readable headers |
| Cell    | 1.5 | Optimal readability for data |
| Badge   | 1.0 | Tight, compact badges |

## Implementation Example

```tsx
// React Component Example
<div className={styles.tableContainer}>
  <table className={styles.table}>
    <thead>
      <tr>
        <th>Order ID</th>
        <th>Customer</th>
        <th>Amount</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className={styles.orderId}>#12345</td>
        <td className={styles.customerName}>John Doe</td>
        <td className={styles.amount}>$99.99</td>
        <td>
          <span className={styles.badgeSuccess}>Completed</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

```css
/* Corresponding CSS */
.orderId,
.amount {
  font-weight: 600; /* Emphasized */
}

.customerName {
  font-weight: 500; /* Regular */
}
```

## Checklist for New Tables

- [ ] Use Inter font (var(--font-body))
- [ ] Header: 0.8125rem, weight 700
- [ ] Cell: 0.9375rem, weight 500/600
- [ ] Padding: 1.125rem × 1.25rem (headers)
- [ ] Padding: 1rem × 1.25rem (cells)
- [ ] Line height: 1.4 (headers), 1.5 (cells)
- [ ] Green gradient header background
- [ ] Light gradient container background
- [ ] Hover: scale(1.002), light green bg
- [ ] Border radius: 20px
- [ ] Responsive breakpoints: 1024px, 768px, 480px
- [ ] Remove text shadows from cells
- [ ] Use semi-bold (600) for emphasis

---

**Quick Tip**: Copy the styles from `Table.module.css` for fastest implementation!
