export interface IUser {
    _id: string,
    gmail: string,
    firstName: string,
    lastName: string,
    phone: string,
    city: string,
    announcementIdList: string[],
    ideas: string[],
    region: string
}

export enum userActionEnums {
    login = "[User Component] Login",
    loginSuccess = "[User Component] Login Success",
    loginError = "[User Component] Login Error",

    logout = "[User Component] Logout",
    logoutSuccess = "[User Component] Logout Success",
    logoutError = "[User Component] Logout Error",
    logoutAbolition = "[User Component] Logout Abolition",

    registration = "[User Component] Registration",
    registrationSuccess = "[User Component] Registration Success",
    registrationError = "[User Component] Registration Error",

    setUserByJWT = "[User Component] Set User By JWT",
    setUserByJWTSuccess = "[User Component] Set User By JWT Success",
    setUserByJWTError = "[User Component] Set User By JWT Error",

    setUserById = "[User Component] Set User By Id",
    setUserByIdSuccess = "[User Component] Set User By Id Success",
    setUserByIdError = "[User Component] Set User By Id Error",
    
    clear = "[User Component] Clearr",
    
    toggleIdea = "[Cache Component] Toggle Idea",
    toggleIdeaSuccess = "[Cache Component] Toggle Idea Success",
    toggleIdeaError = "[Cache Component] Toggle Idea Error",
}