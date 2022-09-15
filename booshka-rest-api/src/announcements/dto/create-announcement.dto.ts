
export class CreateAnnouncementDto {
    readonly title: string
    readonly description: string
    readonly categoryId: number
    readonly price: number
    readonly imageLinkList: string[]
}