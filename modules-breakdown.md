# DIANA - Diabetes Risk Assessment: Module Breakdown for 4 Members

## Overview
DIANA is a comprehensive web application for assessing diabetes risk in menopausal women. The application includes authentication, data collection, analytics, predictions, patient management, and export functionality.

## Team Structure & Module Distribution

### **Member 1: Frontend UI/UX & Core Framework**
**Focus:** User interface design, responsive layout, navigation, and core application structure

#### Responsibilities:
- **Authentication & Login System**
  - Login form implementation
  - Password reset modal
  - User session management
  - Form validation for auth

- **Main Application Layout**
  - Sidebar navigation
  - Page switching logic
  - Responsive design implementation
  - Modal system (notifications, password reset)

- **UI Components**
  - Button styles and interactions
  - Form controls (inputs, selects, ranges)
  - Progress bars and indicators
  - Card layouts and grids

- **CSS Architecture**
  - Color scheme (blue sparkle palette)
  - Typography and spacing
  - Responsive breakpoints
  - Animation and transitions

#### Files to Own:
- `style.css` (primary ownership)
- `index.html` (layout structure)
- `app.js` (navigation, auth, modal functions)

#### Key Functions:
- `initializeNavigation()`
- `handleLogin()`
- `handleForgotPassword()`
- `showNotification()`
- CSS styling for all components

---

### **Member 2: Data Collection & Form Management**
**Focus:** Data entry forms, validation, CSV upload, and data processing

#### Responsibilities:
- **Manual Data Entry Form**
  - Participant information form
  - BMI auto-calculation
  - Form progress tracking
  - Draft saving functionality

- **Form Validation & Processing**
  - Input validation rules
  - Form submission handling
  - Data sanitization
  - Error handling and user feedback

- **CSV Upload System**
  - File upload interface
  - CSV parsing and validation
  - Data preview functionality
  - Batch import processing

- **Data Models & Storage**
  - Participant data structure
  - Local storage management
  - Data transformation utilities

#### Files to Own:
- `app.js` (data collection functions)
- Form-related HTML sections in `index.html`

#### Key Functions:
- `initializeDataCollection()`
- `initializeParticipantForm()`
- `updateFormProgress()`
- `validateParticipantForm()`
- `initializeCSVUpload()`
- `handleCSVFile()`
- `calculateBMI()`

---

### **Member 3: Analytics & Visualization**
**Focus:** Charts, data visualization, and analytical insights

#### Responsibilities:
- **Dashboard Charts**
  - Age distribution charts
  - BMI categories visualization
  - Menopause stages breakdown
  - Risk distribution graphs

- **Advanced Analytics**
  - Risk factor importance charts
  - BMI vs Glucose correlation plots
  - Statistical calculations
  - Chart.js integration

- **Interactive Visualizations**
  - Chart responsiveness
  - Color schemes and theming
  - Chart tooltips and legends
  - Dynamic chart updates

- **Data Processing for Charts**
  - Chart data preparation
  - Statistical aggregations
  - Chart configuration and options

#### Files to Own:
- `app.js` (chart and analytics functions)
- Chart-related HTML sections in `index.html`

#### Key Functions:
- `initializeDashboard()`
- `createDashboardCharts()`
- `initializeAnalytics()`
- `createAnalyticsCharts()`
- `updateStatistics()`

---

### **Member 4: Predictions & Patient Management**
**Focus:** Risk assessment algorithms, patient records, and export functionality

#### Responsibilities:
- **Prediction Engine**
  - Risk score calculations
  - Risk gauge visualization
  - Feature contribution analysis
  - Recommendation generation

- **Patient Management System**
  - Patient records table
  - Search and filtering
  - Patient viewing/editing
  - Record management

- **Export System**
  - CSV export functionality
  - Excel export options
  - Filtered data export
  - Report generation

- **Risk Assessment Logic**
  - Risk level determination
  - Prediction algorithms
  - Recommendation engine
  - Result presentation

#### Files to Own:
- `app.js` (predictions and patient management functions)
- Patient and prediction HTML sections in `index.html`

#### Key Functions:
- `initializePredictions()`
- `showPredictionResults()`
- `createRiskGaugeChart()`
- `createFeatureContributionChart()`
- `generateRecommendations()`
- `initializePatients()`
- `populatePatientsTable()`
- `initializeExport()`
- `exportToCSV()`
- `getRiskLevel()`
- `getRiskLevelText()`

---

## Integration Points & Dependencies

### **Cross-Module Dependencies:**
1. **Data Flow**: Member 2 (Data Collection) → Member 3 (Analytics) → Member 4 (Predictions)
2. **UI Consistency**: Member 1 provides base styles, all members follow the design system
3. **Shared Utilities**: Functions like `showNotification()`, `calculateBMI()`, `getRiskLevel()` used across modules
4. **Global State**: `appData` object shared across all modules

### **Shared Components:**
- Notification system
- Modal dialogs
- Form validation utilities
- Chart color schemes
- Export utilities

---

## Development Workflow

### **Phase 1: Foundation (Week 1-2)**
- Member 1: Complete UI framework and navigation
- Member 2: Basic form structure and validation
- Member 3: Chart.js integration and basic charts
- Member 4: Patient table structure and basic predictions

### **Phase 2: Feature Development (Week 3-4)**
- Member 1: Polish UI/UX and responsive design
- Member 2: CSV upload and advanced form features
- Member 3: Advanced analytics and correlations
- Member 4: Risk algorithms and recommendation engine

### **Phase 3: Integration & Testing (Week 5-6)**
- Cross-module integration testing
- Performance optimization
- Bug fixes and refinements
- Final UI/UX polish

---

## Quality Assurance Responsibilities

### **Each Member Should:**
- Test their modules thoroughly
- Ensure responsive design works on all screen sizes
- Validate data integrity and error handling
- Follow consistent code style and commenting
- Document functions and complex logic

### **Code Review Process:**
- Peer reviews for cross-module changes
- Member 1 reviews all UI/UX consistency
- Member 2 reviews all data handling logic
- Member 3 reviews all chart implementations
- Member 4 reviews all algorithm implementations

---

## Technology Stack
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Charts**: Chart.js library
- **Icons**: Font Awesome
- **Styling**: Custom CSS with blue sparkle theme
- **Data Storage**: Browser localStorage (for demo)
- **Export**: Client-side CSV generation

This modular breakdown ensures each team member has clear ownership while maintaining necessary integration points for a cohesive application.
