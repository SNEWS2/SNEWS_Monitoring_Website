from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class MessageBase:
    id = Column(Integer, primary_key=True, index=True)
    message_id = Column(String)
    message_uuid = Column(String)
    received_time_utc = Column(DateTime)
    detector_name = Column(String)
    machine_time_utc = Column(String)
    is_test = Column(Integer)

class SigTierArchive(Base, MessageBase):
    __tablename__ = "sig_tier_archive"
    p_val = Column(Float)
    p_values = Column(String)
    t_bin_width_sec = Column(Float)

class TimeTierArchive(Base, MessageBase):
    __tablename__ = "time_tier_archive"
    timing_series = Column(String)
    neutrino_time_utc = Column(String)

class CoincidenceTierArchive(Base, MessageBase):
    __tablename__ = "coincidence_tier_archive"
    p_val = Column(Float)
    is_firedrill = Column(Integer)
    neutrino_time_utc = Column(String)

class CachedHeartbeats(Base, MessageBase):
    __tablename__ = "cached_heartbeats"
    detector_status = Column(String)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 