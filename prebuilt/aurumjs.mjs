var t=function(t){var e=this;this.subscribeChannel=[],this.subscribeOnceChannel=[],this.throttleCount=0,this.onAfterFire=[],t&&(t.observable&&this.makeObservable(),t.cancellationToken&&t.cancellationToken.addCancelable(function(){return e.cancelAll()}),t.throttled&&(this.throttle=t.throttled))},e={subscriptions:{configurable:!0},oneTimeSubscriptions:{configurable:!0}};e.subscriptions.get=function(){return this.subscribeChannel.length},e.oneTimeSubscriptions.get=function(){return this.subscribeOnceChannel.length},t.prototype.linkEvent=function(t){this.linkedEvents||(this.linkedEvents=[]),this.linkedEvents.push(t)},t.prototype.unlinkEvent=function(t){if(!this.linkedEvents||!this.linkedEvents.includes(t))throw new Error("Cannot unlink event that is not linked");this.linkedEvents.splice(this.linkedEvents.indexOf(t),1)},t.prototype.makeObservable=function(){this.onSubscribe||(this.onSubscribe=new t,this.onSubscribeOnce=new t,this.onCancelAll=new t,this.onCancel=new t)},t.prototype.swapSubscriptions=function(t){var e=this.subscribeChannel,n=this.subscribeOnceChannel;this.subscribeChannel=t.subscribeChannel,this.subscribeOnceChannel=t.subscribeOnceChannel,t.subscribeChannel=e,t.subscribeOnceChannel=n},t.prototype.subscribe=function(t,e){return this.onSubscribe&&this.onSubscribe.fire(),this.createSubscription(t,this.subscribeChannel,e).facade},t.prototype.hasSubscriptions=function(){return this.subscriptions>0||this.oneTimeSubscriptions>0},t.prototype.subscribeOnce=function(t){var e=this;return this.onSubscribeOnce&&this.onSubscribeOnce.fire(),new Promise(function(n){e.createSubscription(function(t){return n(t)},e.subscribeOnceChannel,t)})},t.prototype.cancelAll=function(){void 0!==this.onCancelAll&&this.onCancelAll.fire()},t.prototype.fire=function(t,e,n,o,i){if(!this.throttle||this.throttleCount++%this.throttle==0){this.isFiring=!0;for(var r=this.subscribeChannel.length,a=0;a<r;a++)this.subscribeChannel[a].callback(t);if(r=this.subscribeOnceChannel.length,this.subscribeOnceChannel.length>0){for(var s=0;s<r;s++)this.subscribeOnceChannel[s].callback(t);this.subscribeOnceChannel.length=0}if(this.linkedEvents)for(var c=0,h=this.linkedEvents;c<h.length;c+=1)h[c].fire(t,e,n,o,i);this.isFiring=!1,this.onAfterFire.length>0&&(this.onAfterFire.forEach(function(t){return t()}),this.onAfterFire.length=0)}},t.prototype.createSubscription=function(t,e,n){var o=this,i={callback:t},r={cancel:function(){o.cancel(i,e)}};return void 0!==n&&n.addCancelable(function(){return o.cancel(i,e)}),e.push(i),{subscription:i,facade:r}},t.prototype.cancel=function(t,e){var n=this,o=e.indexOf(t);o>=0&&(this.isFiring?this.onAfterFire.push(function(){return n.cancel(t,e)}):e.splice(o,1))},Object.defineProperties(t.prototype,e);var n=function(t){this.value=t,this.listeners=[]};n.prototype.update=function(t){this.value=t;for(var e=0,n=this.listeners;e<n.length;e+=1)(0,n[e])(t)},n.prototype.listen=function(t,e){var n,o=this;this.listeners.push(t);var i=function(){var e=o.listeners.indexOf(t);-1!==e&&o.listeners.splice(e,1)};return null===(n=e)||void 0===n||n.addCancelable(function(){i()}),i},n.prototype.filter=function(t,e){var o=new n;return this.listen(function(e){t(e)&&o.update(e)},e),o},n.prototype.pipe=function(t,e){this.listen(function(e){return t.update(e)},e)},n.prototype.map=function(t,e){var o=new n(t(this.value));return this.listen(function(e){o.update(t(e))},e),o},n.prototype.unique=function(t){var e=new n;return this.listen(function(t){t!==e.value&&e.update(t)},t),e},n.prototype.reduce=function(t,e,o){var i=new n(e);return this.listen(function(e){return i.update(t(i.value,e))},o),i},n.prototype.aggregate=function(t,e,o){var i=this,r=new n(e(this.value,t.value));return this.listen(function(){return r.update(e(i.value,t.value))},o),t.listen(function(){return r.update(e(i.value,t.value))},o),r},n.prototype.combine=function(t,e){var o=new n;return this.pipe(o,e),t.pipe(o,e),o},n.prototype.pick=function(t,e){var o,i=new n(null===(o=this.value)||void 0===o?void 0:o[t]);return this.listen(function(e){i.update(null!=e?e[t]:e)},e),i},n.prototype.cancelAll=function(){this.listeners.length=0};var o=function(e){this.data=e?e.slice():[],this.onChange=new t},i={length:{configurable:!0}};i.length.get=function(){return this.data.length},o.prototype.getData=function(){return this.data.slice()},o.prototype.get=function(t){return this.data[t]},o.prototype.set=function(t,e){var n=this.data[t];n!==e&&(this.data[t]=e,this.onChange.fire({operation:"replace",target:n,count:1,index:t,items:[e],newState:this.data}))},o.prototype.swap=function(t,e){if(t!==e){var n=this.data[t],o=this.data[e];this.data[e]=n,this.data[t]=o,this.onChange.fire({operation:"swap",index:t,index2:e,items:[n,o],newState:this.data})}},o.prototype.swapItems=function(t,e){if(t!==e){var n=this.data.indexOf(t),o=this.data.indexOf(e);-1!==n&&-1!==o&&(this.data[o]=t,this.data[n]=e),this.onChange.fire({operation:"swap",index:n,index2:o,items:[t,e],newState:this.data})}},o.prototype.push=function(){for(var t,e=[],n=arguments.length;n--;)e[n]=arguments[n];(t=this.data).push.apply(t,e),this.onChange.fire({operation:"append",count:e.length,index:this.data.length-e.length,items:e,newState:this.data})},o.prototype.unshift=function(){for(var t,e=[],n=arguments.length;n--;)e[n]=arguments[n];(t=this.data).unshift.apply(t,e),this.onChange.fire({operation:"prepend",count:e.length,items:e,index:0,newState:this.data})},o.prototype.pop=function(){var t=this.data.pop();return this.onChange.fire({operation:"remove",count:1,index:this.data.length,items:[t],newState:this.data}),t},o.prototype.merge=function(t){for(var e=0;e<t.length;e++)this.data[e]!==t[e]&&(this.length>e?this.set(e,t[e]):this.push(t[e]));this.length>t.length&&this.removeRight(this.length-t.length)},o.prototype.removeRight=function(t){var e=this.data.splice(this.length-t,t);this.onChange.fire({operation:"remove",count:t,index:this.length-t,items:e,newState:this.data})},o.prototype.removeLeft=function(t){var e=this.data.splice(0,t);this.onChange.fire({operation:"remove",count:t,index:0,items:e,newState:this.data})},o.prototype.remove=function(t){var e=this.data.indexOf(t);-1!==e&&(this.data.splice(e,1),this.onChange.fire({operation:"remove",count:1,index:e,items:[t],newState:this.data}))},o.prototype.clear=function(){var t=this.data;this.data=[],this.onChange.fire({operation:"remove",count:t.length,index:0,items:t,newState:this.data})},o.prototype.shift=function(){var t=this.data.shift();return this.onChange.fire({operation:"remove",items:[t],count:1,index:0,newState:this.data}),t},o.prototype.toArray=function(){return this.data.slice()},o.prototype.filter=function(t,e){return new r(this,t,e)},o.prototype.forEach=function(t,e){return this.data.forEach(t,e)},o.prototype.toDataSource=function(){var t=new n(this.data);return this.onChange.subscribe(function(e){t.update(e.newState)}),t},Object.defineProperties(o.prototype,i);var r=function(t){function e(e,n,o){var i=this,r=e.data.filter(n);t.call(this,r),this.parent=e,this.viewFilter=n,e.onChange.subscribe(function(t){var e,n,o;switch(t.operation){case"remove":for(var r=0,a=t.items;r<a.length;r+=1)i.remove(a[r]);break;case"prepend":o=t.items.filter(i.viewFilter),(e=i).unshift.apply(e,o);break;case"append":o=t.items.filter(i.viewFilter),(n=i).push.apply(n,o);break;case"swap":var s=i.data.indexOf(t.items[0]),c=i.data.indexOf(t.items[1]);-1!==s&&-1!==c&&i.swap(s,c);break;case"replace":var h=i.data.indexOf(t.target);-1!==h&&(i.viewFilter(t.items[0])?i.set(h,t.items[0]):i.remove(t.target))}},o)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e.prototype.updateFilter=function(t){this.viewFilter!==t&&(this.viewFilter=t,this.refresh())},e.prototype.refresh=function(){var t;this.clear();var e=this.parent.data.filter(this.viewFilter);(t=this).push.apply(t,e)},e}(o),a=function(t){this.data=t};a.prototype.deleteNext=function(){if(this.next){var t=this.next.next;this.next.next=void 0,this.next.previous=void 0,this.next=t,this.next.previous=this}},a.prototype.deletePrevious=function(){this.previous&&(this.previous=this.previous.previous,this.previous.next=void 0,this.previous.previous=void 0)};var s=function(t){var e=this;void 0===t&&(t=[]),this.length=0,t.forEach(function(t){return e.append(t)})};s.prototype.find=function(t){for(var e=this.rootNode;e&&!t(e);)e=e.next;return e},s.prototype.append=function(t){return this.rootNode||this.lastNode?(this.lastNode.next=new a(t),this.lastNode.next.previous=this.lastNode,this.lastNode=this.lastNode.next):this.rootNode=this.lastNode=new a(t),this.length++,t},s.prototype.forEach=function(t){this.find(function(e){return t(e.data),!1})},s.prototype.prepend=function(t){return this.rootNode||this.lastNode?(this.rootNode.previous=new a(t),this.rootNode.previous.next=this.rootNode,this.rootNode=this.rootNode.previous):this.rootNode=this.lastNode=new a(t),this.length++,t},s.prototype.remove=function(t){if(t===this.rootNode.data)this.rootNode=this.rootNode.next,this.length--;else{var e=this.find(function(e){return e.next&&e.next.data===t});e&&(e.next===this.lastNode&&(this.lastNode=e),e.deleteNext(),this.length--)}};var c=function(){for(var t=[],e=arguments.length;e--;)t[e]=arguments[e];this.cancelables=new s(t),this._isCancelled=!1},h={isCanceled:{configurable:!0}};h.isCanceled.get=function(){return this._isCancelled},c.prototype.addCancelable=function(t){return this.throwIfCancelled("attempting to add cancellable to token that is already cancelled"),this.cancelables.append(t),this.cancelables.length>200&&console.log("potential memory leak: cancellation token has over 200 clean up calls"),this},c.prototype.removeCancelable=function(t){return this.throwIfCancelled("attempting to remove cancellable from token that is already cancelled"),this.cancelables.remove(t),this},c.prototype.addDisposable=function(t){return this.addCancelable(function(){return t.dispose()}),this},c.prototype.callIfNotCancelled=function(t){this.isCanceled||t()},c.prototype.setTimeout=function(t,e){void 0===e&&(e=0);var n=setTimeout(t,e);this.addCancelable(function(){return clearTimeout(n)})},c.prototype.setInterval=function(t,e){var n=setInterval(t,e);this.addCancelable(function(){return clearInterval(n)})},c.prototype.requestAnimationFrame=function(t){var e=requestAnimationFrame(t);this.addCancelable(function(){return cancelAnimationFrame(e)})},c.prototype.animationLoop=function(t){var e=requestAnimationFrame(function n(o){t(o),e=requestAnimationFrame(n)});this.addCancelable(function(){return cancelAnimationFrame(e)})},c.prototype.throwIfCancelled=function(t){if(this.isCanceled)throw new Error(t||"cancellation token is cancelled")},c.prototype.chain=function(t,e){return void 0===e&&(e=!1),e&&t.chain(this,!1),this.addCancelable(function(){return t.cancel()}),this},c.prototype.registerDomEvent=function(t,e,n){return t.addEventListener(e,n),this.addCancelable(function(){return t.removeEventListener(e,n)}),this},c.prototype.cancel=function(){this.isCanceled||(this._isCancelled=!0,this.cancelables.forEach(function(t){return t()}),this.cancelables=void 0)},Object.defineProperties(c.prototype,h);var l=Symbol("owner"),u=function(t,e){this.domNodeName=e,this.template=t.template,this.cancellationToken=new c,this.node=this.create(t),this.initialize(t),this.node instanceof Text||(this.children=[]),t.onAttach&&t.onAttach(this)};u.prototype.initialize=function(t){this.createEventHandlers(["drag","dragstart","dragend","dragexit","dragover","dragenter","dragleave","blur","focus","click","dblclick","keydown","keyhit","keyup","mousedown, mouseup","mouseenter","mouseleave","mousewheel"],t);var e=Object.keys(t).filter(function(t){return t.startsWith("x-")||t.startsWith("data-")});this.bindProps(["id","draggable","tabindex","style","role"].concat(e),t),t.class&&this.handleClass(t.class),t.repeatModel&&this.handleRepeat(t.repeatModel)},u.prototype.bindProps=function(t,e){for(var n=0,o=t;n<o.length;n+=1){var i=o[n];e[i]&&this.assignStringSourceToAttribute(e[i],i)}},u.prototype.createEventHandlers=function(t,e){var o=this;if(!(this.node instanceof Text))for(var i=function(){var t=a[r],i="on"+t[0].toUpperCase()+t.slice(1),s=void 0;Object.defineProperty(o,i,{get:function(){return s||(s=new n),s},set:function(){throw new Error(i+" is read only")}}),e[i]&&(e[i]instanceof n?o[i].listen(e[i].update.bind(e.onClick),o.cancellationToken):"function"==typeof e[i]&&o[i].listen(e[i],o.cancellationToken)),o.cancellationToken.registerDomEvent(o.node,t,function(t){return o[i].update(t)})},r=0,a=t;r<a.length;r+=1)i()},u.prototype.handleRepeat=function(t){var e,n=this;this.repeatData=t instanceof o?t:new o(t),this.repeatData.length&&((e=this.children).push.apply(e,this.repeatData.toArray().map(function(t){return n.template.generate(t)})),this.render()),this.repeatData.onChange.subscribe(function(t){var e,o,i;switch(t.operation){case"swap":var r=n.children[t.index2];n.children[t.index2]=n.children[t.index],n.children[t.index]=r;break;case"append":(e=n.children).push.apply(e,t.items.map(function(t){return n.template.generate(t)}));break;case"prepend":(o=n.children).unshift.apply(o,t.items.map(function(t){return n.template.generate(t)}));break;case"remove":n.children.splice(t.index,t.count);break;default:n.children.length=0,(i=n.children).push.apply(i,n.repeatData.toArray().map(function(t){return n.template.generate(t)}))}n.render()})},u.prototype.render=function(){var t=this;this.rerenderPending||this.node instanceof Text||(setTimeout(function(){for(var e=0;e<t.children.length;e++){if(t.node.childNodes.length<=e){t.addChildrenDom(t.children.slice(e,t.children.length));break}if(t.node.childNodes[e][l]!==t.children[e]){if(!t.children.includes(t.node.childNodes[e][l])){t.node.childNodes[e].remove(),e--;continue}var n=t.getChildIndex(t.children[e].node);-1!==n?t.swapChildrenDom(e,n):t.addDomNodeAt(t.children[e].node,e)}}for(;t.node.childNodes.length>t.children.length;)t.node.removeChild(t.node.childNodes[t.node.childNodes.length-1]);t.rerenderPending=!1}),this.rerenderPending=!0)},u.prototype.assignStringSourceToAttribute=function(t,e){var n=this;this.node instanceof Text||("string"==typeof t?this.node.setAttribute(e,t):(t.value&&this.node.setAttribute(e,t.value),t.unique(this.cancellationToken).listen(function(t){return n.node.setAttribute(e,t)},this.cancellationToken)))},u.prototype.handleClass=function(t){var e=this;if(!(this.node instanceof Text))if("string"==typeof t)this.node.className=t;else if(t instanceof n)t.value&&(Array.isArray(t.value)?(this.node.className=t.value.join(" "),t.unique(this.cancellationToken).listen(function(){e.node.className=t.value.join(" ")},this.cancellationToken)):(this.node.className=t.value,t.unique(this.cancellationToken).listen(function(){e.node.className=t.value},this.cancellationToken))),t.unique(this.cancellationToken).listen(function(t){return e.node.className=t},this.cancellationToken);else{var o=t.reduce(function(t,e){return"string"==typeof e?t+" "+e:e.value?t+" "+e.value:t},"");this.node.className=o;for(var i=0,r=t;i<r.length;i+=1){var a=r[i];a instanceof n&&a.unique(this.cancellationToken).listen(function(n){var o=t.reduce(function(t,e){return"string"==typeof e?t+" "+e:e.value?t+" "+e.value:t},"");e.node.className=o},this.cancellationToken)}}},u.prototype.resolveStringSource=function(t){return"string"==typeof t?t:t.value},u.prototype.create=function(t){var e=document.createElement(this.domNodeName);return e[l]=this,e},u.prototype.getChildIndex=function(t){for(var e=0,n=0,o=t.childNodes;n<o.length;n+=1){if(o[n]===t)return e;e++}return-1},u.prototype.hasChild=function(t){if(this.node instanceof Text)throw new Error("Text nodes don't have children");for(var e=0,n=t.children;e<n.length;e+=1)if(n[e]===t)return!0;return!1},u.prototype.addChildrenDom=function(t){if(this.node instanceof Text)throw new Error("Text nodes don't have children");for(var e=0,n=t;e<n.length;e+=1)this.node.appendChild(n[e].node)},u.prototype.swapChildrenDom=function(t,e){if(this.node instanceof Text)throw new Error("Text nodes don't have children");if(t!==e){var n=this.node.children[t],o=this.node.children[e];n.remove(),o.remove(),t<e?(this.addDomNodeAt(o,t),this.addDomNodeAt(n,e)):(this.addDomNodeAt(n,e),this.addDomNodeAt(o,t))}},u.prototype.addDomNodeAt=function(t,e){if(this.node instanceof Text)throw new Error("Text nodes don't have children");e>=this.node.childElementCount?this.node.appendChild(t):this.node.insertBefore(t,this.node.children[e])},u.prototype.remove=function(){this.hasParent()&&this.node.parentElement[l].removeChild(this.node)},u.prototype.hasParent=function(){return!!this.node.parentElement},u.prototype.isConnected=function(){return this.node.isConnected},u.prototype.removeChild=function(t){var e=this.children.indexOf(t);-1!==e&&this.children.splice(e,1),this.render()},u.prototype.removeChildAt=function(t){this.children.splice(t,1),this.render()},u.prototype.swapChildren=function(t,e){if(t!==e){var n=this.children[t];this.children[t]=this.children[e],this.children[e]=n,this.render()}},u.prototype.clearChildren=function(){if(this.node instanceof Text)throw new Error("Text nodes don't have children");this.children.length=0,this.render()},u.prototype.addChild=function(t){if(this.node instanceof Text)throw new Error("Text nodes don't have children");t instanceof p||(t=this.childNodeToAurum(t),this.children.push(t),this.render())},u.prototype.childNodeToAurum=function(t){return("string"==typeof t||t instanceof n)&&(t=new d({text:t})),t},u.prototype.addChildAt=function(t,e){if(this.node instanceof Text)throw new Error("Text nodes don't have children");t instanceof p||(t=this.childNodeToAurum(t),this.children.splice(e,0,t),this.render())},u.prototype.addChildren=function(t){if(this.node instanceof Text)throw new Error("Text nodes don't have children");if(0!==t.length)for(var e=0,n=t;e<n.length;e+=1)this.addChild(n[e])},u.prototype.dispose=function(){this.cancellationToken.cancel(),this.remove();for(var t=0,e=this.node.childNodes;t<e.length;t+=1){var n=e[t];n[l]&&n[l].dispose()}};var p=function(t){function e(e){t.call(this,e,"template"),this.ref=e.ref,this.generate=e.generator}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),d=function(t){function e(e){var o=this;t.call(this,e,"textNode"),e.text instanceof n&&e.text.listen(function(t){return o.node.textContent=t},this.cancellationToken)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e.prototype.create=function(t){var e=document.createTextNode(this.resolveStringSource(t.text));return e[l]=this,e},e}(u),f=function(){};f.attach=function(t,e){if(e[l])throw new Error("This node is already managed by aurum and cannot be used");e.appendChild(t.node),e[l]=t},f.detach=function(t){t[l]&&(t[l].node.remove(),t[l].dispose(),t[l]=void 0)},f.factory=function(t,e){for(var n,o=[],i=arguments.length-2;i-- >0;)o[i]=arguments[i+2];if("string"!=typeof t){for(var r,a,s=(n=[]).concat.apply(n,o).filter(function(t){return t}),c={},h=!1,l=0,u=s;l<u.length;l+=1){var d=u[l];"string"!=typeof d&&(d instanceof p&&(!d.ref||"default"===d.ref)&&(r=d),d.ref&&(c[d.ref]=d,h=!0))}return e=null!=e?e:{},r&&(e.template=r),h&&(e.templateMap=c),(a=t.prototype?new t(e||{}):t(e||{})).addChildren(s),a}};var v=function(t){function e(e){t.call(this,e,"button")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),y=function(t){function e(e){t.call(this,e,"div")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),b=function(t){function e(e){var n,o,i,r=this;t.call(this,e,"input"),e.inputValueSource?(this.node.value=null!=(o=null!=(n=e.initialValue)?n:e.inputValueSource.value)?o:"",e.inputValueSource.listen(function(t){return r.node.value=t},this.cancellationToken)):this.node.value=null!=(i=e.initialValue)?i:"",this.bindProps(["placeholder"],e),this.createEventHandlers(["input","change"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),_=function(t){function e(e){t.call(this,e,"li")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),g=function(t){function e(e){t.call(this,e,"span")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),m=function(t){function e(e){t.call(this,e,"style")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),C=function(t){function e(e){t.call(this,e,"ul")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),w=function(t){function e(e){t.call(this,e,"p")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),x=function(t){function e(e){t.call(this,e,"img"),this.bindProps(["src"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),O=function(t){function e(e){t.call(this,e,"link"),this.bindProps(["href","rel"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),k=function(t){function e(e){t.call(this,e,"canvas"),this.bindProps(["width","height"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),N=function(t){function e(e){t.call(this,e,"a"),this.bindProps(["href","target"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),T=function(t){function e(e){t.call(this,e,"pre")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),j=function(t){function e(e){t.call(this,e,"br")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),S=function(t){function e(e){t.call(this,e,"form")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),A=function(t){function e(e){t.call(this,e,"label"),this.bindProps(["for"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),E=function(t){function e(e){t.call(this,e,"ol")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),F=function(t){function e(e){t.call(this,e,"pre")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),P=function(t){function e(e){t.call(this,e,"progress"),this.bindProps(["max","value"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),D=function(t){function e(e){t.call(this,e,"table")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),V=function(t){function e(e){t.call(this,e,"td")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),q=function(t){function e(e){var n,o,i,r=this;t.call(this,e,"textArea"),e.inputValueSource?(this.node.value=null!=(o=null!=(n=e.initialValue)?n:e.inputValueSource.value)?o:"",e.inputValueSource.listen(function(t){return r.node.value=t},this.cancellationToken)):this.node.value=null!=(i=e.initialValue)?i:"",this.bindProps(["placeholder"],e),this.createEventHandlers(["input","change"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),I=function(t){function e(e){t.call(this,e,"th")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),R=function(t){function e(e){t.call(this,e,"tr")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),M=function(t){function e(e){t.call(this,e,"h1")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),H=function(t){function e(e){t.call(this,e,"h2")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),L=function(t){function e(e){t.call(this,e,"h3")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),z=function(t){function e(e){t.call(this,e,"h4")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),W=function(t){function e(e){t.call(this,e,"h5")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),B=function(t){function e(e){t.call(this,e,"h6")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),U=function(t){function e(e){t.call(this,e,"header")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),G=function(t){function e(e){t.call(this,e,"footer")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),J=function(t){function e(e){t.call(this,e,"nav")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),K=function(t){function e(e){t.call(this,e,"b")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),Q=function(t){function e(e){t.call(this,e,"i")}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),X=function(t){function e(e){t.call(this,e,"script"),this.bindProps(["src"],e)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e}(u),Y=function(t){function e(e){var n=this;t.call(this,e,"switch"),this.firstRender=!0,this.templateMap=e.templateMap,this.renderSwitch(e.state.value),e.state.listen(function(t){n.renderSwitch(t)},this.cancellationToken)}return t&&(e.__proto__=t),(e.prototype=Object.create(t&&t.prototype)).constructor=e,e.prototype.renderSwitch=function(t){var e;if(t!==this.lastValue||this.firstRender)if(this.lastValue=t,this.firstRender=!1,this.clearChildren(),null!=t){var n=null!=(e=this.templateMap[t.toString()])?e:this.template;if(n){var o=n.generate();this.addChild(o)}}else if(this.template){var i=this.template.generate();this.addChild(i)}},e}(u);export{o as ArrayDataSource,r as FilteredArrayView,n as DataSource,t as EventEmitter,c as CancellationToken,f as Aurum,u as AurumElement,p as Template,d as TextNode,v as Button,y as Div,b as Input,_ as Li,g as Span,m as Style,C as Ul,w as P,x as Img,O as Link,k as Canvas,N as A,T as Article,j as Br,S as Form,A as Label,E as Ol,F as Pre,P as Progress,D as Table,V as Td,q as TextArea,I as Th,R as Tr,M as H1,H as H2,L as H3,z as H4,W as H5,B as H6,U as Header,G as Footer,J as Nav,K as B,Q as I,X as Script,Y as Switch};
//# sourceMappingURL=aurumjs.mjs.map
