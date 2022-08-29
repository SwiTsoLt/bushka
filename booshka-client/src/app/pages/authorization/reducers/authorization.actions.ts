import { createAction, props } from "@ngrx/store";
import * as authorizationModel from "../models/authorization.model";

export const getAndSetUserByJWT = createAction(authorizationModel.authorizationActionEnums.getAndSetUserByJWT, props<{ token: string }>())
export const getAndSetUserByJWTSuccess = createAction(authorizationModel.authorizationActionEnums.getAndSetUserByJWTSuccess, props<{ payload: { user: authorizationModel.IUser } }>())
export const getAndSetUserByJWTError = createAction(authorizationModel.authorizationActionEnums.getAndSetUserByJWTError)