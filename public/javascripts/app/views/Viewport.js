app.views.Viewport = Ext.extend(Ext.Panel, {
  fullscreen: true,
  layout: 'card',
  cardSwitchAnimation: 'slide',
  initComponent: function() {
    Ext.apply(app.views, {
      contactsList: new app.views.ContactsList(),
      contactShow: new app.views.ContactShow(),
      contactEdit: new app.views.ContactEdit(),
      contactNew: new app.views.ContactNew(),
      contactCatalog: new app.views.ContactCatalog()
    });
    Ext.apply(this, {
      items: [
        app.views.contactsList,
        app.views.contactShow,
        app.views.contactEdit,
        app.views.contactNew,
        app.views.contactCatalog
      ]
    });
    app.views.Viewport.superclass.initComponent.apply(this, arguments);
  }
});

Ext.EventManager.on(window, 'orientationchange', testfunction);

function testfunction(e, t){
  var viewportWidth = Ext.Element.getViewportWidth();

  app.views.contactsList.items.items[0].setWidth(0.9 * viewportWidth);
}