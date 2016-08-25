"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by Natallia on 7/23/2016.
 */
var core_1 = require('@angular/core');
var view_omegaTree_1 = require('./view.omegaTree');
var view_lyph_1 = require('./view.lyph');
var utils_model_1 = require('../services/utils.model');
var service_resize_1 = require('../services/service.resize');
var ResourceWidget = (function () {
    function ResourceWidget(resizeService) {
        var _this = this;
        this.resizeService = resizeService;
        this.ResourceName = utils_model_1.ResourceName;
        this.subscription = resizeService.resize$.subscribe(function (event) {
            if (event.target == "resource-widget") {
                _this.onSetPanelSize(event);
            }
        });
    }
    ResourceWidget.prototype.ngOnChanges = function (changes) {
        if (this.item && (this.item.class == utils_model_1.ResourceName.Lyph)) { }
    };
    ResourceWidget.prototype.onSetPanelSize = function (event) {
        this.resizeService.announceResize({ target: "omega-tree", size: event.size });
        this.resizeService.announceResize({ target: "lyph", size: event.size });
    };
    ResourceWidget.prototype.ngOnDestroy = function () { this.subscription.unsubscribe(); };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ResourceWidget.prototype, "item", void 0);
    ResourceWidget = __decorate([
        core_1.Component({
            selector: 'resource-widget',
            inputs: ['item'],
            template: "\n    <div class=\"panel panel-default\">\n      <div class=\"panel-heading\">Resource <strong>{{item?.id}}{{(item)? ': ' + item.name : ''}}</strong></div>\n      <omega-tree *ngIf=\"item && (item.class == ResourceName.OmegaTree)\" [item]=\"item\"></omega-tree>  \n      <lyph *ngIf=\"item && (item.class == ResourceName.Lyph)\" [item]=\"item\"></lyph>  \n    </div> \n  ",
            directives: [view_omegaTree_1.OmegaTreeWidget, view_lyph_1.LyphWidget]
        }), 
        __metadata('design:paramtypes', [service_resize_1.ResizeService])
    ], ResourceWidget);
    return ResourceWidget;
}());
exports.ResourceWidget = ResourceWidget;
//# sourceMappingURL=widget.resource.js.map