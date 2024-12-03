from sqlalchemy import Column, String, Integer, ForeignKey, text, DateTime, Boolean, JSON

from app.core.database import Base

class T_DOCTOR(Base):
    __tablename__ = "T_DOCTOR"
    uid = Column(Integer, primary_key=True, index=True)
    cate_uid = Column(JSON, default=[])
    name = Column(String)
    position = Column(String)
    thumb = Column(String)
    profile = Column(String)
    field_keyword = Column(String)
    field_spec = Column(String)
    career = Column(String)
    sort = Column(Integer)
    create_at = Column(DateTime, server_default=text(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"), comment="등록일")
    update_at = Column(DateTime, comment="수정일")
    delete_at = Column(DateTime, comment="삭제일")

class T_DOCTOR_INFO(Base):
    __tablename__ = "T_DOCTOR_INFO"
    uid = Column(Integer, primary_key=True, index=True)
    doctor_uid = Column(Integer, ForeignKey('T_DOCTOR.uid'))
    subject = Column(String)
    contents = Column(String)
    sort = Column(Integer)
    create_at = Column(DateTime, server_default=text(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"), comment="등록일")
    update_at = Column(DateTime, comment="수정일")
    delete_at = Column(DateTime, comment="삭제일")

class T_DOCTOR_SCHEDULE(Base):
    __tablename__ = "T_DOCTOR_SCHEDULE"
    uid = Column(Integer, ForeignKey('T_DOCTOR.uid'), primary_key=True, index=True)
    am_week_1 = Column(String)
    am_week_2 = Column(String)
    am_week_3 = Column(String)
    am_week_4 = Column(String)
    am_week_5 = Column(String)
    pm_week_1 = Column(String)
    pm_week_2 = Column(String)
    pm_week_3 = Column(String)
    pm_week_4 = Column(String)
    pm_week_5 = Column(String)
    create_at = Column(DateTime, server_default=text(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"), comment="등록일")
    update_at = Column(DateTime, comment="수정일")
    delete_at = Column(DateTime, comment="삭제일")