import Cookies from "js-cookie";
import { isPhone } from "@/utils/common";

const state = {
  sidebar: {
    opened: Cookies.get("sidebarStatus")
      ? !!+Cookies.get("sidebarStatus")
      : true,
    withoutAnimation: false,
  },
  device: "desktop",
  size: Cookies.get("size") || "medium",
  isPhone: true,
  sateAllList: [
    {
      value: null,
      label: "全部",
    },
    {
      value: 1,
      label: "界定中",
    },
    {
      value: 2,
      label: "有效推荐",
    },
    {
      value: 3,
      label: "无效推荐",
    },
    {
      value: 4,
      label: "有效带看",
    },
    {
      value: 5,
      label: "有效到访",
    },
    {
      value: 6,
      label: "认筹",
    },
    {
      value: 7,
      label: "认购",
    },
    {
      value: 8,
      label: "成交",
    },
  ],
  sateList: [
    {
      value: null,
      label: "全部",
    },
    {
      value: 1,
      label: "界定中",
    },
    {
      value: 2,
      label: "有效推荐",
    },
    {
      value: 3,
      label: "无效推荐",
    },
    {
      value: 4,
      label: "有效带看",
    },
    {
      value: 5,
      label: "有效到访",
    },
    {
      value: 6,
      label: "认筹",
    },
    {
      value: 7,
      label: "认购",
    },
    {
      value: 8,
      label: "成交",
    },
  ],
};

const mutations = {
  TOGGLE_SIDEBAR: (state) => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      Cookies.set("sidebarStatus", 1);
    } else {
      Cookies.set("sidebarStatus", 0);
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set("sidebarStatus", 0);
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },
  SET_SIZE: (state, size) => {
    state.size = size;
    Cookies.set("size", size);
  },
  SET_ISPHONE: (state, roles) => {
    state.isPhone = roles;
  },
};

const actions = {
  toggleSideBar({ commit }) {
    commit("TOGGLE_SIDEBAR");
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit("CLOSE_SIDEBAR", withoutAnimation);
  },
  toggleDevice({ commit }, device) {
    commit("TOGGLE_DEVICE", device);
  },
  setSize({ commit }, size) {
    commit("SET_SIZE", size);
  },
  setPhone({ commit }) {
    commit("SET_ISPHONE", isPhone());
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
