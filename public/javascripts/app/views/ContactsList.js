app.views.ContactsList = Ext.extend(Ext.Panel, {
  dockedItems: [{
    xtype: 'toolbar',
    title: 'Contacts',
    items: [
      {
        text: 'catalog',
        ui: 'back',
        handler: function() {
          Ext.dispatch({
            controller: app.controllers.contacts,
            action: 'catalog',
            animation: {type: 'slide', direction: 'right'}
          });
        }
      },
      {xtype: 'spacer'},
//      {
//        text: 'signature',
//        ui: 'action',
//        handler: function() {
//          Ext.dispatch({
//            controller: app.controllers.contacts,
//            action: 'signature',
//            animation: {type: 'slide', direction: 'left'}
//          });
//        }
//      },
      {
        text: 'new',
        ui: 'confirm',
        handler: function() {
          Ext.dispatch({
            controller: app.controllers.contacts,
            action: 'newContact',
            animation: {type: 'slide', direction: 'left'}
          });
        }
      }
    ]
  },
  {
    xtype: 'toolbar',
    dock: 'bottom',
    items: [
      {
        text: 'sync',
        ui: 'confirm',
        handler: function() {
          app.models.synchronizeLocalToRemote();
        }
      }
    ]
  }],
  layout: {
    type: 'vbox',
    align: 'center',
    pack: 'center'
  },
  items: [{
    xtype: 'list',
    id: 'contactslist',
    scroll: 'vertical',
    width: Ext.Element.getViewportWidth()*0.9,
    store: app.stores.localContacts,
    style: {
      background: '#ffffff'
    },
    itemTpl: new Ext.XTemplate(
      '<tpl for=".">',
        '<tpl if="!synced">',
          '<div class="item-syncme">',
        '</tpl>',
        '<tpl if="synced">',
          '<div>',
        '</tpl>',
        '{first_name} {last_name}',
        '</div>',
      '</tpl>'
    ),
    onItemDisclosure: function(record){
      Ext.dispatch({
        controller: app.controllers.contacts,
        action: 'show',
        id: record.getId(),
        animation: {type: 'slide', direction: 'left'}
      });
    },
    onItemTap: function(item) {
      record = this.getRecord(item);
      Ext.dispatch({
        controller: app.controllers.contacts,
        action: 'show',
        id: record.getId(),
        animation: {type: 'slide', direction: 'left'}
      });
    }
  }],
  initComponent: function() {
    app.stores.localContacts.load();
    app.views.ContactsList.superclass.initComponent.apply(this, arguments);
  },
  listeners: {
    beforeactivate: function() {
      highlightSync();
    }
  }
});

var highlightSync = function() {
  /*
   * List structure:
   * .x-list-item
   *   .x-list-item-body
   *     .item-syncme - if an item needs to be synced
   */
  var applyClass = 'synced';
  var syncArray = Ext.query('.item-syncme');
  //var listArray = this.items.items[0].all.elements;
  var child = null;
  for(i = 0, ii = syncArray.length; i < ii; i++) {
    child = syncArray[i];
    // Get up to "x-list-item"
    var p = child.parentNode.parentNode;
    if(!p.className) {
      p.className = applyClass;
    } else {
      var currentClass = p.className;
      var newClass = currentClass + ' synced';
      p.className = newClass;
    }
  }
}