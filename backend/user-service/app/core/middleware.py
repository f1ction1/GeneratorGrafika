import time
import uuid
from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
import logging

logger = logging.getLogger("user_service.middleware")


class LoggingMiddleware(BaseHTTPMiddleware):
    """Middleware do logowania wszystkich requestów i responses"""
    
    def __init__(self, app: ASGIApp):
        super().__init__(app)
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:

        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        

        method = request.method
        url = str(request.url)
        client_host = request.client.host if request.client else "unknown"
        

        start_time = time.time()
        

        logger.info(
            f"Request started: {method} {url}",
            extra={
                "request_id": request_id,
                "method": method,
                "endpoint": url,
                "client_ip": client_host,
            }
        )
        

        try:
            response = await call_next(request)
            

            duration = (time.time() - start_time) * 1000 
            

            logger.info(
                f"Request completed: {method} {url} - Status: {response.status_code}",
                extra={
                    "request_id": request_id,
                    "method": method,
                    "endpoint": url,
                    "status_code": response.status_code,
                    "duration": round(duration, 2),
                }
            )
            

            response.headers["X-Request-ID"] = request_id
            
            return response
            
        except Exception as e:
            duration = (time.time() - start_time) * 1000
            logger.error(
                f"Request failed: {method} {url} - Error: {str(e)}",
                extra={
                    "request_id": request_id,
                    "method": method,
                    "endpoint": url,
                    "duration": round(duration, 2),
                },
                exc_info=True
            )
            raise


class RequestContextMiddleware(BaseHTTPMiddleware):
    """Middleware do dodawania kontekstu requesta do logów"""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        
        request_id = getattr(request.state, "request_id", None)
        
        if request_id:
            pass
        
        response = await call_next(request)
        return response
