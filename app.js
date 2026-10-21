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
window.pendingCheckout = null;

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
        stkBtn.addEventListener('click', async function(event) {
            event.preventDefault();
            const phoneInput = document.getElementById('mpesaPhone');
            const feedbackContainer = document.getElementById('paymentStatusFeedback');
            const phoneNumber = phoneInput.value.trim();
            const mpesaRegex = /^(07|01)\d{8}$/;

            function showFeedback(text, isError) {
                feedbackContainer.textContent = text;
                feedbackContainer.style.display = "block";
                feedbackContainer.style.backgroundColor = isError ? "#fee2e2" : "#dcfce7";
                feedbackContainer.style.color = isError ? "#991b1b" : "#166534";
            }

            if (phoneNumber === "") {
                showFeedback("⚠️ Security Alert: Phone number field cannot be empty!", true);
                return;
            }
            if (!mpesaRegex.test(phoneNumber)) {
                showFeedback("❌ Invalid Format: Use a 10-digit number starting with 07 or 01.", true);
                return;
            }
            
            const downloadLink = window.activeDownloadLink;
            const amount = window.activeDownloadAmount;
            if (!downloadLink || ![50, 100].includes(amount)) {
                showFeedback("⚠️ Cart Empty: Select an available unit resource card first.", true);
                return;
            }

            const downloadWindow = window.open('about:blank', '_blank');
            stkBtn.disabled = true;
            showFeedback("🔒 Requesting secure transaction authorization from Safaricom...", false);

            try {
                let checkoutId;
                let selectedDownloadLink = downloadLink;
                if (window.pendingCheckout) {
                    checkoutId = window.pendingCheckout.checkoutId;
                    selectedDownloadLink = window.pendingCheckout.downloadLink;
                    showFeedback("⏳ Checking the existing payment request...", false);
                } else {
                    const response = await fetch('https://comrade-revpat-backend.onrender.com/stkpush', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ phone: phoneNumber, amount: amount })
                    });
                    const serverPayload = await response.json();
                    if (!response.ok || serverPayload.status !== "Success" || !serverPayload.checkout_id) {
                        throw new Error(serverPayload.message || "The payment request was rejected.");
                    }
                    checkoutId = serverPayload.checkout_id;
                    window.pendingCheckout = { checkoutId: checkoutId, downloadLink: downloadLink };
                    showFeedback("📱 STK Push sent. Enter your M-Pesa PIN; checking for payment confirmation...", false);
                }

                let paymentStatus = "pending";
                for (let attempt = 0; attempt < 30 && paymentStatus === "pending"; attempt += 1) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    const statusResponse = await fetch(
                        'https://comrade-revpat-backend.onrender.com/check-payment/' +
                        encodeURIComponent(checkoutId)
                    );
                    const statusPayload = await statusResponse.json();
                    if (!statusResponse.ok) {
                        throw new Error(statusPayload.message || "Could not check payment status.");
                    }
                    paymentStatus = statusPayload.status;
                }

                if (paymentStatus === "paid") {
                    window.pendingCheckout = null;
                    showFeedback("✅ Payment confirmed. Opening your selected resource...", false);
                    if (downloadWindow) {
                        downloadWindow.location = selectedDownloadLink;
                    } else {
                        window.location.assign(selectedDownloadLink);
                    }
                } else if (paymentStatus === "failed") {
                    window.pendingCheckout = null;
                    if (downloadWindow) downloadWindow.close();
                    showFeedback("❌ Payment was not completed. No download was opened.", true);
                } else {
                    if (downloadWindow) downloadWindow.close();
                    showFeedback("⏳ Payment is still pending. Wait for the M-Pesa result, then click again to check without creating another charge.", true);
                }
            } catch (error) {
                if (downloadWindow) downloadWindow.close();
                showFeedback("❌ Checkout error: " + error.message, true);
            } finally {
                stkBtn.disabled = false;
            }
        });
    }
});