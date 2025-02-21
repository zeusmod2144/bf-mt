import logger from '@/modules/Logger';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { mapActions, mapMutations } from 'vuex';
import { servers } from '@/modules/constants';
import { multidexModuleInfo } from '@/modules/constants';
import numbro from 'numbro';
dayjs.extend(relativeTime);

export function delay (time = 0) {
  return new Promise(fulfill => {
    setTimeout(fulfill, time);
  });
}

export async function safelyExecute (fn, onError) {
  try {
    return await fn();
  } catch (err) {
    onError(err);
  }
}

export function getFormattedDate (inputDate) {
  const date = dayjs(inputDate);
  return {
    full: date.toDate().toLocaleString(),
    time: date.toDate().toLocaleTimeString(),
    date: date.toDate().toLocaleDateString(),
    diff: date.fromNow(),
  };
}

export function arraysAreDifferent (arr1 = [], arr2 = []) {
  return arr1.length !== arr2.length ||
    arr1.some(val => !arr2.includes(val)) ||
    arr2.some(val => !arr1.includes(val));
}

export function getGenderInfo (gender) {
  const icons = {
    male: 'fa-mars',
    female: 'fa-venus',
    other: 'fa-genderless',
  };
  const colors = {
    male: 'light-blue',
    female: 'pink lighten-1',
    other: 'grey',
  };
  return {
    icon: icons[gender],
    color: colors[gender],
  };
}

// add an extra "useless" param to be added to a URL that forces a new GET from the server
export function getCacheBustingUrlParam () {
  return `cacheBuster=${new Date().valueOf()}`;
}

export function safeGet (obj = {}, path = [], defaultVal = undefined) {
  let result = obj;
  const accessorPath = path.slice();
  try {
    while (accessorPath.length > 0) {
      const currentProp = accessorPath.shift();
      result = result[currentProp];
    }
    return result;
  } catch (err) {
    logger.error('error accessing prop', { obj, path, defaultVal }, err);
    return defaultVal;
  }
}

export const _stateInfoHelper = {
  hasUpdates (moduleStateInfo, server, moduleName, updateTimes) {
    // logger.debug(moduleStateInfo.updateTimes, server, moduleName, updateTimes);
    return !!(
      moduleStateInfo.updateTimes && updateTimes[moduleName] &&
      moduleStateInfo.updateTimes[server] && updateTimes[moduleName][server] &&
      (moduleStateInfo.numEntries[server] === 0 || new Date(updateTimes[moduleName][server]) > new Date(moduleStateInfo.updateTimes[server]))
    );
  },
  generateHasUpdatesEntry (moduleStateInfo, moduleName, updateTimes) {
    const entry = {};
    servers.forEach(server => {
      entry[server] = this.hasUpdates(moduleStateInfo, server, moduleName, updateTimes)
        ? updateTimes[moduleName][server]
        : false;
    });
    return entry;
  },
  generateOtherServersEntry (moduleStateInfo, activeServer) {
    const currentModuleEntryCounts = moduleStateInfo.numEntries;
    // check if any other server has non-zero entries
    return servers.filter(s => s !== activeServer && currentModuleEntryCounts[s] !== undefined && currentModuleEntryCounts[s] > 0);
  },
};

export function generateStateInfo (context, multidexModules = multidexModuleInfo.slice()) {
  const stateInfo = {};
  if (context) {
    multidexModules.forEach(({ name }) => {
      const moduleState = context.$store.state[name];
      stateInfo[name] = {
        data: moduleState.pageDb,
        numEntries: moduleState.numEntries,
        isLoading: moduleState.isLoading,
        cacheTimes: moduleState.cacheTimes,
        updateTimes: moduleState.updateTimes,
        loadingMessage: moduleState.loadingMessage,
        filterUrl: moduleState.filterUrl,
        sortOptions: moduleState.sortOptions,
      };
      stateInfo[name].hasUpdates = _stateInfoHelper.generateHasUpdatesEntry(stateInfo[name], name, context.updateTimes);
      stateInfo[name].otherServers = _stateInfoHelper.generateOtherServersEntry(stateInfo[name], context.activeServer);
    });
  }

  return stateInfo;
}

export function generateActionInfo (context, multidexModules = multidexModuleInfo.slice()) {
  const actionInfo = {};
  if (context) {
    const getActionForModule = (moduleName, methodName) => {
      let result = { ...mapActions.call(context, moduleName, [methodName]) };
      result = Object.values(result)[0];
      if (typeof result === 'function') {
        result = result.bind(context);
      }
      return result;
    };

    const getMutationForModule = (moduleName, methodName) => {
      let result = { ...mapMutations.call(context, moduleName, [methodName]) };
      result = Object.values(result)[0];
      if (typeof result === 'function') {
        result = result.bind(context);
      }
      return result;
    };

    multidexModules.forEach(({ name }) => {
      actionInfo[name] = {
        update: getActionForModule(name, 'updateData'),
        delete: getActionForModule(name, 'deleteData'),
        filter: (filters, sorts) => {
          const filterFn = getActionForModule(name, 'getFilteredKeys');
          return filterFn({ filters, sorts });
        },
        sort: getActionForModule(name, 'getSortedKeys'),
        dbSync: getActionForModule(name, 'ensurePageDbSyncWithServer'),
        updateFilterUrl: getMutationForModule(name, 'setFilterUrl'),
        updateSortOptions: getMutationForModule(name, 'setSortOptions'),
      };
    });
  }
  return actionInfo;
}

export function formatNumber (number) {
  return +number < 1000 ? +number : numbro(+number).format({ average: true, mantissa: 1 });
}

export function ensureContentPadding (minTopOffset = 0, minBottomOffset = 0) {
  // ensure that there is padding for top of content
  const contentElem = document.querySelector('#app > .application--wrap > main.v-content');
  const toolbarElem = document.querySelector('#app > .application--wrap > nav.v-toolbar');
  const targetOffset = Math.max(toolbarElem.offsetHeight, minTopOffset);
  if (+contentElem.style.paddingTop.slice(0, -2) < targetOffset) {
    contentElem.style.paddingTop = `${targetOffset}px`;
  }

  if (+contentElem.style.paddingBottom.slice(0, -2) < minBottomOffset) {
    contentElem.style.paddingBottom = `${minBottomOffset}px`;
  }
}

export function weightedStringSort (a, b, { beginning = [], end = [] } = {}) {
  const [aBeginningIndex, bBeginningIndex] = [beginning.indexOf(a), beginning.indexOf(b)];
  const [aEndIndex, bEndIndex] = [end.indexOf(a), end.indexOf(b)];
  if (aBeginningIndex > -1 && bBeginningIndex > -1) { // both in beginning array
    return aBeginningIndex - bBeginningIndex;
  } else if (aEndIndex > -1 && bEndIndex > -1) { // both in end array
    return aEndIndex - bEndIndex;
  } else if (
    aBeginningIndex > -1 && bBeginningIndex === -1 ||
    aEndIndex === -1 && bEndIndex > -1
  ) { // a is currently before b
    return -1;
  } else if (
    bBeginningIndex > -1 && aBeginningIndex === -1 ||
    bEndIndex === -1 && aEndIndex > -1
  ) { // b is currently before a
    return 1;
  } else { // in neither array, so do normal string compare
    return a < b ? -1 : 1;
  }
}
