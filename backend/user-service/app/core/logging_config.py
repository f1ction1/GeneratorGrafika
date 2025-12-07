import logging
import sys
import gzip
import shutil
from pathlib import Path
from logging.handlers import TimedRotatingFileHandler
import json
from datetime import datetime
from typing import Any, Dict


LOGS_DIR = Path(__file__).parent.parent.parent / "logs"
LOGS_DIR.mkdir(exist_ok=True)


def namer(default_name: str) -> str:
    """Funkcja nadająca nazwy rotowanym plikom z datą"""
    return default_name.replace(".log", "") + ".log"


def rotator(source: str, dest: str) -> None:
    """Funkcja kompresująca rotowane pliki logów"""
    with open(source, 'rb') as f_in:
        with gzip.open(f"{dest}.gz", 'wb') as f_out:
            shutil.copyfileobj(f_in, f_out)
    Path(source).unlink()


class JSONFormatter(logging.Formatter):
    """Formatter do strukturalnych logów w formacie JSON"""
    
    def format(self, record: logging.LogRecord) -> str:
        log_data: Dict[str, Any] = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        
        if hasattr(record, "request_id"):
            log_data["request_id"] = record.request_id
        if hasattr(record, "user_id"):
            log_data["user_id"] = record.user_id
        if hasattr(record, "endpoint"):
            log_data["endpoint"] = record.endpoint
        if hasattr(record, "method"):
            log_data["method"] = record.method
        if hasattr(record, "status_code"):
            log_data["status_code"] = record.status_code
        if hasattr(record, "duration"):
            log_data["duration_ms"] = record.duration
            
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
            
        return json.dumps(log_data, ensure_ascii=False)


class StandardFormatter(logging.Formatter):
    """Formatter do czytelnych logów w konsoli"""
    
    def format(self, record: logging.LogRecord) -> str:
        colors = {
            'DEBUG': '\033[36m',    # Cyan
            'INFO': '\033[32m',     # Green
            'WARNING': '\033[33m',  # Yellow
            'ERROR': '\033[31m',    # Red
            'CRITICAL': '\033[35m', # Magenta
        }
        reset = '\033[0m'
        
        color = colors.get(record.levelname, reset)
        record.levelname = f"{color}{record.levelname}{reset}"
        
        return super().format(record)


def setup_logging(
    log_level: str = "INFO",
    log_to_file: bool = True,
    log_to_console: bool = True,
    json_logs: bool = True
) -> None:
    """
    Konfiguruje system logowania dla całej aplikacji
    
    Args:
        log_level: Poziom logowania (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_to_file: Czy logować do pliku
        log_to_console: Czy logować do konsoli
        json_logs: Czy używać formatu JSON w plikach
    """
    
    
    logger = logging.getLogger("user_service")
    logger.setLevel(getattr(logging, log_level.upper()))
    logger.handlers.clear()
    
    
    if log_to_file:
        if json_logs:
            file_handler = TimedRotatingFileHandler(
                LOGS_DIR / "app.json.log",
                when="midnight",
                interval=1,
                backupCount=30,  # Zachowaj logi przez 30 dni
                encoding="utf-8",
                utc=True
            )
            file_handler.suffix = "%Y-%m-%d"
            file_handler.namer = namer
            file_handler.rotator = rotator
            file_handler.setFormatter(JSONFormatter())
        else:
            file_handler = TimedRotatingFileHandler(
                LOGS_DIR / "app.log",
                when="midnight",
                interval=1,
                backupCount=30,
                encoding="utf-8",
                utc=True
            )
            file_handler.suffix = "%Y-%m-%d"
            file_handler.namer = namer
            file_handler.rotator = rotator
            file_handler.setFormatter(
                logging.Formatter(
                    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
                )
            )
        file_handler.setLevel(logging.DEBUG)
        logger.addHandler(file_handler)
    
    
    if log_to_console:
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(
            StandardFormatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                datefmt='%Y-%m-%d %H:%M:%S'
            )
        )
        console_handler.setLevel(logging.INFO)
        logger.addHandler(console_handler)
    
    
    if log_to_file:
        error_handler = TimedRotatingFileHandler(
            LOGS_DIR / "error.log",
            when="midnight",
            interval=1,
            backupCount=90,  # Błędy trzymaj dłużej - 90 dni
            encoding="utf-8",
            utc=True
        )
        error_handler.suffix = "%Y-%m-%d"
        error_handler.namer = namer
        error_handler.rotator = rotator
        error_handler.setLevel(logging.ERROR)
        error_handler.setFormatter(
            logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s\n'
                'File: %(pathname)s:%(lineno)d\n'
                'Function: %(funcName)s\n'
                '%(message)s\n'
            )
        )
        logger.addHandler(error_handler)
    
    
    uvicorn_logger = logging.getLogger("uvicorn")
    uvicorn_logger.handlers = logger.handlers
    
    uvicorn_access = logging.getLogger("uvicorn.access")
    uvicorn_access.handlers = logger.handlers


def get_logger(name: str) -> logging.Logger:
    """
    Pobiera logger dla określonego modułu
    
    Args:
        name: Nazwa modułu (zazwyczaj __name__)
        
    Returns:
        Skonfigurowany logger
    """
    return logging.getLogger(f"user_service.{name}")
