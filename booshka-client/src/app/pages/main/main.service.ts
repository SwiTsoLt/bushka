import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import * as announcementModel from "./models/main.model"


@Injectable({
    providedIn: 'root'
})
export class MainService {
    constructor(
        private http: HttpClient
    ) {}

    public getAll(): Observable<announcementModel.announcementGetAllResponse> {
        const url = announcementModel.announcementUrlsEnum.getAll
        return this.http.get<announcementModel.announcementGetAllResponse>(url)
    }
}