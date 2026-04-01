const mongoose = require('mongoose');
const Role = require('./models/role.model');
require('dotenv').config();

/**
 * Seed Default Roles Script
 * 
 * This script creates default roles for testing and development.
 * 
 * Usage:
 *   node src/seedRoles.js
 */

const DEFAULT_ROLES = [
    {
        name: 'Waiter',
        description: 'Serves customers and takes orders',
        isActive: true
    },
    {
        name: 'Chef',
        description: 'Prepares food in the kitchen',
        isActive: true
    },
    {
        name: 'Manager',
        description: 'Manages restaurant operations',
        isActive: true
    },
    {
        name: 'Cashier',
        description: 'Handles payments and billing',
        isActive: true
    },
    {
        name: 'Host',
        description: 'Greets and seats customers',
        isActive: true
    },
    {
        name: 'Bartender',
        description: 'Prepares and serves beverages',
        isActive: true
    }
];

async function seedRoles() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/restaurant_db';
        await mongoose.connect(mongoUri);
        console.log('[SUCCESS] Connected to MongoDB');

        console.log('\n[START] Starting role seeding process...\n');

        let createdCount = 0;
        let skippedCount = 0;

        // Create each role
        for (const roleData of DEFAULT_ROLES) {
            // Check if role already exists
            const existingRole = await Role.findOne({ name: roleData.name });
            
            if (existingRole) {
                console.log(`⏭️  Skipped: "${roleData.name}" (already exists)`);
                skippedCount++;
            } else {
                await Role.create(roleData);
                console.log(`✅ Created: "${roleData.name}" - ${roleData.description}`);
                createdCount++;
            }
        }

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('[SUMMARY] Seeding Summary:');
        console.log(`   [OK] Created: ${createdCount} role(s)`);
        console.log(`   [SKIP] Skipped: ${skippedCount} role(s) (already existed)`);
        console.log(`   [TOTAL] Total: ${DEFAULT_ROLES.length} role(s)`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        if (createdCount > 0) {
            console.log('[SUCCESS] Default roles seeded successfully!');
            console.log('[INFO] You can now test staff creation with these roles.\n');
        } else {
            console.log('[INFO] All roles already exist. No new roles were created.\n');
        }

    } catch (error) {
        console.error('❌ Error seeding roles:', error.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('✅ Database connection closed');
        process.exit(0);
    }
}

// Run the seed function
seedRoles();
