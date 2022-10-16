import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import axios from "axios"
import { AxiosPromise } from "axios"
import * as createAnnouncementModel from "./models/create-announcement-model";
import { booshkaNode } from "src/app/models/app.models";

@Injectable({
    providedIn: "root"
})
export class CreateAnnouncementService {
    constructor(
        private http: HttpClient
    ) { }

    public getCategoryList(): Observable<{categoryList: createAnnouncementModel.ICategory[]}> {
        const url = createAnnouncementModel.createAnnouncementServiceUrlEnums.getCategoryList
        return this.http.get<{categoryList: createAnnouncementModel.ICategory[]}>(url)
    }

    public create(form: FormData): AxiosPromise<createAnnouncementModel.createAnnouncementServiceCreateResponse> {
        const url = createAnnouncementModel.createAnnouncementServiceUrlEnums.create
        const token = JSON.parse(localStorage.getItem(booshkaNode) || "")?.token || ""

        const options = {
            url,
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            },
            data: form
        }

        return axios(options)
    }
}