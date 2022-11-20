import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import * as authorizationModel from "./models/authorization.model";
import * as registrationModel from "./registration/models/registration.model";
import * as loginModel from "./login/models/login.model";
import { IUser } from "src/app/store/user/models/user.model";
import axios from "axios";
import * as profileModel from "../profile/models/profile.model";

@Injectable({
    providedIn: "root"
})
export class AuthorizationService {

    constructor(private http: HttpClient) { }

    public registration(form: registrationModel.IRegistrationForm): Observable<authorizationModel.AuthorizationResponseRegistration> {
        const url = authorizationModel.authorizationHttpUrlEnums.registration
        return this.http.post<authorizationModel.AuthorizationResponseRegistration>(url, form)
    }

    public login(form: loginModel.ILoginForm): Observable<authorizationModel.IAuthorizationHttpResponseLogin> {
        const url = authorizationModel.authorizationHttpUrlEnums.login
        return this.http.post<authorizationModel.IAuthorizationHttpResponseLogin>(url, form)
    }

    public getUserById(id: string) {
        const data = localStorage.getItem("booshka")
        const dataParsed = data ? JSON.parse(data) : null
        const token = dataParsed ? dataParsed?.token : null

        const url = authorizationModel.authorizationHttpUrlEnums.getUserById(id)
        return this.http.get<authorizationModel.IAuthorizationHttpResponseGetUser>(url, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
    }

    public editUserByJWT(user: profileModel.IProfileForm, fileList: FileList | null) {
        const data = localStorage.getItem("booshka")
        const dataParsed = data ? JSON.parse(data) : null
        const token = dataParsed ? dataParsed?.token : null

        const url = authorizationModel.authorizationHttpUrlEnums.editUserByJWT

        const fd = new FormData()
        fd.append("user", JSON.stringify(user))
        for (const image of fileList || []) {
            fd.append('image', image)
        }

        const options = {
            url,
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${token}`
            },
            data: fd
        }

        return axios(options)
    }

    public getUserByJWT() {
        const data = localStorage.getItem("booshka")
        const dataParsed = data ? JSON.parse(data) : null
        const token = dataParsed ? dataParsed?.token : null

        const url = authorizationModel.authorizationHttpUrlEnums.getUserByJWT
        return this.http.get<authorizationModel.IAuthorizationHttpResponseGetUser>(url, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
    }

    public toggleIdea(id: string): Observable<authorizationModel.IPutUserIdeaResponse> {
        const data = localStorage.getItem("booshka")
        const dataParsed = data ? JSON.parse(data) : null
        const token = dataParsed ? dataParsed?.token : null

        const url = authorizationModel.authorizationHttpUrlEnums.toggleIdea
        return this.http.put<authorizationModel.IPutUserIdeaResponse>(url, { id }, {
            headers: {
                authorization: `Bearer ${token}`
            }
        })
    }

    public getCityAll(): Observable<authorizationModel.ICityResponse> {
        const url = authorizationModel.authorizationHttpUrlEnums.getCityAll
        return this.http.get<authorizationModel.ICityResponse>(url)
    }
}