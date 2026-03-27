require('dotenv').config({ path: './src/.env' });
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  images: [String],
  image_url: String,
  is_deleted: Boolean
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  // Aloo Sadeko
  await Product.findOneAndUpdate(
    { name: 'Aloo Sadeko', is_deleted: false },
    {
      images: [
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c384f78792c7e6d25672d703d7752532d6f57542532567361656276_1774595866999',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c614b54237474392a306163444f4d7b4531787546795225483f4d7b_1774595865869',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c414a2a564c3b394d5f524e7e434943563d53233030453078616734_1774595865614'
      ],
      image_url: 'https://compressedv2.s3.ap-south-1.amazonaws.com/4c384f78792c7e6d25672d703d7752532d6f57542532567361656276_1774595866999'
    }
  );
  console.log('✅ Aloo Sadeko updated');

  // Aloo Tama Bodi
  await Product.findOneAndUpdate(
    { name: 'Aloo Tama Bodi', is_deleted: false },
    {
      images: [
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c454f4c4a6b303078703454684c4532522578733d724c7e47497943_1774595866590',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c715279484a624725246a627875563f526b74522a306f6652345742_1774595869431',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c4b4d73514b5e2a6375544b2e393f626f4a6e2479593f764941254c_1774595866275'
      ],
      image_url: 'https://compressedv2.s3.ap-south-1.amazonaws.com/4c454f4c4a6b303078703454684c4532522578733d724c7e47497943_1774595866590'
    }
  );
  console.log('✅ Aloo Tama Bodi updated');

  // BBQ Chicken Pizza
  await Product.findOneAndUpdate(
    { name: 'BBQ Chicken Pizza', is_deleted: false },
    {
      images: [
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c4b51624b793b56475b25345e2b737e725a4a373725785d2c2d5236_1774595869054',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c4d4d366e7a7e41707b6b572431565b6f7a74372a4a577356587436_1774595867555',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c2d4e4a707b733a2e416a5b6f4856405745617d78766f676b565758_1774595867281'
      ],
      image_url: 'https://compressedv2.s3.ap-south-1.amazonaws.com/4c4b51624b793b56475b25345e2b737e725a4a373725785d2c2d5236_1774595869054'
    }
  );
  console.log('✅ BBQ Chicken Pizza updated');

  // BBQ Pork Ribs
  await Product.findOneAndUpdate(
    { name: 'BBQ Pork Ribs', is_deleted: false },
    {
      images: [
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c394c57587c30313048524e4d7674364f48526a3267785b30307847_1774595868267',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c4d4d366e7a7e41707b6b572431565b6f7a74372a4a577356587436_1774595867820',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c394c57587c30313048524e4d7674364f48526a3267785b30307847_1774595868740'
      ],
      image_url: 'https://compressedv2.s3.ap-south-1.amazonaws.com/4c394c57587c30313048524e4d7674364f48526a3267785b30307847_1774595868267'
    }
  );
  console.log('✅ BBQ Pork Ribs updated');

  // Buff Choila
  await Product.findOneAndUpdate(
    { name: 'Buff Choila', is_deleted: false },
    {
      images: [
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c50483237252e5430324872523f74536f234d7c306945352d437453_1774596225897',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c4c4a376a786e69547c2565587174525269573d2e6d256749575324_1774596227378',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c674f4435764e64547a733d4f3f4d7c52516263547d496e69774e62_1774596227807'
      ],
      image_url: 'https://compressedv2.s3.ap-south-1.amazonaws.com/4c50483237252e5430324872523f74536f234d7c306945352d437453_1774596225897'
    }
  );
  console.log('✅ Buff Choila updated');

  // Buff Momo
  await Product.findOneAndUpdate(
    { name: 'Buff Momo', is_deleted: false },
    {
      images: [
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c654d2541596e4a2e5449712d6f6f61453174382e3952506f4a6f7e_1774596231058',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c454b5e346867674a462d2e5e5a7e55495d786179467e70695f4b36_1774596224380',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c424e527241674f796e3f733f595b6d47713962793a394b49766f79_1774596229114'
      ],
      image_url: 'https://compressedv2.s3.ap-south-1.amazonaws.com/4c654d2541596e4a2e5449712d6f6f61453174382e3952506f4a6f7e_1774596231058'
    }
  );
  console.log('✅ Buff Momo updated');

  // Caesar Salad
  await Product.findOneAndUpdate(
    { name: 'Caesar Salad', is_deleted: false },
    {
      images: [
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c444c4d4c56454d4e23254d7e56656e785d53353058565b4f5b6e69_1774596231568',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c53503d7d7b535d3d7878753f644d784a3758537959715b78474e46_1774596226266',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c3747477a726f7c303345322d3a6f665742616531306a757d716f4b_1774596227648'
      ],
      image_url: 'https://compressedv2.s3.ap-south-1.amazonaws.com/4c444c4d4c56454d4e23254d7e56656e785d53353058565b4f5b6e69_1774596231568'
    }
  );
  console.log('✅ Caesar Salad updated');

  // Cheesecake
  await Product.findOneAndUpdate(
    { name: 'Cheesecake', is_deleted: false },
    {
      images: [
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c464b313252393f377949762532395d6d2b727159385852784c624a_1774596228147',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c4c4e6b7c6f2478436d565b72746124624774526b596f23785d6b3f_1774596229478',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c4f4c4d2a317d5d47405f32582b2d71454c6e685f34785e6540526f_1774596231904'
      ],
      image_url: 'https://compressedv2.s3.ap-south-1.amazonaws.com/4c464b313252393f377949762532395d6d2b727159385852784c624a_1774596228147'
    }
  );
  console.log('✅ Cheesecake updated');

  // Chicken Choila
  await Product.findOneAndUpdate(
    { name: 'Chicken Choila', is_deleted: false },
    {
      images: [
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c41497a3b53455f4857245b34542b7a3023396a30342d352b5a7030_1774596229938',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c36497b63692d2e305049717e4d303534737c4c30332b763d5e5e68_1774596230427',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c45534c59436b427c37776450246179766b6f4c5f336e2a4759573b_1774596228317'
      ],
      image_url: 'https://compressedv2.s3.ap-south-1.amazonaws.com/4c41497a3b53455f4857245b34542b7a3023396a30342d352b5a7030_1774596229938'
    }
  );
  console.log('✅ Chicken Choila updated');

  // Chicken Momo
  await Product.findOneAndUpdate(
    { name: 'Chicken Momo', is_deleted: false },
    {
      images: [
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c4f4c4d2a317d5d47405f32582b2d71454c6e685f34785e6540526f_1774596228662',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c63507d6f537623635b6f7d236a495b5841247950435336614a6f62_1774596228828',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c514c702c4f746e746e746d5e2b4955536967347536254d25327436_1774596236040'
      ],
      image_url: 'https://compressedv2.s3.ap-south-1.amazonaws.com/4c4f4c4d2a317d5d47405f32582b2d71454c6e685f34785e6540526f_1774596228662'
    }
  );
  console.log('✅ Chicken Momo updated');

  // Chicken Wings
  await Product.findOneAndUpdate(
    { name: 'Chicken Wings', is_deleted: false },
    {
      images: [
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c4444527654414930337d7039746e363d7b6b57306824693d783553_1774596229652',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c414c3125677d5855456240343b457b3023526b30244f726b535379_1774596232214',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c664d514f7b3f7725242d3a5e694e47522e522a50577843732b5673_1774596235680'
      ],
      image_url: 'https://compressedv2.s3.ap-south-1.amazonaws.com/4c4444527654414930337d7039746e363d7b6b57306824693d783553_1774596229652'
    }
  );
  console.log('✅ Chicken Wings updated');

  // Chocolate Lava Cake
  await Product.findOneAndUpdate(
    { name: 'Chocolate Lava Cake', is_deleted: false },
    {
      images: [
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c614b54237474392a306163444f4d7b4531787546795225483f4d7b_1774596230723',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c34486f4f4b475830307245303039737e552d573030246c24784e45_1774596236192',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c474c663a593d7c3030475a394761247338574133474e7271736924_1774596233139'
      ],
      image_url: 'https://compressedv2.s3.ap-south-1.amazonaws.com/4c614b54237474392a306163444f4d7b4531787546795225483f4d7b_1774596230723'
    }
  );
  console.log('✅ Chocolate Lava Cake updated');

  // Choila Pasta
  await Product.findOneAndUpdate(
    { name: 'Choila Pasta', is_deleted: false },
    {
      images: [
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c384c4d775e7d723554356c30303032563f254b303050426179232c_1774596232830',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c4a4a7377685f33423b5432347c2d34493a4e674274522e52524e64_1774596231410',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c534e6c6c302d2c2524743779445742585457422525617974546263_1774596235117'
      ],
      image_url: 'https://compressedv2.s3.ap-south-1.amazonaws.com/4c384c4d775e7d723554356c30303032563f254b303050426179232c_1774596232830'
    }
  );
  console.log('✅ Choila Pasta updated');

  // Classic Beef Burger
  await Product.findOneAndUpdate(
    { name: 'Classic Beef Burger', is_deleted: false },
    {
      images: [
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c564a365d435b6c4b3773537e715a242532574250564d7c2d514940_1774596233770',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c7051627146254d2a305758242a6263573d652e25245745524f6a59_1774596232470',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c4a4668742a3940355b2b763d7c6b564f54777d45434d797e565834_1774596236734'
      ],
      image_url: 'https://compressedv2.s3.ap-south-1.amazonaws.com/4c564a365d435b6c4b3773537e715a242532574250564d7c2d514940_1774596233770'
    }
  );
  console.log('✅ Classic Beef Burger updated');

  // Cold Coffee
  await Product.findOneAndUpdate(
    { name: 'Cold Coffee', is_deleted: false },
    {
      images: [
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c41446c2479313979453d6e6b75385e385f3f5a35786b434d5f777e_1774596233529',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c4d4b413f316164795a496f256874536e4e6e25453162636a45563f_1774596236382',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c3d4d3753726f78743a3f456a5a57556f65616552706f636f7a6e6a_1774596234162'
      ],
      image_url: 'https://compressedv2.s3.ap-south-1.amazonaws.com/4c41446c2479313979453d6e6b75385e385f3f5a35786b434d5f777e_1774596233529'
    }
  );
  console.log('✅ Cold Coffee updated');

  // Dal Bhat Risotto
  await Product.findOneAndUpdate(
    { name: 'Dal Bhat Risotto', is_deleted: false },
    {
      images: [
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c715046344f58382e546f336b4161796a5a6a472e546f4a6f7e617b_1774596234405',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c464f417d492b46595072723130474724684d7c3439254d343a5838_1774596235443',
        'https://compressedv2.s3.ap-south-1.amazonaws.com/4c4f4c4d2a317d5d47405f32582b2d71454c6e685f34785e6540526f_1774596234773'
      ],
      image_url: 'https://compressedv2.s3.ap-south-1.amazonaws.com/4c715046344f58382e546f336b4161796a5a6a472e546f4a6f7e617b_1774596234405'
    }
  );
  console.log('✅ Dal Bhat Risotto updated');

  console.log('\n✨ Done! 16 products updated with Kaha CDN URLs\n');
  await mongoose.connection.close();
}

main();
