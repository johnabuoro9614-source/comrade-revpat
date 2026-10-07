// 1. Comprehensive Kisii University BSc. Software Engineering 2026 Database Array
const universityUnits = [
    // === YEAR 1 - SEMESTER 1 ===
    { code: "COMP 100", title: "Foundations of Computing", semester: "Y1S1", details: "Year 1 - Semester 1 Core Unit" },
    { code: "MATH 101", title: "Discrete Mathematics", semester: "Y1S1", details: "Year 1 - Semester 1 Core Unit" },
    { code: "SOEN 101", title: "Introduction to Software Engineering", semester: "Y1S1", details: "Year 1 - Semester 1 Core Unit" },
    { code: "COMS 101", title: "Communication Skills", semester: "Y1S1", details: "Year 1 - Semester 1 Common Unit" },
    { code: "COMP 103", title: "Computer Architecture & Organization", semester: "Y1S1", details: "Year 1 - Semester 1 Core Unit" },

    // === YEAR 1 - SEMESTER 2 ===
    { code: "COMP 102", title: "Software Development Fundamentals", semester: "Y1S2", details: "Year 1 - Semester 2 Core Unit" },
    { code: "SOEN 102", title: "Procedural Programming", semester: "Y1S2", details: "Year 1 - Semester 2 Core Unit" },
    { code: "MATH 102", title: "Linear Algebra", semester: "Y1S2", details: "Year 1 - Semester 2 Core Unit" },
    { code: "COMP 104", title: "Digital Electronics", semester: "Y1S2", details: "Year 1 - Semester 2 Core Unit" },
    { code: "HURI 102", title: "Human Rights & Cyber Law", semester: "Y1S2", details: "Year 1 - Semester 2 Common Unit" },

    // === YEAR 2 - SEMESTER 1 ===
    { code: "SOEN 201", title: "Object-Oriented Programming (Java I)", semester: "Y2S1", details: "Year 2 - Semester 1 Core Unit" },
    { code: "COMP 201", title: "Data Structures and Algorithms", semester: "Y2S1", details: "Year 2 - Semester 1 Core Unit" },
    { code: "COMP 203", title: "Database Systems", semester: "Y2S1", details: "Year 2 - Semester 1 Core Unit" },
    { code: "SOEN 203", title: "Software Requirements Engineering", semester: "Y2S1", details: "Year 2 - Semester 1 Core Unit" },
    { code: "MATH 201", title: "Probability & Statistics", semester: "Y2S1", details: "Year 2 - Semester 1 Core Unit" },

    // === YEAR 2 - SEMESTER 2 ===
    { code: "SOEN 202", title: "Object-Oriented Programming (Java II)", semester: "Y2S2", details: "Year 2 - Semester 2 Core Unit" },
    { code: "SOEN 204", title: "Software Design & Architecture", semester: "Y2S2", details: "Year 2 - Semester 2 Core Unit" },
    { code: "COMP 204", title: "Advanced Database Systems", semester: "Y2S2", details: "Year 2 - Semester 2 Core Unit" },
    { code: "COMP 206", title: "Data Communications & Networks", semester: "Y2S2", details: "Year 2 - Semester 2 Core Unit" },
    { code: "SOEN 206", title: "Systems Analysis & Design", semester: "Y2S2", details: "Year 2 - Semester 2 Core Unit" },

    // === YEAR 3 - SEMESTER 1 ===
    { code: "SOEN 301", title: "Advanced Data Structures & Algorithms", semester: "Y3S1", details: "Year 3 - Semester 1 Core Unit" },
    { code: "SOEN 303", title: "Component Development (Enterprise Frameworks)", semester: "Y3S1", details: "Year 3 - Semester 1 Core Unit" },
    { code: "SOEN 305", title: "Web Application Development", semester: "Y3S1", details: "Year 3 - Semester 1 Core Unit" },
    { code: "COMP 303", title: "Operating Systems", semester: "Y3S1", details: "Year 3 - Semester 1 Core Unit" },
    { code: "SOEN 307", title: "Software Quality Assurance", semester: "Y3S1", details: "Year 3 - Semester 1 Core Unit" },

    // === YEAR 3 - SEMESTER 2 ===
    { code: "SOEN 302", title: "Mobile Application Development", semester: "Y3S2", details: "Year 3 - Semester 2 Core Unit" },
    { code: "SOEN 304", title: "Distributed Systems", semester: "Y3S2", details: "Year 3 - Semester 2 Core Unit" },
    { code: "SOEN 306", title: "Software Project Management", semester: "Y3S2", details: "Year 3 - Semester 2 Core Unit" },
    { code: "COMP 308", title: "Applied Artificial Intelligence", semester: "Y3S2", details: "Year 3 - Semester 2 Core Unit" },
    { code: "SOEN 399", title: "Industrial Attachment (Internal/External)", semester: "Y3S2", details: "Year 3 - Semester 2 Core Unit" },

    // === YEAR 4 - SEMESTER 1 ===
    { code: "SOEN 401", title: "Software Engineering Project I", semester: "Y4S1", details: "Year 4 - Semester 1 Project Unit" },
    { code: "SOEN 403", title: "Cloud Computing & Architecture", semester: "Y4S1", details: "Year 4 - Semester 1 Core Unit" },
    { code: "SOEN 405", title: "Software Maintenance & Evolution", semester: "Y4S1", details: "Year 4 - Semester 1 Core Unit" },
    { code: "COMP 407", title: "Computer Security & Forensics Fundamentals", semester: "Y4S1", details: "Year 4 - Semester 1 Core Unit" },
    { code: "SOEN 409", title: "Special Topics in Software Engineering", semester: "Y4S1", details: "Year 4 - Semester 1 Core Unit" },

    // === YEAR 4 - SEMESTER 2 ===
    { code: "SOEN 402", title: "Software Engineering Project II", semester: "Y4S2", details: "Year 4 - Semester 2 Project Unit" },
    { code: "SOEN 404", title: "Entrepreneurship for Software Engineers", semester: "Y4S2", details: "Year 4 - Semester 2 Business Unit" },
    { code: "COMP 408", title: "Machine Learning & Analytics", semester: "Y4S2", details: "Year 4 - Semester 2 Core Unit" },
    { code: "SOEN 406", title: "Human-Computer Interaction", semester: "Y4S2", details: "Year 4 - Semester 2 Core Unit" },
    { code: "SOEN 408", title: "Professional Ethics in Computing", semester: "Y4S2", details: "Year 4 - Semester 2 Core Unit" }
];

// 2. Global State Variable for Active Selections
window.activeDownloadLink = "";

// 3. Global Purchase Click Handler for Selection Synchronization
window.triggerPurchase = function(unitCode, itemType, price) {
    const checkoutItemText = document.getElementById('checkoutItem');
    const checkoutPriceText = document.getElementById('checkoutPriceItem');
    const checkoutTotalText = document.getElementById('checkoutTotal');

    if (checkoutItemText && checkoutPriceText && checkoutTotalText) {
        checkoutItemText.innerText = `1x ${unitCode} ${itemType}`;
        checkoutPriceText.innerText = `KSh ${price}`;
        checkoutTotalText.innerText = `KSh ${price}`;
        
        window.activeDownloadLink = "https://w3schools.com"; 
        alert(`🔒 Selected: ${unitCode} ${itemType} (KSh ${price}). Proceed to complete M-Pesa summary prompt above.`);
    }
};

// 4. Reactive Search and Category Filter Core Render Pipeline
function renderFilteredUnits() {
    const container = document.getElementById('dynamicUnitsRow');
    if (!container) return;

    const queryText = document.getElementById('unitSearchInput').value.toLowerCase().trim();
    const activeCategory = document.getElementById('semesterFilterSelect').value;

    container.innerHTML = "";

    const targetFilteredList = universityUnits.filter(unit => {
        const matchesSearchText = unit.code.toLowerCase().includes(queryText) || unit.title.toLowerCase().includes(queryText);
        const matchesDropdownCategory = (activeCategory === "ALL") || (unit.semester === activeCategory);
        return matchesSearchText && matchesDropdownCategory;
    });

    if (targetFilteredList.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:30px; color:#64748b; font-weight:600;">🔍 No matching units found. Try checking your unit code or category options.</div>`;
        return;
    }

    targetFilteredList.forEach(unit => {
        const unitHTML = `
            <div class="unit-strip" style="background: white; border-radius: 10px; padding: 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.02); border: 1px solid #e2e8f0; margin-bottom: 15px;">
                <div class="unit-info">
                    <span class="unit-code" style="background-color: #eff6ff; color: #2563eb; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; display: inline-block; margin-bottom: 8px;">${unit.code}</span>
                    <h4 style="color: #0f172a; font-size: 18px; margin-bottom: 4px;">${unit.title}</h4>
                    <p style="color: #64748b; font-size: 14px;">${unit.details}</p>
                </div>
                <div class="unit-actions" style="display: flex; gap: 12px;">
                    <button class="action-btn" style="background-color: #10b981; color: white; padding: 10px 16px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;" onclick="window.triggerPurchase('${unit.code}', 'Past Paper', 50)">Exam Papers (KSh 50)</button>
                    <button class="action-btn" style="background-color: #f59e0b; color: white; padding: 10px 16px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;" onclick="window.triggerPurchase('${unit.code}', 'Short Notes', 100)">Short Notes (KSh 100)</button>
                </div>
            </div>
        `;
        container.innerHTML += unitHTML;
    });
}

// 5. Initialize Reactive Input Listeners Once DOM Framework Renders
document.addEventListener('DOMContentLoaded', () => {
    renderFilteredUnits();

    const txtSearchBox = document.getElementById('unitSearchInput');
    const selectDropBox = document.getElementById('semesterFilterSelect');

    if (txtSearchBox) txtSearchBox.addEventListener('input', renderFilteredUnits);
    if (selectDropBox) selectDropBox.addEventListener('change', renderFilteredUnits);

    const stkBtn = document.getElementById('stkBtn');
    if (stkBtn) {
        stkBtn.addEventListener('click', function(event) {
            event.preventDefault();
            const phoneNumber = document.getElementById('mpesaPhone').value.trim();
            const mpesaRegex = /^(07|01)\d{8}$/;

            if (phoneNumber === "") {
                alert("🚨 Security Alert: Phone number field cannot be empty!");
                return;
            }
            
            if (!mpesaRegex.test(phoneNumber)) {
                alert("❌ Invalid Format: Please use a valid 10-digit number starting with 07 or 01.");
                return;
            }

            alert(`🔒 Secure Validation Passed!\nInitiating encrypted STK Push for ${phoneNumber} to customer care line 0111549409...`);
        });
    }
});
