require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/userModel');
const Product = require('./models/productModel');
const Review = require('./models/reviewModel');
const { updateProductStats } = require('./utils');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not configured in .env');
  process.exit(1);
}

const sampleUsers = [
  {
    name: 'Admin Curator',
    email: 'admin@verdict.io',
    password: 'Password123!',
    role: 'admin'
  },
  {
    name: 'Alex Rivera',
    email: 'alex@verdict.io',
    password: 'Password123!',
    role: 'user'
  },
  {
    name: 'Elena Chen',
    email: 'elena@verdict.io',
    password: 'Password123!',
    role: 'user'
  },
  {
    name: 'Marcus Vance',
    email: 'marcus@verdict.io',
    password: 'Password123!',
    role: 'user'
  }
];

const sampleProducts = [
  {
    name: 'Acoustic Labs Apex Pro Over-Ear Headphones',
    price: 399,
    category: 'Audio',
    description: 'Precision-engineered titanium drivers coupled with hybrid ANC, 42-hour battery life, and handcrafted memory foam magnetic ear cushions for unparalleled acoustic clarity.',
    coverImageName: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    otherImageNames: [
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
    ],
    quantityAvailable: 45,
    availabilityStatus: 'available'
  },
  {
    name: 'Lumix Prime 34 Curved OLED Monitor',
    price: 1199,
    category: 'Displays',
    description: 'Ultrawide 3440x1440 QD-OLED display delivering pure blacks, 0.03ms response time, 240Hz refresh rate, and 99.3% DCI-P3 color gamut for master grading and gaming.',
    coverImageName: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80',
    otherImageNames: [
      'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=800&q=80'
    ],
    quantityAvailable: 18,
    availabilityStatus: 'available'
  },
  {
    name: 'Obsidian 75 Gasket Mechanical Keyboard',
    price: 249,
    category: 'Peripherals',
    description: 'CNC-machined anodized aluminum housing with brass weight bar, screw-in stabilizers, pre-lubed tactile switches, and hot-swappable PCB supporting QMK/VIA.',
    coverImageName: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80',
    otherImageNames: [
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80'
    ],
    quantityAvailable: 32,
    availabilityStatus: 'available'
  },
  {
    name: 'Sonos Move 2 Spatial Sound System',
    price: 449,
    category: 'Audio',
    description: 'Weatherproof portable smart speaker with upgraded stereo architecture, continuous Trueplay tuning, 24 hours of playback, and multi-room lossless streaming.',
    coverImageName: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80',
    otherImageNames: [],
    quantityAvailable: 25,
    availabilityStatus: 'available'
  },
  {
    name: 'Leica Q3 Monochrom Mirrorless Camera',
    price: 4995,
    category: 'Photography',
    description: 'Full-frame 60MP BSI sensor with fixed Summilux 28mm f/1.7 ASPH lens, 8K video recording, weather-sealed IP52 construction, and wireless Qi charging grip.',
    coverImageName: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
    otherImageNames: [
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80'
    ],
    quantityAvailable: 6,
    availabilityStatus: 'available'
  },
  {
    name: 'Keychron M3 Wireless Ergonomic Mouse',
    price: 69,
    category: 'Peripherals',
    description: 'Ultralight 79g symmetrical mouse featuring PixArt 3395 flagship sensor, 26,000 DPI, 1000Hz polling rate, and seamless 2.4G wireless and Bluetooth 5.1.',
    coverImageName: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1200&q=80',
    otherImageNames: [],
    quantityAvailable: 80,
    availabilityStatus: 'available'
  },
  {
    name: 'Studio Display XDR 32 6K Workstation',
    price: 2499,
    category: 'Displays',
    description: 'Reference-grade 6016x3384 Retina display with 1600 nits peak brightness, 1,000,000:1 contrast ratio, nano-texture glass, and studio-quality 6-speaker array.',
    coverImageName: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80',
    otherImageNames: [],
    quantityAvailable: 10,
    availabilityStatus: 'available'
  },
  {
    name: 'Focal Bathys Hi-Fi ANC Wireless Headphones',
    price: 699,
    category: 'Audio',
    description: 'Made in France aluminum-magnesium dome drivers with USB-DAC mode supporting 24-bit/192kHz audio, backlit flame badge, and fast USB-C charge.',
    coverImageName: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
    otherImageNames: [],
    quantityAvailable: 15,
    availabilityStatus: 'available'
  },
  {
    name: 'Hasselblad 907X 50C Medium Format Body',
    price: 6390,
    category: 'Photography',
    description: 'Compact medium-format digital back with 50-megapixel CMOS sensor, 14 stops dynamic range, 3.2-inch tilt touchscreen, and compatibility with classic V-system bodies.',
    coverImageName: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=80',
    otherImageNames: [],
    quantityAvailable: 0,
    availabilityStatus: 'out-of-stock'
  },
  {
    name: 'Grovemade Walnut MagSafe Dual Charging Dock',
    price: 180,
    category: 'Peripherals',
    description: 'Solid brass base with American black walnut top cap, precision weighted to 3.5 lbs for one-handed phone detachment with 15W fast MagSafe charging.',
    coverImageName: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1200&q=80',
    otherImageNames: [],
    quantityAvailable: 50,
    availabilityStatus: 'available'
  },
  {
    name: 'Kanto TUK Powered Bookshelf Speakers',
    price: 899,
    category: 'Audio',
    description: 'High-performance AMT tweeters with 5.25-inch aluminum drivers, dedicated phono preamp, USB DAC, optical inputs, and active DSP crossover.',
    coverImageName: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1200&q=80',
    otherImageNames: [],
    quantityAvailable: 12,
    availabilityStatus: 'available'
  },
  {
    name: 'CalDigit TS4 Thunderbolt 4 Station 18-Port',
    price: 399,
    category: 'Peripherals',
    description: 'Industry-leading 18 ports of connectivity including 98W Power Delivery, 2.5GbE LAN, front SD/microSD 4.0 UHS-II, and dual 6K display output.',
    coverImageName: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    otherImageNames: [],
    quantityAvailable: 22,
    availabilityStatus: 'available'
  }
];

const sampleReviewsData = [
  {
    productIndex: 0,
    userIndex: 1,
    title: 'Reference sound in a wireless body',
    comment: 'The sub-bass resolution and dynamic separation are unmatched. The ANC eliminates office noise without changing the frequency response. Worth every single penny.',
    rating: 5
  },
  {
    productIndex: 0,
    userIndex: 2,
    title: 'Exquisite build, slight clamp pressure',
    comment: 'The memory foam cushions feel like luxury leather gloves. Out of the box the headband clamp was slightly tight, but after 3 days of break-in it is sublime.',
    rating: 4
  },
  {
    productIndex: 1,
    userIndex: 2,
    title: 'Best monitor I have ever owned for coding and grading',
    comment: 'Going from IPS to QD-OLED is a revelation. Text clarity is razor-sharp on macOS via USB-C, and SDR accuracy out of the box had delta E under 1.2.',
    rating: 5
  },
  {
    productIndex: 1,
    userIndex: 3,
    title: 'Stunning colors, stand takes up desk space',
    comment: 'The panel itself is astonishing. Zero blooming in dark rooms. Make sure you have a deep desk or use a VESA mount because the triangular legs extend 9 inches.',
    rating: 4
  },
  {
    productIndex: 2,
    userIndex: 1,
    title: 'Typing bliss for software engineers',
    comment: 'The gasket mount flex provides just enough cushion for 10-hour coding sessions. The brass weight makes it sit like an anchor on the desk.',
    rating: 5
  },
  {
    productIndex: 2,
    userIndex: 3,
    title: 'Great switches, software is web-based VIA',
    comment: 'Keycaps have deep texture and sound wonderfully thocky. Setup via VIA took literally 30 seconds to remap Caps Lock to Control.',
    rating: 5
  },
  {
    productIndex: 3,
    userIndex: 2,
    title: 'Massive room-filling sound on the terrace',
    comment: 'Soundstage is remarkably broad for a single unit. Trueplay auto-calibrated within seconds after moving from kitchen to backyard patio.',
    rating: 5
  },
  {
    productIndex: 4,
    userIndex: 1,
    title: 'Pure photographic meditation',
    comment: 'Stripping out color forces you to see light, tone, and texture in a completely new way. The Summilux 28mm f/1.7 is a masterwork optic.',
    rating: 5
  },
  {
    productIndex: 5,
    userIndex: 3,
    title: 'Super lightweight and reliable wireless',
    comment: 'No lag whatsoever on 2.4G dongle. Battery lasts over two weeks on single charge with RGB disabled.',
    rating: 4
  },
  {
    productIndex: 6,
    userIndex: 1,
    title: 'The gold standard for color-critical work',
    comment: 'The nano-texture coating eliminates glare completely without any haze. 6K resolution means 1:1 pixel preview of 4K footage with room to spare for UI.',
    rating: 5
  },
  {
    productIndex: 7,
    userIndex: 2,
    title: 'Audiophile grade DAC mode is a gamechanger',
    comment: 'Plugged via USB-C to my laptop, the onboard DAC reveals micro-details that Bluetooth compression normally smears. French craftsmanship is evident everywhere.',
    rating: 5
  }
];

async function deleteData() {
  try {
    await mongoose.connect(MONGODB_URI);
    await User.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    console.log('Database cleared successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error clearing database:', err);
    process.exit(1);
  }
}

async function importData() {
  try {
    await mongoose.connect(MONGODB_URI);

    // Keep existing admin if already present, or clean & reseed
    await User.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();

    const createdUsers = [];
    for (const u of sampleUsers) {
      const user = await User.create(u);
      createdUsers.push(user);
    }

    const createdProducts = [];
    for (const p of sampleProducts) {
      const prod = await Product.create(p);
      createdProducts.push(prod);
    }

    for (const r of sampleReviewsData) {
      const product = createdProducts[r.productIndex];
      const user = createdUsers[r.userIndex];
      if (product && user) {
        await Review.create({
          title: r.title,
          comment: r.comment,
          rating: r.rating,
          productId: product._id,
          userId: user._id
        });
        await updateProductStats(product._id);
      }
    }

    console.log(`Successfully seeded ${createdUsers.length} users, ${createdProducts.length} products, and ${sampleReviewsData.length} reviews.`);
    process.exit(0);
  } catch (err) {
    console.error('Error importing seed data:', err);
    process.exit(1);
  }
}

if (process.argv.includes('--delete')) {
  deleteData();
} else if (process.argv.includes('--import')) {
  importData();
} else {
  console.log('Usage: node import-dev-data.js [--import | --delete]');
  process.exit(0);
}
