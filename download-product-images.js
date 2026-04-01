const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Product to image URL mapping based on the website
const productImageMap = {
  // Nepali Foods
  'Dal Bhat Set': 'https://www.ecoholidaysnepal.com/wp-content/uploads/2023/01/Dal-Bhat-Tarkari.jpg',
  'Thakali Khana Set': 'https://www.ecoholidaysnepal.com/wp-content/uploads/2023/01/Dal-Bhat-Tarkari.jpg',
  'Chicken Momo': 'https://www.ecoholidaysnepal.com/wp-content/uploads/2023/01/Momo.jpg',
  'Buff Momo': 'https://www.ecoholidaysnepal.com/wp-content/uploads/2023/01/Momo.jpg',
  'Fried Momo': 'https://www.ecoholidaysnepal.com/wp-content/uploads/2023/01/Momo.jpg',
  'Jhol Momo': 'https://www.ecoholidaysnepal.com/wp-content/uploads/2023/01/Momo.jpg',
  'Sel Roti with Achar': 'https://www.ecoholidaysnepal.com/wp-content/uploads/2023/01/Sel-Roti.jpg',
  'Chicken Choila': 'https://www.ecoholidaysnepal.com/wp-content/uploads/2023/01/Chhoila.jpg',
  'Buff Choila': 'https://www.ecoholidaysnepal.com/wp-content/uploads/2023/01/Chhoila.jpg',
  'Sekuwa Platter': 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800',
  'Aloo Tama Bodi': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800',
  'Gundruk Soup': 'https://www.ecoholidaysnepal.com/wp-content/uploads/2023/01/Gundruk.jpg',
  'Yomari': 'https://www.ecoholidaysnepal.com/wp-content/uploads/2023/01/Yomari.jpg',
  
  // Western Foods
  'Margherita Pizza': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800',
  'BBQ Chicken Pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800',
  'Classic Beef Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
  'Cheese burger': 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
  'Grilled Chicken Sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800',
  'Spaghetti Bolognese': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
  'Grilled Salmon Fillet': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
  'BBQ Pork Ribs': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
  'Caesar Salad': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800',
  
  // Snacks
  'French Fries': 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800',
  'Loaded Fries': 'https://images.unsplash.com/photo-1630431341973-02e1d0f45e79?w=800',
  'Chicken Wings': 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=800',
  'Onion Rings': 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=800',
  'Aloo Sadeko': 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800',
  'Spring Rolls': 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=800',
  
  // Desserts
  'Chocolate Lava Cake': 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800',
  'Sikarni': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800',
  'Cheesecake': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800',
  'Gulab Jamun with Ice Cream': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800',
  
  // Drinks
  'Nimbu Pani': 'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9d?w=800',
  'Masala Chai': 'https://images.unsplash.com/photo-1597318130878-aa1daa41c2eb?w=800',
  'Cold Coffee': 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=800',
  'coffee': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800',
  'Fresh Juice': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800',
  'Soft Drink': 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800',
  'Mineral Water': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800',
  
  // Fusion
  'Momo Quesadilla': 'https://images.unsplash.com/photo-1618040996337-56904b7850b9?w=800',
  'Sekuwa Tacos': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800',
  'Choila Pasta': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
  'Dal Bhat Risotto': 'https://images.unsplash.com/photo-1476124369491-f51a92c0c8b7?w=800',
  'Timur Pepper Chicken Burger': 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800',
  'Momo Soup Ramen': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
};

// Function to download image
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const protocol = parsedUrl.protocol === 'https:' ? https : http;
    
    const file = fs.createWriteStream(filepath);
    
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${path.basename(filepath)}`);
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        file.close();
        fs.unlinkSync(filepath);
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
      } else {
        file.close();
        fs.unlinkSync(filepath);
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlinkSync(filepath);
      reject(err);
    });
  });
}

// Main function
async function downloadAllImages() {
  const uploadDir = path.join(__dirname, 'src', 'uploads', 'products');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  console.log('🚀 Starting image download...\n');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const [productName, imageUrl] of Object.entries(productImageMap)) {
    try {
      // Create filename from product name
      const filename = productName.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '') + '.jpg';
      
      const filepath = path.join(uploadDir, filename);
      
      // Skip if file already exists
      if (fs.existsSync(filepath)) {
        console.log(`⏭️  Skipped (exists): ${filename}`);
        continue;
      }
      
      await downloadImage(imageUrl, filepath);
      successCount++;
      
      // Add delay to avoid overwhelming servers
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`❌ Failed: ${productName} - ${error.message}`);
      failCount++;
    }
  }
  
  console.log(`\n📊 Download Summary:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📁 Location: ${uploadDir}`);
}

// Run the script
downloadAllImages().catch(console.error);
