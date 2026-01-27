# 🌍 ENVIROSENSE - University of Nairobi Environmental Monitoring System

A modern, intelligent environmental monitoring and control system designed for the University of Nairobi's C4DLab. Real-time sensor data visualization, AI-powered predictions, and automated environmental control for optimal campus facility management.

![React](https://img.shields.io/badge/React-18+-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7+-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3+-cyan?logo=tailwindcss)

---

## ✨ Features

### 📊 Real-Time Monitoring
- **Live Sensor Dashboard** - Monitor temperature, humidity, air quality, and noise levels across multiple locations
- **Multi-Location Support** - Track environmental metrics from examination halls, computer labs, and corridors
- **Status Indicators** - Visual alerts for normal, warning, and critical conditions

### 🤖 AI-Powered Intelligence
- **Predictive Analytics** - Forecast environmental trends up to 24 hours ahead
- **Intelligent Recommendations** - Receive actionable insights for optimal environmental management
- **Anomaly Detection** - Automatic alerts for unusual environmental patterns

### 🎛️ System Controls
- **Automated Control** - Manage ventilation, heating, air purification, and fans
- **Manual Override** - Switch between auto and manual control modes
- **Per-Location Control** - Independent control for each monitored location

### 🚨 Alert Management
- **Real-Time Alerts** - Instant notifications for critical environmental changes
- **Alert History** - Comprehensive log of all system alerts with timestamps
- **Priority Levels** - Color-coded severity indicators (Critical, Warning, Normal)

### 📈 Advanced Reporting
- **Weekly Reports** - Generate comprehensive environmental trend reports
- **Data Export** - Export metrics for further analysis
- **Historical Data** - Track environmental patterns over time

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/uon-environmental-monitoring-system.git
   cd uon-environmental-monitoring-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:8080`

---

## 📁 Project Structure

```
src/
├── components/
│   ├── monitoring/
│   │   ├── Dashboard.tsx          # Main sensor data display
│   │   ├── Controls.tsx           # System control interface
│   │   ├── AlertBanner.tsx        # Active alerts banner
│   │   ├── AlertsList.tsx         # Alert history
│   │   ├── AIInsights.tsx         # AI predictions & recommendations
│   │   ├── Reports.tsx            # Report generation
│   │   ├── MonitoringHeader.tsx   # Application header
│   │   └── Navigation.tsx         # Tab navigation
│   └── ui/                        # Reusable UI components (shadcn/ui)
├── hooks/
│   ├── useEnvironmentData.ts      # Sensor data management
│   ├── useAlertNotifications.ts   # Alert handling
│   ├── useControlSystems.ts       # Control system logic
│   ├── useAIPredictions.ts        # AI prediction engine
│   └── useMonitoringSystem.ts     # Core system orchestration
├── services/
│   ├── AIPredictionService.ts     # AI analytics engine
│   └── NotificationService.ts     # Alert notifications
├── constants/
│   └── monitoring.ts              # System constants & mock data
└── pages/
    ├── Index.tsx                  # Home page
    └── MonitoringSystem.tsx        # Main monitoring interface
```

---

## 🛠️ Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview

# Run linter
npm run lint

# Run tests
npm test

# Watch mode for tests
npm run test:watch
```

---

## 🎯 Core Functionality

### Dashboard Tab
- Displays real-time environmental metrics from all monitored locations
- Summary cards showing average temperature, air quality, and noise levels
- Color-coded status badges for quick assessment

### Controls Tab
- Independent control buttons for each location
- Toggle systems: Ventilation, Heater, Air Purifier, Fan
- Auto/Manual mode indicators

### AI Insights Tab
- Machine learning-based environmental analysis
- 24-hour predictions for temperature, air quality, and noise
- Intelligent recommendations for system adjustments

### Alerts Tab
- Complete alert history with timestamps
- Severity-based filtering (Critical, Warning, Normal)
- Real-time banner notifications

### Reports Tab
- Weekly environmental summaries
- Performance metrics and trends
- Export capabilities for data analysis

---

## 🔧 Technology Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type-safe development |
| **Vite 7** | Build tool & dev server |
| **Tailwind CSS** | Styling |
| **Radix UI** | Accessible component primitives |
| **React Query** | Server state management |
| **Vitest** | Unit testing |
| **ESLint** | Code quality |

---

## 📊 Sensor Monitored Locations

- **Main Examination Hall** - Primary testing facility
- **Computer Lab B** - IT infrastructure area
- **Corridor - Ground Floor** - Common circulation space

### Monitored Metrics

| Metric | Range | Unit |
|--------|-------|------|
| Temperature | -10 to 50°C | °C |
| Air Quality | 0-1000+ | ppm (CO₂) |
| Noise Level | 0-100+ | dB |
| Humidity | 0-100% | % |

---

## 🔐 Security Features

- Type-safe operations with TypeScript
- Input validation and sanitization
- Secure state management
- ESLint configuration for best practices

---

## 📈 Performance Optimization

- Lazy loading of components
- Memoized selectors and calculations
- Optimized re-renders with React.memo
- CSS-in-JS for dynamic styling
- Vite's rapid HMR for development

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Team

**University of Nairobi - C4DLab**

Environmental Monitoring System developed for intelligent campus facility management.

---

## 📧 Support

For support, email c4dlab@uon.ac.ke or create an issue in the repository.

---

## 🗺️ Roadmap

- [ ] Mobile app for iOS/Android
- [ ] Cloud integration for remote monitoring
- [ ] Advanced machine learning models
- [ ] Multi-campus support
- [ ] API documentation and REST endpoints
- [ ] Real-time data streaming with WebSockets
- [ ] IoT device integration
- [ ] Custom alert rules engine

---

## 🎓 About C4DLab

The Cyber Capacity Development Lab (C4DLab) at the University of Nairobi focuses on developing innovative solutions for smart campus management and environmental monitoring.

---

**Last Updated:** January 2026  
**Version:** 1.0.0
