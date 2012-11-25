describe("Crize", function() {
  beforeEach(function() {
    $('#fixture').remove();
    $('body').append('<div id="fixture">...</div>');
  });

  describe('on save callback', function(){
    it("should be called if given", function() {
      var onSaveCallback = jasmine.createSpy('saveCallback');
      $("#fixture").crize({onsave: onSaveCallback});
      $("button span:contains('Save')").click();
      expect(onSaveCallback).toHaveBeenCalled();
    });

    it("should not throw error called if not given", function() {
      $("#fixture").crize();
      expect(function(){
        $("button span:contains('Save')").click();
      }).not.toThrow();
    });
  });
});
