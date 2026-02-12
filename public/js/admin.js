/*************************************************
 * ROADTRACE – ADMIN DASHBOARD LOGIC
 * File: admin.js
 *************************************************/

import { db } from "./firebase.js";
import { 
  collection, 
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ===============================
// STATIC ROAD DATA (same as road.js)
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
// FETCH ALL REPORTS FROM FIRESTORE
// ===============================
async function fetchReports() {
  try {
    const reportsRef = collection(db, "reports");
    const q = query(reportsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    const reports = [];
    querySnapshot.forEach((doc) => {
      reports.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log("📊 Fetched reports:", reports.length);
    return reports;

  } catch (error) {
    console.error("❌ Error fetching reports:", error);
    return [];
  }
}

// ===============================
// CALCULATE STATISTICS
// ===============================
function calculateStats(reports) {
  const totalReports = reports.length;
  const criticalIssues = reports.filter(r => r.severity >= 4).length;
  
  let totalSeverity = 0;
  reports.forEach(r => {
    totalSeverity += r.severity || 0;
  });
  
  const avgSeverity = totalReports > 0 ? totalSeverity / totalReports : 0;
  const avgRHI = Math.round(100 - (avgSeverity * 10));

  return {
    totalRoads: roadsData.length,
    totalReports,
    criticalIssues,
    avgRHI
  };
}

// ===============================
// DISPLAY OVERVIEW STATS
// ===============================
function displayOverview(stats) {
  document.getElementById("totalRoads").textContent = stats.totalRoads;
  document.getElementById("totalReports").textContent = stats.totalReports;
  document.getElementById("criticalIssues").textContent = stats.criticalIssues;
  document.getElementById("avgRHI").textContent = stats.avgRHI + "%";
}

// ===============================
// DISPLAY ROADS TABLE
// ===============================
function displayRoadsTable() {
  const tbody = document.getElementById("roadsTable");
  tbody.innerHTML = "";

  roadsData.forEach(road => {
    const row = `
      <tr>
        <td>${road.id}</td>
        <td>${road.roadName}</td>
        <td>${road.city}</td>
        <td>${road.authority}</td>
        <td>${road.lastMaintenance}</td>
        <td>
          <a href="index.html?road=${road.id}" class="btn btn-sm btn-primary">View Details</a>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// ===============================
// DISPLAY COMPLAINTS
// ===============================
function displayComplaints(reports) {
  const container = document.getElementById("complaintsContainer");
  
  if (reports.length === 0) {
    container.innerHTML = `
      <div class="alert alert-info">
        No complaints reported yet.
      </div>
    `;
    return;
  }

  let html = "";

  // Show latest 10 reports
  const recentReports = reports.slice(0, 10);

  recentReports.forEach(report => {
    const date = report.createdAt?.toDate 
      ? report.createdAt.toDate().toLocaleString() 
      : "Unknown date";

    const severityColor = report.severity >= 4 ? "danger" : 
                         report.severity >= 3 ? "warning" : "info";

    const roadInfo = roadsData.find(r => r.id === report.roadId);
    const roadName = roadInfo ? roadInfo.roadName : report.roadId || "Unknown Road";

    html += `
      <div class="card mb-3">
        <div class="card-body">
          <div class="row">
            <div class="col-md-8">
              <h5 class="card-title">
                <span class="badge bg-${severityColor}">Severity: ${report.severity}/5</span>
                ${report.issueType}
              </h5>
              <p class="mb-1"><strong>Road:</strong> ${roadName}</p>
              <p class="mb-1"><strong>Duration:</strong> ${report.duration}</p>
              <p class="mb-1"><strong>Traffic Impact:</strong> ${report.trafficImpact?.join(", ") || "None"}</p>
              <p class="mb-0"><strong>Safety Risk:</strong> ${report.safetyRisk?.join(", ") || "None"}</p>
            </div>
            <div class="col-md-4 text-end">
              <small class="text-muted">${date}</small>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// ===============================
// INITIALIZE DASHBOARD
// ===============================
async function initDashboard() {
  console.log("🚀 Loading admin dashboard...");

  // Fetch reports
  const reports = await fetchReports();

  // Calculate stats
  const stats = calculateStats(reports);

  // Display everything
  displayOverview(stats);
  displayRoadsTable();
  displayComplaints(reports);

  console.log("✅ Dashboard loaded successfully");
}

// ===============================
// LOAD ON PAGE READY
// ===============================
document.addEventListener("DOMContentLoaded", initDashboard);

console.log("🚀 admin.js loaded successfully");