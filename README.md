# Travel App

A full-stack travel application that allows users to manage their trip notes.

## Project Structure

The project is divided into two main parts:
- Frontend (Angular application)
- Backend (Node.js/Express application)

## Frontend

The frontend is an Angular application that provides the user interface for managing trip notes.

### Prerequisites
- Node.js (v14 or higher)
- Angular CLI

### Installation
1. Navigate to the project root directory
2. Install dependencies:
```bash
npm install
```

### Running the Frontend
```bash
npm run start/ ng serve
```
The application will be available at `http://localhost:4200`

## Backend

The backend is a Node.js/Express application that provides the API for the frontend.

### Prerequisites
- Node.js (v14 or higher)
- SQLite (if using a database)

### Installation
1. Navigate to the backend directory:
```bash
cd Backend
```
2. Install dependencies:
```bash
npm install
```

### Running the Backend
```bash
dotnet run
```
The API will be available at `http://localhost:5001`

## Development

To run both frontend and backend simultaneously for development:
1. Open two terminal windows
2. In the first terminal, run the frontend:
```bash
cd Frontend
npm run start/ ng serve
```
3. In the second terminal, run the backend:
```bash
cd Backend
dotnet run
```

## Features
- Create, read, update, and delete trip notes
- Search and filter trip notes
- Sort trip notes by various criteria
- Responsive design
