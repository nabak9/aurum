var t=function(t){this.value=t,this.listeners=[]};t.prototype.update=function(t){this.value=t;for(var e=0,o=this.listeners;e<o.length;e+=1)(0,o[e])(t)},t.prototype.listenAndRepeat=function(t,e){return t(this.value),this.listen(t,e)},t.prototype.listen=function(t,e){var o,n=this;this.listeners.push(t);var r=function(){var e=n.listeners.indexOf(t);-1!==e&&n.listeners.splice(e,1)};return null===(o=e)||void 0===o||o.addCancelable(function(){r()}),r},t.prototype.filter=function(e,o){var n=new t;return this.listen(function(t){e(t)&&n.update(t)},o),n},t.prototype.pipe=function(t,e){this.listen(function(e){return t.update(e)},e)},t.prototype.map=function(e,o){var n=new t(e(this.value));return this.listen(function(t){n.update(e(t))},o),n},t.prototype.unique=function(e){var o=new t(this.value);return this.listen(function(t){t!==o.value&&o.update(t)},e),o},t.prototype.reduce=function(e,o,n){var r=new t(o);return this.listen(function(t){return r.update(e(r.value,t))},n),r},t.prototype.aggregate=function(e,o,n){var r=this,i=new t(o(this.value,e.value));return this.listen(function(){return i.update(o(r.value,e.value))},n),e.listen(function(){return i.update(o(r.value,e.value))},n),i},t.prototype.combine=function(e,o){var n=new t;return this.pipe(n,o),e.pipe(n,o),n},t.prototype.debounce=function(e,o){var n,r=new t;return this.listen(function(t){clearTimeout(n),n=setTimeout(function(){r.update(t)},e)},o),r},t.prototype.buffer=function(e,o){var n,r=new t,i=[];return this.listen(function(t){i.push(t),n||(n=setTimeout(function(){n=void 0,r.update(i),i=[]},e))},o),r},t.prototype.queue=function(t,o){var n=new e;return this.listen(function(t){n.push(t)},o),n},t.prototype.pick=function(e,o){var n,r=new t(null===(n=this.value)||void 0===n?void 0:n[e]);return this.listen(function(t){r.update(null!=t?t[e]:t)},o),r},t.prototype.cancelAll=function(){this.listeners.length=0};var e=function(t){this.data=t?t.slice():[],this.listeners=[]},o={length:{configurable:!0}};e.prototype.listenAndRepeat=function(t,e){return t({operation:"add",operationDetailed:"append",index:0,items:this.data,newState:this.data,count:this.data.length}),this.listen(t,e)},e.prototype.listen=function(t,e){var o,n=this;this.listeners.push(t);var r=function(){var e=n.listeners.indexOf(t);-1!==e&&n.listeners.splice(e,1)};return null===(o=e)||void 0===o||o.addCancelable(function(){r()}),r},o.length.get=function(){return this.data.length},e.prototype.getData=function(){return this.data.slice()},e.prototype.get=function(t){return this.data[t]},e.prototype.set=function(t,e){var o=this.data[t];o!==e&&(this.data[t]=e,this.update({operation:"replace",operationDetailed:"replace",target:o,count:1,index:t,items:[e],newState:this.data}))},e.prototype.swap=function(t,e){if(t!==e){var o=this.data[t],n=this.data[e];this.data[e]=o,this.data[t]=n,this.update({operation:"swap",operationDetailed:"swap",index:t,index2:e,items:[o,n],newState:this.data})}},e.prototype.swapItems=function(t,e){if(t!==e){var o=this.data.indexOf(t),n=this.data.indexOf(e);-1!==o&&-1!==n&&(this.data[n]=t,this.data[o]=e),this.update({operation:"swap",operationDetailed:"swap",index:o,index2:n,items:[t,e],newState:this.data})}},e.prototype.push=function(){for(var t,e=[],o=arguments.length;o--;)e[o]=arguments[o];(t=this.data).push.apply(t,e),this.update({operation:"add",operationDetailed:"append",count:e.length,index:this.data.length-e.length,items:e,newState:this.data})},e.prototype.unshift=function(){for(var t,e=[],o=arguments.length;o--;)e[o]=arguments[o];(t=this.data).unshift.apply(t,e),this.update({operation:"add",operationDetailed:"prepend",count:e.length,items:e,index:0,newState:this.data})},e.prototype.pop=function(){var t=this.data.pop();return this.update({operation:"remove",operationDetailed:"removeRight",count:1,index:this.data.length,items:[t],newState:this.data}),t},e.prototype.merge=function(t){for(var e=0;e<t.length;e++)this.data[e]!==t[e]&&(this.length>e?this.set(e,t[e]):this.push(t[e]));this.length>t.length&&this.removeRight(this.length-t.length)},e.prototype.removeRight=function(t){var e=this.data.splice(this.length-t,t);this.update({operation:"remove",operationDetailed:"removeRight",count:t,index:this.length-t,items:e,newState:this.data})},e.prototype.removeLeft=function(t){var e=this.data.splice(0,t);this.update({operation:"remove",operationDetailed:"removeLeft",count:t,index:0,items:e,newState:this.data})},e.prototype.remove=function(t){var e=this.data.indexOf(t);-1!==e&&(this.data.splice(e,1),this.update({operation:"remove",operationDetailed:"remove",count:1,index:e,items:[t],newState:this.data}))},e.prototype.clear=function(){var t=this.data;this.data=[],this.update({operation:"remove",operationDetailed:"clear",count:t.length,index:0,items:t,newState:this.data})},e.prototype.shift=function(){var t=this.data.shift();return this.update({operation:"remove",operationDetailed:"removeLeft",items:[t],count:1,index:0,newState:this.data}),t},e.prototype.toArray=function(){return this.data.slice()},e.prototype.filter=function(t,e){return new n(this,t,e)},e.prototype.forEach=function(t,e){return this.data.forEach(t,e)},e.prototype.toDataSource=function(){var e=new t(this.data);return this.listen(function(t){e.update(t.newState)}),e},e.prototype.update=function(t){for(var e=0,o=this.listeners;e<o.length;e+=1)(0,o[e])(t)},Object.defineProperties(e.prototype,o);var n=function(t){function e(e,o,n){var r=this,i=e.data.filter(o);t.call(this,i),this.parent=e,this.viewFilter=o,e.listen(function(t){var e,o,n;switch(t.operationDetailed){case"removeLeft":case"removeRight":case"remove":case"clear":for(var i=0,a=t.items;i<a.length;i+=1)r.remove(a[i]);break;case"prepend":n=t.items.filter(r.viewFilter),(e=r).unshift.apply(e,n);break;case"append":n=t.items.filter(r.viewFilter),(o=r).push.apply(o,n);break;case"swap":var c=r.data.indexOf(t.items[0]),s=r.data.indexOf(t.items[1]);-1!==c&&-1!==s&&r.swap(c,s);break;case"replace":var p=r.data.indexOf(t.target);-1!==p&&(r.viewFilter(t.items[0])?r.set(p,t.items[0]):r.remove(t.target))}},n)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e.prototype.updateFilter=function(t){this.viewFilter!==t&&(this.viewFilter=t,this.refresh())},e.prototype.refresh=function(){var t;this.clear();var e=this.parent.data.filter(this.viewFilter);(t=this).push.apply(t,e)},e}(e),r=function(t){this.data=t};r.prototype.deleteNext=function(){if(this.next){var t=this.next.next;this.next.next=void 0,this.next.previous=void 0,this.next=t,this.next&&(this.next.previous=this)}},r.prototype.deletePrevious=function(){if(this.previous){var t=this.previous.previous;this.previous.next=void 0,this.previous.previous=void 0,this.previous=t,this.previous&&(this.previous.next=this)}};var i=function(t){var e=this;void 0===t&&(t=[]),this.length=0,t.forEach(function(t){return e.append(t)})};i.prototype.find=function(t){for(var e=this.rootNode;e&&!t(e);)e=e.next;return e},i.prototype.append=function(t){return this.rootNode||this.lastNode?(this.lastNode.next=new r(t),this.lastNode.next.previous=this.lastNode,this.lastNode=this.lastNode.next):this.rootNode=this.lastNode=new r(t),this.length++,t},i.prototype.forEach=function(t){this.find(function(e){return t(e.data),!1})},i.prototype.prepend=function(t){return this.rootNode||this.lastNode?(this.rootNode.previous=new r(t),this.rootNode.previous.next=this.rootNode,this.rootNode=this.rootNode.previous):this.rootNode=this.lastNode=new r(t),this.length++,t},i.prototype.remove=function(t){if(t===this.rootNode.data)this.rootNode=this.rootNode.next,this.length--;else{var e=this.find(function(e){return e.next&&e.next.data===t});e&&(e.next===this.lastNode&&(this.lastNode=e),e.deleteNext(),this.length--)}};var a=function(){for(var t=[],e=arguments.length;e--;)t[e]=arguments[e];this.cancelables=new i(t),this._isCancelled=!1},c={isCanceled:{configurable:!0}};c.isCanceled.get=function(){return this._isCancelled},a.prototype.addCancelable=function(t){return this.throwIfCancelled("attempting to add cancellable to token that is already cancelled"),this.cancelables.append(t),this.cancelables.length>200&&console.log("potential memory leak: cancellation token has over 200 clean up calls"),this},a.prototype.removeCancelable=function(t){return this.throwIfCancelled("attempting to remove cancellable from token that is already cancelled"),this.cancelables.remove(t),this},a.prototype.addDisposable=function(t){return this.addCancelable(function(){return t.dispose()}),this},a.prototype.callIfNotCancelled=function(t){this.isCanceled||t()},a.prototype.setTimeout=function(t,e){var o=this;void 0===e&&(e=0);var n=setTimeout(function(){o.removeCancelable(r),t()},e),r=function(){return clearTimeout(n)};this.addCancelable(r)},a.prototype.setInterval=function(t,e){var o=setInterval(t,e);this.addCancelable(function(){return clearInterval(o)})},a.prototype.requestAnimationFrame=function(t){var e=requestAnimationFrame(t);this.addCancelable(function(){return cancelAnimationFrame(e)})},a.prototype.animationLoop=function(t){var e=requestAnimationFrame(function o(n){t(n),e=requestAnimationFrame(o)});this.addCancelable(function(){return cancelAnimationFrame(e)})},a.prototype.throwIfCancelled=function(t){if(this.isCanceled)throw new Error(t||"cancellation token is cancelled")},a.prototype.chain=function(t,e){return void 0===e&&(e=!1),e&&t.chain(this,!1),this.addCancelable(function(){return t.cancel()}),this},a.prototype.registerDomEvent=function(t,e,o){return t.addEventListener(e,o),this.addCancelable(function(){return t.removeEventListener(e,o)}),this},a.prototype.cancel=function(){this.isCanceled||(this._isCancelled=!0,this.cancelables.forEach(function(t){return t()}),this.cancelables=void 0)},Object.defineProperties(a.prototype,c);var s=Symbol("owner"),p=function(t,e){var o,n;this.onDispose=t.onDispose,this.onAttach=t.onAttach,this.onDetach=t.onDetach,this.domNodeName=e,this.template=t.template,this.cancellationToken=new a,this.node=this.create(t),this.initialize(t),null===(n=(o=t).onCreate)||void 0===n||n.call(o,this)};p.prototype.initialize=function(t){this.node instanceof Text||(this.children=[]),this.createEventHandlers(["drag","name","dragstart","dragend","dragexit","dragover","dragenter","dragleave","blur","focus","click","dblclick","keydown","keyhit","keyup","mousedown","mouseup","mouseenter","mouseleave","mousewheel"],t);var e=Object.keys(t).filter(function(t){return t.startsWith("x-")||t.startsWith("data-")});this.bindProps(["id","draggable","tabindex","style","role","contentEditable"].concat(e),t),t.class&&this.handleClass(t.class),t.repeatModel&&this.handleRepeat(t.repeatModel)},p.prototype.bindProps=function(t,e){for(var o=0,n=t;o<n.length;o+=1){var r=n[o];e[r]&&this.assignStringSourceToAttribute(e[r],r)}},p.prototype.createEventHandlers=function(e,o){var n=this;if(!(this.node instanceof Text))for(var r=function(){var e=a[i],r="on"+e[0].toUpperCase()+e.slice(1),c=void 0;Object.defineProperty(n,r,{get:function(){return c||(c=new t),c},set:function(){throw new Error(r+" is read only")}}),o[r]&&(o[r]instanceof t?n[r].listen(o[r].update.bind(o.onClick),n.cancellationToken):"function"==typeof o[r]&&n[r].listen(o[r],n.cancellationToken)),n.cancellationToken.registerDomEvent(n.node,e,function(t){return n[r].update(t)})},i=0,a=e;i<a.length;i+=1)r()},p.prototype.handleRepeat=function(t){var o,n=this;this.repeatData=t instanceof e?t:new e(t),this.repeatData.length&&((o=this.children).push.apply(o,this.repeatData.toArray().map(function(t){return n.template.generate(t)})),this.render()),this.repeatData.listen(function(t){var e,o,r;switch(t.operationDetailed){case"swap":var i=n.children[t.index2];n.children[t.index2]=n.children[t.index],n.children[t.index]=i;break;case"append":(e=n.children).push.apply(e,t.items.map(function(t){return n.template.generate(t)}));break;case"prepend":(o=n.children).unshift.apply(o,t.items.map(function(t){return n.template.generate(t)}));break;case"remove":case"removeLeft":case"removeRight":case"clear":n.children.splice(t.index,t.count);break;default:n.children.length=0,(r=n.children).push.apply(r,n.repeatData.toArray().map(function(t){return n.template.generate(t)}))}n.render()})},p.prototype.render=function(){var t=this;this.rerenderPending||this.node instanceof Text||(this.cancellationToken.setTimeout(function(){for(var e=0;e<t.children.length;e++){if(t.node.childNodes.length<=e){t.addChildrenDom(t.children.slice(e,t.children.length));break}if(t.node.childNodes[e][s]!==t.children[e]){if(!t.children.includes(t.node.childNodes[e][s])){var o=t.node.childNodes[e];o.remove(),o[s].dispose(),e--;continue}var n=t.getChildIndex(t.children[e].node);-1!==n?t.swapChildrenDom(e,n):t.addDomNodeAt(t.children[e].node,e)}}for(;t.node.childNodes.length>t.children.length;){var r=t.node.childNodes[t.node.childNodes.length-1];t.node.removeChild(r),r[s].dispose()}t.rerenderPending=!1}),this.rerenderPending=!0)},p.prototype.assignStringSourceToAttribute=function(t,e){var o=this;this.node instanceof Text||("string"==typeof t?this.node.setAttribute(e,t):(t.value&&this.node.setAttribute(e,t.value),t.unique(this.cancellationToken).listen(function(t){return o.node.setAttribute(e,t)},this.cancellationToken)))},p.prototype.handleAttach=function(){var t;if(this.node.isConnected){null===(t=this.onAttach)||void 0===t||t.call(this,this);for(var e=0,o=this.node.childNodes;e<o.length;e+=1)o[e][s].handleAttach()}},p.prototype.handleDetach=function(){var t;if(!this.node.isConnected){null===(t=this.onDetach)||void 0===t||t.call(this,this);for(var e=0,o=this.node.childNodes;e<o.length;e+=1){var n=o[e];n[s]&&n[s].handleDetach()}}},p.prototype.handleClass=function(e){var o=this;if(!(this.node instanceof Text))if("string"==typeof e)this.node.className=e;else if(e instanceof t)e.value&&(Array.isArray(e.value)?(this.node.className=e.value.join(" "),e.unique(this.cancellationToken).listen(function(){o.node.className=e.value.join(" ")},this.cancellationToken)):(this.node.className=e.value,e.unique(this.cancellationToken).listen(function(){o.node.className=e.value},this.cancellationToken))),e.unique(this.cancellationToken).listen(function(t){return o.node.className=t},this.cancellationToken);else{var n=e.reduce(function(t,e){return"string"==typeof e?t+" "+e:e.value?t+" "+e.value:t},"");this.node.className=n;for(var r=0,i=e;r<i.length;r+=1){var a=i[r];a instanceof t&&a.unique(this.cancellationToken).listen(function(t){var n=e.reduce(function(t,e){return"string"==typeof e?t+" "+e:e.value?t+" "+e.value:t},"");o.node.className=n},this.cancellationToken)}}},p.prototype.resolveStringSource=function(t){return"string"==typeof t?t:t.value},p.prototype.create=function(t){var e=document.createElement(this.domNodeName);return e[s]=this,e},p.prototype.getChildIndex=function(t){for(var e=0,o=0,n=t.childNodes;o<n.length;o+=1){if(n[o]===t)return e;e++}return-1},p.prototype.hasChild=function(t){if(this.node instanceof Text)throw new Error("Text nodes don't have children");for(var e=0,o=t.children;e<o.length;e+=1)if(o[e]===t)return!0;return!1},p.prototype.addChildrenDom=function(t){if(this.node instanceof Text)throw new Error("Text nodes don't have children");for(var e=0,o=t;e<o.length;e+=1){var n=o[e];this.node.appendChild(n.node),n.handleAttach()}},p.prototype.swapChildrenDom=function(t,e){if(this.node instanceof Text)throw new Error("Text nodes don't have children");if(t!==e){var o=this.node.children[t],n=this.node.children[e];o.remove(),n.remove(),t<e?(this.addDomNodeAt(n,t),this.addDomNodeAt(o,e)):(this.addDomNodeAt(o,e),this.addDomNodeAt(n,t))}},p.prototype.addDomNodeAt=function(t,e){if(this.node instanceof Text)throw new Error("Text nodes don't have children");e>=this.node.childElementCount?(this.node.appendChild(t),t[s].handleAttach()):(this.node.insertBefore(t,this.node.children[e]),t[s].handleAttach())},p.prototype.remove=function(){this.hasParent()&&this.node.parentElement[s].removeChild(this.node)},p.prototype.hasParent=function(){return!!this.node.parentElement},p.prototype.isConnected=function(){return this.node.isConnected},p.prototype.removeChild=function(t){var e=this.children.indexOf(t);-1!==e&&this.children.splice(e,1),this.render()},p.prototype.removeChildAt=function(t){this.children.splice(t,1),this.render()},p.prototype.swapChildren=function(t,e){if(t!==e){var o=this.children[t];this.children[t]=this.children[e],this.children[e]=o,this.render()}},p.prototype.clearChildren=function(){if(this.node instanceof Text)throw new Error("Text nodes don't have children");this.children.length=0,this.render()},p.prototype.addChild=function(t){if(this.node instanceof Text)throw new Error("Text nodes don't have children");t instanceof u||(t=this.childNodeToAurum(t),this.children.push(t),this.render())},p.prototype.childNodeToAurum=function(e){return"string"==typeof e||e instanceof t?e=new l({text:e}):e instanceof p||(e=new l({text:e.toString()})),e},p.prototype.addChildAt=function(t,e){if(this.node instanceof Text)throw new Error("Text nodes don't have children");t instanceof u||(t=this.childNodeToAurum(t),this.children.splice(e,0,t),this.render())},p.prototype.addChildren=function(t){if(this.node instanceof Text)throw new Error("Text nodes don't have children");if(0!==t.length)for(var e=0,o=t;e<o.length;e+=1)this.addChild(o[e])},p.prototype.dispose=function(){this.internalDispose(!0)},p.prototype.internalDispose=function(t){var e;this.cancellationToken.cancel(),t&&this.remove();for(var o=0,n=this.node.childNodes;o<n.length;o+=1){var r=n[o];r[s]&&r[s].internalDispose(!1)}delete this.node[s],delete this.node,null===(e=this.onDispose)||void 0===e||e.call(this,this)};var u=function(t){function e(e){t.call(this,e,"template"),this.ref=e.ref,this.generate=e.generator}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),l=function(e){function o(o){var n=this;e.call(this,o,"textNode"),o.text instanceof t&&o.text.listen(function(t){return n.node.textContent=t},this.cancellationToken)}return e&&(o.__proto__=e),(o.prototype=Object.create(e&&e.prototype)).constructor=o,o.prototype.create=function(t){var e=document.createTextNode(this.resolveStringSource(t.text));return e[s]=this,e},o}(p),h=function(t){function e(e){t.call(this,e,"a"),this.bindProps(["href","target"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),d=function(t){function e(e){t.call(this,e,"abbr")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),f=function(t){function e(e){t.call(this,e,"area")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),y=function(t){function e(e){t.call(this,e,"article")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),v=function(t){function e(e){t.call(this,e,"aside")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),_=function(t){function e(e){t.call(this,e,"audio"),this.bindProps(["controls","autoplay","loop","muted","preload","src"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),m=function(t){function e(e){t.call(this,e,"b")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),x=function(t){function e(e){t.call(this,e,"br")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),b=function(t){function e(e){t.call(this,e,"button"),this.bindProps(["disabled"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),g=function(t){function e(e){t.call(this,e,"canvas"),this.bindProps(["width","height"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),w=function(t){function e(e){t.call(this,e,"data"),this.bindProps(["datalue"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),O=function(t){function e(e){t.call(this,e,"details")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),j=function(t){function e(e){t.call(this,e,"div")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),T=function(t){function e(e){t.call(this,e,"em")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),N=function(t){function e(e){t.call(this,e,"footer")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),C=function(t){function e(e){t.call(this,e,"form")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),S=function(t){function e(e){t.call(this,e,"h1")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),A=function(t){function e(e){t.call(this,e,"h2")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),D=function(t){function e(e){t.call(this,e,"h3")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),k=function(t){function e(e){t.call(this,e,"h4")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),E=function(t){function e(e){t.call(this,e,"h5")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),P=function(t){function e(e){t.call(this,e,"h6")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),I=function(t){function e(e){t.call(this,e,"header")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),q=function(t){function e(e){t.call(this,e,"heading")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),F=function(t){function e(e){t.call(this,e,"i")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),R=function(t){function e(e){t.call(this,e,"iframe"),this.bindProps(["src","srcdoc","width","height","allow","allowFullscreen","allowPaymentRequest"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),V=function(t){function e(e){t.call(this,e,"img"),this.bindProps(["src","alt","width","height","referrerPolicy","sizes","srcset","useMap"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),L=function(t){function e(e){var o,n=this;t.call(this,e,"input"),e.inputValueSource?e.inputValueSource.unique().listenAndRepeat(function(t){return n.node.value=t},this.cancellationToken):this.node.value=null!=(o=e.initialValue)?o:"",this.bindProps(["placeholder","readonly","disabled","accept","alt","autocomplete","autofocus","checked","defaultChecked","formAction","formEnctype","formMethod","formNoValidate","formTarget","max","maxLength","min","minLength","pattern","multiple","required","type"],e),this.createEventHandlers(["input","change"],e),e.inputValueSource&&this.onInput.map(function(t){return n.node.value}).pipe(e.inputValueSource)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),H=function(t){function e(e){t.call(this,e,"label"),this.bindProps(["for"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),M=function(t){function e(e){t.call(this,e,"li")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),z=function(t){function e(e){t.call(this,e,"link"),this.bindProps(["href","rel","media","as","disabled","type"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),B=function(t){function e(e){t.call(this,e,"nav")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),U=function(t){function e(e){t.call(this,e,"noscript")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),W=function(t){function e(e){t.call(this,e,"ol")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),Q=function(t){function e(e){t.call(this,e,"option")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),G=function(t){function e(e){t.call(this,e,"p")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),J=function(t){function e(e){t.call(this,e,"pre")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),K=function(t){function e(e){t.call(this,e,"progress"),this.bindProps(["max","value"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),X=function(t){function e(e){t.call(this,e,"q")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),Y=function(t){function e(e){t.call(this,e,"script"),this.bindProps(["src","async","defer","integrity","noModule","type"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),Z=function(t){function e(e){var o,n=this;t.call(this,e,"select"),this.createEventHandlers(["change"],e),e.selectedIndexSource?e.selectedIndexSource.unique().listenAndRepeat(function(t){return n.node.selectedIndex=t},this.cancellationToken):this.node.selectedIndex=null!=(o=e.initialSelection)?o:0,e.selectedIndexSource&&this.onChange.map(function(t){return n.node.selectedIndex}).pipe(e.selectedIndexSource)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),$=function(t){function e(e){t.call(this,e,"source"),this.bindProps(["src","srcSet","media","sizes","type"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),tt=function(t){function e(e){t.call(this,e,"span")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),et=function(t){function e(e){var o=this;t.call(this,e,"switch"),this.firstRender=!0,this.templateMap=e.templateMap,this.renderSwitch(e.state.value),e.state.listen(function(t){o.renderSwitch(t)},this.cancellationToken)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e.prototype.renderSwitch=function(t){var e;if(t!==this.lastValue||this.firstRender)if(this.lastValue=t,this.firstRender=!1,this.clearChildren(),null!=t){var o=null!=(e=this.templateMap[t.toString()])?e:this.template;if(o){var n=o.generate();this.addChild(n)}}else if(this.template){var r=this.template.generate();this.addChild(r)}},e}(p),ot=function(e){function o(o){var n=new t(location.hash.substring(1));e.call(this,Object.assign(Object.assign({},o),{state:n})),window.addEventListener("hashchange",function(){var t=location.hash.substring(1);t.includes("?")?n.update(t.substring(0,t.indexOf("?"))):n.update(t)})}return e&&(o.__proto__=e),(o.prototype=Object.create(e&&e.prototype)).constructor=o,o}(et),nt=function(t){function e(e){var o=this;t.call(this,e,"suspense"),e.loader().then(function(t){o.clearChildren(),o.addChild(t)})}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),rt=function(t){function e(e){t.call(this,e,"style"),this.bindProps(["media"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),it=function(t){function e(e){t.call(this,e,"sub")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),at=function(t){function e(e){t.call(this,e,"summary")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),ct=function(t){function e(e){t.call(this,e,"sup")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),st=function(t){function e(e){t.call(this,e,"svg"),this.bindProps(["width","height"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),pt=function(t){function e(e){t.call(this,e,"table")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),ut=function(t){function e(e){t.call(this,e,"tbody")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),lt=function(t){function e(e){t.call(this,e,"td")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),ht=function(t){function e(e){var o,n,r,i=this;t.call(this,e,"textArea"),e.inputValueSource?(this.node.value=null!=(n=null!=(o=e.initialValue)?o:e.inputValueSource.value)?n:"",e.inputValueSource.unique().listen(function(t){return i.node.value=t},this.cancellationToken)):this.node.value=null!=(r=e.initialValue)?r:"",this.bindProps(["placeholder","readonly","disabled","rows","wrap","autocomplete","autofocus","max","maxLength","min","minLength","required","type"],e),this.createEventHandlers(["input","change"],e),e.inputValueSource&&this.onInput.map(function(t){return i.node.value}).pipe(e.inputValueSource)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),dt=function(t){function e(e){t.call(this,e,"tfoot")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),ft=function(t){function e(e){t.call(this,e,"th")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),yt=function(t){function e(e){t.call(this,e,"thead")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),vt=function(t){function e(e){t.call(this,e,"time"),this.bindProps(["datetime"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),_t=function(t){function e(e){t.call(this,e,"title")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),mt=function(t){function e(e){t.call(this,e,"tr")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),xt=function(t){function e(e){t.call(this,e,"ul")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),bt=function(t){function e(e){t.call(this,e,"video"),this.bindProps(["controls","autoplay","loop","muted","preload","src","poster","width","height"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(p),gt={button:b,div:j,input:L,li:M,span:tt,style:rt,ul:xt,p:G,img:V,link:z,canvas:g,a:h,article:y,br:x,form:C,label:H,ol:W,pre:J,progress:K,table:pt,td:lt,tr:mt,th:ft,textarea:ht,h1:S,h2:A,h3:D,h4:k,h5:E,h6:P,header:I,footer:N,nav:B,b:m,i:F,script:Y,abbr:d,area:f,aside:v,audio:Audio,em:T,heading:q,iframe:R,noscript:U,option:Q,q:X,select:Z,source:$,title:_t,video:bt,tbody:ut,tfoot:dt,thead:yt,summary:at,details:O,sub:it,sup:ct,svg:st,data:w,time:vt,template:u},wt=function(){};wt.attach=function(t,e){if(e[s])throw new Error("This node is already managed by aurum and cannot be used");e.appendChild(t.node),t.handleAttach(),e[s]=t},wt.detach=function(t){t[s]&&(t[s].node.remove(),t[s].handleDetach(),t[s].dispose(),t[s]=void 0)},wt.factory=function(t,e){for(var o,n=[],r=arguments.length-2;r-- >0;)n[r]=arguments[r+2];if("string"==typeof t){var i=t;if(void 0===(t=gt[t]))throw new Error("Node "+i+" does not exist or is not supported")}for(var a,c,s=(o=[]).concat.apply(o,n).filter(function(t){return t}),p={},l=!1,h=0,d=s;h<d.length;h+=1){var f=d[h];"string"!=typeof f&&(f instanceof u&&(!f.ref||"default"===f.ref)&&(a=f),f.ref&&(p[f.ref]=f,l=!0))}return e=null!=e?e:{},a&&(e.template=a),l&&(e.templateMap=p),(c=t.prototype?new t(e||{}):t(e||{})).addChildren(s),c},exports.A=h,exports.Abbr=d,exports.Area=f,exports.Article=y,exports.Aside=v,exports.Audio=_,exports.AurumElement=p,exports.Template=u,exports.TextNode=l,exports.B=m,exports.Br=x,exports.Button=b,exports.Canvas=g,exports.Data=w,exports.Details=O,exports.Div=j,exports.Em=T,exports.Footer=N,exports.Form=C,exports.H1=S,exports.H2=A,exports.H3=D,exports.H4=k,exports.H5=E,exports.H6=P,exports.Header=I,exports.Heading=q,exports.I=F,exports.IFrame=R,exports.Img=V,exports.Input=L,exports.Label=H,exports.Li=M,exports.Link=z,exports.Nav=B,exports.NoScript=U,exports.Ol=W,exports.Option=Q,exports.P=G,exports.Pre=J,exports.Progress=K,exports.Q=X,exports.Script=Y,exports.Select=Z,exports.Source=$,exports.Span=tt,exports.AurumRouter=ot,exports.Suspense=nt,exports.Switch=et,exports.Style=rt,exports.Sub=it,exports.Summary=at,exports.Sup=ct,exports.Svg=st,exports.Table=pt,exports.Tbody=ut,exports.Td=lt,exports.TextArea=ht,exports.Tfoot=dt,exports.Th=ft,exports.Thead=yt,exports.Time=vt,exports.Title=_t,exports.Tr=mt,exports.Ul=xt,exports.Video=bt,exports.DataSource=t,exports.ArrayDataSource=e,exports.FilteredArrayView=n,exports.Aurum=wt,exports.CancellationToken=a;
//# sourceMappingURL=aurumjs.js.map
