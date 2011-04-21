app.views.ContactSignature = Ext.extend(Ext.Panel, {
  scroll: 'vertical',
  dockedItems: [
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
          xtype: 'button',
          text: 'Reset',
          handler: function() { Ext.getCmp('signaturePanel').plugins[0].reset()}
        },
        { xtype: 'spacer' },
        {
          xtype: 'button',
          text: 'Get Image',
          handler: function() {
            Ext.getCmp('imagePanel').el.createChild({
              tag: 'div',
              style: 'background-image: url(' +
                Ext.getCmp('signaturePanel').plugins[0].getSignatureAsImage('DATA') +
                '); width: 500px; height: 100px'
            });
            Ext.getCmp('imagePanel').doComponentLayout();
          }
        }
      ]
	  }
  ],
  items: [
    {
      xtype: 'panel',
      id: 'signaturePanel',
      plugins: [new simFla.ux.plugins.signaturePad({width: 500, height: 100})]
	  },
    {
      xtype: 'panel',
      id: 'imagePanel',
      width: 500,
      height: 100,
      layout: {type: 'vbox', align: 'stretch'}
    }
  ]
});