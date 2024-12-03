from sqlalchemy import Column, String, Integer, ForeignKey, text, DateTime, Boolean, JSON, Date

from app.core.database import Base

class T_MAIN(Base):
    __tablename__ = "T_MAIN"
    uid = Column(Integer, primary_key=True, index=True)
    site_id = Column(String, default='smartbaro', comment="프로젝트")
    area = Column(String, comment="영역")
    area_class = Column(String, default='A', comment="A : 모든플랫폼, W : 웹, M : 모바일")
    area_name = Column(String, comment="영역명")
    area_sort = Column(String, comment="영역 순서")
    area_thumb = Column(String, comment="영역썸네일")
    is_display = Column(String, default='T', comment="표시여부")
    per_write = Column(String, default='admin', comment="쓰기권한")
    per_read = Column(String, default='admin', comment="읽기권한")
    display_type = Column(String, comment="노출타입")
    cont_uid = Column(Integer, comment="테이블의 uid")
    cont_type = Column(String, comment="컨텐츠 타입")
    create_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"), comment="등록일")
    update_at = Column(DateTime, comment="수정일")
    delete_at = Column(DateTime, comment="삭제일") 
