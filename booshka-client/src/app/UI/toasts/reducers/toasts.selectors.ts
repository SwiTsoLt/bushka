import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as toastsModel from "../models/toasts.model";
import { toastsNode } from "./toasts.reducer";


export const selectToastsFeature = createFeatureSelector<toastsModel.IToast[]>(toastsNode)

export const selectToastList = createSelector(
    selectToastsFeature,
    (state: toastsModel.IToast[]): toastsModel.IToast[] => state
)