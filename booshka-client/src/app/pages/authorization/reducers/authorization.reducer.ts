import { createReducer, on } from "@ngrx/store"
import * as authorizationModel from "../models/authorization.model"
import * as authorizationActions from "./authorization.actions"


export const authorizationNode = "authorization"

export const initialState: {
    user: authorizationModel.IUser,
    isReady: boolean
} = {
    user: {
        gmail: "",
        firstName: "",
        lastName: "",
        phone: "",
        city: "",
        region: ""
    },
    isReady: false
}

export const authorizationReducer = createReducer(
    initialState,
    on(authorizationActions.getAndSetUserByJWT, (state, { token }) => state),
    on(authorizationActions.getAndSetUserByJWTSuccess, (state, { payload }) => ({ user: payload?.user, isReady: true })),
    on(authorizationActions.getAndSetUserByJWTError, (state) => ({ ...state, isReady: true }))
)