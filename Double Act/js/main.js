import { DebugMode } from './utils/DebugMode.js';

// Initialize debug mode when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    DebugMode.initialize();
    console.log('Debug mode initialized - Press Ctrl+M to toggle debug view');
});
