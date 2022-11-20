import * as userModel from "../../../store/user/models/user.model"
import * as mainModel from "../../main/models/main.model"

export interface IProfileStore {
    form: IProfileForm,
    user: userModel.IUser,
    announcementList: mainModel.IAnnouncement[],
    isOwner: boolean,
    isEdit: boolean
}

export interface IProfileForm {
    firstName: string,
    lastName: string,
    city: string,
    region: string,
    phone: string
}