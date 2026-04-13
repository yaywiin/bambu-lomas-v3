const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'admin/public/images/logo');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}
const base64Data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
fs.writeFileSync(path.join(dir, 'logo.png'), Buffer.from(base64Data, 'base64'));
console.log('Dummy logo.png created.');
