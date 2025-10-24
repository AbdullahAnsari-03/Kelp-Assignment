function mapToDbRow(obj) {
  const firstName = obj?.name?.firstName || '';
  const lastName = obj?.name?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim();
  const age = obj?.age ? parseInt(obj.age, 10) : null;
  const address = obj.address || null;

  const additional = {};
  for (const key in obj) {
    if (!['name', 'age', 'address'].includes(key)) {
      additional[key] = obj[key];
    }
  }

  return {
    name: fullName,
    age,
    address,
    additional_info: Object.keys(additional).length ? additional : null
  };
}

module.exports = { mapToDbRow };
