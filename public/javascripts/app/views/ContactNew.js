app.views.ContactNew = Ext.extend(Ext.form.FormPanel, {
  id: 'newContact',
  scroll: 'vertical',
  defaults: { labelWidth: '7em'},
  dockedItems: [
    {
      xtype: 'toolbar',
      dock: 'top',
      title: 'New Contact',
      items: [
        {
          text: 'back',
          ui: 'back',
          handler: function() {
            Ext.dispatch({
              controller: app.controllers.contacts,
              action: 'index',
              animation: {type: 'slide', direction: 'right'}
            });
          }
        }
      ]
    },
    {
      xtype: 'toolbar',
      dock: 'bottom',
      items: [
        {xtype: 'spacer'},
        {
          id: 'save',
          text: 'save',
          ui: 'confirm',
          handler: function() {
            //app.models.saveContact();
            Ext.dispatch({
              controller: app.controllers.contacts,
              action: 'create',
              animation: {type: 'slide', direction: 'right'}
            })
          }
        }
      ]
    }
  ],
  submitOnAction: false,
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
  ]
});

