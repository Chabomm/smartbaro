from typing import List, Dict, Any, Union, Optional
from datetime import date, datetime, time, timedelta

from app.schemas.schema import *
from app.schemas.display import *

class Main(BaseModel): # 게시물
    mode: Optional[str] = Field(0, title="REG/MOD/DEL")
    uid: int = Field(0, title="고유번호")
    site_id: Optional[str] = Field(None, title="프로젝트", max_length=50)
    area: Optional[str] = Field(None, title="영역")
    area_class: Optional[str] = Field('A', title="영역플랫폼")
    area_name: Optional[str] = Field(None, title="영역명")
    area_sort: Optional[int] = Field(None, title="영역순서")
    area_thumb: Optional[str] = Field(None, title="영역썸네일")
    is_display: Optional[str] = Field('T', title="노출여부")
    per_write: Optional[str] = Field('admin', title="쓰기권한", max_length=50)
    per_read: Optional[str] = Field('admin', title="읽기권한", max_length=50)
    display_type: Optional[str] = Field(None, title="노출타입", max_length=50)
    cont_uid: Optional[int] = Field(None, title="테이블의 uid")
    cont_type: Optional[str] = Field(None, title="컨텐츠타입", max_length=50)
    create_at: Optional[datetime] = Field(None, title="등록일")
    update_at: Optional[datetime] = Field(None, title="수정일")
    delete_at: Optional[datetime] = Field(None, title="삭제일")
    class Config:
        orm_mode = True

class MainListInput(BaseModel):
    site_id: Optional[str] = Field("", title="사이트아이디")
    display_type: Optional[str] = Field("", title="노출타입")
    class Config:
        orm_mode = True

class MainCreateInput(Status):
    site_id: Optional[str] = Field("", title="사이트아이디")
    area: Optional[str] = Field("", title="영역코드")
    area_class: Optional[str] = Field("", title="플랫폼")
    display_type: Optional[str] = Field("", title="display_type")
    cont_uid: Optional[int] = Field("", title="cont_uid")
    cont_type: Optional[str] = Field("", title="cont_type")
    class Config:
        orm_mode = True

class BannerListOutput(Status):
    main: Main = Field({}, title="게시판 상세정보")
    list: List[MainBanner] = Field([], title="게시물 리스트")
    class Config:
        orm_mode = True

class BannerDetailInput(BaseModel):
    uid: int = Field(0, title="T_MAIN_BANNER UID")
    main_uid: int = Field(0, title="T_MAIN UID")
