// components/slidingTab/index.js
// overlay.js
Component({
  /**
   * Component properties
   */
  properties: {
    items: {
      type: Array,
      value: []
    }
  },

  /**
   * Component initial data
   */
  data: {
    stateIndex: 0
  },

  /**
   * Component methods
   */
  methods: {
    setTab: function(e) {
      var myEventDetail = {
        index: e.currentTarget.dataset.tabindex,
        item: e.currentTarget.dataset.item
      }
      this.triggerEvent("onMyEvent", myEventDetail)
      this.setData({
        stateIndex: e.currentTarget.dataset.tabindex
      })
    }
  }
})