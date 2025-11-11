const path = require('path');

// Load once at boot. If you want hot-reload, read the file each time.
const prices = require(path.join(__dirname, '../config/radiologyPrices.json'));

function normalizeTemplateName(name) {
   if (!name || typeof name !== 'string') {
      throw new Error('templateName is required');
   }
   return name.endsWith('.html') ? name : `${name}.html`;
}

function getStaticPrice(templateNameRaw) {
   const templateName = normalizeTemplateName(templateNameRaw);
   const price = prices[templateName];
   if (price == null) {
      throw new Error(
         `No price found for template "${templateName}". Add it to radiologyPrices.json`
      );
   }
   return { templateName, amount: Number(price) };
}

module.exports = { getStaticPrice, normalizeTemplateName };
