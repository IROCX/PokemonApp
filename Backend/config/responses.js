//server API response messages mapping

const responses = {
    SUCCESS: true,
    FAILED: false
}
const messages = {
    LOGIN_SUCCESS: 'Login successfully',
    USER_EXISTS: 'User already exists',
    NO_LOGIN: 'User not logged in',
    NO_USER: 'User does not exists in DB',
    USER_CREATED: 'User created successfully',
    LOGOUT_SUCCESS: 'Logged out successfully'
}

module.exports = { responses, messages }