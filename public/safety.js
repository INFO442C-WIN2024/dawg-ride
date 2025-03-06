let safetyReports = [
  {
      id: 1,
      position: [47.6560, -122.3130],
      type: 'lighting',
      description: 'Very dark area at night, needs better lighting',
      timestamp: new Date(2025, 2, 1, 22, 15)
  },
  {
      id: 2,
      position: [47.6575, -122.3080],
      type: 'suspicious',
      description: 'Suspicious individual hanging around this area at night',
      timestamp: new Date(2025, 2, 2, 23, 30)
  },
  {
      id: 3,
      position: [47.6530, -122.3050],
      type: 'harassment',
      description: 'Verbal harassment reported by multiple students',
      timestamp: new Date(2025, 2, 2, 21, 45)
  }
];

function getReportIcon(type) {
  let iconClass;
  let color;
  
  switch(type) {
      case 'lighting':
          iconClass = 'fa-lightbulb';
          color = '#FFC107'; // Amber
          break;
      case 'suspicious':
          iconClass = 'fa-eye';
          color = '#2196F3'; // Blue
          break;
      case 'harassment':
          iconClass = 'fa-exclamation-circle';
          color = '#F44336'; // Red
          break;
      default:
          iconClass = 'fa-triangle-exclamation';
          color = '#9C27B0'; // Purple
  }
  
  return L.divIcon({
      className: 'report-icon',
      html: `<div style="background-color: ${color}; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid white;"><i class="fa ${iconClass}" style="color: white;"></i></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
  });
}

function formatDate(date) {
  const options = { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: true 
  };
  return date.toLocaleString('en-US', options);
}

function initSafetyMap() {
  if (!map || typeof map.remove === 'function') {
      initMap();
  }
  
  map.eachLayer(function(layer) {
      if (layer instanceof L.Marker) {
          map.removeLayer(layer);
      }
  });
  
  safetyReports.forEach(report => {
      const marker = L.marker(report.position, {
          icon: getReportIcon(report.type)
      }).addTo(map);
      
      const popupContent = `
          <div class="report-popup">
              <h3>${report.type.charAt(0).toUpperCase() + report.type.slice(1)} Issue</h3>
              <p>${report.description}</p>
              <p class="report-time">Reported: ${formatDate(report.timestamp)}</p>
          </div>
      `;
      
      marker.bindPopup(popupContent);
  });
  
  // Center map on UW Campus
  map.setView([47.655, -122.308], 15);

  createLegend();
}

function createLegend() {
    const legend = document.createElement("div");
    legend.innerHTML = `
        <div class="safety-reportkey">
        <h3 style="margin: 0; color: #000000; padding-bottom: 5px; font-size: 16px;">Safety Report Key</h3>
        </div>
        <div class="legend-item">
            <i class="fa fa-lightbulb" style="color: #FFC107; margin-right: 8px;"></i> 
            <span style="color: #000000; font-family: 'Sanchez', sans-serif;">Lighting Issue</span>
        </div>
        <div class="legend-item">
            <i class="fa fa-eye" style="color: #2196F3; margin-right: 8px;"></i> 
            <span style="color: #000000; font-family: 'Sanchez', sans-serif;">Suspicious Activity</span>
        </div>
        <div class="legend-item">
            <i class="fa fa-exclamation-circle" style="color: #F44336; margin-right: 8px;"></i> 
            <span style="color: #000000; font-family: 'Sanchez', sans-serif;">Harassment Concern</span>
        </div>
    `;
    legend.style.position = "absolute";
    legend.style.top = "20px";
    legend.style.left = "20px";
    legend.style.background = "rgba(255, 255, 255, 0.9)";
    legend.style.padding = "15px 15px";
    legend.style.borderRadius = "8px";
    legend.style.boxShadow = "0px 2px 5px rgba(0, 0, 0, 0.2)";
    legend.style.fontSize = "14px";
    legend.style.zIndex = "1000"; 
    legend.style.maxWidth = "170px";

    const legendItems = legend.querySelectorAll(".legend-item");
    legendItems.forEach(item => {
        item.style.display = "inline-flex"; // Display items inline-flex
        item.style.alignItems = "center";  // Vertically center the icons and text
    });

    document.getElementById("map").appendChild(legend);
}

function openReportForm() {
  document.getElementById('reportModal').style.display = 'flex';
}

function closeReportForm() {
  document.getElementById('reportModal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('safety.html')) {
      initSafetyMap();
      
      const reportForm = document.getElementById('reportForm');
      if (reportForm) {
          reportForm.addEventListener('submit', function(e) {
              e.preventDefault();
              
              const issueType = document.getElementById('issueType').value;
              const description = document.getElementById('description').value;
              
              const newReport = {
                  id: safetyReports.length + 1,
                  position: [47.655 + (Math.random() - 0.5) * 0.01, -122.308 + (Math.random() - 0.5) * 0.01], // Random position near UW
                  type: issueType,
                  description: description || `Reported ${issueType} issue`,
                  timestamp: new Date()
              };
              
              safetyReports.push(newReport);
              
              const marker = L.marker(newReport.position, {
                  icon: getReportIcon(newReport.type)
              }).addTo(map);
              
              const popupContent = `
                  <div class="report-popup">
                      <h3>${newReport.type.charAt(0).toUpperCase() + newReport.type.slice(1)} Issue</h3>
                      <p>${newReport.description}</p>
                      <p class="report-time">Reported: ${formatDate(newReport.timestamp)}</p>
                  </div>
              `;
              
              marker.bindPopup(popupContent);
              
              closeReportForm();
              
              map.setView(newReport.position, 16);
              marker.openPopup();
          });
      }
  }
});

// Initialize when loaded
if (window.location.pathname.includes('safety.html')) {
  window.addEventListener('load', initSafetyMap);
}