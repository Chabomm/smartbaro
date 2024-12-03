from sqlalchemy import Column, String, Integer, ForeignKey, text, DateTime, Boolean, JSON, Date

from app.core.database import Base

class T_RESERVE(Base):
    __tablename__ = "T_RESERVE"
    uid = Column(Integer, primary_key=True, index=True)
    state = Column(String, default="접수")
    r_doctor_id = Column(String)
    doctor_uid = Column(Integer)
    user_id = Column(String)
    r_hospital = Column(String)
    cate_uid = Column(Integer)
    r_range = Column(String)
    rev_date = Column(Date)
    rev_time = Column(String)
    user_name = Column(String)
    mobile = Column(String)
    birth = Column(String)
    is_first = Column(String)
    gender = Column(String)
    post = Column(String)
    addr = Column(String)
    addr_detail = Column(String)
    user_ip = Column(String)
    create_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"), comment="등록일")
    update_at = Column(DateTime, comment="수정일")
    delete_at = Column(DateTime, comment="삭제일")

class T_DOCS(Base):
    __tablename__ = "T_DOCS"
    uid = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    post = Column(String)
    addr1 = Column(String)
    addr2 = Column(String)
    addr3 = Column(String)
    tel = Column(String)
    mobile = Column(String)
    proposer = Column(String)
    proposer_post = Column(String)
    proposer_addr1 = Column(String)
    proposer_addr2 = Column(String)
    proposer_addr3 = Column(String)
    proposer_tel = Column(String)
    proposer_mobile = Column(String)
    password = Column(String)
    relation_type = Column(String)
    purpose_type = Column(String)
    hope_at = Column(DateTime, comment="발급희망일")
    issue_at = Column(DateTime, comment="발급일")
    state = Column(String, default="접수완료")
    create_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"), comment="등록일")
    update_at = Column(DateTime, comment="수정일")
    delete_at = Column(DateTime, comment="삭제일")

class T_DOCS_REQUEST(Base):
    __tablename__ = "T_DOCS_REQUEST"
    uid = Column(Integer, primary_key=True, index=True)
    docs_uid = Column(Integer, ForeignKey('T_DOCS.uid'))
    docs_name = Column(String)
    docs_ea = Column(Integer)