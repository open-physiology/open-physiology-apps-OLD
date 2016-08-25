/**
 * Created by Natallia on 7/7/2016.
 */
import {Component, Directive, ContentChild, TemplateRef, ElementRef,
  Input, ViewChild, ViewContainerRef, ComponentResolver, ComponentFactory} from '@angular/core';
import {DynamicLoader} from "../directives/directive.dynamicLoader";

@Component({
  selector: '[node]',
  inputs: ['x', 'y'],
  template: `
    <svg:circle [attr.r]="radius" [attr.cx]="x" [attr.cy]="y" stroke="white" fill="steelblue"></svg:circle>
  `
}) export class Node{}


@Component({
  selector: 'list',
  inputs: ['items'],
  template: `<template ngFor [ngForOf]="items" [ngForTemplate]="contentTemplate"></template>`
})
export class List {
  @ContentChild(TemplateRef) contentTemplate: TemplateRef<any>;
}

@Component({
  selector: 'dynamic-list',
  inputs: ['items', 'renderer'],
  template:`
      <g *ngFor="let item of items; let i = index" dcl-wrapper [target]="target" [type]="renderer[i]" [input]="item"></g>
 `,
  directives: [DynamicLoader]
})
export class DynamicList{
  target: any;
  constructor(vc: ViewContainerRef){
    this.target = vc;
  }
}


function getListData(item: any, property: string, depth: number){//Format: [{id: 1, name: "Parent"}, {id: 2, name: "Child"},...];
  let data: any = {};
  if (!item) return data;
  if (!depth) depth = -1;
  traverse(item, property, depth, data);
  return data;

  function traverse(root: any, property: string, depth: number, data: any) {
    if (!root) return;
    if (!root[property]) return;
    if (depth == 0) return root;
    var children = root[property];
    for (let child of children){
      if (data.indexOf(child) == -1)
        data.push(child);
      traverse(child, property, depth - 1, data);
    }
  }
}

