!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(t.aurumjs={})}(this,function(t){var e=function(t){this.value=t,this.listeners=[]};e.prototype.update=function(t){this.value=t;for(var e=0,o=this.listeners;e<o.length;e+=1)(0,o[e])(t)},e.prototype.listenAndRepeat=function(t,e){return t(this.value),this.listen(t,e)},e.prototype.listen=function(t,e){var o,n=this;this.listeners.push(t);var r=function(){var e=n.listeners.indexOf(t);-1!==e&&n.listeners.splice(e,1)};return null===(o=e)||void 0===o||o.addCancelable(function(){r()}),r},e.prototype.filter=function(t,o){var n=new e;return this.listen(function(e){t(e)&&n.update(e)},o),n},e.prototype.pipe=function(t,e){this.listen(function(e){return t.update(e)},e)},e.prototype.map=function(t,o){var n=new e(t(this.value));return this.listen(function(e){n.update(t(e))},o),n},e.prototype.unique=function(t){var o=new e(this.value);return this.listen(function(t){t!==o.value&&o.update(t)},t),o},e.prototype.reduce=function(t,o,n){var r=new e(o);return this.listen(function(e){return r.update(t(r.value,e))},n),r},e.prototype.aggregate=function(t,o,n){var r=this,i=new e(o(this.value,t.value));return this.listen(function(){return i.update(o(r.value,t.value))},n),t.listen(function(){return i.update(o(r.value,t.value))},n),i},e.prototype.combine=function(t,o){var n=new e;return this.pipe(n,o),t.pipe(n,o),n},e.prototype.debounce=function(t,o){var n,r=new e;return this.listen(function(e){clearTimeout(n),n=setTimeout(function(){r.update(e)},t)},o),r},e.prototype.buffer=function(t,o){var n,r=new e,i=[];return this.listen(function(e){i.push(e),n||(n=setTimeout(function(){n=void 0,r.update(i),i=[]},t))},o),r},e.prototype.queue=function(t,e){var n=new o;return this.listen(function(t){n.push(t)},e),n},e.prototype.pick=function(t,o){var n,r=new e(null===(n=this.value)||void 0===n?void 0:n[t]);return this.listen(function(e){r.update(null!=e?e[t]:e)},o),r},e.prototype.cancelAll=function(){this.listeners.length=0};var o=function(t){this.data=t?t.slice():[],this.listeners=[]},n={length:{configurable:!0}};o.prototype.listenAndRepeat=function(t,e){return t({operation:"add",operationDetailed:"append",index:0,items:this.data,newState:this.data,count:this.data.length}),this.listen(t,e)},o.prototype.listen=function(t,e){var o,n=this;this.listeners.push(t);var r=function(){var e=n.listeners.indexOf(t);-1!==e&&n.listeners.splice(e,1)};return null===(o=e)||void 0===o||o.addCancelable(function(){r()}),r},n.length.get=function(){return this.data.length},o.prototype.getData=function(){return this.data.slice()},o.prototype.get=function(t){return this.data[t]},o.prototype.set=function(t,e){var o=this.data[t];o!==e&&(this.data[t]=e,this.update({operation:"replace",operationDetailed:"replace",target:o,count:1,index:t,items:[e],newState:this.data}))},o.prototype.swap=function(t,e){if(t!==e){var o=this.data[t],n=this.data[e];this.data[e]=o,this.data[t]=n,this.update({operation:"swap",operationDetailed:"swap",index:t,index2:e,items:[o,n],newState:this.data})}},o.prototype.swapItems=function(t,e){if(t!==e){var o=this.data.indexOf(t),n=this.data.indexOf(e);-1!==o&&-1!==n&&(this.data[n]=t,this.data[o]=e),this.update({operation:"swap",operationDetailed:"swap",index:o,index2:n,items:[t,e],newState:this.data})}},o.prototype.push=function(){for(var t,e=[],o=arguments.length;o--;)e[o]=arguments[o];(t=this.data).push.apply(t,e),this.update({operation:"add",operationDetailed:"append",count:e.length,index:this.data.length-e.length,items:e,newState:this.data})},o.prototype.unshift=function(){for(var t,e=[],o=arguments.length;o--;)e[o]=arguments[o];(t=this.data).unshift.apply(t,e),this.update({operation:"add",operationDetailed:"prepend",count:e.length,items:e,index:0,newState:this.data})},o.prototype.pop=function(){var t=this.data.pop();return this.update({operation:"remove",operationDetailed:"removeRight",count:1,index:this.data.length,items:[t],newState:this.data}),t},o.prototype.merge=function(t){for(var e=0;e<t.length;e++)this.data[e]!==t[e]&&(this.length>e?this.set(e,t[e]):this.push(t[e]));this.length>t.length&&this.removeRight(this.length-t.length)},o.prototype.removeRight=function(t){var e=this.data.splice(this.length-t,t);this.update({operation:"remove",operationDetailed:"removeRight",count:t,index:this.length-t,items:e,newState:this.data})},o.prototype.removeLeft=function(t){var e=this.data.splice(0,t);this.update({operation:"remove",operationDetailed:"removeLeft",count:t,index:0,items:e,newState:this.data})},o.prototype.remove=function(t){var e=this.data.indexOf(t);-1!==e&&(this.data.splice(e,1),this.update({operation:"remove",operationDetailed:"remove",count:1,index:e,items:[t],newState:this.data}))},o.prototype.clear=function(){var t=this.data;this.data=[],this.update({operation:"remove",operationDetailed:"clear",count:t.length,index:0,items:t,newState:this.data})},o.prototype.shift=function(){var t=this.data.shift();return this.update({operation:"remove",operationDetailed:"removeLeft",items:[t],count:1,index:0,newState:this.data}),t},o.prototype.toArray=function(){return this.data.slice()},o.prototype.filter=function(t,e){return new r(this,t,e)},o.prototype.forEach=function(t,e){return this.data.forEach(t,e)},o.prototype.toDataSource=function(){var t=new e(this.data);return this.listen(function(e){t.update(e.newState)}),t},o.prototype.update=function(t){for(var e=0,o=this.listeners;e<o.length;e+=1)(0,o[e])(t)},Object.defineProperties(o.prototype,n);var r=function(t){function e(e,o,n){var r=this,i=e.data.filter(o);t.call(this,i),this.parent=e,this.viewFilter=o,e.listen(function(t){var e,o,n;switch(t.operationDetailed){case"removeLeft":case"removeRight":case"remove":case"clear":for(var i=0,a=t.items;i<a.length;i+=1)r.remove(a[i]);break;case"prepend":n=t.items.filter(r.viewFilter),(e=r).unshift.apply(e,n);break;case"append":n=t.items.filter(r.viewFilter),(o=r).push.apply(o,n);break;case"swap":var c=r.data.indexOf(t.items[0]),s=r.data.indexOf(t.items[1]);-1!==c&&-1!==s&&r.swap(c,s);break;case"replace":var p=r.data.indexOf(t.target);-1!==p&&(r.viewFilter(t.items[0])?r.set(p,t.items[0]):r.remove(t.target))}},n)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e.prototype.updateFilter=function(t){this.viewFilter!==t&&(this.viewFilter=t,this.refresh())},e.prototype.refresh=function(){var t;this.clear();var e=this.parent.data.filter(this.viewFilter);(t=this).push.apply(t,e)},e}(o),i=function(t){this.data=t};i.prototype.deleteNext=function(){if(this.next){var t=this.next.next;this.next.next=void 0,this.next.previous=void 0,this.next=t,this.next&&(this.next.previous=this)}},i.prototype.deletePrevious=function(){if(this.previous){var t=this.previous.previous;this.previous.next=void 0,this.previous.previous=void 0,this.previous=t,this.previous&&(this.previous.next=this)}};var a=function(t){var e=this;void 0===t&&(t=[]),this.length=0,t.forEach(function(t){return e.append(t)})};a.prototype.find=function(t){for(var e=this.rootNode;e&&!t(e);)e=e.next;return e},a.prototype.append=function(t){return this.rootNode||this.lastNode?(this.lastNode.next=new i(t),this.lastNode.next.previous=this.lastNode,this.lastNode=this.lastNode.next):this.rootNode=this.lastNode=new i(t),this.length++,t},a.prototype.forEach=function(t){this.find(function(e){return t(e.data),!1})},a.prototype.prepend=function(t){return this.rootNode||this.lastNode?(this.rootNode.previous=new i(t),this.rootNode.previous.next=this.rootNode,this.rootNode=this.rootNode.previous):this.rootNode=this.lastNode=new i(t),this.length++,t},a.prototype.remove=function(t){if(t===this.rootNode.data)this.rootNode=this.rootNode.next,this.length--;else{var e=this.find(function(e){return e.next&&e.next.data===t});e&&(e.next===this.lastNode&&(this.lastNode=e),e.deleteNext(),this.length--)}};var c=function(){for(var t=[],e=arguments.length;e--;)t[e]=arguments[e];this.cancelables=new a(t),this._isCancelled=!1},s={isCanceled:{configurable:!0}};s.isCanceled.get=function(){return this._isCancelled},c.prototype.addCancelable=function(t){return this.throwIfCancelled("attempting to add cancellable to token that is already cancelled"),this.cancelables.append(t),this.cancelables.length>200&&console.log("potential memory leak: cancellation token has over 200 clean up calls"),this},c.prototype.removeCancelable=function(t){return this.throwIfCancelled("attempting to remove cancellable from token that is already cancelled"),this.cancelables.remove(t),this},c.prototype.addDisposable=function(t){return this.addCancelable(function(){return t.dispose()}),this},c.prototype.callIfNotCancelled=function(t){this.isCanceled||t()},c.prototype.setTimeout=function(t,e){var o=this;void 0===e&&(e=0);var n=setTimeout(function(){o.removeCancelable(r),t()},e),r=function(){return clearTimeout(n)};this.addCancelable(r)},c.prototype.setInterval=function(t,e){var o=setInterval(t,e);this.addCancelable(function(){return clearInterval(o)})},c.prototype.requestAnimationFrame=function(t){var e=requestAnimationFrame(t);this.addCancelable(function(){return cancelAnimationFrame(e)})},c.prototype.animationLoop=function(t){var e=requestAnimationFrame(function o(n){t(n),e=requestAnimationFrame(o)});this.addCancelable(function(){return cancelAnimationFrame(e)})},c.prototype.throwIfCancelled=function(t){if(this.isCanceled)throw new Error(t||"cancellation token is cancelled")},c.prototype.chain=function(t,e){return void 0===e&&(e=!1),e&&t.chain(this,!1),this.addCancelable(function(){return t.cancel()}),this},c.prototype.registerDomEvent=function(t,e,o){return t.addEventListener(e,o),this.addCancelable(function(){return t.removeEventListener(e,o)}),this},c.prototype.cancel=function(){this.isCanceled||(this._isCancelled=!0,this.cancelables.forEach(function(t){return t()}),this.cancelables=void 0)},Object.defineProperties(c.prototype,s);var p=Symbol("owner"),u=function(t,e){var o,n;this.onDispose=t.onDispose,this.onAttach=t.onAttach,this.onDetach=t.onDetach,this.domNodeName=e,this.template=t.template,this.cancellationToken=new c,this.node=this.create(t),this.initialize(t),null===(n=(o=t).onCreate)||void 0===n||n.call(o,this)};u.prototype.initialize=function(t){this.node instanceof Text||(this.children=[]),this.createEventHandlers(["drag","name","dragstart","dragend","dragexit","dragover","dragenter","dragleave","blur","focus","click","dblclick","keydown","keyhit","keyup","mousedown","mouseup","mouseenter","mouseleave","mousewheel"],t);var e=Object.keys(t).filter(function(t){return t.startsWith("x-")||t.startsWith("data-")});this.bindProps(["id","draggable","tabindex","style","role","contentEditable"].concat(e),t),t.class&&this.handleClass(t.class),t.repeatModel&&this.handleRepeat(t.repeatModel)},u.prototype.bindProps=function(t,e){for(var o=0,n=t;o<n.length;o+=1){var r=n[o];e[r]&&this.assignStringSourceToAttribute(e[r],r)}},u.prototype.createEventHandlers=function(t,o){var n=this;if(!(this.node instanceof Text))for(var r=function(){var t=a[i],r="on"+t[0].toUpperCase()+t.slice(1),c=void 0;Object.defineProperty(n,r,{get:function(){return c||(c=new e),c},set:function(){throw new Error(r+" is read only")}}),o[r]&&(o[r]instanceof e?n[r].listen(o[r].update.bind(o.onClick),n.cancellationToken):"function"==typeof o[r]&&n[r].listen(o[r],n.cancellationToken)),n.cancellationToken.registerDomEvent(n.node,t,function(t){return n[r].update(t)})},i=0,a=t;i<a.length;i+=1)r()},u.prototype.handleRepeat=function(t){var e,n=this;this.repeatData=t instanceof o?t:new o(t),this.repeatData.length&&((e=this.children).push.apply(e,this.repeatData.toArray().map(function(t){return n.template.generate(t)})),this.render()),this.repeatData.listen(function(t){var e,o,r;switch(t.operationDetailed){case"swap":var i=n.children[t.index2];n.children[t.index2]=n.children[t.index],n.children[t.index]=i;break;case"append":(e=n.children).push.apply(e,t.items.map(function(t){return n.template.generate(t)}));break;case"prepend":(o=n.children).unshift.apply(o,t.items.map(function(t){return n.template.generate(t)}));break;case"remove":case"removeLeft":case"removeRight":case"clear":n.children.splice(t.index,t.count);break;default:n.children.length=0,(r=n.children).push.apply(r,n.repeatData.toArray().map(function(t){return n.template.generate(t)}))}n.render()})},u.prototype.render=function(){var t=this;this.rerenderPending||this.node instanceof Text||(this.cancellationToken.setTimeout(function(){for(var e=0;e<t.children.length;e++){if(t.node.childNodes.length<=e){t.addChildrenDom(t.children.slice(e,t.children.length));break}if(t.node.childNodes[e][p]!==t.children[e]){if(!t.children.includes(t.node.childNodes[e][p])){var o=t.node.childNodes[e];o.remove(),o[p].dispose(),e--;continue}var n=t.getChildIndex(t.children[e].node);-1!==n?t.swapChildrenDom(e,n):t.addDomNodeAt(t.children[e].node,e)}}for(;t.node.childNodes.length>t.children.length;){var r=t.node.childNodes[t.node.childNodes.length-1];t.node.removeChild(r),r[p].dispose()}t.rerenderPending=!1}),this.rerenderPending=!0)},u.prototype.assignStringSourceToAttribute=function(t,e){var o=this;this.node instanceof Text||("string"==typeof t?this.node.setAttribute(e,t):(t.value&&this.node.setAttribute(e,t.value),t.unique(this.cancellationToken).listen(function(t){return o.node.setAttribute(e,t)},this.cancellationToken)))},u.prototype.handleAttach=function(){var t;if(this.node.isConnected){null===(t=this.onAttach)||void 0===t||t.call(this,this);for(var e=0,o=this.node.childNodes;e<o.length;e+=1)o[e][p].handleAttach()}},u.prototype.handleDetach=function(){var t;if(!this.node.isConnected){null===(t=this.onDetach)||void 0===t||t.call(this,this);for(var e=0,o=this.node.childNodes;e<o.length;e+=1){var n=o[e];n[p]&&n[p].handleDetach()}}},u.prototype.handleClass=function(t){var o=this;if(!(this.node instanceof Text))if("string"==typeof t)this.node.className=t;else if(t instanceof e)t.value&&(Array.isArray(t.value)?(this.node.className=t.value.join(" "),t.unique(this.cancellationToken).listen(function(){o.node.className=t.value.join(" ")},this.cancellationToken)):(this.node.className=t.value,t.unique(this.cancellationToken).listen(function(){o.node.className=t.value},this.cancellationToken))),t.unique(this.cancellationToken).listen(function(t){return o.node.className=t},this.cancellationToken);else{var n=t.reduce(function(t,e){return"string"==typeof e?t+" "+e:e.value?t+" "+e.value:t},"");this.node.className=n;for(var r=0,i=t;r<i.length;r+=1){var a=i[r];a instanceof e&&a.unique(this.cancellationToken).listen(function(e){var n=t.reduce(function(t,e){return"string"==typeof e?t+" "+e:e.value?t+" "+e.value:t},"");o.node.className=n},this.cancellationToken)}}},u.prototype.resolveStringSource=function(t){return"string"==typeof t?t:t.value},u.prototype.create=function(t){var e=document.createElement(this.domNodeName);return e[p]=this,e},u.prototype.getChildIndex=function(t){for(var e=0,o=0,n=t.childNodes;o<n.length;o+=1){if(n[o]===t)return e;e++}return-1},u.prototype.hasChild=function(t){if(this.node instanceof Text)throw new Error("Text nodes don't have children");for(var e=0,o=t.children;e<o.length;e+=1)if(o[e]===t)return!0;return!1},u.prototype.addChildrenDom=function(t){if(this.node instanceof Text)throw new Error("Text nodes don't have children");for(var e=0,o=t;e<o.length;e+=1){var n=o[e];this.node.appendChild(n.node),n.handleAttach()}},u.prototype.swapChildrenDom=function(t,e){if(this.node instanceof Text)throw new Error("Text nodes don't have children");if(t!==e){var o=this.node.children[t],n=this.node.children[e];o.remove(),n.remove(),t<e?(this.addDomNodeAt(n,t),this.addDomNodeAt(o,e)):(this.addDomNodeAt(o,e),this.addDomNodeAt(n,t))}},u.prototype.addDomNodeAt=function(t,e){if(this.node instanceof Text)throw new Error("Text nodes don't have children");e>=this.node.childElementCount?(this.node.appendChild(t),t[p].handleAttach()):(this.node.insertBefore(t,this.node.children[e]),t[p].handleAttach())},u.prototype.remove=function(){this.hasParent()&&this.node.parentElement[p].removeChild(this.node)},u.prototype.hasParent=function(){return!!this.node.parentElement},u.prototype.isConnected=function(){return this.node.isConnected},u.prototype.removeChild=function(t){var e=this.children.indexOf(t);-1!==e&&this.children.splice(e,1),this.render()},u.prototype.removeChildAt=function(t){this.children.splice(t,1),this.render()},u.prototype.swapChildren=function(t,e){if(t!==e){var o=this.children[t];this.children[t]=this.children[e],this.children[e]=o,this.render()}},u.prototype.clearChildren=function(){if(this.node instanceof Text)throw new Error("Text nodes don't have children");this.children.length=0,this.render()},u.prototype.addChild=function(t){if(this.node instanceof Text)throw new Error("Text nodes don't have children");t instanceof l||(t=this.childNodeToAurum(t),this.children.push(t),this.render())},u.prototype.childNodeToAurum=function(t){return"string"==typeof t||t instanceof e?t=new h({text:t}):t instanceof u||(t=new h({text:t.toString()})),t},u.prototype.addChildAt=function(t,e){if(this.node instanceof Text)throw new Error("Text nodes don't have children");t instanceof l||(t=this.childNodeToAurum(t),this.children.splice(e,0,t),this.render())},u.prototype.addChildren=function(t){if(this.node instanceof Text)throw new Error("Text nodes don't have children");if(0!==t.length)for(var e=0,o=t;e<o.length;e+=1)this.addChild(o[e])},u.prototype.dispose=function(){this.internalDispose(!0)},u.prototype.internalDispose=function(t){var e;this.cancellationToken.cancel(),t&&this.remove();for(var o=0,n=this.node.childNodes;o<n.length;o+=1){var r=n[o];r[p]&&r[p].internalDispose(!1)}delete this.node[p],delete this.node,null===(e=this.onDispose)||void 0===e||e.call(this,this)};var l=function(t){function e(e){t.call(this,e,"template"),this.ref=e.ref,this.generate=e.generator}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),h=function(t){function o(o){var n=this;t.call(this,o,"textNode"),o.text instanceof e&&o.text.listen(function(t){return n.node.textContent=t},this.cancellationToken)}return t&&(o.__proto__=t),(o.prototype=Object.create(t&&t.prototype)).constructor=o,o.prototype.create=function(t){var e=document.createTextNode(this.resolveStringSource(t.text));return e[p]=this,e},o}(u),d=function(t){function e(e){t.call(this,e,"a"),this.bindProps(["href","target"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),f=function(t){function e(e){t.call(this,e,"abbr")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),y=function(t){function e(e){t.call(this,e,"area")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),v=function(t){function e(e){t.call(this,e,"article")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),_=function(t){function e(e){t.call(this,e,"aside")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),m=function(t){function e(e){t.call(this,e,"audio"),this.bindProps(["controls","autoplay","loop","muted","preload","src"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),b=function(t){function e(e){t.call(this,e,"b")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),g=function(t){function e(e){t.call(this,e,"br")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),w=function(t){function e(e){t.call(this,e,"button"),this.bindProps(["disabled"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),x=function(t){function e(e){t.call(this,e,"canvas"),this.bindProps(["width","height"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),O=function(t){function e(e){t.call(this,e,"data"),this.bindProps(["datalue"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),j=function(t){function e(e){t.call(this,e,"details")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),T=function(t){function e(e){t.call(this,e,"div")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),N=function(t){function e(e){t.call(this,e,"em")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),C=function(t){function e(e){t.call(this,e,"footer")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),S=function(t){function e(e){t.call(this,e,"form")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),A=function(t){function e(e){t.call(this,e,"h1")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),D=function(t){function e(e){t.call(this,e,"h2")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),k=function(t){function e(e){t.call(this,e,"h3")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),E=function(t){function e(e){t.call(this,e,"h4")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),P=function(t){function e(e){t.call(this,e,"h5")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),I=function(t){function e(e){t.call(this,e,"h6")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),q=function(t){function e(e){t.call(this,e,"header")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),F=function(t){function e(e){t.call(this,e,"heading")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),R=function(t){function e(e){t.call(this,e,"i")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),V=function(t){function e(e){t.call(this,e,"iframe"),this.bindProps(["src","srcdoc","width","height","allow","allowFullscreen","allowPaymentRequest"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),L=function(t){function e(e){t.call(this,e,"img"),this.bindProps(["src","alt","width","height","referrerPolicy","sizes","srcset","useMap"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),H=function(t){function e(e){var o,n=this;t.call(this,e,"input"),e.inputValueSource?e.inputValueSource.unique().listenAndRepeat(function(t){return n.node.value=t},this.cancellationToken):this.node.value=null!=(o=e.initialValue)?o:"",this.bindProps(["placeholder","readonly","disabled","accept","alt","autocomplete","autofocus","checked","defaultChecked","formAction","formEnctype","formMethod","formNoValidate","formTarget","max","maxLength","min","minLength","pattern","multiple","required","type"],e),this.createEventHandlers(["input","change"],e),e.inputValueSource&&this.onInput.map(function(t){return n.node.value}).pipe(e.inputValueSource)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),M=function(t){function e(e){t.call(this,e,"label"),this.bindProps(["for"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),z=function(t){function e(e){t.call(this,e,"li")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),B=function(t){function e(e){t.call(this,e,"link"),this.bindProps(["href","rel","media","as","disabled","type"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),U=function(t){function e(e){t.call(this,e,"nav")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),W=function(t){function e(e){t.call(this,e,"noscript")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),Q=function(t){function e(e){t.call(this,e,"ol")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),G=function(t){function e(e){t.call(this,e,"option")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),J=function(t){function e(e){t.call(this,e,"p")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),K=function(t){function e(e){t.call(this,e,"pre")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),X=function(t){function e(e){t.call(this,e,"progress"),this.bindProps(["max","value"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),Y=function(t){function e(e){t.call(this,e,"q")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),Z=function(t){function e(e){t.call(this,e,"script"),this.bindProps(["src","async","defer","integrity","noModule","type"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),$=function(t){function e(e){var o,n=this;t.call(this,e,"select"),this.createEventHandlers(["change"],e),e.selectedIndexSource?e.selectedIndexSource.unique().listenAndRepeat(function(t){return n.node.selectedIndex=t},this.cancellationToken):this.node.selectedIndex=null!=(o=e.initialSelection)?o:0,e.selectedIndexSource&&this.onChange.map(function(t){return n.node.selectedIndex}).pipe(e.selectedIndexSource)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),tt=function(t){function e(e){t.call(this,e,"source"),this.bindProps(["src","srcSet","media","sizes","type"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),et=function(t){function e(e){t.call(this,e,"span")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),ot=function(t){function e(e){var o=this;t.call(this,e,"switch"),this.firstRender=!0,this.templateMap=e.templateMap,this.renderSwitch(e.state.value),e.state.listen(function(t){o.renderSwitch(t)},this.cancellationToken)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e.prototype.renderSwitch=function(t){var e;if(t!==this.lastValue||this.firstRender)if(this.lastValue=t,this.firstRender=!1,this.clearChildren(),null!=t){var o=null!=(e=this.templateMap[t.toString()])?e:this.template;if(o){var n=o.generate();this.addChild(n)}}else if(this.template){var r=this.template.generate();this.addChild(r)}},e}(u),nt=function(t){function o(o){var n=new e(location.hash.substring(1));t.call(this,Object.assign(Object.assign({},o),{state:n})),window.addEventListener("hashchange",function(){var t=location.hash.substring(1);t.includes("?")?n.update(t.substring(0,t.indexOf("?"))):n.update(t)})}return t&&(o.__proto__=t),(o.prototype=Object.create(t&&t.prototype)).constructor=o,o}(ot),rt=function(t){function e(e){var o=this;t.call(this,e,"suspense"),e.loader().then(function(t){o.clearChildren(),o.addChild(t)})}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),it=function(t){function e(e){t.call(this,e,"style"),this.bindProps(["media"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),at=function(t){function e(e){t.call(this,e,"sub")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),ct=function(t){function e(e){t.call(this,e,"summary")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),st=function(t){function e(e){t.call(this,e,"sup")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),pt=function(t){function e(e){t.call(this,e,"svg"),this.bindProps(["width","height"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),ut=function(t){function e(e){t.call(this,e,"table")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),lt=function(t){function e(e){t.call(this,e,"tbody")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),ht=function(t){function e(e){t.call(this,e,"td")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),dt=function(t){function e(e){var o,n,r,i=this;t.call(this,e,"textArea"),e.inputValueSource?(this.node.value=null!=(n=null!=(o=e.initialValue)?o:e.inputValueSource.value)?n:"",e.inputValueSource.unique().listen(function(t){return i.node.value=t},this.cancellationToken)):this.node.value=null!=(r=e.initialValue)?r:"",this.bindProps(["placeholder","readonly","disabled","rows","wrap","autocomplete","autofocus","max","maxLength","min","minLength","required","type"],e),this.createEventHandlers(["input","change"],e),e.inputValueSource&&this.onInput.map(function(t){return i.node.value}).pipe(e.inputValueSource)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),ft=function(t){function e(e){t.call(this,e,"tfoot")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),yt=function(t){function e(e){t.call(this,e,"th")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),vt=function(t){function e(e){t.call(this,e,"thead")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),_t=function(t){function e(e){t.call(this,e,"time"),this.bindProps(["datetime"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),mt=function(t){function e(e){t.call(this,e,"title")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),bt=function(t){function e(e){t.call(this,e,"tr")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),gt=function(t){function e(e){t.call(this,e,"ul")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),wt=function(t){function e(e){t.call(this,e,"video"),this.bindProps(["controls","autoplay","loop","muted","preload","src","poster","width","height"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),xt={button:w,div:T,input:H,li:z,span:et,style:it,ul:gt,p:J,img:L,link:B,canvas:x,a:d,article:v,br:g,form:S,label:M,ol:Q,pre:K,progress:X,table:ut,td:ht,tr:bt,th:yt,textarea:dt,h1:A,h2:D,h3:k,h4:E,h5:P,h6:I,header:q,footer:C,nav:U,b:b,i:R,script:Z,abbr:f,area:y,aside:_,audio:Audio,em:N,heading:F,iframe:V,noscript:W,option:G,q:Y,select:$,source:tt,title:mt,video:wt,tbody:lt,tfoot:ft,thead:vt,summary:ct,details:j,sub:at,sup:st,svg:pt,data:O,time:_t,template:l},Ot=function(){};Ot.attach=function(t,e){if(e[p])throw new Error("This node is already managed by aurum and cannot be used");e.appendChild(t.node),t.handleAttach(),e[p]=t},Ot.detach=function(t){t[p]&&(t[p].node.remove(),t[p].handleDetach(),t[p].dispose(),t[p]=void 0)},Ot.factory=function(t,e){for(var o,n=[],r=arguments.length-2;r-- >0;)n[r]=arguments[r+2];if("string"==typeof t){var i=t;if(void 0===(t=xt[t]))throw new Error("Node "+i+" does not exist or is not supported")}for(var a,c,s=(o=[]).concat.apply(o,n).filter(function(t){return t}),p={},u=!1,h=0,d=s;h<d.length;h+=1){var f=d[h];"string"!=typeof f&&(f instanceof l&&(!f.ref||"default"===f.ref)&&(a=f),f.ref&&(p[f.ref]=f,u=!0))}return e=null!=e?e:{},a&&(e.template=a),u&&(e.templateMap=p),(c=t.prototype?new t(e||{}):t(e||{})).addChildren(s),c},t.A=d,t.Abbr=f,t.Area=y,t.Article=v,t.Aside=_,t.Audio=m,t.AurumElement=u,t.Template=l,t.TextNode=h,t.B=b,t.Br=g,t.Button=w,t.Canvas=x,t.Data=O,t.Details=j,t.Div=T,t.Em=N,t.Footer=C,t.Form=S,t.H1=A,t.H2=D,t.H3=k,t.H4=E,t.H5=P,t.H6=I,t.Header=q,t.Heading=F,t.I=R,t.IFrame=V,t.Img=L,t.Input=H,t.Label=M,t.Li=z,t.Link=B,t.Nav=U,t.NoScript=W,t.Ol=Q,t.Option=G,t.P=J,t.Pre=K,t.Progress=X,t.Q=Y,t.Script=Z,t.Select=$,t.Source=tt,t.Span=et,t.AurumRouter=nt,t.Suspense=rt,t.Switch=ot,t.Style=it,t.Sub=at,t.Summary=ct,t.Sup=st,t.Svg=pt,t.Table=ut,t.Tbody=lt,t.Td=ht,t.TextArea=dt,t.Tfoot=ft,t.Th=yt,t.Thead=vt,t.Time=_t,t.Title=mt,t.Tr=bt,t.Ul=gt,t.Video=wt,t.DataSource=e,t.ArrayDataSource=o,t.FilteredArrayView=r,t.Aurum=Ot,t.CancellationToken=c});
//# sourceMappingURL=aurumjs.umd.js.map
