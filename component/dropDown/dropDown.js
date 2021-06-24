// component/dropDown/dropDown.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    listArr: Array
  },

  lifetimes: {
    ready(){
      console.log(this.properties.listArr)
    },
    attached() {
      console.log(1)
      console.log(this.properties.listArr)
      this.setData({
        arr: this.properties.listArr
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    arr: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleFatherClick(e) {
      console.log(e.currentTarget.dataset.item)
      let a = this.properties.listArr
      for(let i = 0; i< a.length; i++) {
        //点根
        if(e.currentTarget.dataset.item == a[i].assess.name) {
          a[i].spread = !a[i].spread
          break;
        }
        if(a[i].children.length > 0) {
          for(let j = 0; j< a[i].children.length; j++) {
            //点一层目录
            if(e.currentTarget.dataset.item == a[i].children[j].assess.name) {
              a[i].children[j].spread = !a[i].children[j].spread
              //没有子目录
              if(a[i].children[j].length == 0) {
                this.triggerEvent('clickAssess', a[i])
              }
              console.log(a[i].children[j])
              break;
            }
            if(a[i].children[j].children.length > 0) {
              for(let k = 0; k< a[i].children[j].children.length; k++) {
                //二层目录
                if(e.currentTarget.dataset.item == a[i].children[j].children[k].assess.name) {
                  console.log(a[i].children[j])
                  a[i].children[j].children[k].spread = !a[i].children[j].children[k].spread
                  //没有子目录
                  if(a[i].children[j].children[k].children.length == 0) {
                    console.log(a[i].children[j].children[k])
                    this.triggerEvent('clickAssess', a[i].children[j].children[k].assess)
                  }
                  break;
                }
                if(a[i].children[j].children[k].children.length > 0) {
                  for(let p = 0; p< a[i].children[j].children[k].children.length; p++) {
                    //三层目录
                    if(e.currentTarget.dataset.item == a[i].children[j].children[k].children[p].assess.name) {
                      console.log(a[i].children[j].children[k].children[p])
                      //是否展开
                      a[i].children[j].children[k].children[p].spread = !a[i].children[j].children[k].children[p].spread
                      //没有子目录
                      if(a[i].children[j].children[k].children[p].children.length == 0) {
                        console.log(a[i].children[j].children[k].children[p].assess.assessid)
                        this.triggerEvent('clickAssess', a[i].children[j].children[k].children[p].assess)
                      }
                      break;
                    }
                  }
                }
                
              }
            }
          }
        } else {
          this.triggerEvent('clickAssess', a[i].assessid)
        }
      }
      this.setData({
        arr: a
      })
    }
  }
})
