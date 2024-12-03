
from typing import Optional, List
from pydantic import BaseModel, Field

from app.schemas.schema import *

# [ S ] 고객사 담당자 
class TokenDataAdmin(BaseModel):
    token_name: Optional[str] = Field("SMARTBARO-ADMIN")
    user_uid: Optional[int] = Field(0)
    user_id: Optional[str] = Field("")
    user_name: Optional[str] = Field("")
    user_depart: Optional[str] = Field("")
    role: Optional[str] = Field("")
    roles: Optional[List[int]] = Field([], title="권한")
    access_token: Optional[str] = Field("")
    is_temp: bool = Field(False)

def getTokenDataAdmin(user) :
    return TokenDataAdmin (
         token_name = user["token_name"]
        ,user_uid = user["user_uid"]
        ,user_id = user["user_id"]
        ,user_name = user["user_name"]
        ,user_depart = user["user_depart"]
        ,role = user["role"]
        ,roles = user["roles"]
        ,access_token = user["access_token"]
        ,is_temp = user["is_temp"]
    )

class SignInRequest(BaseModel):
    user_id: str
    user_pw: str

class ResetPw(BaseModel):
    user_id: Optional[str] = Field("")
