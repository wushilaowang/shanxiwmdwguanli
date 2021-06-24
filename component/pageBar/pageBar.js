// component/pageBar/pageBar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    totalPage: {
      type: Number
    },
    currentPage: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handlePrevious() {
      this.triggerEvent('cmpPre')
    },
    handleNext() {
      this.triggerEvent('cmpNext')
    },
  }
})
