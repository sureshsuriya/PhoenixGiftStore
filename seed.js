const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/pheonix-gifts';

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    category: String,
    images: [String],
    features: [String],
    isAvailable: Boolean,
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const sampleProducts = [
  {
    name: "Polaroid Keychain",
    description: "Aesthetic keepsakes you can carry anywhere.",
    price: 199,
    category: "Polaroids",
    images: ["https://images.unsplash.com/photo-1526285849717-482456cd7436"],
    features: ["Custom Photo", "Double Sided", "Premium Acrylic"],
    isAvailable: true
  },
  {
    name: "Pencil Art Portrait",
    description: "Hand-drawn sketches that bring your memories to life.",
    price: 899,
    category: "Art",
    images: ["https://images.unsplash.com/photo-1513364776144-60967b0f800f"],
    features: ["A4 Size", "Hand-drawn", "High Quality Paper"],
    isAvailable: true
  },
  {
    name: "Spotify Polaroid",
    description: "Combine your favorite song with your favorite moment.",
    price: 299,
    category: "Music Gifts",
    images: ["https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17"],
    features: ["Scannable Code", "Custom Photo", "Premium Glossy"],
    isAvailable: true
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    await Product.deleteMany({});
    console.log('Cleared existing products.');

    await Product.insertMany(sampleProducts);
    console.log('Sample products inserted.');

    await mongoose.disconnect();
    console.log('Disconnected.');
  } catch (err) {
    console.error(err);
  }
}

seed();
