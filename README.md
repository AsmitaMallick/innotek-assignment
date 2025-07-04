# CSV Summary Generator

A full-stack web application that allows users to upload CSV files containing sales data and view dynamic summaries in a dashboard interface.

## Project Overview

This application consists of:
- **Backend**: Java Spring Boot REST API with in-memory data storage
- **Frontend**: Modern React-based web interface
- **Features**: CSV file upload, data processing, summary calculations, and dashboard visualization

## Technologies Used

### Backend
- Java 17
- Spring Boot 3.2.0
- Maven (build tool)
- In-memory data storage (ConcurrentHashMap)

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components

## Features

### Core Requirements
- File upload form with CSV validation
- Upload status feedback (success/error messages)
- Dynamic dashboard displaying all summaries
- In-memory data storage (volatile, resets on server restart)
- CSV parsing and metric calculations
- REST API endpoints for upload and data retrieval

### Bonus Features
- Single summary detail view (modal dialog)
- Individual summary endpoint (`GET /api/sales-summaries/{id}`)
- Responsive design
- Real-time data refresh
- Professional UI with icons and formatting

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Node.js 18+ (for frontend)
- npm or yarn

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Build the project:**
   ```bash
   mvn clean install
   ```

3. **Run the Spring Boot application:**
   ```bash
   mvn spring-boot:run
   ```

4. **Verify the backend is running:**
   - Server will start on `http://localhost:8080`
   - Test endpoint: `GET http://localhost:8080/sales-summaries`

### Frontend Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Frontend will be available at `http://localhost:3000`

### Testing the Application

1. **Start both backend and frontend servers**

2. **Use the sample CSV file:**
   - A `sample-data.csv` file is provided in the project root
   - Or create your own CSV with columns: `product_name,quantity,price_per_unit`

3. **Upload process:**
   - Select a CSV file using the upload form
   - Click "Upload" button
   - View the success message and updated dashboard

4. **Dashboard features:**
   - View all uploaded summaries in a table
   - Click the eye icon to see detailed summary information
   - Refresh data using the "Refresh" button

## API Endpoints

### Upload Sales Data
```
POST /upload-sales-data
Content-Type: multipart/form-data
Body: file (CSV file)
```

### Get All Summaries
```
GET /sales-summaries
Response: Array of SalesSummary objects
```
## Data Model

### SalesSummary Object
```json
{
  "id": "unique-id",
  "fileName": "sample-data.csv"
  "uploadTimestamp": "2024-01-15T10:30:00",
  "totalRecords": 10,
  "totalQuantity": 25,
  "totalRevenue": 1500.50
}
```

## Architecture

### Backend Architecture
- **Controller Layer**: REST endpoints (`SalesController`)
- **Service Layer**: Business logic (`SalesDataService`)
- **Model Layer**: Data objects (`SalesSummary`, `SalesRecord`)
- **Storage**: In-memory ConcurrentHashMap

### Frontend Architecture
- **Components**: React functional components with hooks
- **State Management**: React useState and useEffect
- **API Communication**: Fetch API for REST calls
- **UI Components**: shadcn/ui component library

