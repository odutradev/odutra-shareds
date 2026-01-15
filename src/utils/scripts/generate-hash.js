import { createHash } from 'node:crypto';
import { createInterface } from 'node:readline';

const rl = createInterface({ input: process.stdin, output: process.stdout });

console.log('\n🔐 PIN Hash Generator (SHA-256)\n');

rl.question('Enter PIN to hash: ', (pin) => {
  if (!pin) {
    console.error('Error: PIN cannot be empty.');
    process.exit(1);
  }

  const hash = createHash('sha256').update(pin).digest('hex');

  console.log(`\n----------------------------------------`);
  console.log(`Input: ${pin}`);
  console.log(`Hash:  ${hash}`);
  console.log(`----------------------------------------`);
  console.log(`\n📋 Update your .env file:\nVITE_PIN=${hash}\n`);
  
  rl.close();
});