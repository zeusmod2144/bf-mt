import PromiseWorkerExchangeClient from '@/modules/PromiseWorkerExchange/client';
import DbInterface from '../interface';
import { getCacheBustingUrlParam } from '@/modules/utils';
import { Logger } from '@/modules/Logger';

// eslint-disable-next-line no-unused-vars
const logger = new Logger({ prefix: '[DB-WORKER/client]' });
export default class ClientApi extends DbInterface {
  constructor (exchangeWorker = new PromiseWorkerExchangeClient()) {
    super();
    this._worker = exchangeWorker;
  }

  get exchangeWorker () {
    return this._worker;
  }

  registerCommand (methodName, callback) {
    this._worker.registerCommand(methodName, callback);
  }

  unregisterCommand (methodName) {
    this._worker.unregisterCommand(methodName);
  }

  // add request to queue
  request (method, data) {
    logger.debug('starting request for', { method, data });
    return this._worker.request(method, data);
  }

  put (table = '', entry) {
    return this.request('put', { table, entry });
  }

  get (table = '', query) {
    return this.request('get', { table, query });
  }

  delete (table = '', key) {
    return this.request('delete', { table, key });
  }

  getAll (table = '') {
    return this.request('getAll', { table });
  }

  getFieldInEntry (table = '', query, field = '') {
    return this.request('getFieldInEntry', { table, query, field });
  }
  
  getFieldKeys (table = '', query, field = '') {
    return this.request('getFieldKeys', { table, query, field });
  }

  getByIds ({ table = '', query, field, ids = [], extractedFields = [] }) {
    return this.request('getByIds', { table, query, field, ids, extractedFields });
  }

  getById ({ table = '', query, field, id }) {
    return this.request('getById', { table, query, field, id });
  }

  getDbStats (table = '', query) {
    return this.request('getDbStats', { table, query });
  }
}

export class ClientTableApi extends ClientApi {
  constructor (exchangeWorker = new PromiseWorkerExchangeClient(), tableName = '') {
    super(exchangeWorker);
    this._table = tableName;
  }

  put (entry) {
    return super.put(this._table, entry);
  }

  get (query) {
    return super.get(this._table, query);
  }

  delete (key) {
    return super.delete(this._table, key);
  }

  getAll () {
    return super.getAll(this._table);
  }

  getFieldInEntry (query, field = '') {
    return super.getFieldInEntry(this._table, query, field);
  }

  getFieldKeys (query, field = '') {
    return super.getFieldKeys(this._table, query, field);
  }

  getByIds ({ query, field, ids = [], extractedFields = [] }) {
    return super.getByIds({
      table: this._table,
      query,
      field,
      ids,
      extractedFields,
    });
  }

  getById ({ query, field, id }) {
    return super.getById({
      table: this._table,
      query,
      field,
      id,
    });
  }

  getDbStats (query) {
    return super.getDbStats(this._table, query);
  }
}

let modulePresenceCache = {};
export class ClientMultidexApi extends ClientTableApi {
  async put (entry) {
    const result = await super.put(entry);
    modulePresenceCache = {};
    return result;
  }

  getByIds ({ server, ids = [], extractedFields = [] }) {
    return super.getByIds({
      query: { server },
      field: 'data',
      ids,
      extractedFields,
    });
  }

  getById ({ server, id }) {
    return super.getById({
      query: { server },
      field: 'data',
      id,
    });
  }

  async getTablesWithEntries (tables = [], server = 'gl') {
    const nonCachedTables = tables.filter(table => !modulePresenceCache.hasOwnProperty(`${server}:${table}`));

    if (nonCachedTables.length > 0) {
      const results = await this.request('getTablesWithEntries', { tables: nonCachedTables, server });
      nonCachedTables.forEach(table => {
        modulePresenceCache[`${server}:${table}`] = results.includes(table);
      });
    }

    return tables.filter(table => modulePresenceCache[`${server}:${table}`]);
  }

  getTablesWithUpdates ({
    tables = [],
    server = 'gl',
    sourceUrl = `${location.origin}${location.pathname}static/bf-data/update-stats.json?${getCacheBustingUrlParam()}`,
    forceRefresh = false,
  }) {
    return this.request('getTablesWithUpdates', {
      tables,
      server,
      sourceUrl,
      forceRefresh,
    });
  }

  getDbStats (server) {
    return super.getDbStats({ server });
  }

  getFilteredDb ({ filters, server = 'gl', extractedFields, sortOptions }) {
    return this.request('getFilteredDb', {
      table: this._table,
      filters,
      server,
      extractedFields,
      sortOptions,
    });
  }

  getSortedKeys ({ sortOptions = {}, server = 'gl', keys = [] }) {
    return this.request('getSortedKeys', {
      table: this._table,
      server,
      keys,
      sortOptions,
    });
  }
}
