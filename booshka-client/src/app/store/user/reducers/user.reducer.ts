import { createReducer, on } from "@ngrx/store"
import * as userModel from "../models/user.model"
import * as userActions from "./user.actions"

export const userNode = "user"

export const initialState: {
    user: userModel.IUser,
    ready: boolean
} = {
    user: {
        _id: "",
        gmail: "",
        firstName: "",
        lastName: "",
        phone: "",
        city: "",
        region: ""
    },
    ready: true
}

export const userReducer = createReducer(
    initialState,
    on(userActions.setUserByJWT, (state) => ({ ...state, ready: false })),
    on(userActions.setUserByJWTSuccess, (state, { user }) => ({ user, ready: true })),
    on(userActions.setUserByJWTError, (state) => ({ ...state, ready: true })),

    on(userActions.registration, (state, { registrationForm }) => ({ ...state, ready: false })),
    on(userActions.registrationSuccess, (state) => ({ ...state, ready: true })),
    on(userActions.registrationError, (state) => ({ ...state, ready: true })),

    on(userActions.login, (state, { loginForm }) => ({ ...state, ready: false })),
    on(userActions.loginSuccess, (state, { user }) => ({ user, ready: true })),
    on(userActions.loginError, (state) => ({ ...state, ready: true })),

    on(userActions.logout, (state) => ({ ...state, ready: false })),
    on(userActions.logoutSuccess, (state) => ({ ...state, ready: true })),
    on(userActions.logoutError, (state) => ({ ...state, ready: true })),
    on(userActions.logoutAbolition, (state) => ({ ...state, ready: true })),

    on(userActions.clear, (state) => ({
        user: {
            _id: "",
            gmail: "",
            firstName: "",
            lastName: "",
            phone: "",
            city: "",
            region: ""
        },
        ready: true
    })),
)