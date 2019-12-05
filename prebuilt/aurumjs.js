var t=function(){this.subscribeChannel=[],this.onAfterFire=[]},e={subscriptions:{configurable:!0}};e.subscriptions.get=function(){return this.subscribeChannel.length},t.prototype.subscribe=function(t,e){return this.createSubscription(t,this.subscribeChannel,e).facade},t.prototype.hasSubscriptions=function(){return this.subscriptions>0},t.prototype.cancelAll=function(){this.subscribeChannel.length=0},t.prototype.fireFiltered=function(t,e){this.isFiring=!0;for(var o=this.subscribeChannel.length,n=0;n<o;n++)this.subscribeChannel[n].callback!==e&&this.subscribeChannel[n].callback(t);this.isFiring=!1,this.afterFire()},t.prototype.afterFire=function(){this.onAfterFire.length>0&&(this.onAfterFire.forEach(function(t){return t()}),this.onAfterFire.length=0)},t.prototype.fire=function(t){this.isFiring=!0;for(var e=this.subscribeChannel.length,o=0;o<e;o++)this.subscribeChannel[o].callback(t);this.isFiring=!1,this.afterFire()},t.prototype.createSubscription=function(t,e,o){var n=this,r={callback:t},i={cancel:function(){n.cancel(r,e)}};return void 0!==o&&o.addCancelable(function(){return n.cancel(r,e)}),e.push(r),{subscription:r,facade:i}},t.prototype.cancel=function(t,e){var o=this,n=e.indexOf(t);n>=0&&(this.isFiring?this.onAfterFire.push(function(){return o.cancel(t,e)}):e.splice(n,1))},Object.defineProperties(t.prototype,e);var o=function(e){this.value=e,this.updateEvent=new t};o.prototype.update=function(t){if(this.updating)throw new Error("Problem in datas source: Unstable value propagation, when updating a value the stream was updated back as a direct response. This can lead to infinite loops and is therefore not allowed");this.updating=!0,this.value=t,this.updateEvent.fire(t),this.updating=!1},o.prototype.backPropagate=function(t,e){this.value=e,this.updating=!0,this.updateEvent.fireFiltered(e,t),this.updating=!1},o.prototype.listenAndRepeat=function(t,e){return t(this.value),this.listen(t,e)},o.prototype.listen=function(t,e){return this.updateEvent.subscribe(t,e).cancel},o.prototype.filter=function(t,e){var n=new o;return this.listen(function(e){t(e)&&n.update(e)},e),n},o.prototype.filterDuplex=function(t,e){var n=this,r=new o,i=function(e){t(e)&&r.backPropagate(a,e)},a=function(e){t(e)&&n.backPropagate(i,e)};return this.listen(i,e),r.listen(a,e),r},o.prototype.pipe=function(t,e){this.listen(function(e){return t.update(e)},e)},o.prototype.pipeDuplex=function(t,e){var o=this,n=function(e){return t.backPropagate(r,e)},r=function(t){return o.backPropagate(n,t)};this.listen(n,e),t.listen(r,e)},o.prototype.map=function(t,e){var n=new o(t(this.value));return this.listen(function(e){n.update(t(e))},e),n},o.prototype.mapDuplex=function(t,e,n){var r=this,i=new o(t(this.value)),a=function(e){return i.backPropagate(s,t(e))},s=function(t){return r.backPropagate(a,e(t))};return this.listen(a,n),i.listen(s,n),i},o.prototype.unique=function(t){var e=new o(this.value);return this.listen(function(t){t!==e.value&&e.update(t)},t),e},o.prototype.uniqueDuplex=function(t){var e=this,n=new o(this.value),r=function(t){t!==n.value&&n.backPropagate(i,t)},i=function(t){t!==e.value&&e.backPropagate(r,t)};return this.listen(r,t),n.listen(i,t),n},o.prototype.reduce=function(t,e,n){var r=new o(e);return this.listen(function(e){return r.update(t(r.value,e))},n),r},o.prototype.aggregate=function(t,e,n){var r=this,i=new o(e(this.value,t.value));return this.listen(function(){return i.update(e(r.value,t.value))},n),t.listen(function(){return i.update(e(r.value,t.value))},n),i},o.prototype.combine=function(t,e){var n=new o;return this.pipe(n,e),t.pipe(n,e),n},o.prototype.debounce=function(t,e){var n,r=new o;return this.listen(function(e){clearTimeout(n),n=setTimeout(function(){r.update(e)},t)},e),r},o.prototype.buffer=function(t,e){var n,r=new o,i=[];return this.listen(function(e){i.push(e),n||(n=setTimeout(function(){n=void 0,r.update(i),i=[]},t))},e),r},o.prototype.queue=function(t,e){var o=new n;return this.listen(function(t){o.push(t)},e),o},o.prototype.pick=function(t,e){var n,r=new o(null===(n=this.value)||void 0===n?void 0:n[t]);return this.listen(function(e){r.update(null!=e?e[t]:e)},e),r},o.prototype.cancelAll=function(){this.updateEvent.cancelAll()};var n=function(e){this.data=e?e.slice():[],this.updateEvent=new t},r={length:{configurable:!0}};n.prototype.listenAndRepeat=function(t,e){return t({operation:"add",operationDetailed:"append",index:0,items:this.data,newState:this.data,count:this.data.length}),this.listen(t,e)},n.prototype.listen=function(t,e){return this.updateEvent.subscribe(t,e).cancel},r.length.get=function(){return this.data.length},n.prototype.getData=function(){return this.data.slice()},n.prototype.get=function(t){return this.data[t]},n.prototype.set=function(t,e){var o=this.data[t];o!==e&&(this.data[t]=e,this.update({operation:"replace",operationDetailed:"replace",target:o,count:1,index:t,items:[e],newState:this.data}))},n.prototype.swap=function(t,e){if(t!==e){var o=this.data[t],n=this.data[e];this.data[e]=o,this.data[t]=n,this.update({operation:"swap",operationDetailed:"swap",index:t,index2:e,items:[o,n],newState:this.data})}},n.prototype.swapItems=function(t,e){if(t!==e){var o=this.data.indexOf(t),n=this.data.indexOf(e);-1!==o&&-1!==n&&(this.data[n]=t,this.data[o]=e),this.update({operation:"swap",operationDetailed:"swap",index:o,index2:n,items:[t,e],newState:this.data})}},n.prototype.push=function(){for(var t,e=[],o=arguments.length;o--;)e[o]=arguments[o];(t=this.data).push.apply(t,e),this.update({operation:"add",operationDetailed:"append",count:e.length,index:this.data.length-e.length,items:e,newState:this.data})},n.prototype.unshift=function(){for(var t,e=[],o=arguments.length;o--;)e[o]=arguments[o];(t=this.data).unshift.apply(t,e),this.update({operation:"add",operationDetailed:"prepend",count:e.length,items:e,index:0,newState:this.data})},n.prototype.pop=function(){var t=this.data.pop();return this.update({operation:"remove",operationDetailed:"removeRight",count:1,index:this.data.length,items:[t],newState:this.data}),t},n.prototype.merge=function(t){for(var e=0;e<t.length;e++)this.data[e]!==t[e]&&(this.length>e?this.set(e,t[e]):this.push(t[e]));this.length>t.length&&this.removeRight(this.length-t.length)},n.prototype.removeRight=function(t){var e=this.data.splice(this.length-t,t);this.update({operation:"remove",operationDetailed:"removeRight",count:t,index:this.length-t,items:e,newState:this.data})},n.prototype.removeLeft=function(t){var e=this.data.splice(0,t);this.update({operation:"remove",operationDetailed:"removeLeft",count:t,index:0,items:e,newState:this.data})},n.prototype.remove=function(t){var e=this.data.indexOf(t);-1!==e&&(this.data.splice(e,1),this.update({operation:"remove",operationDetailed:"remove",count:1,index:e,items:[t],newState:this.data}))},n.prototype.clear=function(){var t=this.data;this.data=[],this.update({operation:"remove",operationDetailed:"clear",count:t.length,index:0,items:t,newState:this.data})},n.prototype.shift=function(){var t=this.data.shift();return this.update({operation:"remove",operationDetailed:"removeLeft",items:[t],count:1,index:0,newState:this.data}),t},n.prototype.toArray=function(){return this.data.slice()},n.prototype.filter=function(t,e){return new i(this,t,e)},n.prototype.forEach=function(t,e){return this.data.forEach(t,e)},n.prototype.toDataSource=function(){var t=new o(this.data);return this.listen(function(e){t.update(e.newState)}),t},n.prototype.update=function(t){this.updateEvent.fire(t)},Object.defineProperties(n.prototype,r);var i=function(t){function e(e,o,n){var r=this,i=e.data.filter(o);t.call(this,i),this.parent=e,this.viewFilter=o,e.listen(function(t){var e,o,n;switch(t.operationDetailed){case"removeLeft":case"removeRight":case"remove":case"clear":for(var i=0,a=t.items;i<a.length;i+=1)r.remove(a[i]);break;case"prepend":n=t.items.filter(r.viewFilter),(e=r).unshift.apply(e,n);break;case"append":n=t.items.filter(r.viewFilter),(o=r).push.apply(o,n);break;case"swap":var s=r.data.indexOf(t.items[0]),c=r.data.indexOf(t.items[1]);-1!==s&&-1!==c&&r.swap(s,c);break;case"replace":var p=r.data.indexOf(t.target);-1!==p&&(r.viewFilter(t.items[0])?r.set(p,t.items[0]):r.remove(t.target))}},n)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e.prototype.updateFilter=function(t){this.viewFilter!==t&&(this.viewFilter=t,this.refresh())},e.prototype.refresh=function(){var t;this.clear();var e=this.parent.data.filter(this.viewFilter);(t=this).push.apply(t,e)},e}(n),a=function(t){this.data=t};a.prototype.deleteNext=function(){if(this.next){var t=this.next.next;this.next.next=void 0,this.next.previous=void 0,this.next=t,this.next&&(this.next.previous=this)}},a.prototype.deletePrevious=function(){if(this.previous){var t=this.previous.previous;this.previous.next=void 0,this.previous.previous=void 0,this.previous=t,this.previous&&(this.previous.next=this)}};var s=function(t){var e=this;void 0===t&&(t=[]),this.length=0,t.forEach(function(t){return e.append(t)})};s.prototype.find=function(t){for(var e=this.rootNode;e&&!t(e);)e=e.next;return e},s.prototype.append=function(t){return this.rootNode||this.lastNode?(this.lastNode.next=new a(t),this.lastNode.next.previous=this.lastNode,this.lastNode=this.lastNode.next):this.rootNode=this.lastNode=new a(t),this.length++,t},s.prototype.forEach=function(t){this.find(function(e){return t(e.data),!1})},s.prototype.prepend=function(t){return this.rootNode||this.lastNode?(this.rootNode.previous=new a(t),this.rootNode.previous.next=this.rootNode,this.rootNode=this.rootNode.previous):this.rootNode=this.lastNode=new a(t),this.length++,t},s.prototype.remove=function(t){if(t===this.rootNode.data)this.rootNode=this.rootNode.next,this.length--;else{var e=this.find(function(e){return e.next&&e.next.data===t});e&&(e.next===this.lastNode&&(this.lastNode=e),e.deleteNext(),this.length--)}};var c=function(){for(var t=[],e=arguments.length;e--;)t[e]=arguments[e];this.cancelables=new s(t),this._isCancelled=!1},p={isCanceled:{configurable:!0}};p.isCanceled.get=function(){return this._isCancelled},c.prototype.addCancelable=function(t){return this.throwIfCancelled("attempting to add cancellable to token that is already cancelled"),this.cancelables.append(t),this.cancelables.length>200&&console.log("potential memory leak: cancellation token has over 200 clean up calls"),this},c.prototype.removeCancelable=function(t){return this.throwIfCancelled("attempting to remove cancellable from token that is already cancelled"),this.cancelables.remove(t),this},c.prototype.addDisposable=function(t){return this.addCancelable(function(){return t.dispose()}),this},c.prototype.callIfNotCancelled=function(t){this.isCanceled||t()},c.prototype.setTimeout=function(t,e){var o=this;void 0===e&&(e=0);var n=setTimeout(function(){o.removeCancelable(r),t()},e),r=function(){return clearTimeout(n)};this.addCancelable(r)},c.prototype.setInterval=function(t,e){var o=setInterval(t,e);this.addCancelable(function(){return clearInterval(o)})},c.prototype.requestAnimationFrame=function(t){var e=requestAnimationFrame(t);this.addCancelable(function(){return cancelAnimationFrame(e)})},c.prototype.animationLoop=function(t){var e=requestAnimationFrame(function o(n){t(n),e=requestAnimationFrame(o)});this.addCancelable(function(){return cancelAnimationFrame(e)})},c.prototype.throwIfCancelled=function(t){if(this.isCanceled)throw new Error(t||"cancellation token is cancelled")},c.prototype.chain=function(t,e){return void 0===e&&(e=!1),e&&t.chain(this,!1),this.addCancelable(function(){return t.cancel()}),this},c.prototype.registerDomEvent=function(t,e,o){return t.addEventListener(e,o),this.addCancelable(function(){return t.removeEventListener(e,o)}),this},c.prototype.cancel=function(){this.isCanceled||(this._isCancelled=!0,this.cancelables.forEach(function(t){return t()}),this.cancelables=void 0)},Object.defineProperties(c.prototype,p);var u=Symbol("owner"),l=function(t,e){var o,n;this.onDispose=t.onDispose,this.onAttach=t.onAttach,this.onDetach=t.onDetach,this.domNodeName=e,this.template=t.template,this.cancellationToken=new c,this.node=this.create(t),this.initialize(t),null===(n=(o=t).onCreate)||void 0===n||n.call(o,this)};l.prototype.initialize=function(t){this.node instanceof Text||(this.children=[]),this.createEventHandlers(["drag","name","dragstart","dragend","dragexit","dragover","dragenter","dragleave","blur","focus","click","dblclick","keydown","keyhit","keyup","mousedown","mouseup","mousemouse","mouseenter","mouseleave","mousewheel"],t);var e=Object.keys(t).filter(function(t){return t.startsWith("x-")||t.startsWith("data-")});this.bindProps(["id","draggable","tabindex","style","role","contentEditable"].concat(e),t),t.class&&this.handleClass(t.class),t.repeatModel&&this.handleRepeat(t.repeatModel)},l.prototype.bindProps=function(t,e){for(var o=0,n=t;o<n.length;o+=1){var r=n[o];e[r]&&this.assignStringSourceToAttribute(e[r],r)}},l.prototype.createEventHandlers=function(t,e){var n=this;if(!(this.node instanceof Text))for(var r=function(){var t=a[i],r="on"+t[0].toUpperCase()+t.slice(1),s=void 0;Object.defineProperty(n,r,{get:function(){return s||(s=new o),s},set:function(){throw new Error(r+" is read only")}}),e[r]&&(e[r]instanceof o?n[r].listen(e[r].update.bind(e.onClick),n.cancellationToken):"function"==typeof e[r]&&n[r].listen(e[r],n.cancellationToken),n.cancellationToken.registerDomEvent(n.node,t,function(t){return n[r].update(t)}))},i=0,a=t;i<a.length;i+=1)r()},l.prototype.handleRepeat=function(t){var e,o=this;this.repeatData=t instanceof n?t:new n(t),this.repeatData.length&&((e=this.children).push.apply(e,this.repeatData.toArray().map(function(t){return o.template.generate(t)})),this.render()),this.repeatData.listen(function(t){var e,n,r;switch(t.operationDetailed){case"swap":var i=o.children[t.index2];o.children[t.index2]=o.children[t.index],o.children[t.index]=i;break;case"append":(e=o.children).push.apply(e,t.items.map(function(t){return o.template.generate(t)}));break;case"prepend":(n=o.children).unshift.apply(n,t.items.map(function(t){return o.template.generate(t)}));break;case"remove":case"removeLeft":case"removeRight":case"clear":o.children.splice(t.index,t.count);break;default:o.children.length=0,(r=o.children).push.apply(r,o.repeatData.toArray().map(function(t){return o.template.generate(t)}))}o.render()})},l.prototype.render=function(){var t=this;this.rerenderPending||this.node instanceof Text||(this.cancellationToken.setTimeout(function(){for(var e=0;e<t.children.length;e++){if(t.node.childNodes.length<=e){t.addChildrenDom(t.children.slice(e,t.children.length));break}if(t.node.childNodes[e][u]!==t.children[e]){if(!t.children.includes(t.node.childNodes[e][u])){var o=t.node.childNodes[e];o.remove(),o[u].dispose(),e--;continue}var n=t.getChildIndex(t.children[e].node);-1!==n?t.swapChildrenDom(e,n):t.addDomNodeAt(t.children[e].node,e)}}for(;t.node.childNodes.length>t.children.length;){var r=t.node.childNodes[t.node.childNodes.length-1];t.node.removeChild(r),r[u].dispose()}t.rerenderPending=!1}),this.rerenderPending=!0)},l.prototype.assignStringSourceToAttribute=function(t,e){var o=this;this.node instanceof Text||("string"==typeof t?this.node.setAttribute(e,t):(t.value&&this.node.setAttribute(e,t.value),t.unique(this.cancellationToken).listen(function(t){return o.node.setAttribute(e,t)},this.cancellationToken)))},l.prototype.handleAttach=function(){var t;if(this.node.isConnected){null===(t=this.onAttach)||void 0===t||t.call(this,this);for(var e=0,o=this.node.childNodes;e<o.length;e+=1)o[e][u].handleAttach()}},l.prototype.handleDetach=function(){var t;if(!this.node.isConnected){null===(t=this.onDetach)||void 0===t||t.call(this,this);for(var e=0,o=this.node.childNodes;e<o.length;e+=1){var n=o[e];n[u]&&n[u].handleDetach()}}},l.prototype.handleClass=function(t){var e=this;if(!(this.node instanceof Text))if("string"==typeof t)this.node.className=t;else if(t instanceof o)t.value&&(Array.isArray(t.value)?(this.node.className=t.value.join(" "),t.unique(this.cancellationToken).listen(function(){e.node.className=t.value.join(" ")},this.cancellationToken)):(this.node.className=t.value,t.unique(this.cancellationToken).listen(function(){e.node.className=t.value},this.cancellationToken))),t.unique(this.cancellationToken).listen(function(t){return e.node.className=t},this.cancellationToken);else{var n=t.reduce(function(t,e){return"string"==typeof e?t+" "+e:e.value?t+" "+e.value:t},"");this.node.className=n;for(var r=0,i=t;r<i.length;r+=1){var a=i[r];a instanceof o&&a.unique(this.cancellationToken).listen(function(o){var n=t.reduce(function(t,e){return"string"==typeof e?t+" "+e:e.value?t+" "+e.value:t},"");e.node.className=n},this.cancellationToken)}}},l.prototype.resolveStringSource=function(t){return"string"==typeof t?t:t.value},l.prototype.create=function(t){var e=document.createElement(this.domNodeName);return e[u]=this,e},l.prototype.getChildIndex=function(t){for(var e=0,o=0,n=t.childNodes;o<n.length;o+=1){if(n[o]===t)return e;e++}return-1},l.prototype.hasChild=function(t){if(this.node instanceof Text)throw new Error("Text nodes don't have children");for(var e=0,o=t.children;e<o.length;e+=1)if(o[e]===t)return!0;return!1},l.prototype.addChildrenDom=function(t){if(this.node instanceof Text)throw new Error("Text nodes don't have children");for(var e=0,o=t;e<o.length;e+=1){var n=o[e];this.node.appendChild(n.node),n.handleAttach()}},l.prototype.swapChildrenDom=function(t,e){if(this.node instanceof Text)throw new Error("Text nodes don't have children");if(t!==e){var o=this.node.children[t],n=this.node.children[e];o.remove(),n.remove(),t<e?(this.addDomNodeAt(n,t),this.addDomNodeAt(o,e)):(this.addDomNodeAt(o,e),this.addDomNodeAt(n,t))}},l.prototype.addDomNodeAt=function(t,e){if(this.node instanceof Text)throw new Error("Text nodes don't have children");e>=this.node.childElementCount?(this.node.appendChild(t),t[u].handleAttach()):(this.node.insertBefore(t,this.node.children[e]),t[u].handleAttach())},l.prototype.remove=function(){this.hasParent()&&this.node.parentElement[u].removeChild(this.node)},l.prototype.hasParent=function(){return!!this.node.parentElement},l.prototype.isConnected=function(){return this.node.isConnected},l.prototype.removeChild=function(t){var e=this.children.indexOf(t);-1!==e&&this.children.splice(e,1),this.render()},l.prototype.removeChildAt=function(t){this.children.splice(t,1),this.render()},l.prototype.swapChildren=function(t,e){if(t!==e){var o=this.children[t];this.children[t]=this.children[e],this.children[e]=o,this.render()}},l.prototype.clearChildren=function(){if(this.node instanceof Text)throw new Error("Text nodes don't have children");this.children.length=0,this.render()},l.prototype.addChild=function(t){if(this.node instanceof Text)throw new Error("Text nodes don't have children");t instanceof h||(t=this.childNodeToAurum(t),this.children.push(t),this.render())},l.prototype.childNodeToAurum=function(t){return"string"==typeof t||t instanceof o?t=new d({text:t}):t instanceof l||(t=new d({text:t.toString()})),t},l.prototype.addChildAt=function(t,e){if(this.node instanceof Text)throw new Error("Text nodes don't have children");t instanceof h||(t=this.childNodeToAurum(t),this.children.splice(e,0,t),this.render())},l.prototype.addChildren=function(t){if(this.node instanceof Text)throw new Error("Text nodes don't have children");if(0!==t.length)for(var e=0,o=t;e<o.length;e+=1)this.addChild(o[e])},l.prototype.dispose=function(){this.internalDispose(!0)},l.prototype.internalDispose=function(t){var e;this.cancellationToken.cancel(),t&&this.remove();for(var o=0,n=this.node.childNodes;o<n.length;o+=1){var r=n[o];r[u]&&r[u].internalDispose(!1)}delete this.node[u],delete this.node,null===(e=this.onDispose)||void 0===e||e.call(this,this)};var h=function(t){function e(e){t.call(this,e,"template"),this.ref=e.ref,this.generate=e.generator}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),d=function(t){function e(e){var n=this;t.call(this,e,"textNode"),e.text instanceof o&&e.text.listen(function(t){return n.node.textContent=t},this.cancellationToken)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e.prototype.create=function(t){var e=document.createTextNode(this.resolveStringSource(t.text));return e[u]=this,e},e}(l),f=function(t){function e(e){t.call(this,e,"a"),this.bindProps(["href","target"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),y=function(t){function e(e){t.call(this,e,"abbr")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),v=function(t){function e(e){t.call(this,e,"area")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),_=function(t){function e(e){t.call(this,e,"article")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),b=function(t){function e(e){t.call(this,e,"aside")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),m=function(t){function e(e){t.call(this,e,"audio"),this.bindProps(["controls","autoplay","loop","muted","preload","src"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),g=function(t){function e(e){t.call(this,e,"b")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),x=function(t){function e(e){t.call(this,e,"br")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),w=function(t){function e(e){t.call(this,e,"button"),this.bindProps(["disabled"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),O=function(t){function e(e){t.call(this,e,"canvas"),this.bindProps(["width","height"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),j=function(t){function e(e){t.call(this,e,"data"),this.bindProps(["datalue"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),C=function(t){function e(e){t.call(this,e,"details")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),T=function(t){function e(e){t.call(this,e,"div")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),k=function(t){function e(e){t.call(this,e,"em")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),A=function(t){function e(e){t.call(this,e,"footer")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),N=function(t){function e(e){t.call(this,e,"form")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),S=function(t){function e(e){t.call(this,e,"h1")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),D=function(t){function e(e){t.call(this,e,"h2")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),E=function(t){function e(e){t.call(this,e,"h3")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),P=function(t){function e(e){t.call(this,e,"h4")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),F=function(t){function e(e){t.call(this,e,"h5")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),I=function(t){function e(e){t.call(this,e,"h6")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),V=function(t){function e(e){t.call(this,e,"header")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),q=function(t){function e(e){t.call(this,e,"heading")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),R=function(t){function e(e){t.call(this,e,"i")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),L=function(t){function e(e){t.call(this,e,"iframe"),this.bindProps(["src","srcdoc","width","height","allow","allowFullscreen","allowPaymentRequest"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),H=function(t){function e(e){t.call(this,e,"img"),this.bindProps(["src","alt","width","height","referrerPolicy","sizes","srcset","useMap"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),K=function(t){function e(e){var o,n=this;t.call(this,e,"input"),e.inputValueSource?e.inputValueSource.unique().listenAndRepeat(function(t){return n.node.value=t},this.cancellationToken):this.node.value=null!=(o=e.initialValue)?o:"",this.bindProps(["placeholder","readonly","disabled","accept","alt","autocomplete","autofocus","checked","defaultChecked","formAction","formEnctype","formMethod","formNoValidate","formTarget","max","maxLength","min","minLength","pattern","multiple","required","type"],e),this.createEventHandlers(["input","change"],e),e.inputValueSource&&this.onInput.map(function(t){return n.node.value}).pipe(e.inputValueSource)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),M=function(t){function e(e){t.call(this,e,"label"),this.bindProps(["for"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),z=function(t){function e(e){t.call(this,e,"li")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),B=function(t){function e(e){t.call(this,e,"link"),this.bindProps(["href","rel","media","as","disabled","type"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),U=function(t){function e(e){t.call(this,e,"nav")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),W=function(t){function e(e){t.call(this,e,"noscript")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),Q=function(t){function e(e){t.call(this,e,"ol")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),G=function(t){function e(e){t.call(this,e,"option")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),J=function(t){function e(e){t.call(this,e,"p")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),X=function(t){function e(e){t.call(this,e,"pre")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),Y=function(t){function e(e){t.call(this,e,"progress"),this.bindProps(["max","value"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),Z=function(t){function e(e){t.call(this,e,"q")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),$=function(t){function e(e){t.call(this,e,"script"),this.bindProps(["src","async","defer","integrity","noModule","type"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),tt=function(t){function e(e){var o,n=this;t.call(this,e,"select"),this.createEventHandlers(["change"],e),e.selectedIndexSource?(this.selectedIndexSource=e.selectedIndexSource,e.selectedIndexSource.unique().listenAndRepeat(function(t){return n.node.selectedIndex=t},this.cancellationToken)):this.node.selectedIndex=null!=(o=e.initialSelection)?o:-1,e.selectedIndexSource&&this.onChange.map(function(t){return n.node.selectedIndex}).pipe(e.selectedIndexSource)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e.prototype.handleAttach=function(){t.prototype.handleAttach.call(this),this.selectedIndexSource&&(this.node.selectedIndex=this.selectedIndexSource.value)},e}(l),et=function(t){function e(e){t.call(this,e,"source"),this.bindProps(["src","srcSet","media","sizes","type"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),ot=function(t){function e(e){t.call(this,e,"span")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),nt=function(t){function e(e){var o=this;t.call(this,e,"switch"),this.firstRender=!0,this.templateMap=e.templateMap,this.renderSwitch(e.state.value),e.state.listen(function(t){o.renderSwitch(t)},this.cancellationToken)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e.prototype.renderSwitch=function(t){var e;if(t!==this.lastValue||this.firstRender)if(this.lastValue=t,this.firstRender=!1,this.clearChildren(),null!=t){var o=null!=(e=this.templateMap[t.toString()])?e:this.template;if(o){var n=o.generate();this.addChild(n)}}else if(this.template){var r=this.template.generate();this.addChild(r)}},e}(l),rt=function(t){function e(e){var n=new o(location.hash.substring(1));t.call(this,Object.assign(Object.assign({},e),{state:n})),window.addEventListener("hashchange",function(){var t=location.hash.substring(1);t.includes("?")?n.update(t.substring(0,t.indexOf("?"))):n.update(t)})}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(nt),it=function(t){function e(e){var o=this;t.call(this,e,"suspense"),e.loader().then(function(t){o.clearChildren(),o.addChild(t)})}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),at=function(t){function e(e){t.call(this,e,"style"),this.bindProps(["media"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),st=function(t){function e(e){t.call(this,e,"sub")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),ct=function(t){function e(e){t.call(this,e,"summary")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),pt=function(t){function e(e){t.call(this,e,"sup")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),ut=function(t){function e(e){t.call(this,e,"svg"),this.bindProps(["width","height"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),lt=function(t){function e(e){t.call(this,e,"table")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),ht=function(t){function e(e){t.call(this,e,"tbody")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),dt=function(t){function e(e){t.call(this,e,"td")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),ft=function(t){function e(e){var o,n,r,i=this;t.call(this,e,"textArea"),e.inputValueSource?(this.node.value=null!=(n=null!=(o=e.initialValue)?o:e.inputValueSource.value)?n:"",e.inputValueSource.unique().listen(function(t){return i.node.value=t},this.cancellationToken)):this.node.value=null!=(r=e.initialValue)?r:"",this.bindProps(["placeholder","readonly","disabled","rows","wrap","autocomplete","autofocus","max","maxLength","min","minLength","required","type"],e),this.createEventHandlers(["input","change"],e),e.inputValueSource&&this.onInput.map(function(t){return i.node.value}).pipe(e.inputValueSource)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),yt=function(t){function e(e){t.call(this,e,"tfoot")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),vt=function(t){function e(e){t.call(this,e,"th")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),_t=function(t){function e(e){t.call(this,e,"thead")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),bt=function(t){function e(e){t.call(this,e,"time"),this.bindProps(["datetime"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),mt=function(t){function e(e){t.call(this,e,"title")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),gt=function(t){function e(e){t.call(this,e,"tr")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),xt=function(t){function e(e){t.call(this,e,"ul")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),wt=function(t){function e(e){t.call(this,e,"video"),this.bindProps(["controls","autoplay","loop","muted","preload","src","poster","width","height"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(l),Ot=function(e){e&&(this.data=e),this.updateEvent=new t,this.updateEventOnKey=new Map};Ot.prototype.pick=function(t,e){var n,r=new o(null===(n=this.data)||void 0===n?void 0:n[t]);return this.listenOnKey(t,function(t){r.update(t.newValue)},e),r},Ot.prototype.listen=function(t,e){return this.updateEvent.subscribe(t,e).cancel},Ot.prototype.listenOnKeyAndRepeat=function(t,e,o){return e({key:t,newValue:this.data[t],oldValue:void 0}),this.listenOnKey(t,e,o)},Ot.prototype.listenOnKey=function(e,o,n){return this.updateEventOnKey.has(e)||this.updateEventOnKey.set(e,new t),this.updateEventOnKey.get(e).subscribe(o,n).cancel},Ot.prototype.get=function(t){return this.data[t]},Ot.prototype.set=function(t,e){if(this.data[t]!==e){var o=this.data[t];this.data[t]=e,this.updateEvent.fire({oldValue:o,key:t,newValue:this.data[t]}),this.updateEventOnKey.has(t)&&this.updateEventOnKey.get(t).fire({oldValue:o,key:t,newValue:this.data[t]})}},Ot.prototype.assign=function(t){for(var e=0,o=Object.keys(t);e<o.length;e+=1){var n=o[e];this.set(n,t[n])}},Ot.prototype.toObject=function(){return Object.assign({},this.data)},Ot.prototype.toDataSource=function(){var t=this,e=new o(this.data);return this.listen(function(o){e.update(t.data)}),e};var jt={button:w,div:T,input:K,li:z,span:ot,style:at,ul:xt,p:J,img:H,link:B,canvas:O,a:f,article:_,br:x,form:N,label:M,ol:Q,pre:X,progress:Y,table:lt,td:dt,tr:gt,th:vt,textarea:ft,h1:S,h2:D,h3:E,h4:P,h5:F,h6:I,header:V,footer:A,nav:U,b:g,i:R,script:$,abbr:y,area:v,aside:b,audio:Audio,em:k,heading:q,iframe:L,noscript:W,option:G,q:Z,select:tt,source:et,title:mt,video:wt,tbody:ht,tfoot:yt,thead:_t,summary:ct,details:C,sub:st,sup:pt,svg:ut,data:j,time:bt,template:h},Ct=function(){};Ct.attach=function(t,e){if(e[u])throw new Error("This node is already managed by aurum and cannot be used");e.appendChild(t.node),t.handleAttach(),e[u]=t},Ct.detach=function(t){t[u]&&(t[u].node.remove(),t[u].handleDetach(),t[u].dispose(),t[u]=void 0)},Ct.factory=function(t,e){for(var o,n=[],r=arguments.length-2;r-- >0;)n[r]=arguments[r+2];if("string"==typeof t){var i=t;if(void 0===(t=jt[t]))throw new Error("Node "+i+" does not exist or is not supported")}for(var a,s,c=(o=[]).concat.apply(o,n).filter(function(t){return t}),p={},u=!1,l=0,d=c;l<d.length;l+=1){var f=d[l];"string"!=typeof f&&(f instanceof h&&(!f.ref||"default"===f.ref)&&(a=f),f.ref&&(p[f.ref]=f,u=!0))}return e=null!=e?e:{},a&&(e.template=a),u&&(e.templateMap=p),(s=t.prototype?new t(e||{}):t(e||{})).addChildren(c),s},exports.A=f,exports.Abbr=y,exports.Area=v,exports.Article=_,exports.Aside=b,exports.Audio=m,exports.AurumElement=l,exports.Template=h,exports.TextNode=d,exports.B=g,exports.Br=x,exports.Button=w,exports.Canvas=O,exports.Data=j,exports.Details=C,exports.Div=T,exports.Em=k,exports.Footer=A,exports.Form=N,exports.H1=S,exports.H2=D,exports.H3=E,exports.H4=P,exports.H5=F,exports.H6=I,exports.Header=V,exports.Heading=q,exports.I=R,exports.IFrame=L,exports.Img=H,exports.Input=K,exports.Label=M,exports.Li=z,exports.Link=B,exports.Nav=U,exports.NoScript=W,exports.Ol=Q,exports.Option=G,exports.P=J,exports.Pre=X,exports.Progress=Y,exports.Q=Z,exports.Script=$,exports.Select=tt,exports.Source=et,exports.Span=ot,exports.AurumRouter=rt,exports.Suspense=it,exports.Switch=nt,exports.Style=at,exports.Sub=st,exports.Summary=ct,exports.Sup=pt,exports.Svg=ut,exports.Table=lt,exports.Tbody=ht,exports.Td=dt,exports.TextArea=ft,exports.Tfoot=yt,exports.Th=vt,exports.Thead=_t,exports.Time=bt,exports.Title=mt,exports.Tr=gt,exports.Ul=xt,exports.Video=wt,exports.DataSource=o,exports.ArrayDataSource=n,exports.FilteredArrayView=i,exports.ObjectDataSource=Ot,exports.Aurum=Ct,exports.CancellationToken=c;
//# sourceMappingURL=aurumjs.js.map
