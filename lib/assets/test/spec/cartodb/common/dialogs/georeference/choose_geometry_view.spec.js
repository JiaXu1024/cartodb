var $ = require('jquery');
var cdb = require('cartodb.js');
var ChooseGeometryView = require('../../../../../../javascripts/cartodb/common/dialogs/georeference/choose_geometry_view');

describe('common/dialog/georeference/choose_geometry_view', function() {
  beforeEach(function() {
    this.fetchData = {};
    this.model = new cdb.core.Model();
    this.model.availableGeometriesFetchData = jasmine.createSpy('availableGeometriesFetchData').and.returnValue(this.fetchData);
    spyOn(cdb.admin.Geocodings.AvailableGeometries.prototype, 'fetch');

    this.view = new ChooseGeometryView({
      model: this.model
    });
    this.view.render();
  });

  it('should not have leaks', function() {
    expect(this.view).toHaveNoLeaks();
  });

  it('should render the loading screen', function() {
    expect(this.innerHTML()).toContain('Checking');
  });

  it('should fetch available geometries', function() {
    expect(cdb.admin.Geocodings.AvailableGeometries.prototype.fetch).toHaveBeenCalled();
    // with fetchdata from model
    expect(cdb.admin.Geocodings.AvailableGeometries.prototype.fetch.calls.argsFor(0)[0].data).toBe(this.fetchData);
  });

  describe('when available geometries are fetched', function() {
    beforeEach(function() {
      this.view.availableGeometries.set('available_geometries', ['point', 'polygon']);
    });

    it('should render the available geometries', function() {
      expect(this.innerHTML()).not.toContain('Checking');
      expect(this.innerHTML()).toContain('point');
      expect(this.innerHTML()).toContain('administrative region');
    });

    describe('when selected a geometry', function() {
      it('should set the selected geometry type on the model', function() {
        $(this.view.$('.OptionCard').first()).click();
        expect(this.model.get('geometryType')).toEqual('point');
        expect(this.view.$('.is-selected').length).toEqual(1);

        // test selecting the other too and that only one is selected at a time
        $(this.view.$('.OptionCard').last()).click();
        expect(this.model.get('geometryType')).toEqual('polygon');
        expect(this.view.$('.is-selected').length).toEqual(1);
      });
    });
  });

  afterEach(function() {
    this.view.clean();
  });
});