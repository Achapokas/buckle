(function($){

  $.fn.show = function() {
    this.removeClass('hidden');
    return this;
  }

  $.fn.hide = function() {
    this.addClass('hidden');
    return this;
  }

  $.fn.toggle = function (){
    this.hasClass('hidden') ? this.show() : this.hide();
    return this;
  }

})(jQuery);