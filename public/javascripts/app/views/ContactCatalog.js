app.views.ContactCatalog = Ext.extend(Ext.Panel, {
  dockedItems: [
    {
      xtype: 'toolbar',
      dock: 'top',
      title: 'Catalog',
      items: [
        {
          text: 'Info',
          handler: function() {
            var listH = app.views.contactCatalog.items.items[1].getHeight();
            console.log("List Height: " + listH);
            var consoleH = Ext.Element.getViewportHeight();
            console.log("ViewPort Height: " + consoleH);
          }
        },
        {xtype: 'spacer'},
        {
          text: 'Return',
          handler: function(){
            Ext.dispatch({
              controller: app.controllers.contacts,
              action: 'index',
              animation: {type: 'slide', direction: 'left'}
            });
          }
        }
      ]
    }
  ],
  layout: {
    type: 'vbox',
    align: 'center',
    pack: 'center'
  },
  items: [
    {
      xtype: 'list',
      scroll: 'vertical',
      width: Ext.Element.getViewportWidth()*0.9,
      height: Ext.Element.getViewportHeight()*0.9,
      store: app.stores.remoteContacts,
      itemTpl: '{first_name} {last_name}',
      onItemDisclosure: function(record){
        app.stores.localContacts.load(function(options){
          downloadToLocal(options, record);
        });
      }
    },
    {
      height: 50 //placeholder for iPod bottom toolbar
    }
  ]
});

var downloadToLocal = function(local, record) {
  if(record == null) return;
  var id = record.data['id'];
  console.log("ID of new record: " + id);

  // Look for existing duplicate record
  var index = -1;
  for(var i = 0, ii = local.length; i < ii; i++){
    if(local[i].get('remote_id') == id) {
      index = id;
    }
  }
  if(index >= 0) {
    Ext.Msg.alert('Duplicate Record', 'The selected record is already on your device');
  } else {
    addRecordToLocal(record);
  }
}

var addRecordToLocal = function(record) {
  var id = record.data['id'];
  var params = record.data;
  params['id'] = 0; // Reset the id to prevent local collisions
  var localModel = Ext.ModelMgr.create(params, app.models.Contact);
  localModel.set('remote_id', id);
  localModel.set('synced', true);
  app.stores.localContacts.add(localModel);
  app.stores.localContacts.sync();
  Ext.Msg.show({
    title: 'Downloaded',
    msg: record.data['first_name'] + ' ' + record.data['last_name'] +
      ' has been added to your device'
  });
}

var loadstore = function() {
  app.stores.localContacts.on('load', function() {
    alert('loaded');
  });
}