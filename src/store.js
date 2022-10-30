import { createStore } from 'vuex'
const store = createStore({
  state: {
      user: null,
  },
  getters: {
    user: state => state.user,
  },
  mutations: {
    // ユーザー情報保存
    setUser(state, user) {
      state.user = user
    }
  }
});

export default store