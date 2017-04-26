define(['mediator'], function (mediator) {

  // we just need a simple stupid object to act as our facade
  var facade = {};

  // install mediator to our facade and the window
  mediator.installTo(facade);
  mediator.installTo(window);

  return facade;
});
