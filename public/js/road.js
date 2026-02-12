// ===============================
// ROADTRACE – PUBLIC ROAD LOGIC
// File: road.js
// ===============================

import { db } from "./firebase.js";
import { 
  collection, 
  query, 
  where, 
  getDocs 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ===============================
// STATIC ROAD DATA (PUBLIC)
// ===============================
const roadsData = [
  {
    id: "JM_ROAD_PUNE",
    roadName: "Jangli Maharaj Road (JM Road)",
    area: "ShivajiNagar (Ghole Road Ward Office)",
    city: "Pune",
    authority: "Pune Municipal Corporation (PMC)",
    constructionYear: "1976",
    contractor: "Recondo Developers",
    budget: "₹15 Lakhs",
    lastMaintenance: "2014–15 (Major Improvement)"
  },
  {
    id: "KARVE_ROAD_PUNE",
    roadName: "Karve Road Pune",
    area: "Karve Road, Deccan / Opp Sahayadri Hospital, Deccan Corner",
    city: "Pune",
    authority: "Pune Municipal Corporation (PMC)",
    constructionYear: "~1970 (Exact data NA)",
    contractor: "NA",
    budget: "NA",
    lastMaintenance: "January 2026"
  },
  {
    id: "SENAPATI_BAPAT_ROAD",
    roadName: "Senapati Bapat Road",
    area: "ShivajiNagar (Part of PMC Ward No. 7)",
    city: "Pune",
    authority: "Pune Municipal Corporation (PMC)",
    constructionYear: "1977",
    contractor: "Not clearly mentioned",
    budget: "NA",
    lastMaintenance: "NA"
  },
  {
    id: "NETAJI_SUBHASH_ROAD",
    roadName: "Netaji Subhash Chandra Bose Road",
    area: "Marine Drive / D & C Ward",
    city: "Mumbai",
    authority: "Brihanmumbai Municipal Corporation (BMC)",
    constructionYear: "Between 1915–1930",
    contractor: "Pallonji Mistry",
    budget: "NA",
    lastMaintenance: "March 2024"
  }
];

// ===============================
// GET ROAD ID FROM URL
// ===============================
function getRoadIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("road");
}

// ===============================
// CALCULATE ROAD HEALTH INDEX
// ===============================
async function calculateRHI(roadId) {
  try {
    console.log("🔍 Fetching reports for road:", roadId);

    const reportsRef = collection(db, "reports");
    const reportsQuery = query(reportsRef, where("roadId", "==", roadId));
    const querySnapshot = await getDocs(reportsQuery);

    if (querySnapshot.empty) {
      console.log("📭 No reports found for this road");
      return {
        status: "Excellent (100/100)",
        score: 100,
        color: "#28a745"
      };
    }

    let totalReports = 0;
    let totalSeverity = 0;
    let criticalIssues = 0;

    querySnapshot.forEach((doc) => {
      const report = doc.data();
      totalReports++;
      totalSeverity += report.severity || 0;
      
      if (report.severity >= 4) {
        criticalIssues++;
      }
    });

    console.log("📊 Reports analyzed:", {
      totalReports,
      totalSeverity,
      criticalIssues
    });

    // Simple RHI calculation formula
    const avgSeverity = totalSeverity / totalReports;
    let rhi = 100 - (avgSeverity * 10) - (criticalIssues * 5);
    rhi = Math.max(0, Math.min(100, rhi));

    // Determine status
    let status, color;
    if (rhi >= 80) {
      status = "Excellent";
      color = "#28a745";
    } else if (rhi >= 60) {
      status = "Good";
      color = "#17a2b8";
    } else if (rhi >= 40) {
      status = "Fair";
      color = "#ffc107";
    } else if (rhi >= 20) {
      status = "Poor";
      color = "#fd7e14";
    } else {
      status = "Critical";
      color = "#dc3545";
    }

    return {
      status: `${status} (${Math.round(rhi)}/100)`,
      score: Math.round(rhi),
      color: color,
      totalReports: totalReports
    };

  } catch (error) {
    console.error("❌ Error calculating RHI:", error);
    return {
      status: "Error loading data",
      score: 0,
      color: "#6c757d"
    };
  }
}

// ===============================
// LOAD ROAD DATA
// ===============================
async function loadRoadData() {
  const roadId = getRoadIdFromURL();

  if (!roadId) {
    alert("No road selected.");
    return;
  }

  const road = roadsData.find(r => r.id === roadId);

  if (!road) {
    alert("Invalid road data.");
    return;
  }

  // Load basic road info
  document.getElementById("roadName").innerText = road.roadName;
  document.getElementById("area").innerText = road.area;
  document.getElementById("city").innerText = road.city;
  document.getElementById("authority").innerText = road.authority;
  document.getElementById("constructionYear").innerText = road.constructionYear;
  document.getElementById("contractor").innerText = road.contractor;
  document.getElementById("budget").innerText = road.budget;
  document.getElementById("lastMaintenance").innerText = road.lastMaintenance;

  // Update report button to include current roadId
  const reportBtn = document.querySelector('.report-btn');
  if (reportBtn) {
    reportBtn.href = `report.html?road=${roadId}`;
  }

  // Calculate and display RHI
  const healthStatusEl = document.getElementById("healthStatus");
  healthStatusEl.innerText = "Calculating...";

  const rhi = await calculateRHI(roadId);
  
  healthStatusEl.innerText = rhi.status;
  healthStatusEl.style.color = rhi.color;
  
  console.log("✅ RHI calculated:", rhi);
}

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", loadRoadData);

console.log("🚀 road.js loaded successfully");