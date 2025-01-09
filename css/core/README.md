# Core CSS Files - DO NOT MODIFY

The files in this directory are core components of the Double Act game and should not be modified.

## basecard.css
This file contains the fundamental card structure and styling used throughout the game. Any modifications to this file could break the game's layout and functionality across all cards.

## How to Customize Cards
Instead of modifying the base card:
1. Create a new CSS file in the `css/cards/` directory for your specific card
2. Import the base card CSS using `@import '../core/basecard.css';`
3. Override specific styles using more specific selectors, for example:
```css
.your-card-name {
    /* Your custom styles here */
}
```

Example:
```css
@import '../core/basecard.css';

.start-card {
    /* Custom styles for start card */
}

.start-card .card-body {
    /* Custom styles for start card body */
}
```
