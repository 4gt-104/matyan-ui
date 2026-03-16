import os

MATYAN_UI_BASE_PATH = os.environ.get("MATYAN_UI_BASE_PATH", "")
MATYAN_UI_API_BASE_PATH = os.environ.get("MATYAN_UI_API_BASE_PATH", "/api/v1")
MATYAN_UI_API_HOST_BASE = os.environ.get("MATYAN_UI_API_HOST_BASE", "http://localhost:53800")
MATYAN_UI_API_AUTH_TOKEN = os.environ.get("MATYAN_UI_API_AUTH_TOKEN", "")
MATYAN_UI_HOST = os.environ.get("MATYAN_UI_HOST", "0.0.0.0")
MATYAN_UI_PORT = int(os.environ.get("MATYAN_UI_PORT", "8000"))
