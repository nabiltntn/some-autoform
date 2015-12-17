App = {};
App.collections = {}
App.schemas = {}

App.collections.Messages = new Mongo.Collection("messages")

App.schemas.BaseSchema = new SimpleSchema({
  dateCreated : {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    },
    autoform: { type: "hidden" }
     
  },
  dateUpdated : {
    type: Date,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true,
    autoform: { type: "hidden" }
  }
  
})

App.schemas.Profile = new SimpleSchema({
  sendNotification : {
    type : Boolean
  },
  acceptOffers : {
    type : Boolean
  },
   username : {
    type : String
  }
})
App.schemas.Messages = new SimpleSchema([App.schemas.BaseSchema,{
  content : {
    type : String
  },
  arrival : {
    type : Date
  },
   note : {
    type : Number,
    max : 5 ,
    defaultValue : 1,
    optional : true
  },
  married : {
    type : Boolean,
    optional : true
  },
  profile : {
    type : App.schemas.Profile,
    optional : true
  }
}])

App.collections.Messages.attachSchema(App.schemas.Messages);


if (Meteor.isClient) {
  
   Meteor.startup(function () {
    //AutoForm.setDefaultTemplate('materialize')    
  });
  
  
  
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter() {
      return Session.get('counter');
    }
  });
  
  Template.insertBookForm.helpers({
    messages() {
      return App.collections.Messages.find({})
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}

if (Meteor.isServer) {
  
  //define some methods
  Meteor.methods({
    addNewMessage(doc) {
      check(doc,App.collections.Messages.simpleSchema())
      console.log(doc);
      App.collections.Messages.insert(doc)
    }
  })
  
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
