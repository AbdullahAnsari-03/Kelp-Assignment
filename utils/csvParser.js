/**
 * Parse a CSV line into an array of values
 */
function parseCSVLine(line) {
  return line.split(',');
}

/**
 * Builds a nested object from CSV headers and a row
 * Supports infinite depth like: a.b.c.d.e...
 */
function buildNestedObject(headers, row) {
  const result = {};

  for (let i = 0; i < headers.length; i++) {
    const keys = headers[i].split('.'); // split by dot for nesting
    let current = result;

    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];

      if (j === keys.length - 1) {
        current[key] = row[i];
      } else {
        if (!current[key] || typeof current[key] !== 'object') {
          current[key] = {};
        }
        current = current[key];
      }
    }
  }

  return result;
}

module.exports = { parseCSVLine, buildNestedObject };
