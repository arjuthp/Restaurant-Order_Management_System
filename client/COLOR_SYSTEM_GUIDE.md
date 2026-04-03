# Frontend Color System Guide
## Green, White & Orange Theme

Your color system is already defined in `global.css`. Here's how to apply it consistently:

## Color Palette

### Primary (Green)
- `--color-primary: #1B7C38` - Main green for primary actions
- `--color-primary-light: #2D9B4E` - Hover states
- `--color-primary-lighter: #3FBF63` - Active states
- `--color-primary-lightest: #E8F5E9` - Backgrounds
- `--color-primary-dark: #165A2E` - Pressed states

### Secondary (Orange)
- `--color-secondary: #E67E22` - Accent color
- `--color-secondary-light: #F39C12` - Hover states
- `--color-secondary-lighter: #F8B739` - Active states
- `--color-secondary-lightest: #FFF3E0` - Backgrounds
- `--color-secondary-dark: #D35400` - Pressed states

### Neutral (White & Grays)
- `--color-white: #FFFFFF` - Pure white
- `--color-bg: #FFFFFF` - Card backgrounds
- `--color-bg-secondary: #F7F9FB` - Section backgrounds
- `--color-text: #1F2937` - Primary text
- `--color-text-light: #6B7280` - Secondary text

## Usage Guidelines

### Buttons
- **Primary Action**: Green background (`--color-primary`)
- **Secondary Action**: Orange background (`--color-secondary`)
- **Tertiary Action**: White background with green border

### Cards & Containers
- **Background**: White (`--color-bg`)
- **Border**: Light gray (`--color-border`)
- **Shadow**: Use `--shadow-md` or `--shadow-green` for emphasis

### Text
- **Headings**: Dark gray (`--color-text`)
- **Body**: Dark gray (`--color-text`)
- **Muted**: Light gray (`--color-text-light`)
- **On colored backgrounds**: White (`--color-text-inverse`)

### Status Indicators
- **Success**: Green (`--color-success`)
- **Warning**: Orange (`--color-warning`)
- **Error**: Red (`--color-danger`)
- **Info**: Blue (`--color-info`)

## Quick Reference

```css
/* Primary Button */
background: var(--color-primary);
color: var(--color-text-inverse);

/* Secondary Button */
background: var(--color-secondary);
color: var(--color-text-inverse);

/* Card */
background: var(--color-bg);
border: 1px solid var(--color-border);
box-shadow: var(--shadow-md);

/* Accent Section */
background: var(--color-primary-lightest);
border-left: 4px solid var(--color-primary);
```

All CSS modules should use these variables instead of hardcoded colors.
