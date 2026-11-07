import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  validateTunisianPhone, 
  generateOrderReference, 
  formatTndPrice, 
  buildWhatsAppOrderLink 
} from './order';

test('validateTunisianPhone - accepts valid 8-digit Tunisian phone numbers', () => {
  const result1 = validateTunisianPhone('58123456');
  assert.equal(result1.isValid, true);
  assert.equal(result1.normalized, '+21658123456');

  const result2 = validateTunisianPhone('+216 22 456 789');
  assert.equal(result2.isValid, true);
  assert.equal(result2.normalized, '+21622456789');

  const result3 = validateTunisianPhone('0021698765432');
  assert.equal(result3.isValid, true);
  assert.equal(result3.normalized, '+21698765432');
});

test('validateTunisianPhone - rejects invalid phone numbers', () => {
  const shortResult = validateTunisianPhone('12345');
  assert.equal(shortResult.isValid, false);

  const lettersResult = validateTunisianPhone('abcdefgh');
  assert.equal(lettersResult.isValid, false);

  const emptyResult = validateTunisianPhone('');
  assert.equal(emptyResult.isValid, false);
});

test('generateOrderReference - produces distinct formatted reference codes', () => {
  const ref1 = generateOrderReference();
  const ref2 = generateOrderReference();

  assert.match(ref1, /^MSS-TN-\d{4}-[2-9A-Z]{5}$/);
  assert.match(ref2, /^MSS-TN-\d{4}-[2-9A-Z]{5}$/);
  assert.notEqual(ref1, ref2);
});

test('formatTndPrice - formats price correctly in Arabic and French', () => {
  assert.equal(formatTndPrice(45, 'ar'), '45 د.ت');
  assert.equal(formatTndPrice(45, 'fr'), '45 DT');
  assert.equal(formatTndPrice(null, 'ar'), 'اتصل بنا لمعرفة السعر');
  assert.equal(formatTndPrice(undefined, 'fr'), 'Contactez-nous pour le tarif');
  assert.equal(formatTndPrice(0, 'ar'), 'اتصل بنا لمعرفة السعر');
});

test('buildWhatsAppOrderLink - formats encoded WhatsApp URL with reference', () => {
  const url = buildWhatsAppOrderLink({
    whatsappNumber: '+216 58 123 456',
    orderRef: 'MSS-TN-2611-TEST1',
    customerName: 'Karim',
    productName: 'ChatGPT Plus',
    planName: '1 Month',
    priceTnd: 75,
    lang: 'ar'
  });

  assert.ok(url.startsWith('https://wa.me/21658123456?text='));
  assert.ok(url.includes('MSS-TN-2611-TEST1'));
  assert.ok(decodeURIComponent(url).includes('ChatGPT Plus'));
  assert.ok(decodeURIComponent(url).includes('Karim'));
  assert.ok(decodeURIComponent(url).includes('75 د.ت'));
});
