import Procs from '@/store/instances/EffectProcessor/procs';
import Passives from '@/store/instances/EffectProcessor/passives';
import UnknownProcs from '@/store/instances/EffectProcessor/unknown-procs';
import UnknownPassives from '@/store/instances/EffectProcessor/unknown-passives';
import constants from '@/store/modules/constants';

export const isValidServer = server => ['gl', 'eu', 'jp'].includes(server);
export const createState = () => {
  return {
    numEntries: {
      gl: 0,
      eu: 0,
      jp: 0,
    },
    activeServer: 'gl',
    pageDb: {},
    isLoading: true,
    asyncFilters: {},
    cacheTimes: {
      gl: new Date('Jan 01 1969'),
      eu: new Date('Jan 01 1969'),
      jp: new Date('Jan 01 1969'),
    },
    updateTimes: {
      gl: new Date('Jan 01 1969'),
      eu: new Date('Jan 01 1969'),
      jp: new Date('Jan 01 1969'),
    },
    activeServerSymbol: Symbol('activeServer'),
    loadingMessage: '',
  };
};

export const createGetters = (multidexModuleName = 'units') => {
  return {
    getMultidexPathTo: state => (id, server = state.activeServer) => `/multidex/${multidexModuleName}/?viewId=${id}&server=${server}`,
    getById: state => id => state.pageDb[id.toString()],
  };
};

export const createMutations = () => {
  return {
    setActiveServer (state, { data = {}, server = 'gl', commitData = true, needsReload = false }) {
      if (!isValidServer(server)) {
        throw Error(`Invalid server "${server}"`);
      }
      state.activeServer = server;
      if (commitData) {
        state.pageDb = data;
        state.pageDb[state.activeServerSymbol] = server;
        state.numEntries[server] = Object.keys(data).length;
      } else if (needsReload) {
        state.pageDb[state.activeServerSymbol] = '';
      }
    },
    setLoadState (state, mode) {
      if (typeof mode !== 'object') {
        state.isLoading = !!mode;
        // clear message if done loading
        if (!mode) {
          state.loadingMessage = '';
        }
      } else {
        // console.debug(mode);
        const { loadState, message } = mode;
        state.isLoading = !!loadState;
        if (message !== undefined) {
          state.loadingMessage = message;
        }
      }
    },
    updateStatisticsForServer (state, { length = 0, server = 'gl', cacheTime = new Date(), updateTime = new Date() }) {
      if (!isValidServer(server)) {
        throw Error(`Invalid server "${server}"`);
      }
      state.numEntries[server] = length;
      state.cacheTimes[server] = cacheTime;
      state.updateTimes[server] = updateTime;
    },
    setAsyncFilter (state, { name = '', data = {} }) {
      state.asyncFilters[name] = data;
    },
    setLoadingMessage (state, message = '') {
      state.loadingMessage = message;
    },
  };
};

export const createActions = (worker, downloadWorker, dbEntryName = 'units') => {
  return {
    getMiniDb ({ state }, server = 'gl') {
      // ensure server is valid
      if (!isValidServer(server)) {
        throw Error(`Invalid server "${server}"`);
      }
      return worker.getMiniDb(server);
    },
    async getDbStatistics ({ state }, server = 'gl') {
      if (!isValidServer(server)) {
        throw Error(`Invalid server "${server}"`);
      }
      const result = await worker.getDbStats({ server });
      if (result) {
        const { cacheTime, keyLength, updateTime } = result;
        return { cacheTime, keyLength, updateTime };
      } else {
        return { keyLength: 0 };
      }
    },
    async setActiveServer ({ commit, dispatch }, server = 'gl') {
      if (!isValidServer(server)) {
        throw Error(`Invalid server "${server}"`);
      }

      commit('setLoadState', { loadState: true, message: `Changing server to ${server}` });
      commit('setActiveServer', { server, commitData: false, needsReload: true });
      commit('setLoadState', false);
    },
    async ensurePageDbSyncWithServer ({ commit, dispatch, state }) {
      if (state.pageDb[state.activeServerSymbol] !== state.activeServer) {
        commit('setLoadState', { loadState: true, message: 'Getting data for active server' });
        const data = await dispatch('getMiniDb', state.activeServer);
        commit('setActiveServer', { server: state.activeServer, data });
        commit('setLoadState', false);
      }
    },
    async fetchUpdateTimes ({ commit, state }) {
      const url = `${location.origin}${location.pathname}static/bf-data/update-stats.json`;
      const data = await downloadWorker.postMessage('getJson', [url]);
      console.debug('update data', data);
      if (data[dbEntryName]) {
        Object.keys(data[dbEntryName]).forEach(server => {
          data[dbEntryName][server] = new Date(data[dbEntryName][server]);
        });
        return data[dbEntryName];
      }
      return {};
    },
    async saveData ({ commit, dispatch, state }, { data = {}, server = 'gl', cacheTime = new Date() }) {
      const updateTimes = await dispatch('fetchUpdateTimes');
      const updateTime = updateTimes[server] || cacheTime;
      if (updateTime === cacheTime) {
        console.warn(`[${dbEntryName}]: using cacheTime as updateTime`);
      }
      await worker.put({
        server,
        data,
        cacheTime,
        updateTime,
      });
      commit('updateStatisticsForServer', { server, cacheTime, updateTime, length: Object.keys(data).length });
      if (server === state.activeServer) {
        const currentLoadState = state.isLoading;
        const currentMessage = state.loadingMessage;
        // update store with new data
        await dispatch('setActiveServer', server);
        if (currentLoadState) {
          commit('setLoadState', { loadState: currentLoadState, message: currentMessage });
        }
      }
    },
    async init ({ commit, dispatch }) {
      const servers = ['gl', 'eu', 'jp'];
      commit('setLoadState', true);

      for (const server of servers) {
        commit('setLoadingMessage', `Loading stored statistics for ${server.toUpperCase()} server`);
        try {
          const currentData = await dispatch('getDbStatistics', server);
          await commit('updateStatisticsForServer', { server, cacheTime: currentData.cacheTime, length: currentData.keyLength, updateTime: currentData.updateTime });
        } catch (err) {
          console.error(err);
        }
      }

      commit('setLoadState', false);
    },
    async updateData ({ commit, dispatch }, servers = []) {
      throw Error('Need to implement per module');
    },
    async deleteData ({ commit, dispatch }, servers = []) {
      commit('setLoadState', true);
      for (const server of servers) {
        commit('setLoadingMessage', `Deleting stored data for ${server.toUpperCase()} server`);
        await dispatch('saveData', { data: {}, server });
      }
      commit('setLoadState', false);
    },
    getById ({ dispatch, state }, id) {
      if (!state.pageDb.hasOwnProperty(id)) {
        return undefined;
      }

      return worker.getById(state.activeServer, id);
    },
  };
};

const getSortVal = (item = '') => {
  // sort by number or the number from reverse order of concatenated char codes
  return !isNaN(item) ? +item : +Array.from(item).map(a => a.charCodeAt().toString()).reverse().join('');
};

const formattedUnknownProcs = Object.keys(UnknownProcs).sort((a, b) => getSortVal(a) - getSortVal(b)).map(id => ({ value: id, text: `[${id}] ${UnknownProcs[id].desc}`, data: UnknownProcs[id] }));
const formattedProcs = Object.keys(Procs).filter(id => !UnknownProcs[id]).sort((a, b) => getSortVal(a) - getSortVal(b)).map(id => ({ value: id, text: `[${id}] ${Procs[id].desc}`, data: Procs[id] }));

const formattedUnknownPassives = Object.keys(UnknownPassives).sort((a, b) => getSortVal(a) - getSortVal(b)).map(id => ({ value: id, text: `[${id}] ${UnknownPassives[id].desc}`, data: UnknownPassives[id] }));
const formattedPassives = Object.keys(Passives).filter(id => !UnknownPassives[id]).sort((a, b) => getSortVal(a) - getSortVal(b)).map(id => ({ value: id, text: `[${id}] ${Passives[id].desc}`, data: Passives[id] }));
export const knownConstants = {
  ...constants,
  procs: formattedProcs.concat(formattedUnknownProcs).sort((a, b) => getSortVal(a.value) - getSortVal(b.value)),
  passives: formattedPassives.concat(formattedUnknownPassives).sort((a, b) => getSortVal(a.value) - getSortVal(b.value)),
};

const commonFunctions = {
  createActions,
  createMutations,
  createState,
  isValidServer,
};

export default commonFunctions;
