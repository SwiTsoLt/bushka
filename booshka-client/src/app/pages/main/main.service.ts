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

    public getPage(page: number): Observable<announcementModel.announcementGetPageResponse> {
        const url = announcementModel.announcementUrls.getPage(page)
        return this.http.get<announcementModel.announcementGetPageResponse>(url)
    }

    public getAnnouncementById(id: string): Observable<announcementModel.announcementGetAnnouncementByIdResponse> {
        const url = announcementModel.announcementUrls.getAnnouncementById(id)        
        return this.http.get<announcementModel.announcementGetAnnouncementByIdResponse>(url)
    }
}