app.views.ContactEdit = Ext.extend(Ext.form.FormPanel, {
  scroll: 'vertical',
  dockedItems: [{
    dock: 'top',
    xtype: 'toolbar',
    title: 'Edit',
    items: [{
        id: 'cancel',
        text: 'cancel',
        ui: 'back',
        handler: function(){
          Ext.dispatch({
            controller: app.controllers.contacts,
            action: 'show',
            animation: {type: 'slide', direction: 'right'},
            id: this.record.getId()
          });
        }
    }]
  },
  {
    dock: 'bottom',
    xtype: 'toolbar',
    items: [{xtype: 'spacer'},
      {
        id: 'save',
        text: 'save',
        ui: 'confirm',
        handler: function(record){
          Ext.dispatch({
            controller: app.controllers.contacts,
            action: 'update',
            animation: {type: 'slide', direction: 'right' },
            id: this.record.getId()
          });
        }
      }
    ]
  }],
  submitOnAction: false,
  defaults: { labelWidth: '7em'},
  items: [
    {
      xtype: 'textfield',
      name: 'first_name',
      label: 'First Name'
    },
    {
      xtype: 'textfield',
      name: 'last_name',
      label: 'Last Name'
    },
    {
      xtype: 'textfield',
      name: 'email',
      label: 'Email'
    },
    {
      xtype: 'textfield',
      name: 'phone',
      label: 'Phone'
    }
  ],
  updateWithRecord: function(record) {
    this.load(record);
    var topToolbar = this.getDockedItems()[0];
    topToolbar.getComponent('cancel').record = record;

    var bottomToolbar = this.getDockedItems()[1];
    bottomToolbar.getComponent('save').record = record;
    bottomToolbar.getComponent('save').form = this;
  }

});