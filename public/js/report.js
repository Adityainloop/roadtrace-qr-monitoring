/*************************************************
 * ROADTRACE – REPORT FORM LOGIC
 * File: report.js
 *************************************************/

import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  Timestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/* ===============================
   DOM ELEMENT
================================ */

const reportForm = document.getElementById("reportForm");

if (!reportForm) {
  console.error("❌ reportForm not found");
  throw new Error("Form element missing");
}

/* ===============================
   FORM SUBMIT HANDLER
================================ */

reportForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  console.log("📝 Form submitted");

  try {
    /* ===============================
       GET ROAD ID FROM URL
    ================================ */
    const urlParams = new URLSearchParams(window.location.search);
    const roadId = urlParams.get("road") || "UNKNOWN";

    console.log("🛣️ Road ID:", roadId);

    /* ===============================
       COLLECT VALUES
    ================================ */

    const issueType = document.getElementById("issueType").value;
    const severity = document.getElementById("severity").value;

    const trafficImpact = Array.from(
      document.querySelectorAll('input[name="trafficImpact"]:checked')
    ).map(cb => cb.value);

    const safetyRisk = Array.from(
      document.querySelectorAll('input[name="safetyRisk"]:checked')
    ).map(cb => cb.value);

    const durationEl = document.querySelector('input[name="duration"]:checked');
    const duration = durationEl ? durationEl.value : "";

    /* ===============================
       VALIDATION
    ================================ */

    if (!issueType || !duration) {
      alert("⚠️ Please fill all required fields");
      return;
    }

    /* ===============================
       SAVE TO FIRESTORE
    ================================ */

    console.log("📤 Sending to Firestore:", {
      roadId,
      issueType,
      severity: Number(severity),
      trafficImpact,
      safetyRisk,
      duration
    });

    const docRef = await addDoc(collection(db, "reports"), {
      roadId,
      issueType,
      severity: Number(severity),
      trafficImpact,
      safetyRisk,
      duration,
      createdAt: Timestamp.now()
    });

    console.log("✅ Document written with ID:", docRef.id);
    alert("✅ Report submitted successfully!");
    reportForm.reset();

  } catch (error) {
    console.error("❌ Firestore Error:", error);
    alert(`❌ Error: ${error.message}`);
  }
});

console.log("🚀 report.js loaded successfully");