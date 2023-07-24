# Explanations for each of the controller functions

## `registerUser` Function

Steps:

1. Retrieve the `name`, `email`, `password`, and `confirmPassword` from the request body.
2. Validate and parse the user data using `validateCreateUserObject.parseAsync`.
3. Generate an avatar using the user's email.
4. Create a new user object by combining the validated user data and the generated avatar.
5. Save the user object to the database using `UserModel.create`.
6. Generate a one-time password (OTP).
7. Store the OTP in the database associated with the user's email.
8. Send an email containing the OTP to the user for registration confirmation.
9. Generate an access token for the user with the purpose set to 'confirm'.
10. Return a success response with status code 201, along with the access token and the user's ID, name, and email.

## `mailForResendOTP` Function

Steps:

1. Retrieve the user's ID from the `req.user` object.
2. Find the user in the database using the ID and exclude the `password` and `confirmPassword` fields.
3. If the user is not found, return an error response with status code 404.
4. If the user has not been confirmed yet:
   - Delete any existing OTP associated with the user's email.
   - Generate a new OTP.
   - Store the new OTP in the database associated with the user's email.
   - Send an email containing the new OTP to the user for registration confirmation.
   - Return a success response with status code 200 and a message indicating that the mail was sent successfully.
5. If the user is already confirmed, return an error response with status code 400.

## `confirmUser` Function

Steps:

1. Retrieve the user's ID from the `req.user` object and the OTP from the request body.
2. Find the user in the database using the ID and exclude the `password` and `confirmPassword` fields.
3. If the user is not found, return an error response with status code 404.
4. If the user is already confirmed, return an error response with status code 400.
5. Verify the OTP entered by the user with the stored OTP in the database associated with the user's email.
6. If the OTP is valid:
   - Set the user's `isConfirmed` flag to true.
   - Delete the stored OTP from the database.
   - Save the updated user object.
   - Return a success response with status code 200, a message indicating that the OTP was verified successfully, and the user's ID, name, email, and `isConfirmed` flag.
7. If the OTP is invalid, return an error response with status code 400.

## `loginUser` Function

Steps:

1. Retrieve the `email` and `password` from the request body.
2. Validate the email and password using `validateLoginCredentials.parse`.
3. Find the user in the database based on the email.
4. If the user is not found, return an error response with status code 404 and a message indicating incorrect credentials.
5. Compare the entered password with the user's stored password using `comparePassword` method.
6. If the passwords do not match:
   - Increment the user's `loginAttempts` count.
   - If the login attempts reach the maximum limit, generate a new OTP, hash it, and store it in the user's `OTPStore`.
   - Set the user's `isLocked` flag to true.
   - Save the updated user object.
   - Send an email to the user containing the new OTP for account unlock.
   - Return an error response with status code 400 and a message indicating that the account is locked due to multiple login attempts.
   - Otherwise, return an error response with status code 400 and a message indicating the remaining login attempts.
7. If the passwords match:
   - Generate an access token for the user.
   - Reset the user's `loginAttempts` count to 0.
   - Save the updated user object.
   - Return a success response with status code 200, the access token, and the user's ID, name, and email.

## `mailForResendUnlockOTP` Function

Steps:

1. Retrieve the `email` from the request body.
2. Find the user in the database based on the email and exclude the `password` and `confirmPassword` fields.
3. If the user is not found, return an error response with status code 404.
4. If the user is locked and has a stored OTP:
   - Generate a new OTP, hash it, and update the user's `OTPStore` field with the new OTP.
   - Save the updated user object.
   - Send an email to the user containing the new OTP for account unlock.
   - Return a success response with status code 200 and a message indicating that the mail was sent successfully.
5. If the user is not locked or does not have a stored OTP, return an error response with status code 400.

## `unlockAccount` Function

Steps:

1. Retrieve the OTP and email from the request body.
2. Find the user in the database based on the email and exclude the `password` and `confirmPassword` fields.
3. If the user is not found, return an error response with status code 404.
4. If the user is locked and has a stored OTP:
   - Compare the entered OTP with the stored OTP using `bcrypt.compare`.
   - If the OTPs match:
     - Reset the user's `OTPStore` field to null.
     - Reset the user's `loginAttempts` count to 0.
     - Set the user's `isLocked` flag to false.
     - Save the updated user object.
     - Return a success response with status code 200 and a message indicating that the account was successfully unlocked.
   - If the OTPs do not match, return an error response with status code 400.
5. If the user is not locked or does not have a stored OTP, return an error response with status code 400.

## `mailForPasswordReset` Function

Steps:

1. Retrieve the `email` from the request body.
2. Validate the email using `validateEmailAddress.parse`.
3. Find the user in the database based on the email and exclude the `password` and `confirmPassword` fields.
4. If the user is not found, return an error response with status code 404.
5. If the user is confirmed:
   - Generate an OTP.
   - Store the OTP in the database associated with the user's email.
   - Send an email to the user containing the OTP for password reset.
6. If the user is not confirmed, return an error response with status code 400.
7. Generate an access token for the user with the purpose set to 'reset'.
8. Return a success response with status code 200, the access token, and the user's ID, name, and email.

## `validateOTPForPasswordReset` Function

Steps:

1. Retrieve the user's ID from the `req.user` object and the OTP from the request body.
2. Find the user in the database based on the ID and exclude the `passwordand `confirmPassword` fields.
3. If the user is not found, return an error response with status code 404.
4. Retrieve the stored OTP from the database associated with the user's email.
5. If the entered OTP matches the stored OTP:
   - Set the user's `otpTracker` flag to true.
   - Save the updated user object.
   - Return a success response with status code 200 and a message indicating that the OTP was verified successfully.
6. If the OTP does not match, return an error response with status code 400.

## `resetUserPassword` Function

Steps:

1. Retrieve the user's ID from the `req.user` object and the new password and confirm password from the request body.
2. Validate the new password and confirm password using `validatePasswordChange.parse`.
3. If the new password and confirm password do not match, return an error response with status code 400.
4. Find the user in the database based on the ID.
5. If the user is not found, return an error response with status code 404.
6. If the user's `otpTracker` flag is not set, return an error response with status code 400.
7. Set the user's password and confirm password to the new password and confirm password respectively.
8. Reset the user's `otpTracker` flag to false.
9. Save the updated user object.
10. Return a success response with status code 200 and a message indicating that the password was reset successfully.

## `logoutUser` Function

Steps:

1. Retrieve the token from the `Authorization` header in the request.
2. Create a new `BlacklistToken` object with the token.
3. Save the `BlacklistToken` object to the database.
4. Return a success response with status code 200 and a message indicating that the logout was successful.

## `googleCallback` Function

Steps:

1. Create a payload object containing the user's ID, role, and the current timestamp.
2. Define options for the JWT token, specifying an expiration time.
3. Generate an access token using `jwt.sign` with the payload, JWT access token secret, and options.
4. Return a success response with status code 201, the access token, and the user's ID, name, and email.
