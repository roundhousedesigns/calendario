(this["webpackJsonpreact-app"]=this["webpackJsonpreact-app"]||[]).push([[0],{157:function(e,t,a){},158:function(e,t,a){"use strict";a.r(t);var s=a(2),c=a(0),n=a.n(c),r=a(24),o=a.n(r),i=(a(77),a(8));function d(e){var t=e.name,a=e.label,c=e.inlineLabel,n=e.children;return Object(s.jsxs)("div",{className:"fieldGroup fieldGroup__".concat(t," ").concat(c?"inlineLabel":""),children:[a?Object(s.jsx)("label",{htmlFor:t,children:a}):null,n]})}var u=a(21),l=a(7),j=a(12),b=a(79),p=a(14);function O(e){var t=e.title,a=e.className,c=e.children;return Object(s.jsxs)("div",{className:"widget ".concat(a),children:[t?Object(s.jsx)("h3",{className:"widgetTitle",children:t}):null,c]})}var h,f,v;h=window.rhdReactPlugin.nonce,f=window.rhdReactPlugin.restBase,v=window.rhdReactPlugin.postStatuses;var m="d",x="yyyy-MM-dd",g="EEEE",_="MMM",E="EEEE,  MMMM dd, yyyy",w="MMMM dd, yyyy";function N(e,t){if(e.length>0)for(var a in e)e[a]===t[a]&&(e=Object(p.omit)(e,a));return e}var D=function(e,t,a){return Object(s.jsx)(O,{title:e,className:"widget__".concat(t),children:a})},y=Object(c.createContext)({});function T(e,t){switch(t.type){case"UPDATE":return Object(l.a)(Object(l.a)({},e),{},{viewMode:t.viewMode?t.viewMode:e.viewMode,viewRange:t.viewRange?t.viewRange:e.viewRange});case"SET_RANGE":var a="list"!==e.viewMode?{start:Object(j.default)(t.start),end:Object(b.default)(t.end)}:{start:t.start,end:t.end};return Object(l.a)(Object(l.a)({},e),{},{viewRange:{start:a.start,end:a.end}});case"TOGGLE_STATUS":return Object(l.a)(Object(l.a)({},e),{},{statuses:Object(l.a)(Object(l.a)({},e.statuses),{},Object(u.a)({},t.status,!e.statuses[t.status]))});default:return e}}var C={};for(var S in v)C[S]=!0;var P={viewMode:"",viewRange:{start:null,end:null},statuses:C};function R(){var e=Object(c.useContext)(y),t=e.viewOptions.viewMode,a=e.viewOptionsDispatch,n=function(e){a({type:"UPDATE",viewMode:e.target.value})};return Object(s.jsx)("div",{className:"viewOptions",children:Object(s.jsxs)(d,{name:"viewMode",children:[Object(s.jsx)("button",{onClick:n,className:"icon ".concat("calendar"===t?"active ":"inactive"),value:"calendar",title:"Calendar",children:"calendar_view_month"}),Object(s.jsx)("button",{name:"viewMode",onClick:n,className:"icon ".concat("list"===t?"active ":"inactive"),value:"list",title:"List",children:"view_list"})]})})}var k=a(68),U=a.n(k),L=a(165),M=a(95),A=a(96),F=a(35),G=a(47);a(58);function H(){var e=Object(c.useContext)(y),t=e.viewOptions.viewRange,a=t.start,n=t.end,r=e.viewMode,o=e.viewOptionsDispatch;Object(c.useEffect)((function(){if(!a&&!n){var e=Object(L.a)();o({type:"SET_RANGE",start:"calendar"===r?Object(M.default)(e):e,end:"calendar"===r?Object(A.default)():Object(F.default)(e,30)})}}),[n,a,r,o]);return Object(s.jsx)("div",{className:"calendarListHeader row flex-middle",children:Object(s.jsxs)("div",{className:"col col__center",children:[Object(s.jsx)(U.a,{value:[a,n],onChange:function(e){o({type:"SET_RANGE",start:e[0],end:e[1]})},clearIcon:null,format:w,required:!0,maxDate:Object(G.default)(new Date,3),showLeadingZeros:!1,disableCalendar:!0}),Object(s.jsx)(R,{})]})})}function I(){return Object(s.jsx)("header",{className:"calendario__header",children:Object(s.jsxs)("div",{className:"calendario__header__content",children:[Object(s.jsx)("div",{className:"left",children:Object(s.jsx)(H,{})}),Object(s.jsx)("div",{className:"right",children:Object(s.jsx)("h1",{className:"calendario__title",children:"the editorial calendorial"})})]})})}var J=a(166),B=a(167),V=a(161);function W(e){e.className;var t=e.day,a=e.monthName,c=e.children,n=["day","col","cell"];return Object(J.a)(t)&&n.push("today"),Object(B.a)(t)&&!Object(J.a)(t)&&n.push("past"),Object(s.jsxs)("div",{className:n.join(" "),children:[a?Object(s.jsx)("span",{className:"month",children:a}):"",Object(s.jsx)("span",{className:"number",children:Object(V.default)(t,m)}),c]})}var q=a(11),X=a.n(q),Y=a(19),z={updateNow:!1,trash:!1,params:{},unscheduled:!1};function Z(e,t){switch(t.type){case"UPDATE":return{updateNow:!0,params:t.params,unscheduled:t.unscheduled};case"UPDATING":return Object(l.a)(Object(l.a)({},e),{},{updateNow:!1});case"TRASH":return{trash:!0,updateNow:!0,params:t.params};case"COMPLETE":return z;default:return e}}var K=Object(c.createContext)({}),Q={currentPost:{id:null,post_title:"",post_status:"",post_date:"",unscheduled:null},refetch:!1,dateRange:{start:"",end:""},unscheduled:[],scheduled:[],trashed:[]};function $(e,t){switch(t.type){case"SET_SCHEDULED":var a=t.posts;return a.forEach((function(e,t){a[t].post_date=new Date(e.post_date)})),Object(l.a)(Object(l.a)({},e),{},{dateRange:{start:t.start,end:t.end},scheduled:a});case"SET_UNSCHEDULED":var s=t.posts;return s.forEach((function(e,t){s[t].post_date=new Date(e.post_date)})),Object(l.a)(Object(l.a)({},e),{},{unscheduled:s});case"SET_TRASHED":var c=t.posts;return c.forEach((function(e,t){c[t].post_date=new Date(e.post_date)})),Object(l.a)(Object(l.a)({},e),{},{trashed:c});case"REFETCH":return Object(l.a)(Object(l.a)({},e),{},{refetch:!e.refetch});case"SET_CURRENTPOST":return Object(l.a)(Object(l.a)({},e),{},{currentPost:Object(l.a)(Object(l.a)({},t.post),{},{unscheduled:t.unscheduled})});case"NEW_POST":return Object(l.a)(Object(l.a)({},e),{},{currentPost:{id:0,post_date:t.post_date,unscheduled:t.unscheduled}});case"UPDATE_CURRENTPOST_FIELD":return Object(l.a)(Object(l.a)({},e),{},{currentPost:Object(l.a)(Object(l.a)({},e.currentPost),{},Object(u.a)({},t.field,t.value))});case"UNSET_CURRENTPOST":return Object(l.a)(Object(l.a)({},e),{},{currentPost:Q.currentPost});default:return e}}var ee=a(22);function te(e){var t=e.post,a=e.className,n=e.unscheduled,r=t.id,o=t.edit_link,d=t.view_link,u=Object(c.useContext)(K).postsDispatch,l=Object(c.useReducer)(Z,z),j=Object(i.a)(l,2),b=j[0],p=j[1];Object(c.useEffect)((function(){if(!0===b.updateNow&&"undefined"!==r){p({type:"UPDATING"});var e="".concat(f,"/");!0===b.trash?e+="trash/".concat(r):e+="update/".concat(r);var t={unscheduled:b.unscheduled};(function(){var a=Object(Y.a)(X.a.mark((function a(){var s;return X.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});case 3:return s=a.sent,a.next=6,s.json();case 6:p({type:"COMPLETE"}),u({type:"REFETCH"}),a.next=13;break;case 10:a.prev=10,a.t0=a.catch(0),console.log(a.t0.message);case 13:case"end":return a.stop()}}),a,null,[[0,10]])})));return function(){return a.apply(this,arguments)}})()()}}),[r,u,b.trash,b.params,b.updateNow,b.unscheduled]);return Object(s.jsxs)("div",{className:"postLinks ".concat(a),children:[Object(s.jsx)("a",{className:"icon top left icon__view",href:d,target:"_blank",rel:"noreferrer",title:"View Post",children:"open_in_new"}),Object(s.jsx)("a",{className:"icon top right icon__edit",href:Object(ee.decode)(o),target:"_blank",rel:"noreferrer",title:"Edit Post in a new tab",children:"mode_edit"}),n?Object(s.jsx)("button",{className:"icon icon__schedule bottom right",onClick:function(e){e.preventDefault(),p({type:"UPDATE",params:{},unscheduled:!1})},title:"Schedule this post",children:"event_available"}):Object(s.jsx)("button",{className:"icon icon__unschedule bottom right",onClick:function(e){e.preventDefault(),p({type:"UPDATE",params:{},unscheduled:!0})},title:"Unschedule this post",children:"drafts"}),Object(s.jsx)("button",{className:"icon icon__trash bottom left",onClick:function(){p({type:"TRASH",params:{id:r}})},title:"Trash this post",children:"delete_forever"})]})}var ae=Object(c.createContext)(null);function se(e,t){switch(t.type){case"START":return{post:t.post,isDragging:!0,draggedFrom:t.draggedFrom>=0&&t.draggedFrom};case"DRAGGING_OVER_UNSCHEDULED":return Object(l.a)(Object(l.a)({},e),{},{draggedTo:t.draggedOver,overUnscheduled:!0});case"DRAGGING_OVER_SCHEDULED":return Object(l.a)(Object(l.a)({},e),{},{draggedTo:null,overUnscheduled:!1});case"END":return ce;default:return e}}var ce={post:{},isDragging:!1,draggedFrom:null,draggedTo:null,overUnscheduled:!1};function ne(e){var t=e.post,a=e.index,n=e.unscheduled,r=e.allowDrag,o=Object(c.useContext)(K),d=o.posts.currentPost,u=o.postsDispatch,l=Object(c.useContext)(ae),j=l.draggedPost,b=j.isDragging,O=j.draggedFrom,h=j.draggedTo,f=l.draggedPostDispatch,m=Object(c.useContext)(y).viewOptions.statuses,x=Object(c.useState)({}),g=Object(i.a)(x,2),_=g[0],E=g[1],w=Object(c.useState)(new Date),N=Object(i.a)(w,2),D=N[0],T=N[1],C=Object(c.useState)(!1),S=Object(i.a)(C,2),P=S[0],R=S[1];Object(c.useEffect)((function(){T(new Date(t.post_date))}),[t.post_date]),Object(c.useEffect)((function(){E({color:v[t.post_status].color,backgroundColor:v[t.post_status].backgroundColor})}),[t.post_status]);var k=function(e){var a=!!e.currentTarget.parentNode.classList.contains("unscheduledDrafts");f({type:"START",post:t,draggedFrom:!!a&&Number(e.currentTarget.dataset.index)})},U=function(){return f({type:"END"})},L=function(e){if(!e.target.classList.contains("icon")){var a=!(!e.target.classList.contains("unscheduledDrafts")&&!e.target.parentNode.classList.contains("unscheduledDrafts"));u({type:"SET_CURRENTPOST",post:t,unscheduled:a})}};return t?function(){var e=["post","post-id-".concat(t.id," status__").concat(t.post_status)];return b&&(h===Number(a)&&(e.push("dropArea"),!1===O?e.push("fromNowhere"):O<h?e.push("fromAbove"):O>h&&e.push("fromBelow")),O===Number(a)&&e.push("dragging")),Object(p.isEmpty)(d)||d.id!==t.id||e.push("currentPost"),Object(s.jsxs)("li",{id:t.id,className:e.join(" "),style:!1===n&&!0===m[t.post_status]||!0===n?{visibility:"visible"}:{visibility:"hidden"},"data-index":a,draggable:!0===r||!Object(J.a)(D)&&!Object(B.a)(D),onDragStart:k,onDragEnd:U,onClick:L,onMouseEnter:function(){return R(!0)},onMouseLeave:function(){return R(!1)},children:[Object(s.jsx)(te,{className:P&&!b?"visible":"hidden",post:t,unscheduled:n}),Object(s.jsx)("p",{className:"postData",style:{backgroundColor:_.backgroundColor,color:_.color},children:Object(ee.decode)(t.post_title,{scope:"strict"})})]})}():null}function re(e){var t=e.className;return Object(s.jsx)("div",{className:"loadingOverlay ".concat(t),children:Object(s.jsxs)("div",{className:"roller",children:[Object(s.jsx)("div",{}),Object(s.jsx)("div",{}),Object(s.jsx)("div",{}),Object(s.jsx)("div",{}),Object(s.jsx)("div",{}),Object(s.jsx)("div",{}),Object(s.jsx)("div",{}),Object(s.jsx)("div",{})]})})}function oe(e){var t=e.posts,a=e.className,n=e.allowDrag,r=e.allowDrop,o=e.date,d=e.loadingState,u=Object(c.useContext)(K),j=u.posts.currentPost,b=u.postsDispatch,O=Object(c.useContext)(ae),v=O.draggedPost,m=v.post,g=v.draggedTo,_=v.draggedFrom,E=v.overUnscheduled,w=O.draggedPostDispatch,D=Object(c.useReducer)(Z,z),y=Object(i.a)(D,2),T=y[0],C=y[1],S=Object(c.useState)(!1),P=Object(i.a)(S,2),R=P[0],k=P[1];Object(c.useEffect)((function(){if(void 0!==d&&null!==d)return k(d),function(){k(!1)}}),[d]),Object(c.useEffect)((function(){if(!0===T.updateNow&&"undefined"!==m.id){C({type:"UPDATING"});var e="".concat(f,"/update/").concat(m.id),t={params:N(T.params,m),unscheduled:T.unscheduled};if(null!==g&&(t.draggedTo=g),Object(p.isEmpty)(t))return{data:"Update not necessary.",error:!0};var a={"Content-Type":"application/json"};a["X-WP-Nonce"]=h,function(){var s=Object(Y.a)(X.a.mark((function s(){var c;return X.a.wrap((function(s){for(;;)switch(s.prev=s.next){case 0:return k(!0),s.prev=1,s.next=4,fetch(e,{method:"POST",headers:a,body:JSON.stringify(t)});case 4:return c=s.sent,s.next=7,c.json();case 7:b({type:"REFETCH"}),w({type:"END"}),C({type:"COMPLETE"}),k(!1),s.next=17;break;case 13:s.prev=13,s.t0=s.catch(1),console.log(s.t0.message),k(!1);case 17:case"end":return s.stop()}}),s,null,[[1,13]])})));return function(){return s.apply(this,arguments)}}()()}}),[T,g,w,m,b]);var U=function(e){if(e.preventDefault(),!1!==n)if(e.currentTarget.classList.contains("unscheduledDrafts")){var t=Number(e.target.dataset.index),a=!1;if(_===t)return;if((a=!Number.isNaN(t)&&t)!==g){if(!1===a){var s=e.currentTarget.getBoundingClientRect(),c=e.clientY-s.top,r=e.currentTarget.childNodes,o=r.length;a=0===r.length||c<r[0].offsetTop?0:c>=r[o-1].offsetTop?o:o-1}w({type:"DRAGGING_OVER_UNSCHEDULED",draggedOver:a})}}else!0===E&&w({type:"DRAGGING_OVER_SCHEDULED"})},L=function(){!1!==r&&(C({type:"UPDATE",params:{post_date:!1===o?Object(V.default)(m.post_date,x):Object(V.default)(o,x)},unscheduled:E}),j.id===m.id&&b({type:"UPDATE_CURRENTPOST_FIELD",field:"post_date",value:o}))};return function(){var e={className:"postList ".concat(a),onDragOver:U};return!1!==r?e.onDrop=L:e.className+=" dropDisabled",Object(s.jsxs)(s.Fragment,{children:[Object(s.jsx)(re,{className:R?"active":null}),Object(s.jsx)("ul",Object(l.a)(Object(l.a)({},e),{},{children:t.map((function(e,t){return Object(s.jsx)(ne,{post:e,index:t,unscheduled:!1===o,allowDrag:n},e.id)}))}))]})}()}function ie(e){var t=e.day,a=e.unscheduled,n=Object(c.useContext)(K).postsDispatch;return Object(s.jsx)("button",{className:"icon newPost",onClick:function(e){e.preventDefault(),n({type:"NEW_POST",post_date:t||new Date,unscheduled:a||!1})},children:"add_circle"})}var de=a(48),ue={};ue["X-WP-Nonce"]=h;var le=function(e,t){var a=Object(c.useContext)(K),s=a.posts.refetch,n=a.postsDispatch,r=Object(c.useState)(!1),o=Object(i.a)(r,2),d=o[0],u=o[1];return Object(c.useEffect)((function(){if(null!==e&&null!==t){var a=Object(V.default)(e,x),s=Object(V.default)(t,x),c="".concat(f,"/scheduled/").concat(a,"/").concat(s);return function(){var e=Object(Y.a)(X.a.mark((function e(){var t,a;return X.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return u(!0),e.prev=1,e.next=4,fetch(c,{headers:ue});case 4:return t=e.sent,e.next=7,t.json();case 7:a=e.sent,n({type:"SET_SCHEDULED",posts:a.posts,start:a.dateRange.start,end:a.dateRange.end}),u(!1),e.next=16;break;case 12:e.prev=12,e.t0=e.catch(1),console.log("REST error",e.t0.message),u(!1);case 16:case"end":return e.stop()}}),e,null,[[1,12]])})));return function(){return e.apply(this,arguments)}}()(),function(){u(!1)}}}),[e,t,s,n]),d};function je(e){var t=e.posts,a=e.date,c=e.allowDrag,n=e.allowDrop,r=e.title,o=e.loadingState,i=function(e,t){var a=[];return e&&e.forEach((function(e){Object(de.default)(t,new Date(e.post_date))&&a.push(e)})),a}(t,a);return function(){var e={className:"dayPosts",date:a,posts:i,allowDrop:!0,loadingState:o};"undefined"!==c&&null!==c&&(e.allowDrag=c),e.allowDrop=!1!==n;var t=Object(s.jsxs)(s.Fragment,{children:[Object(s.jsx)(ie,{day:a,unscheduled:!1}),Object(s.jsx)(oe,Object(l.a)({},e))]});return r?Object(s.jsxs)(s.Fragment,{children:[Object(s.jsx)("h4",{className:"title",children:r}),t]}):t}()}var be=a(168);function pe(e){var t=e.className,a=Object(c.useContext)(K),n=a.posts.scheduled,r=a.postsDispatch,o=Object(c.useContext)(y).viewOptions.viewRange;Object(c.useEffect)((function(){r({type:"REFETCH"})}),[r]),le(o.start,o.end);var i=Object(c.useCallback)((function(){for(var e=[],t=Object(j.default)(o.start),a=0;a<7;a++)e.push(Object(s.jsx)("div",{className:"col col__center",children:Object(V.default)(Object(F.default)(t,a),g)},a));return Object(s.jsx)("div",{className:"days row",children:e})}),[o.start]),d=Object(c.useCallback)((function(){for(var e=[],t=[],a=o.start,c=!0;a<=o.end;){for(var r=0;r<7;r++){var i=Object(be.a)(a)||c;t.push(Object(s.jsx)(W,{day:a,monthName:i?Object(V.default)(a,_):"",children:Object(s.jsx)(je,{date:a,posts:n,allowDrag:!0,renderEmpty:!0})},a)),c=!1,a=Object(F.default)(a,1)}e.push(Object(s.jsx)("div",{className:"row",children:t},a)),t=[]}return Object(s.jsx)("div",{className:"body",children:e})}),[o.end,o.start,n]);return Object(s.jsx)("div",{className:t,children:null!==o.start&&null!==o.end?Object(s.jsxs)("div",{className:"view__calendar__inner",children:[i(),d()]}):null})}var Oe=a(101);function he(e){var t=e.className,a=Object(c.useContext)(K),n=a.posts.scheduled,r=a.postsDispatch,o=Object(c.useContext)(y).viewOptions.viewRange,i=o.start,d=o.end;Object(c.useEffect)((function(){r({type:"REFETCH"})}),[r]),le(i,d);var u=function(){var e=[],t=i,a=["listDay"];if("undefined"!==d&&null!==d)for(;Object(Oe.default)(t)<=Object(Oe.default)(d);)Object(J.a)(t)&&a.push("today"),Object(B.a)(t)&&!Object(J.a)(t)&&a.push("past"),e.push(Object(s.jsx)("li",{className:a.join(" "),children:Object(s.jsx)(je,{date:t,posts:n,allowDrag:!0,title:Object(V.default)(t,E),newPostButton:!0})},t)),t=Object(F.default)(t,1);return e};return Object(s.jsx)("div",{className:t,children:null!==i&&null!==d?Object(s.jsx)(s.Fragment,{children:Object(s.jsx)("div",{className:"view__list__days",children:Object(s.jsx)("ul",{children:u()})})}):null})}var fe=a(69),ve=a.n(fe),me=a(169),xe=(a(102),{post:{},editMode:!1});function ge(e,t){switch(t.type){case"SET":return{post:t.post,editMode:!0};case"EDIT":var a=t.field,s=t.value;return"post_date"===a&&(s=new Date(s)),Object(l.a)(Object(l.a)({},e),{},{post:Object(l.a)(Object(l.a)({},e.post),{},Object(u.a)({},a,s))});case"DATE_CHANGE":return Object(l.a)(Object(l.a)({},e),{},{post:Object(l.a)(Object(l.a)({},e.post),{},{post_date:t.newDate})});case"CLEAR":return xe;default:return{state:e}}}function _e(){var e=Object(c.useContext)(K),t=e.posts.currentPost,a=e.postsDispatch,n=Object(c.useContext)(ae).draggedPostDispatch,r=Object(c.useReducer)(ge,xe),o=Object(i.a)(r,2),u=o[0],l=o[1],j=Object(c.useReducer)(Z,z),b=Object(i.a)(j,2),O=b[0],h=b[1],m=Object(c.useRef)(),g=Object(c.useState)(new Date),_=Object(i.a)(g,2),E=_[0],w=_[1],D=Object(c.useState)({}),y=Object(i.a)(D,2),T=y[0],C=y[1],S=Object(c.useState)(!1),P=Object(i.a)(S,2),R=P[0],k=P[1],U=Object(c.useState)(!1),L=Object(i.a)(U,2),M=L[0],A=L[1],F=u.post,G=u.editMode;Object(c.useEffect)((function(){return F.post_date&&"undefined"!==F.post_date&&w(new Date(F.post_date)),function(){w(new Date)}}),[F.post_date]),Object(c.useEffect)((function(){var e=[];!0===F.unscheduled?e.push("publish","future","pending"):Object(me.a)(E)?e.push("publish"):Object(B.a)(E)&&e.push("future");var t=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=v;if(e.length>0)for(var a in v)e.includes(a)&&(t=Object(p.omit)(t,a));return t}(e);C(t)}),[E,F.unscheduled]),Object(c.useEffect)((function(){k(!(!t.post_date||!Object(J.a)(t.post_date)&&!Object(B.a)(t.post_date)||"publish"!==t.post_status))}),[t.post_date,t.post_status]),Object(c.useEffect)((function(){if(!0===O.updateNow&&"undefined"!==t.id){h({type:"UPDATING"});var e="".concat(f,"/");!0===O.trash?e+="trash/".concat(t.id):0===t.id?e+="new":e+="update/".concat(t.id);var s={params:N(O.params,t),unscheduled:O.unscheduled};if(Object(p.isEmpty)(s.params))return{data:"Update not necessary.",error:!0};(function(){var t=Object(Y.a)(X.a.mark((function t(){var c;return X.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});case 3:return c=t.sent,t.next=6,c.json();case 6:n({type:"END"}),h({type:"COMPLETE"}),a({type:"SET_CURRENTPOST",post:F,unscheduled:F.unscheduled}),a({type:"REFETCH"}),t.next=15;break;case 12:t.prev=12,t.t0=t.catch(0),console.log(t.t0.message);case 15:case"end":return t.stop()}}),t,null,[[0,12]])})));return function(){return t.apply(this,arguments)}})()()}}),[t,F,n,a,O.trash,O.params,O.updateNow,O.unscheduled]),Object(c.useEffect)((function(){(t.id>0||0===t.id)&&l({type:"SET",post:t})}),[t.id,t]);var H=Object(c.useCallback)((function(){l({type:"CLEAR"}),a({type:"UNSET_CURRENTPOST"})}),[l,a]);Object(c.useEffect)((function(){var e=function(e){m.current&&m.current.contains(e.target)||H()};return Object(p.isEmpty)(t)?document.removeEventListener("mousedown",e):document.addEventListener("mousedown",e),function(){document.removeEventListener("mousedown",e)}}),[t,a,H]);var I,W=function(e){l({type:"EDIT",field:e.target.name,value:e.target.value})};return G?Object(s.jsx)("div",{className:"editPost",children:Object(s.jsx)("div",{className:"editPost__container",children:Object(s.jsxs)("div",{ref:m,className:"editPost__editor",children:[Object(s.jsx)("button",{className:"close icon",onClick:H,children:"highlight_off"}),Object(s.jsxs)("h3",{className:"title",children:[0===F.id?"New":"Edit"," Post"]}),Object(s.jsxs)("form",{className:"editPost__editor__form",onSubmit:function(e){e.preventDefault(),h({type:"UPDATE",params:{post_title:F.post_title,post_date:Object(V.default)(new Date(F.post_date),x),post_status:F.post_status,post_excerpt:F.post_excerpt},unscheduled:F.unscheduled}),l({type:"CLEAR"})},children:[Object(s.jsx)(d,{name:"post_title",label:"Title",children:Object(s.jsx)("input",{name:"post_title",value:Object(ee.decode)(F.post_title,{scope:"strict"}),onChange:W})}),Object(s.jsxs)(d,{name:"date",children:[Object(s.jsxs)("div",{className:"fieldGroup__field post_date ".concat(!0===F.unscheduled?"inactive":"active"),children:[Object(s.jsx)("label",{htmlFor:"post_date",children:"Post Date"}),Object(s.jsx)(ve.a,{closeOnScroll:function(e){return e.target===document},selected:E,onChange:function(e){null===e&&(e=new Date),l({type:"EDIT",field:"post_date",value:e})},disabled:R})]}),Object(s.jsxs)("div",{className:"fieldGroup__field unscheduled",children:[Object(s.jsx)("input",{type:"checkbox",name:"unscheduled",checked:F.unscheduled,onChange:function(e){l({type:"EDIT",field:e.target.name,value:!F[e.target.name]})}}),Object(s.jsx)("label",{htmlFor:"unscheduled",children:"Unscheduled"})]})]}),Object(s.jsx)(d,{name:"post_status",label:"Status",children:Object(s.jsx)("select",{name:"post_status",onChange:W,value:F.post_status,children:(I=T,Object.keys(I).map((function(e){return Object(s.jsx)("option",{value:e,children:I[e].name},e)})))})}),Object(s.jsx)(d,{name:"taxonomies",label:"Categories & Tags",children:Object(s.jsx)("p",{children:"Coming soon"})}),Object(s.jsx)(d,{name:"post_excerpt",label:"Excerpt",children:Object(s.jsx)("textarea",{name:"post_excerpt",onChange:W,rows:4,value:Object(ee.decode)(F.post_excerpt,{scope:"strict"})})}),Object(s.jsx)("div",{className:"post_thumb",children:F.image?Object(s.jsxs)("div",{children:[Object(s.jsx)("span",{children:"Featured Image"}),Object(s.jsx)("a",{href:Object(ee.decode)(F.edit_link),target:"_blank",rel:"noreferrer",children:Object(s.jsx)("img",{src:F.image,alt:"".concat(F.post_title)})})]}):null}),Object(s.jsx)("div",{className:"editPost__buttons",children:!0===M?Object(s.jsxs)("div",{className:"editPost__buttons__trash confirm",children:[Object(s.jsx)("p",{style:{fontWeight:"bold"},children:"Are you sure you want to Trash this post?"}),Object(s.jsx)("input",{type:"button",onClick:function(){h({type:"TRASH",params:{id:F.id}}),l({type:"CLEAR"}),A(!1)},value:"Yes",autoFocus:!0}),Object(s.jsx)("input",{type:"button",onClick:function(){return A(!1)},value:"No"})]}):Object(s.jsxs)(s.Fragment,{children:[Object(s.jsx)("input",{type:"submit",className:"editPost__buttons__save",value:0===F.id?"Save":"Update"}),Object(s.jsx)("input",{type:"button",className:"editPost__buttons__cancel",onClick:function(){return l({type:"CLEAR"})},value:"Cancel"}),Object(s.jsx)("input",{type:"button",className:"editPost__buttons__trash",onClick:function(){return A(!0)},value:"Delete"})]})})]})]})})}):null}function Ee(){var e=Object(c.useContext)(y).viewOptions.viewMode;return Object(s.jsxs)("main",{className:"calendario__main",children:[Object(s.jsxs)("div",{className:"view",children:[Object(s.jsx)(R,{className:"view__options"}),"calendar"===e?Object(s.jsx)(pe,{className:"view__calendar"}):Object(s.jsx)(he,{className:"view__list"})]}),Object(s.jsx)(_e,{})]})}function we(){var e=Object(c.useContext)(K),t=e.posts.unscheduled,a=e.postsDispatch;Object(c.useEffect)((function(){a({type:"REFETCH"})}),[a]);var n=function(){var e=Object(c.useContext)(K),t=e.posts.refetch,a=e.postsDispatch,s=Object(c.useState)(!1),n=Object(i.a)(s,2),r=n[0],o=n[1];return Object(c.useEffect)((function(){var e="".concat(f,"/unscheduled");return function(){var t=Object(Y.a)(X.a.mark((function t(){var s,c;return X.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o(!0),t.prev=1,t.next=4,fetch(e,{headers:ue});case 4:return s=t.sent,t.next=7,s.json();case 7:c=t.sent,a({type:"SET_UNSCHEDULED",posts:c.posts,unscheduled:!0}),o(!1),t.next=16;break;case 12:t.prev=12,t.t0=t.catch(1),console.log("REST error",t.t0.message),o(!1);case 16:case"end":return t.stop()}}),t,null,[[1,12]])})));return function(){return t.apply(this,arguments)}}()(),function(){o(!1)}}),[a,t]),r}();return Object(s.jsxs)(s.Fragment,{children:[Object(s.jsx)(oe,{className:"unscheduledDrafts",date:!1,posts:t,allowDrag:!0,loadingState:n}),Object(s.jsx)(ie,{unscheduled:!0})]})}function Ne(){var e=Object.keys(v),t=Object(c.useContext)(y),a=t.viewOptions.statuses,n=t.viewOptionsDispatch,r=function(e){n({type:"TOGGLE_STATUS",status:e.target.name})};return Object(s.jsx)("div",{className:"statusFilters",children:Object(s.jsx)("ul",{className:"filters",children:e.map((function(e,t){var c=v[e],n=c.color,o=c.backgroundColor,i=c.name;return Object(s.jsxs)("li",{className:"filterItem status__".concat(e),children:[Object(s.jsx)("button",{className:"dot ".concat(a[e]?"visible":"hidden"),name:e,style:!0===a[e]?{color:n,backgroundColor:o,borderColor:o}:{color:n,borderColor:o},onClick:r}),Object(s.jsx)("span",{className:"name",children:i})]},t)}))})})}function De(){return Object(s.jsx)("aside",{className:"calendario__sidebar",children:Object(s.jsxs)("div",{className:"calendario__sidebar__inner",children:[D("Unscheduled Drafts","unscheduledDrafts",Object(s.jsx)(we,{})),D("","statusFilters",Object(s.jsx)(Ne,{})),D("Dev Links + Info","dev",Object(s.jsxs)(s.Fragment,{children:[Object(s.jsxs)("ul",{style:{marginLeft:0,paddingLeft:"24px",listStylePosition:"outside"},children:[Object(s.jsx)("li",{children:Object(s.jsx)("a",{href:"https://github.com/gaswirth/rhdwp-calendario#readme",target:"_blank",rel:"noreferrer",children:"TODO/Readme"})}),Object(s.jsx)("li",{children:Object(s.jsx)("a",{href:"https://github.com/gaswirth/rhdwp-calendario/issues",target:"_blank",rel:"noreferrer",children:"Report an issue"})}),Object(s.jsxs)("li",{children:["GitHub:"," ",Object(s.jsx)("a",{href:"https://github.com/gaswirth/rhdwp-calendario",target:"_blank",rel:"noreferrer",children:"gaswirth/rhdwp-calendario"})]})]}),Object(s.jsx)("p",{style:{fontSize:"0.7em"},children:Object(s.jsx)("a",{href:"https://roundhouse-designs.com",target:"_blank",rel:"noreferrer",children:"Roundhouse Designs"})})]}))]})})}a(157);function ye(){var e=Object(c.useReducer)($,Q),t=Object(i.a)(e,2),a=t[0],n=t[1],r=Object(c.useReducer)(se,ce),o=Object(i.a)(r,2),d=o[0],u=o[1],l=Object(c.useReducer)(T,P),j=Object(i.a)(l,2),b=j[0],p=j[1],O=function(e,t){var a=Object(c.useState)((function(){var a=window.localStorage.getItem(t);return null!==a?JSON.parse(a):e})),s=Object(i.a)(a,2),n=s[0],r=s[1];return Object(c.useEffect)((function(){window.localStorage.setItem(t,JSON.stringify(n))}),[t,n]),[n,r]}({viewMode:"calendar"},"viewOptions"),h=Object(i.a)(O,2),f=h[0],v=h[1];return Object(c.useEffect)((function(){p({type:"UPDATE",viewMode:f.viewMode})}),[]),Object(c.useEffect)((function(){v({viewMode:b.viewMode})}),[v,b.viewMode]),Object(s.jsx)("div",{className:"calendario",children:Object(s.jsx)(c.Profiler,{id:"Main",onRender:function(e,t,a,s,c,n,r){},children:Object(s.jsx)(y.Provider,{value:{viewOptions:b,viewOptionsDispatch:p},children:Object(s.jsxs)(K.Provider,{value:{posts:a,postsDispatch:n},children:[Object(s.jsx)(I,{}),Object(s.jsxs)(ae.Provider,{value:{draggedPost:d,draggedPostDispatch:u},children:[Object(s.jsx)(Ee,{}),Object(s.jsx)(De,{})]})]})})})})}var Te,Ce=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,170)).then((function(t){var a=t.getCLS,s=t.getFID,c=t.getFCP,n=t.getLCP,r=t.getTTFB;a(e),s(e),c(e),n(e),r(e)}))},Se=(window.rhdReactPlugin||{}).appSelector;(Te=document.querySelector(Se))&&o.a.render(Object(s.jsx)(n.a.StrictMode,{children:Object(s.jsx)(ye,{})}),Te),Ce()},77:function(e,t,a){}},[[158,1,2]]]);
//# sourceMappingURL=main.7ae65239.chunk.js.map