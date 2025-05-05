# SNEWS Monitoring Website

A real-time monitoring website for SNEWS messages, displaying different types of messages on horizontal timelines.

## Features

- Real-time display of SNEWS messages (Significance Tier, Time Tier, Coincidence Tier, and Heartbeat)
- Horizontal timelines showing the last 100 messages for each message type
- Automatic updates every 30 seconds
- Interactive tooltips showing detailed message information
- Visual distinction between test and non-test messages

## Prerequisites

- Python 3.8+
- Node.js 14+
- PostgreSQL database (configured in SNEWS_DB)

## Setup

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file with your database configuration:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/snews_db
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   python main.py
   ```

2. In a new terminal, start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Development

- Backend API endpoints:
  - `/api/messages/sig-tier`: Get latest significance tier messages
  - `/api/messages/time-tier`: Get latest time tier messages
  - `/api/messages/coincidence-tier`: Get latest coincidence tier messages
  - `/api/messages/heartbeat`: Get latest heartbeat messages

- Frontend components:
  - `App.tsx`: Main application component
  - `MessageTimeline.tsx`: Timeline visualization component

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 