(this["webpackJsonpreact-app"]=this["webpackJsonpreact-app"]||[]).push([[0],{169:function(e,t,a){},171:function(e,t,a){"use strict";a.r(t);var n=a(0),c=a(1),s=a.n(c),r=a(21),o=a.n(r),i=(a(78),a(10)),d=a(14),u=a(3),l=a(173),j=a(174),b=a(69),O=a(175),p=a(12);function h(e){var t=e.title,a=e.className,c=e.children;return Object(n.jsxs)("div",{className:"widget ".concat(a),children:[t?Object(n.jsx)("h3",{className:"widgetTitle",children:t}):null,c]})}var f=Object(u.a)({},window.rhdReactPlugin),v="d",m="yyyy-MM-dd",x="yyyy-MM-dd h:mm aa",_="EEEE",g="MMM",y="EEEE,  MMMM dd, yyyy",E="MMMM dd, yyyy";function N(e,t){if(e.length>0){var a=function(a){Array.isArray(e[a])?e[a].length===t[a].length&&e[a].every((function(e,n){return e===t[a][n]})):e[a]===t[a]&&(e=Object(p.omit)(e,a))};for(var n in e)a(n)}return e}var w=function(e,t,a){return Object(n.jsx)(h,{title:e,className:"widget__".concat(t),children:a})},T=f.postStatuses,D=Object(c.createContext)({}),C={viewMode:"",viewRange:{start:null,end:null},statuses:function(){var e={};for(var t in T)e[t]=!0;return e}()};function R(e,t){switch(t.type){case"UPDATE":return Object(u.a)(Object(u.a)({},e),{},{viewMode:t.viewMode?t.viewMode:e.viewMode,viewRange:t.viewRange?t.viewRange:e.viewRange});case"SET_RANGE":var a="list"!==e.viewMode?{start:Object(l.a)(t.start),end:Object(j.a)(t.end)}:{start:t.start,end:t.end};return Object(u.a)(Object(u.a)({},e),{},{viewRange:{start:a.start,end:a.end}});case"SET_RANGE_START":return Object(u.a)(Object(u.a)({},e),{},{viewRange:Object(u.a)(Object(u.a)({},e.viewRange),{},{start:"list"!==e.viewMode?Object(l.a)(t.date):t.date})});case"SET_RANGE_END":return Object(u.a)(Object(u.a)({},e),{},{viewRange:Object(u.a)(Object(u.a)({},e.viewRange),{},{end:"list"!==e.viewMode?Object(j.a)(t.date):t.date})});case"NEXT_MONTH":return Object(u.a)(Object(u.a)({},e),{},{viewRange:{start:Object(b.a)(e.viewRange.start,1),end:Object(b.a)(e.viewRange.end,1)}});case"PREV_MONTH":return Object(u.a)(Object(u.a)({},e),{},{viewRange:{start:Object(O.a)(e.viewRange.start,1),end:Object(O.a)(e.viewRange.end,1)}});case"TOGGLE_STATUS":return Object(u.a)(Object(u.a)({},e),{},{statuses:Object(u.a)(Object(u.a)({},e.statuses),{},Object(d.a)({},t.status,!e.statuses[t.status]))});default:return e}}function S(){var e=Object(c.useContext)(D),t=e.viewOptions.viewMode,a=e.viewOptionsDispatch,s=function(e){a({type:"UPDATE",viewMode:e.target.value})};return Object(n.jsx)("div",{className:"viewOptions",children:Object(n.jsxs)("div",{className:"viewMode",children:[Object(n.jsx)("button",{onClick:s,className:"icon ".concat("calendar"===t?"active ":"inactive"),value:"calendar",title:"Calendar",children:"calendar_view_month"}),Object(n.jsx)("button",{name:"viewMode",onClick:s,className:"icon ".concat("list"===t?"active ":"inactive"),value:"list",title:"List",children:"view_list"})]})})}var P=a(24),k=a.n(P),M=a(176),U=a(177),A=a(178),L=a(179);function F(e){var t=e.handleTodayClick,a=Object(c.useContext)(D),s=a.viewOptions.viewRange,r=a.viewMode,o=a.viewOptionsDispatch,i=Object(M.a)(),d=Object(c.forwardRef)((function(e,t){var a=e.value,c=e.onClick;return Object(n.jsx)("button",{className:"viewRange__input",onClick:c,ref:t,children:a})}));Object(c.useEffect)((function(){s.start||s.end||o({type:"SET_RANGE",start:"calendar"===r?Object(U.a)(i):i,end:"calendar"===r?Object(A.a)():Object(L.a)(i,30)})}),[i,s.start,s.end,r,o]);return Object(n.jsxs)("div",{className:"calendarListHeader row flex-middle",children:[Object(n.jsx)("div",{className:"col col__start",children:Object(n.jsx)("button",{className:"icon dateChevron",onClick:function(e){e.preventDefault(),o({type:"PREV_MONTH"})},title:"Previous Month",children:"chevron_left"})}),Object(n.jsxs)("div",{className:"col col__center mainViewOptions",children:[Object(n.jsx)("div",{className:"toToday",children:Object(n.jsx)("button",{className:"icon today",onClick:t,title:"Jump to Today",children:"today"})}),Object(n.jsxs)("div",{className:"viewRange",children:[Object(n.jsx)(k.a,{dateFormat:E,selected:s.start,onChange:function(e){return o({type:"SET_RANGE_START",date:e})},customInput:Object(n.jsx)(d,{}),selectsStart:!0,startDate:s.start,endDate:s.end,closeOnScroll:function(e){return e.target===document}})," to ",Object(n.jsx)(k.a,{dateFormat:E,selected:s.end,onChange:function(e){return o({type:"SET_RANGE_END",date:e})},customInput:Object(n.jsx)(d,{}),selectsEnd:!0,startDate:s.start,endDate:s.end,minDate:s.start,monthsShown:2,closeOnScroll:function(e){return e.target===document}})]}),Object(n.jsx)(S,{})]}),Object(n.jsx)("div",{className:"col col__end",children:Object(n.jsx)("button",{className:"icon dateChevron",onClick:function(e){e.preventDefault(),o({type:"NEXT_MONTH"})},title:"Next Month",children:"chevron_right"})})]})}function G(e){var t=e.handleTodayClick;return Object(n.jsx)("header",{className:"calendario__header",children:Object(n.jsxs)("div",{className:"calendario__header__content",children:[Object(n.jsx)("div",{className:"left",children:Object(n.jsx)(F,{handleTodayClick:t})}),Object(n.jsx)("div",{className:"right",children:Object(n.jsx)("h1",{className:"calendario__title",children:"the editorial calendorial"})})]})})}var I=a(180),H=a(181),V=a(189),B=Object(c.forwardRef)((function(e,t){var a=e.day,c=e.monthName,s=e.children,r=["day","col","cell"];return Object(I.a)(a)&&r.push("today"),Object(H.a)(a)&&!Object(I.a)(a)&&r.push("past"),Object(n.jsxs)("div",{className:r.join(" "),ref:Object(I.a)(a)?t:null,children:[c?Object(n.jsx)("span",{className:"month",children:c}):"",Object(n.jsx)("span",{className:"number",children:Object(V.a)(a,v)}),s]})})),J=a(13),X=a.n(J),Y=a(15),W={updateNow:!1,trash:!1,params:{},unscheduled:!1};function q(e,t){switch(t.type){case"UPDATE":return{updateNow:!0,params:t.params,unscheduled:t.unscheduled};case"UPDATING":return Object(u.a)(Object(u.a)({},e),{},{updateNow:!1});case"TRASH":return{trash:!0,updateNow:!0,params:t.params};case"COMPLETE":return W;default:return e}}var z=Object(c.createContext)({}),K={currentPost:{id:null,post_title:"",post_status:"",post_date:"",unscheduled:null},refetch:!1,dateRange:{start:"",end:""},unscheduled:[],scheduled:[],trashed:[],taxonomies:{},locale:""};function Q(e,t){switch(t.type){case"SET_SCHEDULED":var a=t.posts;return a.forEach((function(e,t){a[t].post_date=new Date(e.post_date)})),Object(u.a)(Object(u.a)({},e),{},{dateRange:{start:t.start,end:t.end},scheduled:a});case"SET_UNSCHEDULED":var n=t.posts;return n.forEach((function(e,t){n[t].post_date=new Date(e.post_date)})),Object(u.a)(Object(u.a)({},e),{},{unscheduled:n});case"SET_TAXONOMY_TERMS":return Object(u.a)(Object(u.a)({},e),{},{taxonomies:Object(u.a)(Object(u.a)({},e.taxonomies),{},Object(d.a)({},t.name,{taxonomy:t.taxonomy,terms:t.terms}))});case"SET_CURRENTPOST":return Object(u.a)(Object(u.a)({},e),{},{currentPost:Object(u.a)(Object(u.a)({},t.post),{},{unscheduled:t.unscheduled})});case"REFETCH":return Object(u.a)(Object(u.a)({},e),{},{refetch:!e.refetch});case"NEW_POST":return Object(u.a)(Object(u.a)({},e),{},{currentPost:{id:0,post_date:t.post_date,unscheduled:t.unscheduled,taxonomies:{}}});case"UPDATE_CURRENTPOST_FIELD":return Object(u.a)(Object(u.a)({},e),{},{currentPost:Object(u.a)(Object(u.a)({},e.currentPost),{},Object(d.a)({},t.field,t.value))});case"UNSET_CURRENTPOST":return Object(u.a)(Object(u.a)({},e),{},{currentPost:K.currentPost});default:return e}}var Z=a(16);function $(e){var t=e.post,a=e.className,s=e.unscheduled,r=f.routeBase,o=t.id,d=t.edit_link,u=t.view_link,l=Object(c.useContext)(z).postsDispatch,j=Object(c.useReducer)(q,W),b=Object(i.a)(j,2),O=b[0],p=b[1];Object(c.useEffect)((function(){if(!0===O.updateNow&&"undefined"!==o){p({type:"UPDATING"});var e="".concat(r,"/");!0===O.trash?e+="trash/".concat(o):e+="update/".concat(o);var t={unscheduled:O.unscheduled};(function(){var a=Object(Y.a)(X.a.mark((function a(){var n;return X.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,fetch(e,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});case 3:return n=a.sent,a.next=6,n.json();case 6:p({type:"COMPLETE"}),l({type:"REFETCH"}),a.next=13;break;case 10:a.prev=10,a.t0=a.catch(0),console.log(a.t0.message);case 13:case"end":return a.stop()}}),a,null,[[0,10]])})));return function(){return a.apply(this,arguments)}})()()}}),[o,r,l,O.trash,O.params,O.updateNow,O.unscheduled]);return Object(n.jsxs)("div",{className:"postLinks ".concat(a),children:[Object(n.jsx)("button",{className:"icon top left icon__view",onClick:function(){return window.open(u,"_blank")},target:"_blank",rel:"noreferrer",title:"View Post",children:"open_in_new"}),Object(n.jsx)("button",{className:"icon top right icon__edit",onClick:function(){return window.open(Object(Z.decode)(d),"_blank")},target:"_blank",rel:"noreferrer",title:"Edit Post in a new tab",children:"mode_edit"}),s?Object(n.jsx)("button",{className:"icon icon__schedule bottom right",onClick:function(e){e.preventDefault(),p({type:"UPDATE",params:{},unscheduled:!1})},title:"Schedule this post",children:"event_available"}):Object(n.jsx)("button",{className:"icon icon__unschedule bottom right",onClick:function(e){e.preventDefault(),p({type:"UPDATE",params:{},unscheduled:!0})},title:"Unschedule this post",children:"drafts"}),Object(n.jsx)("button",{className:"icon icon__trash bottom left",onClick:function(){p({type:"TRASH",params:{id:o}})},title:"Trash this post",children:"delete_forever"})]})}var ee=Object(c.createContext)(null);function te(e,t){switch(t.type){case"START":return{post:t.post,isDragging:!0,draggedFrom:t.draggedFrom>=0&&t.draggedFrom};case"DRAGGING_OVER_UNSCHEDULED":return Object(u.a)(Object(u.a)({},e),{},{draggedTo:t.draggedOver,overUnscheduled:!0});case"DRAGGING_OVER_SCHEDULED":return Object(u.a)(Object(u.a)({},e),{},{draggedTo:null,overUnscheduled:!1});case"END":return ae;default:return e}}var ae={post:{},isDragging:!1,draggedFrom:null,draggedTo:null,overUnscheduled:!1},ne={color:"",backgroundColor:""};function ce(e){var t=e.post,a=e.index,s=e.unscheduled,r=e.allowDrag,o=f.postStatuses,d=Object(c.useContext)(z),u=d.posts.currentPost,l=d.postsDispatch,j=Object(c.useContext)(ee),b=j.draggedPost,O=b.isDragging,h=b.draggedFrom,v=b.draggedTo,m=j.draggedPostDispatch,x=Object(c.useContext)(D).viewOptions.statuses,_=Object(c.useState)(new Date),g=Object(i.a)(_,2),y=g[0],E=g[1],N=Object(c.useState)(ne),w=Object(i.a)(N,2),T=w[0],C=w[1],R=T.color,S=T.backgroundColor;Object(c.useEffect)((function(){return E(new Date(t.post_date)),function(){E(new Date)}}),[t.post_date]),Object(c.useEffect)((function(){return C({color:o[t.post_status].color,backgroundColor:o[t.post_status].backgroundColor}),function(){C(ne)}}),[t.post_status,o]);var P=function(e){var a=!!e.currentTarget.parentNode.classList.contains("unscheduledDrafts");m({type:"START",post:t,draggedFrom:!!a&&Number(e.currentTarget.dataset.index)})},k=function(){return m({type:"END"})},M=function(e){e.target.classList.contains("icon")||l({type:"SET_CURRENTPOST",post:t,unscheduled:s})};return t?function(){var e=["post","post-id-".concat(t.id," status__").concat(t.post_status)];return O&&(v===Number(a)&&(e.push("dropArea"),!1===h?e.push("fromNowhere"):h<v?e.push("fromAbove"):h>v&&e.push("fromBelow")),h===Number(a)&&e.push("dragging")),Object(p.isEmpty)(u)||u.id!==t.id||e.push("currentPost"),Object(n.jsxs)("li",{id:t.id,className:e.join(" "),style:!1===s&&!0===x[t.post_status]||!0===s?{visibility:"visible"}:{visibility:"hidden"},"data-index":a,draggable:!0===r||!Object(I.a)(y)&&!Object(H.a)(y),onDragStart:P,onDragEnd:k,onClick:M,children:[Object(n.jsx)($,{className:O?"disabled":"active",post:t,unscheduled:s}),Object(n.jsx)("p",{className:"postData",style:{backgroundColor:S,color:R},children:Object(Z.decode)(t.post_title,{scope:"strict"})})]})}():null}function se(e){var t=e.className;return Object(n.jsx)("div",{className:"loadingOverlay ".concat(t),children:Object(n.jsxs)("div",{className:"roller",children:[Object(n.jsx)("div",{}),Object(n.jsx)("div",{}),Object(n.jsx)("div",{}),Object(n.jsx)("div",{}),Object(n.jsx)("div",{}),Object(n.jsx)("div",{}),Object(n.jsx)("div",{}),Object(n.jsx)("div",{})]})})}var re=a(182),oe=a(183),ie=a(184),de=a(185);function ue(e){var t=e.posts,a=e.className,s=e.allowDrag,r=e.allowDrop,o=e.date,d=e.loadingState,l=f.routeBase,j=f.nonce,b=Object(c.useContext)(z),O=b.posts.currentPost,h=b.postsDispatch,v=Object(c.useContext)(ee),m=v.draggedPost,_=m.post,g=m.draggedTo,y=m.draggedFrom,E=m.overUnscheduled,w=v.draggedPostDispatch,T=Object(c.useReducer)(q,W),D=Object(i.a)(T,2),C=D[0],R=D[1],S=Object(c.useState)(!1),P=Object(i.a)(S,2),k=P[0],M=P[1];Object(c.useEffect)((function(){if(void 0!==d&&null!==d)return M(d),function(){M(!1)}}),[d]),Object(c.useEffect)((function(){if(!0===C.updateNow&&"undefined"!==_.id){R({type:"UPDATING"});var e="".concat(l,"/update/").concat(_.id),t={params:N(C.params,_),unscheduled:C.unscheduled};if(null!==g&&(t.draggedTo=g),Object(p.isEmpty)(t))return{data:"Update not necessary.",error:!0};var a={"Content-Type":"application/json"};a["X-WP-Nonce"]=j,function(){var n=Object(Y.a)(X.a.mark((function n(){var c;return X.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return M(!0),n.prev=1,n.next=4,fetch(e,{method:"POST",headers:a,body:JSON.stringify(t)});case 4:return c=n.sent,n.next=7,c.json();case 7:h({type:"REFETCH"}),w({type:"END"}),R({type:"COMPLETE"}),M(!1),n.next=17;break;case 13:n.prev=13,n.t0=n.catch(1),console.log(n.t0.message),M(!1);case 17:case"end":return n.stop()}}),n,null,[[1,13]])})));return function(){return n.apply(this,arguments)}}()()}}),[l,j,C,g,w,_,h]);var U=function(e){if(e.preventDefault(),!1!==s)if(e.currentTarget.classList.contains("unscheduledDrafts")){var t=Number(e.target.dataset.index),a=!1;if(y===t)return;if((a=!Number.isNaN(t)&&t)!==g){if(!1===a){var n=e.currentTarget.getBoundingClientRect(),c=e.clientY-n.top,r=e.currentTarget.childNodes,o=r.length;a=0===r.length||c<r[0].offsetTop?0:c>=r[o-1].offsetTop?o:o-1}w({type:"DRAGGING_OVER_UNSCHEDULED",draggedOver:a})}}else!0===E&&w({type:"DRAGGING_OVER_SCHEDULED"})},A=function(){var e,t,a;!1!==r&&(!1===o?a=Object(V.a)(_.post_date,x):(e=o,t={h:Object(re.a)(_.post_date),m:Object(oe.a)(_.post_date)},e=Object(ie.a)(e,t.h),e=Object(de.a)(e,t.m),a=Object(V.a)(e,x)),R({type:"UPDATE",params:{post_date:a},unscheduled:E}),O.id===_.id&&h({type:"UPDATE_CURRENTPOST_FIELD",field:"post_date",value:o}))};return function(){var e={className:"postList ".concat(a),onDragOver:U};return!1!==r?e.onDrop=A:e.className+=" dropDisabled",Object(n.jsxs)(n.Fragment,{children:[Object(n.jsx)(se,{className:k?"active":null}),Object(n.jsx)("ul",Object(u.a)(Object(u.a)({},e),{},{children:t.map((function(e,t){return Object(n.jsx)(ce,{post:e,index:t,unscheduled:!1===o,allowDrag:s},e.id)}))}))]})}()}function le(e){var t=e.day,a=e.unscheduled,s=Object(c.useContext)(z).postsDispatch;return Object(n.jsx)("button",{className:"icon newPost",onClick:function(e){e.preventDefault(),s({type:"NEW_POST",post_date:t||new Date,unscheduled:a||!1})},children:"add_circle"})}var je=a(72),be=f.routeBase,Oe={"X-WP-Nonce":f.nonce},pe=function(e,t){var a=Object(c.useContext)(z),n=a.posts.refetch,s=a.postsDispatch,r=Object(c.useState)(!1),o=Object(i.a)(r,2),d=o[0],u=o[1];return Object(c.useEffect)((function(){if(null!==e&&null!==t){var a=Object(V.a)(e,m),n=Object(V.a)(t,m),c="".concat(be,"/scheduled/").concat(a,"/").concat(n);return function(){var e=Object(Y.a)(X.a.mark((function e(){var t,a;return X.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return u(!0),e.prev=1,e.next=4,fetch(c,{headers:Oe});case 4:return t=e.sent,e.next=7,t.json();case 7:a=e.sent,s({type:"SET_SCHEDULED",posts:a.posts,start:a.dateRange.start,end:a.dateRange.end}),u(!1),e.next=16;break;case 12:e.prev=12,e.t0=e.catch(1),console.log("REST error",e.t0.message),u(!1);case 16:case"end":return e.stop()}}),e,null,[[1,12]])})));return function(){return e.apply(this,arguments)}}()(),function(){u(!1)}}}),[e,t,n,s]),d},he=function(e){var t=Object(c.useContext)(z),a=t.posts.taxonomies,n=t.postsDispatch,s=Object(c.useState)(!1),r=Object(i.a)(s,2),o=r[0],d=r[1];return Object(c.useEffect)((function(){if(Object(p.isEmpty)(a[e])){var t="".concat(be,"/tax/").concat(e);return function(){var a=Object(Y.a)(X.a.mark((function a(){var c,s;return X.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return d(!0),a.prev=1,a.next=4,fetch(t,{headers:Oe});case 4:return c=a.sent,a.next=7,c.json();case 7:s=a.sent,n({type:"SET_TAXONOMY_TERMS",name:e,taxonomy:s.taxonomy,terms:s.terms}),d(!1),a.next=16;break;case 12:a.prev=12,a.t0=a.catch(1),console.log("REST error",a.t0.message),d(!1);case 16:case"end":return a.stop()}}),a,null,[[1,12]])})));return function(){return a.apply(this,arguments)}}()(),function(){d(!1)}}}),[e,a,n]),o};function fe(e){var t=e.posts,a=e.date,c=e.allowDrag,s=e.allowDrop,r=e.title,o=e.loadingState,i=function(e,t){var a=[];return e&&e.forEach((function(e){Object(je.a)(t,new Date(e.post_date))&&a.push(e)})),a}(t,a);return function(){var e={className:"dayPosts",date:a,posts:i,allowDrop:!0,loadingState:o};"undefined"!==c&&null!==c&&(e.allowDrag=c),e.allowDrop=!1!==s;var t=Object(n.jsxs)(n.Fragment,{children:[Object(n.jsx)(le,{day:a,unscheduled:!1}),Object(n.jsx)(ue,Object(u.a)({},e))]});return r?Object(n.jsxs)(n.Fragment,{children:[Object(n.jsx)("h4",{className:"title",children:r}),t]}):t}()}var ve=a(186);function me(e){var t=e.className,a=e.todayRef,s=Object(c.useContext)(z),r=s.posts.scheduled,o=s.postsDispatch,i=Object(c.useContext)(D).viewOptions.viewRange;Object(c.useEffect)((function(){o({type:"REFETCH"})}),[o]),pe(i.start,i.end);var d=Object(c.useCallback)((function(){for(var e=[],t=Object(l.a)(i.start),a=0;a<7;a++)e.push(Object(n.jsx)("div",{className:"col col__center",children:Object(V.a)(Object(L.a)(t,a),_)},a));return Object(n.jsx)("div",{className:"days row",children:e})}),[i.start]),u=Object(c.useCallback)((function(){for(var e=[],t=[],c=i.start,s=!0;c<=i.end;){for(var o=0;o<7;o++){var d=Object(ve.a)(c)||s;t.push(Object(n.jsx)(B,{ref:Object(I.a)(c)?a:null,day:c,monthName:d?Object(V.a)(c,g):"",children:Object(n.jsx)(fe,{date:c,posts:r,allowDrag:!0,renderEmpty:!0})},c)),s=!1,c=Object(L.a)(c,1)}e.push(Object(n.jsx)("div",{className:"row",children:t},c)),t=[]}return Object(n.jsx)("div",{className:"body",children:e})}),[i.end,i.start,r,a]);return Object(n.jsx)("div",{className:t,children:null!==i.start&&null!==i.end?Object(n.jsxs)("div",{className:"view__calendar__inner",children:[d(),u()]}):null})}var xe=a(187);function _e(e){var t=e.className,a=Object(c.useContext)(z),s=a.posts.scheduled,r=a.postsDispatch,o=Object(c.useContext)(D).viewOptions.viewRange,i=o.start,d=o.end;Object(c.useEffect)((function(){r({type:"REFETCH"})}),[r]),pe(i,d);var u=function(){var e=[],t=i,a=["listDay"];if("undefined"!==d&&null!==d)for(;Object(xe.a)(t)<=Object(xe.a)(d);)Object(I.a)(t)&&a.push("today"),Object(H.a)(t)&&!Object(I.a)(t)&&a.push("past"),e.push(Object(n.jsx)("li",{className:a.join(" "),children:Object(n.jsx)(fe,{date:t,posts:s,allowDrag:!0,title:Object(V.a)(t,y),newPostButton:!0})},t)),t=Object(L.a)(t,1);return e};return Object(n.jsx)("div",{className:t,children:null!==i&&null!==d?Object(n.jsx)(n.Fragment,{children:Object(n.jsx)("div",{className:"view__list__days",children:Object(n.jsx)("ul",{children:u()})})}):null})}var ge=a(30);function ye(e){var t=e.name,a=e.label,c=e.inlineLabel,s=e.children;return Object(n.jsxs)("div",{className:"fieldGroup fieldGroup__".concat(t," ").concat(c?"inlineLabel":""),children:[a?Object(n.jsx)("label",{htmlFor:t,children:a}):null,s]})}var Ee=a(188),Ne={post:{},editMode:!1};function we(e,t){switch(t.type){case"SET":return{post:t.post,editMode:!0};case"EDIT":var a=t.field,n=t.value;return"post_date"===a&&(n=new Date(n)),Object(u.a)(Object(u.a)({},e),{},{post:Object(u.a)(Object(u.a)({},e.post),{},Object(d.a)({},a,n))});case"TOGGLE_TAXONOMY":var c=parseInt(t.term_id),s=!!e.post.taxonomies.hasOwnProperty(t.taxonomy)&&e.post.taxonomies[t.taxonomy].indexOf(c),r=-1===s?[].concat(Object(ge.a)(e.post.taxonomies[t.taxonomy]),[c]):!1===s?[c]:[].concat(Object(ge.a)(e.post.taxonomies[t.taxonomy].slice(0,s)),Object(ge.a)(e.post.taxonomies[t.taxonomy].slice(s+1)));return Object(u.a)(Object(u.a)({},e),{},{post:Object(u.a)(Object(u.a)({},e.post),{},{taxonomies:Object(u.a)(Object(u.a)({},e.post.taxonomies),{},Object(d.a)({},t.taxonomy,r))})});case"CLEAR":return Ne;default:return{state:e}}}function Te(){var e=f.routeBase,t=Object(c.useContext)(z),a=t.posts,s=a.currentPost,r=a.taxonomies,o=t.postsDispatch,d=Object(c.useContext)(ee).draggedPostDispatch,u=Object(c.useReducer)(we,Ne),l=Object(i.a)(u,2),j=l[0],b=l[1],O=Object(c.useReducer)(q,W),h=Object(i.a)(O,2),v=h[0],m=h[1],_=Object(c.useRef)(),g=Object(c.useState)(new Date),y=Object(i.a)(g,2),E=y[0],w=y[1],T=Object(c.useState)({}),D=Object(i.a)(T,2),C=D[0],R=D[1],S=Object(c.useState)(!1),P=Object(i.a)(S,2),M=P[0],U=P[1],A=Object(c.useState)(!1),L=Object(i.a)(A,2),F=L[0],G=L[1],B=j.post,J=j.editMode;Object(c.useEffect)((function(){return B.post_date&&"undefined"!==B.post_date&&w(new Date(B.post_date)),function(){w(new Date)}}),[B.post_date]),Object(c.useEffect)((function(){var e=[];!0===B.unscheduled?e.push("publish","future","pending"):Object(Ee.a)(E)?e.push("publish"):Object(H.a)(E)&&e.push("future");var t=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=f.postStatuses;if(e.length>0)for(var a in f.postStatuses)e.includes(a)&&(t=Object(p.omit)(t,a));return t}(e);return R(t),function(){R({})}}),[E,B.unscheduled]),Object(c.useEffect)((function(){return U(!(!s.post_date||!Object(I.a)(s.post_date)&&!Object(H.a)(s.post_date)||"publish"!==s.post_status)),function(){U(!1)}}),[s.post_date,s.post_status]),Object(c.useEffect)((function(){if(!0===v.updateNow&&"undefined"!==s.id){m({type:"UPDATING"});var t="".concat(e,"/");!0===v.trash?t+="trash/".concat(s.id):0===s.id?t+="new":t+="update/".concat(s.id);var a={params:N(v.params,s),unscheduled:v.unscheduled};if(Object(p.isEmpty)(a.params))return{data:"Update not necessary.",error:!0};(function(){var e=Object(Y.a)(X.a.mark((function e(){var n;return X.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});case 3:return n=e.sent,e.next=6,n.json();case 6:d({type:"END"}),m({type:"COMPLETE"}),o({type:"SET_CURRENTPOST",post:B,unscheduled:B.unscheduled}),o({type:"REFETCH"}),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(0),console.log(e.t0.message);case 15:case"end":return e.stop()}}),e,null,[[0,12]])})));return function(){return e.apply(this,arguments)}})()()}}),[s,e,B,d,o,v.trash,v.params,v.updateNow,v.unscheduled]),Object(c.useEffect)((function(){return(s.id>0||0===s.id)&&b({type:"SET",post:s}),function(){b({type:"CLEAR"})}}),[s.id,s]);var K=Object(c.useCallback)((function(){b({type:"CLEAR"}),o({type:"UNSET_CURRENTPOST"})}),[b,o]);Object(c.useEffect)((function(){if(!1!==J){var e=function(e){_.current&&_.current.contains(e.target)||K()};return Object(p.isEmpty)(s)?document.removeEventListener("mousedown",e):document.addEventListener("mousedown",e),function(){document.removeEventListener("mousedown",e)}}}),[J,s,o,K]);var Q,$=function(e){b({type:"EDIT",field:e.target.name,value:e.target.value})},te=function(e){b({type:"TOGGLE_TAXONOMY",taxonomy:e.target.name,term_id:e.target.value})};return Object(n.jsx)("div",{className:"editPost ".concat(J?"active":"inactive"),children:Object(n.jsx)("div",{className:"editPost__container",children:J?Object(n.jsxs)("div",{ref:_,className:"editPost__editor",children:[Object(n.jsx)("button",{className:"close icon",onClick:K,children:"highlight_off"}),Object(n.jsxs)("h3",{className:"title",children:[0===B.id?"New":"Edit"," Post"]}),Object(n.jsxs)("form",{className:"editPost__editor__form",onSubmit:function(e){e.preventDefault(),m({type:"UPDATE",params:{post_title:B.post_title,post_date:Object(V.a)(new Date(B.post_date),x),post_status:B.post_status,post_excerpt:B.post_excerpt,taxonomies:B.taxonomies},unscheduled:B.unscheduled}),b({type:"CLEAR"})},children:[Object(n.jsx)(ye,{name:"post_title",label:"Title",children:Object(n.jsx)("input",{name:"post_title",value:Object(Z.decode)(B.post_title,{scope:"strict"}),onChange:$})}),Object(n.jsxs)(ye,{name:"date_status",children:[Object(n.jsxs)("div",{className:"fieldGroup__date",children:[Object(n.jsxs)("div",{className:"post_date ".concat(!0===B.unscheduled?"inactive":"active"),children:[Object(n.jsx)("label",{htmlFor:"post_date",children:"Post Date"}),Object(n.jsx)(k.a,{closeOnScroll:function(e){return e.target===document},selected:E,timeInputLabel:"Time:",showTimeInput:!0,dateFormat:x,onChange:function(e){null===e&&(e=new Date),b({type:"EDIT",field:"post_date",value:e})},disabled:M})]}),Object(n.jsxs)("div",{className:"unscheduled",children:[Object(n.jsx)("input",{type:"checkbox",name:"unscheduled",checked:B.unscheduled,onChange:function(e){b({type:"EDIT",field:e.target.name,value:!B[e.target.name]})}}),Object(n.jsx)("label",{htmlFor:"unscheduled",children:"Unscheduled"})]})]}),Object(n.jsxs)("div",{className:"fieldGroup__status",children:[Object(n.jsx)("label",{htmlFor:"post_status",children:"Post Status"}),Object(n.jsx)("select",{name:"post_status",onChange:$,value:B.post_status,children:(Q=C,Object.keys(Q).map((function(e){return Object(n.jsx)("option",{value:e,children:Q[e].name},e)})))})]})]}),Object(n.jsxs)(ye,{name:"taxonomies",children:[Object(n.jsxs)("label",{htmlFor:"category",children:["Categories",Object(n.jsx)("fieldset",{name:"category",children:r.category.terms.map((function(e,t){return Object(n.jsxs)("label",{children:[Object(n.jsx)("input",{type:"checkbox",name:"category",value:e.term_id,onChange:te,checked:!Object(p.isEmpty)(B.taxonomies)&&!Object(p.isEmpty)(B.taxonomies.category)&&B.taxonomies.category.includes(e.term_id)}),Object(Z.decode)(e.name,{scope:"strict"})]},t)}))})]}),Object(n.jsxs)("label",{htmlFor:"post_tag",children:["Tags",Object(n.jsx)("fieldset",{name:"post_tag",children:r.post_tag.terms.map((function(e,t){return Object(n.jsxs)("label",{children:[Object(n.jsx)("input",{type:"checkbox",name:"post_tag",value:e.term_id,onChange:te,checked:!Object(p.isEmpty)(B.taxonomies)&&!Object(p.isEmpty)(B.taxonomies.post_tag)&&B.taxonomies.post_tag.includes(e.term_id)}),Object(Z.decode)(e.name,{scope:"strict"})]},t)}))})]})]}),Object(n.jsx)(ye,{name:"post_excerpt",label:"Excerpt",children:Object(n.jsx)("textarea",{name:"post_excerpt",onChange:$,rows:4,value:Object(Z.decode)(B.post_excerpt,{scope:"strict"})})}),Object(n.jsx)("div",{className:"post_thumb",children:B.image?Object(n.jsxs)("div",{children:[Object(n.jsx)("span",{children:"Featured Image"}),Object(n.jsx)("a",{href:Object(Z.decode)(B.edit_link),target:"_blank",rel:"noreferrer",children:Object(n.jsx)("img",{src:B.image,alt:"".concat(B.post_title)})})]}):null}),Object(n.jsx)("div",{className:"editPost__buttons",children:!0===F?Object(n.jsxs)("div",{className:"editPost__buttons__trash confirm",children:[Object(n.jsx)("p",{style:{fontWeight:"bold"},children:"Are you sure you want to Trash this post?"}),Object(n.jsx)("input",{type:"button",onClick:function(){m({type:"TRASH",params:{id:B.id}}),b({type:"CLEAR"}),G(!1)},value:"Yes",autoFocus:!0}),Object(n.jsx)("input",{type:"button",onClick:function(){return G(!1)},value:"No"})]}):Object(n.jsxs)(n.Fragment,{children:[Object(n.jsx)("input",{type:"submit",className:"editPost__buttons__save",value:0===B.id?"Save":"Update"}),Object(n.jsx)("input",{type:"button",className:"editPost__buttons__cancel",onClick:function(){b({type:"CLEAR"}),o({type:"UNSET_CURRENTPOST"})},value:"Cancel"}),Object(n.jsx)("input",{type:"button",className:"editPost__buttons__trash",onClick:function(){return G(!0)},value:"Delete"})]})})]})]}):null})})}var De=Object(c.forwardRef)((function(e,t){var a=e.todayRef,s=Object(c.useContext)(D).viewOptions.viewMode;return he("category"),he("post_tag"),Object(n.jsxs)("main",{className:"calendario__main",children:[Object(n.jsxs)("div",{className:"view",ref:t,children:[Object(n.jsx)(S,{className:"view__options"}),"calendar"===s?Object(n.jsx)(me,{className:"view__calendar",todayRef:a}):Object(n.jsx)(_e,{className:"view__list",todayRef:a})]}),Object(n.jsx)(Te,{})]})}));function Ce(){var e=f.wpLinks,t=e.blogUrl,a=e.trashUrl,c=function(e){var t=Object(i.a)(e,3),a=t[0],c=t[1],s=t[2];return s=s||"_self",Object(n.jsx)("li",{children:Object(n.jsxs)("a",{rel:"noreferrer",href:a,target:s,children:[c," ",Object(n.jsx)("span",{className:"icon",children:"open_in_new"})]})})};return Object(n.jsxs)("ul",{className:"adminLinks",children:[c([a,"Trash","_blank"]),c([t,"View Posts","_blank"])]})}function Re(){var e=Object(c.useContext)(z),t=e.posts.unscheduled,a=e.postsDispatch;Object(c.useEffect)((function(){a({type:"REFETCH"})}),[a]);var s=function(){var e=Object(c.useContext)(z),t=e.posts.refetch,a=e.postsDispatch,n=Object(c.useState)(!1),s=Object(i.a)(n,2),r=s[0],o=s[1];return Object(c.useEffect)((function(){var e="".concat(be,"/unscheduled");return function(){var t=Object(Y.a)(X.a.mark((function t(){var n,c;return X.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o(!0),t.prev=1,t.next=4,fetch(e,{headers:Oe});case 4:return n=t.sent,t.next=7,n.json();case 7:c=t.sent,a({type:"SET_UNSCHEDULED",posts:c.posts,unscheduled:!0}),o(!1),t.next=16;break;case 12:t.prev=12,t.t0=t.catch(1),console.log("REST error",t.t0.message),o(!1);case 16:case"end":return t.stop()}}),t,null,[[1,12]])})));return function(){return t.apply(this,arguments)}}()(),function(){o(!1)}}),[a,t]),r}();return Object(n.jsxs)(n.Fragment,{children:[Object(n.jsx)(ue,{className:"unscheduledDrafts",date:!1,posts:t,allowDrag:!0,loadingState:s}),Object(n.jsx)(le,{unscheduled:!0}),Object(n.jsx)(Ce,{})]})}function Se(){var e=f.postStatuses,t=Object.keys(e),a=Object(c.useContext)(D),s=a.viewOptions.statuses,r=a.viewOptionsDispatch,o=function(e){r({type:"TOGGLE_STATUS",status:e.target.name})};return Object(n.jsx)("div",{className:"statusFilters",children:Object(n.jsx)("ul",{className:"filters",children:t.map((function(t,a){var c=e[t],r=c.color,i=c.backgroundColor,d=c.name;return Object(n.jsxs)("li",{className:"filterItem status__".concat(t),children:[Object(n.jsx)("button",{className:"dot ".concat(s[t]?"visible":"hidden"),name:t,style:!0===s[t]?{color:r,backgroundColor:i,borderColor:i}:{color:r,borderColor:i},onClick:o}),Object(n.jsx)("span",{className:"name",children:d})]},a)}))})})}function Pe(){return Object(n.jsx)("aside",{className:"calendario__sidebar",children:Object(n.jsxs)("div",{className:"calendario__sidebar__inner",children:[w("Unscheduled Drafts","unscheduledDrafts",Object(n.jsx)(Re,{})),w("Filter by Status","statusFilters",Object(n.jsx)(Se,{})),w("Development","dev",Object(n.jsxs)(n.Fragment,{children:[Object(n.jsxs)("ul",{style:{marginLeft:0,paddingLeft:"24px",listStylePosition:"outside"},children:[Object(n.jsx)("li",{children:Object(n.jsx)("a",{href:"https://github.com/gaswirth/rhdwp-calendario/issues",target:"_blank",rel:"noreferrer",children:"Report an issue"})}),Object(n.jsx)("li",{children:Object(n.jsx)("a",{href:"https://github.com/gaswirth/rhdwp-calendario#readme",target:"_blank",rel:"noreferrer",children:"Readme"})})]}),Object(n.jsx)("p",{style:{fontSize:"0.7em"},children:Object(n.jsx)("a",{href:"https://roundhouse-designs.com",target:"_blank",rel:"noreferrer",children:"Roundhouse Designs"})})]}))]})})}a(169),a(170);function ke(){var e=Object(c.useReducer)(Q,K),t=Object(i.a)(e,2),a=t[0],s=t[1],r=Object(c.useReducer)(te,ae),o=Object(i.a)(r,2),d=o[0],u=o[1],l=Object(c.useReducer)(R,C),j=Object(i.a)(l,2),b=j[0],O=j[1],p=function(e,t){var a=Object(c.useState)((function(){var a=window.localStorage.getItem(t);return null!==a?JSON.parse(a):e})),n=Object(i.a)(a,2),s=n[0],r=n[1];return Object(c.useEffect)((function(){window.localStorage.setItem(t,JSON.stringify(s))}),[t,s]),[s,r]}({viewMode:"calendar"},"viewOptions"),h=Object(i.a)(p,2),f=h[0],v=h[1],m=Object(c.useRef)(),x=Object(c.useRef)();return Object(c.useEffect)((function(){O({type:"UPDATE",viewMode:f.viewMode})}),[]),Object(c.useEffect)((function(){v({viewMode:b.viewMode})}),[v,b.viewMode]),Object(n.jsx)("div",{className:"calendario",children:Object(n.jsx)(D.Provider,{value:{viewOptions:b,viewOptionsDispatch:O},children:Object(n.jsxs)(z.Provider,{value:{posts:a,postsDispatch:s},children:[Object(n.jsx)(G,{handleTodayClick:function(){var e,t,a,n=new Date;e=n,t=b.viewRange.start,a=b.viewRange.end,e.getTime()>=t.getTime()&&e.getTime()<=a.getTime()?x.current.scroll({top:m.current.offsetTop,behavior:"smooth"}):O({type:"SET_RANGE_START",date:n})}}),Object(n.jsxs)(ee.Provider,{value:{draggedPost:d,draggedPostDispatch:u},children:[Object(n.jsx)(De,{ref:x,todayRef:m}),Object(n.jsx)(Pe,{})]})]})})})}var Me,Ue=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,190)).then((function(t){var a=t.getCLS,n=t.getFID,c=t.getFCP,s=t.getLCP,r=t.getTTFB;a(e),n(e),c(e),s(e),r(e)}))},Ae=(window.rhdReactPlugin||{}).appSelector;(Me=document.querySelector(Ae))&&o.a.render(Object(n.jsx)(s.a.StrictMode,{children:Object(n.jsx)(ke,{})}),Me),Ue()},78:function(e,t,a){}},[[171,1,2]]]);
//# sourceMappingURL=main.d2dae9ba.chunk.js.map