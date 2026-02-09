import {jsApi} from "./main.ts"
import InitialData from "./model/nsd/InitialData.ts";
import Page from "./model/nsd/Page.ts";
import Filter from "./model/nsd/Filter.ts";
import Preferences from "./model/nsd/Preferences.ts";
import Sorter from "./model/nsd/Sorter.ts";
import Pager from "./model/nsd/Pager.ts";
import PageParams from "./model/nsd/PageParams.ts";
import SelectOptionsPage from "./model/nsd/SelectOptionsPage.ts";
import ElementDto from "./model/nsd/ElementDto.ts";


export default class ConnectorService {

    static CONTROLLER_MODULE_CODE: string = 'dictionaryViewAppController'

    async getInitialInfo(): Promise<InitialData> {
        const initUrl = "exec?params=request,response,user" +
            "&func=modules." + ConnectorService.CONTROLLER_MODULE_CODE + ".getInitialData" +
            "&value=" + jsApi.extractSubjectUuid()

        const response = await jsApi.restCallAsJson(initUrl, {method: "GET"});
        return response as InitialData;
    }

    async getPage(
        preferences: Preferences,
        filter: Filter,
        sorter: Sorter,
        pager: Pager,
        metaCode: string
    ): Promise<Page> {
        const initUrl = "exec-post?params=request,response,user" +
            "&func=modules." + ConnectorService.CONTROLLER_MODULE_CODE + ".getPage" +
            "&metaCode=" + metaCode +
            "&raw=true"

        const body: PageParams = {
            preferences: preferences,
            filter: filter,
            sorter: sorter,
            pager: pager
        }
        const response = await jsApi.restCallAsJson(initUrl, {method: "POST", body: JSON.stringify(body)});
        return response as Page;
    }

    async getFilterOptionsPage(
        metaCode: string,
        page: number,
        pageSize: number,
        folder: boolean,
        search: string | null = null
    ): Promise<SelectOptionsPage> {
        let initUrl = "exec?params=request,response,user" +
            "&func=modules." + ConnectorService.CONTROLLER_MODULE_CODE + ".getFilterOptionsPage" +
            "&metaCode=" + metaCode +
            "&page=" + page.toString() +
            "&folder=" + folder.toString() +
            "&pageSize=" + pageSize.toString()
        if (search) initUrl += "&search=" + search
        const response = await jsApi.restCallAsJson(initUrl, {method: "GET"})
        return response as SelectOptionsPage
    }

    async delete(uuid: string): Promise<void> {
        const initUrl = "exec?params=request,response,user" +
            "&func=modules." + ConnectorService.CONTROLLER_MODULE_CODE + ".delete" +
            "&uuid=" + uuid

        await jsApi.restCall(initUrl, {method: "GET"})
    }

    async get(uuid: string): Promise<ElementDto> {
        const initUrl = "exec?params=request,response,user" +
            "&func=modules." + ConnectorService.CONTROLLER_MODULE_CODE + ".get" +
            "&uuid=" + uuid

        return await jsApi.restCallAsJson(initUrl, {method: "GET"}) as ElementDto
    }

    async edit(
        uuid: string,
        title: string,
        removed: boolean,
        parent: string | null,
        color: string | null
    ): Promise<ElementDto> {
        const initUrl = "exec?params=request,response,user" +
            "&func=modules." + ConnectorService.CONTROLLER_MODULE_CODE + ".edit" +
            "&uuid=" + uuid +
            "&title=" + title +
            "&removed=" + removed +
            "&parent=" + parent +
            "&color=" + color

        return await jsApi.restCallAsJson(initUrl, {method: "GET"}) as ElementDto
    }

    async create(
        metaCode: string,
        title: string,
        code: string,
        folder: boolean,
        parent: string | null,
        color: string | null
    ): Promise<ElementDto> {
        const initUrl = "exec?params=request,response,user" +
            "&func=modules." + ConnectorService.CONTROLLER_MODULE_CODE + ".create" +
            "&metaCode=" + metaCode +
            "&title=" + title +
            "&code=" + code +
            "&folder=" + folder.toString() +
            "&parent=" + parent +
            "&color=" + color

        return await jsApi.restCallAsJson(initUrl, {method: "GET"}) as ElementDto
    }

    async getExportFile(
        metaCode : string,
        filter: Filter,
        sorter: Sorter,
        offset: number,
        limit: number
    ): Promise<Blob> {
        const url = "exec-post?params=request,response,user" +
            "&func=modules." + ConnectorService.CONTROLLER_MODULE_CODE + ".getExportFile" +
            "&metaCode=" + metaCode +
            "&raw=true"

        const body = {
            filter: filter,
            sorter: sorter,
            offset: offset,
            limit: limit
        }
        return await jsApi.restCall(url, {method: "POST", body: JSON.stringify(body), responseType: "blob"})
    }
}
