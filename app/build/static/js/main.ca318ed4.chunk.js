(this["webpackJsonpreact-app"]=this["webpackJsonpreact-app"]||[]).push([[0],{133:function(e,t,a){},135:function(e,t,a){"use strict";a.r(t);var c=a(0),s=a(3),n=a.n(s),r=a(28),o=a.n(r),i=(a(67),a(6)),d=a(19),u=a(5),l=a(10),j=a(69),b=a(29),O=a(70),p=a(12);function h(e){var t=e.title,a=e.className,s=e.children;return Object(c.jsxs)("div",{className:"widget ".concat(a),children:[t?Object(c.jsx)("h3",{className:"widgetTitle",children:t}):null,s]})}var f,v,m;f=window.rhdReactPlugin.nonce,v=window.rhdReactPlugin.restBase,m=window.rhdReactPlugin.postStatuses;var g="d",_="yyyy-MM-dd",x="EEEE",w="MMM",E="EEEE,  MMMM dd, yyyy",N="MMMM dd, yyyy";function y(e,t){if(e.length>0)for(var a in e)e[a]===t[a]&&(e=Object(p.omit)(e,a));return e}var T=function(e,t,a){return Object(c.jsx)(h,{title:e,className:"widget__".concat(t),children:a})},D=Object(s.createContext)({});function C(e,t){switch(t.type){case"UPDATE":return Object(u.a)(Object(u.a)({},e),{},{viewMode:t.viewMode?t.viewMode:e.viewMode,viewRange:t.viewRange?t.viewRange:e.viewRange});case"SET_RANGE":var a="list"!==e.viewMode?{start:Object(l.default)(t.start),end:Object(j.default)(t.end)}:{start:t.start,end:t.end};return Object(u.a)(Object(u.a)({},e),{},{viewRange:{start:a.start,end:a.end}});case"SET_RANGE_START":return Object(u.a)(Object(u.a)({},e),{},{viewRange:Object(u.a)(Object(u.a)({},e.viewRange),{},{start:"list"!==e.viewMode?Object(l.default)(t.date):t.date})});case"SET_RANGE_END":return Object(u.a)(Object(u.a)({},e),{},{viewRange:Object(u.a)(Object(u.a)({},e.viewRange),{},{end:"list"!==e.viewMode?Object(j.default)(t.date):t.date})});case"NEXT_MONTH":return Object(u.a)(Object(u.a)({},e),{},{viewRange:{start:Object(b.default)(e.viewRange.start,1),end:Object(b.default)(e.viewRange.end,1)}});case"PREV_MONTH":return Object(u.a)(Object(u.a)({},e),{},{viewRange:{start:Object(O.default)(e.viewRange.start,1),end:Object(O.default)(e.viewRange.end,1)}});case"TOGGLE_STATUS":return Object(u.a)(Object(u.a)({},e),{},{statuses:Object(u.a)(Object(u.a)({},e.statuses),{},Object(d.a)({},t.status,!e.statuses[t.status]))});default:return e}}var R={};for(var S in m)R[S]=!0;var P={viewMode:"",viewRange:{start:null,end:null},statuses:R};function k(){var e=Object(s.useContext)(D),t=e.viewOptions.viewMode,a=e.viewOptionsDispatch,n=function(e){a({type:"UPDATE",viewMode:e.target.value})};return Object(c.jsx)("div",{className:"viewOptions",children:Object(c.jsxs)("div",{className:"viewMode",children:[Object(c.jsx)("button",{onClick:n,className:"icon ".concat("calendar"===t?"active ":"inactive"),value:"calendar",title:"Calendar",children:"calendar_view_month"}),Object(c.jsx)("button",{name:"viewMode",onClick:n,className:"icon ".concat("list"===t?"active ":"inactive"),value:"list",title:"List",children:"view_list"})]})})}var M=a(31),U=a.n(M),A=a(140),L=a(71),F=a(72),G=a(30);function H(e){var t=e.handleTodayClick,a=Object(s.useContext)(D),n=a.viewOptions.viewRange,r=a.viewMode,o=a.viewOptionsDispatch,i=Object(A.a)(),d=Object(s.forwardRef)((function(e,t){var a=e.value,s=e.onClick;return Object(c.jsx)("button",{className:"viewRange__input",onClick:s,ref:t,children:a})}));Object(s.useEffect)((function(){n.start||n.end||o({type:"SET_RANGE",start:"calendar"===r?Object(L.default)(i):i,end:"calendar"===r?Object(F.default)():Object(G.default)(i,30)})}),[i,n.start,n.end,r,o]);return Object(c.jsxs)("div",{className:"calendarListHeader row flex-middle",children:[Object(c.jsx)("div",{className:"col col__start",children:Object(c.jsx)("button",{className:"icon dateChevron",onClick:function(e){e.preventDefault(),o({type:"PREV_MONTH"})},title:"Previous Month",children:"chevron_left"})}),Object(c.jsxs)("div",{className:"col col__center mainViewOptions",children:[Object(c.jsx)("div",{className:"toToday",children:Object(c.jsx)("button",{className:"icon today",onClick:t,title:"Jump to Today",children:"today"})}),Object(c.jsxs)("div",{className:"viewRange",children:[Object(c.jsx)(U.a,{dateFormat:N,selected:n.start,onChange:function(e){return o({type:"SET_RANGE_START",date:e})},customInput:Object(c.jsx)(d,{}),selectsStart:!0,startDate:n.start,endDate:n.end,closeOnScroll:function(e){return e.target===document}})," to ",Object(c.jsx)(U.a,{dateFormat:N,selected:n.end,onChange:function(e){return o({type:"SET_RANGE_END",date:e})},customInput:Object(c.jsx)(d,{}),selectsEnd:!0,startDate:n.start,endDate:n.end,minDate:n.start,monthsShown:2,closeOnScroll:function(e){return e.target===document}})]}),Object(c.jsx)(k,{})]}),Object(c.jsx)("div",{className:"col col__end",children:Object(c.jsx)("button",{className:"icon dateChevron",onClick:function(e){e.preventDefault(),o({type:"NEXT_MONTH"})},title:"Next Month",children:"chevron_right"})})]})}function I(e){var t=e.handleTodayClick;return Object(c.jsx)("header",{className:"calendario__header",children:Object(c.jsxs)("div",{className:"calendario__header__content",children:[Object(c.jsx)("div",{className:"left",children:Object(c.jsx)(H,{handleTodayClick:t})}),Object(c.jsx)("div",{className:"right",children:Object(c.jsx)("h1",{className:"calendario__title",children:"the editorial calendorial"})})]})})}var J=a(141),V=a(142),B=a(137),W=Object(s.forwardRef)((function(e,t){var a=e.day,s=e.monthName,n=e.children,r=["day","col","cell"];return Object(J.a)(a)&&r.push("today"),Object(V.a)(a)&&!Object(J.a)(a)&&r.push("past"),Object(c.jsxs)("div",{className:r.join(" "),ref:Object(J.a)(a)?t:null,children:[s?Object(c.jsx)("span",{className:"month",children:s}):"",Object(c.jsx)("span",{className:"number",children:Object(B.default)(a,g)}),n]})})),X=a(9),Y=a.n(X),q=a(17),z={updateNow:!1,trash:!1,params:{},unscheduled:!1};function K(e,t){switch(t.type){case"UPDATE":return{updateNow:!0,params:t.params,unscheduled:t.unscheduled};case"UPDATING":return Object(u.a)(Object(u.a)({},e),{},{updateNow:!1});case"TRASH":return{trash:!0,updateNow:!0,params:t.params};case"COMPLETE":return z;default:return e}}var Q=Object(s.createContext)({}),Z={currentPost:{id:null,post_title:"",post_status:"",post_date:"",unscheduled:null},refetch:!1,dateRange:{start:"",end:""},unscheduled:[],scheduled:[],trashed:[]};function $(e,t){switch(t.type){case"SET_SCHEDULED":var a=t.posts;return a.forEach((function(e,t){a[t].post_date=new Date(e.post_date)})),Object(u.a)(Object(u.a)({},e),{},{dateRange:{start:t.start,end:t.end},scheduled:a});case"SET_UNSCHEDULED":var c=t.posts;return c.forEach((function(e,t){c[t].post_date=new Date(e.post_date)})),Object(u.a)(Object(u.a)({},e),{},{unscheduled:c});case"SET_TRASHED":var s=t.posts;return s.forEach((function(e,t){s[t].post_date=new Date(e.post_date)})),Object(u.a)(Object(u.a)({},e),{},{trashed:s});case"REFETCH":return Object(u.a)(Object(u.a)({},e),{},{refetch:!e.refetch});case"SET_CURRENTPOST":return Object(u.a)(Object(u.a)({},e),{},{currentPost:Object(u.a)(Object(u.a)({},t.post),{},{unscheduled:t.unscheduled})});case"NEW_POST":return Object(u.a)(Object(u.a)({},e),{},{currentPost:{id:0,post_date:t.post_date,unscheduled:t.unscheduled}});case"UPDATE_CURRENTPOST_FIELD":return Object(u.a)(Object(u.a)({},e),{},{currentPost:Object(u.a)(Object(u.a)({},e.currentPost),{},Object(d.a)({},t.field,t.value))});case"UNSET_CURRENTPOST":return Object(u.a)(Object(u.a)({},e),{},{currentPost:Z.currentPost});default:return e}}var ee=a(20);function te(e){var t=e.post,a=e.className,n=e.unscheduled,r=t.id,o=t.edit_link,d=t.view_link,u=Object(s.useContext)(Q).postsDispatch,l=Object(s.useReducer)(K,z),j=Object(i.a)(l,2),b=j[0],O=j[1];Object(s.useEffect)((function(){if(!0===b.updateNow&&"undefined"!==r){O({type:"UPDATING"});var e="".concat(v,"/");!0===b.trash?e+="trash/".concat(r):e+="update/".concat(r);var t={unscheduled:b.unscheduled};(function(){var a=Object(q.a)(Y.a.mark((function a(){var c;return Y.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});case 3:return c=a.sent,a.next=6,c.json();case 6:O({type:"COMPLETE"}),u({type:"REFETCH"}),a.next=13;break;case 10:a.prev=10,a.t0=a.catch(0),console.log(a.t0.message);case 13:case"end":return a.stop()}}),a,null,[[0,10]])})));return function(){return a.apply(this,arguments)}})()()}}),[r,u,b.trash,b.params,b.updateNow,b.unscheduled]);return Object(c.jsxs)("div",{className:"postLinks ".concat(a),children:[Object(c.jsx)("a",{className:"icon top left icon__view",href:d,target:"_blank",rel:"noreferrer",title:"View Post",children:"open_in_new"}),Object(c.jsx)("a",{className:"icon top right icon__edit",href:Object(ee.decode)(o),target:"_blank",rel:"noreferrer",title:"Edit Post in a new tab",children:"mode_edit"}),n?Object(c.jsx)("button",{className:"icon icon__schedule bottom right",onClick:function(e){e.preventDefault(),O({type:"UPDATE",params:{},unscheduled:!1})},title:"Schedule this post",children:"event_available"}):Object(c.jsx)("button",{className:"icon icon__unschedule bottom right",onClick:function(e){e.preventDefault(),O({type:"UPDATE",params:{},unscheduled:!0})},title:"Unschedule this post",children:"drafts"}),Object(c.jsx)("button",{className:"icon icon__trash bottom left",onClick:function(){O({type:"TRASH",params:{id:r}})},title:"Trash this post",children:"delete_forever"})]})}var ae=Object(s.createContext)(null);function ce(e,t){switch(t.type){case"START":return{post:t.post,isDragging:!0,draggedFrom:t.draggedFrom>=0&&t.draggedFrom};case"DRAGGING_OVER_UNSCHEDULED":return Object(u.a)(Object(u.a)({},e),{},{draggedTo:t.draggedOver,overUnscheduled:!0});case"DRAGGING_OVER_SCHEDULED":return Object(u.a)(Object(u.a)({},e),{},{draggedTo:null,overUnscheduled:!1});case"END":return se;default:return e}}var se={post:{},isDragging:!1,draggedFrom:null,draggedTo:null,overUnscheduled:!1};function ne(e){var t=e.post,a=e.index,n=e.unscheduled,r=e.allowDrag,o=Object(s.useContext)(Q),d=o.posts.currentPost,u=o.postsDispatch,l=Object(s.useContext)(ae),j=l.draggedPost,b=j.isDragging,O=j.draggedFrom,h=j.draggedTo,f=l.draggedPostDispatch,v=Object(s.useContext)(D).viewOptions.statuses,g=Object(s.useState)({}),_=Object(i.a)(g,2),x=_[0],w=_[1],E=Object(s.useState)(new Date),N=Object(i.a)(E,2),y=N[0],T=N[1],C=Object(s.useState)(!1),R=Object(i.a)(C,2),S=R[0],P=R[1];Object(s.useEffect)((function(){T(new Date(t.post_date))}),[t.post_date]),Object(s.useEffect)((function(){w({color:m[t.post_status].color,backgroundColor:m[t.post_status].backgroundColor})}),[t.post_status]);var k=function(e){var a=!!e.currentTarget.parentNode.classList.contains("unscheduledDrafts");f({type:"START",post:t,draggedFrom:!!a&&Number(e.currentTarget.dataset.index)})},M=function(){return f({type:"END"})},U=function(e){if(!e.target.classList.contains("icon")){var a=!(!e.target.classList.contains("unscheduledDrafts")&&!e.target.parentNode.classList.contains("unscheduledDrafts"));u({type:"SET_CURRENTPOST",post:t,unscheduled:a})}};return t?function(){var e=["post","post-id-".concat(t.id," status__").concat(t.post_status)];return b&&(h===Number(a)&&(e.push("dropArea"),!1===O?e.push("fromNowhere"):O<h?e.push("fromAbove"):O>h&&e.push("fromBelow")),O===Number(a)&&e.push("dragging")),Object(p.isEmpty)(d)||d.id!==t.id||e.push("currentPost"),Object(c.jsxs)("li",{id:t.id,className:e.join(" "),style:!1===n&&!0===v[t.post_status]||!0===n?{visibility:"visible"}:{visibility:"hidden"},"data-index":a,draggable:!0===r||!Object(J.a)(y)&&!Object(V.a)(y),onDragStart:k,onDragEnd:M,onClick:U,onMouseEnter:function(){return P(!0)},onMouseLeave:function(){return P(!1)},children:[Object(c.jsx)(te,{className:S&&!b?"visible":"hidden",post:t,unscheduled:n}),Object(c.jsx)("p",{className:"postData",style:{backgroundColor:x.backgroundColor,color:x.color},children:Object(ee.decode)(t.post_title,{scope:"strict"})})]})}():null}function re(e){var t=e.className;return Object(c.jsx)("div",{className:"loadingOverlay ".concat(t),children:Object(c.jsxs)("div",{className:"roller",children:[Object(c.jsx)("div",{}),Object(c.jsx)("div",{}),Object(c.jsx)("div",{}),Object(c.jsx)("div",{}),Object(c.jsx)("div",{}),Object(c.jsx)("div",{}),Object(c.jsx)("div",{}),Object(c.jsx)("div",{})]})})}function oe(e){var t=e.posts,a=e.className,n=e.allowDrag,r=e.allowDrop,o=e.date,d=e.loadingState,l=Object(s.useContext)(Q),j=l.posts.currentPost,b=l.postsDispatch,O=Object(s.useContext)(ae),h=O.draggedPost,m=h.post,g=h.draggedTo,x=h.draggedFrom,w=h.overUnscheduled,E=O.draggedPostDispatch,N=Object(s.useReducer)(K,z),T=Object(i.a)(N,2),D=T[0],C=T[1],R=Object(s.useState)(!1),S=Object(i.a)(R,2),P=S[0],k=S[1];Object(s.useEffect)((function(){if(void 0!==d&&null!==d)return k(d),function(){k(!1)}}),[d]),Object(s.useEffect)((function(){if(!0===D.updateNow&&"undefined"!==m.id){C({type:"UPDATING"});var e="".concat(v,"/update/").concat(m.id),t={params:y(D.params,m),unscheduled:D.unscheduled};if(null!==g&&(t.draggedTo=g),Object(p.isEmpty)(t))return{data:"Update not necessary.",error:!0};var a={"Content-Type":"application/json"};a["X-WP-Nonce"]=f,function(){var c=Object(q.a)(Y.a.mark((function c(){var s;return Y.a.wrap((function(c){for(;;)switch(c.prev=c.next){case 0:return k(!0),c.prev=1,c.next=4,fetch(e,{method:"POST",headers:a,body:JSON.stringify(t)});case 4:return s=c.sent,c.next=7,s.json();case 7:b({type:"REFETCH"}),E({type:"END"}),C({type:"COMPLETE"}),k(!1),c.next=17;break;case 13:c.prev=13,c.t0=c.catch(1),console.log(c.t0.message),k(!1);case 17:case"end":return c.stop()}}),c,null,[[1,13]])})));return function(){return c.apply(this,arguments)}}()()}}),[D,g,E,m,b]);var M=function(e){if(e.preventDefault(),!1!==n)if(e.currentTarget.classList.contains("unscheduledDrafts")){var t=Number(e.target.dataset.index),a=!1;if(x===t)return;if((a=!Number.isNaN(t)&&t)!==g){if(!1===a){var c=e.currentTarget.getBoundingClientRect(),s=e.clientY-c.top,r=e.currentTarget.childNodes,o=r.length;a=0===r.length||s<r[0].offsetTop?0:s>=r[o-1].offsetTop?o:o-1}E({type:"DRAGGING_OVER_UNSCHEDULED",draggedOver:a})}}else!0===w&&E({type:"DRAGGING_OVER_SCHEDULED"})},U=function(){!1!==r&&(C({type:"UPDATE",params:{post_date:!1===o?Object(B.default)(m.post_date,_):Object(B.default)(o,_)},unscheduled:w}),j.id===m.id&&b({type:"UPDATE_CURRENTPOST_FIELD",field:"post_date",value:o}))};return function(){var e={className:"postList ".concat(a),onDragOver:M};return!1!==r?e.onDrop=U:e.className+=" dropDisabled",Object(c.jsxs)(c.Fragment,{children:[Object(c.jsx)(re,{className:P?"active":null}),Object(c.jsx)("ul",Object(u.a)(Object(u.a)({},e),{},{children:t.map((function(e,t){return Object(c.jsx)(ne,{post:e,index:t,unscheduled:!1===o,allowDrag:n},e.id)}))}))]})}()}function ie(e){var t=e.day,a=e.unscheduled,n=Object(s.useContext)(Q).postsDispatch;return Object(c.jsx)("button",{className:"icon newPost",onClick:function(e){e.preventDefault(),n({type:"NEW_POST",post_date:t||new Date,unscheduled:a||!1})},children:"add_circle"})}var de=a(46),ue={};ue["X-WP-Nonce"]=f;var le=function(e,t){var a=Object(s.useContext)(Q),c=a.posts.refetch,n=a.postsDispatch,r=Object(s.useState)(!1),o=Object(i.a)(r,2),d=o[0],u=o[1];return Object(s.useEffect)((function(){if(null!==e&&null!==t){var a=Object(B.default)(e,_),c=Object(B.default)(t,_),s="".concat(v,"/scheduled/").concat(a,"/").concat(c);return function(){var e=Object(q.a)(Y.a.mark((function e(){var t,a;return Y.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return u(!0),e.prev=1,e.next=4,fetch(s,{headers:ue});case 4:return t=e.sent,e.next=7,t.json();case 7:a=e.sent,n({type:"SET_SCHEDULED",posts:a.posts,start:a.dateRange.start,end:a.dateRange.end}),u(!1),e.next=16;break;case 12:e.prev=12,e.t0=e.catch(1),console.log("REST error",e.t0.message),u(!1);case 16:case"end":return e.stop()}}),e,null,[[1,12]])})));return function(){return e.apply(this,arguments)}}()(),function(){u(!1)}}}),[e,t,c,n]),d};function je(e){var t=e.posts,a=e.date,s=e.allowDrag,n=e.allowDrop,r=e.title,o=e.loadingState,i=function(e,t){var a=[];return e&&e.forEach((function(e){Object(de.default)(t,new Date(e.post_date))&&a.push(e)})),a}(t,a);return function(){var e={className:"dayPosts",date:a,posts:i,allowDrop:!0,loadingState:o};"undefined"!==s&&null!==s&&(e.allowDrag=s),e.allowDrop=!1!==n;var t=Object(c.jsxs)(c.Fragment,{children:[Object(c.jsx)(ie,{day:a,unscheduled:!1}),Object(c.jsx)(oe,Object(u.a)({},e))]});return r?Object(c.jsxs)(c.Fragment,{children:[Object(c.jsx)("h4",{className:"title",children:r}),t]}):t}()}var be=a(143);function Oe(e){var t=e.className,a=e.todayRef,n=Object(s.useContext)(Q),r=n.posts.scheduled,o=n.postsDispatch,i=Object(s.useContext)(D).viewOptions.viewRange;Object(s.useEffect)((function(){o({type:"REFETCH"})}),[o]),le(i.start,i.end);var d=Object(s.useCallback)((function(){for(var e=[],t=Object(l.default)(i.start),a=0;a<7;a++)e.push(Object(c.jsx)("div",{className:"col col__center",children:Object(B.default)(Object(G.default)(t,a),x)},a));return Object(c.jsx)("div",{className:"days row",children:e})}),[i.start]),u=Object(s.useCallback)((function(){for(var e=[],t=[],s=i.start,n=!0;s<=i.end;){for(var o=0;o<7;o++){var d=Object(be.a)(s)||n;t.push(Object(c.jsx)(W,{ref:Object(J.a)(s)?a:null,day:s,monthName:d?Object(B.default)(s,w):"",children:Object(c.jsx)(je,{date:s,posts:r,allowDrag:!0,renderEmpty:!0})},s)),n=!1,s=Object(G.default)(s,1)}e.push(Object(c.jsx)("div",{className:"row",children:t},s)),t=[]}return Object(c.jsx)("div",{className:"body",children:e})}),[i.end,i.start,r,a]);return Object(c.jsx)("div",{className:t,children:null!==i.start&&null!==i.end?Object(c.jsxs)("div",{className:"view__calendar__inner",children:[d(),u()]}):null})}var pe=a(103);function he(e){var t=e.className,a=Object(s.useContext)(Q),n=a.posts.scheduled,r=a.postsDispatch,o=Object(s.useContext)(D).viewOptions.viewRange,i=o.start,d=o.end;Object(s.useEffect)((function(){r({type:"REFETCH"})}),[r]),le(i,d);var u=function(){var e=[],t=i,a=["listDay"];if("undefined"!==d&&null!==d)for(;Object(pe.default)(t)<=Object(pe.default)(d);)Object(J.a)(t)&&a.push("today"),Object(V.a)(t)&&!Object(J.a)(t)&&a.push("past"),e.push(Object(c.jsx)("li",{className:a.join(" "),children:Object(c.jsx)(je,{date:t,posts:n,allowDrag:!0,title:Object(B.default)(t,E),newPostButton:!0})},t)),t=Object(G.default)(t,1);return e};return Object(c.jsx)("div",{className:t,children:null!==i&&null!==d?Object(c.jsx)(c.Fragment,{children:Object(c.jsx)("div",{className:"view__list__days",children:Object(c.jsx)("ul",{children:u()})})}):null})}function fe(e){var t=e.name,a=e.label,s=e.inlineLabel,n=e.children;return Object(c.jsxs)("div",{className:"fieldGroup fieldGroup__".concat(t," ").concat(s?"inlineLabel":""),children:[a?Object(c.jsx)("label",{htmlFor:t,children:a}):null,n]})}var ve=a(144),me={post:{},editMode:!1};function ge(e,t){switch(t.type){case"SET":return{post:t.post,editMode:!0};case"EDIT":var a=t.field,c=t.value;return"post_date"===a&&(c=new Date(c)),Object(u.a)(Object(u.a)({},e),{},{post:Object(u.a)(Object(u.a)({},e.post),{},Object(d.a)({},a,c))});case"DATE_CHANGE":return Object(u.a)(Object(u.a)({},e),{},{post:Object(u.a)(Object(u.a)({},e.post),{},{post_date:t.newDate})});case"CLEAR":return me;default:return{state:e}}}function _e(){var e=Object(s.useContext)(Q),t=e.posts.currentPost,a=e.postsDispatch,n=Object(s.useContext)(ae).draggedPostDispatch,r=Object(s.useReducer)(ge,me),o=Object(i.a)(r,2),d=o[0],u=o[1],l=Object(s.useReducer)(K,z),j=Object(i.a)(l,2),b=j[0],O=j[1],h=Object(s.useRef)(),f=Object(s.useState)(new Date),g=Object(i.a)(f,2),x=g[0],w=g[1],E=Object(s.useState)({}),N=Object(i.a)(E,2),T=N[0],D=N[1],C=Object(s.useState)(!1),R=Object(i.a)(C,2),S=R[0],P=R[1],k=Object(s.useState)(!1),M=Object(i.a)(k,2),A=M[0],L=M[1],F=d.post,G=d.editMode;Object(s.useEffect)((function(){return F.post_date&&"undefined"!==F.post_date&&w(new Date(F.post_date)),function(){w(new Date)}}),[F.post_date]),Object(s.useEffect)((function(){var e=[];!0===F.unscheduled?e.push("publish","future","pending"):Object(ve.a)(x)?e.push("publish"):Object(V.a)(x)&&e.push("future");var t=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=m;if(e.length>0)for(var a in m)e.includes(a)&&(t=Object(p.omit)(t,a));return t}(e);D(t)}),[x,F.unscheduled]),Object(s.useEffect)((function(){P(!(!t.post_date||!Object(J.a)(t.post_date)&&!Object(V.a)(t.post_date)||"publish"!==t.post_status))}),[t.post_date,t.post_status]),Object(s.useEffect)((function(){if(!0===b.updateNow&&"undefined"!==t.id){O({type:"UPDATING"});var e="".concat(v,"/");!0===b.trash?e+="trash/".concat(t.id):0===t.id?e+="new":e+="update/".concat(t.id);var c={params:y(b.params,t),unscheduled:b.unscheduled};if(Object(p.isEmpty)(c.params))return{data:"Update not necessary.",error:!0};(function(){var t=Object(q.a)(Y.a.mark((function t(){var s;return Y.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(c)});case 3:return s=t.sent,t.next=6,s.json();case 6:n({type:"END"}),O({type:"COMPLETE"}),a({type:"SET_CURRENTPOST",post:F,unscheduled:F.unscheduled}),a({type:"REFETCH"}),t.next=15;break;case 12:t.prev=12,t.t0=t.catch(0),console.log(t.t0.message);case 15:case"end":return t.stop()}}),t,null,[[0,12]])})));return function(){return t.apply(this,arguments)}})()()}}),[t,F,n,a,b.trash,b.params,b.updateNow,b.unscheduled]),Object(s.useEffect)((function(){(t.id>0||0===t.id)&&u({type:"SET",post:t})}),[t.id,t]);var H=Object(s.useCallback)((function(){u({type:"CLEAR"}),a({type:"UNSET_CURRENTPOST"})}),[u,a]);Object(s.useEffect)((function(){if(!1!==G){var e=function(e){h.current&&h.current.contains(e.target)||H()};return Object(p.isEmpty)(t)?document.removeEventListener("mousedown",e):document.addEventListener("mousedown",e),function(){document.removeEventListener("mousedown",e)}}}),[G,t,a,H]);var I,W=function(e){u({type:"EDIT",field:e.target.name,value:e.target.value})};return G?Object(c.jsx)("div",{className:"editPost",children:Object(c.jsx)("div",{className:"editPost__container",children:Object(c.jsxs)("div",{ref:h,className:"editPost__editor",children:[Object(c.jsx)("button",{className:"close icon",onClick:H,children:"highlight_off"}),Object(c.jsxs)("h3",{className:"title",children:[0===F.id?"New":"Edit"," Post"]}),Object(c.jsxs)("form",{className:"editPost__editor__form",onSubmit:function(e){e.preventDefault(),O({type:"UPDATE",params:{post_title:F.post_title,post_date:Object(B.default)(new Date(F.post_date),_),post_status:F.post_status,post_excerpt:F.post_excerpt},unscheduled:F.unscheduled}),u({type:"CLEAR"})},children:[Object(c.jsx)(fe,{name:"post_title",label:"Title",children:Object(c.jsx)("input",{name:"post_title",value:Object(ee.decode)(F.post_title,{scope:"strict"}),onChange:W})}),Object(c.jsxs)(fe,{name:"date",children:[Object(c.jsxs)("div",{className:"fieldGroup__field post_date ".concat(!0===F.unscheduled?"inactive":"active"),children:[Object(c.jsx)("label",{htmlFor:"post_date",children:"Post Date"}),Object(c.jsx)(U.a,{closeOnScroll:function(e){return e.target===document},selected:x,onChange:function(e){null===e&&(e=new Date),u({type:"EDIT",field:"post_date",value:e})},disabled:S})]}),Object(c.jsxs)("div",{className:"fieldGroup__field unscheduled",children:[Object(c.jsx)("input",{type:"checkbox",name:"unscheduled",checked:F.unscheduled,onChange:function(e){u({type:"EDIT",field:e.target.name,value:!F[e.target.name]})}}),Object(c.jsx)("label",{htmlFor:"unscheduled",children:"Unscheduled"})]})]}),Object(c.jsx)(fe,{name:"post_status",label:"Status",children:Object(c.jsx)("select",{name:"post_status",onChange:W,value:F.post_status,children:(I=T,Object.keys(I).map((function(e){return Object(c.jsx)("option",{value:e,children:I[e].name},e)})))})}),Object(c.jsx)(fe,{name:"taxonomies",label:"Categories & Tags",children:Object(c.jsx)("p",{children:"Coming soon"})}),Object(c.jsx)(fe,{name:"post_excerpt",label:"Excerpt",children:Object(c.jsx)("textarea",{name:"post_excerpt",onChange:W,rows:4,value:Object(ee.decode)(F.post_excerpt,{scope:"strict"})})}),Object(c.jsx)("div",{className:"post_thumb",children:F.image?Object(c.jsxs)("div",{children:[Object(c.jsx)("span",{children:"Featured Image"}),Object(c.jsx)("a",{href:Object(ee.decode)(F.edit_link),target:"_blank",rel:"noreferrer",children:Object(c.jsx)("img",{src:F.image,alt:"".concat(F.post_title)})})]}):null}),Object(c.jsx)("div",{className:"editPost__buttons",children:!0===A?Object(c.jsxs)("div",{className:"editPost__buttons__trash confirm",children:[Object(c.jsx)("p",{style:{fontWeight:"bold"},children:"Are you sure you want to Trash this post?"}),Object(c.jsx)("input",{type:"button",onClick:function(){O({type:"TRASH",params:{id:F.id}}),u({type:"CLEAR"}),L(!1)},value:"Yes",autoFocus:!0}),Object(c.jsx)("input",{type:"button",onClick:function(){return L(!1)},value:"No"})]}):Object(c.jsxs)(c.Fragment,{children:[Object(c.jsx)("input",{type:"submit",className:"editPost__buttons__save",value:0===F.id?"Save":"Update"}),Object(c.jsx)("input",{type:"button",className:"editPost__buttons__cancel",onClick:function(){return u({type:"CLEAR"})},value:"Cancel"}),Object(c.jsx)("input",{type:"button",className:"editPost__buttons__trash",onClick:function(){return L(!0)},value:"Delete"})]})})]})]})})}):null}var xe=Object(s.forwardRef)((function(e,t){var a=e.todayRef,n=Object(s.useContext)(D).viewOptions.viewMode;return Object(c.jsxs)("main",{className:"calendario__main",children:[Object(c.jsxs)("div",{className:"view",ref:t,children:[Object(c.jsx)(k,{className:"view__options"}),"calendar"===n?Object(c.jsx)(Oe,{className:"view__calendar",todayRef:a}):Object(c.jsx)(he,{className:"view__list",todayRef:a})]}),Object(c.jsx)(_e,{})]})}));function we(){var e=Object(s.useContext)(Q),t=e.posts.unscheduled,a=e.postsDispatch;Object(s.useEffect)((function(){a({type:"REFETCH"})}),[a]);var n=function(){var e=Object(s.useContext)(Q),t=e.posts.refetch,a=e.postsDispatch,c=Object(s.useState)(!1),n=Object(i.a)(c,2),r=n[0],o=n[1];return Object(s.useEffect)((function(){var e="".concat(v,"/unscheduled");return function(){var t=Object(q.a)(Y.a.mark((function t(){var c,s;return Y.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o(!0),t.prev=1,t.next=4,fetch(e,{headers:ue});case 4:return c=t.sent,t.next=7,c.json();case 7:s=t.sent,a({type:"SET_UNSCHEDULED",posts:s.posts,unscheduled:!0}),o(!1),t.next=16;break;case 12:t.prev=12,t.t0=t.catch(1),console.log("REST error",t.t0.message),o(!1);case 16:case"end":return t.stop()}}),t,null,[[1,12]])})));return function(){return t.apply(this,arguments)}}()(),function(){o(!1)}}),[a,t]),r}();return Object(c.jsxs)(c.Fragment,{children:[Object(c.jsx)(oe,{className:"unscheduledDrafts",date:!1,posts:t,allowDrag:!0,loadingState:n}),Object(c.jsx)(ie,{unscheduled:!0})]})}function Ee(){var e=Object.keys(m),t=Object(s.useContext)(D),a=t.viewOptions.statuses,n=t.viewOptionsDispatch,r=function(e){n({type:"TOGGLE_STATUS",status:e.target.name})};return Object(c.jsx)("div",{className:"statusFilters",children:Object(c.jsx)("ul",{className:"filters",children:e.map((function(e,t){var s=m[e],n=s.color,o=s.backgroundColor,i=s.name;return Object(c.jsxs)("li",{className:"filterItem status__".concat(e),children:[Object(c.jsx)("button",{className:"dot ".concat(a[e]?"visible":"hidden"),name:e,style:!0===a[e]?{color:n,backgroundColor:o,borderColor:o}:{color:n,borderColor:o},onClick:r}),Object(c.jsx)("span",{className:"name",children:i})]},t)}))})})}function Ne(){return Object(c.jsx)("aside",{className:"calendario__sidebar",children:Object(c.jsxs)("div",{className:"calendario__sidebar__inner",children:[T("Unscheduled Drafts","unscheduledDrafts",Object(c.jsx)(we,{})),T("","statusFilters",Object(c.jsx)(Ee,{})),T("Dev Links + Info","dev",Object(c.jsxs)(c.Fragment,{children:[Object(c.jsxs)("ul",{style:{marginLeft:0,paddingLeft:"24px",listStylePosition:"outside"},children:[Object(c.jsx)("li",{children:Object(c.jsx)("a",{href:"https://github.com/gaswirth/rhdwp-calendario#readme",target:"_blank",rel:"noreferrer",children:"TODO/Readme"})}),Object(c.jsx)("li",{children:Object(c.jsx)("a",{href:"https://github.com/gaswirth/rhdwp-calendario/issues",target:"_blank",rel:"noreferrer",children:"Report an issue"})}),Object(c.jsxs)("li",{children:["GitHub:"," ",Object(c.jsx)("a",{href:"https://github.com/gaswirth/rhdwp-calendario",target:"_blank",rel:"noreferrer",children:"gaswirth/rhdwp-calendario"})]})]}),Object(c.jsx)("p",{style:{fontSize:"0.7em"},children:Object(c.jsx)("a",{href:"https://roundhouse-designs.com",target:"_blank",rel:"noreferrer",children:"Roundhouse Designs"})})]}))]})})}a(133),a(134);function ye(){var e=Object(s.useReducer)($,Z),t=Object(i.a)(e,2),a=t[0],n=t[1],r=Object(s.useReducer)(ce,se),o=Object(i.a)(r,2),d=o[0],u=o[1],l=Object(s.useReducer)(C,P),j=Object(i.a)(l,2),b=j[0],O=j[1],p=function(e,t){var a=Object(s.useState)((function(){var a=window.localStorage.getItem(t);return null!==a?JSON.parse(a):e})),c=Object(i.a)(a,2),n=c[0],r=c[1];return Object(s.useEffect)((function(){window.localStorage.setItem(t,JSON.stringify(n))}),[t,n]),[n,r]}({viewMode:"calendar"},"viewOptions"),h=Object(i.a)(p,2),f=h[0],v=h[1],m=Object(s.useRef)(),g=Object(s.useRef)();return Object(s.useEffect)((function(){O({type:"UPDATE",viewMode:f.viewMode})}),[]),Object(s.useEffect)((function(){v({viewMode:b.viewMode})}),[v,b.viewMode]),Object(c.jsx)("div",{className:"calendario",children:Object(c.jsx)(D.Provider,{value:{viewOptions:b,viewOptionsDispatch:O},children:Object(c.jsxs)(Q.Provider,{value:{posts:a,postsDispatch:n},children:[Object(c.jsx)(I,{handleTodayClick:function(){var e,t,a,c=new Date;e=c,t=b.viewRange.start,a=b.viewRange.end,e.getTime()>=t.getTime()&&e.getTime()<=a.getTime()?g.current.scrollTop=m.current.offsetTop:O({type:"SET_RANGE_START",date:c})}}),Object(c.jsxs)(ae.Provider,{value:{draggedPost:d,draggedPostDispatch:u},children:[Object(c.jsx)(xe,{ref:g,todayRef:m}),Object(c.jsx)(Ne,{})]})]})})})}var Te,De=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,145)).then((function(t){var a=t.getCLS,c=t.getFID,s=t.getFCP,n=t.getLCP,r=t.getTTFB;a(e),c(e),s(e),n(e),r(e)}))},Ce=(window.rhdReactPlugin||{}).appSelector;(Te=document.querySelector(Ce))&&o.a.render(Object(c.jsx)(n.a.StrictMode,{children:Object(c.jsx)(ye,{})}),Te),De()},67:function(e,t,a){}},[[135,1,2]]]);
//# sourceMappingURL=main.ca318ed4.chunk.js.map