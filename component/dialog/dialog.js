// component/dialog/dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showDialog: Boolean
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
    handleHidden() {
      this.triggerEvent('handleHidden', {showDialog: false}, {})
    },
    handleShow() {
      this.triggerEvent('handleShow', {showDialog: true}, {})
    },
  }
})
