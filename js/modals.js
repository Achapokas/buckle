app.modal = (function ($, modal) {
 
  if(modal.length < 1) { return {} }
  if(!modal.is(":hidden")) { modal.addClass("hidden"); }
  
  var container, body, loader;

  container = modal.find("#modal-content");
  body      = container.find("#modal-body");
  loader    = modal.find(".loader");

  // Events

  $(document)
    .on('click', 'a[data-action=modal]', registerModalTrigger)
    .on("ajax:modal:load", loadContent);

  modal
    .on("click", "a[data-action=dismiss]", hideModal)

  function show(content) {
    if(content) { body.html(content) }
    modal.add(container)
      .removeClass("hidden");
  }

  function hide(persistBody) {
    modal.add(container)
      .addClass("hidden");
    if(!persistBody) { body.empty(); }
  }

  function hideModal(e) { 
    e.preventDefault();
    hide(false); 
  }

  function hideLoader() {
    loader.addClass('hidden');
  }

  function registerModalTrigger(e) {
    modal.add(loader).removeClass("hidden");
  }

  function loadContent(event, content, action, actionContent) {

    if(!modal.is(":hidden")) {
      body.html(content);
      container.removeClass("hidden");
      hideLoader();
    }
    
    if (action) {
      app.actions.trigger(action, actionContent);
      //console.log(action + " triggered!");
    }
  }

  return {
    el : modal, body: body, container: container,
    show: show, hide: hide, hideLoader: hideLoader, loadContent: loadContent
  };

})(jQuery, jQuery('#modal'));