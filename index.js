const bcrypt = require("bcrypt");

const password = "123456"; // รหัสผ่านตัวอย่าง

async function hashPassword() {
    console.log("Before Hashing:", password);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log("After Hashing:", hashedPassword); // ✅ ได้ค่า Hash จริง

    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log("Is Match:", isMatch); // ✅ ตรวจสอบรหัสผ่านว่าตรงกันหรือไม่
}

hashPassword();
