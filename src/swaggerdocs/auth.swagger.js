/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication endpoints
 * 
 * /v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserRequest'
 *     responses:
 *       '201':
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterUserResponse'
 *       '400':
 *         $ref: '#/components/responses/ErrorResponse'
 *
 * /v1/auth/resend_otp:
 *   get:
 *     summary: Resend OTP for email verification
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Mail sent successfully
 *       '400':
 *         $ref: '#/components/responses/ErrorResponse'
 *       '404':
 *         $ref: '#/components/responses/ErrorResponse'
 *
 * /v1/auth/confirm:
 *   put:
 *     summary: Confirm user registration with OTP
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConfirmUserRequest'
 *     responses:
 *       '200':
 *         description: OTP verified successfully and user is confirmed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConfirmUserResponse'
 *       '400':
 *         $ref: '#/components/responses/ErrorResponse'
 *       '404':
 *         $ref: '#/components/responses/ErrorResponse'
 *
 * /v1/auth/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUserRequest'
 *     responses:
 *       '200':
 *         description: User login successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginUserResponse'
 *       '400':
 *         $ref: '#/components/responses/ErrorResponse'
 *       '404':
 *         $ref: '#/components/responses/ErrorResponse'
 *
 * /v1/auth/unlock_account:
 *   put:
 *     summary: Unlock user account
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UnlockAccountRequest'
 *     responses:
 *       '200':
 *         description: Account successfully unlocked
 *       '400':
 *         $ref: '#/components/responses/ErrorResponse'
 *       '404':
 *         $ref: '#/components/responses/ErrorResponse'
 *
 * /v1/auth/resend_otp_unlock:
 *   put:
 *     summary: Resend OTP for account unlock
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResendOTPEmailRequest'
 *     responses:
 *       '200':
 *         description: Mail sent successfully
 *       '400':
 *         $ref: '#/components/responses/ErrorResponse'
 *       '404':
 *         $ref: '#/components/responses/ErrorResponse'
 *
 * /v1/auth/forgot_password:
 *   post:
 *     summary: Send mail for password reset
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       '200':
 *         description: Mail sent successfully
 *       '400':
 *         $ref: '#/components/responses/ErrorResponse'
 *       '404':
 *         $ref: '#/components/responses/ErrorResponse'
 *
 * /v1/auth/validate_otp:
 *   put:
 *     summary: Validate OTP for password reset
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ValidateOTPRequest'
 *     responses:
 *       '200':
 *         description: OTP verified successfully
 *       '400':
 *         $ref: '#/components/responses/ErrorResponse'
 *       '404':
 *         $ref: '#/components/responses/ErrorResponse'
 *
 * /v1/auth/reset_password:
 *   put:
 *     summary: Reset user password
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       '200':
 *         description: Password reset successfully
 *       '400':
 *         $ref: '#/components/responses/ErrorResponse'
 *       '404':
 *         $ref: '#/components/responses/ErrorResponse'
 *
 * /v1/auth/logout:
 *   get:
 *     summary: Logout user
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       '200':
 *         description: Logout successful
 * 
 * components:
 *   schemas:
 *     RegisterUserRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 * 
 *     RegisterUserResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         accessToken:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/UserData'
 * 
 *     ConfirmUserRequest:
 *       type: object
 *       properties:
 *         OTP:
 *           type: string
 * 
 *     ConfirmUserResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/UserData'
 * 
 *     LoginUserRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 * 
 *     LoginUserResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         accessToken:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/UserData'
 * 
 *     UnlockAccountRequest:
 *       type: object
 *       properties:
 *         OTP:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 * 
 *     ResendOTPEmailRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 * 
 *     ForgotPasswordRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 * 
 *     ValidateOTPRequest:
 *       type: object
 *       properties:
 *         OTP:
 *           type: string
 * 
 *     ResetPasswordRequest:
 *       type: object
 *       properties:
 *         newPassword:
 *           type: string
 * 
 *     UserData:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 * 
 *   responses:
 *     ErrorResponse:
 *       description: Error response
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                  type: boolean
 *                  default: false
 *               message:
 *                  type: string
 */