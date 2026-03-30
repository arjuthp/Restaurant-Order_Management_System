# Table Design Specifications

## Typography Standards

### Table Headers
```css
font-family: 'Inter', sans-serif;
font-size: 0.8125rem (13px);
font-weight: 700;
color: #FFFFFF;
text-transform: uppercase;
letter-spacing: 0.1em;
line-height: 1.4;
padding: 1.125rem 1.25rem;
text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
```

### Table Cells - Regular Data
```css
font-family: 'Inter', sans-serif;
font-size: 0.9375rem (15px);
font-weight: 500;
color: #1F2937;
line-height: 1.5;
padding: 1rem 1.25rem;
text-shadow: none;
```

### Table Cells - Emphasized Data (IDs, Names, Amounts)
```css
font-family: 'Inter', sans-serif;
font-size: 0.9375rem (15px);
font-weight: 600;
color: #1F2937;
line-height: 1.5;
padding: 1rem 1.25rem;
text-shadow: none;
```

## Color Palette

### Primary Colors
- **Primary Green**: `#1B7C38`
- **Primary Green Light**: `#2D9B4E`
- **Primary Green Lighter**: `#3FBF63`
- **Primary Green Lightest**: `#E8F5E9`

### Background Colors
- **Table Container**: `linear-gradient(135deg, #FFFFFF 0%, #F7F9FB 100%)`
- **Table Header**: `linear-gradient(135deg, #1B7C38 0%, #2D9B4E 100%)`
- **Row Default**: `#FFFFFF`
- **Row Hover**: `#E8F5E9` (Primary Green Lightest)

### Border Colors
- **Container Border**: `#E5E7EB`
- **Row Border**: `#E5E7EB`
- **Row Border Hover**: `#3FBF63` (Primary Green Lighter)

### Text Colors
- **Header Text**: `#FFFFFF`
- **Cell Text**: `#1F2937`
- **Light Text**: `#6B7280`

## Spacing & Layout

### Padding
- **Header Cells**: `1.125rem 1.25rem` (18px 20px)
- **Body Cells**: `1rem 1.25rem` (16px 20px)

### Border Radius
- **Container**: `var(--radius-xl)` = `20px`
- **Badges**: `var(--radius-full)` = `9999px`

### Shadows
- **Container**: `var(--shadow-lg)` = `0 8px 16px rgba(0, 0, 0, 0.12)`
- **Hover**: `0 2px 8px rgba(27, 124, 56, 0.1)`

## Interactive States

### Row Hover
```css
background: #E8F5E9;
transform: scale(1.002);
border-bottom-color: #3FBF63;
transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
```

### Badge Styles

#### Available/Confirmed/Success
```css
background: linear-gradient(135deg, rgba(95, 184, 95, 0.95) 0%, rgba(74, 124, 44, 0.95) 100%);
color: white;
padding: 0.375rem 0.875rem;
border-radius: 9999px;
font-size: 0.75rem;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.05em;
box-shadow: 0 4px 12px rgba(95, 184, 95, 0.3);
```

#### Pending/Warning
```css
background: linear-gradient(135deg, rgba(230, 81, 0, 0.95) 0%, rgba(255, 140, 66, 0.95) 100%);
color: white;
padding: 0.375rem 0.875rem;
border-radius: 9999px;
font-size: 0.75rem;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.05em;
box-shadow: 0 4px 12px rgba(230, 81, 0, 0.3);
```

#### Cancelled/Error
```css
background: linear-gradient(135deg, rgba(231, 76, 60, 0.95) 0%, rgba(192, 57, 43, 0.95) 100%);
color: white;
padding: 0.375rem 0.875rem;
border-radius: 9999px;
font-size: 0.75rem;
font-weight: 700;
text-transform: uppercase;
letter-spacing: 0.05em;
box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
```

## Responsive Breakpoints

### Desktop (Default - >1024px)
- Header: 13px, padding 18px × 20px
- Cells: 15px, padding 16px × 20px

### Tablet (≤1024px)
- Header: 12px, padding 14px × 16px
- Cells: 14px, padding 14px × 16px

### Mobile (≤768px)
- Header: 11px, padding 12px × 10px
- Cells: 13px, padding 12px × 10px

### Small Mobile (≤480px)
- Header: 10px, padding 10px × 8px
- Cells: 12px, padding 10px × 8px

## Accessibility

### Contrast Ratios
- Header text on green: 7.2:1 (AAA)
- Body text on white: 14.5:1 (AAA)
- Hover state: 12.8:1 (AAA)

### Focus States
```css
outline: 3px solid #1B7C38;
outline-offset: 2px;
border-radius: 6px;
```

## Best Practices

1. **Always use Inter font** for consistency
2. **Semi-bold (600) for emphasis** on IDs, names, amounts
3. **Medium (500) for regular data** like dates, descriptions
4. **Consistent padding** across all tables
5. **Line height 1.5** for optimal readability
6. **No text shadows on cells** for clarity
7. **Subtle hover effects** for professional feel
8. **Responsive scaling** for all devices
9. **Proper color contrast** for accessibility
10. **Consistent border radius** for modern look

## Implementation Checklist

When creating a new table:
- [ ] Use Inter font family
- [ ] Set header font size to 0.8125rem
- [ ] Set cell font size to 0.9375rem
- [ ] Apply proper font weights (500/600)
- [ ] Use standard padding values
- [ ] Set line-height to 1.5
- [ ] Remove text shadows from cells
- [ ] Apply green gradient to header
- [ ] Add hover effects
- [ ] Test on all breakpoints
- [ ] Verify color contrast
- [ ] Ensure consistent spacing
