require('dotenv').config();
const mongoose = require('mongoose');
const Table = require('./models/table.model');

const tables = [
  { tableNumber: 1, capacity: 2, location: 'Window', status: 'active' },
  { tableNumber: 2, capacity: 2, location: 'Window', status: 'active' },
  { tableNumber: 3, capacity: 4, location: 'Main Hall', status: 'active' },
  { tableNumber: 4, capacity: 4, location: 'Main Hall', status: 'active' },
  { tableNumber: 5, capacity: 4, location: 'Main Hall', status: 'active' },
  { tableNumber: 6, capacity: 6, location: 'Main Hall', status: 'active' },
  { tableNumber: 7, capacity: 6, location: 'Main Hall', status: 'active' },
  { tableNumber: 8, capacity: 8, location: 'Private Room', status: 'active' },
  { tableNumber: 9, capacity: 8, location: 'Private Room', status: 'active' },
  { tableNumber: 10, capacity: 10, location: 'Banquet Hall', status: 'active' },
  { tableNumber: 11, capacity: 2, location: 'Patio', status: 'active' },
  { tableNumber: 12, capacity: 4, location: 'Patio', status: 'active' },
  { tableNumber: 13, capacity: 6, location: 'Patio', status: 'active' },
  { tableNumber: 14, capacity: 4, location: 'Bar Area', status: 'active' },
  { tableNumber: 15, capacity: 20, location: 'Party Hall', status: 'active' }
];

async function seedTables() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Table.deleteMany({});
    console.log('Cleared existing tables');

    const created = await Table.insertMany(tables);
    console.log(`Seeded ${created.length} tables successfully`);

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding tables:', error.message);
    process.exit(1);
  }
}

seedTables();
