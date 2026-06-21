const mongoose = require('mongoose');
const dns = require('dns');

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function resolveWithFallback(hostname, callback) {
  dns.resolve(hostname, 'ANY', (err, addresses) => {
    if (!err) return callback(null, addresses);
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    dns.resolve(hostname, 'ANY', (err2, addresses2) => {
      dns.setServers(['8.8.8.8', '8.8.4.4']);
      callback(err2, addresses2);
    });
  });
}

const connectDB = async (retries = MAX_RETRIES) => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in environment variables');
  }

  const srvMatch = mongoUri.match(/^mongodb\+srv:\/\/(.+)$/);
  if (srvMatch) {
    const srvHost = srvMatch[1].split('@')[1] || srvMatch[1].split('/')[0];
    if (srvHost) {
      try {
        await new Promise((resolve, reject) => {
          resolveWithFallback(srvHost, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      } catch (e) {}
    }
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        maxPoolSize: 5,
      });
      console.log('MongoDB Connected to Atlas');
      return;
    } catch (err) {
      const isDnsError =
        err.message.includes('querySrv') ||
        err.message.includes('ENOTFOUND') ||
        err.message.includes('getaddrinfo') ||
        err.message.includes('EAI_AGAIN');

      if (isDnsError) {
        dns.setServers(['8.8.8.8', '8.8.4.4']);
      }

      if (attempt < retries) {
        console.warn(`MongoDB connection attempt ${attempt}/${retries} failed: ${err.message}. Retrying in ${RETRY_DELAY_MS / 1000}s...`);
        await sleep(RETRY_DELAY_MS * attempt);
        continue;
      }

      dns.setServers(['8.8.8.8', '8.8.4.4']);

      try {
        console.warn(`Final attempt with Google DNS (8.8.8.8)...`);
        await mongoose.connect(mongoUri, {
          serverSelectionTimeoutMS: 20000,
          socketTimeoutMS: 45000,
          maxPoolSize: 5,
        });
        console.log('MongoDB Connected to Atlas (via Google DNS)');
        return;
      } catch (finalErr) {
        console.error(`MongoDB Atlas connection failed after ${retries} retries:`);
        console.error(`  Error: ${finalErr.message}`);
        if (finalErr.message.includes('querySrv')) {
          console.error('  This is likely a DNS SRV blocking issue on your network.');
          console.error('  Try using a non-SRV connection string instead of mongodb+srv://');
          console.error('  Example: mongodb://cluster1.wm2qf5c.mongodb.net:27017/resumatch?ssl=true&retryWrites=true&w=majority');
        } else if (finalErr.message.includes('ENOTFOUND') || finalErr.message.includes('getaddrinfo')) {
          console.error('  DNS resolution failed. Check your network or try a different DNS.');
        } else if (finalErr.message.includes('Authentication')) {
          console.error('  Authentication failed. Check your username and password in MONGO_URI.');
        } else if (finalErr.message.includes('whitelist')) {
          console.error('  Your IP is not whitelisted in MongoDB Atlas.');
          console.error('  Go to Network Access in Atlas and add your current IP.');
        }
        throw finalErr;
      }
    }
  }
};

async function gracefulShutdown() {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  } catch (e) {
    console.warn('Shutdown cleanup warning:', e.message);
  }
}

module.exports = connectDB;
module.exports.gracefulShutdown = gracefulShutdown;