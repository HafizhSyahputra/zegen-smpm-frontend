export const regionSearchColumn = ["id", "name", "code", "description"]

export interface IRegionModel {
	id: number
	name: string
	code: string
	description?: string | null
}
