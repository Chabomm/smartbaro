from typing import List, Dict, Any, Union, Optional
from datetime import date, datetime, time, timedelta

from app.schemas.schema import *

class Memo(BaseModel):
    uid: int = Field(0, title="uid")
    table_uid: Optional[int] = Field(None, title="상담uid")
    table_name: Optional[str] = Field(None, title="테이블명", max_length=100)
    memo: Optional[str] = Field(None, title="메모내용")
    create_user: Optional[str] = Field(None, title="등록자", max_length=100)
    create_at: Optional[datetime] = Field(None, title="등록일")
    class Config:
        orm_mode = True

class LogListInput(PPage_param):
    table_name: Optional[str] = Field(None, title="테이블명", max_length=100)
    cl_uid: Optional[int] = Field(None, title="uid")
    class Config:
        orm_mode = True

class BackendFileListInput(PPage_param):
    folder_name: Optional[str] = Field(None, title="폴더명")
    class Config:
        orm_mode = True

class BackendFileReadInput(BaseModel):
    folder_name: Optional[str] = Field(None, title="폴더명")
    file_name: Optional[str] = Field(None, title="파일명")
    class Config:
        orm_mode = True