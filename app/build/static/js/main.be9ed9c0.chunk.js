(this["webpackJsonpreact-app"]=this["webpackJsonpreact-app"]||[]).push([[0],{175:function(e,t,n){"use strict";n.r(t);var c=n(0),a=n.n(c),s=n(18),r=n.n(s),o=(n(81),n(13)),i=n.n(o),u=n(15),d=n(8),l=n(14),j=n(2),b=n(1);function O(e){var t=e.title,n=e.className,c=e.children;return Object(b.jsxs)("div",{className:"widget ".concat(n),children:[t?Object(b.jsx)("h3",{className:"widgetTitle",children:t}):null,c]})}var p=n(11),h=n(194),f=Object(j.a)({},window.rhdReactPlugin),v="d",m="yyyy-MM-dd",x="yyyy-MM-dd h:mm aa",_="EEEE",g="MMM",E="EEEE,  MMMM dd, yyyy",y="MMMM dd, yyyy";function N(e,t){if(e.length>0){var n=function(n){Array.isArray(e[n])?e[n].length===t[n].length&&e[n].every((function(e,c){return e===t[n][c]})):e[n]===t[n]&&(e=Object(p.omit)(e,n))};for(var c in e)n(c)}return e}var w=function(e,t,n){return Object(b.jsx)(O,{title:e,className:"widget__".concat(t),children:n})},S=function(e){return Object(h.a)(e,m)},T=function(e){return"unscheduled"===e.source.droppableId},R=n(177),C=n(178),D=n(72),P=n(179),k=Object(c.createContext)({}),I={viewMode:"",viewRange:{start:null,end:null},postStatuses:{}},U=f.defaultStatusColors;function A(e,t){switch(t.type){case"UPDATE":return Object(j.a)(Object(j.a)({},e),{},{viewMode:t.viewMode?t.viewMode:e.viewMode,viewRange:t.viewRange?t.viewRange:e.viewRange});case"SET_RANGE":var n="list"!==e.viewMode?{start:Object(R.a)(t.start),end:Object(C.a)(t.end)}:{start:t.start,end:t.end};return Object(j.a)(Object(j.a)({},e),{},{viewRange:{start:n.start,end:n.end}});case"SET_RANGE_START":return Object(j.a)(Object(j.a)({},e),{},{viewRange:Object(j.a)(Object(j.a)({},e.viewRange),{},{start:"list"!==e.viewMode?Object(R.a)(t.date):t.date})});case"SET_RANGE_END":return Object(j.a)(Object(j.a)({},e),{},{viewRange:Object(j.a)(Object(j.a)({},e.viewRange),{},{end:"list"!==e.viewMode?Object(C.a)(t.date):t.date})});case"NEXT_MONTH":return Object(j.a)(Object(j.a)({},e),{},{viewRange:{start:Object(D.a)(e.viewRange.start,1),end:Object(D.a)(e.viewRange.end,1)}});case"PREV_MONTH":return Object(j.a)(Object(j.a)({},e),{},{viewRange:{start:Object(P.a)(e.viewRange.start,1),end:Object(P.a)(e.viewRange.end,1)}});case"SET_POST_STATUSES":var c=t.postStatuses;for(var a in c)c[a].visible=!("visible"in c[a])||c[a].visible;return Object(j.a)(Object(j.a)({},e),{},{postStatuses:c});case"TOGGLE_POST_STATUS":return Object(j.a)(Object(j.a)({},e),{},{postStatuses:Object(j.a)(Object(j.a)({},e.postStatuses),{},Object(l.a)({},t.postStatus,Object(j.a)(Object(j.a)({},e.postStatuses[t.postStatus]),{},{visible:!e.postStatuses[t.postStatus].visible})))});case"SET_POST_STATUS_COLOR":return Object(j.a)(Object(j.a)({},e),{},{postStatuses:Object(j.a)(Object(j.a)({},e.postStatuses),{},Object(l.a)({},t.postStatus,Object(j.a)(Object(j.a)({},e.postStatuses[t.postStatus]),{},{color:t.color})))});case"RESET_POST_STATUS_COLORS":for(var s=e.postStatuses,r=0,o=Object.keys(e.postStatuses);r<o.length;r++){var i=o[r];s[i].color=U[i]}return Object(j.a)(Object(j.a)({},e),{},{postStatuses:Object(j.a)({},s)});default:return e}}function M(){var e=Object(c.useContext)(k),t=e.viewOptions.viewMode,n=e.viewOptionsDispatch,a=function(e){n({type:"UPDATE",viewMode:e.target.value})};return Object(b.jsx)("div",{className:"viewOptions",children:Object(b.jsxs)("div",{className:"viewMode",children:[Object(b.jsx)("button",{onClick:a,className:"icon ".concat("calendar"===t?"active ":"inactive"),value:"calendar",title:"Calendar",children:"calendar_view_month"}),Object(b.jsx)("button",{name:"viewMode",onClick:a,className:"icon ".concat("list"===t?"active ":"inactive"),value:"list",title:"List",children:"view_list"})]})})}var L=n(25),G=n.n(L),F=n(180),H=n(181),V=n(182),B=n(183);function X(e){var t=e.handleTodayClick,n=Object(c.useContext)(k),a=n.viewOptions.viewRange,s=n.viewMode,r=n.viewOptionsDispatch,o=Object(F.a)(),i=Object(c.forwardRef)((function(e,t){var n=e.value,c=e.onClick;return Object(b.jsx)("button",{className:"viewRange__input",onClick:c,ref:t,children:n})}));Object(c.useEffect)((function(){a.start||a.end||r({type:"SET_RANGE",start:"calendar"===s?Object(H.a)(o):o,end:"calendar"===s?Object(V.a)():Object(B.a)(o,30)})}),[o,a.start,a.end,s,r]);return Object(b.jsxs)("div",{className:"calendarListHeader row flex-middle",children:[Object(b.jsx)("div",{className:"col col__start",children:Object(b.jsx)("button",{className:"icon dateChevron",onClick:function(e){e.preventDefault(),r({type:"PREV_MONTH"})},title:"Previous Month",children:"chevron_left"})}),Object(b.jsxs)("div",{className:"col col__center mainViewOptions",children:[Object(b.jsx)("div",{className:"toToday",children:Object(b.jsx)("button",{className:"icon today",onClick:t,title:"Jump to Today",children:"today"})}),Object(b.jsxs)("div",{className:"viewRange",children:[Object(b.jsx)(G.a,{dateFormat:y,selected:a.start,onChange:function(e){return r({type:"SET_RANGE_START",date:e})},customInput:Object(b.jsx)(i,{}),selectsStart:!0,startDate:a.start,endDate:a.end,closeOnScroll:function(e){return e.target===document}})," to ",Object(b.jsx)(G.a,{dateFormat:y,selected:a.end,onChange:function(e){return r({type:"SET_RANGE_END",date:e})},customInput:Object(b.jsx)(i,{}),selectsEnd:!0,startDate:a.start,endDate:a.end,minDate:a.start,monthsShown:2,closeOnScroll:function(e){return e.target===document}})]}),Object(b.jsx)(M,{})]}),Object(b.jsx)("div",{className:"col col__end",children:Object(b.jsx)("button",{className:"icon dateChevron",onClick:function(e){e.preventDefault(),r({type:"NEXT_MONTH"})},title:"Next Month",children:"chevron_right"})})]})}var J=Object(c.createContext)({}),W={currentPost:{id:null,post_title:"",post_status:"",post_date:"",unscheduled:null},refetch:!1,dateRange:{start:"",end:""},unscheduled:[],scheduled:[],trashed:[],taxonomies:{},locale:""};function Y(e,t){switch(t.type){case"SET_SCHEDULED":var n=t.posts;n.forEach((function(e,t){n[t].post_date=new Date(e.post_date),n[t].post_date_day=Object(h.a)(n[t].post_date,m)}));var c=Object(p.groupBy)(n,"post_date_day");return Object(j.a)(Object(j.a)({},e),{},{dateRange:{start:t.start?t.start:e.dateRange.start,end:t.end?t.end:e.dateRange.end},scheduled:c});case"SET_UNSCHEDULED":var a=t.posts;return a.forEach((function(e,t){a[t].post_date=new Date(e.post_date)})),Object(j.a)(Object(j.a)({},e),{},{unscheduled:a});case"MOVE":var s=e.scheduled,r=e.unscheduled;return"unscheduled"===t.sourceId?r=t.source:s[t.sourceId]=t.source,"unscheduled"===t.destinationId?r=t.destination:s[t.destinationId]=t.destination,Object(j.a)(Object(j.a)({},e),{},{unscheduled:r,scheduled:s});case"SET_TAXONOMY_TERMS":return Object(j.a)(Object(j.a)({},e),{},{taxonomies:Object(j.a)(Object(j.a)({},e.taxonomies),{},Object(l.a)({},t.name,{taxonomy:t.taxonomy,terms:t.terms}))});case"SET_CURRENTPOST":return Object(j.a)(Object(j.a)({},e),{},{currentPost:Object(j.a)(Object(j.a)({},t.post),{},{unscheduled:t.unscheduled})});case"REFETCH":return Object(j.a)(Object(j.a)({},e),{},{refetch:!e.refetch});case"NEW_POST":return Object(j.a)(Object(j.a)({},e),{},{currentPost:{id:0,post_date:t.post_date,unscheduled:t.unscheduled,taxonomies:{}}});case"UPDATE_CURRENTPOST_FIELD":return Object(j.a)(Object(j.a)({},e),{},{currentPost:Object(j.a)(Object(j.a)({},e.currentPost),{},Object(l.a)({},t.field,t.value))});case"UNSET_CURRENTPOST":return Object(j.a)(Object(j.a)({},e),{},{currentPost:W.currentPost});default:return e}}var q=f.routeBase,z={"X-WP-Nonce":f.nonce},K=function(e,t){var n=Object(c.useContext)(J),a=n.posts.refetch,s=n.postsDispatch,r=Object(c.useState)(!1),o=Object(d.a)(r,2),l=o[0],j=o[1];return Object(c.useEffect)((function(){if(null!==e&&null!==t){var n=Object(h.a)(e,m),c=Object(h.a)(t,m),a="".concat(q,"/posts/scheduled/").concat(n,"/").concat(c);return function(){var e=Object(u.a)(i.a.mark((function e(){var t,n;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return j(!0),e.prev=1,e.next=4,fetch(a,{headers:z});case 4:return t=e.sent,e.next=7,t.json();case 7:n=e.sent,s({type:"SET_SCHEDULED",posts:n.posts,start:n.dateRange.start,end:n.dateRange.end}),j(!1),e.next=16;break;case 12:e.prev=12,e.t0=e.catch(1),console.log("REST error",e.t0.message),j(!1);case 16:case"end":return e.stop()}}),e,null,[[1,12]])})));return function(){return e.apply(this,arguments)}}()(),function(){j(!1)}}}),[e,t,a,s]),l},Q=function(e){var t=Object(c.useContext)(J),n=t.posts.taxonomies,a=t.postsDispatch,s=Object(c.useState)(!1),r=Object(d.a)(s,2),o=r[0],l=r[1];return Object(c.useEffect)((function(){if(Object(p.isEmpty)(n[e])){var t="".concat(q,"/tax/").concat(e);return function(){var n=Object(u.a)(i.a.mark((function n(){var c,s;return i.a.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return l(!0),n.prev=1,n.next=4,fetch(t,{headers:z});case 4:return c=n.sent,n.next=7,c.json();case 7:s=n.sent,a({type:"SET_TAXONOMY_TERMS",name:e,taxonomy:s.taxonomy,terms:s.terms}),l(!1),n.next=16;break;case 12:n.prev=12,n.t0=n.catch(1),console.log("REST error",n.t0.message),l(!1);case 16:case"end":return n.stop()}}),n,null,[[1,12]])})));return function(){return n.apply(this,arguments)}}()(),function(){l(!1)}}}),[e,n,a]),o},Z=function(e,t){Object(c.useEffect)((function(){var n=!1,c=!1,a=function(a){!n&&c&&e.current&&!e.current.contains(a.target)&&t(a)},s=function(t){c=e.current,n=e.current&&e.current.contains(t.target)};return document.addEventListener("mousedown",s),document.addEventListener("touchstart",s),document.addEventListener("click",a),function(){document.removeEventListener("mousedown",s),document.removeEventListener("touchstart",s),document.removeEventListener("click",a)}}),[e,t])};function $(e){var t=e.handleTodayClick;!function(){var e=Object(c.useState)(!1),t=Object(d.a)(e,2),n=t[0],a=t[1],s=Object(c.useContext)(k).viewOptionsDispatch;Object(c.useEffect)((function(){var e="".concat(q,"/statuses");return function(){var t=Object(u.a)(i.a.mark((function t(){var n,c;return i.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return a(!0),t.prev=1,t.next=4,fetch(e,{headers:z});case 4:return n=t.sent,t.next=7,n.json();case 7:c=t.sent,s({type:"SET_POST_STATUSES",postStatuses:c}),a(!1),t.next=16;break;case 12:t.prev=12,t.t0=t.catch(1),console.log("REST error",t.t0.message),a(!1);case 16:case"end":return t.stop()}}),t,null,[[1,12]])})));return function(){return t.apply(this,arguments)}}()(),function(){a(!1)}}),[s])}();var n=f.pluginUrl;return Object(b.jsx)("header",{className:"calendario__header",children:Object(b.jsxs)("div",{className:"calendario__header__content",children:[Object(b.jsx)("div",{className:"left",children:Object(b.jsx)(X,{handleTodayClick:t})}),Object(b.jsxs)("div",{className:"right",children:[Object(b.jsx)("h1",{className:"calendario__title",children:"editorial calendar.io"}),Object(b.jsx)("a",{className:"calendario__logo",href:"https://roundhouse-designs.com",rel:"noreferrer",target:"_blank",children:Object(b.jsx)("img",{src:"".concat(n,"rhd-logo.png"),alt:"Roundhouse Designs logo"})})]})]})})}var ee=n(75),te=n(184),ne=n(185),ce=Object(c.createContext)(null),ae={post:{},isDragging:!1,currentIndex:null,newIndex:null,overUnscheduled:!1};function se(e,t){switch(t.type){case"START":return{post:t.post,isDragging:!0,currentIndex:t.currentIndex>=0&&t.currentIndex};case"DRAGGING_OVER_UNSCHEDULED":return Object(j.a)(Object(j.a)({},e),{},{newIndex:t.draggedOver,overUnscheduled:!0});case"DRAGGING_OVER_CALENDAR":return Object(j.a)(Object(j.a)({},e),{},{newIndex:ae.newIndex,overUnscheduled:!1});case"END":return ae;default:return e}}var re=Object(c.forwardRef)((function(e,t){var n=e.day,a=e.monthName,s=e.children,r=Object(c.useState)(!1),o=Object(d.a)(r,2),i=o[0],u=o[1],l=Object(c.useContext)(ce).draggedPost,j=l.post.post_date,O=l.isUnscheduled,p=["day","col","cell"],f=function(){!O&&Object(ee.a)(n,j)||u(!0)};return Object(te.a)(n)&&p.push("today"),Object(ne.a)(n)&&!Object(te.a)(n)&&p.push("past"),i&&p.push("dragOver"),Object(b.jsxs)("div",{className:p.join(" "),ref:Object(te.a)(n)?t:null,onDragOver:f,onDragLeave:function(){return u(!1)},onDrop:function(){return u(!1)},children:[a?Object(b.jsx)("span",{className:"month",children:a}):"",Object(b.jsx)("span",{className:"number",children:Object(h.a)(n,v)}),s]})})),oe={updateNow:!1,trash:!1,post:{},params:{},newIndex:null,unscheduled:!1};function ie(e,t){switch(t.type){case"UPDATE":return{updateNow:!0,post:t.post,params:t.params,newIndex:t.newIndex,unscheduled:t.unscheduled};case"UPDATING":return Object(j.a)(Object(j.a)({},e),{},{updateNow:!1});case"TRASH":return{trash:!0,updateNow:!0,params:t.params};case"COMPLETE":return oe;default:return e}}var ue=n(17);function de(e){var t=e.post,n=e.className,a=e.unscheduled,s=f.routeBase,r=f.user,o=f.nonce,l=f.DEBUG_MODE,j=t.id,O=t.edit_link,p=t.view_link,h=Object(c.useContext)(J).postsDispatch,v=Object(c.useReducer)(ie,oe),m=Object(d.a)(v,2),x=m[0],_=m[1];Object(c.useEffect)((function(){if(!0===x.updateNow&&"undefined"!==j){_({type:"UPDATING"});var e="".concat(s,"/posts/");!0===x.trash?e+="trash/".concat(j,"/").concat(r):e+="update/".concat(j,"/").concat(r);var t={"Content-Type":"application/json"};!0!==l&&(t["X-WP-Nonce"]=o);var n={unscheduled:x.unscheduled};(function(){var c=Object(u.a)(i.a.mark((function c(){var a;return i.a.wrap((function(c){for(;;)switch(c.prev=c.next){case 0:return c.prev=0,c.next=3,fetch(e,{method:"POST",headers:t,body:JSON.stringify(n)});case 3:return a=c.sent,c.next=6,a.json();case 6:_({type:"COMPLETE"}),c.next=12;break;case 9:c.prev=9,c.t0=c.catch(0),console.log(c.t0.message);case 12:case"end":return c.stop()}}),c,null,[[0,9]])})));return function(){return c.apply(this,arguments)}})()()}}),[j,r,o,s,h,x.trash,x.params,x.updateNow,x.unscheduled,l]);return Object(b.jsxs)("div",{className:"postLinks ".concat(n),children:[Object(b.jsx)("button",{className:"icon top left icon__view",onClick:function(){return window.open(p,"_blank")},target:"_blank",rel:"noreferrer",title:"View Post",children:"open_in_new"}),Object(b.jsx)("button",{className:"icon top right icon__edit",onClick:function(){return window.open(Object(ue.decode)(O),"_blank")},target:"_blank",rel:"noreferrer",title:"Edit Post in a new tab",children:"mode_edit"}),a?Object(b.jsx)("button",{className:"icon icon__schedule bottom right",onClick:function(e){e.preventDefault(),_({type:"UPDATE",params:{},unscheduled:!1})},title:"Schedule this post",children:"event_available"}):Object(b.jsx)("button",{className:"icon icon__unschedule bottom right",onClick:function(e){e.preventDefault(),_({type:"UPDATE",params:{},unscheduled:!0})},title:"Unschedule this post",children:"drafts"}),Object(b.jsx)("button",{className:"icon icon__trash bottom left",onClick:function(){_({type:"TRASH",params:{id:j}})},title:"Trash this post",children:"delete_forever"})]})}var le=n(21);function je(e){var t=e.post,n=e.index,a=e.unscheduled,s=Object(c.useContext)(J),r=s.posts.currentPost,o=s.postsDispatch,i=Object(c.useContext)(ce).draggedPost.isDragging,u=Object(c.useContext)(k).viewOptions.postStatuses,l=Object(c.useState)(""),O=Object(d.a)(l,2),h=O[0],f=O[1];Object(c.useEffect)((function(){if(void 0!==u&&!Object(p.isEmpty)(u))return f(u[t.post_status].color),function(){f("")}}),[t.post_status,u]);var v=function(e){e.target.classList.contains("icon")||o({type:"SET_CURRENTPOST",post:t,unscheduled:a})};return Object(p.isEmpty)(u)?null:function(){var e=["post","post-id-".concat(t.id," status__").concat(t.post_status)];return!1===a&&!0===u[t.post_status].visible||!0===a?e.push("visible"):e.push("hidden"),Object(p.isEmpty)(r)||r.id!==t.id||e.push("currentPost"),Object(b.jsx)(le.b,{draggableId:"".concat(t.id),index:n,children:function(s,r){return Object(c.createElement)("li",Object(j.a)(Object(j.a)(Object(j.a)({ref:s.innerRef},s.draggableProps),s.dragHandleProps),{},{key:t.id,className:e.join(" "),"data-index":n,onClick:v}),Object(b.jsxs)("div",{className:"postData",style:{backgroundColor:h},children:[Object(ue.decode)(t.post_title,{scope:"strict"}),Object(b.jsx)(de,{className:i?"disabled":"active",post:t,unscheduled:a})]}))}})}()}function be(e){var t=e.renderPosts,n=e.className,a=e.date,s=Object(c.useState)(!1),r=Object(d.a)(s,2),o=r[0],i=r[1],u=!1===a?"unscheduled":Object(h.a)(a,m),l=Object(c.useMemo)((function(){return Object(p.isEmpty)(t)?null:t.map((function(e,t){return Object(b.jsx)(je,{post:e,index:t,unscheduled:"unscheduled"===u},e.id)}))}),[t,u]);return Object(b.jsx)(le.c,{droppableId:u,children:function(e,t){return Object(b.jsxs)("ul",Object(j.a)(Object(j.a)({ref:e.innerRef},e.droppableProps),{},{className:"postList ".concat(n),onMouseEnter:function(){return i(!0)},onMouseLeave:function(){return i(!1)},style:o?{marginBottom:0}:null,children:[l,e.placeholder]}))}})}function Oe(e){var t=e.day,n=e.unscheduled,a=Object(c.useContext)(J).postsDispatch;return Object(b.jsx)("button",{className:"icon newPost",onClick:function(e){e.preventDefault(),a({type:"NEW_POST",post_date:t||new Date,unscheduled:n||!1})},children:"add_circle"})}function pe(e){var t=e.posts,n=e.date,a=e.title,s=Object(c.useContext)(ce).draggedPost.isDragging;return function(){var e=Object(b.jsxs)(b.Fragment,{children:[s?null:Object(b.jsx)(Oe,{day:n,unscheduled:!1}),Object(b.jsx)(be,{className:"dayPosts",date:n,renderPosts:t})]});return a?Object(b.jsxs)(b.Fragment,{children:[Object(b.jsx)("h4",{className:"title",children:a}),e]}):e}()}var he=n(186);function fe(e){var t=e.className,n=e.todayRef,a=Object(c.useContext)(J).posts.scheduled,s=Object(c.useContext)(k).viewOptions.viewRange;K(s.start,s.end);var r=Object(c.useCallback)((function(){for(var e=[],t=Object(R.a)(s.start),n=0;n<7;n++)e.push(Object(b.jsx)("div",{className:"col col__center",children:Object(h.a)(Object(B.a)(t,n),_)},n));return Object(b.jsx)("div",{className:"days row",children:e})}),[s.start]),o=Object(c.useCallback)((function(){for(var e=[],t=[],c=s.start,r=!0;c<s.end;){for(var o=0;o<7;o++){var i=Object(he.a)(c)||r;t.push(Object(b.jsx)(re,{ref:Object(te.a)(c)?n:null,day:c,monthName:i?Object(h.a)(c,g):"",children:Object(b.jsx)(pe,{date:c,posts:a[S(c)],allowDrag:!0,renderEmpty:!0})},c)),r=!1,c=Object(B.a)(c,1)}e.push(Object(b.jsx)("div",{className:"row",children:t},c)),t=[]}return Object(b.jsx)("div",{className:"body",children:e})}),[s.end,s.start,a,n]);return Object(b.jsx)("div",{className:t,children:null!==s.start&&null!==s.end?Object(b.jsxs)("div",{className:"view__calendar__inner",children:[r(),o()]}):null})}var ve=n(187);function me(e){var t=e.className,n=Object(c.useContext)(J).posts.scheduled,a=Object(c.useContext)(k).viewOptions.viewRange,s=a.start,r=a.end;K(s,r);var o=function(){var e=[],t=s,c=["listDay"];if("undefined"!==r&&null!==r)for(;Object(ve.a)(t)<=Object(ve.a)(r);)Object(te.a)(t)&&c.push("today"),Object(ne.a)(t)&&!Object(te.a)(t)&&c.push("past"),e.push(Object(b.jsx)("li",{className:c.join(" "),children:Object(b.jsx)(pe,{date:t,posts:n[S(t)],allowDrag:!0,title:Object(h.a)(t,E),newPostButton:!0})},t)),t=Object(B.a)(t,1);return e};return Object(b.jsx)("div",{className:t,children:null!==s&&null!==r?Object(b.jsx)(b.Fragment,{children:Object(b.jsx)("div",{className:"view__list__days",children:Object(b.jsx)("ul",{children:o()})})}):null})}var xe=n(31);function _e(e){var t=e.name,n=e.label,c=e.inlineLabel,a=e.children;return Object(b.jsxs)("div",{className:"fieldGroup fieldGroup__".concat(t," ").concat(c?"inlineLabel":""),children:[n?Object(b.jsx)("label",{htmlFor:t,children:n}):null,a]})}var ge=n(188),Ee={post:{},editMode:!1};function ye(e,t){switch(t.type){case"SET":return{post:t.post,editMode:!0};case"EDIT":var n=t.field,c=t.value;return"post_date"===n&&(c=new Date(c)),Object(j.a)(Object(j.a)({},e),{},{post:Object(j.a)(Object(j.a)({},e.post),{},Object(l.a)({},n,c))});case"TOGGLE_TAXONOMY":var a=parseInt(t.term_id),s=!!e.post.taxonomies.hasOwnProperty(t.taxonomy)&&e.post.taxonomies[t.taxonomy].indexOf(a),r=-1===s?[].concat(Object(xe.a)(e.post.taxonomies[t.taxonomy]),[a]):!1===s?[a]:[].concat(Object(xe.a)(e.post.taxonomies[t.taxonomy].slice(0,s)),Object(xe.a)(e.post.taxonomies[t.taxonomy].slice(s+1)));return Object(j.a)(Object(j.a)({},e),{},{post:Object(j.a)(Object(j.a)({},e.post),{},{taxonomies:Object(j.a)(Object(j.a)({},e.post.taxonomies),{},Object(l.a)({},t.taxonomy,r))})});case"CLEAR":return Ee;default:return{state:e}}}function Ne(){var e=f.routeBase,t=f.user,n=f.nonce,a=Object(c.useContext)(k).viewOptions.postStatuses,s=Object(c.useContext)(J),r=s.posts,o=r.currentPost,l=r.taxonomies,j=s.postsDispatch,O=Object(c.useContext)(ce).draggedPostDispatch,v=Object(c.useReducer)(ye,Ee),m=Object(d.a)(v,2),_=m[0],g=m[1],E=Object(c.useReducer)(ie,oe),y=Object(d.a)(E,2),w=y[0],S=y[1],T=Object(c.useRef)(),R=Object(c.useState)(new Date),C=Object(d.a)(R,2),D=C[0],P=C[1],I=Object(c.useState)({}),U=Object(d.a)(I,2),A=U[0],M=U[1],L=Object(c.useState)(!1),F=Object(d.a)(L,2),H=F[0],V=F[1],B=Object(c.useState)(!1),X=Object(d.a)(B,2),W=X[0],Y=X[1],q=_.post,z=_.editMode;Object(c.useEffect)((function(){return q.post_date&&"undefined"!==q.post_date&&P(new Date(q.post_date)),function(){P(new Date)}}),[q.post_date]),Object(c.useEffect)((function(){var e=[];!0===q.unscheduled?e.push("publish","future","pending"):Object(ge.a)(D)?e.push("publish"):Object(ne.a)(D)&&e.push("future");var t=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=e;if(t.length>0)for(var c in n)t.includes(c)&&(n=Object(p.omit)(n,c));return n}(a,e);return M(t),function(){M({})}}),[D,q.unscheduled,a]),Object(c.useEffect)((function(){return V(!(!o.post_date||!Object(te.a)(o.post_date)&&!Object(ne.a)(o.post_date)||"publish"!==o.post_status)),function(){V(!1)}}),[o.post_date,o.post_status]),Object(c.useEffect)((function(){if(!0===w.updateNow&&"undefined"!==o.id){S({type:"UPDATING"});var c="".concat(e,"/posts/");!0===w.trash?c+="trash/".concat(o.id,"/").concat(t):0===o.id?c+="new/".concat(t):c+="update/".concat(o.id,"/").concat(t);var a={"Content-Type":"application/json"};a["X-WP-Nonce"]=n;var s={params:N(w.params,o),unscheduled:w.unscheduled};(function(){var e=Object(u.a)(i.a.mark((function e(){var t;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch(c,{method:"POST",headers:a,body:JSON.stringify(s)});case 3:return t=e.sent,e.next=6,t.json();case 6:O({type:"END"}),S({type:"COMPLETE"}),j({type:"SET_CURRENTPOST",post:q,unscheduled:q.unscheduled}),j({type:"REFETCH"}),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(0),console.log(e.t0.message);case 15:case"end":return e.stop()}}),e,null,[[0,12]])})));return function(){return e.apply(this,arguments)}})()()}}),[o,e,q,t,n,O,j,w.trash,w.params,w.updateNow,w.unscheduled]),Object(c.useEffect)((function(){return(o.id>0||0===o.id)&&g({type:"SET",post:o}),function(){g({type:"CLEAR"})}}),[o.id,o]);var K,Q=Object(c.useCallback)((function(){g({type:"CLEAR"}),j({type:"UNSET_CURRENTPOST"})}),[g,j]),$=function(e){g({type:"EDIT",field:e.target.name,value:e.target.value})},ee=function(e){g({type:"TOGGLE_TAXONOMY",taxonomy:e.target.name,term_id:e.target.value})};return Z(T,Q),Object(b.jsx)("div",{className:"editPost ".concat(z?"active":"inactive"),children:Object(b.jsx)("div",{className:"editPost__container",children:z?Object(b.jsxs)("div",{ref:T,className:"editPost__editor",children:[Object(b.jsx)("button",{className:"close icon",onClick:Q,children:"highlight_off"}),Object(b.jsxs)("h3",{className:"title",children:[0===q.id?"New":"Edit"," Post"]}),Object(b.jsxs)("form",{className:"editPost__editor__form",onSubmit:function(e){e.preventDefault(),S({type:"UPDATE",params:{post_title:q.post_title,post_date:Object(h.a)(new Date(q.post_date),x),post_status:q.post_status,post_excerpt:q.post_excerpt,taxonomies:q.taxonomies},unscheduled:q.unscheduled}),g({type:"CLEAR"})},children:[Object(b.jsx)(_e,{name:"post_title",label:"Title",children:Object(b.jsx)("input",{name:"post_title",value:Object(ue.decode)(q.post_title,{scope:"strict"}),onChange:$})}),Object(b.jsxs)(_e,{name:"date_status",children:[Object(b.jsxs)("div",{className:"fieldGroup__date",children:[Object(b.jsxs)("div",{className:"post_date ".concat(!0===q.unscheduled?"inactive":"active"),children:[Object(b.jsx)("label",{htmlFor:"post_date",children:"Post Date"}),Object(b.jsx)(G.a,{closeOnScroll:function(e){return e.target===document},selected:D,timeInputLabel:"Time:",showTimeInput:!0,dateFormat:x,onChange:function(e){null===e&&(e=new Date),g({type:"EDIT",field:"post_date",value:e})},disabled:H})]}),Object(b.jsxs)("div",{className:"unscheduled",children:[Object(b.jsx)("input",{type:"checkbox",name:"unscheduled",checked:q.unscheduled,onChange:function(e){g({type:"EDIT",field:e.target.name,value:!q[e.target.name]})}}),Object(b.jsx)("label",{htmlFor:"unscheduled",children:"Unscheduled"})]})]}),Object(b.jsxs)("div",{className:"fieldGroup__status",children:[Object(b.jsx)("label",{htmlFor:"post_status",children:"Post Status"}),Object(b.jsx)("select",{name:"post_status",onChange:$,value:q.post_status,children:(K=A,Object.keys(K).map((function(e){return Object(b.jsx)("option",{value:e,children:K[e].name},e)})))})]})]}),Object(b.jsxs)(_e,{name:"taxonomies",children:[Object(b.jsxs)("label",{htmlFor:"category",children:["Categories",Object(b.jsx)("fieldset",{name:"category",children:l.category.terms.map((function(e,t){return Object(b.jsxs)("label",{children:[Object(b.jsx)("input",{type:"checkbox",name:"category",value:e.term_id,onChange:ee,checked:!Object(p.isEmpty)(q.taxonomies)&&!Object(p.isEmpty)(q.taxonomies.category)&&q.taxonomies.category.includes(e.term_id)}),Object(ue.decode)(e.name,{scope:"strict"})]},t)}))})]}),Object(b.jsxs)("label",{htmlFor:"post_tag",children:["Tags",Object(b.jsx)("fieldset",{name:"post_tag",children:l.post_tag.terms.map((function(e,t){return Object(b.jsxs)("label",{children:[Object(b.jsx)("input",{type:"checkbox",name:"post_tag",value:e.term_id,onChange:ee,checked:!Object(p.isEmpty)(q.taxonomies)&&!Object(p.isEmpty)(q.taxonomies.post_tag)&&q.taxonomies.post_tag.includes(e.term_id)}),Object(ue.decode)(e.name,{scope:"strict"})]},t)}))})]})]}),Object(b.jsx)(_e,{name:"post_excerpt",label:"Excerpt",children:Object(b.jsx)("textarea",{name:"post_excerpt",onChange:$,rows:4,value:Object(ue.decode)(q.post_excerpt,{scope:"strict"})})}),Object(b.jsx)("div",{className:"post_thumb",children:q.image?Object(b.jsxs)("div",{children:[Object(b.jsx)("span",{children:"Featured Image"}),Object(b.jsx)("a",{href:Object(ue.decode)(q.edit_link),target:"_blank",rel:"noreferrer",children:Object(b.jsx)("img",{src:q.image,alt:"".concat(q.post_title)})})]}):null}),Object(b.jsx)("div",{className:"editPost__buttons",children:!0===W?Object(b.jsxs)("div",{className:"editPost__buttons__trash confirm",children:[Object(b.jsx)("p",{style:{fontWeight:"bold"},children:"Are you sure you want to Trash this post?"}),Object(b.jsx)("input",{type:"button",onClick:function(){S({type:"TRASH",params:{id:q.id}}),g({type:"CLEAR"}),Y(!1)},value:"Yes",autoFocus:!0}),Object(b.jsx)("input",{type:"button",onClick:function(){return Y(!1)},value:"No"})]}):Object(b.jsxs)(b.Fragment,{children:[Object(b.jsx)("input",{type:"submit",className:"editPost__buttons__save",value:0===q.id?"Save":"Update"}),Object(b.jsx)("input",{type:"button",className:"editPost__buttons__cancel",onClick:function(){g({type:"CLEAR"}),j({type:"UNSET_CURRENTPOST"})},value:"Cancel"}),Object(b.jsx)("input",{type:"button",className:"editPost__buttons__trash",onClick:function(){return Y(!0)},value:"Delete"})]})})]})]}):null})})}var we=Object(c.forwardRef)((function(e,t){var n=e.todayRef,a=Object(c.useContext)(k).viewOptions.viewMode;return Q("category"),Q("post_tag"),Object(b.jsxs)("main",{className:"calendario__main",children:[Object(b.jsx)("div",{className:"view",ref:t,children:"calendar"===a?Object(b.jsx)(fe,{className:"view__calendar",todayRef:n}):Object(b.jsx)(me,{className:"view__list",todayRef:n})}),Object(b.jsx)(Ne,{})]})}));function Se(){var e=f.blogUrl,t=f.trashUrl,n=function(e){var t=Object(d.a)(e,3),n=t[0],c=t[1],a=t[2];return a=a||"_self",Object(b.jsx)("li",{children:Object(b.jsxs)("a",{rel:"noreferrer",href:n,target:a,children:[c," ",Object(b.jsx)("span",{className:"icon",children:"open_in_new"})]})})};return Object(b.jsxs)("ul",{className:"adminLinks",children:[n([t,"Trash","_blank"]),n([e,"View Posts","_blank"])]})}function Te(){var e=Object(c.useContext)(J).posts.unscheduled;return function(){var e=Object(c.useContext)(J),t=e.posts.refetch,n=e.postsDispatch,a=Object(c.useState)(!1),s=Object(d.a)(a,2),r=s[0],o=s[1];Object(c.useEffect)((function(){var e="".concat(q,"/posts/unscheduled");return function(){var t=Object(u.a)(i.a.mark((function t(){var c,a;return i.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o(!0),t.prev=1,t.next=4,fetch(e,{headers:z});case 4:return c=t.sent,t.next=7,c.json();case 7:a=t.sent,n({type:"SET_UNSCHEDULED",posts:a.posts}),o(!1),t.next=16;break;case 12:t.prev=12,t.t0=t.catch(1),console.log("REST error",t.t0.message),o(!1);case 16:case"end":return t.stop()}}),t,null,[[1,12]])})));return function(){return t.apply(this,arguments)}}()(),function(){o(!1)}}),[n,t])}(),Object(b.jsxs)(b.Fragment,{children:[Object(b.jsx)(be,{className:"unscheduledDrafts",date:!1,renderPosts:e}),Object(b.jsx)(Oe,{unscheduled:!0}),Object(b.jsx)(Se,{})]})}var Re=n(76);function Ce(e){var t=e.color,n=e.name,a=f.presetStatusColors,s=Object(c.useRef)(),r=Object(c.useRef)(t),o=Object(c.useContext)(k),i=o.viewOptions.postStatuses,u=o.viewOptionsDispatch,l=Object(c.useState)(""),j=Object(d.a)(l,2),O=j[0],p=j[1],h=Object(c.useState)(!1),v=Object(d.a)(h,2),m=v[0],x=v[1];Object(c.useEffect)((function(){(void 0!==s.current||t)&&p(t)}),[t]),Object(c.useEffect)((function(){void 0!==s.current&&i[n].color!==O&&r.current!==O&&(u({type:"SET_POST_STATUS_COLOR",postStatus:n,color:O}),r.current=O)}),[O,n,i,u]);var _=Object(c.useCallback)((function(){return x(!1)}),[]);return Z(s,_),Object(b.jsxs)("div",{className:"picker",children:[Object(b.jsx)("div",{className:"swatch",style:{backgroundColor:O},onClick:function(){return x(!0)}}),m&&Object(b.jsxs)("div",{className:"popover",ref:s,children:[Object(b.jsx)(Re.a,{color:O,onChange:p,name:n}),Object(b.jsx)("div",{className:"picker__swatches",children:void 0===a?null:a.map((function(e){return Object(b.jsx)("button",{className:"picker__swatch",style:{background:e},onClick:function(){return p(e)}},e)}))})]})]})}function De(e){var t=e.selected,n=e.toggleSelected,c=e.name;return Object(b.jsx)("div",{className:"toggle",children:Object(b.jsx)("button",{name:c,className:"dialog-button ".concat(t?"":"disabled"),onClick:n,children:t?"ON":"OFF"})})}function Pe(){var e=f.routeBase,t=Object(c.useRef)(!0),n=Object(c.useContext)(k),a=n.viewOptions.postStatuses,s=n.viewOptionsDispatch,r=Object.keys(a),o=Object(c.useState)(!1),l=Object(d.a)(o,2),j=l[0],O=l[1];Object(c.useEffect)((function(){O(function(e){var t=f.defaultStatusColors,n={};for(var c in e)n[c]=e[c].color;return!Object(p.isEqual)(t,n)}(a))}),[a]),Object(c.useEffect)((function(){if(!Object(p.isEmpty)(a))if(!0!==t.current){var n="".concat(e,"/statuses");(function(){var e=Object(u.a)(i.a.mark((function e(){var t,c,s;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(c in t={},a)t[c]=a[c].color;return e.prev=2,e.next=5,fetch(n,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)});case 5:return s=e.sent,e.next=8,s.json();case 8:e.next=13;break;case 10:e.prev=10,e.t0=e.catch(2),console.log(e.t0.message);case 13:case"end":return e.stop()}}),e,null,[[2,10]])})));return function(){return e.apply(this,arguments)}})()()}else t.current=!1}),[t,e,a]);var h=function(e){s({type:"TOGGLE_POST_STATUS",postStatus:e.target.name})};return Object(b.jsxs)("div",{className:"statusFilters",children:[Object(b.jsx)("ul",{className:"filters",children:r.map((function(e,t){var n=a[e],c=n.color,s=n.name;return Object(b.jsxs)("li",{className:"filterItem status__".concat(e),children:[Object(b.jsx)(Ce,{color:c,name:e}),Object(b.jsx)("span",{className:"name",children:s}),Object(b.jsx)(De,{selected:!!a[e].visible,toggleSelected:h,name:e})]},t)}))}),j?Object(b.jsx)("button",{className:"reset",onClick:function(){s({type:"RESET_POST_STATUS_COLORS"})},children:"Reset Colors"}):null]})}function ke(){var e=f.pluginUrl;return Object(b.jsx)("aside",{className:"calendario__sidebar",children:Object(b.jsxs)("div",{className:"calendario__sidebar__inner",children:[w("Unscheduled Drafts","unscheduledDrafts",Object(b.jsx)(Te,{})),w("Post Status","statusFilters",Object(b.jsx)(Pe,{})),w("","support",Object(b.jsxs)(b.Fragment,{children:[Object(b.jsxs)("ul",{className:"docs",children:[Object(b.jsx)("li",{children:Object(b.jsx)("a",{href:"https://github.com/gaswirth/rhdwp-calendario",rel:"noreferrer",target:"_blank",children:"Help + Documentation (dummy link)"})}),Object(b.jsx)("li",{children:Object(b.jsx)("a",{href:"https://github.com/gaswirth/rhdwp-calendario",rel:"noreferrer",target:"_blank",children:"Support (dummy link)"})})]}),Object(b.jsx)("a",{className:"rhdLogo",href:"https://roundhouse-designs.com",target:"_blank",rel:"noreferrer",children:Object(b.jsx)("img",{src:"".concat(e,"rhd-logo.png"),alt:"Roundhouse Designs logo"})})]}))]})})}var Ie=n(189),Ue=n(190),Ae=n(191),Me=n(192),Le=n(193);n(174);function Ge(){var e=Object(c.useReducer)(Y,W),t=Object(d.a)(e,2),n=t[0],a=t[1],s=Object(c.useReducer)(se,ae),r=Object(d.a)(s,2),o=r[0],j=r[1],O=Object(c.useReducer)(A,I),v=Object(d.a)(O,2),m=v[0],_=v[1],g=Object(c.useReducer)(ie,oe),E=Object(d.a)(g,2),y=E[0],w=E[1],S=function(e,t){var n=Object(c.useState)((function(){var n=window.localStorage.getItem(t);return null!==n?JSON.parse(n):e})),a=Object(d.a)(n,2),s=a[0],r=a[1];return Object(c.useEffect)((function(){window.localStorage.setItem(t,JSON.stringify(s))}),[t,s]),[s,r]}({viewMode:"calendar"},"viewOptions"),R=Object(d.a)(S,2),C=R[0],D=R[1],P=Object(c.useRef)(),U=Object(c.useRef)(),M=f.routeBase,L=f.user,G=f.nonce;Object(c.useEffect)((function(){_({type:"UPDATE",viewMode:C.viewMode})}),[]),Object(c.useEffect)((function(){D({viewMode:m.viewMode})}),[D,m.viewMode]),Object(c.useEffect)((function(){var e=y.post,t=y.newIndex;if(!0===y.updateNow&&"undefined"!==e.id){w({type:"UPDATING"});var n="".concat(M,"/posts/update/").concat(e.id,"/").concat(L),c={"Content-Type":"application/json"};c["X-WP-Nonce"]=G;var a={params:N(y.params,e),unscheduled:y.unscheduled};null!==t&&(a.newIndex=t),function(){var e=Object(u.a)(i.a.mark((function e(){var t;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch(n,{method:"POST",headers:c,body:JSON.stringify(a)});case 3:return t=e.sent,e.next=6,t.json();case 6:j({type:"END"}),w({type:"COMPLETE"}),e.next=13;break;case 10:e.prev=10,e.t0=e.catch(0),console.log(e.t0.message);case 13:case"end":return e.stop()}}),e,null,[[0,10]])})));return function(){return e.apply(this,arguments)}}()()}}),[M,L,G,y,o,j,a]);var F=function(e){return"unscheduled"===e?n.unscheduled:n.scheduled[e]};return Object(b.jsx)("div",{className:"calendario",children:Object(b.jsx)(k.Provider,{value:{viewOptions:m,viewOptionsDispatch:_},children:Object(b.jsxs)(J.Provider,{value:{posts:n,postsDispatch:a},children:[Object(b.jsx)($,{handleTodayClick:function(){var e,t,n,c=new Date;e=c,t=m.viewRange.start,n=m.viewRange.end,e.getTime()>=t.getTime()&&e.getTime()<=n.getTime()?U.current.scroll({top:P.current.offsetTop,behavior:"smooth"}):_({type:"SET_RANGE_START",date:c})}}),Object(b.jsx)(ce.Provider,{value:{draggedPost:o,draggedPostDispatch:j},children:Object(b.jsxs)(le.a,{onDragEnd:function(e){var t=e.source,c=e.destination,s=o.post;if(c){var r,i,u="unscheduled"===c.droppableId;if(!0===u)i=Object(h.a)(s.post_date,x);else{r=Object(Ie.a)(c.droppableId);var b={h:Object(Ue.a)(s.post_date),m:Object(Ae.a)(s.post_date)};r=Object(Me.a)(r,b.h),r=Object(Le.a)(r,b.m),i=Object(h.a)(r,x)}if(u&&t.droppableId===c.droppableId){var O=function(e,t,n){var c=Array.from(e),a=c.splice(t,1),s=Object(d.a)(a,1)[0];return c.splice(n,0,s),c}(F(t.droppableId),t.index,c.index);a({type:"SET_UNSCHEDULED",posts:O})}else if(t.droppableId!==c.droppableId){var f=function(e,t,n,c){var a,s=Array.from(e),r=Object(p.isEmpty)(t)?[]:Array.from(t),o=s.splice(n.index,1),i=Object(d.a)(o,1)[0];return r.splice(c.index,0,i),a={},Object(l.a)(a,n.droppableId,s),Object(l.a)(a,c.droppableId,r),Object(l.a)(a,"sourceId",n.droppableId),Object(l.a)(a,"destinationId",c.droppableId),a}(F(t.droppableId),F(c.droppableId),t,c);a({type:"MOVE",source:f[t.droppableId],destination:f[c.droppableId],sourceId:f.sourceId,destinationId:f.destinationId})}w({type:"UPDATE",post:s,unscheduled:u,params:{post_date:i},newIndex:u?c.index:null}),n.currentPost.id===s.id&&a({type:"UPDATE_CURRENTPOST_FIELD",field:"post_date",value:r}),j({type:"END"})}},onDragStart:function(e){var t=T(e),c=(!0===t?n.unscheduled:n.scheduled[e.source.droppableId]).find((function(t){return Number(e.draggableId)===Number(t.id)})),a=!!T(e)&&e.source.draggableId;j({type:"START",post:c,draggingUnscheduled:t,currentIndex:a})},onDragUpdate:function(e){if(null!==e.destination){var t=function(e){return"unscheduled"===e.destination.droppableId}(e);!0===t&&!1===o.overUnscheduled?j({type:"DRAGGING_OVER_UNSCHEDULED",draggedOver:e.destination.index}):!1===t&&!0===o.overUnscheduled&&j({type:"DRAGGING_OVER_CALENDAR"})}},children:[Object(b.jsx)(ke,{}),Object(b.jsx)(we,{ref:U,todayRef:P})]})})]})})})}var Fe,He=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,195)).then((function(t){var n=t.getCLS,c=t.getFID,a=t.getFCP,s=t.getLCP,r=t.getTTFB;n(e),c(e),a(e),s(e),r(e)}))},Ve=(window.rhdReactPlugin||{}).appSelector;(Fe=document.querySelector(Ve))&&r.a.render(Object(b.jsx)(a.a.StrictMode,{children:Object(b.jsx)(Ge,{})}),Fe),He()},81:function(e,t,n){}},[[175,1,2]]]);
//# sourceMappingURL=main.be9ed9c0.chunk.js.map