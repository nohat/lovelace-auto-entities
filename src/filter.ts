import { HAState, HassObject } from "./types";

function match(pattern: any, value: any) {
  if (typeof value === "string" && typeof pattern === "string") {
    if (
      (pattern.startsWith("/") && pattern.endsWith("/")) ||
      pattern.indexOf("*") !== -1
    ) {
      if (!pattern.startsWith("/")) {
        // Convert globs to regex
        pattern = pattern.replace(/\./g, ".").replace(/\*/g, ".*");
        pattern = `/^${pattern}$/`;
      }
      let regex = new RegExp(pattern.slice(1, -1));
      return regex.test(value);
    }
  }

  if (typeof pattern === "string") {
    // Comparisons assume numerical values
    if (pattern.startsWith("<="))
      return parseFloat(value) <= parseFloat(pattern.substr(2));
    if (pattern.startsWith(">="))
      return parseFloat(value) >= parseFloat(pattern.substr(2));
    if (pattern.startsWith("<"))
      return parseFloat(value) < parseFloat(pattern.substr(1));
    if (pattern.startsWith(">"))
      return parseFloat(value) > parseFloat(pattern.substr(1));
    if (pattern.startsWith("!"))
      return parseFloat(value) != parseFloat(pattern.substr(1));
    if (pattern.startsWith("="))
      return parseFloat(value) == parseFloat(pattern.substr(1));
  }

  return pattern === value;
}

(window as any).autoEntities_cache = (window as any).autoEntities_cache ?? {};
const cache = (window as any).autoEntities_cache;
async function getAreas(hass) {
  cache.areas =
    cache.areas ?? (await hass.callWS({ type: "config/area_registry/list" }));
  return cache.areas;
}
async function getDevices(hass) {
  cache.devices =
    cache.devices ??
    (await hass.callWS({ type: "config/device_registry/list" }));
  return cache.devices;
}
async function getEntities(hass) {
  cache.entities =
    cache.entities ??
    (await hass.callWS({ type: "config/entity_registry/list" }));
  return cache.entities;
}

async function getArea(hass, area_id) {
  if (!cache.area_index) {
    const areas = await getAreas(hass);
    cache.area_index = {};
    areas.forEach((area) => {
      cache.area_index[area.area_id] = area;
    });
  }
  return cache.area_index[area_id];
}

async function getDevice(hass, device_id) {
  if (!cache.device_index) {
    const devices = await getDevices(hass);
    cache.device_index = {};
    devices.forEach((device) => {
      cache.device_index[device.id] = device;
    });
  }
  return cache.device_index[device_id];
}

async function getEntity(hass, entity_id) {
  if (!cache.entity_index) {
    const entities = await getEntities(hass);
    cache.entity_index = {};
    entities.forEach((entity) => {
      cache.entity_index[entity.entity_id] = entity;
    });
  }
  return cache.entity_index[entity_id];
}

const FILTERS: Record<
  string,
  (hass: HassObject, value: any, state: HAState) => Promise<boolean>
> = {
  options: async () => true,
  sort: async () => true,
  domain: async (hass, value, state) => {
    return match(value, state.entity_id.split(".")[0]);
  },
  entity_id: async (hass, value, state) => {
    return match(value, state.entity_id);
  },
  state: async (hass, value, state) => {
    return match(value, state.state);
  },
  name: async (hass, value, state) => {
    return match(value, state.attributes?.friendly_name);
  },
  group: async (hass, value, state) => {
    return hass.states[value]?.attributes?.entity_id?.includes(state.entity_id);
  },
  attributes: async (hass, value, state) => {
    for (const [k, v] of Object.entries(value as Record<string, any>)) {
      let attr = k.split(" ")[0]; // Remove any suffixes
      let obj = state.attributes;
      for (const step of attr.split(":")) {
        obj = obj ? obj[step] : undefined;
      }
      if (obj === undefined || !match(v, obj)) return false;
    }
    return true;
  },
  category: async (hass, value, state) => {
    const entity = await getEntity(hass, state.entity_id);
    return match(value, entity.entity_category);
  },
  not: async (hass, value, state) => {
    return !(await filter_entity(hass, value, state.entity_id));
  },
  or: async (hass, value, state) => {
    for (const v of value) {
      if (await filter_entity(hass, v, state.entity_id)) return true;
    }
    return false;
  },
  device: async (hass, value, state) => {
    const entity = await getEntity(hass, state.entity_id);
    if (!entity) return false;
    const device = await getDevice(hass, entity.device_id);
    if (!device) return false;
    return match(value, device.name_by_user) || match(value, device.name);
  },
  area: async (hass, value, state) => {
    const entity = await getEntity(hass, state.entity_id);
    if (!entity) return false;
    const entity_area = await getArea(hass, entity.area_id);
    if (entity_area) return match(value, entity_area.name);

    const device = await getDevice(hass, entity.device_id);
    if (!device) return false;
    const device_area = await getArea(hass, device.area_id);
    if (!device_area) return false;
    return match(value, device_area.name);
  },
  last_changed: async (hass, value, state) => {
    const now = new Date().getTime();
    const changed = new Date(state.last_changed).getTime();
    return match(value, (now - changed) / 60000);
  },
  last_updated: async (hass, value, state) => {
    const now = new Date().getTime();
    const updated = new Date(state.last_updated).getTime();
    return match(value, (now - updated) / 60000);
  },
  last_triggered: async (hass, value, state) => {
    if (state.attributes.last_triggered == null) return false;
    const now = new Date().getTime();
    const updated = new Date(state.attributes.last_triggered).getTime();
    return match(value, (now - updated) / 60000);
  },
};

export async function filter_entity(
  hass: HassObject,
  filter: Record<string, any>,
  entity_id: string
): Promise<boolean> {
  if (!hass.states[entity_id]) return false;
  for (let [k, v] of Object.entries(filter)) {
    k = k.trim().split(" ")[0].trim();
    if (!(await FILTERS[k]?.(hass, v, hass.states[entity_id]))) return false;
  }
  return true;
}
