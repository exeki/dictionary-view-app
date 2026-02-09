import CatalogType from "./CatalogType.ts";

export default interface InitialData {
    licenced: boolean
    exportFileLimit : number
    types : CatalogType[]
    isAdmin : boolean
}
