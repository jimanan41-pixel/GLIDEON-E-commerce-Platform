// Database setup verification script
// Run this after setting up your local database to verify everything works

const bcrypt = require('bcrypt');

// Test password verification
async function verifyPasswords() {
  const adminHash = '$2b$12$iNlxIsk6dRmD0Rjm/I7MRuafrVAjdltS7h0CPx/xMm2aK.A9a/7la';
  const customerHash = '$2b$12$5JfxIJrLiqczFLeOFUQSdOoMfcWTEWV7QNP0aCdrhxdPoSvDYGXTu';

  const adminMatch = await bcrypt.compare('admin123', adminHash);
  const customerMatch = await bcrypt.compare('customer123', customerHash);

  console.log('Password verification:');
  console.log('✅ Admin password (admin123):', adminMatch ? 'VALID' : 'INVALID');
  console.log('✅ Customer password (customer123):', customerMatch ? 'VALID' : 'INVALID');
  console.log('');
  
  if (adminMatch && customerMatch) {
    console.log('🎉 All passwords are correctly hashed and ready for use!');
  } else {
    console.log('❌ Password hash verification failed!');
  }
}

// Check environment variables
function checkEnvironment() {
  console.log('Environment Variables Check:');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ SET' : '❌ MISSING');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ SET' : '❌ MISSING');
  console.log('NODE_ENV:', process.env.NODE_ENV || 'not set');
  console.log('');
}

// Main verification function
async function main() {
  console.log('=== GLIDEON Local Setup Verification ===\n');
  
  checkEnvironment();
  await verifyPasswords();
  
  console.log('Demo Account Credentials:');
  console.log('👨‍💼 Admin: admin@glideon.com / admin123');
  console.log('👤 Customer: customer@glideon.com / customer123');
  console.log('');
  console.log('Next steps:');
  console.log('1. Run: createdb glideon_new');
  console.log('2. Run: psql -U postgres -d glideon_new -f database_setup.sql');
  console.log('3. Start app: npm run dev');
}

main().catch(console.error);