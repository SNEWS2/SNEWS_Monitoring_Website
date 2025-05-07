from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Dict, Any
from database import get_db, SigTierArchive, TimeTierArchive, CoincidenceTierArchive, CachedHeartbeats
from datetime import datetime, timedelta

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_latest_messages(db: Session, model, limit: int = 100) -> List[Dict[str, Any]]:
    messages = db.query(model).order_by(desc(model.received_time_utc)).limit(limit).all()
    return [
        {
            "id": msg.id,
            "message_id": msg.message_id,
            "message_uuid": msg.message_uuid,
            "received_time_utc": msg.received_time_utc.isoformat(),
            "detector_name": msg.detector_name,
            "machine_time_utc": msg.machine_time_utc,
            "is_test": bool(msg.is_test),
            **{k: getattr(msg, k) for k in model.__table__.columns.keys() 
               if k not in ['id', 'message_id', 'message_uuid', 'received_time_utc', 
                          'detector_name', 'machine_time_utc', 'is_test']}
        }
        for msg in messages
    ]

@app.get("/api/messages/sig-tier")
def get_sig_tier_messages(db: Session = Depends(get_db)):
    return get_latest_messages(db, SigTierArchive)

@app.get("/api/messages/time-tier")
def get_time_tier_messages(db: Session = Depends(get_db)):
    return get_latest_messages(db, TimeTierArchive)

@app.get("/api/messages/coincidence-tier")
def get_coincidence_tier_messages(db: Session = Depends(get_db)):
    return get_latest_messages(db, CoincidenceTierArchive)

@app.get("/api/messages/heartbeat")
def get_heartbeat_messages(db: Session = Depends(get_db)):
    return get_latest_messages(db, CachedHeartbeats)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 