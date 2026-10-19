// 1. Kisii University BSc. Software Engineering 2026 Database Array
const universityUnits = [
    // === YEAR 1 - SEMESTER 1 ===
    { 
        code: "COMP 100", title: "Foundations of Computing", semester: "Y1S1", details: "Year 1 - Semester 1 Core Unit",
        paperStatus: "Available", paperLink: "https://google.com",
        notesStatus: "Coming Soon", notesLink: ""
    },
    { 
        code: "MATH 101", title: "Basic Mathematics", semester: "Y1S1", details: "Year 1 - Semester 1 Core Unit",
        paperStatus: "Coming Soon", paperLink: "",
        notesStatus: "Coming Soon", notesLink: ""
    },
    { 
        code: "SOEN 101", title: "Introduction to Software Engineering", semester: "Y1S1", details: "Year 1 - Semester 1 Core Unit",
        paperStatus: "Coming Soon", paperLink: "https://google.com",
        notesStatus: "Coming Soon", notesLink: "https://google.com"
    },
    { 
        code: "COMS 101", title: "Communication Skills", semester: "Y1S1", details: "Year 1 - Semester 1 Common Unit",
        paperStatus: "Coming Soon", paperLink: "",
        notesStatus: "Coming Soon", notesLink: ""
    },
    { 
        code: "COMP 103", title: "Computer Architecture & Organization", semester: "Y1S1", details: "Year 1 - Semester 1 Core Unit",
        paperStatus: "Coming Soon", paperLink: "",
        notesStatus: "Coming Soon", notesLink: ""
    },

    // === YEAR 1 - SEMESTER 2 ===
    { 
        code: "COMP 102", title: "Software Development Fundamentals", semester: "Y1S2", details: "Year 1 - Semester 2 Core Unit",
        paperStatus: "Coming Soon", paperLink: "", notesStatus: "Coming Soon", notesLink: ""
    },
    { 
        code: "SOEN 102", title: "Procedural Programming", semester: "Y1S2", details: "Year 1 - Semester 2 Core Unit",
        paperStatus: "Coming Soon", paperLink: "", notesStatus: "Coming Soon", notesLink: ""
    },
    { 
        code: "MATH 102", title: "Linear Algebra", semester: "Y1S2", details: "Year 1 - Semester 2 Core Unit",
        paperStatus: "Coming Soon", paperLink: "", notesStatus: "Coming Soon", notesLink: ""
    },
    { 
        code: "COMP 104", title: "Digital Electronics", semester: "Y1S2", details: "Year 2 - Semester 2 Core Unit",
        paperStatus: "Coming Soon", paperLink: "", notesStatus: "Coming Soon", notesLink: ""
    },
    { 
        code: "HURI 102", title: "Human Rights & Cyber Law", semester: "Y1S2", details: "Year 1 - Semester 2 Common Unit",
        paperStatus: "Coming Soon", paperLink: "", notesStatus: "Coming Soon", notesLink: ""
    }
];

window.activeDownloadLink = "";
window.activeDownloadAmount = 0;

// 2. Global Purchase Click Handler for Selection Synchronization
window.triggerPurchase = function(unitCode, itemType, price, status, fileLink) {
    if (status === "Coming Soon") {
        alert("Resource Offline: The " + unitCode + " " + itemType + " database is currently under configuration. Checkout prompts are disabled for unavailable units.");
        return;
    }

    const checkoutItemText = document.getElementById('checkoutItem');
    const checkoutPriceText = document.getElementById('checkoutPriceItem');
    const checkoutTotalText = document.getElementById('checkoutTotal');

    if (checkoutItemText && checkoutPriceText && checkoutTotalText) {
        checkoutItemText.innerText = "1x " + unitCode + " " + itemType;
        checkoutPriceText.innerText = "KSh " + price;
        checkoutTotalText.innerText = "KSh " + price;
        
        window.activeDownloadLink = fileLink; 
        window.activeDownloadAmount = price;
        alert("Selected: " + unitCode + " " + itemType + " (KSh " + price + "). Enter your phone details above to request access.");
    }
};

// 3. Reactive Render Pipeline with Automated Availability Status Checks
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
        container.innerHTML = '<div style="text-align:center; padding:30px; color:#64748b; font-weight:600;">No matching units found. Try checking your parameters.</div>';
        return;
    }

    targetFilteredList.forEach(unit => {
        const isPaperAvailable = unit.paperStatus === "Available";
        const paperBtnText = isPaperAvailable ? "Exam Papers (KSh 50)" : "Coming Soon";
        const paperBtnBg = isPaperAvailable ? "#10b981" : "#94a3b8";
        const paperBtnCursor = isPaperAvailable ? "pointer" : "not-allowed";

        const isNotesAvailable = unit.notesStatus === "Available";
        const notesBtnText = isNotesAvailable ? "Short Notes (KSh 100)" : "Coming Soon";
        const notesBtnBg = isNotesAvailable ? "#f59e0b" : "#94a3b8";
        const notesBtnCursor = isNotesAvailable ? "pointer" : "not-allowed";

        const unitHTML = '<div class="unit-strip" style="background: white; border-radius: 10px; padding: 20px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.02); border: 1px solid #e2e8f0; margin-bottom: 15px;">' +
            '<div class="unit-info">' +
                '<span class="unit-code" style="background-color: #eff6ff; color: #2563eb; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; display: inline-block; margin-bottom: 8px;">' + unit.code + '</span>' +
                '<h4 style="color: #0f172a; font-size: 18px; margin-bottom: 4px;">' + unit.title + '</h4>' +
                '<p style="color: #64748b; font-size: 14px;">' + unit.details + '</p>' +
            '</div>' +
            '<div class="unit-actions" style="display: flex; gap: 12px;">' +
                '<button class="action-btn" style="background-color: ' + paperBtnBg + '; color: white; padding: 10px 16px; border: none; border-radius: 6px; font-weight: 600; cursor: ' + paperBtnCursor + ';" onclick="window.triggerPurchase(\'' + unit.code + '\', \'Past Paper\', 50, \'' + unit.paperStatus + '\', \'' + unit.paperLink + '\')" ' + (isPaperAvailable ? "" : "disabled") + '>' + paperBtnText + '</button>' +
                '<button class="action-btn" style="background-color: ' + notesBtnBg + '; color: white; padding: 10px 16px; border: none; border-radius: 6px; font-weight: 600; cursor: ' + notesBtnCursor + ';" onclick="window.triggerPurchase(\'' + unit.code + '\', \'Short Notes\', 100, \'' + unit.notesStatus + '\', \'' + unit.notesLink + '\')" ' + (isNotesAvailable ? "" : "disabled") + '>' + notesBtnText + '</button>' +
            '</div>' +
        '</div>';
        container.innerHTML += unitHTML;
    });
}

// 4. Initialize Event Framework Loop
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
                alert("Security Alert: Phone number field cannot be empty!");
                return;
            }
            if (!mpesaRegex.test(phoneNumber)) {
                alert("Invalid Format: Please check your phone entries (10 digits starting with 07 or 01).");
                return;
            }
            
            if (!window.activeDownloadLink) {
                alert("Cart Empty: Please tap an available active asset card before submitting payment.");
                return;
            }

            alert("Front-end validation passed.\nSending your payment request to the backend...");

            fetch('http://127.0.0.1:5000/stkpush', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone: phoneNumber,
                    amount: window.activeDownloadAmount
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Backend returned HTTP " + response.status);
                }
                return response.json();
            })
            .then(serverPayload => {
                console.log("Backend response received:", serverPayload);
                alert("Gateway Response: " + serverPayload.message);

                if (serverPayload.status === "Success") {
                    setTimeout(() => {
                        window.open(window.activeDownloadLink, '_blank');
                    }, 1000);
                }
            })
            .catch(connectionError => {
                console.error("Backend request failed:", connectionError);
                alert("Backend connection failed. Ensure app.py is running on port 5000.");
            });
        });
    }
});