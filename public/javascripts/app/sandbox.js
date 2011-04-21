var contact = new Ext.regModel("contact", {
    fields: ['givenName', 'familyName'],
    proxy: {
        type: 'ajax',
        url: 'contacts.xml',
        reader: {
            type: 'xml',
            record: 'contact'
        }
    }
});

var c = new contact({
    givenName: 'Mike',
    familyName: 'Hoitomt'
});

var d = null;

contact.load(1, {
    success: function(contact) {
        console.log(contact);
        console.log("Family Name: " + contact.get('familyName'));
    }
});

var g = new contact({
    givenName: 'Bill',
    familyName: 'Clinton'
});

g.save({
    success: function(result, request) {
        console.log("Success");
    },
    failure: function(result, request) {
        console.log("Exceptional Fuck Up");
        console.log("Result: " + request.responseText);
    }
});
