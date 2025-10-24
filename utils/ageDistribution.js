const pool = require('../db/connection');

async function printAgeDistribution() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT age FROM public.users');
    const ages = res.rows.map(r => parseInt(r.age, 10)).filter(a => !isNaN(a));

    if (ages.length === 0) {
      console.log('⚠️ No users found in database.');
      return;
    }

    const total = ages.length;
    const groups = { lt20: 0, t20_40: 0, t40_60: 0, gt60: 0 };

    ages.forEach(age => {
      if (age < 20) groups.lt20++;
      else if (age <= 40) groups.t20_40++;
      else if (age <= 60) groups.t40_60++;
      else groups.gt60++;
    });

    console.log('\n📊 Age Group Percentage Distribution:');
    console.log(`< 20 years  : ${(groups.lt20 / total * 100).toFixed(2)}%`);
    console.log(`20 - 40 yrs : ${(groups.t20_40 / total * 100).toFixed(2)}%`);
    console.log(`40 - 60 yrs : ${(groups.t40_60 / total * 100).toFixed(2)}%`);
    console.log(`> 60 years  : ${(groups.gt60 / total * 100).toFixed(2)}%`);
    console.log('------------------------------------\n');
  } finally {
    client.release();
  }
}

module.exports = { printAgeDistribution };
