(function($, global){

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
  }

  //return
  return;

})(jQuery, jQuery(document));