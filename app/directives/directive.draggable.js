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
var Rx_1 = require('rxjs/Rx');
var Position = (function () {
    function Position(left, top) {
        this.left = left;
        this.top = top;
    }
    return Position;
}());
exports.Position = Position;
var DragEvent = (function () {
    function DragEvent(mouseDown, mouseMove, position, offset) {
        this.mouseDown = mouseDown;
        this.mouseMove = mouseMove;
        this.position = position;
        this.offset = offset;
        this.cancelled = false;
    }
    return DragEvent;
}());
exports.DragEvent = DragEvent;
var makeInputObservable = function (node, eventName, useCapture) {
    return Rx_1.Observable.fromEventPattern(function (handler) { node.addEventListener(eventName, handler, useCapture); }, function (handler) { node.removeEventListener(eventName, handler, useCapture); });
};
var Draggable = (function () {
    function Draggable(_element, _renderer) {
        this._element = _element;
        this._renderer = _renderer;
        this.drag = new core_1.EventEmitter();
        this.dragStart = new core_1.EventEmitter();
        this.dragStop = new core_1.EventEmitter();
        this._isDragging = false;
        this._mouseDelay = 50;
        this._mouseDistance = 5;
        this._mouseDistanceMet = false;
        this._containment = null;
    }
    Object.defineProperty(Draggable.prototype, "config", {
        set: function (value) {
            this._config = value;
            this.setConfig(this._config);
        },
        enumerable: true,
        configurable: true
    });
    Draggable.prototype.setConfig = function (config) {
        for (var key in config) {
            var value = config[key];
            switch (key) {
                case 'axis':
                    this._axis = value;
                    break;
                case 'delay':
                    this._mouseDelay = parseInt(value);
                    break;
                case 'distance':
                    this._mouseDistance = parseInt(value);
                    break;
                case 'containment':
                    this._containment = value;
                    break;
                case 'model':
                    this._model = value;
                    break;
            }
        }
    };
    Draggable.prototype._generatePosition = function (event) {
        var posX = (this._axis == 'y') ? this._elementStartX : this._elementStartX + this._dragOffsetX;
        var posY = (this._axis == 'x') ? this._elementStartY : this._elementStartY + this._dragOffsetY;
        return new Position(posX, posY);
    };
    Draggable.prototype._start = function () {
        var _this = this;
        this._isDragging = false;
        this._mouseDelayMet = this._mouseDelay == 0;
        this._mouseDistanceMet = this._mouseDistance == 0;
        this._elementStartX = this._element.nativeElement.offsetLeft;
        this._elementStartY = this._element.nativeElement.offsetTop;
        if (!this._mouseDelayMet) {
            this._mouseDelayTimer = setTimeout(function () {
                _this._mouseDelayMet = true;
            }, this._mouseDelay);
        }
    };
    Draggable.prototype._update = function (mouseDownEvent, mouseMoveEvent) {
        this._dragOffsetX = mouseMoveEvent.clientX - mouseDownEvent.clientX;
        this._dragOffsetY = mouseMoveEvent.clientY - mouseDownEvent.clientY;
        this._mouseDistanceMet = Math.abs(this._dragOffsetX) > this._mouseDistance || Math.abs(this._dragOffsetY) > this._mouseDistance;
        if (!this._isDragging && this._mouseDelayMet && this._mouseDistanceMet) {
            this.dragStart.emit(event);
            this._isDragging = true;
        }
    };
    Draggable.prototype.ngOnInit = function () {
        var _this = this;
        var mouseDownObservable = Rx_1.Observable.fromEvent(this._element.nativeElement, 'mousedown').filter(function (md) { return md.which == 1; });
        var mouseMoveObservable = Rx_1.Observable.fromEvent(this._element.nativeElement.ownerDocument, 'mousemove');
        var mouseUpObservable = Rx_1.Observable.fromEvent(this._element.nativeElement.ownerDocument, 'mouseup');
        var clickObservable = makeInputObservable(this._element.nativeElement.ownerDocument, 'click', true);
        var dragObservable = mouseDownObservable.flatMap(function (mouseDownEvent) {
            mouseDownEvent.preventDefault();
            mouseDownEvent.stopPropagation();
            _this._start();
            return mouseMoveObservable
                .map(function (mouseMoveEvent) {
                _this._update(mouseDownEvent, mouseMoveEvent);
                return new DragEvent(mouseDownEvent, mouseMoveEvent, _this._generatePosition(mouseMoveEvent), new Position(_this._dragOffsetX, _this._dragOffsetY));
            })
                .filter(function () { return _this._isDragging; })
                .takeUntil(mouseUpObservable
                .map(function (mouseUpEvent) {
                clearInterval(_this._mouseDelayTimer);
                if (_this._isDragging)
                    _this.dragStop.emit(mouseUpEvent);
            })
                .zip(clickObservable.map(function (clickEvent) {
                if (_this._isDragging) {
                    clickEvent.stopPropagation();
                    _this._isDragging = false;
                }
            })));
        });
        this._dragSubscription = dragObservable.subscribe(function (event) {
            _this.drag.emit(event);
            setTimeout(function () {
                if (!event.cancelled) {
                    var top_1 = event.position.top;
                    var left = event.position.left;
                    _this._setStyle('top', top_1 + 'px');
                    _this._setStyle('left', left + 'px');
                }
            });
        });
    };
    Draggable.prototype._setStyle = function (styleName, styleValue) {
        if (this._model) {
            this._model[styleName] = styleValue;
        }
        else {
            this._renderer.setElementStyle(this._element.nativeElement, styleName, styleValue);
        }
    };
    Draggable.prototype.ngOnDestroy = function () {
        this._dragSubscription.unsubscribe();
    };
    Draggable = __decorate([
        core_1.Directive({
            selector: '[draggable]',
            inputs: ['config:draggable'],
            outputs: ['drag', 'dragStart', 'dragStop']
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer])
    ], Draggable);
    return Draggable;
}());
exports.Draggable = Draggable;
//# sourceMappingURL=directive.draggable.js.map