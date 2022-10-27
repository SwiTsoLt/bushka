import { createAction, props } from "@ngrx/store";
import * as loginModel from "src/app/pages/authorization/login/models/login.model";
import * as registrationModel from "../../../pages/authorization/registration/models/registration.model";
import * as userModel from "../models/user.model";

export const registration = createAction(userModel.userActionEnums.registration, props<{ registrationForm: registrationModel.IRegistrationForm }>())
export const registrationSuccess = createAction(userModel.userActionEnums.registrationSuccess)
export const registrationError = createAction(userModel.userActionEnums.registrationError, props)

export const login = createAction(userModel.userActionEnums.login, props<{ loginForm: loginModel.ILoginForm }>())
export const loginSuccess = createAction(userModel.userActionEnums.loginSuccess, props<{ user: userModel.IUser }>())
export const loginError = createAction(userModel.userActionEnums.loginError)

export const logout = createAction(userModel.userActionEnums.logout)
export const logoutSuccess = createAction(userModel.userActionEnums.logoutSuccess)
export const logoutError = createAction(userModel.userActionEnums.logoutError)
export const logoutAbolition = createAction(userModel.userActionEnums.logoutAbolition)

export const setUserByJWT = createAction(userModel.userActionEnums.setUserByJWT)
export const setUserByJWTSuccess = createAction(userModel.userActionEnums.setUserByJWTSuccess, props<{ user: userModel.IUser }>())
export const setUserByJWTError = createAction(userModel.userActionEnums.setUserByJWTError)

export const clear = createAction(userModel.userActionEnums.clear)

export const toggleIdea = createAction(userModel.userActionEnums.toggleIdea, props<{ id: string }>())
export const toggleIdeaSuccess = createAction(userModel.userActionEnums.toggleIdeaSuccess, props<{ user: userModel.IUser }>())
export const toggleIdeaError = createAction(userModel.userActionEnums.toggleIdeaError)