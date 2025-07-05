// In admin generator:
function generateVouchers() {
    // ... existing code ...
    
    // Store vouchers
    const vouchers = JSON.parse(localStorage.getItem('vouchers') || '[]');
    for (let i = 0; i < quantity; i++) {
        vouchers.push({
            serial,
            pin,
            value,
            expiry: expiry || null,
            redeemed: false
        });
    }
    localStorage.setItem('vouchers', JSON.stringify(vouchers));
}

// In redemption page:
function redeemVoucher() {
    // ... existing validation ...
    
    const vouchers = JSON.parse(localStorage.getItem('vouchers') || '[]');
    const voucher = vouchers.find(v => 
        v.serial === serial && 
        v.pin === pin
    );
    
    if (voucher) {
        if (voucher.redeemed) {
            // Show already redeemed
        } else {
            // Mark as redeemed
            voucher.redeemed = true;
            localStorage.setItem('vouchers', JSON.stringify(vouchers));
            // Show success
        }
    } else {
        // Show invalid voucher
    }
}
// Modified generateVouchers function
function generateVouchers() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const value = parseFloat(document.getElementById('value').value);
    const expiry = document.getElementById('expiry').value;
    const resultsDiv = document.getElementById('voucherResults');
    
    resultsDiv.innerHTML = '';
    let vouchers = JSON.parse(localStorage.getItem('vouchers') || '[]');
    
    for (let i = 0; i < quantity; i++) {
        const serial = `BNK-${randomChars(4)}-${randomChars(4)}`;
        const pin = randomPin(6);
        const expiryDate = expiry || 'No expiry';
        
        // Store voucher
        vouchers.push({
            serial,
            pin,
            value,
            expiry: expiryDate,
            redeemed: false,
            generatedOn: new Date().toISOString()
        });
        
        // Display voucher
        const voucherDiv = document.createElement('div');
        voucherDiv.className = 'voucher';
        voucherDiv.innerHTML = `
            <p><strong>Voucher #${vouchers.length}</strong></p>
            <p>Serial: <strong>${serial}</strong></p>
            <p>PIN: <strong>${pin}</strong></p>
            <p>Value: ¢${value.toFixed(2)}</p>
            <p>Expires: ${expiryDate}</p>
            <button onclick="copyToClipboard('${serial}', '${pin}')">Copy Details</button>
        `;
        resultsDiv.appendChild(voucherDiv);
    }
    
    localStorage.setItem('vouchers', JSON.stringify(vouchers));
    alert(`${quantity} vouchers generated and stored!`);
}

// Copy helper function
function copyToClipboard(serial, pin) {
    navigator.clipboard.writeText(`Serial: ${serial}\nPIN: ${pin}`);
    alert('Voucher details copied to clipboard!');
}
function redeemVoucher() {
    const serial = document.getElementById('serial').value.trim().toUpperCase();
    const pin = document.getElementById('voucherPin').value.trim();
    const resultDiv = document.getElementById('redeemResult');

    // Clear previous messages
    document.getElementById('serialError').textContent = '';
    document.getElementById('pinError').textContent = '';
    resultDiv.textContent = '';

    // Validation
    if (!/^BNK-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(serial)) {
        document.getElementById('serialError').textContent = 'Invalid serial format (BNK-XXXX-XXXX)';
        return;
    }

    if (!/^\d{6}$/.test(pin)) {
        document.getElementById('pinError').textContent = 'PIN must be 6 digits';
        return;
    }

    // Check against stored vouchers
    const vouchers = JSON.parse(localStorage.getItem('vouchers') || [];
    const voucherIndex = vouchers.findIndex(v => 
        v.serial === serial && 
        v.pin === pin
    );

    if (voucherIndex === -1) {
        resultDiv.textContent = 'Invalid voucher or PIN';
        resultDiv.style.color = 'red';
        return;
    }

    const voucher = vouchers[voucherIndex];

    // Check expiry
    if (voucher.expiry !== 'No expiry' && new Date(voucher.expiry) < new Date()) {
        resultDiv.innerHTML = 'Voucher has expired';
        resultDiv.style.color = 'red';
        return;
    }

    // Check if already redeemed
    if (voucher.redeemed) {
        resultDiv.innerHTML = 'Voucher already redeemed';
        resultDiv.style.color = 'red';
        return;
    }

    // Redeem voucher
    vouchers[voucherIndex].redeemed = true;
    vouchers[voucherIndex].redeemedOn = new Date().toISOString();
    localStorage.setItem('vouchers', JSON.stringify(vouchers));

    // Success message
    resultDiv.innerHTML = `
        <p>✓ Voucher redeemed successfully!</p>
        <p>Amount: ¢${voucher.value.toFixed(2)}</p>
        <p>Reference: ${serial.substring(0, 8)}...</p>
    `;
    resultDiv.style.color = 'green';
    
    // Clear form
    document.getElementById('serial').value = '';
    document.getElementById('voucherPin').value = '';
}
function generateQRCode(serial, pin) {
    const qr = qrcode(0, 'L');
    qr.addData(`Voucher: ${serial}\nPIN: ${pin}`);
    qr.make();
    
    const qrContainer = document.createElement('div');
    qrContainer.style.textAlign = 'center';
    qrContainer.style.margin = '20px 0';
    qrContainer.innerHTML = qr.createImgTag(4);
    
    const resultDiv = document.getElementById('redeemResult');
    resultDiv.insertBefore(qrContainer, resultDiv.firstChild);
    
    // Add download button
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Download QR Code';
    downloadBtn.onclick = () => {
        const link = document.createElement('a');
        link.download = `${serial}-voucher.png`;
        link.href = qr.createDataURL();
        link.click();
    };
    qrContainer.appendChild(downloadBtn);
}
function generateSerial(prefix = "BNK") {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded easily confused chars
    let serial = prefix + '-';
    
    // Generate two segments of 4 characters each
    for (let segment = 0; segment < 2; segment++) {
        for (let i = 0; i < 4; i++) {
            serial += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        if (segment === 0) serial += '-';
    }
    
    return serial;
}
function generateSerial(prefix = "BNK") {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded easily confused chars
    let serial = prefix + '-';
    
    // Generate two segments of 4 characters each
    for (let segment = 0; segment < 2; segment++) {
        for (let i = 0; i < 4; i++) {
            serial += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        if (segment === 0) serial += '-';
    }
    
    return serial;
}
function generateSerial(prefix = "BNK") {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded easily confused chars
    let serial = prefix + '-';
    
    // Generate two segments of 4 characters each
    for (let segment = 0; segment < 2; segment++) {
        for (let i = 0; i < 4; i++) {
            serial += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        if (segment === 0) serial += '-';
    }
    
    return serial;
}
// Example output: "BNK-A3F7-9K2D"
function generateSerialWithChecksum() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const digits = '23456789';
    let part1 = '';
    let part2 = '';
    
    // Generate two letter parts
    for (let i = 0; i < 2; i++) {
        part1 += chars.charAt(Math.floor(Math.random() * chars.length));
        part2 += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Generate two number parts
    part1 += digits.charAt(Math.floor(Math.random() * digits.length));
    part2 += digits.charAt(Math.floor(Math.random() * digits.length));
    
    // Simple checksum calculation
    const checksum = (part1.charCodeAt(0) + part2.charCodeAt(1)) % 10;
    
    return `BNK-${part1}-${part2}${checksum}`;
}
// Example output: "BNK-XE7D-PK38" (last digit is checksum)
function generatePIN(length = 6) {
    const digits = '23456789'; // Excluded 0 and 1 for clarity
    let pin = '';
    
    for (let i = 0; i < length; i++) {
        pin += digits.charAt(Math.floor(Math.random() * digits.length));
    }
    
    return pin;
}
// Example output: "582739" (6 digits)
function generateLuhnPIN(length = 6) {
    // Generate base PIN (length-1 digits)
    let base = '';
    for (let i = 0; i < length - 1; i++) {
        base += Math.floor(Math.random() * 10);
    }
    
    // Calculate Luhn checksum
    let sum = 0;
    for (let i = 0; i < base.length; i++) {
        let digit = parseInt(base.charAt(i));
        if (i % 2 === 0) digit *= 2;
        if (digit > 9) digit -= 9;
        sum += digit;
    }
    
    const checksum = (10 - (sum % 10)) % 10;
    return base + checksum;
}
// Example output: "456327" (last digit is checksum)
function generateLuhnPIN(length = 6) {
    // Generate base PIN (length-1 digits)
    let base = '';
    for (let i = 0; i < length - 1; i++) {
        base += Math.floor(Math.random() * 10);
    }
    
    // Calculate Luhn checksum
    let sum = 0;
    for (let i = 0; i < base.length; i++) {
        let digit = parseInt(base.charAt(i));
        if (i % 2 === 0) digit *= 2;
        if (digit > 9) digit -= 9;
        sum += digit;
    }
    
    const checksum = (10 - (sum % 10)) % 10;
    return base + checksum;
}
// Example output: "456327" (last digit is checksum)
class VoucherGenerator {
    constructor() {
        this.usedSerials = new Set();
    }
    
    generateSerial() {
        let serial;
        do {
            serial = this._generateSerialAttempt();
        } while (this.usedSerials.has(serial));
        
        this.usedSerials.add(serial);
        return serial;
    }
    
    _generateSerialAttempt() {
        const segments = [
            this._randomSegment(2, 'alpha'),
            this._randomSegment(2, 'alphanum'),
            this._randomSegment(2, 'numeric')
        ];
        return `BNK-${segments.join('-')}`;
    }
    
    _randomSegment(length, type) {
        const alpha = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        const numeric = '23456789';
        const alphanum = alpha + numeric;
        
        let chars, result = '';
        switch(type) {
            case 'alpha': chars = alpha; break;
            case 'numeric': chars = numeric; break;
            default: chars = alphanum;
        }
        
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    
    generatePIN(length = 6) {
        const pin = this._generatePIN(length);
        return {
            pin,
            obscured: pin.substring(0, 2) + '****' + pin.slice(-2)
        };
    }
    
    _generatePIN(length) {
        // Avoid sequential or repeated numbers
        let pin;
        do {
            pin = '';
            for (let i = 0; i < length; i++) {
                pin += Math.floor(Math.random() * 10);
            }
        } while (!this._isSecurePIN(pin));
        
        return pin;
    }
    
    _isSecurePIN(pin) {
        // Reject simple patterns
        if (/^(\d)\1+$/.test(pin)) return false; // All same digit
        if ('01234567890123456789'.includes(pin)) return false; // Sequential
        if ('98765432109876543210'.includes(pin)) return false; // Reverse sequential
        return true;
    }
}

// Usage Example:
const generator = new VoucherGenerator();
const voucher = {
    serial: generator.generateSerial(),
    pin: generator.generatePIN()
};
console.log(voucher);
/* Example output:
{
  serial: "BNK-XT-7B-34",
  pin: {
    pin: "582739",
    obscured: "58****39"
  }
}
*/
class DatabaseVoucherGenerator extends VoucherGenerator {
    constructor(database) {
        super();
        this.db = database;
    }
    
    async generateUniqueSerial() {
        let serial, attempts = 0;
        do {
            if (attempts++ > 100) throw new Error("Failed to generate unique serial");
            serial = this.generateSerial();
        } while (await this.db.voucherExists(serial));
        
        return serial;
    }
    
    async generateVoucher(value, expiry) {
        return {
            serial: await this.generateUniqueSerial(),
            pin: this.generatePIN(),
            value,
            expiry: expiry || null,
            generatedAt: new Date()
        };
    }
}

// Mock database implementation example
const mockDB = {
    voucherExists: async (serial) => {
        // In real implementation, query your database
        return false;
    }
};

// Usage:
const dbGenerator = new DatabaseVoucherGenerator(mockDB);
dbGenerator.generateVoucher(50, '2023-12-31')
    .then(voucher => console.log(voucher));class DatabaseVoucherGenerator extends VoucherGenerator {
    constructor(database) {
        super();
        this.db = database;
    }
    
    async generateUniqueSerial() {
        let serial, attempts = 0;
        do {
            if (attempts++ > 100) throw new Error("Failed to generate unique serial");
            serial = this.generateSerial();
        } while (await this.db.voucherExists(serial));
        
        return serial;
    }
    
    async generateVoucher(value, expiry) {
        return {
            serial: await this.generateUniqueSerial(),
            pin: this.generatePIN(),
            value,
            expiry: expiry || null,
            generatedAt: new Date()
        };
    }
}

// Mock database implementation example
const mockDB = {
    voucherExists: async (serial) => {
        // In real implementation, query your database
        return false;
    }
};

// Usage:
const dbGenerator = new DatabaseVoucherGenerator(mockDB);
dbGenerator.generateVoucher(50, '2023-12-31')
    .then(voucher => console.log(voucher));
    // Serial validation regex
const serialRegex = /^BNK-[A-Z0-9]{2,4}-[A-Z0-9]{2,4}-[A-Z0-9]{2,4}$/;

// PIN validation regex
const pinRegex = /^\d{4,8}$/;
