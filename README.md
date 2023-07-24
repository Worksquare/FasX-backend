# Fastx Logistics Application Backend

## Introduction

Fastx is a powerful logistics app that enables users to book and track deliveries. Leveraging AI and geolocation, Fastx optimizes routes, estimates delivery times, and provides real-time updates to users. The app ensures secure transactions and transparency through advanced technology, delivering convenient and reliable delivery services while empowering flexible and rewarding opportunities for delivery partners.

## Features of Authentication Model

- User registration and authentication with email verification.
- Resending OTP for email verification and account unlock.
- User login with secure authentication or using oauth 2.0 google.
- Unlocking user accounts with OTP.
- Resetting user passwords with OTP validation.
- Logging out users from their accounts.

## API Endpoints

### Authentication

| Endpoint                         | Description                         | Auth Required |
| -------------------------------- | ----------------------------------- | ------------- |
| `POST /v1/auth/register`         | Register a new user.                | No            |
| `GET /v1/auth/resend_otp`        | Resend OTP for email verification.  | Yes           |
| `PUT /v1/auth/confirm`           | Confirm user registration with OTP. | Yes           |
| `POST /v1/auth/login`            | User login.                         | No            |
| `PUT /v1/auth/unlock_account`    | Unlock user account.                | Yes           |
| `PUT /v1/auth/resend_otp_unlock` | Resend OTP for account unlock.      | Yes           |
| `POST /v1/auth/forgot_password`  | Send mail for password reset.       | No            |
| `PUT /v1/auth/validate_otp`      | Validate OTP for password reset.    | Yes           |
| `PUT /v1/auth/reset_password`    | Reset user password.                | Yes           |
| `GET /v1/auth/google`            | Google Auth login                   | No            |
| `GET /v1/auth/logout`            | Logout user.                        | Yes           |

## Installation and Setup

1. Clone the repository:

   ```bash
   https://github.com/Worksquare/FasX-backend
   ```

2. Navigate to the project directory:

   ```bash
   cd FasX-backend
   ```

3. Install the dependencies:

   ```bash
   yarn install
   ```

   OR

   ```bash
   npm install
   ```

4. Set up environment variables:

   - Rename the `.env.example` file to `.env`.
   - Replacing variables with their actual values
     ```bash
     MONGODB_URL = ""
     PORT=
     BASE_URL=""
     GOOGLE_OAUTH_CLIENT_ID =""
     GOOGLE_OAUTH_CLIENT_SECRET=""
     EMAIL=""
     MAIL_PASSWORD=""
     MAIL_USERNAME=""
     JWT_ACCESS_TOKEN_SECRET=""
     JWT_CONFIRM_TOKEN_SECRET=""
     JWT_RESET_PASSWORD_SECRET=""
     ```

5. Run the FasX-backend:

   ```bash
   yarn run start
   ```

   OR

   ```bash
   npm run start
   ```
