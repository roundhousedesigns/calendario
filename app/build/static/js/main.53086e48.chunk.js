/*! For license information please see main.53086e48.chunk.js.LICENSE.txt */
(this["webpackJsonpreact-app"]=this["webpackJsonpreact-app"]||[]).push([[0],{148:function(e,t,a){},149:function(e,t,a){"use strict";a.r(t);var n=a(1),c=a(3),s=a.n(c),r=a(28),o=a.n(r),d=(a(73),a(8));function i(e){var t=e.name,a=e.label,c=e.inlineLabel,s=e.children;return Object(n.jsxs)("div",{className:"sidebarInput fieldGroup fieldGroup__".concat(t," ").concat(c?"inlineLabel":""),children:[a?Object(n.jsx)("label",{htmlFor:t,children:a}):null,s]})}var u=a(5),l=a(29),j=a(74),p=Object(c.createContext)({});function b(e,t){switch(t.type){case"UPDATE_OPTION":return Object(u.a)(Object(u.a)({},e),{},{viewMode:t.viewMode?t.viewMode:e.viewMode,monthCount:t.monthCount?t.monthCount:e.monthCount});case"SET_RANGE":return Object(u.a)(Object(u.a)({},e),{},{viewRange:{start:t.start,end:t.end}});case"NEXT_MONTH":return Object(u.a)(Object(u.a)({},e),{},{viewRange:{start:Object(l.default)(e.viewRange.start,1),end:Object(l.default)(e.viewRange.end,1)}});case"PREV_MONTH":return Object(u.a)(Object(u.a)({},e),{},{viewRange:{start:Object(j.default)(e.viewRange.start,1),end:Object(j.default)(e.viewRange.end,1)}});case"RESET_VIEW":return Object(u.a)(Object(u.a)({},e),{},{viewRange:O.viewRange});default:return e}}var O={viewMode:"calendar",monthCount:1,viewRange:{start:new Date,end:new Date}},h=a(20),f=Object(c.createContext)({}),v={currentPost:{id:null,post_title:"",post_status:"",post_date:"",unscheduled:null},refetch:!1,dateRange:{start:"",end:""},unscheduled:[],scheduled:[]};function m(e,t){switch(t.type){case"SET_SCHEDULED":var a=t.posts;return a.forEach((function(e,t){a[t].post_date=new Date(e.post_date)})),Object(u.a)(Object(u.a)({},e),{},{dateRange:{start:t.start,end:t.end},scheduled:a});case"SET_UNSCHEDULED":var n=t.posts;return n.forEach((function(e,t){n[t].post_date=new Date(e.post_date)})),Object(u.a)(Object(u.a)({},e),{},{unscheduled:n});case"REFETCH":return Object(u.a)(Object(u.a)({},e),{},{refetch:!e.refetch});case"SET_CURRENTPOST":return Object(u.a)(Object(u.a)({},e),{},{currentPost:Object(u.a)(Object(u.a)({},t.post),{},{unscheduled:t.unscheduled})});case"UPDATE_CURRENTPOST_FIELD":return Object(u.a)(Object(u.a)({},e),{},{currentPost:Object(u.a)(Object(u.a)({},e.currentPost),{},Object(h.a)({},t.field,t.value))});case"UNSET_CURRENTPOST":return Object(u.a)(Object(u.a)({},e),{},{currentPost:v.currentPost});default:return e}}function g(){var e=Object(c.useContext)(p),t=e.viewOptions,a=t.viewMode,s=t.monthCount,r=e.viewOptionsDispatch,o=Object(c.useContext)(f).postsDispatch,d=function(e){r({type:"UPDATE_OPTION",viewMode:e.target.value})};return Object(n.jsxs)("div",{className:"viewOptions",children:[Object(n.jsx)(i,{name:"viewMode",label:"View Mode",children:Object(n.jsxs)("div",{className:"options",children:[Object(n.jsx)("label",{htmlFor:"calendar",children:"Calendar"}),Object(n.jsx)("input",{type:"radio",name:"viewMode",onChange:d,checked:"calendar"===a,value:"calendar"}),Object(n.jsx)("label",{htmlFor:"list",children:"List"}),Object(n.jsx)("input",{type:"radio",name:"viewMode",onChange:d,checked:"list"===a,value:"list"})]})}),Object(n.jsx)(i,{name:"monthCount",label:"Months to view",inlineLabel:!0,children:Object(n.jsx)("input",{type:"number",min:1,value:s,onChange:function(e){r({type:"UPDATE_OPTION",monthCount:e.target.value})},className:"mini"})}),Object(n.jsx)(i,{name:"refetch",label:"Refetch Posts (not for production)",inlineLabel:!0,children:Object(n.jsx)("button",{onClick:function(e){o({type:"REFETCH"})},children:"Refetch"})})]})}var x=a(12);function E(e){var t=e.title,a=e.className,c=e.children;return Object(n.jsxs)("div",{className:"widget ".concat(a),children:[Object(n.jsx)("h3",{className:"widgetTitle",children:t}),c]})}var _=window.rhdReactPlugin.nonce,w=window.rhdReactPlugin.restBase,N=window.rhdReactPlugin.postStatuses,D="d",T="yyyy-MM-dd",C="EEEE",y="MMM",P="EEEE,  MMMM dd, yyyy",R="MMMM dd, yyyy";function S(e,t){if(e.length>0)for(var a in e)e[a]===t[a]&&(e=Object(x.omit)(e,a));return e}var M=function(e,t,a){return Object(n.jsx)(E,{title:e,className:"widget__".concat(t),children:a})};function U(){var e=Object.keys(N);return Object(n.jsx)("div",{className:"statusFilters",children:Object(n.jsx)("ul",{className:"filters",children:e.map((function(e,t){var a=N[e],c=a.color,s=a.backgroundColor,r=a.name;return Object(n.jsxs)("li",{className:"filterItem status__".concat(e),children:[Object(n.jsx)("span",{className:"dot",style:{color:c,backgroundColor:s}}),Object(n.jsx)("span",{className:"name",children:r})]},t)}))})})}function L(){return Object(n.jsx)("header",{className:"calendario__header",children:Object(n.jsxs)("div",{className:"calendario__header__content",children:[Object(n.jsx)("div",{className:"left",children:Object(n.jsx)("h1",{className:"page-title",children:"Calendario II: The Datening"})}),Object(n.jsx)("div",{className:"right",children:M("View Options","viewOptions",Object(n.jsx)(g,{}))}),Object(n.jsx)("div",{className:"bottom",children:Object(n.jsx)(U,{})})]})})}var k=a(151);function F(e){var t=e.start,a=e.end,s=Object(c.useContext)(p).viewOptionsDispatch;return Object(n.jsxs)("div",{className:"header row flex-middle",children:[Object(n.jsx)("div",{className:"col col__start",children:Object(n.jsx)("div",{className:"icon",onClick:function(){return s({type:"PREV_MONTH"})},children:"chevron_left"})}),Object(n.jsxs)("div",{className:"col col__center",children:[Object(n.jsx)("h3",{className:"viewTitle",children:"Scheduled Posts"}),Object(n.jsx)("p",{className:"viewRange",children:"".concat(Object(k.default)(t,R)," \u2014 ").concat(Object(k.default)(a,R))})]}),Object(n.jsx)("div",{className:"col col__end",onClick:function(){return s({type:"NEXT_MONTH"})},children:Object(n.jsx)("div",{className:"icon",children:"chevron_right"})})]})}function A(e){var t=e.className,a=e.dayNumber,c=e.monthName,s=e.children;return Object(n.jsxs)("div",{className:t,children:[c?Object(n.jsx)("span",{className:"month",children:c}):"",Object(n.jsx)("span",{className:"number",children:a}),s]})}var I=a(11),H=a.n(I),G=a(18),V=a(154),J=a(155),X=a(24),W=a(32),B=a(64),q=a.n(B),Y=Object(c.createContext)(null);function z(e,t){switch(t.type){case"START":return{post:t.post,isDragging:!0,draggedFrom:t.draggedFrom>=0&&t.draggedFrom,originalUnscheduledOrder:t.originalUnscheduledOrder};case"DRAGGING_OVER_UNSCHEDULED":var a=e.originalUnscheduledOrder;if(!1===e.draggedTo)a=Object(W.a)(new Set([].concat(Object(W.a)(e.originalUnscheduledOrder),[e.post])));else{var n=null;!1===e.draggedFrom?(n=a.length,a=Object(W.a)(new Set([].concat(Object(W.a)(e.originalUnscheduledOrder),[e.post])))):n=e.draggedFrom,n!==t.draggedTo&&(a=q()(a,n,t.draggedTo))}return Object(u.a)(Object(u.a)({},e),{},{draggedTo:t.draggedTo,updatedUnscheduledOrder:a});case"END":return K;default:return e}}var K={post:{},isDragging:!1,draggedFrom:null,draggedTo:null,originalUnscheduledOrder:[],updatedUnscheduledOrder:[]};function Q(e){var t=e.post,a=e.index,s=e.allowDrag,r=e.order,o=Object(c.useContext)(f),i=o.posts.currentPost,u=o.postsDispatch,l=Object(c.useContext)(Y),j=l.draggedPost,p=l.draggedPostDispatch,b=Object(c.useState)({}),O=Object(d.a)(b,2),h=O[0],v=O[1],m=Object(c.useState)(new Date),g=Object(d.a)(m,2),E=g[0],_=g[1];Object(c.useEffect)((function(){_(new Date(t.post_date))}),[t.post_date]),Object(c.useEffect)((function(){v({color:N[t.post_status].color,backgroundColor:N[t.post_status].backgroundColor})}),[t.post_status]);var w=function(e){var a=!!e.currentTarget.parentNode.classList.contains("unscheduledDrafts");p({type:"START",post:t,draggedFrom:!!a&&Number(e.currentTarget.dataset.index),originalUnscheduledOrder:r})},D=function(){return p({type:"END"})},T=function(e){var a=!(!e.target.classList.contains("unscheduledDrafts")&&!e.target.parentNode.classList.contains("unscheduledDrafts"));u({type:"SET_CURRENTPOST",post:t,unscheduled:a})};return t?function(){var e=["post","post-id-".concat(t.id," status__").concat(t.post_status)];return j.isDragging&&(j.draggedTo===Number(a)&&j.draggedTo!==j.draggedFrom&&e.push("dropArea"),j.draggedFrom===Number(a)&&e.push("dragging")),Object(x.isEmpty)(i)||i.id!==t.id||e.push("currentPost"),Object(n.jsx)("li",{className:e.join(" "),"data-index":a,draggable:!0===s||!Object(V.a)(E)&&!Object(J.a)(E),onDragStart:w,onDragEnd:D,onClick:T,children:Object(n.jsx)("p",{className:"postData",style:{backgroundColor:h.backgroundColor,color:h.color},children:Object(X.decode)(t.post_title,{scope:"strict"})})})}():null}var Z={updateNow:!1,params:{},unscheduled:!1};function $(e,t){switch(t.type){case"UPDATE":return{updateNow:!0,params:t.params,unscheduled:t.unscheduled};case"UPDATING":return Object(u.a)(Object(u.a)({},e),{},{updateNow:!1});case"COMPLETE":return Z;default:return e}}function ee(e){var t=e.posts,a=e.className,s=e.allowDrag,r=e.allowDrop,o=e.date,i=Object(c.useContext)(f),l=i.posts.currentPost,j=i.postsDispatch,p=Object(c.useContext)(Y),b=p.draggedPost.post,O=p.draggedPostDispatch,h=Object(c.useReducer)($,Z),v=Object(d.a)(h,2),m=v[0],g=v[1];Object(c.useEffect)((function(){if(!0===m.updateNow&&"undefined"!==b.id){g({type:"UPDATING"});var e="".concat(w,"/update/").concat(b.id),t={params:S(m.params,b),unscheduled:m.unscheduled};if(Object(x.isEmpty)(t))return{data:"Update not necessary.",error:!0};(function(){var a=Object(G.a)(H.a.mark((function a(){var n;return H.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,fetch(e,{method:"POST",headers:{"Content-Type":"application/json","X-WP-Nonce":_},body:JSON.stringify(t)});case 3:return n=a.sent,a.next=6,n.json();case 6:j({type:"REFETCH"}),O({type:"END"}),g({type:"COMPLETE"}),a.next=14;break;case 11:a.prev=11,a.t0=a.catch(0),console.log(a.t0.message);case 14:case"end":return a.stop()}}),a,null,[[0,11]])})));return function(){return a.apply(this,arguments)}})()()}}),[m,O,b,j]);var E=function(e){if(e.preventDefault(),!1!==s&&e.currentTarget.classList.contains("unscheduledDrafts")){var t=!!e.target.dataset.index&&Number(e.target.dataset.index);if(!1===t){var a=e.pageY-e.currentTarget.offsetTop,n=e.currentTarget.childNodes,c=n.length;t=0===n.length||a<n[0].offsetTop?0:c}O({type:"DRAGGING_OVER_UNSCHEDULED",draggedTo:t})}},N=function(){!1!==r&&(g({type:"UPDATE",params:{post_date:!1===o?Object(k.default)(b.post_date,T):Object(k.default)(o,T)},unscheduled:!1===o}),l.id===b.id&&j({type:"UPDATE_CURRENTPOST_FIELD",field:"post_date",value:o}))};return function(){var e={className:"postList ".concat(a),onDragOver:E};return!1!==r?e.onDrop=N:e.className+=" dropDisabled",Object(n.jsx)("ul",Object(u.a)(Object(u.a)({},e),{},{children:t.map((function(e,a){return Object(n.jsx)(Q,{post:e,order:t,index:a,allowDrag:s},e.id)}))}))}()}var te=a(44),ae=function(e,t){var a=Object(c.useContext)(f).postsDispatch;Object(c.useEffect)((function(){if(null!==e&&null!==t){var n=Object(k.default)(e,T),c=Object(k.default)(t,T),s="".concat(w,"/scheduled/").concat(n,"/").concat(c);(function(){var e=Object(G.a)(H.a.mark((function e(){var t,n;return H.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch(s,{headers:{"X-WP-Nonce":_}});case 3:return t=e.sent,e.next=6,t.json();case 6:n=e.sent,a({type:"SET_SCHEDULED",posts:n.posts,start:n.dateRange.start,end:n.dateRange.end}),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(0),console.log("REST error",e.t0.message);case 13:case"end":return e.stop()}}),e,null,[[0,10]])})));return function(){return e.apply(this,arguments)}})()()}}),[e,t,a])};function ne(e){var t=e.posts,a=e.date,c=e.allowDrag,s=e.allowDrop,r=e.title,o=(e.renderEmpty,function(e,t){var a=[];return e&&e.forEach((function(e){Object(te.default)(t,new Date(e.post_date))&&a.push(e)})),a}(t,a));return function(){var e={className:"dayPosts",date:a,posts:o};"undefined"!==c&&null!==c&&(e.allowDrag=c),e.allowDrop=!1!==s;var t=Object(n.jsx)(ee,Object(u.a)({},e));return r?Object(n.jsxs)("div",{className:"listDay",children:[Object(n.jsx)("h4",{className:"listDay__title",children:r}),t]}):t}()}var ce=a(156),se=a(9),re=a(88),oe=a(30),de=a(157);function ie(){var e=Object(c.useContext)(f),t=e.posts,a=t.scheduled,s=t.refetch,r=e.postsDispatch,o=Object(c.useContext)(p),d=o.viewOptions,i=d.monthCount,u=d.viewRange,j=o.viewOptionsDispatch;Object(c.useEffect)((function(){r({type:"REFETCH"})}),[r]),Object(c.useEffect)((function(){var e=Object(ce.a)();j({type:"SET_RANGE",start:Object(se.default)(e),end:Object(re.default)(Object(l.default)(e,i))})}),[s,i,j]),ae(u.start,u.end);var b=Object(c.useCallback)((function(){for(var e=[],t=Object(se.default)(u.start),a=0;a<7;a++)e.push(Object(n.jsx)("div",{className:"col col__center",children:Object(k.default)(Object(oe.default)(t,a),C)},a));return Object(n.jsx)("div",{className:"days row",children:e})}),[u.start]),O=Object(c.useCallback)((function(){for(var e,t=[],c=[],s=u.start,r=!0;s<=u.end;){for(var o=0;o<7;o++){var d=Object(de.a)(s)||r,i=Object(V.a)(s),l=Object(J.a)(s);e=Object(k.default)(s,D);var j=[];i&&j.push("today"),l&&!i&&j.push("past"),c.push(Object(n.jsx)(A,{className:"col cell ".concat(j.join(" ")),day:s,dayNumber:e,monthName:d?Object(k.default)(s,y):"",children:Object(n.jsx)(ne,{date:s,posts:a,allowDrag:!0,renderEmpty:!0})},s)),r=!1,s=Object(oe.default)(s,1)}t.push(Object(n.jsx)("div",{className:"row",children:c},s)),c=[]}return Object(n.jsx)("div",{className:"body",children:t})}),[u.end,u.start,a]);return Object(n.jsxs)("div",{className:"view view__calendar",children:[Object(n.jsx)(F,{start:u.start,end:u.end}),b(),O()]})}var ue=a(89),le=a(90);function je(){var e=Object(c.useContext)(f),t=e.posts,a=t.scheduled,s=t.refetch,r=t.dateRange,o=e.postsDispatch,d=Object(c.useContext)(p),i=d.viewOptions,u=i.monthCount,j=i.viewRange,b=d.viewOptionsDispatch;Object(c.useEffect)((function(){o({type:"REFETCH"})}),[o]),Object(c.useEffect)((function(){var e=Object(ce.a)();b({type:"SET_RANGE",start:e,end:Object(l.default)(e,u)})}),[s,u,b]);ae(j.start,j.end);return Object(n.jsxs)("div",{className:"view view__list",children:[Object(n.jsx)(F,{start:j.start,end:j.end}),function(){var e=[],t=Object(ue.default)(r.start);if("undefined"!==r.end&&null!==r.end&&r.end)for(;Object(le.default)(t)<=Object(le.default)(new Date(r.end));)e.push(Object(n.jsx)(ne,{date:t,posts:a,renderEmpty:!1,allowDrag:!0,title:Object(k.default)(t,P)},t)),t=Object(oe.default)(t,1);return e}()]})}var pe=a(65),be=a.n(pe),Oe=a(158),he=(a(91),{post:{},editMode:!1});function fe(e,t){switch(t.type){case"SET":return{post:t.post,editMode:!0};case"EDIT":var a=t.field,n=t.value;return"post_date"===a&&(n=new Date(n)),Object(u.a)(Object(u.a)({},e),{},{post:Object(u.a)(Object(u.a)({},e.post),{},Object(h.a)({},a,n))});case"DATE_CHANGE":return Object(u.a)(Object(u.a)({},e),{},{post:Object(u.a)(Object(u.a)({},e.post),{},{post_date:t.newDate})});case"CLEAR":return he;default:return{state:e}}}function ve(){var e=Object(c.useContext)(f),t=e.posts.currentPost,a=e.postsDispatch,s=Object(c.useContext)(Y).draggedPostDispatch,r=Object(c.useReducer)(fe,he),o=Object(d.a)(r,2),u=o[0],l=o[1],j=Object(c.useReducer)($,Z),p=Object(d.a)(j,2),b=p[0],O=p[1],h=Object(c.useRef)(),v=Object(c.useState)(new Date),m=Object(d.a)(v,2),g=m[0],E=m[1],_=Object(c.useState)({}),D=Object(d.a)(_,2),C=D[0],y=D[1],P=u.post,R=u.editMode;Object(c.useEffect)((function(){return P.post_date&&"undefined"!==P.post_date&&E(new Date(P.post_date)),function(){E(new Date)}}),[P.post_date]),Object(c.useEffect)((function(){var e=[];!0===P.unscheduled?e.push("publish","future","pending"):Object(Oe.a)(g)?e.push("publish"):Object(J.a)(g)&&e.push("future");var t=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=N;if(e.length>0)for(var a in N)e.includes(a)&&(t=Object(x.omit)(t,a));return t}(e);y(t)}),[g,P.unscheduled]),Object(c.useEffect)((function(){if(!0===b.updateNow&&"undefined"!==t.id){console.log(t),O({type:"UPDATING"});var e="".concat(w,"/update/").concat(t.id),n={params:S(b.params,t),unscheduled:b.unscheduled};if(Object(x.isEmpty)(n.params))return{data:"Update not necessary.",error:!0};(function(){var t=Object(G.a)(H.a.mark((function t(){var c;return H.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)});case 3:return c=t.sent,t.next=6,c.json();case 6:s({type:"END"}),O({type:"COMPLETE"}),a({type:"SET_CURRENTPOST",post:P,unscheduled:P.unscheduled}),a({type:"REFETCH"}),t.next=15;break;case 12:t.prev=12,t.t0=t.catch(0),console.log(t.t0.message);case 15:case"end":return t.stop()}}),t,null,[[0,12]])})));return function(){return t.apply(this,arguments)}})()()}}),[t,P,s,a,b.params,b.updateNow,b.unscheduled]),Object(c.useEffect)((function(){t.id&&t.id>0&&l({type:"SET",post:t})}),[t.id,t]),Object(c.useEffect)((function(){var e=function(e){h.current&&h.current.contains(e.target)?console.log("inside"):(l({type:"CLEAR"}),a({type:"UNSET_CURRENTPOST"}))};return Object(x.isEmpty)(t)?document.removeEventListener("mousedown",e):document.addEventListener("mousedown",e),function(){document.removeEventListener("mousedown",e)}}),[t,a]);var M,U=function(e){l({type:"EDIT",field:e.target.name,value:e.target.value})};return R?Object(n.jsx)("div",{className:"editPost",children:Object(n.jsx)("div",{className:"editPost__container",children:Object(n.jsx)("div",{ref:h,className:"editPost__editor",children:Object(n.jsxs)("form",{className:"editPost__editor__form",onSubmit:function(e){e.preventDefault(),O({type:"UPDATE",params:{post_title:P.post_title,post_date:Object(k.default)(new Date(P.post_date),T),post_status:P.post_status,post_excerpt:P.post_excerpt},unscheduled:P.unscheduled}),l({type:"CLEAR"})},children:[Object(n.jsx)(i,{name:"post_title",label:"Post Title",children:Object(n.jsx)("input",{name:"post_title",value:Object(X.decode)(P.post_title,{scope:"strict"}),onChange:U})}),!1===P.unscheduled?Object(n.jsx)(i,{name:"post_date",label:"Post Date",children:Object(n.jsx)(be.a,{closeOnScroll:function(e){return e.target===document},selected:g,onChange:function(e){l({type:"EDIT",field:"post_date",value:e})},disabled:!(!t.post_date||!Object(V.a)(t.post_date)&&!Object(J.a)(t.post_date)||"publish"!==t.post_status)})}):null,Object(n.jsx)(i,{name:"post_status",label:"Post Status",children:Object(n.jsx)("select",{name:"post_status",onChange:function(e){l({type:"EDIT",field:e.target.name,value:e.target.value})},value:P.post_status,children:(M=C,Object.keys(M).map((function(e){return Object(n.jsx)("option",{value:e,children:M[e].name},e)})))})}),Object(n.jsx)(i,{name:"taxonomies",label:"Categories & Tags",children:Object(n.jsx)("p",{children:"Coming soon"})}),Object(n.jsx)(i,{name:"post_excerpt",label:"Excerpt",children:Object(n.jsx)("textarea",{name:"post_excerpt",onChange:U,rows:4,children:Object(X.decode)(P.post_excerpt,{scope:"strict"})})}),Object(n.jsx)("div",{className:"post_thumb",children:P.image?Object(n.jsxs)("div",{children:[Object(n.jsx)("span",{children:"Featured Image"}),Object(n.jsx)("a",{href:Object(X.decode)(P.edit_link),target:"_blank",rel:"noreferrer",children:Object(n.jsx)("img",{src:P.image,alt:"".concat(P.post_title)})})]}):null}),Object(n.jsxs)("div",{className:"editPost__buttons",children:[Object(n.jsx)("input",{type:"submit",className:"editPost__buttons__save",value:"Update"}),Object(n.jsx)("input",{type:"button",className:"editPost__buttons__cancel",onClick:function(){return l({type:"CLEAR"})},value:"Cancel"})]})]})})})}):null}function me(){var e=Object(c.useContext)(p).viewOptions.viewMode;return Object(n.jsxs)("main",{className:"calendario__main",children:["calendar"===e?Object(n.jsx)(ie,{}):Object(n.jsx)(je,{}),Object(n.jsx)(ve,{})]})}function ge(){var e=Object(c.useContext)(f),t=e.posts.unscheduled,a=e.postsDispatch;return Object(c.useEffect)((function(){a({type:"REFETCH"})}),[a]),function(){var e=Object(c.useContext)(f),t=e.posts.refetch,a=e.postsDispatch;Object(c.useEffect)((function(){var e="".concat(w,"/unscheduled");!function(){var t=Object(G.a)(H.a.mark((function t(){var n,c;return H.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,fetch(e,{headers:{"X-WP-Nonce":_}});case 3:return n=t.sent,t.next=6,n.json();case 6:c=t.sent,a({type:"SET_UNSCHEDULED",posts:c.posts,unscheduled:!0}),t.next=13;break;case 10:t.prev=10,t.t0=t.catch(0),console.log("REST error",t.t0.message);case 13:case"end":return t.stop()}}),t,null,[[0,10]])})));return function(){return t.apply(this,arguments)}}()()}),[a,t])}(),Object(n.jsx)(ee,{className:"unscheduledDrafts",date:!1,posts:t,allowDrag:!0})}function xe(){return Object(n.jsx)("aside",{className:"calendario__sidebar",children:M("Unscheduled Drafts","unscheduledDrafts",Object(n.jsx)(ge,{}))})}a(148);function Ee(){var e=Object(c.useReducer)(m,v),t=Object(d.a)(e,2),a=t[0],s=t[1],r=Object(c.useReducer)(z,K),o=Object(d.a)(r,2),i=o[0],u=o[1],l=Object(c.useReducer)(b,O),j=Object(d.a)(l,2),h=j[0],g=j[1],x=function(e,t){var a=Object(c.useState)((function(){var a=window.localStorage.getItem(t);return null!==a?JSON.parse(a):e})),n=Object(d.a)(a,2),s=n[0],r=n[1];return Object(c.useEffect)((function(){window.localStorage.setItem(t,JSON.stringify(s))}),[t,s]),[s,r]}({viewMode:"calendar",monthCount:1},"viewOptions"),E=Object(d.a)(x,2),_=E[0],w=E[1];return Object(c.useEffect)((function(){g({type:"UPDATE_OPTION",monthCount:_.monthCount,viewMode:_.viewMode})}),[]),Object(c.useEffect)((function(){w({viewMode:h.viewMode,monthCount:h.monthCount})}),[w,h.viewMode,h.monthCount]),Object(n.jsx)("div",{className:"calendario",children:Object(n.jsx)(p.Provider,{value:{viewOptions:h,viewOptionsDispatch:g},children:Object(n.jsxs)(f.Provider,{value:{posts:a,postsDispatch:s},children:[Object(n.jsx)(L,{}),Object(n.jsx)(c.Profiler,{id:"Main",onRender:function(e,t,a,n,c,s,r){},children:Object(n.jsxs)(Y.Provider,{value:{draggedPost:i,draggedPostDispatch:u},children:[Object(n.jsx)(me,{}),Object(n.jsx)(xe,{})]})})]})})})}var _e=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,159)).then((function(t){var a=t.getCLS,n=t.getFID,c=t.getFCP,s=t.getLCP,r=t.getTTFB;a(e),n(e),c(e),s(e),r(e)}))},we=(window.rhdReactPlugin||{}).appSelector,Ne=document.querySelector(we);Ne&&o.a.render(Object(n.jsx)(s.a.StrictMode,{children:Object(n.jsx)(Ee,{})}),Ne),_e()},73:function(e,t,a){}},[[149,1,2]]]);
//# sourceMappingURL=main.53086e48.chunk.js.map