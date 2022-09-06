import { HttpClient, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import axios from "axios"
import { AxiosPromise } from "axios"
import * as createAnnouncementModel from "./models/create-announcement-model";

@Injectable({
    providedIn: "root"
})
export class CreateAnnouncementService {
    constructor(
        private http: HttpClient
    ) { }

    public create(form: FormData): AxiosPromise<createAnnouncementModel.createAnnouncementServiceCreateResponse> {
        const url = createAnnouncementModel.createAnnouncementServiceUrlEnums.create

        const options = {
            url,
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data"
            },
            data: form
        }

        return axios(options)
    }
}