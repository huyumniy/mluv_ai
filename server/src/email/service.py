import smtplib
from email.message import EmailMessage

from src.config import settings


def send_email(to: str,subject: str,html: str):
    message = EmailMessage()

    message["From"] = settings.email_from
    message["To"] = to
    message["Subject"] = subject

    message.set_content("Please open this email in an HTML-compatible client.")

    message.add_alternative(html,subtype="html")

    with smtplib.SMTP(
        settings.smtp_host,
        settings.smtp_port,
    ) as smtp:
        smtp.starttls()

        smtp.login(
            settings.smtp_username,
            settings.smtp_password,
        )

        smtp.send_message(message)
