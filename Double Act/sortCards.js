const fs = require('fs');

// Read the original cardData.js
const content = fs.readFileSync('cardData.js', 'utf8');
// Extract just the array by finding the content between [ and ]
const arrayContent = content.substring(
    content.indexOf('['),
    content.lastIndexOf(']') + 1
);
const cardData = eval(arrayContent);

// Split cards by type
const cardsByType = {
    1: [], 2: [], 3: [], 4: [], 5: []
};

cardData.forEach(card => {
    cardsByType[card.type].push(card);
});

// Sort function for cards
const sortCards = (a, b) => {
    if (a.character < b.character) return -1;
    if (a.character > b.character) return 1;
    if (a.actors[0] < b.actors[0]) return -1;
    if (a.actors[0] > b.actors[0]) return 1;
    return 0;
};

// Sort each type's cards
Object.values(cardsByType).forEach(cards => cards.sort(sortCards));

// Create the type files
const types = {
    1: "Movie to Movie",
    2: "Movie to TV",
    3: "TV to TV",
    4: "Historical",
    5: "Superhero"
};

Object.entries(cardsByType).forEach(([type, cards]) => {
    let count = 1;
    const paddedCount = (num) => num.toString().padStart(3, '0');
    
    const fileContent = `// ${types[type]} cards
const cardDataType${type} = ${JSON.stringify(cards.map(card => ({
        ...card,
        type: parseInt(type),
        comment: paddedCount(count++)
    })), null, 4).replace(/"comment": "(\d+)"/g, '// $1')};

export { cardDataType${type} };`;

    fs.writeFileSync(`carddatatype${type}.js`, fileContent);
});

console.log('Card files have been created!');
