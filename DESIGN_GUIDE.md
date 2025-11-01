# Visual Design Guide

## MGNREGA Dashboard - UI/UX Design for Low-Literacy Users

This document explains the design decisions made to create an accessible interface for rural Indian citizens with varying literacy levels.

## Design Principles

### 1. **Visual-First Communication**

Instead of relying on text, we use:
- 🎨 **Colors**: Green (positive), Red (negative), Orange (neutral)
- 🔷 **Icons**: Universal symbols everyone understands
- 📊 **Charts**: Visual trends instead of numbers
- 🎯 **Progress bars**: Visual completion indicators

### 2. **Simplified Color Palette**

```
Primary Orange:  #f97316  (Warm, inviting)
Success Green:   #10b981  (Positive outcomes)
Warning Yellow:  #f59e0b  (Attention needed)
Danger Red:      #ef4444  (Problems)
Neutral Gray:    #6b7280  (Secondary info)
```

### 3. **Typography Hierarchy**

```
Hindi (Primary):
- Font: Noto Sans Devanagari
- Sizes: 16px (mobile), 18px (desktop)
- Weight: 400 (regular), 600 (semibold)

English (Secondary):
- Font: Inter
- Same size hierarchy
```

### 4. **Touch Target Sizes**

All interactive elements are **minimum 44x44 pixels** for easy tapping:
- Buttons: 48px height
- Cards: 120px minimum
- Icons: 24-32px

## Page Layouts

### Home Page

```
┌─────────────────────────────────────┐
│         MGNREGA Dashboard           │ ← Header
│      हमारी आवाज़, हमारे अधिकार      │   (Orange bar)
│                                     │
│   [हिंदी / English]                │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│                                     │
│   🗺️ अपनी जगह खोजें               │ ← Big Auto-detect
│   [Detect My Location]              │   button
│                                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   🔍 [Search districts...]          │ ← Search bar
└─────────────────────────────────────┘

┌─────────────┬─────────────┬─────────┐
│  📍 Agra   │ 📍 Lucknow │ 📍 Kanpur│ ← District
├─────────────┼─────────────┼─────────┤   cards
│ 📍 Varanasi│ 📍 Meerut  │ 📍 Aligarh│   (3 columns)
└─────────────┴─────────────┴─────────┘
```

### District Dashboard

```
┌─────────────────────────────────────┐
│  ← Back    LUCKNOW DISTRICT         │
│            October 2025              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Current Performance                │
└─────────────────────────────────────┘

┌──────────┬──────────┬──────────┬────┐
│ 👥 4.5L │ 💼 8.5K │ 🆔 45K  │ ₹225│ ← Metric cards
│ Person   │Employment│Job Cards│ Wage │   (visual first)
│ Days     │Provided  │Active   │/day  │
└──────────┴──────────┴──────────┴────┘

┌─────────────────────────────────────┐
│  ✅ Works Completed: 450             │ ← Work status
│  ⏰ Works Ongoing: 120               │   (big icons)
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  📈 Historical Trends                │
│  [Line Chart: Person Days]          │ ← Charts
│  [Bar Chart: Wages]                 │   (visual trends)
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  🏆 vs State Average                 │
│  ↑ 12% higher person days           │ ← Comparisons
│  ↑ 5% higher wages                  │   (arrows show
│  ↓ 3% lower job cards               │    direction)
└─────────────────────────────────────┘
```

## Component Design

### Metric Card

```
┌────────────────────────┐
│  👥                    │  ← Large icon (32px)
│                        │
│  Person Days Generated │  ← Label (small)
│  450,000              │  ← Value (big, bold)
│  in thousands         │  ← Context (tiny)
└────────────────────────┘
  Background: Light color
  Hover: Slight elevation
  Shadow: Subtle
```

### Comparison Card

```
┌────────────────────────┐
│  Person Days           │  ← Metric name
│                        │
│  450,000    ↑ 12%     │  ← District | Change
│  State avg: 400,000   │  ← Reference
└────────────────────────┘
  Green border if higher
  Red border if lower
```

### District Selector

```
┌────────────────────────┐
│  📍 Lucknow           │  ← Icon + Name
│                        │
└────────────────────────┘
  Hover: Scale 1.02
  Active: Orange border
  Size: 120px height
```

## Color Usage

### Metric Cards

```
Person Days:    Orange background (#fff7ed)
Employment:     Green background  (#f0fdf4)
Job Cards:      Blue background   (#eff6ff)
Average Wage:   Yellow background (#fffbeb)
```

### Status Indicators

```
✅ Completed:   Green (#10b981)
⏰ Ongoing:     Blue  (#3b82f6)
❌ Failed:      Red   (#ef4444)
⚠️  Warning:    Yellow (#f59e0b)
```

### Comparison Arrows

```
↑ Higher:  Green (#10b981)
↓ Lower:   Red   (#ef4444)
→ Same:    Gray  (#6b7280)
```

## Icon System

### Navigation
- 🏠 Home
- ← Back
- 🔍 Search
- 🗺️ Location

### Metrics
- 👥 People/Employment
- 💼 Job/Work
- 🆔 Cards/Documents
- ₹ Money/Wages
- 📊 Data/Statistics

### Actions
- ✅ Complete/Success
- ⏰ In Progress
- ❌ Failed/Error
- 📈 Growth/Increase
- 📉 Decline/Decrease

## Responsive Design

### Mobile (< 768px)

```
- Single column layout
- Stacked cards
- Full-width buttons
- Larger touch targets
- Bottom navigation
```

### Tablet (768px - 1024px)

```
- Two column layout
- Side navigation
- Balanced spacing
```

### Desktop (> 1024px)

```
- Three column layout
- Top navigation
- Maximum width: 1280px
- Centered content
```

## Accessibility Features

### Visual

1. **High Contrast Mode**
   - Supported via CSS media query
   - 7:1 contrast ratio for text

2. **Large Text**
   - Base: 16px (mobile), 18px (desktop)
   - Headers: 24-32px

3. **Clear Focus Indicators**
   - 2px orange outline
   - Visible on all interactive elements

### Interaction

1. **Keyboard Navigation**
   - Tab through all elements
   - Enter to activate
   - Escape to close

2. **Touch Gestures**
   - Tap to select
   - Swipe to scroll
   - Pinch to zoom (disabled for layout)

3. **Screen Readers**
   - Semantic HTML
   - ARIA labels
   - Alt text for images

## Animation Guidelines

### Subtle Animations Only

```css
/* Fade in new content */
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

/* Card hover */
.card-hover {
  transition: transform 0.2s;
}
.card-hover:hover {
  transform: translateY(-4px);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

## Loading States

### Spinner

```
┌────────────────────────┐
│                        │
│         ⌛             │  ← Spinning icon
│     Loading...         │
│                        │
└────────────────────────┘
  Center of screen
  Semi-transparent overlay
```

### Skeleton Screens

```
┌────────────────────────┐
│  ░░░░░░░░░░░░░        │  ← Animated
│  ░░░░░░░              │    gradient
│  ░░░░░░░░░░          │    rectangles
└────────────────────────┘
  Mimics final layout
  Gray shimmer effect
```

## Error States

### Error Message

```
┌────────────────────────┐
│  ⚠️ Error              │
│  Could not load data   │
│  [Try Again]           │
└────────────────────────┘
  Orange border
  Clear action button
```

### Empty State

```
┌────────────────────────┐
│  📭                    │
│  No data available     │
│  Select a district     │
└────────────────────────┘
  Gentle message
  Clear next step
```

## Chart Design

### Line Chart (Trends)

```
- Simple lines, no clutter
- Max 2 lines per chart
- Large data points
- Clear axis labels
- Tooltip on hover
```

### Bar Chart (Comparisons)

```
- Wide bars (easy to see)
- Clear spacing
- Value labels on bars
- Color-coded categories
```

### Best Practices

```
✅ Use consistent colors
✅ Label everything clearly
✅ Show actual values
✅ Keep it simple (1 metric per chart)
❌ No 3D effects
❌ No pie charts (hard to compare)
❌ No complex animations
```

## Language Switching

```
┌─────────────────────────┐
│  [हिंदी] English        │  ← Toggle button
└─────────────────────────┘
  Top right corner
  Instant switch
  No page reload
  Preserves state
```

## Mobile-Specific Features

### Bottom Navigation (Mobile Only)

```
┌─────────────────────────┐
│  🏠 Home │ 📊 Data │ ℹ️ Info │
└─────────────────────────┘
  Fixed at bottom
  Always visible
  Large tap targets
```

### Pull to Refresh

```
↓ Pull down to refresh
  Shows spinner
  Updates data
  Success feedback
```

## Performance Optimizations

### Image Optimization

- SVG icons (scalable, small)
- No photos/images (except logos)
- Lazy load off-screen content

### Font Loading

```css
/* Preload critical fonts */
<link rel="preload" href="font.woff2" as="font">

/* System fonts as fallback */
font-family: 'Noto Sans', system-ui, sans-serif;
```

### Critical CSS

- Inline above-the-fold CSS
- Defer non-critical CSS
- Remove unused styles

## Testing Checklist

### Visual Testing

- [ ] Test on 5" phone screen
- [ ] Test on 10" tablet screen  
- [ ] Test on 24" desktop screen
- [ ] Test with 200% zoom
- [ ] Test in bright sunlight (contrast)

### User Testing

- [ ] Can users find their district? (< 30 sec)
- [ ] Can users understand metrics? (without help)
- [ ] Can users compare data? (intuitively)
- [ ] Can users switch language? (easily)

### Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] High contrast mode works
- [ ] Focus indicators visible
- [ ] Touch targets large enough

## Success Metrics

### User Experience

- Time to first data: < 3 seconds
- District selection: < 30 seconds
- Task completion rate: > 90%
- User satisfaction: > 4/5

### Technical

- Lighthouse accessibility: > 95
- Page load: < 2 seconds
- Time to interactive: < 3 seconds
- Mobile score: > 90

---

## Design Philosophy

**"If my grandmother in a village can use it, it's good design."**

- Visual first, text second
- Big buttons, clear actions
- Instant feedback
- Forgiving errors
- Bilingual by default
- Works offline
- Fast everywhere

This approach ensures that the application is truly accessible to all citizens, regardless of their literacy level or technical expertise.
