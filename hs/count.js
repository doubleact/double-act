const fs = require('fs');

const content = fs.readFileSync('cardData.js', 'utf8');
const matches = content.match(/type: [1-5]/g);

const counts = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
matches.forEach(m => {
    const type = parseInt(m.split(' ')[1]);
    counts[type]++;
});

console.log('Card counts by type:');
Object.entries(counts).forEach(([type, count]) => {
    console.log(`Type ${type}: ${count} cards`);
});
console.log(`Total cards: ${Object.values(counts).reduce((a,b) => a+b, 0)}`);
