from sqlalchemy import Column, String, Integer, ForeignKey, text, DateTime, Boolean, JSON, Date

from app.core.database import Base

class T_CATEGORY(Base):
    __tablename__ = "T_CATEGORY"
    uid = Column(Integer, primary_key=True, index=True)
    cate_name = Column(String)
    cate_icon = Column(String)
    cate_sort = Column(Integer)
    table_name = Column(String)
    table_uid = Column(Integer)
    is_reserve = Column(String, default='F')

class T_MAIN_BANNER(Base):
    __tablename__ = "T_MAIN_BANNER"
    uid = Column(Integer, primary_key=True, index=True)
    main_uid = Column(Integer)
    site_id = Column(String)
    area = Column(String)
    area_class = Column(String)
    cate_uid = Column(Integer, ForeignKey('T_CATEGORY.uid'))
    banner_name = Column(String)
    banner_src = Column(String)
    link_type = Column(String)
    link = Column(String)
    sort = Column(Integer)
    is_display = Column(String, default='T', comment="표시여부")
    create_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))
    delete_at = Column(DateTime)
    update_at = Column(DateTime)

class T_MAIN_BANNER_TXT(Base):
    __tablename__ = "T_MAIN_BANNER_TXT"
    banner_uid = Column(Integer, ForeignKey('T_MAIN_BANNER.uid'), primary_key=True, index=True)
    txt1 = Column(String)
    txt2 = Column(String)
    txt3 = Column(Integer)
    txt4 = Column(String)
    txt5 = Column(String)

