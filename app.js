// 1. The Data Array
const universityUnits = [
    {
        code: "CCS 111",
        title: "Introduction to C Programming",
        details: "First Year - Semester 1 Common Unit"
    },
    {
        code: "BIT 122",
        title: "Web Design Fundamentals",
        details: "First Year - Semester 2 Core Unit"
    },
    {
        code: "SMA 111",
        title: "Mathematics for Software Engineering",
        details: "First Year - Semester 1 Core Unit"
    },
    {
        code: "CCS 123",
        title: "Data Structures and Algorithms",
        details: "First Year - Semester 2 Advanced Unit"
    }
];

// 2. The Render Function: Injects the layout blocks automatically
function displayUnits() {
    const container = document.getElementById('dynamicUnitsRow');
    if (!container) return; // Safety check
    
    container.innerHTML = "";

    universityUnits.forEach(unit => {
        const unitHTML = `
            <div class="unit-strip" style="background: white; border-radius: 10px; padding: 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.02); border: 1px solid #e2e8f0; margin-bottom: 15px;">
                <div class="unit-info">
                    <span class="unit-code" style="background-color: #eff6ff; color: #2563eb; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; display: inline-block; margin-bottom: 8px;">${unit.code}</span>
                    <h4 style="color: #0f172a; font-size: 18px; margin-bottom: 4px;">${unit.title}</h4>
                    <p style="color: #64748b; font-size: 14px;">${unit.details}</p>
                </div>
                <div class="unit-actions" style="display: flex; gap: 12px;">
                    <button class="action-btn" style="background-color: #10b981; color: white; padding: 10px 16px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;" onclick="triggerPurchase('${unit.code}', 'Past Paper', 50)">Exam Papers (KSh 50)</button>
                    <button class="action-btn" style="background-color: #f59e0b; color: white; padding: 10px 16px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;" onclick="triggerPurchase('${unit.code}', 'Short Notes', 100)">Short Notes (KSh 100)</button>
                </div>
            </div>
        `;
        container.innerHTML += unitHTML;
    });
}

// 3. Dynamic Purchase Handler: Updates values on click
window.triggerPurchase = function(unitCode, itemType, price) {
    const checkoutItemText = document.getElementById('checkoutItem');
    const checkoutPriceText = document.getElementById('checkoutPriceItem');
    const checkoutTotalText = document.getElementById('checkoutTotal');

    if (checkoutItemText && checkoutPriceText && checkoutTotalText) {
        checkoutItemText.innerText = `1x ${unitCode} ${itemType}`;
        checkoutPriceText.innerText = `KSh ${price}`;
        checkoutTotalText.innerText = `KSh ${price}`;
    }
};

// 4. M-Pesa STK Push Form Listener
document.addEventListener('DOMContentLoaded', () => {
    displayUnits(); // Run layout immediately when elements land

    const stkBtn = document.getElementById('stkBtn');
    if (stkBtn) {
        stkBtn.addEventListener('click', function(event) {
            event.preventDefault();
            const enteredPhoneNumber = document.getElementById('mpesaPhone').value.trim();
            const phoneNumber = enteredPhoneNumber.replace(/[\s()-]/g, '');
            const internationalPhoneNumber = phoneNumber.match(/^\+?254([17]\d{8})$/);
            const normalizedPhoneNumber = internationalPhoneNumber
                ? `0${internationalPhoneNumber[1]}`
                : phoneNumber;
            const mpesaRegex = /^(07|01)\d{8}$/;

            if (enteredPhoneNumber === "") {
                alert("🚨 Security Alert: Phone number field cannot be empty!");
                return;
            }
            if (!mpesaRegex.test(normalizedPhoneNumber)) {
                alert("❌ Invalid Format: Enter a 10-digit Kenyan mobile number starting with 07 or 01 (for example, 0712345678).");
                return;
            }
            alert("🔒 Secure Validation Passed!\nInitiating encrypted STK Push for " + normalizedPhoneNumber + "...");
        });
    }
});
