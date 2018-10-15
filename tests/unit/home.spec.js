import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'
import Home from '@/views/Home.vue'

describe('Home.vue', () => {
  it('renders Hello World', () => {
    const wrapper = shallowMount(Home)
    expect(wrapper.contains(HelloWorld)).toBeTruthy()
  })
})
