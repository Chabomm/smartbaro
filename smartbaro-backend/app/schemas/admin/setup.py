
from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import date, datetime, time, timedelta

from app.schemas.schema import *

class DeleteFile(AppModel):
    path : str = Field("")