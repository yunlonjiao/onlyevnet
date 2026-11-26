import {readJson,writeJson,removeKey} from './studio-storage.js';

export function loadPublishRecord(key){return readJson(key,{})||{}}
export function persistPublishRecord(key,record){writeJson(key,record)}
export function clearPublishRecord(key){removeKey(key)}
