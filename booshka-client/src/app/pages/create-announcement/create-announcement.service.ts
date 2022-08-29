import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import * as createAnnouncementModel from "./models/create-announcement-model";

@Injectable({
    providedIn: "root"
})
export class CreateAnnouncementService {
    constructor(
        private http: HttpClient
    ) { }

    public create(form: createAnnouncementModel.ICreateAnnouncementForm): Observable<createAnnouncementModel.createAnnouncementServiceCreateResponse> {
        try {
            const url = createAnnouncementModel.createAnnouncementServiceUrlEnums.create
            return this.http.post<createAnnouncementModel.createAnnouncementServiceCreateResponse>(url, form)
        } catch (e) {
            console.log(e);
            return of({
                message: createAnnouncementModel.createAnnouncementServiceCreateResponseEnums.somethingWentWrong
            })
        }
    }
}