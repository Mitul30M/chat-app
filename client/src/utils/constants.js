export const HOST = import.meta.env.VITE_SERVER_URL
export const AUTH_ROUTES = `${HOST}api/auth`;
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signup`
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`
export const USER_PROFILE = `${AUTH_ROUTES}/profile`
export const USER_PROFILE_IMG = `${AUTH_ROUTES}/profile-img`
export const REFRESH_TOKEN_ROUTE = `${AUTH_ROUTES}/refresh-token`

export const CONTACTS_ROUTE = `${HOST}api/contacts`
export const SEARCH_CONTACTS = `${CONTACTS_ROUTE}/search`
export const GET_DM_CONTACTS = `${CONTACTS_ROUTE}/dm-contacts`
export const GET_ALL_CONTACTS = `${CONTACTS_ROUTE}/all-contacts`

export const MESSAGES_ROUTE = `${HOST}api/messages`
export const DM_MESSAGES = `${HOST}api/messages/dm`
export const UPLOAD_FILE = `${HOST}api/messages/upload-file`

export const CHANNELS_ROUTE = `${HOST}api/channels`