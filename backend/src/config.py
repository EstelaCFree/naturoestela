from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    database_url: str = "postgresql+asyncpg://naturoestela:naturoestela@localhost:5432/naturoestela"
    cors_origins: str = "http://localhost:5173,http://localhost:3000"
    app_env: str = "development"
    resend_api_key: str = ""
    resend_enabled: bool = False
    notification_email: str = "contacto@naturoestela.com"
    from_email: str = "no-reply@mail.naturoestela.com"
    from_name: str = "Estela Castro Naturopatía"
    admin_secret_key: str = ""
    agent_secret_key: str = ""
    media_root: str = "/app/media"
    max_upload_size_mb: int = 10

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]


settings = Settings()
