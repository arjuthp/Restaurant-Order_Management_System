# Table Standardization Guide

## Overview
All tables across the application now follow a consistent design system with standardized typography, spacing, and visual aesthetics.

## Standardized Typography

### Table Headers (th)
- **Font Family**: `var(--font-body)` (Inter)
- **Font Size**: `0.8125rem` (13px)
- **Font Weight**: `700` (Bold)
- **Color**: `#FFFFFF` (White)
- **Text Transform**: `uppercase`
- **Letter Spacing**: `0.1em`
- **Line Height**: `1.4`
- **Text Shadow**: `0 2px 4px rgba(0, 0, 0, 0.3)`
- **Padding**: `1.125rem 1.25rem`

### Table Cells (td)
- **Font Family**: `var(--font-body)` (Inter)
- **Font Size**: `0.9375rem` (15px)
- **Font Weight**: `500` (Medium)
- **Color**: `var(--color-text)` (#1F2937)
- **Line Height**: `1.5`
- **Text Shadow**: `none`
- **Padding**: `1rem 1.25rem`

### Special Cell Types
- **Primary Text** (IDs, Names): `font-weight: 600` (Semi-bold)
- **Monetary Values**: `font-weight: 600` (Semi-bold)
- **Regular Data**: `font-weight: 500` (Medium)

## Visual Design Standards

### Table Container
```css
background: linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-secondary) 100%);
backdrop-filter: blur(10px);
border: 2px solid var(--color-border);
border-radius: var(--radius-xl);
box-shadow: var(--shadow-lg);
```

### Table Header
```css
background: linear-gradient(135deg, #1B7C38 0%, #2D9B4E 100%);
```

### Row Hover Effect
```css
background: var(--color-bg-success);
transform: scale(1.002);
border-bottom-color: var(--color-primary-lighter);
```

## Responsive Breakpoints

### Desktop (Default)
- Header: `0.8125rem`, padding `1.125rem 1.25rem`
- Cells: `0.9375rem`, padding `1rem 1.25rem`

### Tablet (≤1024px)
- Header: `0.75rem`, padding `0.875rem 1rem`
- Cells: `0.875rem`, padding `0.875rem 1rem`

### Mobile (≤768px)
- Header: `0.6875rem`, padding `0.75rem 0.625rem`
- Cells: `0.8125rem`, padding `0.75rem 0.625rem`

### Small Mobile (≤480px)
- Header: `0.625rem`, padding `0.625rem 0.5rem`
- Cells: `0.75rem`, padding `0.625rem 0.5rem`

## Pages Updated

1. ✅ **AdminOrdersPage** - Orders management table
2. ✅ **AdminProductsPage** - Products listing table
3. ✅ **AdminUsersPage** - Users management table
4. ✅ **AdminInventoryPage** - Inventory tracking table
5. ✅ **AnalyticsPage** - Analytics data tables (Revenue, Products, Users)

## Implementation Notes

- All tables use `font-family: var(--font-body)` consistently
- Text shadows removed from table cells for better readability
- Line heights standardized to `1.5` for optimal readability
- Hover effects are subtle (`scale(1.002)`) for professional feel
- All monetary values and IDs use semi-bold weight for emphasis
- Border radius uses `var(--radius-xl)` for modern appearance

## Benefits

1. **Consistency**: Uniform appearance across all admin pages
2. **Readability**: Optimized font sizes and line heights
3. **Accessibility**: Proper contrast ratios and text sizing
4. **Responsive**: Scales appropriately on all devices
5. **Professional**: Clean, modern aesthetic throughout

## Future Maintenance

When creating new tables:
1. Use the standardized CSS from `Table.module.css` as reference
2. Follow the typography standards outlined above
3. Maintain consistent padding and spacing
4. Use the standard color palette from global.css
5. Test on all responsive breakpoints
