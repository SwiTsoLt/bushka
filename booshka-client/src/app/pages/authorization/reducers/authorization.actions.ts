import { createAction, props } from "@ngrx/store";
import * as authorizationModel from "../models/authorization.model";

export const getAndSetUserByJWT = createAction(authorizationModel.authorizationActionEnums.getAndSetUserByJWT, props<{ token: string }>())
export const getAndSetUserByJWTSuccess = createAction(authorizationModel.authorizationActionEnums.getAndSetUserByJWTSuccess, props<{ payload: { user: authorizationModel.IUser } }>())
export const getAndSetUserByJWTError = createAction(authorizationModel.authorizationActionEnums.getAndSetUserByJWTError)

export const getAndSetUserById = createAction(authorizationModel.authorizationActionEnums.getAndSetUserById, props<{ id: string }>())
export const getAndSetUserByIdSuccess = createAction(authorizationModel.authorizationActionEnums.getAndSetUserByIdSuccess, props<{ payload: { user: authorizationModel.IUser } }>())
export const getAndSetUserByIdError = createAction(authorizationModel.authorizationActionEnums.getAndSetUserByIdError)