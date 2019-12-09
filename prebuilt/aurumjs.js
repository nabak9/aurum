var t=function(){this.subscribeChannel=[],this.onAfterFire=[]},e={subscriptions:{configurable:!0}};e.subscriptions.get=function(){return this.subscribeChannel.length},t.prototype.subscribe=function(t,e){return this.createSubscription(t,this.subscribeChannel,e).facade},t.prototype.hasSubscriptions=function(){return this.subscriptions>0},t.prototype.cancelAll=function(){this.subscribeChannel.length=0},t.prototype.fireFiltered=function(t,e){this.isFiring=!0;for(var o=this.subscribeChannel.length,n=0;n<o;n++)this.subscribeChannel[n].callback!==e&&this.subscribeChannel[n].callback(t);this.isFiring=!1,this.afterFire()},t.prototype.afterFire=function(){this.onAfterFire.length>0&&(this.onAfterFire.forEach(function(t){return t()}),this.onAfterFire.length=0)},t.prototype.fire=function(t){this.isFiring=!0;for(var e=this.subscribeChannel.length,o=0;o<e;o++)this.subscribeChannel[o].callback(t);this.isFiring=!1,this.afterFire()},t.prototype.createSubscription=function(t,e,o){var n=this,r={callback:t},i={cancel:function(){n.cancel(r,e)}};return void 0!==o&&o.addCancelable(function(){return n.cancel(r,e)}),e.push(r),{subscription:r,facade:i}},t.prototype.cancel=function(t,e){var o=this,n=e.indexOf(t);n>=0&&(this.isFiring?this.onAfterFire.push(function(){return o.cancel(t,e)}):e.splice(n,1))},Object.defineProperties(t.prototype,e);var o=function(e){this.value=e,this.updateEvent=new t};o.prototype.update=function(t){if(this.updating)throw new Error("Problem in datas source: Unstable value propagation, when updating a value the stream was updated back as a direct response. This can lead to infinite loops and is therefore not allowed");this.updating=!0,this.value=t,this.updateEvent.fire(t),this.updating=!1},o.prototype.backPropagate=function(t,e){this.value=e,this.updating=!0,this.updateEvent.fireFiltered(e,t),this.updating=!1},o.prototype.listenAndRepeat=function(t,e){return t(this.value),this.listen(t,e)},o.prototype.listen=function(t,e){return this.updateEvent.subscribe(t,e).cancel},o.prototype.filter=function(t,e){var n=new o;return this.listen(function(e){t(e)&&n.update(e)},e),n},o.prototype.filterDuplex=function(t,e){var n=this,r=new o,i=function(e){t(e)&&r.backPropagate(a,e)},a=function(e){t(e)&&n.backPropagate(i,e)};return this.listen(i,e),r.listen(a,e),r},o.prototype.pipe=function(t,e){this.listen(function(e){return t.update(e)},e)},o.prototype.pipeDuplex=function(t,e){var o=this,n=function(e){return t.backPropagate(r,e)},r=function(t){return o.backPropagate(n,t)};this.listen(n,e),t.listen(r,e)},o.prototype.map=function(t,e){var n=new o(t(this.value));return this.listen(function(e){n.update(t(e))},e),n},o.prototype.mapDuplex=function(t,e,n){var r=this,i=new o(t(this.value)),a=function(e){return i.backPropagate(s,t(e))},s=function(t){return r.backPropagate(a,e(t))};return this.listen(a,n),i.listen(s,n),i},o.prototype.unique=function(t){var e=new o(this.value);return this.listen(function(t){t!==e.value&&e.update(t)},t),e},o.prototype.uniqueDuplex=function(t){var e=this,n=new o(this.value),r=function(t){t!==n.value&&n.backPropagate(i,t)},i=function(t){t!==e.value&&e.backPropagate(r,t)};return this.listen(r,t),n.listen(i,t),n},o.prototype.reduce=function(t,e,n){var r=new o(e);return this.listen(function(e){return r.update(t(r.value,e))},n),r},o.prototype.aggregate=function(t,e,n){var r=this,i=new o(e(this.value,t.value));return this.listen(function(){return i.update(e(r.value,t.value))},n),t.listen(function(){return i.update(e(r.value,t.value))},n),i},o.prototype.combine=function(t,e){var n=new o;return this.pipe(n,e),t.pipe(n,e),n},o.prototype.debounce=function(t,e){var n,r=new o;return this.listen(function(e){clearTimeout(n),n=setTimeout(function(){r.update(e)},t)},e),r},o.prototype.buffer=function(t,e){var n,r=new o,i=[];return this.listen(function(e){i.push(e),n||(n=setTimeout(function(){n=void 0,r.update(i),i=[]},t))},e),r},o.prototype.queue=function(t,e){var o=new n;return this.listen(function(t){o.push(t)},e),o},o.prototype.pick=function(t,e){var n,r=new o(null===(n=this.value)||void 0===n?void 0:n[t]);return this.listen(function(e){r.update(null!=e?e[t]:e)},e),r},o.prototype.cancelAll=function(){this.updateEvent.cancelAll()};var n=function(e){this.data=e?e.slice():[],this.updateEvent=new t},r={length:{configurable:!0}};n.prototype.listenAndRepeat=function(t,e){return t({operation:"add",operationDetailed:"append",index:0,items:this.data,newState:this.data,count:this.data.length}),this.listen(t,e)},n.prototype.listen=function(t,e){return this.updateEvent.subscribe(t,e).cancel},r.length.get=function(){return this.data.length},n.prototype.getData=function(){return this.data.slice()},n.prototype.get=function(t){return this.data[t]},n.prototype.set=function(t,e){var o=this.data[t];o!==e&&(this.data[t]=e,this.update({operation:"replace",operationDetailed:"replace",target:o,count:1,index:t,items:[e],newState:this.data}))},n.prototype.swap=function(t,e){if(t!==e){var o=this.data[t],n=this.data[e];this.data[e]=o,this.data[t]=n,this.update({operation:"swap",operationDetailed:"swap",index:t,index2:e,items:[o,n],newState:this.data})}},n.prototype.swapItems=function(t,e){if(t!==e){var o=this.data.indexOf(t),n=this.data.indexOf(e);-1!==o&&-1!==n&&(this.data[n]=t,this.data[o]=e),this.update({operation:"swap",operationDetailed:"swap",index:o,index2:n,items:[t,e],newState:this.data})}},n.prototype.appendArray=function(t){var e=this.data;this.data=new Array(e.length);var o=0;for(o=0;o<e.length;o++)this.data[o]=e[o];for(var n=0;n<t.length;n++)this.data[o+n]=t[n];this.update({operation:"add",operationDetailed:"append",count:t.length,index:this.data.length-t.length,items:t,newState:this.data})},n.prototype.push=function(){for(var t=[],e=arguments.length;e--;)t[e]=arguments[e];this.appendArray(t)},n.prototype.unshift=function(){for(var t,e=[],o=arguments.length;o--;)e[o]=arguments[o];(t=this.data).unshift.apply(t,e),this.update({operation:"add",operationDetailed:"prepend",count:e.length,items:e,index:0,newState:this.data})},n.prototype.pop=function(){var t=this.data.pop();return this.update({operation:"remove",operationDetailed:"removeRight",count:1,index:this.data.length,items:[t],newState:this.data}),t},n.prototype.merge=function(t){for(var e=0;e<t.length;e++)this.data[e]!==t[e]&&(this.length>e?this.set(e,t[e]):this.push(t[e]));this.length>t.length&&this.removeRight(this.length-t.length)},n.prototype.removeRight=function(t){var e=this.length,o=this.data.splice(e-t,t);this.update({operation:"remove",operationDetailed:"removeRight",count:t,index:e-t,items:o,newState:this.data})},n.prototype.removeLeft=function(t){var e=this.data.splice(0,t);this.update({operation:"remove",operationDetailed:"removeLeft",count:t,index:0,items:e,newState:this.data})},n.prototype.remove=function(t){var e=this.data.indexOf(t);-1!==e&&(this.data.splice(e,1),this.update({operation:"remove",operationDetailed:"remove",count:1,index:e,items:[t],newState:this.data}))},n.prototype.clear=function(){var t=this.data;this.data=[],this.update({operation:"remove",operationDetailed:"clear",count:t.length,index:0,items:t,newState:this.data})},n.prototype.shift=function(){var t=this.data.shift();return this.update({operation:"remove",operationDetailed:"removeLeft",items:[t],count:1,index:0,newState:this.data}),t},n.prototype.toArray=function(){return this.data.slice()},n.prototype.sort=function(t,e){return new i(this,t,e)},n.prototype.filter=function(t,e){return new a(this,t,e)},n.prototype.forEach=function(t,e){return this.data.forEach(t,e)},n.prototype.toDataSource=function(){var t=new o(this.data);return this.listen(function(e){t.update(e.newState)}),t},n.prototype.update=function(t){this.updateEvent.fire(t)},Object.defineProperties(n.prototype,r);var i=function(t){function e(e,o,n){var r=this,i=e.data.slice().sort(o);t.call(this,i),this.comparator=o,e.listen(function(t){var e,o;switch(t.operationDetailed){case"removeLeft":r.removeLeft(t.count);break;case"removeRight":r.removeRight(t.count);break;case"remove":r.remove(t.items[0]);break;case"clear":r.data.length=0;break;case"prepend":(e=r).unshift.apply(e,t.items),r.data.sort(r.comparator);break;case"append":(o=r).push.apply(o,t.items),r.data.sort(r.comparator);break;case"swap":break;case"replace":r.set(t.index,t.items[0]),r.data.sort(r.comparator)}},n)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(n),a=function(t){function e(e,o,n){var r=this,i=e.data.filter(o);t.call(this,i),this.parent=e,this.viewFilter=o,e.listen(function(t){var e,o,n;switch(t.operationDetailed){case"removeLeft":case"removeRight":case"remove":case"clear":for(var i=0,a=t.items;i<a.length;i+=1)r.remove(a[i]);break;case"prepend":n=t.items.filter(r.viewFilter),(e=r).unshift.apply(e,n);break;case"append":n=t.items.filter(r.viewFilter),(o=r).push.apply(o,n);break;case"swap":var s=r.data.indexOf(t.items[0]),c=r.data.indexOf(t.items[1]);-1!==s&&-1!==c&&r.swap(s,c);break;case"replace":var p=r.data.indexOf(t.target);-1!==p&&(r.viewFilter(t.items[0])?r.set(p,t.items[0]):r.remove(t.target))}},n)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e.prototype.updateFilter=function(t){this.viewFilter!==t&&(this.viewFilter=t,this.refresh())},e.prototype.refresh=function(){var t;this.clear();var e=this.parent.data.filter(this.viewFilter);(t=this).push.apply(t,e)},e}(n),s=function(t){this.data=t};s.prototype.deleteNext=function(){if(this.next){var t=this.next.next;this.next.next=void 0,this.next.previous=void 0,this.next=t,this.next&&(this.next.previous=this)}},s.prototype.deletePrevious=function(){if(this.previous){var t=this.previous.previous;this.previous.next=void 0,this.previous.previous=void 0,this.previous=t,this.previous&&(this.previous.next=this)}};var c=function(t){var e=this;void 0===t&&(t=[]),this.length=0,t.forEach(function(t){return e.append(t)})};c.prototype.find=function(t){for(var e=this.rootNode;e&&!t(e);)e=e.next;return e},c.prototype.append=function(t){return this.rootNode||this.lastNode?(this.lastNode.next=new s(t),this.lastNode.next.previous=this.lastNode,this.lastNode=this.lastNode.next):this.rootNode=this.lastNode=new s(t),this.length++,t},c.prototype.forEach=function(t){this.find(function(e){return t(e.data),!1})},c.prototype.prepend=function(t){return this.rootNode||this.lastNode?(this.rootNode.previous=new s(t),this.rootNode.previous.next=this.rootNode,this.rootNode=this.rootNode.previous):this.rootNode=this.lastNode=new s(t),this.length++,t},c.prototype.remove=function(t){if(t===this.rootNode.data)this.rootNode=this.rootNode===this.lastNode?this.lastNode=void 0:this.rootNode.next,this.length--;else{var e=this.find(function(e){return e.next&&e.next.data===t});e&&(e.next===this.lastNode&&(this.lastNode=e),e.deleteNext(),this.length--)}};var p=function(){for(var t=[],e=arguments.length;e--;)t[e]=arguments[e];this.cancelables=new c(t),this._isCancelled=!1},u={isCanceled:{configurable:!0}};u.isCanceled.get=function(){return this._isCancelled},p.prototype.addCancelable=function(t){return this.throwIfCancelled("attempting to add cancellable to token that is already cancelled"),this.cancelables.append(t),this.cancelables.length>200&&console.log("potential memory leak: cancellation token has over 200 clean up calls"),this},p.prototype.removeCancelable=function(t){return this.throwIfCancelled("attempting to remove cancellable from token that is already cancelled"),this.cancelables.remove(t),this},p.prototype.addDisposable=function(t){return this.addCancelable(function(){return t.dispose()}),this},p.prototype.callIfNotCancelled=function(t){this.isCanceled||t()},p.prototype.setTimeout=function(t,e){var o=this;void 0===e&&(e=0);var n=setTimeout(function(){o.removeCancelable(r),t()},e),r=function(){return clearTimeout(n)};this.addCancelable(r)},p.prototype.setInterval=function(t,e){var o=setInterval(t,e);this.addCancelable(function(){return clearInterval(o)})},p.prototype.requestAnimationFrame=function(t){var e=requestAnimationFrame(t);this.addCancelable(function(){return cancelAnimationFrame(e)})},p.prototype.animationLoop=function(t){var e=requestAnimationFrame(function o(n){t(n),e=requestAnimationFrame(o)});this.addCancelable(function(){return cancelAnimationFrame(e)})},p.prototype.throwIfCancelled=function(t){if(this.isCanceled)throw new Error(t||"cancellation token is cancelled")},p.prototype.chain=function(t,e){return void 0===e&&(e=!1),e&&t.chain(this,!1),this.addCancelable(function(){return t.cancel()}),this},p.prototype.registerDomEvent=function(t,e,o){return t.addEventListener(e,o),this.addCancelable(function(){return t.removeEventListener(e,o)}),this},p.prototype.cancel=function(){this.isCanceled||(this._isCancelled=!0,this.cancelables.forEach(function(t){return t()}),this.cancelables=void 0)},Object.defineProperties(p.prototype,u);var l=Symbol("owner"),h=function(t){var e=this;this.node=this.create(t),t instanceof o&&(t.listen(function(t){return e.node.textContent=t}),this.source=t)};h.prototype.resolveStringSource=function(t){return"string"==typeof t?t:t.value},h.prototype.create=function(t){var e=document.createTextNode(this.resolveStringSource(t));return e[l]=this,e},h.prototype.remove=function(){this.hasParent()&&this.node.parentElement[l].removeChild(this.node)},h.prototype.hasParent=function(){return!!this.node.parentElement},h.prototype.dispose=function(){var t;null===(t=this.source)||void 0===t||t.cancelAll(),delete this.node[l],delete this.node};var d={drag:"onDrag",dragstart:"onDragStart",dragend:"onDragEnd",dragexit:"onDragExit",dragover:"onDragOver",dragenter:"onDragEnter",dragleave:"onDragLeave",blur:"onBlur",focus:"onFocus",click:"onClick",dblclick:"onDblClick",keydown:"onKeyDown",keyhit:"onKeyHit",keyup:"onKeyUp",mousedown:"onMouseDown",mouseup:"onMouseUp",mousemove:"onMouseMove",mouseenter:"onMouseEnter",mouseleave:"onMouseLeave",mousewheel:"onMouseWheel"},f=["id","name","draggable","tabindex","style","role","contentEditable"],y=function(t,e){var o,n;this.cancellationToken=new p,this.node=this.create(e),this.children=[],null!==t&&(this.onDispose=t.onDispose,t.onAttach&&(this.onAttach=t.onAttach,this.needAttach=!0),this.onDetach=t.onDetach,this.template=t.template,this.initialize(t),null===(n=(o=t).onCreate)||void 0===n||n.call(o,this))};y.prototype.initialize=function(t){this.createEventHandlers(d,t);var e=Object.keys(t).filter(function(t){return t.includes("-")});this.bindProps(f,t,e),t.class&&this.handleClass(t.class),t.repeatModel&&this.handleRepeat(t.repeatModel)},y.prototype.bindProps=function(t,e,o){for(var n=0,r=t;n<r.length;n+=1){var i=r[n];e[i]&&this.assignStringSourceToAttribute(e[i],i)}if(o)for(var a=0,s=o;a<s.length;a+=1){var c=s[a];e[c]&&this.assignStringSourceToAttribute(e[c],c)}},y.prototype.createEventHandlers=function(t,e){var n=this,r=function(r){e[t[r]]&&(e[t[r]]instanceof o?n.node.addEventListener(r,function(o){return e[t[r]].update(o)}):"function"==typeof e[t[r]]&&n.node.addEventListener(r,function(o){return e[t[r]](o)}))};for(var i in t)r(i)},y.prototype.handleRepeat=function(t){var e=this;this.repeatData=t instanceof n?t:new n(t),this.repeatData.listenAndRepeat(function(t){var o;switch(t.operationDetailed){case"swap":var n=e.children[t.index2];e.children[t.index2]=e.children[t.index],e.children[t.index]=n;break;case"append":var r=e.children;e.children=new Array(r.length);var i=0;for(i=0;i<r.length;i++)e.children[i]=r[i];for(var a=0;a<t.items.length;a++)e.children[i+a]=e.template.generate(t.items[a]);break;case"prepend":(o=e.children).unshift.apply(o,t.items.map(function(t){return e.template.generate(t)}));break;case"remove":case"removeLeft":case"removeRight":e.children.splice(t.index,t.count);break;case"clear":e.children=[];break;default:throw new Error("unhandled operation")}e.render()})},y.prototype.render=function(){if(!this.cancellationToken.isCanceled){for(var t=0;t<this.children.length;t++){if(this.node.childNodes.length<=t){for(var e=t;e<this.children.length;e++)this.addChildDom(this.children[e]);return}if(this.node.childNodes[t][l]!==this.children[t]){if(!this.children.includes(this.node.childNodes[t][l])){var o=this.node.childNodes[t];o.remove(),o[l].dispose(),t--;continue}var n=this.getChildIndex(this.children[t].node);-1!==n?this.swapChildrenDom(t,n):this.addDomNodeAt(this.children[t].node,t)}}for(;this.node.childNodes.length>this.children.length;){var r=this.node.childNodes[this.node.childNodes.length-1];this.node.removeChild(r),r[l].dispose()}}},y.prototype.assignStringSourceToAttribute=function(t,e){var o=this;"string"==typeof t?this.node.setAttribute(e,t):(t.value&&this.node.setAttribute(e,t.value),t.unique(this.cancellationToken).listen(function(t){return o.node.setAttribute(e,t)},this.cancellationToken))},y.prototype.handleAttach=function(t){var e,o,n;if(this.needAttach)if(t.isConnected()){null===(e=this.onAttach)||void 0===e||e.call(this,this);for(var r=0,i=this.node.childNodes;r<i.length;r+=1)null===(n=(o=i[r][l]).handleAttach)||void 0===n||n.call(o,this)}else t.needAttach=!0},y.prototype.handleDetach=function(){var t,e,o;if(!this.node.isConnected){null===(t=this.onDetach)||void 0===t||t.call(this,this);for(var n=0,r=this.node.childNodes;n<r.length;n+=1){var i=r[n];i[l]&&(null===(o=(e=i[l]).handleDetach)||void 0===o||o.call(e))}}},y.prototype.handleClass=function(t){var e=this;if("string"==typeof t)this.node.className=t;else if(t instanceof o)t.value&&(Array.isArray(t.value)?(this.node.className=t.value.join(" "),t.unique(this.cancellationToken).listen(function(){e.node.className=t.value.join(" ")},this.cancellationToken)):(this.node.className=t.value,t.unique(this.cancellationToken).listen(function(){e.node.className=t.value},this.cancellationToken))),t.unique(this.cancellationToken).listen(function(t){return e.node.className=t},this.cancellationToken);else{var n=t.reduce(function(t,e){return"string"==typeof e?t+" "+e:e.value?t+" "+e.value:t},"");this.node.className=n;for(var r=0,i=t;r<i.length;r+=1){var a=i[r];a instanceof o&&a.unique(this.cancellationToken).listen(function(o){var n=t.reduce(function(t,e){return"string"==typeof e?t+" "+e:e.value?t+" "+e.value:t},"");e.node.className=n},this.cancellationToken)}}},y.prototype.resolveStringSource=function(t){return"string"==typeof t?t:t.value},y.prototype.create=function(t){var e=document.createElement(t);return e[l]=this,e},y.prototype.getChildIndex=function(t){for(var e=0,o=0,n=t.childNodes;o<n.length;o+=1){if(n[o]===t)return e;e++}return-1},y.prototype.hasChild=function(t){for(var e=0,o=t.children;e<o.length;e+=1)if(o[e]===t)return!0;return!1},y.prototype.addChildDom=function(t){var e,o;this.node.appendChild(t.node),null===(o=(e=t).handleAttach)||void 0===o||o.call(e,this)},y.prototype.swapChildrenDom=function(t,e){if(t!==e){var o=this.node.children[t],n=this.node.children[e];o.remove(),n.remove(),t<e?(this.addDomNodeAt(n,t),this.addDomNodeAt(o,e)):(this.addDomNodeAt(o,e),this.addDomNodeAt(n,t))}},y.prototype.addDomNodeAt=function(t,e){var o,n,r,i;e>=this.node.childElementCount?(this.node.appendChild(t),null===(n=(o=t[l]).handleAttach)||void 0===n||n.call(o,this)):(this.node.insertBefore(t,this.node.children[e]),null===(i=(r=t[l]).handleAttach)||void 0===i||i.call(r,this))},y.prototype.remove=function(){this.hasParent()&&this.node.parentElement[l].removeChild(this.node)},y.prototype.hasParent=function(){return!!this.node.parentElement},y.prototype.isConnected=function(){return this.node.isConnected},y.prototype.removeChild=function(t){var e=this.children.indexOf(t);-1!==e&&this.children.splice(e,1),this.render()},y.prototype.removeChildAt=function(t){this.children.splice(t,1),this.render()},y.prototype.swapChildren=function(t,e){if(t!==e){var o=this.children[t];this.children[t]=this.children[e],this.children[e]=o,this.render()}},y.prototype.clearChildren=function(){this.children.length=0,this.render()},y.prototype.addChild=function(t){t instanceof v||(t=this.childNodeToAurum(t),this.children.push(t),this.render())},y.prototype.childNodeToAurum=function(t){return"string"==typeof t||t instanceof o?t=new h(t):t instanceof y||(t=new h(t.toString())),t},y.prototype.addChildAt=function(t,e){t instanceof v||(t=this.childNodeToAurum(t),this.children.splice(e,0,t),this.render())},y.prototype.addChildren=function(t){if(0!==t.length)for(var e=0,o=t;e<o.length;e+=1)this.addChild(o[e])},y.prototype.dispose=function(){this.internalDispose(!0)},y.prototype.internalDispose=function(t){var e;if(!this.cancellationToken.isCanceled){this.cancellationToken.cancel(),t&&this.remove();for(var o=0,n=this.node.childNodes;o<n.length;o+=1){var r=n[o];r[l]&&r[l].dispose(!1)}delete this.node[l],delete this.node,null===(e=this.onDispose)||void 0===e||e.call(this,this)}};var v=function(t){function e(e){t.call(this,e,"template"),this.ref=e.ref,this.generate=e.generator}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),_=function(t){function e(e){t.call(this,e,"a"),null!==e&&this.bindProps(["href","target"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),b=function(t){function e(e){t.call(this,e,"abbr")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),m=function(t){function e(e){t.call(this,e,"area")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),g=function(t){function e(e){t.call(this,e,"article")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),x=function(t){function e(e){t.call(this,e,"aside")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),w=function(t){function e(e){t.call(this,e,"audio"),null!==e&&this.bindProps(["controls","autoplay","loop","muted","preload","src"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),O=function(t){function e(e){t.call(this,e,"b")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),j=function(t){function e(e){t.call(this,e,"br")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),C=function(t){function e(e){t.call(this,e,"button"),null!==e&&this.bindProps(["disabled"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),A=function(t){function e(e){t.call(this,e,"canvas"),null!==e&&this.bindProps(["width","height"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),S=function(t){function e(e){t.call(this,e,"data"),null!==e&&this.bindProps(["datalue"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),k=function(t){function e(e){t.call(this,e,"details")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),D=function(t){function e(e){t.call(this,e,"div")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),N=function(t){function e(e){t.call(this,e,"em")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),E=function(t){function e(e){t.call(this,e,"footer")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),T=function(t){function e(e){t.call(this,e,"form")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),P=function(t){function e(e){t.call(this,e,"h1")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),F=function(t){function e(e){t.call(this,e,"h2")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),I=function(t){function e(e){t.call(this,e,"h3")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),L=function(t){function e(e){t.call(this,e,"h4")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),V=function(t){function e(e){t.call(this,e,"h5")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),R=function(t){function e(e){t.call(this,e,"h6")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),q=function(t){function e(e){t.call(this,e,"header")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),M=function(t){function e(e){t.call(this,e,"heading")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),H=function(t){function e(e){t.call(this,e,"i")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),K=function(t){function e(e){t.call(this,e,"iframe"),null!==e&&this.bindProps(["src","srcdoc","width","height","allow","allowFullscreen","allowPaymentRequest"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),B=function(t){function e(e){t.call(this,e,"img"),null!==e&&this.bindProps(["src","alt","width","height","referrerPolicy","sizes","srcset","useMap"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),z={input:"onInput",change:"onChange"},U=["placeholder","readonly","disabled","accept","alt","autocomplete","autofocus","checked","defaultChecked","formAction","formEnctype","formMethod","formNoValidate","formTarget","max","maxLength","min","minLength","pattern","multiple","required","type"],Q=function(t){function e(e){var o,n=this;t.call(this,e,"input"),null!==e&&(e.inputValueSource?e.inputValueSource.unique().listenAndRepeat(function(t){return n.node.value=t},this.cancellationToken):this.node.value=null!=(o=e.initialValue)?o:"",this.bindProps(U,e),this.createEventHandlers(z,e),e.inputValueSource&&this.node.addEventListener("input",function(){e.inputValueSource.update(n.node.value)}))}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),W=function(t){function e(e){t.call(this,e,"label"),null!==e&&this.bindProps(["for"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),G=function(t){function e(e){t.call(this,e,"li")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),J=function(t){function e(e){t.call(this,e,"link"),null!==e&&this.bindProps(["href","rel","media","as","disabled","type"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),X=function(t){function e(e){t.call(this,e,"nav")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),Y=function(t){function e(e){t.call(this,e,"noscript")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),Z=function(t){function e(e){t.call(this,e,"ol")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),$=function(t){function e(e){t.call(this,e,"option")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),tt=function(t){function e(e){t.call(this,e,"p")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),et=function(t){function e(e){t.call(this,e,"pre")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),ot=function(t){function e(e){t.call(this,e,"progress"),null!==e&&this.bindProps(["max","value"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),nt=function(t){function e(e){t.call(this,e,"q")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),rt=function(t){function e(e){t.call(this,e,"script"),null!==e&&this.bindProps(["src","async","defer","integrity","noModule","type"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),it={change:"onChange"},at=function(t){function e(e){var o,n=this;t.call(this,e,"select"),null!==e&&(this.createEventHandlers(it,e),this.initialSelection=e.initialSelection,e.selectedIndexSource?(this.selectedIndexSource=e.selectedIndexSource,e.selectedIndexSource.unique().listenAndRepeat(function(t){return n.node.selectedIndex=t},this.cancellationToken)):this.node.selectedIndex=null!=(o=e.initialSelection)?o:-1,e.selectedIndexSource&&(this.needAttach=!0,this.node.addEventListener("change",function(){e.selectedIndexSource.update(n.node.selectedIndex)})))}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e.prototype.handleAttach=function(e){t.prototype.handleAttach.call(this,e),this.node.isConnected&&(this.selectedIndexSource?this.node.selectedIndex=this.selectedIndexSource.value:void 0!==this.initialSelection&&(this.node.selectedIndex=this.initialSelection))},e}(y),st=function(t){function e(e){t.call(this,e,"source"),null!==e&&this.bindProps(["src","srcSet","media","sizes","type"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),ct=function(t){function e(e){t.call(this,e,"span")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),pt=function(t){function e(e){var o=this;t.call(this,e,"switch"),this.firstRender=!0,this.templateMap=e.templateMap,this.renderSwitch(e.state.value),e.state.listen(function(t){o.renderSwitch(t)},this.cancellationToken)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e.prototype.renderSwitch=function(t){var e;if(t!==this.lastValue||this.firstRender)if(this.lastValue=t,this.firstRender=!1,this.clearChildren(),null!=t){var o=null!=(e=this.templateMap[t.toString()])?e:this.template;if(o){var n=o.generate();this.addChild(n)}}else if(this.template){var r=this.template.generate();this.addChild(r)}},e}(y),ut=function(t){function e(e){var n=new o(location.hash.substring(1));t.call(this,Object.assign(Object.assign({},e),{state:n})),window.addEventListener("hashchange",function(){var t=location.hash.substring(1);t.includes("?")?n.update(t.substring(0,t.indexOf("?"))):n.update(t)})}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(pt),lt=function(t){function e(e){var o=this;t.call(this,e,"suspense"),e.loader().then(function(t){o.clearChildren(),o.addChild(t)})}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),ht=function(t){function e(e){t.call(this,e,"style"),null!==e&&this.bindProps(["media"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),dt=function(t){function e(e){t.call(this,e,"sub")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),ft=function(t){function e(e){t.call(this,e,"summary")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),yt=function(t){function e(e){t.call(this,e,"sup")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),vt=function(t){function e(e){t.call(this,e,"svg"),null!==e&&this.bindProps(["width","height"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),_t=function(t){function e(e){t.call(this,e,"table")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),bt=function(t){function e(e){t.call(this,e,"tbody")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),mt=function(t){function e(e){t.call(this,e,"td")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),gt={input:"onInput",change:"onChange"},xt=["placeholder","readonly","disabled","rows","wrap","autocomplete","autofocus","max","maxLength","min","minLength","required","type"],wt=function(t){function e(e){var o,n,r,i=this;t.call(this,e,"textArea"),null!==e&&(e.inputValueSource?(this.node.value=null!=(n=null!=(o=e.initialValue)?o:e.inputValueSource.value)?n:"",e.inputValueSource.unique().listen(function(t){return i.node.value=t},this.cancellationToken)):this.node.value=null!=(r=e.initialValue)?r:"",this.bindProps(xt,e),this.createEventHandlers(gt,e),e.inputValueSource&&this.node.addEventListener("input",function(){e.inputValueSource.update(i.node.value)}))}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),Ot=function(t){function e(e){t.call(this,e,"tfoot")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),jt=function(t){function e(e){t.call(this,e,"th")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),Ct=function(t){function e(e){t.call(this,e,"thead")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),At=function(t){function e(e){t.call(this,e,"time"),null!==e&&this.bindProps(["datetime"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),St=function(t){function e(e){t.call(this,e,"title")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),kt=function(t){function e(e){t.call(this,e,"tr")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),Dt=function(t){function e(e){t.call(this,e,"ul")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),Nt=function(t){function e(e){t.call(this,e,"video"),null!==e&&this.bindProps(["controls","autoplay","loop","muted","preload","src","poster","width","height"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),Et=function(t){function e(e){t.call(this,e,"body")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),Tt=function(t){function e(e){t.call(this,e,"head")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(y),Pt=function(e){e&&(this.data=e),this.updateEvent=new t,this.updateEventOnKey=new Map};Pt.prototype.pick=function(t,e){var n,r=new o(null===(n=this.data)||void 0===n?void 0:n[t]);return this.listenOnKey(t,function(t){r.update(t.newValue)},e),r},Pt.prototype.listen=function(t,e){return this.updateEvent.subscribe(t,e).cancel},Pt.prototype.listenOnKeyAndRepeat=function(t,e,o){return e({key:t,newValue:this.data[t],oldValue:void 0}),this.listenOnKey(t,e,o)},Pt.prototype.listenOnKey=function(e,o,n){return this.updateEventOnKey.has(e)||this.updateEventOnKey.set(e,new t),this.updateEventOnKey.get(e).subscribe(o,n).cancel},Pt.prototype.get=function(t){return this.data[t]},Pt.prototype.set=function(t,e){if(this.data[t]!==e){var o=this.data[t];this.data[t]=e,this.updateEvent.fire({oldValue:o,key:t,newValue:this.data[t]}),this.updateEventOnKey.has(t)&&this.updateEventOnKey.get(t).fire({oldValue:o,key:t,newValue:this.data[t]})}},Pt.prototype.assign=function(t){for(var e=0,o=Object.keys(t);e<o.length;e+=1){var n=o[e];this.set(n,t[n])}},Pt.prototype.toObject=function(){return Object.assign({},this.data)},Pt.prototype.toDataSource=function(){var t=this,e=new o(this.data);return this.listen(function(o){e.update(t.data)}),e};var Ft={button:C,div:D,input:Q,li:G,span:ct,style:ht,ul:Dt,p:tt,img:B,link:J,canvas:A,a:_,article:g,br:j,form:T,label:W,ol:Z,pre:et,progress:ot,table:_t,td:mt,tr:kt,th:jt,textarea:wt,h1:P,h2:F,h3:I,h4:L,h5:V,h6:R,header:q,footer:E,nav:X,b:O,i:H,script:rt,abbr:b,area:m,aside:x,audio:w,em:N,heading:M,iframe:K,noscript:Y,option:$,q:nt,select:at,source:st,title:St,video:Nt,tbody:bt,tfoot:Ot,thead:Ct,summary:ft,details:k,sub:dt,sup:yt,svg:vt,data:S,time:At,template:v},It=function(){};It.attach=function(t,e){if(e[l])throw new Error("This node is already managed by aurum and cannot be used");e.appendChild(t.node),t.handleAttach(t),e[l]=t},It.detach=function(t){t[l]&&(t[l].node.remove(),t[l].handleDetach(),t[l].dispose(),t[l]=void 0)},It.factory=function(t,e){for(var o,n=[],r=arguments.length-2;r-- >0;)n[r]=arguments[r+2];if("string"==typeof t){var i=t;if(void 0===(t=Ft[t]))throw new Error("Node "+i+" does not exist or is not supported")}for(var a,s,c=(o=[]).concat.apply(o,n).filter(function(t){return t}),p={},u=!1,l=0,h=c;l<h.length;l+=1){var d=h[l];"string"!=typeof d&&(d instanceof v&&(!d.ref||"default"===d.ref)&&(a=d),d.ref&&(p[d.ref]=d,u=!0))}return a&&((e=null!=e?e:{}).template=a),u&&((e=null!=e?e:{}).templateMap=p),(s=t.prototype?new t(e):t(e)).addChildren(c),s},exports.A=_,exports.Abbr=b,exports.Area=m,exports.Article=g,exports.Aside=x,exports.Audio=w,exports.AurumElement=y,exports.Template=v,exports.B=O,exports.Br=j,exports.Button=C,exports.Canvas=A,exports.Data=S,exports.Details=k,exports.Div=D,exports.Em=N,exports.Footer=E,exports.Form=T,exports.H1=P,exports.H2=F,exports.H3=I,exports.H4=L,exports.H5=V,exports.H6=R,exports.Header=q,exports.Heading=M,exports.I=H,exports.IFrame=K,exports.Img=B,exports.Input=Q,exports.Label=W,exports.Li=G,exports.Link=J,exports.Nav=X,exports.NoScript=Y,exports.Ol=Z,exports.Option=$,exports.P=tt,exports.Pre=et,exports.Progress=ot,exports.Q=nt,exports.Script=rt,exports.Select=at,exports.Source=st,exports.Span=ct,exports.AurumRouter=ut,exports.Suspense=lt,exports.Switch=pt,exports.Style=ht,exports.Sub=dt,exports.Summary=ft,exports.Sup=yt,exports.Svg=vt,exports.Table=_t,exports.Tbody=bt,exports.Td=mt,exports.TextArea=wt,exports.Tfoot=Ot,exports.Th=jt,exports.Thead=Ct,exports.Time=At,exports.Title=St,exports.Tr=kt,exports.Ul=Dt,exports.Video=Nt,exports.Body=Et,exports.Head=Tt,exports.DataSource=o,exports.ArrayDataSource=n,exports.SortedArrayView=i,exports.FilteredArrayView=a,exports.ObjectDataSource=Pt,exports.Aurum=It,exports.CancellationToken=p;
//# sourceMappingURL=aurumjs.js.map
