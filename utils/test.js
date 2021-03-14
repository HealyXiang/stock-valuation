const fs = require('fs');
const path = require('path');

function getFilePath(fileName) {
  return path.join(__dirname, '../stockData/')
}

const dir = fs.readdirSync(getFilePath());

console.log('dir:', dir)