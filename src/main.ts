import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import {JsApiProxy} from "nsd_js_api_proxy";
import devConfig from "../jsApiDevConfig.ts";
import '@iframe-resizer/child'
import ConnectorService from "./connectorService.ts";

const jsApi: JsApiProxy = JsApiProxy.getInstance(devConfig)
jsApi.setMethodLogging(false)
const devMode : boolean = jsApi.isDevMode()
const connector = new ConnectorService()
const baseUrl = jsApi.urls.base()

createApp(App).use(Antd)
    .provide("jsApi", jsApi)
    .mount('#app')

export {jsApi, devMode, connector, baseUrl}
