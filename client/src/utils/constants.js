export const HOST = import.meta.env.VITE_SERVER_URL;
export const AUTH_ROUTES = `/api/auth`;
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/signUp`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/logIn`;
export const GET_USER_INFO = `${AUTH_ROUTES}/userInfo`;
export const UPDATE_USER_PROFILE = `${AUTH_ROUTES}/updateProfile`
export const ADD_PROFILE_IMAGE = `${AUTH_ROUTES}/addProfileImage`
export const DELETE_PROFILE_IMAGE = `${AUTH_ROUTES}/deleteProfileImage`
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`

export const CONTACT_ROUTES = "/api/contacts"
export const SEARCH_CONTACTS_ROUTES = `${CONTACT_ROUTES}/search`
export const GET_CONTACTS_FOR_DM = `${CONTACT_ROUTES}/getContactsForDM`
export const GET_ALL_CONTACTS = `${CONTACT_ROUTES}/getAllContacts`

export const MESSAGES_ROUTES = "/api/messages"
export const GET_ALL_MESSAGES_ROUTE = `${MESSAGES_ROUTES}/getMessages`
export const UPLOAD_FILE_ROUTE = `${MESSAGES_ROUTES}/upload-file`

export const CHANNEL_ROUTES = "/api/channel"
export const CREATE_CHANNEL_ROUTE = `${CHANNEL_ROUTES}/createChannel`
export const GET_USERS_CHANNEL = `${CHANNEL_ROUTES}/getUsersChannel`
export const GET_CHANNEL_MESSAGES = `${CHANNEL_ROUTES}/getChannelMessages`