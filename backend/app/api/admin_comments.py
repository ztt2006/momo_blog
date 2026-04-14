from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.comment import CommentAdminItem, CommentStatusUpdate
from app.schemas.common import PaginatedResponse
from app.services.comment_service import list_admin_comments, update_comment_status_for_admin

router = APIRouter(prefix="/admin/comments", tags=["admin-comments"])


@router.get("", response_model=PaginatedResponse[CommentAdminItem])
def get_comments(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> PaginatedResponse[CommentAdminItem]:
    items, total = list_admin_comments(db)
    return PaginatedResponse(total=total, items=items)


@router.put("/{comment_id}", response_model=CommentAdminItem)
def update_comment_status(
    comment_id: int,
    payload: CommentStatusUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> CommentAdminItem:
    return update_comment_status_for_admin(db, comment_id, payload.status)
