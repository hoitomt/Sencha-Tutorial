app.views.ContactShow = Ext.extend(Ext.Panel, {
  scroll: 'vertical',
  styleHtmlContent: true,
  dockedItems:[
    {
      xtype: 'toolbar',
      dock: 'top',
      items: [
        {
          id: 'back',
          text: 'back',
          ui: 'back',
          listeners: {
            'tap': function() {
              Ext.dispatch({
                controller: app.controllers.contacts,
                action: 'index',
                animation: {type: 'slide', direction: 'right'}
              });
            }
          }
        }
      ]
    },
    {
      xtype: 'toolbar',
      dock: 'bottom',
      items: [
        {
          id: 'delete',
          text: 'remove',
          ui: 'decline',
          handler: function() {
            Ext.dispatch({
              controller: app.controllers.contacts,
              action: 'destroy',
              id: this.record.getId(),
              animation: {type: 'slide', direction: 'right'}
            })
          }
        },
        {xtype: 'spacer'},
        {
          id: 'edit',
          text: 'edit',
          ui: 'confirm',
          listeners: {
            'tap': function(record) {
              Ext.dispatch({
                controller: app.controllers.contacts,
                action: 'edit',
                id: this.record.getId(),
                animation: {type: 'slide', direction: 'left'}
              });
            }
          }
        }
      ]
    }
  ],
  items: [
    {tpl: [
        '<h4>First Name</h4>',
        '<div class="field">{first_name}</div>'
    ]},
    {tpl: [
        '<h4>Last Name</h4>',
        '<div class="field">{last_name}</div>'
    ]},
    {tpl: [
        '<h4>Email</h4>',
        '<div class="field">{email}</div>'
    ]},
    {tpl: [
        '<h4>Phone</h4>',
        '<div class="field">{phone}</div>'
    ]}
  ],
  updateWithRecord: function(record) {
    Ext.each(this.items.items, function(item) {
      item.update(record.data);
    });
    var topToolbar = this.getDockedItems()[0];
    topToolbar.setTitle(record.get('first_name') + ' ' + record.get('last_name'));
    var bottomToolbar = this.getDockedItems()[1];
    bottomToolbar.getComponent('edit').record = record;
    bottomToolbar.getComponent('delete').record = record;
  }
});