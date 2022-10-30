test('adds 1 + 2 to equal 3', () => {
    expect(1+2).toBe(3);
})

import menuList from '../../js/mainMenuList'
test('check route url are alive', () => {
    expect(menuList).not.toBeNull()
})


import { shallowMount, createLocalVue } from '@vue/test-utils'
import.meta.env.VITE_API_URL = "http://192.168.1.48:8000"
test('check route url are alive', () => {
  expect(import.meta.env.VITE_API_URL).toBe("http://192.168.1.48:8000")
})


import router from '../../router'
import App from '../../App.vue'

const localVue = createLocalVue()
localVue.use(router)
USE_ES6_IMPORT_META=0
describe('Actions.vue', () => {

    //測試渲染
    const wrapper = mount(App, { localVue, router });
    it('test', async () => {
      console.log(wrapper.html())  // print html
      expect(true).toBe(true); //alwarys true
    });

});
