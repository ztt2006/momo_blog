from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.tag import TagCreate, TagResponse, TagUpdate
from app.services.tag_service import create_tag_for_admin, list_tags_for_admin, update_tag_for_admin

router = APIRouter(prefix="/admin/tags", tags=["admin-tags"])


@router.get("", response_model=PaginatedResponse[TagResponse])
def get_tags(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> PaginatedResponse[TagResponse]:
    items, total = list_tags_for_admin(db)
    return PaginatedResponse(total=total, items=items)


@router.post("", response_model=TagResponse, status_code=status.HTTP_201_CREATED)
def create_tag(
    payload: TagCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> TagResponse:
    return create_tag_for_admin(db, payload)


@router.put("/{tag_id}", response_model=TagResponse)
def update_tag_item(
    tag_id: int,
    payload: TagUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> TagResponse:
    return update_tag_for_admin(db, tag_id, payload)
