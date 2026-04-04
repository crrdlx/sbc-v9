const fs = require('fs');

let data = fs.readFileSync('pages/dev_notes.html', 'utf8');

// Replace map background
data = data.replace('backgroundColor : "#FFFFFF",', 'backgroundColor : "transparent",');
data = data.replace('backgroundAlpha : 1,', 'backgroundAlpha : 0,');

// Replace area styling
data = data.replace('color : "#B4B4B7",', 'color : "#334155",');
data = data.replace('colorSolid : "#F2A900",', 'colorSolid : "#f59e0b",');
data = data.replace('selectedColor : "#F2A900",', 'selectedColor : "#f59e0b",');
data = data.replace('outlineColor : "#666666",', 'outlineColor : "#1e293b",');
data = data.replace('rollOverColor : "#9EC2F7",', 'rollOverColor : "#38bdf8",');
data = data.replace('rollOverOutlineColor : "#000000"', 'rollOverOutlineColor : "#0f172a"');

fs.writeFileSync('pages/dev_notes.html', data);
console.log('Done mapping');
