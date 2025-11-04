// Application Data
const appData = {
  participants: [
    {"id": 1, "name": "Maria Santos", "age": 52, "bmi": 28.5, "menopauseStatus": "Post-menopause", "yearsSinceMenopause": 3, "bloodPressure": "140/90", "glucose": 105, "physicalActivity": "Moderate", "smokingStatus": "Never", "riskScore": 0.72},
    {"id": 2, "name": "Ana Rodriguez", "age": 48, "bmi": 24.2, "menopauseStatus": "Peri-menopause", "yearsSinceMenopause": 0, "bloodPressure": "125/80", "glucose": 92, "physicalActivity": "High", "smokingStatus": "Former", "riskScore": 0.34},
    {"id": 3, "name": "Carmen Lopez", "age": 58, "bmi": 31.8, "menopauseStatus": "Post-menopause", "yearsSinceMenopause": 8, "bloodPressure": "155/95", "glucose": 118, "physicalActivity": "Low", "smokingStatus": "Current", "riskScore": 0.89},
    {"id": 4, "name": "Rosa Garcia", "age": 45, "bmi": 26.1, "menopauseStatus": "Pre-menopause", "yearsSinceMenopause": 0, "bloodPressure": "118/75", "glucose": 88, "physicalActivity": "Moderate", "smokingStatus": "Never", "riskScore": 0.28},
    {"id": 5, "name": "Elena Morales", "age": 62, "bmi": 29.4, "menopauseStatus": "Post-menopause", "yearsSinceMenopause": 12, "bloodPressure": "145/88", "glucose": 112, "physicalActivity": "Low", "smokingStatus": "Former", "riskScore": 0.78}
  ],
  ageDistribution: [
    {"ageRange": "40-44", "count": 8},
    {"ageRange": "45-49", "count": 15},
    {"ageRange": "50-54", "count": 22},
    {"ageRange": "55-59", "count": 18},
    {"ageRange": "60-64", "count": 12},
    {"ageRange": "65-70", "count": 6}
  ],
  bmiCategories: [
    {"category": "Normal (18.5-24.9)", "count": 28, "percentage": 34.6},
    {"category": "Overweight (25-29.9)", "count": 35, "percentage": 43.2},
    {"category": "Obese (30+)", "count": 18, "percentage": 22.2}
  ],
  menopauseStages: [
    {"stage": "Pre-menopause", "count": 22, "percentage": 27.2},
    {"stage": "Peri-menopause", "count": 19, "percentage": 23.5},
    {"stage": "Post-menopause", "count": 40, "percentage": 49.4}
  ],
  riskFactors: [
    {"factor": "Age", "importance": 0.24},
    {"factor": "BMI", "importance": 0.19},
    {"factor": "Years Since Menopause", "importance": 0.18},
    {"factor": "Blood Pressure", "importance": 0.15},
    {"factor": "Glucose Level", "importance": 0.13},
    {"factor": "Physical Activity", "importance": 0.11}
  ],
  statistics: {
    "totalParticipants": 81,
    "averageAge": 53.2,
    "averageBMI": 27.8,
    "highRiskCount": 24,
    "mediumRiskCount": 32,
    "lowRiskCount": 25
  }
};

// Global Variables
let currentUser = null;
let charts = {};
let formProgress = 0;

// Blue Sparkly Color Palette for Charts
const blueSparkleColors = [
  '#4a90e2', // Sparkle Sky
  '#87ceeb', // Sparkle Light
  '#1e3a5f', // Sparkle Royal
  '#0d1b2a', // Sparkle Navy
  '#c0c8d4', // Sparkle Silver
  '#6bb6ff', // Light Blue
  '#2c5aa0', // Medium Blue
  '#1a365d', // Dark Blue
  '#e6f3ff', // Very Light Blue
  '#004085'  // Deep Blue
];

// Utility Functions
function showNotification(message, type = 'info') {
  const container = document.getElementById('notification-container');
  if (!container) return;
  
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  };
  
  notification.innerHTML = `
    <i class="${icons[type]}"></i>
    <span class="notification-text">${message}</span>
    <button class="notification-close">&times;</button>
  `;
  
  container.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 5000);
  
  // Add click handler for close button
  const closeBtn = notification.querySelector('.notification-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    });
  }
}

function calculateBMI(height, weight) {
  if (!height || !weight) return '';
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  return bmi.toFixed(1);
}

function getRiskLevel(score) {
  if (score < 0.4) return 'low';
  if (score < 0.7) return 'medium';
  return 'high';
}

function getRiskLevelText(score) {
  const level = getRiskLevel(score);
  return level.charAt(0).toUpperCase() + level.slice(1) + ' Risk';
}

function exportToCSV(data, filename) {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function convertToCSV(data) {
  if (!data.length) return '';
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header];
      return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
    }).join(','))
  ].join('\n');
  return csvContent;
}

// Login System
function handleLogin() {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  
  if (!emailInput || !passwordInput) {
    console.error('Email or password input not found');
    showNotification('Form elements not found', 'error');
    return;
  }
  
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  
  console.log('Attempting login with:', email, password);
  
  // Simple validation - any email and password will work
  if (email && password) {
    currentUser = { email, name: 'Dr. Researcher' };
    console.log('Login successful, switching to main app');
    
    const loginPage = document.getElementById('login-page');
    const mainApp = document.getElementById('main-app');
    
    if (loginPage && mainApp) {
      loginPage.classList.add('hidden');
      mainApp.classList.remove('hidden');
      showNotification('Welcome to DIANA! ✨', 'success');
      
      // Initialize dashboard after switching views
      setTimeout(() => {
        initializeDashboard();
        initializeNavigation();
      }, 100);
    } else {
      console.error('Login page or main app elements not found');
      showNotification('Navigation elements not found', 'error');
    }
  } else {
    showNotification('Please enter both email and password', 'error');
  }
}

function handleForgotPassword() {
  const passwordResetModal = document.getElementById('password-reset-modal');
  if (passwordResetModal) {
    passwordResetModal.classList.remove('hidden');
  }
}

function handlePasswordReset() {
  const resetEmailInput = document.getElementById('reset-email');
  if (resetEmailInput && resetEmailInput.value.trim()) {
    showNotification('Password reset link sent to your email ✨', 'success');
    const passwordResetModal = document.getElementById('password-reset-modal');
    if (passwordResetModal) {
      passwordResetModal.classList.add('hidden');
    }
    resetEmailInput.value = '';
  } else {
    showNotification('Please enter your email address', 'error');
  }
}

function closeModal() {
  const passwordResetModal = document.getElementById('password-reset-modal');
  if (passwordResetModal) {
    passwordResetModal.classList.add('hidden');
  }
}

// Navigation System
function initializeNavigation() {
  const menuItems = document.querySelectorAll('.menu-item');
  const pages = document.querySelectorAll('.page');
  
  menuItems.forEach(item => {
    // Remove any existing click handlers
    item.replaceWith(item.cloneNode(true));
  });
  
  // Re-select menu items after cloning
  const freshMenuItems = document.querySelectorAll('.menu-item');
  
  freshMenuItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetPage = item.dataset.page;
      
      // Update active menu item
      freshMenuItems.forEach(mi => mi.classList.remove('active'));
      item.classList.add('active');
      
      // Show target page
      pages.forEach(page => page.classList.remove('active'));
      const targetPageElement = document.getElementById(`${targetPage}-page`);
      if (targetPageElement) {
        targetPageElement.classList.add('active');
      }
      
      // Initialize page-specific functionality
      switch(targetPage) {
        case 'dashboard':
          initializeDashboard();
          break;
        case 'data-collection':
          initializeDataCollection();
          break;
        case 'analytics':
          initializeAnalytics();
          break;
        case 'predictions':
          initializePredictions();
          break;
        case 'patients':
          initializePatients();
          break;
        case 'export':
          initializeExport();
          break;
      }
    });
  });
}

// Dashboard Functionality
function initializeDashboard() {
  updateStatistics();
  createDashboardCharts();
}

function updateStatistics() {
  const totalParticipantsEl = document.getElementById('total-participants');
  const averageAgeEl = document.getElementById('average-age');
  const averageBmiEl = document.getElementById('average-bmi');
  const highRiskCountEl = document.getElementById('high-risk-count');
  
  if (totalParticipantsEl) totalParticipantsEl.textContent = appData.statistics.totalParticipants;
  if (averageAgeEl) averageAgeEl.textContent = appData.statistics.averageAge;
  if (averageBmiEl) averageBmiEl.textContent = appData.statistics.averageBMI;
  if (highRiskCountEl) highRiskCountEl.textContent = appData.statistics.highRiskCount;
}

function createDashboardCharts() {
  // Age Distribution Chart
  const ageCtx = document.getElementById('age-distribution-chart');
  if (ageCtx) {
    if (charts.ageDistribution) {
      charts.ageDistribution.destroy();
    }
    charts.ageDistribution = new Chart(ageCtx, {
      type: 'bar',
      data: {
        labels: appData.ageDistribution.map(d => d.ageRange),
        datasets: [{
          label: 'Number of Participants',
          data: appData.ageDistribution.map(d => d.count),
          backgroundColor: blueSparkleColors[0],
          borderColor: blueSparkleColors[2],
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 5,
              color: blueSparkleColors[2]
            },
            grid: {
              color: blueSparkleColors[4] + '40'
            }
          },
          x: {
            ticks: {
              color: blueSparkleColors[2]
            },
            grid: {
              color: blueSparkleColors[4] + '40'
            }
          }
        }
      }
    });
  }
  
  // BMI Categories Chart
  const bmiCtx = document.getElementById('bmi-categories-chart');
  if (bmiCtx) {
    if (charts.bmiCategories) {
      charts.bmiCategories.destroy();
    }
    charts.bmiCategories = new Chart(bmiCtx, {
      type: 'doughnut',
      data: {
        labels: appData.bmiCategories.map(d => d.category),
        datasets: [{
          data: appData.bmiCategories.map(d => d.count),
          backgroundColor: [blueSparkleColors[1], blueSparkleColors[0], blueSparkleColors[2]],
          borderColor: [blueSparkleColors[1], blueSparkleColors[0], blueSparkleColors[2]],
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: blueSparkleColors[3],
              usePointStyle: true,
              pointStyle: 'circle'
            }
          }
        }
      }
    });
  }
  
  // Menopause Stages Chart
  const menopauseCtx = document.getElementById('menopause-stages-chart');
  if (menopauseCtx) {
    if (charts.menopauseStages) {
      charts.menopauseStages.destroy();
    }
    charts.menopauseStages = new Chart(menopauseCtx, {
      type: 'pie',
      data: {
        labels: appData.menopauseStages.map(d => d.stage),
        datasets: [{
          data: appData.menopauseStages.map(d => d.count),
          backgroundColor: [blueSparkleColors[5], blueSparkleColors[6], blueSparkleColors[7]],
          borderColor: [blueSparkleColors[5], blueSparkleColors[6], blueSparkleColors[7]],
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: blueSparkleColors[3],
              usePointStyle: true,
              pointStyle: 'circle'
            }
          }
        }
      }
    });
  }
  
  // Risk Distribution Chart
  const riskCtx = document.getElementById('risk-distribution-chart');
  if (riskCtx) {
    if (charts.riskDistribution) {
      charts.riskDistribution.destroy();
    }
    charts.riskDistribution = new Chart(riskCtx, {
      type: 'bar',
      data: {
        labels: ['Low Risk', 'Medium Risk', 'High Risk'],
        datasets: [{
          label: 'Number of Participants',
          data: [appData.statistics.lowRiskCount, appData.statistics.mediumRiskCount, appData.statistics.highRiskCount],
          backgroundColor: [blueSparkleColors[1], blueSparkleColors[0], blueSparkleColors[2]],
          borderColor: [blueSparkleColors[1], blueSparkleColors[0], blueSparkleColors[2]],
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 5,
              color: blueSparkleColors[2]
            },
            grid: {
              color: blueSparkleColors[4] + '40'
            }
          },
          x: {
            ticks: {
              color: blueSparkleColors[2]
            },
            grid: {
              color: blueSparkleColors[4] + '40'
            }
          }
        }
      }
    });
  }
}

// Data Collection Functionality
function initializeDataCollection() {
  initializeTabs();
  initializeParticipantForm();
  initializeCSVUpload();
}

function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.dataset.tab;
      
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      tabContents.forEach(content => content.classList.remove('active'));
      const targetTabContent = document.getElementById(targetTab);
      if (targetTabContent) {
        targetTabContent.classList.add('active');
      }
    });
  });
}

function initializeParticipantForm() {
  const form = document.getElementById('participant-form');
  const ageSlider = document.getElementById('participant-age');
  const ageDisplay = document.getElementById('age-display');
  const heightInput = document.getElementById('height');
  const weightInput = document.getElementById('weight');
  const bmiInput = document.getElementById('bmi');
  const saveDraftBtn = document.getElementById('save-draft');
  
  if (!form) return;
  
  // Age slider
  if (ageSlider && ageDisplay) {
    ageSlider.addEventListener('input', (e) => {
      ageDisplay.textContent = e.target.value;
      updateFormProgress();
    });
  }
  
  // BMI calculation
  function updateBMI() {
    if (heightInput && weightInput && bmiInput) {
      const height = parseFloat(heightInput.value);
      const weight = parseFloat(weightInput.value);
      bmiInput.value = calculateBMI(height, weight);
      updateFormProgress();
    }
  }
  
  if (heightInput) heightInput.addEventListener('input', updateBMI);
  if (weightInput) weightInput.addEventListener('input', updateBMI);
  
  // Form progress tracking
  const formInputs = form.querySelectorAll('input, select');
  formInputs.forEach(input => {
    input.addEventListener('input', updateFormProgress);
    input.addEventListener('change', updateFormProgress);
  });
  
  // Save draft functionality
  if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', () => {
      showNotification('Draft saved successfully ✨', 'success');
    });
  }
  
  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (validateParticipantForm()) {
      const formData = new FormData(form);
      const participantData = {};
      for (let [key, value] of formData.entries()) {
        participantData[key] = value;
      }
      
      // Add to participants list (simulate save)
      const newParticipant = {
        id: appData.participants.length + 1,
        name: participantData['participant-name'] || 'New Participant',
        age: parseInt(participantData['participant-age']),
        bmi: parseFloat(bmiInput ? bmiInput.value : '0'),
        menopauseStatus: participantData['menopause-status'],
        yearsSinceMenopause: parseInt(participantData['years-since-menopause']) || 0,
        bloodPressure: `${participantData['systolic-bp']}/${participantData['diastolic-bp']}`,
        glucose: parseInt(participantData['glucose']),
        physicalActivity: participantData['physical-activity'],
        smokingStatus: participantData['smoking-status'],
        riskScore: Math.random() * 0.8 + 0.1 // Random risk score for demo
      };
      
      appData.participants.push(newParticipant);
      form.reset();
      updateFormProgress();
      showNotification('Participant data saved successfully ✨', 'success');
    }
  });
}

function updateFormProgress() {
  const form = document.getElementById('participant-form');
  if (!form) return;
  
  const inputs = form.querySelectorAll('input[required], select[required]');
  
  let filledInputs = 0;
  let totalInputs = inputs.length;
  
  inputs.forEach(input => {
    if (input.value.trim() !== '') {
      filledInputs++;
    }
  });
  
  // Check radio groups
  const smokingRadios = form.querySelectorAll('input[name="smoking-status"]');
  const smokingChecked = Array.from(smokingRadios).some(radio => radio.checked);
  if (smokingChecked) {
    filledInputs++;
  }
  totalInputs++;
  
  const progress = (filledInputs / totalInputs) * 100;
  const progressBar = document.getElementById('form-progress');
  const progressText = document.querySelector('.progress-text');
  
  if (progressBar) progressBar.style.width = `${progress}%`;
  if (progressText) progressText.textContent = `${Math.round(progress)}% Complete`;
}

function validateParticipantForm() {
  const form = document.getElementById('participant-form');
  if (!form) return false;
  
  const requiredFields = form.querySelectorAll('input[required], select[required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = '#1e3a5f';
      isValid = false;
    } else {
      field.style.borderColor = '';
    }
  });
  
  if (!isValid) {
    showNotification('Please fill in all required fields', 'error');
  }
  
  return isValid;
}

function initializeCSVUpload() {
  const csvFile = document.getElementById('csv-file');
  const browseCsvBtn = document.getElementById('browse-csv');
  const uploadBox = document.querySelector('.upload-box');
  const csvPreview = document.getElementById('csv-preview');
  const importBtn = document.getElementById('import-csv');
  
  if (browseCsvBtn && csvFile) {
    browseCsvBtn.addEventListener('click', () => {
      csvFile.click();
    });
  }
  
  if (csvFile) {
    csvFile.addEventListener('change', handleCSVFile);
  }
  
  // Drag and drop
  if (uploadBox) {
    uploadBox.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadBox.style.borderColor = '#4a90e2';
    });
    
    uploadBox.addEventListener('dragleave', () => {
      uploadBox.style.borderColor = '';
    });
    
    uploadBox.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadBox.style.borderColor = '';
      const files = e.dataTransfer.files;
      if (files.length > 0 && files[0].type === 'text/csv') {
        csvFile.files = files;
        handleCSVFile();
      }
    });
  }
  
  if (importBtn) {
    importBtn.addEventListener('click', () => {
      showNotification('CSV data imported successfully ✨', 'success');
      if (csvPreview) {
        csvPreview.classList.add('hidden');
      }
    });
  }
}

function handleCSVFile() {
  const file = document.getElementById('csv-file').files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const csv = e.target.result;
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    const rows = lines.slice(1, 6); // Show first 5 rows for preview
    
    // Create preview table
    const csvPreview = document.getElementById('csv-preview');
    const csvHeader = document.getElementById('csv-header');
    const csvBody = document.getElementById('csv-body');
    
    if (csvHeader) {
      csvHeader.innerHTML = headers.map(header => `<th>${header.trim()}</th>`).join('');
    }
    
    if (csvBody) {
      csvBody.innerHTML = rows.map(row => {
        const cells = row.split(',');
        return `<tr>${cells.map(cell => `<td>${cell.trim()}</td>`).join('')}</tr>`;
      }).join('');
    }
    
    if (csvPreview) {
      csvPreview.classList.remove('hidden');
    }
  };
  reader.readAsText(file);
}

// Analytics Functionality
function initializeAnalytics() {
  createAnalyticsCharts();
}

function createAnalyticsCharts() {
  // Risk Factors Chart
  const riskFactorsCtx = document.getElementById('risk-factors-chart');
  if (riskFactorsCtx) {
    if (charts.riskFactors) {
      charts.riskFactors.destroy();
    }
    charts.riskFactors = new Chart(riskFactorsCtx, {
      type: 'bar',
      data: {
        labels: appData.riskFactors.map(d => d.factor),
        datasets: [{
          label: 'Importance Score',
          data: appData.riskFactors.map(d => d.importance),
          backgroundColor: blueSparkleColors[0],
          borderColor: blueSparkleColors[2],
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 0.3,
            ticks: {
              color: blueSparkleColors[2]
            },
            grid: {
              color: blueSparkleColors[4] + '40'
            }
          },
          y: {
            ticks: {
              color: blueSparkleColors[2]
            },
            grid: {
              color: blueSparkleColors[4] + '40'
            }
          }
        }
      }
    });
  }
  
  // BMI vs Glucose Correlation
  const bmiGlucoseCtx = document.getElementById('bmi-glucose-chart');
  if (bmiGlucoseCtx) {
    if (charts.bmiGlucose) {
      charts.bmiGlucose.destroy();
    }
    charts.bmiGlucose = new Chart(bmiGlucoseCtx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Participants',
          data: appData.participants.map(p => ({
            x: p.bmi,
            y: p.glucose
          })),
          backgroundColor: blueSparkleColors[1],
          borderColor: blueSparkleColors[0],
          borderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'BMI',
              color: blueSparkleColors[2]
            },
            ticks: {
              color: blueSparkleColors[2]
            },
            grid: {
              color: blueSparkleColors[4] + '40'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Glucose Level (mg/dL)',
              color: blueSparkleColors[2]
            },
            ticks: {
              color: blueSparkleColors[2]
            },
            grid: {
              color: blueSparkleColors[4] + '40'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: blueSparkleColors[3]
            }
          }
        }
      }
    });
  }
}

// Predictions Functionality
function initializePredictions() {
  const participantSelect = document.getElementById('participant-select');
  const predictionResults = document.getElementById('prediction-results');
  
  if (!participantSelect) return;
  
  // Clear existing options first
  participantSelect.innerHTML = '';
  
  // Add default option
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = 'Choose a participant';
  participantSelect.appendChild(defaultOption);
  
  // Populate participant dropdown with actual data
  if (appData && appData.participants && appData.participants.length > 0) {
    appData.participants.forEach(participant => {
      const option = document.createElement('option');
      option.value = participant.id;
      option.textContent = `${participant.name} (Age ${participant.age}, ${participant.menopauseStatus})`;
      participantSelect.appendChild(option);
    });
  }
  
  participantSelect.addEventListener('change', (e) => {
    const participantId = parseInt(e.target.value);
    if (participantId) {
      const participant = appData.participants.find(p => p.id === participantId);
      if (participant) {
        showPredictionResults(participant);
        if (predictionResults) {
          predictionResults.classList.remove('hidden');
        }
      }
    } else {
      if (predictionResults) {
        predictionResults.classList.add('hidden');
      }
    }
  });
}

function showPredictionResults(participant) {
  const riskLevel = getRiskLevel(participant.riskScore);
  const riskLevelText = getRiskLevelText(participant.riskScore);
  
  // Update risk level display
  const riskLevelElement = document.getElementById('risk-level-text');
  if (riskLevelElement) {
    riskLevelElement.textContent = riskLevelText;
    riskLevelElement.className = `status-badge status-badge--${riskLevel}`;
  }
  
  // Create risk gauge chart
  createRiskGaugeChart(participant.riskScore);
  
  // Create feature contribution chart
  createFeatureContributionChart(participant);
  
  // Generate recommendations
  generateRecommendations(participant);
}

function createRiskGaugeChart(riskScore) {
  const ctx = document.getElementById('risk-gauge-chart');
  if (!ctx) return;
  
  if (charts.riskGauge) {
    charts.riskGauge.destroy();
  }
  
  const score = Math.round(riskScore * 100);
  
  charts.riskGauge = new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [score, 100 - score],
        backgroundColor: [
          riskScore < 0.4 ? blueSparkleColors[1] : riskScore < 0.7 ? blueSparkleColors[0] : blueSparkleColors[2],
          blueSparkleColors[4] + '40'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '80%',
      plugins: {
        legend: {
          display: false
        }
      },
      animation: {
        animateRotate: true
      }
    },
    plugins: [{
      beforeDraw: function(chart) {
        const width = chart.width;
        const height = chart.height;
        const ctx = chart.ctx;
        
        ctx.restore();
        const fontSize = (height / 114).toFixed(2);
        ctx.font = fontSize + "em sans-serif";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#0d1b2a";
        
        const text = score + "%";
        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        const textY = height / 2;
        
        ctx.fillText(text, textX, textY);
        ctx.save();
      }
    }]
  });
}

function createFeatureContributionChart(participant) {
  const ctx = document.getElementById('feature-contribution-chart');
  if (!ctx) return;
  
  if (charts.featureContribution) {
    charts.featureContribution.destroy();
  }
  
  // Simulate feature contributions based on participant data
  const contributions = [
    { factor: 'Age', value: (participant.age - 40) / 30 * 0.24 },
    { factor: 'BMI', value: Math.max(0, (participant.bmi - 18.5) / 20 * 0.19) },
    { factor: 'Years Since Menopause', value: participant.yearsSinceMenopause / 30 * 0.18 },
    { factor: 'Blood Pressure', value: Math.max(0, (140 - 120) / 80 * 0.15) },
    { factor: 'Glucose Level', value: Math.max(0, (participant.glucose - 70) / 130 * 0.13) },
    { factor: 'Physical Activity', value: participant.physicalActivity === 'Low' ? 0.11 : participant.physicalActivity === 'Moderate' ? 0.06 : 0.02 }
  ];
  
  charts.featureContribution = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: contributions.map(c => c.factor),
      datasets: [{
        label: 'Contribution to Risk',
        data: contributions.map(c => c.value),
        backgroundColor: blueSparkleColors[0],
        borderColor: blueSparkleColors[2],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          max: 0.25,
          ticks: {
            color: blueSparkleColors[2]
          },
          grid: {
            color: blueSparkleColors[4] + '40'
          }
        },
        y: {
          ticks: {
            color: blueSparkleColors[2]
          },
          grid: {
            color: blueSparkleColors[4] + '40'
          }
        }
      }
    }
  });
}

function generateRecommendations(participant) {
  const recommendationsList = document.getElementById('recommendations-list');
  if (!recommendationsList) return;
  
  const recommendations = [];
  
  if (participant.bmi > 25) {
    recommendations.push('Consider weight management strategies to reduce BMI ✨');
  }
  
  if (participant.physicalActivity === 'Low') {
    recommendations.push('Increase physical activity to at least 150 minutes per week ✨');
  }
  
  if (participant.smokingStatus === 'Current') {
    recommendations.push('Strongly consider smoking cessation programs ✨');
  }
  
  if (participant.glucose > 100) {
    recommendations.push('Monitor blood glucose levels regularly and consider dietary modifications ✨');
  }
  
  const systolic = parseInt(participant.bloodPressure.split('/')[0]);
  if (systolic > 130) {
    recommendations.push('Blood pressure monitoring and potential medication review ✨');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Continue current healthy lifestyle practices ✨');
  }
  
  recommendationsList.innerHTML = recommendations.map(rec => 
    `<div class="recommendation-item">${rec}</div>`
  ).join('');
}

// Patients Management
function initializePatients() {
  populatePatientsTable();
  initializePatientSearch();
}

function populatePatientsTable() {
  const tbody = document.getElementById('patients-tbody');
  if (!tbody) return;
  
  tbody.innerHTML = appData.participants.map(participant => {
    const riskLevel = getRiskLevel(participant.riskScore);
    return `
      <tr>
        <td>${participant.name}</td>
        <td>${participant.age}</td>
        <td>${participant.bmi}</td>
        <td>${participant.menopauseStatus}</td>
        <td>${Math.round(participant.riskScore * 100)}%</td>
        <td><span class="status-badge status-badge--${riskLevel}">${getRiskLevelText(participant.riskScore)}</span></td>
        <td>
          <button class="btn btn--sm btn--outline" onclick="viewPatient(${participant.id})">View</button>
        </td>
      </tr>
    `;
  }).join('');
}

function initializePatientSearch() {
  const searchInput = document.getElementById('patient-search');
  if (!searchInput) return;
  
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#patients-tbody tr');
    
    rows.forEach(row => {
      const name = row.cells[0].textContent.toLowerCase();
      if (name.includes(searchTerm)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
}

function viewPatient(id) {
  const participant = appData.participants.find(p => p.id === id);
  if (participant) {
    // Switch to predictions page and show this patient
    const predictionsMenuItem = document.querySelector('.menu-item[data-page="predictions"]');
    if (predictionsMenuItem) {
      predictionsMenuItem.click();
      setTimeout(() => {
        const participantSelect = document.getElementById('participant-select');
        if (participantSelect) {
          participantSelect.value = id;
          showPredictionResults(participant);
          const predictionResults = document.getElementById('prediction-results');
          if (predictionResults) {
            predictionResults.classList.remove('hidden');
          }
        }
      }, 100);
    }
  }
}

// Export Functionality
function initializeExport() {
  const exportAllCsvBtn = document.getElementById('export-all-csv');
  const exportAllExcelBtn = document.getElementById('export-all-excel');
  const exportReportBtn = document.getElementById('export-report');
  const exportFilteredBtn = document.getElementById('export-filtered');
  
  if (exportAllCsvBtn) {
    exportAllCsvBtn.addEventListener('click', () => {
      exportToCSV(appData.participants, 'participants.csv');
      showNotification('Data exported successfully ✨', 'success');
    });
  }
  
  if (exportAllExcelBtn) {
    exportAllExcelBtn.addEventListener('click', () => {
      showNotification('Excel export feature coming soon ✨', 'info');
    });
  }
  
  if (exportReportBtn) {
    exportReportBtn.addEventListener('click', () => {
      generateAnalyticsReport();
      showNotification('Analytics report generated ✨', 'success');
    });
  }
  
  if (exportFilteredBtn) {
    exportFilteredBtn.addEventListener('click', () => {
      const menopauseFilter = document.getElementById('filter-menopause');
      const riskFilter = document.getElementById('filter-risk');
      
      let filteredData = appData.participants;
      
      if (menopauseFilter && menopauseFilter.value) {
        filteredData = filteredData.filter(p => p.menopauseStatus === menopauseFilter.value);
      }
      
      if (riskFilter && riskFilter.value) {
        filteredData = filteredData.filter(p => getRiskLevel(p.riskScore) === riskFilter.value);
      }
      
      exportToCSV(filteredData, 'filtered_participants.csv');
      showNotification(`Exported ${filteredData.length} filtered records ✨`, 'success');
    });
  }
}

function generateAnalyticsReport() {
  const reportData = {
    summary: appData.statistics,
    ageDistribution: appData.ageDistribution,
    bmiCategories: appData.bmiCategories,
    menopauseStages: appData.menopauseStages,
    riskFactors: appData.riskFactors
  };
  
  const reportText = `
DIANA Analytics Report ✨
Generated: ${new Date().toLocaleDateString()}

SUMMARY STATISTICS
Total Participants: ${reportData.summary.totalParticipants}
Average Age: ${reportData.summary.averageAge}
Average BMI: ${reportData.summary.averageBMI}
High Risk Count: ${reportData.summary.highRiskCount}
Medium Risk Count: ${reportData.summary.mediumRiskCount}
Low Risk Count: ${reportData.summary.lowRiskCount}

AGE DISTRIBUTION
${reportData.ageDistribution.map(d => `${d.ageRange}: ${d.count}`).join('\n')}

BMI CATEGORIES
${reportData.bmiCategories.map(d => `${d.category}: ${d.count} (${d.percentage}%)`).join('\n')}

MENOPAUSE STAGES
${reportData.menopauseStages.map(d => `${d.stage}: ${d.count} (${d.percentage}%)`).join('\n')}

RISK FACTORS IMPORTANCE
${reportData.riskFactors.map(d => `${d.factor}: ${d.importance}`).join('\n')}
  `;
  
  const blob = new Blob([reportText], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'diana_analytics_report.txt';
  a.click();
  window.URL.revokeObjectURL(url);
}

// Global functions for HTML onclick handlers
window.handleLogin = handleLogin;
window.handleForgotPassword = handleForgotPassword;
window.handlePasswordReset = handlePasswordReset;
window.closeModal = closeModal;
window.viewPatient = viewPatient;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing application');
  
  // Initialize with login page visible
  const loginPage = document.getElementById('login-page');
  const mainApp = document.getElementById('main-app');
  
  if (loginPage) {
    loginPage.classList.remove('hidden');
  }
  if (mainApp) {
    mainApp.classList.add('hidden');
  }
  
  // Set up login form event handler
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleLogin();
    });
  }
  
  // Set up forgot password link
  const forgotPasswordLink = document.getElementById('forgot-password');
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
      e.preventDefault();
      handleForgotPassword();
    });
  }
  
  // Set up password reset form
  const passwordResetForm = document.getElementById('password-reset-form');
  if (passwordResetForm) {
    passwordResetForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handlePasswordReset();
    });
  }
  
  // Set up modal close handlers
  const modalCloseButtons = document.querySelectorAll('.modal-close');
  modalCloseButtons.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });
  
  // Set up modal backdrop click
  const passwordResetModal = document.getElementById('password-reset-modal');
  if (passwordResetModal) {
    passwordResetModal.addEventListener('click', function(e) {
      if (e.target === passwordResetModal) {
        closeModal();
      }
    });
  }
  
  console.log('Application initialized');
});