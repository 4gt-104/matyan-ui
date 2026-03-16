import argparse
import os
import sys
from pathlib import Path

import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, HTMLResponse

from jinja2 import Environment, FileSystemLoader
from ._config import (
    MATYAN_UI_API_AUTH_TOKEN,
    MATYAN_UI_API_BASE_PATH,
    MATYAN_UI_API_HOST_BASE,
    MATYAN_UI_BASE_PATH,
    MATYAN_UI_HOST,
    MATYAN_UI_PORT,
)
from ._utils import APIRouter

statics_router = APIRouter()


static_files_root = Path(__file__).parent


def _get_index_html() -> str:
    """Rendered index HTML; cached at module load since config is fixed for process."""
    env = Environment(
        loader=FileSystemLoader(static_files_root / "static"),
        autoescape=True,
    )
    template = env.get_template("index-template.html")
    return template.render(
        base_path=MATYAN_UI_BASE_PATH,
        api_base_path=MATYAN_UI_API_BASE_PATH,
        api_host_base=MATYAN_UI_API_HOST_BASE,
        api_auth_token=MATYAN_UI_API_AUTH_TOKEN,
    )


_cached_index_html: str | None = None


@statics_router.get("/static-files/{path:path}/")
async def serve_static_files(path: str) -> FileResponse:
    # Normalize to resolve any .. segments
    static_file_name = static_files_root.joinpath("static", path).resolve()

    # Ensure that no paths outside the root directory are accessed by checking that the
    # root directory is a prefix of the file path
    common_prefix = Path(os.path.commonpath([static_files_root, static_file_name]))
    if common_prefix != static_files_root:
        raise HTTPException(status_code=404)

    compressed_file_name = Path(f"{static_file_name}.gz")
    if compressed_file_name.exists():
        return FileResponse(compressed_file_name, headers={"Content-Encoding": "gzip"})
    return FileResponse(static_file_name)


# do not change the placement of this method
# as it also serves as a fallback for wrong url routes
@statics_router.get("/{path:path}/", response_class=HTMLResponse)
async def serve_index_html(request: Request) -> str:
    global _cached_index_html
    if _cached_index_html is None:
        _cached_index_html = _get_index_html()
    return _cached_index_html


def exec_() -> None:
    parser = argparse.ArgumentParser(description="Matyan UI server")
    parser.add_argument(
        "--host",
        default=MATYAN_UI_HOST,
        help="Host to bind (default: 0.0.0.0, or MATYAN_UI_HOST env)",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=MATYAN_UI_PORT,
        help="Port to bind (default: 8000, or MATYAN_UI_PORT env)",
    )
    args, _ = parser.parse_known_args(sys.argv[1:])

    app = FastAPI(title=__name__)

    static_files_app = FastAPI()

    static_files_app.include_router(statics_router)

    app.mount(f"{MATYAN_UI_BASE_PATH}/", static_files_app)

    uvicorn.run(app, host=args.host, port=args.port)
