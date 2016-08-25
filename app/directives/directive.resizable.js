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
 * Created by Natallia on 7/22/2016.
 */
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var directive_draggable_1 = require("./directive.draggable");
var Resizable = (function () {
    function Resizable(_element, _renderer) {
        this._element = _element;
        this._renderer = _renderer;
        this.resize = new core_1.EventEmitter();
        this.resizeStart = new core_1.EventEmitter();
        this.resizeStop = new core_1.EventEmitter();
        this._handles = ['s', 'e', 'se'];
        this._minWidth = 0;
        this._minHeight = 0;
    }
    Object.defineProperty(Resizable.prototype, "config", {
        set: function (value) {
            this._config = value;
            this.setConfig(this._config);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Resizable.prototype, "handles", {
        get: function () {
            return this._handles;
        },
        enumerable: true,
        configurable: true
    });
    Resizable.prototype.setConfig = function (config) {
        for (var key in config) {
            var value = config[key];
            switch (key) {
                case 'model':
                    this._model = value;
                    break;
                case 'handles':
                    this._handles = value;
                    break;
                case 'minWidth':
                    this._minWidth = parseFloat(value);
                    break;
                case 'minHeight':
                    this._minHeight = parseFloat(value);
                    break;
            }
        }
    };
    Resizable.prototype._setStyle = function (styleName, styleValue) {
        if (this._model) {
            this._model[styleName] = styleValue;
        }
        else {
            this._renderer.setElementStyle(this._element.nativeElement, styleName, styleValue);
        }
    };
    Resizable.prototype.onDrag = function (dragEvent, handle) {
        if (handle.indexOf('e') != -1) {
            this._setStyle('width', Math.max(this._minWidth, this._originalWidth + dragEvent.offset.left) + 'px');
        }
        if (handle.indexOf('s') != -1) {
            this._setStyle('height', Math.max(this._minHeight, this._originalHeight + dragEvent.offset.top) + 'px');
        }
        if (handle.indexOf('w') != -1) {
            this._setStyle('left', (this._originalLeft + dragEvent.offset.left) + 'px');
            this._setStyle('width', Math.max(this._minWidth, this._originalWidth - dragEvent.offset.left) + 'px');
        }
        if (handle.indexOf('n') != -1) {
            this._setStyle('top', (this._originalTop + dragEvent.offset.top) + 'px');
            this._setStyle('height', Math.max(this._minHeight, this._originalHeight - dragEvent.offset.top) + 'px');
        }
        this.resize.emit(dragEvent);
    };
    Resizable.prototype.onDragStart = function (event) {
        this._originalWidth = this._element.nativeElement.offsetWidth;
        this._originalHeight = this._element.nativeElement.offsetHeight;
        this._originalLeft = this._element.nativeElement.offsetLeft;
        this._originalTop = this._element.nativeElement.offsetTop;
        this.resizeStart.emit(event);
    };
    Resizable.prototype.onDragStop = function (event) {
        this.resizeStop.emit(event);
    };
    Resizable = __decorate([
        core_1.Component({
            selector: '[resizable]',
            inputs: ['config:resizable'],
            outputs: ['resize', 'resizeStart', 'resizeStop'],
            template: "\n  <ng-content></ng-content>\n  <div *ngFor=\"let handle of handles\" \n    [ngClass]=\"'resize-handle resize-handle-' + handle\" draggable \n    (drag)=\"onDrag($event, handle)\" \n    (dragStart)=\"onDragStart($event)\" \n    (dragStop)=\"onDragStop($event)\"></div>\n  ",
            directives: [directive_draggable_1.Draggable, common_1.CORE_DIRECTIVES]
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
    ], Resizable);
    return Resizable;
}());
exports.Resizable = Resizable;
//# sourceMappingURL=directive.resizable.js.map