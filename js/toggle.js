app.toggle = (function($, global){

  var toggleBtns = global.find('[data-action="toggle"]');
  if(!toggleBtns.length) return;

  var toggleSections;

  global.on('click', '[data-action="toggle"]', toggle);

  function toggle(e) {
    e.preventDefault();

    var btn, group, target, section,
        btnGroup, sectionGroup;

    btn           = $(e.target);
    if(btn.hasClass('active')) return;

    group         = btn.data('group');
    toggleTarget  = btn.data('target');

    btnGroup      = global.find('[data-action="toggle"][data-group="'+group+'"]');
    sectionGroup  = global.find('[data-toggle][data-group="'+group+'"]');

    section       = sectionGroup.filter('[data-toggle="'+ toggleTarget +'"]');

    btnGroup.removeClass('active');
    btn.addClass('active');

    sectionGroup.hide();
    section.show();

    app.actions.trigger('toggle:' + group, [toggleTarget]);
  }

  //return
  return {};

})(jQuery, jQuery(document));

// Example listening to toggle events
// (function($, global){

//   global.on('toggle:modules', function(e, link){
//     console.log(link);
//   })
// })(jQuery, jQuery(document));