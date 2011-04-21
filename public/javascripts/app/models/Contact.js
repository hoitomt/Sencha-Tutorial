app.models.Contact = new Ext.regModel('app.models.Contact', {
  fields: [
    {name: 'id', type: 'int'},
    {name: 'remote_id', type: 'int'},
    {name: 'synced', type: 'boolean'},
    {name: 'first_name', type: 'string'},
    {name: 'last_name', type: 'string'},
    {name: 'email', type: 'string'},
    {name: 'phone', type: 'string'}
  ],
  validations: [
    {type: 'presence', field: 'first_name'},
    {type: 'presence', field: 'last_name'}
  ],
  proxy: {
    type: 'ajax',
    url: 'contacts.xml',
    reader: {
      type: 'xml',
      record: 'contact'
    },
    writer: {
      type: 'xml',
      record: 'contact'
    }
  }
});

app.stores.localContacts = new Ext.data.Store({
  id: 'localContacts',
  model: 'app.models.Contact',
  proxy: {
    type: 'localstorage',
    id: 'contacts'
  }
});

app.stores.remoteContacts = new Ext.data.Store({
  id: 'remoteContacts',
  model: 'app.models.Contact',
  proxy: {
    type: 'ajax',
    url: 'contacts.xml',
    reader: {
      type: 'xml',
      root: 'contacts',
      record: 'contact'
    },
    writer: {
      type: 'xml',
      record: 'contact'
    }
  }
});

app.models.save = function() {
  var form = app.views.contactNew
  var params = form.getValues();
  var newcontact = Ext.ModelMgr.create(params, app.models.Contact);
  var errors = newcontact.validate();
  if (errors.isValid()) {
    app.stores.localContacts.add(newcontact);
    app.stores.localContacts.sync();
    form.reset();
    return true;
  } else {
    var errorMsg = '';
    errors.each(function(e) {
      errorMsg = errorMsg + fieldHumanize(e.field) + ' ' + e.message + "<br />";
      errorMsg = errorMsg ;
    });
    Ext.Msg.show({
      title: 'Error',
      msg: errorMsg,
      buttons: Ext.MessageBox.OK,
      fn: function() {
        return false;
      }
    });
  }
}

app.models.update = function(id) {
  var contact = app.stores.localContacts.getById(id);
  if(contact) {
    var form = app.views.contactEdit
    var params = form.getValues();
    for(var field in params) {
      console.log("field: " + field + ' | value: ' + params[field]);
      contact.set(field, params[field]);
    }
    var errors = contact.validate();
    if(errors.isValid()) {
      contact.set('synced', false);
      app.stores.localContacts.sync()
      Ext.Msg.alert('Updated', 'The contact has been updated');
      return true;
    } else {
      var errorMsg = '';
      errors.each(function(e) {
        errorMsg = errorMsg + fieldHumanize(e.field) + ' ' + e.message + "<br />";
        errorMsg = errorMsg ;
      });
      Ext.Msg.alert('Error', errorMsg);
      return false;
    }
  } else {
    return false;
  }
}

app.models.destroy = function(id) {
  var contact = app.stores.localContacts.getById(id);
  if(contact) {
    app.stores.localContacts.remove(contact);
    app.stores.localContacts.sync();
    return true;
  } else {
    return false;
  }
}


app.models.synchronizeLocalToRemote = function () {
  if(!navigator.onLine) {
    Ext.Msg.alert('Offline', 'You need to be online to sync to the web server');
    return;
  }
  console.log('Start Sync');
  var localStore = app.stores.localContacts.load();
  var syncArray = getDataToSync(localStore);
  var count = syncArray.length;
  if(count == 0) {
    Ext.Msg.show({
      title: 'Synced',
      msg: 'All contacts are synced'
    });
    return;
  }
  var syncInfo = "";
  console.log("Number of items to sync: " + count);

  // Show the syncing spinner
  var mask = new Ext.LoadMask(Ext.getBody(), {msg: "Synchronizing"});
  mask.show();

  // Sync items to remote
  for(var i = 0; i < count; i++) {
    console.log("Index: " + i);
    form = syncArray[i];
    var syncModel = Ext.ModelMgr.create(form.data, app.models.Contact);
    // Calling save on the model calls the remote proxy
    syncModel.save({
      success: function(result, request) {
        var id = result.data['id']
        console.log("Result ID: " + id);
        console.log("Success");
        form.set('remote_id', id);
        form.set('synced', true);
        localStore.sync();
        syncInfo = 'Success: ' + form.get('first_name') + ' ' + 
          form.get('last_name') + ' has been synced<br />';
      },
      failure: function(result, request) {
        console.log("Exception");
        console.log("Result: " + request.responseText);
        syncInfo = 'Failed: ' + form.get('first_name') + ' ' + 
          form.get('last_name') + ' has been synced<br />';
      },
      callback: function(result, request) {
        console.log(syncInfo);
        if(i >= count - 1) {
          mask.hide();
          Ext.Msg.show({
            title: 'Complete',
            msg: syncInfo
          });
        }
      }
    }); 
  }
}

var getDataToSync = function(store) {
  var syncArray = new Array();
  store.each( function(form, index) {
    var isSynced = form.get('synced');
    if (!isSynced) {
      syncArray.push(form);
    }
  });
  return syncArray
}