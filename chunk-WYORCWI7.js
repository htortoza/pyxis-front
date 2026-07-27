import{$ as Cn,$a as Jt,A as yn,Aa as At,Ba as Qt,C as ii,Ca as Yt,Da as v,E as oi,Ea as Ee,F as Ut,G as Vt,H as bn,Ha as Kt,I as qt,Ia as Fe,J as vn,Ja as Zt,K as Ot,Ka as fi,L as ri,La as wt,M as ai,Ma as gi,N as Ze,Na as Xt,Oa as st,Pa as Ft,Qa as ke,R as Ue,Ra as _i,S as ze,Ta as yi,U as si,V as li,W as ft,Wa as bi,Ya as vi,_ as ci,_a as Ci,a as gn,aa as Wt,ab as lt,b as at,c as Gt,ca as gt,d as Ie,e as Ke,ea as xn,f as ue,fa as di,g as ne,ga as Xe,h as Le,ha as pi,ia as wn,ja as Re,ka as ui,ma as xt,o as Jn,p as ei,pa as ce,qa as ae,ra as Je,ta as mi,u as _n,ua as te,v as ti,w as vt,wa as X,x as Ct,xa as le,y as $t,ya as hi,z as ni,za as In}from"./chunk-AV3V65LQ.js";import{$a as Te,Ab as B,Bb as V,Cb as Oe,Db as w,Eb as Qe,Fb as l,Gb as he,Ha as Un,Hb as se,Ia as qn,Ib as fe,Jb as Ae,Ka as Wn,Kb as _,L as We,La as c,Lb as y,M as $,N as Ce,Ob as we,P as L,Pb as yt,Qb as Ne,R as b,Rb as ge,Sb as h,Ta as hn,Tb as ee,Ua as de,Ub as ye,Vb as Ye,W as f,X as g,Y as F,Yb as nt,Z as mt,Za as E,Zb as it,_a as xe,_b as ot,a as P,ac as j,b as ve,bb as J,bc as bt,ca as S,cb as M,cc as Q,da as je,db as p,dc as rt,ec as Zn,fb as Qn,g as Rn,ha as U,ic as pe,ja as Dt,jb as x,k as Hn,ka as $n,kb as Yn,la as I,lb as Kn,lc as ht,mb as q,mc as A,na as mn,nb as W,ob as fn,p as jn,pb as Ge,qb as $e,qc as k,rb as s,sb as d,sc as Be,tb as u,tc as Xn,ub as N,v as Gn,vb as Z,wb as oe,xb as me,xc as C,yb as R,yc as Se,zb as H}from"./chunk-NVGDBBTU.js";var xi=`
    .p-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: dt('toolbar.padding');
        background: dt('toolbar.background');
        border: 1px solid dt('toolbar.border.color');
        color: dt('toolbar.color');
        border-radius: dt('toolbar.border.radius');
        gap: dt('toolbar.gap');
    }

    .p-toolbar-start,
    .p-toolbar-center,
    .p-toolbar-end {
        display: flex;
        align-items: center;
    }
`;var wr=["start"],Ir=["end"],Tr=["center"],Sr=["*"];function kr(t,o){t&1&&B(0)}function Mr(t,o){if(t&1&&(d(0,"div",1),p(1,kr,1,0,"ng-container",2),u()),t&2){let e=l();h(e.cx("start")),s("pBind",e.ptm("start")),c(),s("ngTemplateOutlet",e.startTemplate||e._startTemplate)}}function Er(t,o){t&1&&B(0)}function Dr(t,o){if(t&1&&(d(0,"div",1),p(1,Er,1,0,"ng-container",2),u()),t&2){let e=l();h(e.cx("center")),s("pBind",e.ptm("center")),c(),s("ngTemplateOutlet",e.centerTemplate||e._centerTemplate)}}function Vr(t,o){t&1&&B(0)}function Or(t,o){if(t&1&&(d(0,"div",1),p(1,Vr,1,0,"ng-container",2),u()),t&2){let e=l();h(e.cx("end")),s("pBind",e.ptm("end")),c(),s("ngTemplateOutlet",e.endTemplate||e._endTemplate)}}var Ar={root:()=>["p-toolbar p-component"],start:"p-toolbar-start",center:"p-toolbar-center",end:"p-toolbar-end"},wi=(()=>{class t extends te{name="toolbar";style=xi;classes=Ar;static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275prov=$({token:t,factory:t.\u0275fac})}return t})();var Ii=new L("TOOLBAR_INSTANCE"),Ti=(()=>{class t extends le{componentName="Toolbar";$pcToolbar=b(Ii,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=b(v,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}styleClass;ariaLabelledBy;_componentStyle=b(wi);getBlockableElement(){return this.el.nativeElement.children[0]}startTemplate;endTemplate;centerTemplate;templates;_startTemplate;_endTemplate;_centerTemplate;onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"start":case"left":this._startTemplate=e.template;break;case"end":case"right":this._endTemplate=e.template;break;case"center":this._centerTemplate=e.template;break}})}static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275cmp=E({type:t,selectors:[["p-toolbar"]],contentQueries:function(n,i,r){if(n&1&&fe(r,wr,4)(r,Ir,4)(r,Tr,4)(r,ce,4),n&2){let a;_(a=y())&&(i.startTemplate=a.first),_(a=y())&&(i.endTemplate=a.first),_(a=y())&&(i.centerTemplate=a.first),_(a=y())&&(i.templates=a)}},hostAttrs:["role","toolbar"],hostVars:3,hostBindings:function(n,i){n&2&&(x("aria-labelledby",i.ariaLabelledBy),h(i.cn(i.cx("root"),i.styleClass)))},inputs:{styleClass:"styleClass",ariaLabelledBy:"ariaLabelledBy"},features:[j([wi,{provide:Ii,useExisting:t},{provide:X,useExisting:t}]),J([v]),M],ngContentSelectors:Sr,decls:4,vars:3,consts:[[3,"class","pBind",4,"ngIf"],[3,"pBind"],[4,"ngTemplateOutlet"]],template:function(n,i){n&1&&(he(),se(0),p(1,Mr,2,4,"div",0)(2,Dr,2,4,"div",0)(3,Or,2,4,"div",0)),n&2&&(c(),s("ngIf",i.startTemplate||i._startTemplate),c(),s("ngIf",i.centerTemplate||i._centerTemplate),c(),s("ngIf",i.endTemplate||i._endTemplate))},dependencies:[ne,Ie,ue,ae,Ee,v],encapsulation:2,changeDetection:0})}return t})();var Fr=[[["","chips",""]],[["","actions",""]],[["","filters-trigger",""]]],Pr=["[chips]","[actions]","[filters-trigger]"],Nr=t=>({exact:t}),Br=(t,o)=>o.route;function Lr(t,o){t&1&&(d(0,"div",5),N(1,"img",6),se(2,2),u())}function zr(t,o){if(t&1&&(d(0,"a",8),ee(1),u()),t&2){let e=o.$implicit;s("routerLink",e.route)("routerLinkActiveOptions",Q(3,Nr,e.exact??!1)),c(),Ye(" ",e.label," ")}}function Rr(t,o){if(t&1){let e=V();d(0,"nav",7),Ge(1,zr,2,5,"a",8,Br),u(),d(3,"button",9),w("click",function(){f(e);let i=l();return g(i.mobileNav.toggle())}),F(),d(4,"svg",10),N(5,"line",11)(6,"line",12)(7,"line",13),u()()}if(t&2){let e=l();c(),$e(e.tabs())}}var Si=class t{mobileNav=b(yi);tabs=k([]);static \u0275fac=function(e){return new(e||t)};static \u0275cmp=E({type:t,selectors:[["app-global-header"]],inputs:{tabs:[1,"tabs"]},ngContentSelectors:Pr,decls:7,vars:0,consts:[[1,"global-header-toolbar"],["pTemplate","start"],["pTemplate","end"],[1,"global-header-chips-scroll"],[1,"global-header-actions-sticky"],[1,"global-header-start"],["src","constellation-icon.svg","alt","Pyxis",1,"global-header-mobile-logo"],[1,"global-header-tabs"],["routerLinkActive","is-active",1,"global-header-nav-link",3,"routerLink","routerLinkActiveOptions"],["type","button","aria-label","Abrir men\xFA",1,"global-header-burger",3,"click"],["width","20","height","20","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round"],["x1","3","y1","6","x2","21","y2","6"],["x1","3","y1","12","x2","21","y2","12"],["x1","3","y1","18","x2","21","y2","18"]],template:function(e,n){e&1&&(he(Fr),d(0,"p-toolbar",0),p(1,Lr,3,0,"ng-template",1)(2,Rr,8,0,"ng-template",2),u(),d(3,"div",3),se(4),d(5,"div",4),se(6,1),u()())},dependencies:[Ti,ce,Jn,ei],styles:["[_nghost-%COMP%]{display:block;position:sticky;top:0;z-index:10;box-shadow:0 1px 3px #00000014,0 1px 2px -1px #0000000f}.global-header-toolbar[_ngcontent-%COMP%]{border:none;border-radius:0;background:var(--p-surface-0);padding:.875rem 1.5rem}.global-header-start[_ngcontent-%COMP%]{display:flex;align-items:center;gap:1.25rem}.global-header-tabs[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.25rem}.global-header-nav-link[_ngcontent-%COMP%]{padding:.375rem .75rem;border-radius:var(--p-border-radius-md);color:var(--p-text-muted-color);font-weight:600;font-size:.875rem;text-decoration:none;transition:background .15s ease,color .15s ease}.global-header-nav-link[_ngcontent-%COMP%]:hover{background:var(--p-surface-100);color:var(--p-text-color)}.global-header-nav-link.is-active[_ngcontent-%COMP%]{background:var(--p-primary-color);color:var(--p-primary-contrast-color)}.global-header-chips-scroll[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.375rem;padding:.375rem 1.5rem;background:var(--p-surface-0);border-top:1px solid var(--p-content-border-color);overflow-x:auto}.global-header-actions-sticky[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.25rem;position:sticky;right:0;flex-shrink:0;margin-left:auto;padding-left:.75rem;background:var(--p-surface-0)}.global-header-mobile-logo[_ngcontent-%COMP%]{display:none;height:24px;width:auto}.global-header-burger[_ngcontent-%COMP%]{display:none;align-items:center;justify-content:center;width:2.25rem;height:2.25rem;margin-left:.5rem;border:1px solid var(--p-content-border-color);border-radius:var(--p-border-radius-md);background:var(--p-surface-0);color:var(--p-text-color);cursor:pointer}.global-header-burger[_ngcontent-%COMP%]:hover{background:var(--p-surface-100)}@media(max-width:900px){.global-header-mobile-logo[_ngcontent-%COMP%]{display:block}.global-header-burger[_ngcontent-%COMP%]{display:flex}.global-header-toolbar[_ngcontent-%COMP%]{padding:.5rem 1rem;position:relative}.global-header-tabs[_ngcontent-%COMP%]{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);gap:0;max-width:calc(100vw - 7rem)}.global-header-nav-link[_ngcontent-%COMP%]{padding:.25rem .375rem;font-size:.6875rem;white-space:nowrap}.global-header-chips-scroll[_ngcontent-%COMP%]{padding:.25rem 1rem}}"],changeDetection:0})};function Hr(t){let o=t.getUTCFullYear(),e=String(t.getUTCMonth()+1).padStart(2,"0"),n=String(t.getUTCDate()).padStart(2,"0");return`${o}-${e}-${n}`}function en(t){return new Date(`${t}T00:00:00Z`)}function Ve(t,o){let e=en(t);return e.setUTCDate(e.getUTCDate()+o),Hr(e)}function jr(t){return en(t).getUTCDay()}function ki(t,o){return Math.round((en(o).getTime()-en(t).getTime())/864e5)}function Tn(t,o){return new Date(Date.UTC(t,o,0)).getUTCDate()}function Mi(t,o){let e=`${t}-${String(o).padStart(2,"0")}-01`,n=(jr(e)+6)%7,i=Tn(t,o),r=(7-(n+i)%7)%7,a=n+i+r,m=[],T=Ve(e,-n);for(let D=0;D<a;D++)m.push({iso:T,inMonth:Number(T.slice(5,7))===o}),T=Ve(T,1);let O=[];for(let D=0;D<m.length;D+=7)O.push(m.slice(D,D+7));return O}var Ei="2024-01-01",Di="2026-12-31",Gr=2024,$r=2026,Nt=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];function kn(t){let[o,e,n]=t.split("-").map(Number);return{year:o,month:e,day:n}}function Sn(t){let{month:o,day:e}=kn(t);return`${e} de ${Nt[o-1]}`}function Ur(){let t=[],o=Ei,e=1;for(;o<=Di;){let{year:n,month:i}=kn(o);t.push({id:o,label:Sn(o),granularity:"dia",year:n,month:i,order:e,startDate:o,endDate:o}),e++,o=Ve(o,1)}return t}function qr(){let t=[],o=Ei,e=1;for(;Ve(o,6)<=Di;){let n=Ve(o,6),{year:i,month:r}=kn(o);t.push({id:`week-${o}`,label:`Semana del ${Sn(o)} al ${Sn(n)}`,granularity:"semana",year:i,month:r,order:e,startDate:o,endDate:n}),e++,o=Ve(o,7)}return t}function Wr(){let t=[];for(let o=Gr;o<=$r;o++)for(let e=1;e<=12;e++){let n=`${o}-${String(e).padStart(2,"0")}`,i=String(Tn(o,e)).padStart(2,"0");t.push({id:n,label:Nt[e-1],granularity:"mes",year:o,month:e,order:o*12+e,startDate:`${n}-01`,endDate:`${n}-${i}`})}return t}var ct=Ur(),Vi=qr(),dt=Wr(),Eu={dia:ct,semana:Vi,mes:dt},Du=dt,Vu=["2026-05","2026-06","2026-07"],Ou="mes",Oi=(()=>{let t=new Map;for(let o of Vi){let e=o.startDate;for(;e<=o.endDate;)t.set(e,o.id),e=Ve(e,1)}return t})();var pt=["XS","S","M","L","XL","XXL","3XL"],Ai=["Blanco","Negro","Azul Marino","Gris Melange","Rojo","Verde Oliva","Beige","Celeste","Caf\xE9","Amarillo"],tn=["37","38","39","40","41","42","43"],Qr=["2 a\xF1os","4 a\xF1os","6 a\xF1os","8 a\xF1os","10 a\xF1os","12 a\xF1os"],Yr=["28","30","32","34","36"],Kr=["S","M","L"],Zr=["Est\xE1ndar","Premium","Edici\xF3n Limitada"],Fi=["Chico","Mediano","Grande"],Xr=[{categoryId:"cat-vestuario",categoryName:"Vestuario",subcategoryId:"sub-camisas",subcategoryName:"Camisas",bases:["Camisa Slim Fit Azul","Camisa Slim Fit Blanca","Camisa Oxford Celeste","Camisa Cuadros Rojo","Camisa Lino Beige"],variants:pt,count:35},{categoryId:"cat-vestuario",categoryName:"Vestuario",subcategoryId:"sub-jeans",subcategoryName:"Jeans",bases:["Jean Skinny Negro","Jean Recto Azul","Jean Mom Fit","Jean Slim Gris"],variants:pt,count:28},{categoryId:"cat-vestuario",categoryName:"Vestuario",subcategoryId:"sub-vestidos",subcategoryName:"Vestidos",bases:["Vestido Casual Floral","Vestido Midi Negro","Vestido Lino Beige","Vestido Sat\xE9n Rojo"],variants:pt,count:26},{categoryId:"cat-vestuario",categoryName:"Vestuario",subcategoryId:"sub-blazers",subcategoryName:"Blazers",bases:["Blazer Formal Gris","Blazer Cruzado Azul Marino","Blazer Lino Beige"],variants:pt,count:20},{categoryId:"cat-vestuario",categoryName:"Vestuario",subcategoryId:"sub-poleras",subcategoryName:"Poleras",bases:["Polera B\xE1sica Algod\xF3n","Polera Estampada","Polera Cuello V","Polera Oversize"],variants:Ai,count:38},{categoryId:"cat-vestuario",categoryName:"Vestuario",subcategoryId:"sub-chaquetas",subcategoryName:"Chaquetas",bases:["Chaqueta Cortavientos","Chaqueta de Cuero","Parka Invierno","Chaqueta Denim"],variants:pt,count:26},{categoryId:"cat-vestuario",categoryName:"Vestuario",subcategoryId:"sub-shorts",subcategoryName:"Shorts",bases:["Short Deportivo","Short Jean","Bermuda Chino"],variants:pt,count:18},{categoryId:"cat-vestuario",categoryName:"Vestuario",subcategoryId:"sub-faldas",subcategoryName:"Faldas",bases:["Falda Plisada","Falda L\xE1piz","Falda Denim"],variants:pt,count:15},{categoryId:"cat-calzado",categoryName:"Calzado",subcategoryId:"sub-running",subcategoryName:"Running",bases:["Zapatilla Running Pro","Zapatilla Running Lite","Zapatilla Trail"],variants:tn,count:20},{categoryId:"cat-calzado",categoryName:"Calzado",subcategoryId:"sub-casual",subcategoryName:"Casual",bases:["Zapatilla Urbana","Zapatilla Lona","N\xE1utico Cuero","Slip-On"],variants:tn,count:26},{categoryId:"cat-calzado",categoryName:"Calzado",subcategoryId:"sub-formal",subcategoryName:"Formal",bases:["Zapato Oxford Cuero","Zapato Derby Negro","Mocas\xEDn Caf\xE9"],variants:tn,count:18},{categoryId:"cat-calzado",categoryName:"Calzado",subcategoryId:"sub-botas",subcategoryName:"Botas",bases:["Bota Chelsea","Bota Trekking","Bota de Cuero"],variants:tn,count:15},{categoryId:"cat-accesorios",categoryName:"Accesorios",subcategoryId:"sub-cinturones",subcategoryName:"Cinturones",bases:["Cintur\xF3n Cuero Caf\xE9","Cintur\xF3n Cuero Negro","Cintur\xF3n Reversible"],variants:Kr,count:9},{categoryId:"cat-accesorios",categoryName:"Accesorios",subcategoryId:"sub-bufandas-gorros",subcategoryName:"Bufandas y Gorros",bases:["Bufanda Lana","Bufanda Seda","Gorro de Lana","Gorro Trucker"],variants:Ai,count:30},{categoryId:"cat-accesorios",categoryName:"Accesorios",subcategoryId:"sub-relojes-lentes",subcategoryName:"Relojes y Lentes",bases:["Reloj An\xE1logo Acero","Reloj Digital Deportivo","Lentes de Sol Aviador","Lentes de Sol Redondos"],variants:Zr,count:12},{categoryId:"cat-accesorios",categoryName:"Accesorios",subcategoryId:"sub-bolsos-mochilas",subcategoryName:"Bolsos y Mochilas",bases:["Mochila Urbana","Bolso Bandolera","Cartera de Mano","Billetera Cuero"],variants:Fi,count:12},{categoryId:"cat-deportivo",categoryName:"Deportivo",subcategoryId:"sub-training",subcategoryName:"Training",bases:["Poler\xF3n Training","Calza Deportiva","Top Deportivo","Chaqueta Running","Short Training"],variants:pt,count:35},{categoryId:"cat-deportivo",categoryName:"Deportivo",subcategoryId:"sub-accesorios-deportivos",subcategoryName:"Accesorios Deportivos",bases:["Banda para el Pelo","Guantes de Entrenamiento","Botella Deportiva","Mochila Gym"],variants:Fi,count:12},{categoryId:"cat-ninos",categoryName:"Ni\xF1os",subcategoryId:"sub-ropa-infantil",subcategoryName:"Ropa Infantil",bases:["Polera Infantil Estampada","Pantal\xF3n Infantil","Vestido Infantil Floral","Poler\xF3n Infantil"],variants:Qr,count:24},{categoryId:"cat-ninos",categoryName:"Ni\xF1os",subcategoryId:"sub-calzado-infantil",subcategoryName:"Calzado Infantil",bases:["Zapatilla Infantil","Sandalia Infantil"],variants:Yr,count:10}];function Jr(t){let o=[],e=0;for(let n of t.variants)for(let i of t.bases){if(e>=t.count)return o;e++,o.push({id:`prod-gen-${t.subcategoryId}-${e}`,name:`${i} ${n}`,categoryId:t.categoryId,categoryName:t.categoryName,subcategoryId:t.subcategoryId,subcategoryName:t.subcategoryName})}return o}var Mn=Xr.flatMap(Jr);var ji=(()=>{class t{_renderer;_elementRef;onChange=e=>{};onTouched=()=>{};constructor(e,n){this._renderer=e,this._elementRef=n}setProperty(e,n){this._renderer.setProperty(this._elementRef.nativeElement,e,n)}registerOnTouched(e){this.onTouched=e}registerOnChange(e){this.onChange=e}setDisabledState(e){this.setProperty("disabled",e)}static \u0275fac=function(n){return new(n||t)(de(hn),de(mn))};static \u0275dir=Te({type:t})}return t})(),ea=(()=>{class t extends ji{static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275dir=Te({type:t,features:[M]})}return t})(),ut=new L("");var ta={provide:ut,useExisting:We(()=>Gi),multi:!0};function na(){let t=gn()?gn().getUserAgent():"";return/android (\d+)/.test(t.toLowerCase())}var ia=new L(""),Gi=(()=>{class t extends ji{_compositionMode;_composing=!1;constructor(e,n,i){super(e,n),this._compositionMode=i,this._compositionMode==null&&(this._compositionMode=!na())}writeValue(e){let n=e??"";this.setProperty("value",n)}_handleInput(e){(!this._compositionMode||this._compositionMode&&!this._composing)&&this.onChange(e)}_compositionStart(){this._composing=!0}_compositionEnd(e){this._composing=!1,this._compositionMode&&this.onChange(e)}static \u0275fac=function(n){return new(n||t)(de(hn),de(mn),de(ia,8))};static \u0275dir=Te({type:t,selectors:[["input","formControlName","",3,"type","checkbox"],["textarea","formControlName",""],["input","formControl","",3,"type","checkbox"],["textarea","formControl",""],["input","ngModel","",3,"type","checkbox"],["textarea","ngModel",""],["","ngDefaultControl",""]],hostBindings:function(n,i){n&1&&w("input",function(a){return i._handleInput(a.target.value)})("blur",function(){return i.onTouched()})("compositionstart",function(){return i._compositionStart()})("compositionend",function(a){return i._compositionEnd(a.target.value)})},standalone:!1,features:[j([ta]),M]})}return t})();var oa=new L(""),ra=new L("");function $i(t){return t!=null}function Ui(t){return Qn(t)?Hn(t):t}function qi(t){let o={};return t.forEach(e=>{o=e!=null?P(P({},o),e):o}),Object.keys(o).length===0?null:o}function Wi(t,o){return o.map(e=>e(t))}function aa(t){return!t.validate}function Qi(t){return t.map(o=>aa(o)?o:e=>o.validate(e))}function sa(t){if(!t)return null;let o=t.filter($i);return o.length==0?null:function(e){return qi(Wi(e,o))}}function Yi(t){return t!=null?sa(Qi(t)):null}function la(t){if(!t)return null;let o=t.filter($i);return o.length==0?null:function(e){let n=Wi(e,o).map(Ui);return Gn(n).pipe(jn(qi))}}function Ki(t){return t!=null?la(Qi(t)):null}function Pi(t,o){return t===null?[o]:Array.isArray(t)?[...t,o]:[t,o]}function ca(t){return t._rawValidators}function da(t){return t._rawAsyncValidators}function En(t){return t?Array.isArray(t)?t:[t]:[]}function on(t,o){return Array.isArray(t)?t.includes(o):t===o}function Ni(t,o){let e=En(o);return En(t).forEach(i=>{on(e,i)||e.push(i)}),e}function Bi(t,o){return En(o).filter(e=>!on(t,e))}var rn=class{get value(){return this.control?this.control.value:null}get valid(){return this.control?this.control.valid:null}get invalid(){return this.control?this.control.invalid:null}get pending(){return this.control?this.control.pending:null}get disabled(){return this.control?this.control.disabled:null}get enabled(){return this.control?this.control.enabled:null}get errors(){return this.control?this.control.errors:null}get pristine(){return this.control?this.control.pristine:null}get dirty(){return this.control?this.control.dirty:null}get touched(){return this.control?this.control.touched:null}get status(){return this.control?this.control.status:null}get untouched(){return this.control?this.control.untouched:null}get statusChanges(){return this.control?this.control.statusChanges:null}get valueChanges(){return this.control?this.control.valueChanges:null}get path(){return null}_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators=[];_rawAsyncValidators=[];_setValidators(o){this._rawValidators=o||[],this._composedValidatorFn=Yi(this._rawValidators)}_setAsyncValidators(o){this._rawAsyncValidators=o||[],this._composedAsyncValidatorFn=Ki(this._rawAsyncValidators)}get validator(){return this._composedValidatorFn||null}get asyncValidator(){return this._composedAsyncValidatorFn||null}_onDestroyCallbacks=[];_registerOnDestroy(o){this._onDestroyCallbacks.push(o)}_invokeOnDestroyCallbacks(){this._onDestroyCallbacks.forEach(o=>o()),this._onDestroyCallbacks=[]}reset(o=void 0){this.control?.reset(o)}hasError(o,e){return this.control?this.control.hasError(o,e):!1}getError(o,e){return this.control?this.control.getError(o,e):null}},Dn=class extends rn{name;get formDirective(){return null}get path(){return null}},tt=class extends rn{_parent=null;name=null;valueAccessor=null},Vn=class{_cd;constructor(o){this._cd=o}get isTouched(){return this._cd?.control?._touched?.(),!!this._cd?.control?.touched}get isUntouched(){return!!this._cd?.control?.untouched}get isPristine(){return this._cd?.control?._pristine?.(),!!this._cd?.control?.pristine}get isDirty(){return!!this._cd?.control?.dirty}get isValid(){return this._cd?.control?._status?.(),!!this._cd?.control?.valid}get isInvalid(){return!!this._cd?.control?.invalid}get isPending(){return!!this._cd?.control?.pending}get isSubmitted(){return this._cd?._submitted?.(),!!this._cd?.submitted}};var Zi=(()=>{class t extends Vn{constructor(e){super(e)}static \u0275fac=function(n){return new(n||t)(de(tt,2))};static \u0275dir=Te({type:t,selectors:[["","formControlName",""],["","ngModel",""],["","formControl",""]],hostVars:14,hostBindings:function(n,i){n&2&&Ne("ng-untouched",i.isUntouched)("ng-touched",i.isTouched)("ng-pristine",i.isPristine)("ng-dirty",i.isDirty)("ng-valid",i.isValid)("ng-invalid",i.isInvalid)("ng-pending",i.isPending)},standalone:!1,features:[M]})}return t})();var Bt="VALID",nn="INVALID",It="PENDING",Lt="DISABLED",_t=class{},an=class extends _t{value;source;constructor(o,e){super(),this.value=o,this.source=e}},zt=class extends _t{pristine;source;constructor(o,e){super(),this.pristine=o,this.source=e}},Rt=class extends _t{touched;source;constructor(o,e){super(),this.touched=o,this.source=e}},Tt=class extends _t{status;source;constructor(o,e){super(),this.status=o,this.source=e}};var On=class extends _t{source;constructor(o){super(),this.source=o}};function pa(t){return(sn(t)?t.validators:t)||null}function ua(t){return Array.isArray(t)?Yi(t):t||null}function ma(t,o){return(sn(o)?o.asyncValidators:t)||null}function ha(t){return Array.isArray(t)?Ki(t):t||null}function sn(t){return t!=null&&!Array.isArray(t)&&typeof t=="object"}var An=class{_pendingDirty=!1;_hasOwnPendingAsyncValidator=null;_pendingTouched=!1;_onCollectionChange=()=>{};_updateOn;_parent=null;_asyncValidationSubscription;_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators;_rawAsyncValidators;value;constructor(o,e){this._assignValidators(o),this._assignAsyncValidators(e)}get validator(){return this._composedValidatorFn}set validator(o){this._rawValidators=this._composedValidatorFn=o}get asyncValidator(){return this._composedAsyncValidatorFn}set asyncValidator(o){this._rawAsyncValidators=this._composedAsyncValidatorFn=o}get parent(){return this._parent}get status(){return ht(this.statusReactive)}set status(o){ht(()=>this.statusReactive.set(o))}_status=A(()=>this.statusReactive());statusReactive=U(void 0);get valid(){return this.status===Bt}get invalid(){return this.status===nn}get pending(){return this.status===It}get disabled(){return this.status===Lt}get enabled(){return this.status!==Lt}errors;get pristine(){return ht(this.pristineReactive)}set pristine(o){ht(()=>this.pristineReactive.set(o))}_pristine=A(()=>this.pristineReactive());pristineReactive=U(!0);get dirty(){return!this.pristine}get touched(){return ht(this.touchedReactive)}set touched(o){ht(()=>this.touchedReactive.set(o))}_touched=A(()=>this.touchedReactive());touchedReactive=U(!1);get untouched(){return!this.touched}_events=new Rn;events=this._events.asObservable();valueChanges;statusChanges;get updateOn(){return this._updateOn?this._updateOn:this.parent?this.parent.updateOn:"change"}setValidators(o){this._assignValidators(o)}setAsyncValidators(o){this._assignAsyncValidators(o)}addValidators(o){this.setValidators(Ni(o,this._rawValidators))}addAsyncValidators(o){this.setAsyncValidators(Ni(o,this._rawAsyncValidators))}removeValidators(o){this.setValidators(Bi(o,this._rawValidators))}removeAsyncValidators(o){this.setAsyncValidators(Bi(o,this._rawAsyncValidators))}hasValidator(o){return on(this._rawValidators,o)}hasAsyncValidator(o){return on(this._rawAsyncValidators,o)}clearValidators(){this.validator=null}clearAsyncValidators(){this.asyncValidator=null}markAsTouched(o={}){let e=this.touched===!1;this.touched=!0;let n=o.sourceControl??this;o.onlySelf||this._parent?.markAsTouched(ve(P({},o),{sourceControl:n})),e&&o.emitEvent!==!1&&this._events.next(new Rt(!0,n))}markAllAsDirty(o={}){this.markAsDirty({onlySelf:!0,emitEvent:o.emitEvent,sourceControl:this}),this._forEachChild(e=>e.markAllAsDirty(o))}markAllAsTouched(o={}){this.markAsTouched({onlySelf:!0,emitEvent:o.emitEvent,sourceControl:this}),this._forEachChild(e=>e.markAllAsTouched(o))}markAsUntouched(o={}){let e=this.touched===!0;this.touched=!1,this._pendingTouched=!1;let n=o.sourceControl??this;this._forEachChild(i=>{i.markAsUntouched({onlySelf:!0,emitEvent:o.emitEvent,sourceControl:n})}),o.onlySelf||this._parent?._updateTouched(o,n),e&&o.emitEvent!==!1&&this._events.next(new Rt(!1,n))}markAsDirty(o={}){let e=this.pristine===!0;this.pristine=!1;let n=o.sourceControl??this;o.onlySelf||this._parent?.markAsDirty(ve(P({},o),{sourceControl:n})),e&&o.emitEvent!==!1&&this._events.next(new zt(!1,n))}markAsPristine(o={}){let e=this.pristine===!1;this.pristine=!0,this._pendingDirty=!1;let n=o.sourceControl??this;this._forEachChild(i=>{i.markAsPristine({onlySelf:!0,emitEvent:o.emitEvent})}),o.onlySelf||this._parent?._updatePristine(o,n),e&&o.emitEvent!==!1&&this._events.next(new zt(!0,n))}markAsPending(o={}){this.status=It;let e=o.sourceControl??this;o.emitEvent!==!1&&(this._events.next(new Tt(this.status,e)),this.statusChanges.emit(this.status)),o.onlySelf||this._parent?.markAsPending(ve(P({},o),{sourceControl:e}))}disable(o={}){let e=this._parentMarkedDirty(o.onlySelf);this.status=Lt,this.errors=null,this._forEachChild(i=>{i.disable(ve(P({},o),{onlySelf:!0}))}),this._updateValue();let n=o.sourceControl??this;o.emitEvent!==!1&&(this._events.next(new an(this.value,n)),this._events.next(new Tt(this.status,n)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._updateAncestors(ve(P({},o),{skipPristineCheck:e}),this),this._onDisabledChange.forEach(i=>i(!0))}enable(o={}){let e=this._parentMarkedDirty(o.onlySelf);this.status=Bt,this._forEachChild(n=>{n.enable(ve(P({},o),{onlySelf:!0}))}),this.updateValueAndValidity({onlySelf:!0,emitEvent:o.emitEvent}),this._updateAncestors(ve(P({},o),{skipPristineCheck:e}),this),this._onDisabledChange.forEach(n=>n(!1))}_updateAncestors(o,e){o.onlySelf||(this._parent?.updateValueAndValidity(o),o.skipPristineCheck||this._parent?._updatePristine({},e),this._parent?._updateTouched({},e))}setParent(o){this._parent=o}getRawValue(){return this.value}updateValueAndValidity(o={}){if(this._setInitialStatus(),this._updateValue(),this.enabled){let n=this._cancelExistingSubscription();this.errors=this._runValidator(),this.status=this._calculateStatus(),(this.status===Bt||this.status===It)&&this._runAsyncValidator(n,o.emitEvent)}let e=o.sourceControl??this;o.emitEvent!==!1&&(this._events.next(new an(this.value,e)),this._events.next(new Tt(this.status,e)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),o.onlySelf||this._parent?.updateValueAndValidity(ve(P({},o),{sourceControl:e}))}_updateTreeValidity(o={emitEvent:!0}){this._forEachChild(e=>e._updateTreeValidity(o)),this.updateValueAndValidity({onlySelf:!0,emitEvent:o.emitEvent})}_setInitialStatus(){this.status=this._allControlsDisabled()?Lt:Bt}_runValidator(){return this.validator?this.validator(this):null}_runAsyncValidator(o,e){if(this.asyncValidator){this.status=It,this._hasOwnPendingAsyncValidator={emitEvent:e!==!1,shouldHaveEmitted:o!==!1};let n=Ui(this.asyncValidator(this));this._asyncValidationSubscription=n.subscribe(i=>{this._hasOwnPendingAsyncValidator=null,this.setErrors(i,{emitEvent:e,shouldHaveEmitted:o})})}}_cancelExistingSubscription(){if(this._asyncValidationSubscription){this._asyncValidationSubscription.unsubscribe();let o=(this._hasOwnPendingAsyncValidator?.emitEvent||this._hasOwnPendingAsyncValidator?.shouldHaveEmitted)??!1;return this._hasOwnPendingAsyncValidator=null,o}return!1}setErrors(o,e={}){this.errors=o,this._updateControlsErrors(e.emitEvent!==!1,this,e.shouldHaveEmitted)}get(o){let e=o;return e==null||(Array.isArray(e)||(e=e.split(".")),e.length===0)?null:e.reduce((n,i)=>n&&n._find(i),this)}getError(o,e){let n=e?this.get(e):this;return n?.errors?n.errors[o]:null}hasError(o,e){return!!this.getError(o,e)}get root(){let o=this;for(;o._parent;)o=o._parent;return o}_updateControlsErrors(o,e,n){this.status=this._calculateStatus(),o&&this.statusChanges.emit(this.status),(o||n)&&this._events.next(new Tt(this.status,e)),this._parent&&this._parent._updateControlsErrors(o,e,n)}_initObservables(){this.valueChanges=new S,this.statusChanges=new S}_calculateStatus(){return this._allControlsDisabled()?Lt:this.errors?nn:this._hasOwnPendingAsyncValidator||this._anyControlsHaveStatus(It)?It:this._anyControlsHaveStatus(nn)?nn:Bt}_anyControlsHaveStatus(o){return this._anyControls(e=>e.status===o)}_anyControlsDirty(){return this._anyControls(o=>o.dirty)}_anyControlsTouched(){return this._anyControls(o=>o.touched)}_updatePristine(o,e){let n=!this._anyControlsDirty(),i=this.pristine!==n;this.pristine=n,o.onlySelf||this._parent?._updatePristine(o,e),i&&this._events.next(new zt(this.pristine,e))}_updateTouched(o={},e){this.touched=this._anyControlsTouched(),this._events.next(new Rt(this.touched,e)),o.onlySelf||this._parent?._updateTouched(o,e)}_onDisabledChange=[];_registerOnCollectionChange(o){this._onCollectionChange=o}_setUpdateStrategy(o){sn(o)&&o.updateOn!=null&&(this._updateOn=o.updateOn)}_parentMarkedDirty(o){return!o&&!!this._parent?.dirty&&!this._parent._anyControlsDirty()}_find(o){return null}_assignValidators(o){this._rawValidators=Array.isArray(o)?o.slice():o,this._composedValidatorFn=ua(this._rawValidators)}_assignAsyncValidators(o){this._rawAsyncValidators=Array.isArray(o)?o.slice():o,this._composedAsyncValidatorFn=ha(this._rawAsyncValidators)}};var Xi=new L("",{factory:()=>Fn}),Fn="always";function fa(t,o){return[...o.path,t]}function ga(t,o,e=Fn){ya(t,o),o.valueAccessor.writeValue(t.value),(t.disabled||e==="always")&&o.valueAccessor.setDisabledState?.(t.disabled),ba(t,o),Ca(t,o),va(t,o),_a(t,o)}function Li(t,o){t.forEach(e=>{e.registerOnValidatorChange&&e.registerOnValidatorChange(o)})}function _a(t,o){if(o.valueAccessor.setDisabledState){let e=n=>{o.valueAccessor.setDisabledState(n)};t.registerOnDisabledChange(e),o._registerOnDestroy(()=>{t._unregisterOnDisabledChange(e)})}}function ya(t,o){let e=ca(t);o.validator!==null?t.setValidators(Pi(e,o.validator)):typeof e=="function"&&t.setValidators([e]);let n=da(t);o.asyncValidator!==null?t.setAsyncValidators(Pi(n,o.asyncValidator)):typeof n=="function"&&t.setAsyncValidators([n]);let i=()=>t.updateValueAndValidity();Li(o._rawValidators,i),Li(o._rawAsyncValidators,i)}function ba(t,o){o.valueAccessor.registerOnChange(e=>{t._pendingValue=e,t._pendingChange=!0,t._pendingDirty=!0,t.updateOn==="change"&&Ji(t,o)})}function va(t,o){o.valueAccessor.registerOnTouched(()=>{t._pendingTouched=!0,t.updateOn==="blur"&&t._pendingChange&&Ji(t,o),t.updateOn!=="submit"&&t.markAsTouched()})}function Ji(t,o){t._pendingDirty&&t.markAsDirty(),t.setValue(t._pendingValue,{emitModelToViewChange:!1}),o.viewToModelUpdate(t._pendingValue),t._pendingChange=!1}function Ca(t,o){let e=(n,i)=>{o.valueAccessor.writeValue(n),i&&o.viewToModelUpdate(n)};t.registerOnChange(e),o._registerOnDestroy(()=>{t._unregisterOnChange(e)})}function xa(t,o){if(!t.hasOwnProperty("model"))return!1;let e=t.model;return e.isFirstChange()?!0:!Object.is(o,e.currentValue)}function wa(t){return Object.getPrototypeOf(t.constructor)===ea}function Ia(t,o){if(!o)return null;Array.isArray(o);let e,n,i;return o.forEach(r=>{r.constructor===Gi?e=r:wa(r)?n=r:i=r}),i||n||e||null}function zi(t,o){let e=t.indexOf(o);e>-1&&t.splice(e,1)}function Ri(t){return typeof t=="object"&&t!==null&&Object.keys(t).length===2&&"value"in t&&"disabled"in t}var Ta=class extends An{defaultValue=null;_onChange=[];_pendingValue;_pendingChange=!1;constructor(o=null,e,n){super(pa(e),ma(n,e)),this._applyFormState(o),this._setUpdateStrategy(e),this._initObservables(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator}),sn(e)&&(e.nonNullable||e.initialValueIsDefault)&&(Ri(o)?this.defaultValue=o.value:this.defaultValue=o)}setValue(o,e={}){this.value=this._pendingValue=o,this._onChange.length&&e.emitModelToViewChange!==!1&&this._onChange.forEach(n=>n(this.value,e.emitViewToModelChange!==!1)),this.updateValueAndValidity(e)}patchValue(o,e={}){this.setValue(o,e)}reset(o=this.defaultValue,e={}){this._applyFormState(o),this.markAsPristine(e),this.markAsUntouched(e),this.setValue(this.value,e),e.overwriteDefaultValue&&(this.defaultValue=this.value),this._pendingChange=!1,e?.emitEvent!==!1&&this._events.next(new On(this))}_updateValue(){}_anyControls(o){return!1}_allControlsDisabled(){return this.disabled}registerOnChange(o){this._onChange.push(o)}_unregisterOnChange(o){zi(this._onChange,o)}registerOnDisabledChange(o){this._onDisabledChange.push(o)}_unregisterOnDisabledChange(o){zi(this._onDisabledChange,o)}_forEachChild(o){}_syncPendingControls(){return this.updateOn==="submit"&&(this._pendingDirty&&this.markAsDirty(),this._pendingTouched&&this.markAsTouched(),this._pendingChange)?(this.setValue(this._pendingValue,{onlySelf:!0,emitModelToViewChange:!1}),!0):!1}_applyFormState(o){Ri(o)?(this.value=this._pendingValue=o.value,o.disabled?this.disable({onlySelf:!0,emitEvent:!1}):this.enable({onlySelf:!0,emitEvent:!1})):this.value=this._pendingValue=o}};var Sa={provide:tt,useExisting:We(()=>Pn)},Hi=Promise.resolve(),Pn=(()=>{class t extends tt{_changeDetectorRef;callSetDisabledState;control=new Ta;static ngAcceptInputType_isDisabled;_registered=!1;viewModel;name="";isDisabled;model;options;update=new S;constructor(e,n,i,r,a,m){super(),this._changeDetectorRef=a,this.callSetDisabledState=m,this._parent=e,this._setValidators(n),this._setAsyncValidators(i),this.valueAccessor=Ia(this,r)}ngOnChanges(e){if(this._checkForErrors(),!this._registered||"name"in e){if(this._registered&&(this._checkName(),this.formDirective)){let n=e.name.previousValue;this.formDirective.removeControl({name:n,path:this._getPath(n)})}this._setUpControl()}"isDisabled"in e&&this._updateDisabled(e),xa(e,this.viewModel)&&(this._updateValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.formDirective?.removeControl(this)}get path(){return this._getPath(this.name)}get formDirective(){return this._parent?this._parent.formDirective:null}viewToModelUpdate(e){this.viewModel=e,this.update.emit(e)}_setUpControl(){this._setUpdateStrategy(),this._isStandalone()?this._setUpStandalone():this.formDirective.addControl(this),this._registered=!0}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.control._updateOn=this.options.updateOn)}_isStandalone(){return!this._parent||!!(this.options&&this.options.standalone)}_setUpStandalone(){ga(this.control,this,this.callSetDisabledState),this.control.updateValueAndValidity({emitEvent:!1})}_checkForErrors(){this._checkName()}_checkName(){this.options&&this.options.name&&(this.name=this.options.name),!this._isStandalone()&&this.name}_updateValue(e){Hi.then(()=>{this.control.setValue(e,{emitViewToModelChange:!1}),this._changeDetectorRef?.markForCheck()})}_updateDisabled(e){let n=e.isDisabled.currentValue,i=n!==0&&C(n);Hi.then(()=>{i&&!this.control.disabled?this.control.disable():!i&&this.control.disabled&&this.control.enable(),this._changeDetectorRef?.markForCheck()})}_getPath(e){return this._parent?fa(e,this._parent):[e]}static \u0275fac=function(n){return new(n||t)(de(Dn,9),de(oa,10),de(ra,10),de(ut,10),de(Xn,8),de(Xi,8))};static \u0275dir=Te({type:t,selectors:[["","ngModel","",3,"formControlName","",3,"formControl",""]],inputs:{name:"name",isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"],options:[0,"ngModelOptions","options"]},outputs:{update:"ngModelChange"},exportAs:["ngModel"],standalone:!1,features:[j([Sa]),M,$n]})}return t})();var ka=(()=>{class t{static \u0275fac=function(n){return new(n||t)};static \u0275mod=xe({type:t});static \u0275inj=Ce({})}return t})();var ln=(()=>{class t{static withConfig(e){return{ngModule:t,providers:[{provide:Xi,useValue:e.callSetDisabledState??Fn}]}}static \u0275fac=function(n){return new(n||t)};static \u0275mod=xe({type:t});static \u0275inj=Ce({imports:[ka]})}return t})();var eo=`
    .p-skeleton {
        display: block;
        overflow: hidden;
        background: dt('skeleton.background');
        border-radius: dt('skeleton.border.radius');
    }

    .p-skeleton::after {
        content: '';
        animation: p-skeleton-animation 1.2s infinite;
        height: 100%;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(-100%);
        z-index: 1;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0), dt('skeleton.animation.background'), rgba(255, 255, 255, 0));
    }

    [dir='rtl'] .p-skeleton::after {
        animation-name: p-skeleton-animation-rtl;
    }

    .p-skeleton-circle {
        border-radius: 50%;
    }

    .p-skeleton-animation-none::after {
        animation: none;
    }

    @keyframes p-skeleton-animation {
        from {
            transform: translateX(-100%);
        }
        to {
            transform: translateX(100%);
        }
    }

    @keyframes p-skeleton-animation-rtl {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(-100%);
        }
    }
`;var Ea={root:{position:"relative"}},Da={root:({instance:t})=>["p-skeleton p-component",{"p-skeleton-circle":t.shape==="circle","p-skeleton-animation-none":t.animation==="none"}]},to=(()=>{class t extends te{name="skeleton";style=eo;classes=Da;inlineStyles=Ea;static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275prov=$({token:t,factory:t.\u0275fac})}return t})();var no=new L("SKELETON_INSTANCE"),io=(()=>{class t extends le{componentName="Skeleton";$pcSkeleton=b(no,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=b(v,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}styleClass;shape="rectangle";animation="wave";borderRadius;size;width="100%";height="1rem";_componentStyle=b(to);get containerStyle(){let e=this._componentStyle?.inlineStyles.root,n;return this.$unstyled()||(this.size?n=ve(P({},e),{width:this.size,height:this.size,borderRadius:this.borderRadius}):n=ve(P({},e),{width:this.width,height:this.height,borderRadius:this.borderRadius})),n}get dataP(){return this.cn({[this.shape]:this.shape})}static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275cmp=E({type:t,selectors:[["p-skeleton"]],hostVars:6,hostBindings:function(n,i){n&2&&(x("aria-hidden",!0)("data-p",i.dataP),ge(i.containerStyle),h(i.cn(i.cx("root"),i.styleClass)))},inputs:{styleClass:"styleClass",shape:"shape",animation:"animation",borderRadius:"borderRadius",size:"size",width:"width",height:"height"},features:[j([to,{provide:no,useExisting:t},{provide:X,useExisting:t}]),J([v]),M],decls:0,vars:0,template:function(n,i){},dependencies:[ne,ae],encapsulation:2,changeDetection:0})}return t})();var oo=class t{width=k("100%");height=k("1.5rem");shape=k("rectangle");static \u0275fac=function(e){return new(e||t)};static \u0275cmp=E({type:t,selectors:[["app-loading-skeleton"]],inputs:{width:[1,"width"],height:[1,"height"],shape:[1,"shape"]},decls:1,vars:3,consts:[[3,"width","height","shape"]],template:function(e,n){e&1&&N(0,"p-skeleton",0),e&2&&s("width",n.width())("height",n.height())("shape",n.shape())},dependencies:[io],styles:["[_nghost-%COMP%]{display:block}"],changeDetection:0})};var Va=["data-p-icon","blank"],ro=(()=>{class t extends Fe{static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275cmp=E({type:t,selectors:[["","data-p-icon","blank"]],features:[M],attrs:Va,decls:1,vars:0,consts:[["width","1","height","1","fill","currentColor","fill-opacity","0"]],template:function(n,i){n&1&&(F(),me(0,"rect",0))},encapsulation:2})}return t})();var Oa=["data-p-icon","chevron-down"],ao=(()=>{class t extends Fe{static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275cmp=E({type:t,selectors:[["","data-p-icon","chevron-down"]],features:[M],attrs:Oa,decls:1,vars:0,consts:[["d","M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z","fill","currentColor"]],template:function(n,i){n&1&&(F(),me(0,"path",0))},encapsulation:2})}return t})();var Aa=["data-p-icon","minus"],so=(()=>{class t extends Fe{static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275cmp=E({type:t,selectors:[["","data-p-icon","minus"]],features:[M],attrs:Aa,decls:1,vars:0,consts:[["d","M13.2222 7.77778H0.777778C0.571498 7.77778 0.373667 7.69584 0.227806 7.54998C0.0819442 7.40412 0 7.20629 0 7.00001C0 6.79373 0.0819442 6.5959 0.227806 6.45003C0.373667 6.30417 0.571498 6.22223 0.777778 6.22223H13.2222C13.4285 6.22223 13.6263 6.30417 13.7722 6.45003C13.9181 6.5959 14 6.79373 14 7.00001C14 7.20629 13.9181 7.40412 13.7722 7.54998C13.6263 7.69584 13.4285 7.77778 13.2222 7.77778Z","fill","currentColor"]],template:function(n,i){n&1&&(F(),me(0,"path",0))},encapsulation:2})}return t})();var Fa=["data-p-icon","search"],lo=(()=>{class t extends Fe{pathId;onInit(){this.pathId="url(#"+Re()+")"}static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275cmp=E({type:t,selectors:[["","data-p-icon","search"]],features:[M],attrs:Fa,decls:5,vars:2,consts:[["fill-rule","evenodd","clip-rule","evenodd","d","M2.67602 11.0265C3.6661 11.688 4.83011 12.0411 6.02086 12.0411C6.81149 12.0411 7.59438 11.8854 8.32483 11.5828C8.87005 11.357 9.37808 11.0526 9.83317 10.6803L12.9769 13.8241C13.0323 13.8801 13.0983 13.9245 13.171 13.9548C13.2438 13.985 13.3219 14.0003 13.4007 14C13.4795 14.0003 13.5575 13.985 13.6303 13.9548C13.7031 13.9245 13.7691 13.8801 13.8244 13.8241C13.9367 13.7116 13.9998 13.5592 13.9998 13.4003C13.9998 13.2414 13.9367 13.089 13.8244 12.9765L10.6807 9.8328C11.053 9.37773 11.3573 8.86972 11.5831 8.32452C11.8857 7.59408 12.0414 6.81119 12.0414 6.02056C12.0414 4.8298 11.6883 3.66579 11.0268 2.67572C10.3652 1.68564 9.42494 0.913972 8.32483 0.45829C7.22472 0.00260857 6.01418 -0.116618 4.84631 0.115686C3.67844 0.34799 2.60568 0.921393 1.76369 1.76338C0.921698 2.60537 0.348296 3.67813 0.115991 4.84601C-0.116313 6.01388 0.00291375 7.22441 0.458595 8.32452C0.914277 9.42464 1.68595 10.3649 2.67602 11.0265ZM3.35565 2.0158C4.14456 1.48867 5.07206 1.20731 6.02086 1.20731C7.29317 1.20731 8.51338 1.71274 9.41304 2.6124C10.3127 3.51206 10.8181 4.73226 10.8181 6.00457C10.8181 6.95337 10.5368 7.88088 10.0096 8.66978C9.48251 9.45868 8.73328 10.0736 7.85669 10.4367C6.98011 10.7997 6.01554 10.8947 5.08496 10.7096C4.15439 10.5245 3.2996 10.0676 2.62869 9.39674C1.95778 8.72583 1.50089 7.87104 1.31579 6.94046C1.13068 6.00989 1.22568 5.04532 1.58878 4.16874C1.95187 3.29215 2.56675 2.54292 3.35565 2.0158Z","fill","currentColor"],[3,"id"],["width","14","height","14","fill","white"]],template:function(n,i){n&1&&(F(),Z(0,"g"),me(1,"path",0),oe(),Z(2,"defs")(3,"clipPath",1),me(4,"rect",2),oe()()),n&2&&(x("clip-path",i.pathId),c(3),Oe("id",i.pathId))},encapsulation:2})}return t})();var Pa=["data-p-icon","window-maximize"],co=(()=>{class t extends Fe{pathId;onInit(){this.pathId="url(#"+Re()+")"}static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275cmp=E({type:t,selectors:[["","data-p-icon","window-maximize"]],features:[M],attrs:Pa,decls:5,vars:2,consts:[["fill-rule","evenodd","clip-rule","evenodd","d","M7 14H11.8C12.3835 14 12.9431 13.7682 13.3556 13.3556C13.7682 12.9431 14 12.3835 14 11.8V2.2C14 1.61652 13.7682 1.05694 13.3556 0.644365C12.9431 0.231785 12.3835 0 11.8 0H2.2C1.61652 0 1.05694 0.231785 0.644365 0.644365C0.231785 1.05694 0 1.61652 0 2.2V7C0 7.15913 0.063214 7.31174 0.175736 7.42426C0.288258 7.53679 0.44087 7.6 0.6 7.6C0.75913 7.6 0.911742 7.53679 1.02426 7.42426C1.13679 7.31174 1.2 7.15913 1.2 7V2.2C1.2 1.93478 1.30536 1.68043 1.49289 1.49289C1.68043 1.30536 1.93478 1.2 2.2 1.2H11.8C12.0652 1.2 12.3196 1.30536 12.5071 1.49289C12.6946 1.68043 12.8 1.93478 12.8 2.2V11.8C12.8 12.0652 12.6946 12.3196 12.5071 12.5071C12.3196 12.6946 12.0652 12.8 11.8 12.8H7C6.84087 12.8 6.68826 12.8632 6.57574 12.9757C6.46321 13.0883 6.4 13.2409 6.4 13.4C6.4 13.5591 6.46321 13.7117 6.57574 13.8243C6.68826 13.9368 6.84087 14 7 14ZM9.77805 7.42192C9.89013 7.534 10.0415 7.59788 10.2 7.59995C10.3585 7.59788 10.5099 7.534 10.622 7.42192C10.7341 7.30985 10.798 7.15844 10.8 6.99995V3.94242C10.8066 3.90505 10.8096 3.86689 10.8089 3.82843C10.8079 3.77159 10.7988 3.7157 10.7824 3.6623C10.756 3.55552 10.701 3.45698 10.622 3.37798C10.5099 3.2659 10.3585 3.20202 10.2 3.19995H7.00002C6.84089 3.19995 6.68828 3.26317 6.57576 3.37569C6.46324 3.48821 6.40002 3.64082 6.40002 3.79995C6.40002 3.95908 6.46324 4.11169 6.57576 4.22422C6.68828 4.33674 6.84089 4.39995 7.00002 4.39995H8.80006L6.19997 7.00005C6.10158 7.11005 6.04718 7.25246 6.04718 7.40005C6.04718 7.54763 6.10158 7.69004 6.19997 7.80005C6.30202 7.91645 6.44561 7.98824 6.59997 8.00005C6.75432 7.98824 6.89791 7.91645 6.99997 7.80005L9.60002 5.26841V6.99995C9.6021 7.15844 9.66598 7.30985 9.77805 7.42192ZM1.4 14H3.8C4.17066 13.9979 4.52553 13.8498 4.78763 13.5877C5.04973 13.3256 5.1979 12.9707 5.2 12.6V10.2C5.1979 9.82939 5.04973 9.47452 4.78763 9.21242C4.52553 8.95032 4.17066 8.80215 3.8 8.80005H1.4C1.02934 8.80215 0.674468 8.95032 0.412371 9.21242C0.150274 9.47452 0.00210008 9.82939 0 10.2V12.6C0.00210008 12.9707 0.150274 13.3256 0.412371 13.5877C0.674468 13.8498 1.02934 13.9979 1.4 14ZM1.25858 10.0586C1.29609 10.0211 1.34696 10 1.4 10H3.8C3.85304 10 3.90391 10.0211 3.94142 10.0586C3.97893 10.0961 4 10.147 4 10.2V12.6C4 12.6531 3.97893 12.704 3.94142 12.7415C3.90391 12.779 3.85304 12.8 3.8 12.8H1.4C1.34696 12.8 1.29609 12.779 1.25858 12.7415C1.22107 12.704 1.2 12.6531 1.2 12.6V10.2C1.2 10.147 1.22107 10.0961 1.25858 10.0586Z","fill","currentColor"],[3,"id"],["width","14","height","14","fill","white"]],template:function(n,i){n&1&&(F(),Z(0,"g"),me(1,"path",0),oe(),Z(2,"defs")(3,"clipPath",1),me(4,"rect",2),oe()()),n&2&&(x("clip-path",i.pathId),c(3),Oe("id",i.pathId))},encapsulation:2})}return t})();var Na=["data-p-icon","window-minimize"],po=(()=>{class t extends Fe{pathId;onInit(){this.pathId="url(#"+Re()+")"}static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275cmp=E({type:t,selectors:[["","data-p-icon","window-minimize"]],features:[M],attrs:Na,decls:5,vars:2,consts:[["fill-rule","evenodd","clip-rule","evenodd","d","M11.8 0H2.2C1.61652 0 1.05694 0.231785 0.644365 0.644365C0.231785 1.05694 0 1.61652 0 2.2V7C0 7.15913 0.063214 7.31174 0.175736 7.42426C0.288258 7.53679 0.44087 7.6 0.6 7.6C0.75913 7.6 0.911742 7.53679 1.02426 7.42426C1.13679 7.31174 1.2 7.15913 1.2 7V2.2C1.2 1.93478 1.30536 1.68043 1.49289 1.49289C1.68043 1.30536 1.93478 1.2 2.2 1.2H11.8C12.0652 1.2 12.3196 1.30536 12.5071 1.49289C12.6946 1.68043 12.8 1.93478 12.8 2.2V11.8C12.8 12.0652 12.6946 12.3196 12.5071 12.5071C12.3196 12.6946 12.0652 12.8 11.8 12.8H7C6.84087 12.8 6.68826 12.8632 6.57574 12.9757C6.46321 13.0883 6.4 13.2409 6.4 13.4C6.4 13.5591 6.46321 13.7117 6.57574 13.8243C6.68826 13.9368 6.84087 14 7 14H11.8C12.3835 14 12.9431 13.7682 13.3556 13.3556C13.7682 12.9431 14 12.3835 14 11.8V2.2C14 1.61652 13.7682 1.05694 13.3556 0.644365C12.9431 0.231785 12.3835 0 11.8 0ZM6.368 7.952C6.44137 7.98326 6.52025 7.99958 6.6 8H9.8C9.95913 8 10.1117 7.93678 10.2243 7.82426C10.3368 7.71174 10.4 7.55913 10.4 7.4C10.4 7.24087 10.3368 7.08826 10.2243 6.97574C10.1117 6.86321 9.95913 6.8 9.8 6.8H8.048L10.624 4.224C10.73 4.11026 10.7877 3.95982 10.7849 3.80438C10.7822 3.64894 10.7192 3.50063 10.6093 3.3907C10.4994 3.28077 10.3511 3.2178 10.1956 3.21506C10.0402 3.21232 9.88974 3.27002 9.776 3.376L7.2 5.952V4.2C7.2 4.04087 7.13679 3.88826 7.02426 3.77574C6.91174 3.66321 6.75913 3.6 6.6 3.6C6.44087 3.6 6.28826 3.66321 6.17574 3.77574C6.06321 3.88826 6 4.04087 6 4.2V7.4C6.00042 7.47975 6.01674 7.55862 6.048 7.632C6.07656 7.70442 6.11971 7.7702 6.17475 7.82524C6.2298 7.88029 6.29558 7.92344 6.368 7.952ZM1.4 8.80005H3.8C4.17066 8.80215 4.52553 8.95032 4.78763 9.21242C5.04973 9.47452 5.1979 9.82939 5.2 10.2V12.6C5.1979 12.9707 5.04973 13.3256 4.78763 13.5877C4.52553 13.8498 4.17066 13.9979 3.8 14H1.4C1.02934 13.9979 0.674468 13.8498 0.412371 13.5877C0.150274 13.3256 0.00210008 12.9707 0 12.6V10.2C0.00210008 9.82939 0.150274 9.47452 0.412371 9.21242C0.674468 8.95032 1.02934 8.80215 1.4 8.80005ZM3.94142 12.7415C3.97893 12.704 4 12.6531 4 12.6V10.2C4 10.147 3.97893 10.0961 3.94142 10.0586C3.90391 10.0211 3.85304 10 3.8 10H1.4C1.34696 10 1.29609 10.0211 1.25858 10.0586C1.22107 10.0961 1.2 10.147 1.2 10.2V12.6C1.2 12.6531 1.22107 12.704 1.25858 12.7415C1.29609 12.779 1.34696 12.8 1.4 12.8H3.8C3.85304 12.8 3.90391 12.779 3.94142 12.7415Z","fill","currentColor"],[3,"id"],["width","14","height","14","fill","white"]],template:function(n,i){n&1&&(F(),Z(0,"g"),me(1,"path",0),oe(),Z(2,"defs")(3,"clipPath",1),me(4,"rect",2),oe()()),n&2&&(x("clip-path",i.pathId),c(3),Oe("id",i.pathId))},encapsulation:2})}return t})();var uo=`
    .p-chip {
        display: inline-flex;
        align-items: center;
        background: dt('chip.background');
        color: dt('chip.color');
        border-radius: dt('chip.border.radius');
        padding-block: dt('chip.padding.y');
        padding-inline: dt('chip.padding.x');
        gap: dt('chip.gap');
    }

    .p-chip-icon {
        color: dt('chip.icon.color');
        font-size: dt('chip.icon.size');
        width: dt('chip.icon.size');
        height: dt('chip.icon.size');
    }

    .p-chip-image {
        border-radius: 50%;
        width: dt('chip.image.width');
        height: dt('chip.image.height');
        margin-inline-start: calc(-1 * dt('chip.padding.y'));
    }

    .p-chip:has(.p-chip-remove-icon) {
        padding-inline-end: dt('chip.padding.y');
    }

    .p-chip:has(.p-chip-image) {
        padding-block-start: calc(dt('chip.padding.y') / 2);
        padding-block-end: calc(dt('chip.padding.y') / 2);
    }

    .p-chip-remove-icon {
        cursor: pointer;
        font-size: dt('chip.remove.icon.size');
        width: dt('chip.remove.icon.size');
        height: dt('chip.remove.icon.size');
        color: dt('chip.remove.icon.color');
        border-radius: 50%;
        transition:
            outline-color dt('chip.transition.duration'),
            box-shadow dt('chip.transition.duration');
        outline-color: transparent;
    }

    .p-chip-remove-icon:focus-visible {
        box-shadow: dt('chip.remove.icon.focus.ring.shadow');
        outline: dt('chip.remove.icon.focus.ring.width') dt('chip.remove.icon.focus.ring.style') dt('chip.remove.icon.focus.ring.color');
        outline-offset: dt('chip.remove.icon.focus.ring.offset');
    }
`;var Ba=["removeicon"],La=["*"];function za(t,o){if(t&1){let e=V();d(0,"img",4),w("error",function(i){f(e);let r=l();return g(r.imageError(i))}),u()}if(t&2){let e=l();h(e.cx("image")),s("pBind",e.ptm("image"))("src",e.image,qn)("alt",e.alt)}}function Ra(t,o){if(t&1&&N(0,"span",6),t&2){let e=l(2);h(e.icon),s("pBind",e.ptm("icon"))("ngClass",e.cx("icon"))}}function Ha(t,o){if(t&1&&p(0,Ra,1,4,"span",5),t&2){let e=l();s("ngIf",e.icon)}}function ja(t,o){if(t&1&&(d(0,"div",7),ee(1),u()),t&2){let e=l();h(e.cx("label")),s("pBind",e.ptm("label")),c(),ye(e.label)}}function Ga(t,o){if(t&1){let e=V();d(0,"span",11),w("click",function(i){f(e);let r=l(3);return g(r.close(i))})("keydown",function(i){f(e);let r=l(3);return g(r.onKeydown(i))}),u()}if(t&2){let e=l(3);h(e.removeIcon),s("pBind",e.ptm("removeIcon"))("ngClass",e.cx("removeIcon")),x("tabindex",e.disabled?-1:0)("aria-label",e.removeAriaLabel)}}function $a(t,o){if(t&1){let e=V();F(),d(0,"svg",12),w("click",function(i){f(e);let r=l(3);return g(r.close(i))})("keydown",function(i){f(e);let r=l(3);return g(r.onKeydown(i))}),u()}if(t&2){let e=l(3);h(e.cx("removeIcon")),s("pBind",e.ptm("removeIcon")),x("tabindex",e.disabled?-1:0)("aria-label",e.removeAriaLabel)}}function Ua(t,o){if(t&1&&(R(0),p(1,Ga,1,6,"span",9)(2,$a,1,5,"svg",10),H()),t&2){let e=l(2);c(),s("ngIf",e.removeIcon),c(),s("ngIf",!e.removeIcon)}}function qa(t,o){}function Wa(t,o){t&1&&p(0,qa,0,0,"ng-template")}function Qa(t,o){if(t&1){let e=V();d(0,"span",13),w("click",function(i){f(e);let r=l(2);return g(r.close(i))})("keydown",function(i){f(e);let r=l(2);return g(r.onKeydown(i))}),p(1,Wa,1,0,null,14),u()}if(t&2){let e=l(2);h(e.cx("removeIcon")),s("pBind",e.ptm("removeIcon")),x("tabindex",e.disabled?-1:0)("aria-label",e.removeAriaLabel),c(),s("ngTemplateOutlet",e.removeIconTemplate||e._removeIconTemplate)}}function Ya(t,o){if(t&1&&(R(0),p(1,Ua,3,2,"ng-container",3)(2,Qa,2,6,"span",8),H()),t&2){let e=l();c(),s("ngIf",!e.removeIconTemplate&&!e._removeIconTemplate),c(),s("ngIf",e.removeIconTemplate||e._removeIconTemplate)}}var Ka={root:({instance:t})=>({display:!t.visible&&"none"})},Za={root:({instance:t})=>["p-chip p-component",{"p-disabled":t.disabled}],image:"p-chip-image",icon:"p-chip-icon",label:"p-chip-label",removeIcon:"p-chip-remove-icon"},mo=(()=>{class t extends te{name="chip";style=uo;classes=Za;inlineStyles=Ka;static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275prov=$({token:t,factory:t.\u0275fac})}return t})();var ho=new L("CHIP_INSTANCE"),oh=(()=>{class t extends le{componentName="Chip";$pcChip=b(ho,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=b(v,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}label;icon;image;alt;styleClass;disabled=!1;removable=!1;removeIcon;onRemove=new S;onImageError=new S;visible=!0;get removeAriaLabel(){return this.config.getTranslation(Je.ARIA).removeLabel}get chipProps(){return this._chipProps}set chipProps(e){this._chipProps=e,e&&typeof e=="object"&&Object.entries(e).forEach(([n,i])=>this[`_${n}`]!==i&&(this[`_${n}`]=i))}_chipProps;_componentStyle=b(mo);removeIconTemplate;templates;_removeIconTemplate;onAfterContentInit(){this.templates.forEach(e=>{e.getType()==="removeicon"?this._removeIconTemplate=e.template:this._removeIconTemplate=e.template})}onChanges(e){if(e.chipProps&&e.chipProps.currentValue){let{currentValue:n}=e.chipProps;n.label!==void 0&&(this.label=n.label),n.icon!==void 0&&(this.icon=n.icon),n.image!==void 0&&(this.image=n.image),n.alt!==void 0&&(this.alt=n.alt),n.styleClass!==void 0&&(this.styleClass=n.styleClass),n.removable!==void 0&&(this.removable=n.removable),n.removeIcon!==void 0&&(this.removeIcon=n.removeIcon)}}close(e){this.visible=!1,this.onRemove.emit(e)}onKeydown(e){(e.key==="Enter"||e.key==="Backspace")&&this.close(e)}imageError(e){this.onImageError.emit(e)}get dataP(){return this.cn({removable:this.removable})}static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275cmp=E({type:t,selectors:[["p-chip"]],contentQueries:function(n,i,r){if(n&1&&fe(r,Ba,4)(r,ce,4),n&2){let a;_(a=y())&&(i.removeIconTemplate=a.first),_(a=y())&&(i.templates=a)}},hostVars:6,hostBindings:function(n,i){n&2&&(x("aria-label",i.label)("data-p",i.dataP),ge(i.sx("root")),h(i.cn(i.cx("root"),i.styleClass)))},inputs:{label:"label",icon:"icon",image:"image",alt:"alt",styleClass:"styleClass",disabled:[2,"disabled","disabled",C],removable:[2,"removable","removable",C],removeIcon:"removeIcon",chipProps:"chipProps"},outputs:{onRemove:"onRemove",onImageError:"onImageError"},features:[j([mo,{provide:ho,useExisting:t},{provide:X,useExisting:t}]),J([v]),M],ngContentSelectors:La,decls:6,vars:4,consts:[["iconTemplate",""],[3,"pBind","class","src","alt","error",4,"ngIf","ngIfElse"],[3,"pBind","class",4,"ngIf"],[4,"ngIf"],[3,"error","pBind","src","alt"],[3,"pBind","class","ngClass",4,"ngIf"],[3,"pBind","ngClass"],[3,"pBind"],["role","button",3,"pBind","class","click","keydown",4,"ngIf"],["role","button",3,"pBind","class","ngClass","click","keydown",4,"ngIf"],["data-p-icon","times-circle","role","button",3,"pBind","class","click","keydown",4,"ngIf"],["role","button",3,"click","keydown","pBind","ngClass"],["data-p-icon","times-circle","role","button",3,"click","keydown","pBind"],["role","button",3,"click","keydown","pBind"],[4,"ngTemplateOutlet"]],template:function(n,i){if(n&1&&(he(),se(0),p(1,za,1,5,"img",1)(2,Ha,1,1,"ng-template",null,0,pe)(4,ja,2,4,"div",2)(5,Ya,3,2,"ng-container",3)),n&2){let r=we(3);c(),s("ngIf",i.image)("ngIfElse",r),c(3),s("ngIf",i.label),c(),s("ngIf",i.removable)}},dependencies:[ne,at,Ie,ue,gi,ae,v],encapsulation:2,changeDetection:0})}return t})();var sh=[{id:"marca-nortada",label:"Nortada"},{id:"marca-urbano",label:"Urbano"},{id:"marca-andina",label:"Andina"},{id:"marca-lumina",label:"Lumina"}],lh=[{id:"sector-costanera",label:"Costanera"},{id:"sector-parque-a",label:"Parque A."},{id:"sector-vespucio",label:"Vespucio"}],fo=[{id:"holding",label:"Holding",type:"HOLDING",parentId:null},{id:"empresa-gastronomia",label:"Empresa Gastron\xF3mica",type:"EMPRESA",parentId:"holding"},{id:"tienda-antofagasta",label:"Antofagasta",type:"TIENDA",parentId:"empresa-gastronomia",marcaId:"marca-nortada",sectorId:"sector-costanera"},{id:"tienda-costanera-center",label:"Costanera Center",type:"TIENDA",parentId:"empresa-gastronomia",marcaId:"marca-nortada",sectorId:"sector-costanera"},{id:"tienda-tanta-cost",label:"Tanta Cost.",type:"TIENDA",parentId:"empresa-gastronomia",marcaId:"marca-urbano",sectorId:"sector-costanera"},{id:"tienda-open-kenn",label:"Open Kenn.",type:"TIENDA",parentId:"empresa-gastronomia",marcaId:"marca-andina",sectorId:"sector-parque-a"},{id:"tienda-parque-arauco",label:"Parque Arauco",type:"TIENDA",parentId:"empresa-gastronomia",marcaId:"marca-andina",sectorId:"sector-parque-a"},{id:"empresa-retail",label:"Empresa Retail",type:"EMPRESA",parentId:"holding"},{id:"tienda-vespucio-mall",label:"Vespucio Mall",type:"TIENDA",parentId:"empresa-retail",marcaId:"marca-lumina",sectorId:"sector-vespucio"},{id:"tienda-vespucio-norte",label:"Vespucio Norte",type:"TIENDA",parentId:"empresa-retail",marcaId:"marca-lumina",sectorId:"sector-vespucio"}];function Xa(t){let o=t;return()=>{o|=0,o=o+1831565813|0;let e=Math.imul(o^o>>>15,1|o);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function Ja(t,o){let e=t.map((a,m)=>m);for(let a=e.length-1;a>0;a--){let m=Math.floor(o()*(a+1));[e[a],e[m]]=[e[m],e[a]]}let n=new Array(t.length);for(let a=0;a<t.length;a++)n[e[a]]=1/Math.pow(a+1,.8);let i=[],r=0;for(let a of n)r+=a,i.push(r);return i}function es(t,o,e){let n=e()*o[o.length-1],i=0,r=o.length-1;for(;i<r;){let a=i+r>>>1;o[a]<n?i=a+1:r=a}return t[i]}function ts(t){return Number(t.endDate.slice(-2))-Number(t.startDate.slice(-2))+1}var go={"2026-01":538026949,"2026-02":495310200,"2026-03":612450100},ns=.04,is=Math.min(...Object.values(go));function os(t){let o=0;for(let e=0;e<t.length;e++)o=o*31+t.charCodeAt(e)|0;return(o>>>0)/4294967296}function rs(t){let o=go[t];return o!==void 0?ns*(o/is):.03+os(t)*.03}function as(){let t=Xa(20260714),o=fo.filter(r=>r.type==="TIENDA"),e=Ja(Mn,t),n=[],i=0;for(let r of dt){let a=ts(r),m=rs(r.id);for(let T of o){let O=380+Math.floor(t()*60),D=0;for(let ie=0;ie<O;ie++){i++;let G=`tx-${i}`,_e=Ve(r.startDate,Math.floor(t()*a)),be=Math.floor(t()*24),qe=1+Math.floor(t()*3);for(let z=0;z<qe;z++){let K=es(Mn,e,t),re=1+Math.floor(t()*3),Me=8e3+t()*8e3,Pe=.8+t()*.6,He=Math.round(Me*re*Pe);D+=He,n.push({transactionId:G,date:_e,storeId:T.id,productId:K.id,hour:be,amount:He,quantity:re})}}i++,n.push({transactionId:`tx-descuento-${i}`,date:Ve(r.startDate,Math.floor(t()*a)),storeId:T.id,productId:"descuento-generico",hour:Math.floor(t()*24),amount:-Math.round(D*m),quantity:-1})}}return n}var hh=as();var yo="pyxis:default-view:";function _o(t){return t===null||Array.isArray(t)&&t.every(o=>typeof o=="string")}function ss(t){if(typeof t!="object"||t===null)return!1;let o=t;return typeof o.contextId=="string"&&Array.isArray(o.periodIds)&&o.periodIds.every(e=>typeof e=="string")&&(o.granularity==="dia"||o.granularity==="semana"||o.granularity==="mes")&&_o(o.sectorMarcaTiendaFilter)&&typeof o.compareToPrevious=="boolean"&&(o.comparisonMode==="periodo_anterior"||o.comparisonMode==="periodo_especifico"||o.comparisonMode==="meta")&&(o.comparisonAlignment==="calendario"||o.comparisonAlignment==="dia_semana")&&_o(o.explicitComparisonPeriodIds)&&(o.ivaMode==="con_iva"||o.ivaMode==="sin_iva")}function gh(t){try{if(typeof localStorage>"u")return null;let o=localStorage.getItem(`${yo}${t}`);if(!o)return null;let e=JSON.parse(o);return ss(e)?e:null}catch{return null}}function _h(t,o){try{if(typeof localStorage>"u")return;localStorage.setItem(`${yo}${t}`,JSON.stringify(o))}catch{}}function yh(t,o){if(t===null||o===null)return t===o;if(t.length!==o.length)return!1;let e=new Set(o);return t.every(n=>e.has(n))}function bo(t){let o=new Map;for(let e of t){let n=o.get(e.year)??[];n.push(e),o.set(e.year,n)}return o}function Nn(t){return t.year*12+t.month}function ls(t){return`${t.year}-${String(t.month).padStart(2,"0")}-${String(t.day).padStart(2,"0")}`}function St(t,o){let e=ls(o);return t.find(n=>n.startDate<=e&&e<=n.endDate)}var vh=[{key:"mes-actual",label:"Mes Actual",granularity:"mes",resolve:(t,o)=>{let e=Nn(o);return t.filter(n=>n.order===e).map(n=>n.id)}},{key:"ultimo-trimestre",label:"\xDAltimo Trimestre",granularity:"mes",resolve:(t,o)=>{let e=Nn(o);return t.filter(n=>n.order>e-3&&n.order<=e).map(n=>n.id)}},{key:"ultimos-6-meses",label:"\xDAltimos 6 Meses",granularity:"mes",resolve:(t,o)=>{let e=Nn(o);return t.filter(n=>n.order>e-6&&n.order<=e).map(n=>n.id)}},{key:"ano-actual",label:"A\xF1o en Curso",granularity:"mes",resolve:(t,o)=>t.filter(e=>e.year===o.year&&e.month<=o.month).map(e=>e.id)},{key:"ano-anterior",label:"A\xF1o Anterior",granularity:"mes",resolve:(t,o)=>t.filter(e=>e.year===o.year-1).map(e=>e.id)},{key:"ultimos-3-anos",label:"\xDAltimos 3 A\xF1os",granularity:"mes",resolve:(t,o)=>t.filter(e=>e.year>=o.year-2&&e.year<=o.year).map(e=>e.id)},{key:"ultimas-3-semanas",label:"\xDAltimas 3 Semanas",granularity:"semana",resolve:(t,o)=>{let e=St(t,o);return e?t.filter(n=>n.order>e.order-3&&n.order<=e.order).map(n=>n.id):[]}},{key:"ultimas-12-semanas",label:"\xDAltimas 12 Semanas",granularity:"semana",resolve:(t,o)=>{let e=St(t,o);return e?t.filter(n=>n.order>e.order-12&&n.order<=e.order).map(n=>n.id):[]}},{key:"hoy",label:"Hoy",granularity:"dia",resolve:(t,o)=>{let e=St(t,o);return e?[e.id]:[]}},{key:"ayer",label:"Ayer",granularity:"dia",resolve:(t,o)=>{let e=St(t,o);return e?t.filter(n=>n.order===e.order-1).map(n=>n.id):[]}},{key:"ultimos-7-dias",label:"\xDAltimos 7 D\xEDas",granularity:"dia",resolve:(t,o)=>{let e=St(t,o);return e?t.filter(n=>n.order>e.order-7&&n.order<=e.order).map(n=>n.id):[]}},{key:"ultimos-30-dias",label:"\xDAltimos 30 D\xEDas",granularity:"dia",resolve:(t,o)=>{let e=St(t,o);return e?t.filter(n=>n.order>e.order-30&&n.order<=e.order).map(n=>n.id):[]}}];function Ch(t,o,e,n){if(t.length===0)return[];let i=o==="dia_semana"&&e==="dia"?7*Math.ceil(t.length/7):t.length,r=new Set(t.map(a=>a.order-i));return n.filter(a=>r.has(a.order))}var vo=`
    .p-dialog {
        max-height: 90%;
        transform: scale(1);
        border-radius: dt('dialog.border.radius');
        box-shadow: dt('dialog.shadow');
        background: dt('dialog.background');
        border: 1px solid dt('dialog.border.color');
        color: dt('dialog.color');
        will-change: transform;
    }

    .p-dialog-content {
        overflow-y: auto;
        padding: dt('dialog.content.padding');
        flex-grow: 1;
    }

    .p-dialog-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-shrink: 0;
        padding: dt('dialog.header.padding');
    }

    .p-dialog-title {
        font-weight: dt('dialog.title.font.weight');
        font-size: dt('dialog.title.font.size');
    }

    .p-dialog-footer {
        flex-shrink: 0;
        padding: dt('dialog.footer.padding');
        display: flex;
        justify-content: flex-end;
        gap: dt('dialog.footer.gap');
    }

    .p-dialog-header-actions {
        display: flex;
        align-items: center;
        gap: dt('dialog.header.gap');
    }

    .p-dialog-top .p-dialog,
    .p-dialog-bottom .p-dialog,
    .p-dialog-left .p-dialog,
    .p-dialog-right .p-dialog,
    .p-dialog-topleft .p-dialog,
    .p-dialog-topright .p-dialog,
    .p-dialog-bottomleft .p-dialog,
    .p-dialog-bottomright .p-dialog {
        margin: 1rem;
    }

    .p-dialog-maximized {
        width: 100vw !important;
        height: 100vh !important;
        top: 0px !important;
        left: 0px !important;
        max-height: 100%;
        height: 100%;
        border-radius: 0;
    }

    .p-dialog .p-resizable-handle {
        position: absolute;
        font-size: 0.1px;
        display: block;
        cursor: se-resize;
        width: 12px;
        height: 12px;
        right: 1px;
        bottom: 1px;
    }

    .p-dialog-enter-active {
        animation: p-animate-dialog-enter 300ms cubic-bezier(.19,1,.22,1);
    }

    .p-dialog-leave-active {
        animation: p-animate-dialog-leave 300ms cubic-bezier(.19,1,.22,1);
    }

    @keyframes p-animate-dialog-enter {
        from {
            opacity: 0;
            transform: scale(0.93);
        }
    }

    @keyframes p-animate-dialog-leave {
        to {
            opacity: 0;
            transform: scale(0.93);
        }
    }
`;var cs=["header"],Co=["content"],xo=["footer"],ds=["closeicon"],ps=["maximizeicon"],us=["minimizeicon"],ms=["headless"],hs=["titlebar"],fs=["*",[["p-footer"]]],gs=["*","p-footer"],_s=t=>({ariaLabelledBy:t});function ys(t,o){t&1&&B(0)}function bs(t,o){if(t&1&&(R(0),p(1,ys,1,0,"ng-container",11),H()),t&2){let e=l(3);c(),s("ngTemplateOutlet",e._headlessTemplate||e.headlessTemplate||e.headlessT)}}function vs(t,o){if(t&1){let e=V();d(0,"div",16),w("mousedown",function(i){f(e);let r=l(4);return g(r.initResize(i))}),u()}if(t&2){let e=l(4);h(e.cx("resizeHandle")),yt("z-index",90),s("pBind",e.ptm("resizeHandle"))}}function Cs(t,o){if(t&1&&(d(0,"span",21),ee(1),u()),t&2){let e=l(5);h(e.cx("title")),s("id",e.ariaLabelledBy)("pBind",e.ptm("title")),c(),ye(e.header)}}function xs(t,o){t&1&&B(0)}function ws(t,o){if(t&1&&N(0,"span",25),t&2){let e=l(7);s("ngClass",e.maximized?e.minimizeIcon:e.maximizeIcon)}}function Is(t,o){t&1&&(F(),N(0,"svg",28))}function Ts(t,o){t&1&&(F(),N(0,"svg",29))}function Ss(t,o){if(t&1&&(R(0),p(1,Is,1,0,"svg",26)(2,Ts,1,0,"svg",27),H()),t&2){let e=l(7);c(),s("ngIf",!e.maximized&&!e._maximizeiconTemplate&&!e.maximizeIconTemplate&&!e.maximizeIconT),c(),s("ngIf",e.maximized&&!e._minimizeiconTemplate&&!e.minimizeIconTemplate&&!e.minimizeIconT)}}function ks(t,o){}function Ms(t,o){t&1&&p(0,ks,0,0,"ng-template")}function Es(t,o){if(t&1&&(R(0),p(1,Ms,1,0,null,11),H()),t&2){let e=l(7);c(),s("ngTemplateOutlet",e._maximizeiconTemplate||e.maximizeIconTemplate||e.maximizeIconT)}}function Ds(t,o){}function Vs(t,o){t&1&&p(0,Ds,0,0,"ng-template")}function Os(t,o){if(t&1&&(R(0),p(1,Vs,1,0,null,11),H()),t&2){let e=l(7);c(),s("ngTemplateOutlet",e._minimizeiconTemplate||e.minimizeIconTemplate||e.minimizeIconT)}}function As(t,o){if(t&1&&p(0,ws,1,1,"span",23)(1,Ss,3,2,"ng-container",24)(2,Es,2,1,"ng-container",24)(3,Os,2,1,"ng-container",24),t&2){let e=l(6);s("ngIf",e.maximizeIcon&&!e._maximizeiconTemplate&&!e._minimizeiconTemplate),c(),s("ngIf",!e.maximizeIcon&&!(e.maximizeButtonProps!=null&&e.maximizeButtonProps.icon)),c(),s("ngIf",!e.maximized),c(),s("ngIf",e.maximized)}}function Fs(t,o){if(t&1){let e=V();d(0,"p-button",22),w("onClick",function(){f(e);let i=l(5);return g(i.maximize())})("keydown.enter",function(){f(e);let i=l(5);return g(i.maximize())}),p(1,As,4,4,"ng-template",null,4,pe),u()}if(t&2){let e=l(5);s("pt",e.ptm("pcMaximizeButton"))("styleClass",e.cx("pcMaximizeButton"))("ariaLabel",e.maximized?e.minimizeLabel:e.maximizeLabel)("tabindex",e.maximizable?"0":"-1")("buttonProps",e.maximizeButtonProps)("unstyled",e.unstyled()),x("data-pc-group-section","headericon")}}function Ps(t,o){if(t&1&&N(0,"span"),t&2){let e=l(8);h(e.closeIcon)}}function Ns(t,o){t&1&&(F(),N(0,"svg",32))}function Bs(t,o){if(t&1&&(R(0),p(1,Ps,1,2,"span",30)(2,Ns,1,0,"svg",31),H()),t&2){let e=l(7);c(),s("ngIf",e.closeIcon),c(),s("ngIf",!e.closeIcon)}}function Ls(t,o){}function zs(t,o){t&1&&p(0,Ls,0,0,"ng-template")}function Rs(t,o){if(t&1&&(d(0,"span"),p(1,zs,1,0,null,11),u()),t&2){let e=l(7);c(),s("ngTemplateOutlet",e._closeiconTemplate||e.closeIconTemplate||e.closeIconT)}}function Hs(t,o){if(t&1&&p(0,Bs,3,2,"ng-container",24)(1,Rs,2,1,"span",24),t&2){let e=l(6);s("ngIf",!e._closeiconTemplate&&!e.closeIconTemplate&&!e.closeIconT&&!(e.closeButtonProps!=null&&e.closeButtonProps.icon)),c(),s("ngIf",e._closeiconTemplate||e.closeIconTemplate||e.closeIconT)}}function js(t,o){if(t&1){let e=V();d(0,"p-button",22),w("onClick",function(i){f(e);let r=l(5);return g(r.close(i))})("keydown.enter",function(i){f(e);let r=l(5);return g(r.close(i))}),p(1,Hs,2,2,"ng-template",null,4,pe),u()}if(t&2){let e=l(5);s("pt",e.ptm("pcCloseButton"))("styleClass",e.cx("pcCloseButton"))("ariaLabel",e.closeAriaLabel)("tabindex",e.closeTabindex)("buttonProps",e.closeButtonProps)("unstyled",e.unstyled()),x("data-pc-group-section","headericon")}}function Gs(t,o){if(t&1){let e=V();d(0,"div",16,3),w("mousedown",function(i){f(e);let r=l(4);return g(r.initDrag(i))}),p(2,Cs,2,5,"span",17)(3,xs,1,0,"ng-container",18),d(4,"div",19),p(5,Fs,3,7,"p-button",20)(6,js,3,7,"p-button",20),u()()}if(t&2){let e=l(4);h(e.cx("header")),s("pBind",e.ptm("header")),c(2),s("ngIf",!e._headerTemplate&&!e.headerTemplate&&!e.headerT),c(),s("ngTemplateOutlet",e._headerTemplate||e.headerTemplate||e.headerT)("ngTemplateOutletContext",Q(11,_s,e.ariaLabelledBy)),c(),h(e.cx("headerActions")),s("pBind",e.ptm("headerActions")),c(),s("ngIf",e.maximizable),c(),s("ngIf",e.closable)}}function $s(t,o){t&1&&B(0)}function Us(t,o){t&1&&B(0)}function qs(t,o){if(t&1&&(d(0,"div",19,5),se(2,1),p(3,Us,1,0,"ng-container",11),u()),t&2){let e=l(4);h(e.cx("footer")),s("pBind",e.ptm("footer")),c(3),s("ngTemplateOutlet",e._footerTemplate||e.footerTemplate||e.footerT)}}function Ws(t,o){if(t&1&&(p(0,vs,1,5,"div",12)(1,Gs,7,13,"div",13),d(2,"div",14,2),se(4),p(5,$s,1,0,"ng-container",11),u(),p(6,qs,4,4,"div",15)),t&2){let e=l(3);s("ngIf",e.resizable),c(),s("ngIf",e.showHeader),c(),h(e.cn(e.cx("content"),e.contentStyleClass)),s("ngStyle",e.contentStyle)("pBind",e.ptm("content")),c(3),s("ngTemplateOutlet",e._contentTemplate||e.contentTemplate||e.contentT),c(),s("ngIf",e._footerTemplate||e.footerTemplate||e.footerT)}}function Qs(t,o){if(t&1){let e=V();d(0,"div",9,0),w("pMotionOnBeforeEnter",function(i){f(e);let r=l(2);return g(r.onBeforeEnter(i))})("pMotionOnAfterEnter",function(i){f(e);let r=l(2);return g(r.onAfterEnter(i))})("pMotionOnBeforeLeave",function(i){f(e);let r=l(2);return g(r.onBeforeLeave(i))})("pMotionOnAfterLeave",function(i){f(e);let r=l(2);return g(r.onAfterLeave(i))}),p(2,bs,2,1,"ng-container",10)(3,Ws,7,8,"ng-template",null,1,pe),u()}if(t&2){let e=we(4),n=l(2);ge(n.sx("root")),h(n.cn(n.cx("root"),n.styleClass)),s("ngStyle",n.style)("pBind",n.ptm("root"))("pFocusTrapDisabled",n.focusTrap===!1)("pMotion",n.visible)("pMotionAppear",!0)("pMotionName","p-dialog")("pMotionOptions",n.computedMotionOptions()),x("role",n.role)("aria-labelledby",n.ariaLabelledBy)("aria-modal",!0)("data-p",n.dataP),c(2),s("ngIf",n._headlessTemplate||n.headlessTemplate||n.headlessT)("ngIfElse",e)}}function Ys(t,o){if(t&1){let e=V();d(0,"div",7),w("pMotionOnAfterLeave",function(){f(e);let i=l();return g(i.onMaskAfterLeave())}),q(1,Qs,5,17,"div",8),u()}if(t&2){let e=l();ge(e.sx("mask")),h(e.cn(e.cx("mask"),e.maskStyleClass)),s("ngStyle",e.maskStyle)("pBind",e.ptm("mask"))("pMotion",e.maskVisible)("pMotionAppear",!0)("pMotionEnterActiveClass",e.modal?"p-overlay-mask-enter-active":"")("pMotionLeaveActiveClass",e.modal?"p-overlay-mask-leave-active":"")("pMotionOptions",e.computedMaskMotionOptions()),x("data-p-scrollblocker-active",e.modal||e.blockScroll)("data-p",e.dataP),c(),W(e.renderDialog()?1:-1)}}var Ks={mask:({instance:t})=>({position:"fixed",height:"100%",width:"100%",left:0,top:0,display:"flex",justifyContent:t.position==="left"||t.position==="topleft"||t.position==="bottomleft"?"flex-start":t.position==="right"||t.position==="topright"||t.position==="bottomright"?"flex-end":"center",alignItems:t.position==="top"||t.position==="topleft"||t.position==="topright"?"flex-start":t.position==="bottom"||t.position==="bottomleft"||t.position==="bottomright"?"flex-end":"center",pointerEvents:t.modal?"auto":"none"}),root:{display:"flex",flexDirection:"column",pointerEvents:"auto"}},Zs={mask:({instance:t})=>{let e=["left","right","top","topleft","topright","bottom","bottomleft","bottomright"].find(n=>n===t.position);return["p-dialog-mask",{"p-overlay-mask":t.modal},e?`p-dialog-${e}`:""]},root:({instance:t})=>["p-dialog p-component",{"p-dialog-maximized":t.maximizable&&t.maximized}],header:"p-dialog-header",title:"p-dialog-title",resizeHandle:"p-resizable-handle",headerActions:"p-dialog-header-actions",pcMaximizeButton:"p-dialog-maximize-button",pcCloseButton:"p-dialog-close-button",content:()=>["p-dialog-content"],footer:"p-dialog-footer"},wo=(()=>{class t extends te{name="dialog";style=vo;classes=Zs;inlineStyles=Ks;static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275prov=$({token:t,factory:t.\u0275fac})}return t})();var Io=new L("DIALOG_INSTANCE"),Qh=(()=>{class t extends le{componentName="Dialog";hostName="";$pcDialog=b(Io,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=b(v,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("host"))}header;draggable=!0;resizable=!0;contentStyle;contentStyleClass;modal=!1;closeOnEscape=!0;dismissableMask=!1;rtl=!1;closable=!0;breakpoints;styleClass;maskStyleClass;maskStyle;showHeader=!0;blockScroll=!1;autoZIndex=!0;baseZIndex=0;minX=0;minY=0;focusOnShow=!0;maximizable=!1;keepInViewport=!0;focusTrap=!0;transitionOptions="150ms cubic-bezier(0, 0, 0.2, 1)";maskMotionOptions=k(void 0);computedMaskMotionOptions=A(()=>P(P({},this.ptm("maskMotion")),this.maskMotionOptions()));motionOptions=k(void 0);computedMotionOptions=A(()=>P(P({},this.ptm("motion")),this.motionOptions()));closeIcon;closeAriaLabel;closeTabindex="0";minimizeIcon;maximizeIcon;closeButtonProps={severity:"secondary",variant:"text",rounded:!0};maximizeButtonProps={severity:"secondary",variant:"text",rounded:!0};get visible(){return this._visible}set visible(e){this._visible=e,this._visible&&!this.maskVisible&&(this.maskVisible=!0,this.renderMask.set(!0),this.renderDialog.set(!0))}get style(){return this._style}set style(e){e&&(this._style=P({},e),this.originalStyle=e)}position;role="dialog";appendTo=k(void 0);onShow=new S;onHide=new S;visibleChange=new S;onResizeInit=new S;onResizeEnd=new S;onDragEnd=new S;onMaximize=new S;headerViewChild;contentViewChild;footerViewChild;headerTemplate;contentTemplate;footerTemplate;closeIconTemplate;maximizeIconTemplate;minimizeIconTemplate;headlessTemplate;_headerTemplate;_contentTemplate;_footerTemplate;_closeiconTemplate;_maximizeiconTemplate;_minimizeiconTemplate;_headlessTemplate;$appendTo=A(()=>this.appendTo()||this.config.overlayAppendTo());renderMask=U(!1);renderDialog=U(!1);_visible=!1;maskVisible;container=U(null);wrapper;dragging;ariaLabelledBy=this.getAriaLabelledBy();documentDragListener;documentDragEndListener;resizing;documentResizeListener;documentResizeEndListener;documentEscapeListener;maskClickListener;lastPageX;lastPageY;preventVisibleChangePropagation;maximized;preMaximizeContentHeight;preMaximizeContainerWidth;preMaximizeContainerHeight;preMaximizePageX;preMaximizePageY;id=Re("pn_id_");_style={};originalStyle;transformOptions="scale(0.7)";styleElement;window;_componentStyle=b(wo);headerT;contentT;footerT;closeIconT;maximizeIconT;minimizeIconT;headlessT;zIndexForLayering;get maximizeLabel(){return this.config.getTranslation(Je.ARIA).maximizeLabel}get minimizeLabel(){return this.config.getTranslation(Je.ARIA).minimizeLabel}zone=b(je);overlayService=b(xt);get maskClass(){let n=["left","right","top","topleft","topright","bottom","bottomleft","bottomright"].find(i=>i===this.position);return{"p-dialog-mask":!0,"p-overlay-mask":this.modal||this.dismissableMask,[`p-dialog-${n}`]:n}}onInit(){this.breakpoints&&this.createStyle()}templates;onAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"header":this.headerT=e.template;break;case"content":this.contentT=e.template;break;case"footer":this.footerT=e.template;break;case"closeicon":this.closeIconT=e.template;break;case"maximizeicon":this.maximizeIconT=e.template;break;case"minimizeicon":this.minimizeIconT=e.template;break;case"headless":this.headlessT=e.template;break;default:this.contentT=e.template;break}})}getAriaLabelledBy(){return this.header!==null?Re("pn_id_")+"_header":null}parseDurationToMilliseconds(e){let n=/([\d\.]+)(ms|s)\b/g,i=0,r;for(;(r=n.exec(e))!==null;){let a=parseFloat(r[1]),m=r[2];m==="ms"?i+=a:m==="s"&&(i+=a*1e3)}if(i!==0)return i}_focus(e){if(e){let n=this.parseDurationToMilliseconds(this.transitionOptions),i=hi.getFocusableElements(e);if(i&&i.length>0)return this.zone.runOutsideAngular(()=>{setTimeout(()=>i[0].focus(),n||5)}),!0}return!1}focus(e=this.contentViewChild?.nativeElement){let n=this._focus(e);n||(n=this._focus(this.footerViewChild?.nativeElement),n||(n=this._focus(this.headerViewChild?.nativeElement),n||this._focus(this.contentViewChild?.nativeElement)))}close(e){this.visible=!1,this.visibleChange.emit(this.visible),e.preventDefault()}enableModality(){this.closable&&this.dismissableMask&&(this.maskClickListener=this.renderer.listen(this.wrapper,"mousedown",e=>{this.wrapper&&this.wrapper.isSameNode(e.target)&&this.close(e)})),this.modal&&In()}disableModality(){if(this.wrapper){this.dismissableMask&&this.unbindMaskClickListener();let e=document.querySelectorAll('[data-p-scrollblocker-active="true"]');this.modal&&e&&e.length==1&&At(),this.cd.destroyed||this.cd.detectChanges()}}maximize(){this.maximized=!this.maximized,!this.modal&&!this.blockScroll&&(this.maximized?In():At()),this.onMaximize.emit({maximized:this.maximized})}unbindMaskClickListener(){this.maskClickListener&&(this.maskClickListener(),this.maskClickListener=null)}moveOnTop(){this.autoZIndex?(ke.set("modal",this.container(),this.baseZIndex+this.config.zIndex.modal),this.wrapper.style.zIndex=String(parseInt(this.container().style.zIndex,10)-1)):this.zIndexForLayering=ke.generateZIndex("modal",(this.baseZIndex??0)+this.config.zIndex.modal)}createStyle(){if(Le(this.platformId)&&!this.styleElement&&!this.$unstyled()){this.styleElement=this.renderer.createElement("style"),this.styleElement.type="text/css",wn(this.styleElement,"nonce",this.config?.csp()?.nonce),this.renderer.appendChild(this.document.head,this.styleElement);let e="";for(let n in this.breakpoints)e+=`
                        @media screen and (max-width: ${n}) {
                            .p-dialog[${this.id}]:not(.p-dialog-maximized) {
                                width: ${this.breakpoints[n]} !important;
                            }
                        }
                    `;this.renderer.setProperty(this.styleElement,"innerHTML",e),wn(this.styleElement,"nonce",this.config?.csp()?.nonce)}}initDrag(e){e.target.closest("div")?.getAttribute("data-pc-section")!=="headeractions"&&this.draggable&&(this.dragging=!0,this.lastPageX=e.pageX,this.lastPageY=e.pageY,this.container().style.margin="0",this.document.body.setAttribute("data-p-unselectable-text","true"),!this.$unstyled()&&vn(this.document.body,{"user-select":"none"}))}onDrag(e){if(this.dragging&&this.container()){let n=Ot(this.container()),i=Wt(this.container()),r=e.pageX-this.lastPageX,a=e.pageY-this.lastPageY,m=this.container().getBoundingClientRect(),T=getComputedStyle(this.container()),O=parseFloat(T.marginLeft),D=parseFloat(T.marginTop),ie=m.left+r-O,G=m.top+a-D,_e=bn();this.container().style.position="fixed",this.keepInViewport?(ie>=this.minX&&ie+n<_e.width&&(this._style.left=`${ie}px`,this.lastPageX=e.pageX,this.container().style.left=`${ie}px`),G>=this.minY&&G+i<_e.height&&(this._style.top=`${G}px`,this.lastPageY=e.pageY,this.container().style.top=`${G}px`)):(this.lastPageX=e.pageX,this.container().style.left=`${ie}px`,this.lastPageY=e.pageY,this.container().style.top=`${G}px`),this.overlayService.emitParentDrag(this.container())}}endDrag(e){this.dragging&&(this.dragging=!1,this.document.body.removeAttribute("data-p-unselectable-text"),!this.$unstyled()&&(this.document.body.style["user-select"]=""),this.cd.detectChanges(),this.onDragEnd.emit(e))}resetPosition(){this.container().style.position="",this.container().style.left="",this.container().style.top="",this.container().style.margin=""}center(){this.resetPosition()}initResize(e){this.resizable&&(this.resizing=!0,this.lastPageX=e.pageX,this.lastPageY=e.pageY,this.document.body.setAttribute("data-p-unselectable-text","true"),!this.$unstyled()&&vn(this.document.body,{"user-select":"none"}),this.onResizeInit.emit(e))}onResize(e){if(this.resizing){let n=e.pageX-this.lastPageX,i=e.pageY-this.lastPageY,r=Ot(this.container()),a=Wt(this.container()),m=Wt(this.contentViewChild?.nativeElement),T=r+n,O=a+i,D=this.container().style.minWidth,ie=this.container().style.minHeight,G=this.container().getBoundingClientRect(),_e=bn();(!parseInt(this.container().style.top)||!parseInt(this.container().style.left))&&(T+=n,O+=i),(!D||T>parseInt(D))&&G.left+T<_e.width&&(this._style.width=T+"px",this.container().style.width=this._style.width),(!ie||O>parseInt(ie))&&G.top+O<_e.height&&(this.contentViewChild.nativeElement.style.height=m+O-a+"px",this._style.height&&(this._style.height=O+"px",this.container().style.height=this._style.height)),this.lastPageX=e.pageX,this.lastPageY=e.pageY}}resizeEnd(e){this.resizing&&(this.resizing=!1,this.document.body.removeAttribute("data-p-unselectable-text"),!this.$unstyled()&&(this.document.body.style["user-select"]=""),this.onResizeEnd.emit(e))}bindGlobalListeners(){this.draggable&&(this.bindDocumentDragListener(),this.bindDocumentDragEndListener()),this.resizable&&this.bindDocumentResizeListeners(),this.closeOnEscape&&this.closable&&this.bindDocumentEscapeListener()}unbindGlobalListeners(){this.unbindDocumentDragListener(),this.unbindDocumentDragEndListener(),this.unbindDocumentResizeListeners(),this.unbindDocumentEscapeListener()}bindDocumentDragListener(){this.documentDragListener||this.zone.runOutsideAngular(()=>{this.documentDragListener=this.renderer.listen(this.document.defaultView,"mousemove",this.onDrag.bind(this))})}unbindDocumentDragListener(){this.documentDragListener&&(this.documentDragListener(),this.documentDragListener=null)}bindDocumentDragEndListener(){this.documentDragEndListener||this.zone.runOutsideAngular(()=>{this.documentDragEndListener=this.renderer.listen(this.document.defaultView,"mouseup",this.endDrag.bind(this))})}unbindDocumentDragEndListener(){this.documentDragEndListener&&(this.documentDragEndListener(),this.documentDragEndListener=null)}bindDocumentResizeListeners(){!this.documentResizeListener&&!this.documentResizeEndListener&&this.zone.runOutsideAngular(()=>{this.documentResizeListener=this.renderer.listen(this.document.defaultView,"mousemove",this.onResize.bind(this)),this.documentResizeEndListener=this.renderer.listen(this.document.defaultView,"mouseup",this.resizeEnd.bind(this))})}unbindDocumentResizeListeners(){this.documentResizeListener&&this.documentResizeEndListener&&(this.documentResizeListener(),this.documentResizeEndListener(),this.documentResizeListener=null,this.documentResizeEndListener=null)}bindDocumentEscapeListener(){let e=this.el?this.el.nativeElement.ownerDocument:"document";this.documentEscapeListener=this.renderer.listen(e,"keydown",n=>{if(n.key=="Escape"){let i=this.container();if(!i)return;let r=ke.getCurrent();(parseInt(i.style.zIndex)==r||this.zIndexForLayering==r)&&this.close(n)}})}unbindDocumentEscapeListener(){this.documentEscapeListener&&(this.documentEscapeListener(),this.documentEscapeListener=null)}appendContainer(){this.$appendTo()!=="self"&&Ze(this.document.body,this.wrapper)}restoreAppend(){this.container()&&this.$appendTo()!=="self"&&this.renderer.appendChild(this.el.nativeElement,this.wrapper)}onBeforeEnter(e){this.container.set(e.element),this.wrapper=this.container()?.parentElement,this.$attrSelector&&this.container()?.setAttribute(this.$attrSelector,""),this.appendContainer(),this.moveOnTop(),this.bindGlobalListeners(),this.container()?.setAttribute(this.id,""),this.modal&&this.enableModality()}onAfterEnter(){this.focusOnShow&&this.focus(),this.onShow.emit({})}onBeforeLeave(){this.modal&&(this.maskVisible=!1)}onAfterLeave(){this.onContainerDestroy(),this.renderDialog.set(!1),this.modal?this.renderMask.set(!1):this.maskVisible=!1,this.onHide.emit({}),this.cd.markForCheck()}onMaskAfterLeave(){this.renderDialog()||this.renderMask.set(!1)}onContainerDestroy(){this.unbindGlobalListeners(),this.dragging=!1,this.maximized&&(Vt(this.document.body,"p-overflow-hidden"),this.document.body.style.removeProperty("--scrollbar-width"),this.maximized=!1),this.modal&&this.disableModality(),oi(this.document.body,"p-overflow-hidden")&&Vt(this.document.body,"p-overflow-hidden"),this.container()&&this.autoZIndex&&ke.clear(this.container()),this.zIndexForLayering&&ke.revertZIndex(this.zIndexForLayering),this.container.set(null),this.wrapper=null,this._style=this.originalStyle?P({},this.originalStyle):{}}destroyStyle(){this.styleElement&&(this.renderer.removeChild(this.document.head,this.styleElement),this.styleElement=null)}onDestroy(){this.container()&&(this.restoreAppend(),this.onContainerDestroy()),this.destroyStyle()}get dataP(){return this.cn({maximized:this.maximized,modal:this.modal})}static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275cmp=E({type:t,selectors:[["p-dialog"]],contentQueries:function(n,i,r){if(n&1&&fe(r,cs,4)(r,Co,4)(r,xo,4)(r,ds,4)(r,ps,4)(r,us,4)(r,ms,4)(r,ce,4),n&2){let a;_(a=y())&&(i._headerTemplate=a.first),_(a=y())&&(i._contentTemplate=a.first),_(a=y())&&(i._footerTemplate=a.first),_(a=y())&&(i._closeiconTemplate=a.first),_(a=y())&&(i._maximizeiconTemplate=a.first),_(a=y())&&(i._minimizeiconTemplate=a.first),_(a=y())&&(i._headlessTemplate=a.first),_(a=y())&&(i.templates=a)}},viewQuery:function(n,i){if(n&1&&Ae(hs,5)(Co,5)(xo,5),n&2){let r;_(r=y())&&(i.headerViewChild=r.first),_(r=y())&&(i.contentViewChild=r.first),_(r=y())&&(i.footerViewChild=r.first)}},inputs:{hostName:"hostName",header:"header",draggable:[2,"draggable","draggable",C],resizable:[2,"resizable","resizable",C],contentStyle:"contentStyle",contentStyleClass:"contentStyleClass",modal:[2,"modal","modal",C],closeOnEscape:[2,"closeOnEscape","closeOnEscape",C],dismissableMask:[2,"dismissableMask","dismissableMask",C],rtl:[2,"rtl","rtl",C],closable:[2,"closable","closable",C],breakpoints:"breakpoints",styleClass:"styleClass",maskStyleClass:"maskStyleClass",maskStyle:"maskStyle",showHeader:[2,"showHeader","showHeader",C],blockScroll:[2,"blockScroll","blockScroll",C],autoZIndex:[2,"autoZIndex","autoZIndex",C],baseZIndex:[2,"baseZIndex","baseZIndex",Se],minX:[2,"minX","minX",Se],minY:[2,"minY","minY",Se],focusOnShow:[2,"focusOnShow","focusOnShow",C],maximizable:[2,"maximizable","maximizable",C],keepInViewport:[2,"keepInViewport","keepInViewport",C],focusTrap:[2,"focusTrap","focusTrap",C],transitionOptions:"transitionOptions",maskMotionOptions:[1,"maskMotionOptions"],motionOptions:[1,"motionOptions"],closeIcon:"closeIcon",closeAriaLabel:"closeAriaLabel",closeTabindex:"closeTabindex",minimizeIcon:"minimizeIcon",maximizeIcon:"maximizeIcon",closeButtonProps:"closeButtonProps",maximizeButtonProps:"maximizeButtonProps",visible:"visible",style:"style",position:"position",role:"role",appendTo:[1,"appendTo"],headerTemplate:[0,"content","headerTemplate"],contentTemplate:"contentTemplate",footerTemplate:"footerTemplate",closeIconTemplate:"closeIconTemplate",maximizeIconTemplate:"maximizeIconTemplate",minimizeIconTemplate:"minimizeIconTemplate",headlessTemplate:"headlessTemplate"},outputs:{onShow:"onShow",onHide:"onHide",visibleChange:"visibleChange",onResizeInit:"onResizeInit",onResizeEnd:"onResizeEnd",onDragEnd:"onDragEnd",onMaximize:"onMaximize"},features:[j([wo,{provide:Io,useExisting:t},{provide:X,useExisting:t}]),J([v]),M],ngContentSelectors:gs,decls:1,vars:1,consts:[["container",""],["notHeadless",""],["content",""],["titlebar",""],["icon",""],["footer",""],[3,"class","style","ngStyle","pBind","pMotion","pMotionAppear","pMotionEnterActiveClass","pMotionLeaveActiveClass","pMotionOptions"],[3,"pMotionOnAfterLeave","ngStyle","pBind","pMotion","pMotionAppear","pMotionEnterActiveClass","pMotionLeaveActiveClass","pMotionOptions"],["pFocusTrap","",3,"class","style","ngStyle","pBind","pFocusTrapDisabled","pMotion","pMotionAppear","pMotionName","pMotionOptions"],["pFocusTrap","",3,"pMotionOnBeforeEnter","pMotionOnAfterEnter","pMotionOnBeforeLeave","pMotionOnAfterLeave","ngStyle","pBind","pFocusTrapDisabled","pMotion","pMotionAppear","pMotionName","pMotionOptions"],[4,"ngIf","ngIfElse"],[4,"ngTemplateOutlet"],[3,"class","pBind","z-index","mousedown",4,"ngIf"],[3,"class","pBind","mousedown",4,"ngIf"],[3,"ngStyle","pBind"],[3,"class","pBind",4,"ngIf"],[3,"mousedown","pBind"],[3,"id","class","pBind",4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"pBind"],[3,"pt","styleClass","ariaLabel","tabindex","buttonProps","unstyled","onClick","keydown.enter",4,"ngIf"],[3,"id","pBind"],[3,"onClick","keydown.enter","pt","styleClass","ariaLabel","tabindex","buttonProps","unstyled"],[3,"ngClass",4,"ngIf"],[4,"ngIf"],[3,"ngClass"],["data-p-icon","window-maximize",4,"ngIf"],["data-p-icon","window-minimize",4,"ngIf"],["data-p-icon","window-maximize"],["data-p-icon","window-minimize"],[3,"class",4,"ngIf"],["data-p-icon","times",4,"ngIf"],["data-p-icon","times"]],template:function(n,i){n&1&&(he(fs),q(0,Ys,2,14,"div",6)),n&2&&W(i.renderMask()?0:-1)},dependencies:[ne,at,Ie,ue,Ke,st,vi,wt,co,po,ae,v,lt,Jt],encapsulation:2,changeDetection:0})}return t})();var cn=(()=>{class t extends le{modelValue=U(void 0);$filled=A(()=>vt(this.modelValue()));writeModelValue(e){this.modelValue.set(e)}static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275dir=Te({type:t,features:[M]})}return t})();var So=`
    .p-inputtext {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('inputtext.color');
        background: dt('inputtext.background');
        padding-block: dt('inputtext.padding.y');
        padding-inline: dt('inputtext.padding.x');
        border: 1px solid dt('inputtext.border.color');
        transition:
            background dt('inputtext.transition.duration'),
            color dt('inputtext.transition.duration'),
            border-color dt('inputtext.transition.duration'),
            outline-color dt('inputtext.transition.duration'),
            box-shadow dt('inputtext.transition.duration');
        appearance: none;
        border-radius: dt('inputtext.border.radius');
        outline-color: transparent;
        box-shadow: dt('inputtext.shadow');
    }

    .p-inputtext:enabled:hover {
        border-color: dt('inputtext.hover.border.color');
    }

    .p-inputtext:enabled:focus {
        border-color: dt('inputtext.focus.border.color');
        box-shadow: dt('inputtext.focus.ring.shadow');
        outline: dt('inputtext.focus.ring.width') dt('inputtext.focus.ring.style') dt('inputtext.focus.ring.color');
        outline-offset: dt('inputtext.focus.ring.offset');
    }

    .p-inputtext.p-invalid {
        border-color: dt('inputtext.invalid.border.color');
    }

    .p-inputtext.p-variant-filled {
        background: dt('inputtext.filled.background');
    }

    .p-inputtext.p-variant-filled:enabled:hover {
        background: dt('inputtext.filled.hover.background');
    }

    .p-inputtext.p-variant-filled:enabled:focus {
        background: dt('inputtext.filled.focus.background');
    }

    .p-inputtext:disabled {
        opacity: 1;
        background: dt('inputtext.disabled.background');
        color: dt('inputtext.disabled.color');
    }

    .p-inputtext::placeholder {
        color: dt('inputtext.placeholder.color');
    }

    .p-inputtext.p-invalid::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }

    .p-inputtext-sm {
        font-size: dt('inputtext.sm.font.size');
        padding-block: dt('inputtext.sm.padding.y');
        padding-inline: dt('inputtext.sm.padding.x');
    }

    .p-inputtext-lg {
        font-size: dt('inputtext.lg.font.size');
        padding-block: dt('inputtext.lg.padding.y');
        padding-inline: dt('inputtext.lg.padding.x');
    }

    .p-inputtext-fluid {
        width: 100%;
    }
`;var Xs=`
    ${So}

    /* For PrimeNG */
   .p-inputtext.ng-invalid.ng-dirty {
        border-color: dt('inputtext.invalid.border.color');
    }

    .p-inputtext.ng-invalid.ng-dirty::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }
`,Js={root:({instance:t})=>["p-inputtext p-component",{"p-filled":t.$filled(),"p-inputtext-sm":t.pSize==="small","p-inputtext-lg":t.pSize==="large","p-invalid":t.invalid(),"p-variant-filled":t.$variant()==="filled","p-inputtext-fluid":t.hasFluid}]},ko=(()=>{class t extends te{name="inputtext";style=Xs;classes=Js;static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275prov=$({token:t,factory:t.\u0275fac})}return t})();var Mo=new L("INPUTTEXT_INSTANCE"),Eo=(()=>{class t extends cn{componentName="InputText";hostName="";ptInputText=k();pInputTextPT=k();pInputTextUnstyled=k();bindDirectiveInstance=b(v,{self:!0});$pcInputText=b(Mo,{optional:!0,skipSelf:!0})??void 0;ngControl=b(tt,{optional:!0,self:!0});pcFluid=b(Kt,{optional:!0,host:!0,skipSelf:!0});pSize;variant=k();fluid=k(void 0,{transform:C});invalid=k(void 0,{transform:C});$variant=A(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());_componentStyle=b(ko);constructor(){super(),Dt(()=>{let e=this.ptInputText()||this.pInputTextPT();e&&this.directivePT.set(e)}),Dt(()=>{this.pInputTextUnstyled()&&this.directiveUnstyled.set(this.pInputTextUnstyled())})}onAfterViewInit(){this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value),this.cd.detectChanges()}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("root"))}onDoCheck(){this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value)}onInput(){this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value)}get hasFluid(){return this.fluid()??!!this.pcFluid}get dataP(){return this.cn({invalid:this.invalid(),fluid:this.hasFluid,filled:this.$variant()==="filled",[this.pSize]:this.pSize})}static \u0275fac=function(n){return new(n||t)};static \u0275dir=Te({type:t,selectors:[["","pInputText",""]],hostVars:3,hostBindings:function(n,i){n&1&&w("input",function(){return i.onInput()}),n&2&&(x("data-p",i.dataP),h(i.cx("root")))},inputs:{hostName:"hostName",ptInputText:[1,"ptInputText"],pInputTextPT:[1,"pInputTextPT"],pInputTextUnstyled:[1,"pInputTextUnstyled"],pSize:"pSize",variant:[1,"variant"],fluid:[1,"fluid"],invalid:[1,"invalid"]},features:[j([ko,{provide:Mo,useExisting:t},{provide:X,useExisting:t}]),J([v]),M]})}return t})();var Do=`
    .p-popover {
        margin-block-start: dt('popover.gutter');
        background: dt('popover.background');
        color: dt('popover.color');
        border: 1px solid dt('popover.border.color');
        border-radius: dt('popover.border.radius');
        box-shadow: dt('popover.shadow');
        will-change: transform;
    }

    .p-popover-content {
        padding: dt('popover.content.padding');
    }

    .p-popover-flipped {
        margin-block-start: calc(dt('popover.gutter') * -1);
        margin-block-end: dt('popover.gutter');
    }

    .p-popover:after,
    .p-popover:before {
        bottom: 100%;
        left: calc(dt('popover.arrow.offset') + dt('popover.arrow.left'));
        content: ' ';
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }

    .p-popover:after {
        border-width: calc(dt('popover.gutter') - 2px);
        margin-left: calc(-1 * (dt('popover.gutter') - 2px));
        border-style: solid;
        border-color: transparent;
        border-bottom-color: dt('popover.background');
    }

    .p-popover:before {
        border-width: dt('popover.gutter');
        margin-left: calc(-1 * dt('popover.gutter'));
        border-style: solid;
        border-color: transparent;
        border-bottom-color: dt('popover.border.color');
    }

    .p-popover-flipped:after,
    .p-popover-flipped:before {
        bottom: auto;
        top: 100%;
    }

    .p-popover.p-popover-flipped:after {
        border-bottom-color: transparent;
        border-top-color: dt('popover.background');
    }

    .p-popover.p-popover-flipped:before {
        border-bottom-color: transparent;
        border-top-color: dt('popover.border.color');
    }
`;var el=["content"],tl=["*"],nl=t=>({closeCallback:t});function il(t,o){}function ol(t,o){t&1&&p(0,il,0,0,"ng-template")}function rl(t,o){if(t&1){let e=V();d(0,"div",1),w("click",function(i){f(e);let r=l();return g(r.onOverlayClick(i))})("pMotionOnEnter",function(i){f(e);let r=l();return g(r.onAnimationStart(i))})("pMotionOnAfterLeave",function(){f(e);let i=l();return g(i.onAnimationEnd())}),d(1,"div",2),w("click",function(i){f(e);let r=l();return g(r.onContentClick(i))})("mousedown",function(i){f(e);let r=l();return g(r.onContentClick(i))}),se(2),p(3,ol,1,0,null,3),u()()}if(t&2){let e=l();ge(e.sx("root")),h(e.cn(e.cx("root"),e.styleClass)),s("pBind",e.ptm("root"))("ngStyle",e.style)("pMotion",e.overlayVisible)("pMotionAppear",!0)("pMotionOptions",e.computedMotionOptions()),x("aria-modal",e.overlayVisible)("aria-label",e.ariaLabel)("aria-labelledBy",e.ariaLabelledBy),c(),h(e.cx("content")),s("pBind",e.ptm("content")),c(2),s("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",Q(17,nl,e.onCloseClick.bind(e)))}}var al={root:()=>({position:"absolute"})},sl={root:"p-popover p-component",content:"p-popover-content"},Vo=(()=>{class t extends te{name="popover";style=Do;classes=sl;inlineStyles=al;static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275prov=$({token:t,factory:t.\u0275fac})}return t})(),Oo=new L("POPOVER_INSTANCE"),jf=(()=>{class t extends le{componentName="Popover";$pcPopover=b(Oo,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=b(v,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("host"))}ariaLabel;ariaLabelledBy;dismissable=!0;style;styleClass;appendTo=k("body");autoZIndex=!0;ariaCloseLabel;baseZIndex=0;focusOnShow=!0;showTransitionOptions=".12s cubic-bezier(0, 0, 0.2, 1)";hideTransitionOptions=".1s linear";motionOptions=k(void 0);computedMotionOptions=A(()=>P(P({},this.ptm("motion")),this.motionOptions()));onShow=new S;onHide=new S;$appendTo=A(()=>this.appendTo()||this.config.overlayAppendTo());container;overlayVisible=!1;render=!1;selfClick=!1;documentClickListener;target;willHide;scrollHandler;documentResizeListener;contentTemplate;templates;_contentTemplate;destroyCallback;overlayEventListener;overlaySubscription;_componentStyle=b(Vo);zone=b(je);overlayService=b(xt);onAfterContentInit(){this.templates.forEach(e=>{e.getType()==="content"&&(this._contentTemplate=e.template)})}bindDocumentClickListener(){if(Le(this.platformId)&&!this.documentClickListener){let e=di()?"touchstart":"click",n=this.el?this.el.nativeElement.ownerDocument:this.document;this.documentClickListener=this.renderer.listen(n,e,i=>{this.dismissable&&(!this.container?.contains(i.target)&&this.target!==i.target&&!this.target.contains(i.target)&&!this.selfClick&&this.hide(),this.selfClick=!1,this.cd.markForCheck())})}}unbindDocumentClickListener(){this.documentClickListener&&(this.documentClickListener(),this.documentClickListener=null,this.selfClick=!1)}toggle(e,n){this.overlayVisible?(this.hasTargetChanged(e,n)&&(this.destroyCallback=()=>{this.show(null,n||e.currentTarget||e.target)}),this.hide()):this.show(e,n)}show(e,n){n&&e&&e.stopPropagation(),this.container&&!this.overlayVisible&&(this.container=null),this.target=n||e.currentTarget||e.target,this.overlayVisible=!0,this.render=!0,this.cd.markForCheck()}onOverlayClick(e){this.overlayService.add({originalEvent:e,target:this.el.nativeElement}),this.selfClick=!0}onContentClick(e){let n=e.target;this.selfClick=e.offsetX<n.clientWidth&&e.offsetY<n.clientHeight}hasTargetChanged(e,n){return this.target!=null&&this.target!==(n||e.currentTarget||e.target)}appendOverlay(){this.$appendTo()&&this.$appendTo()!=="self"&&(this.$appendTo()==="body"?Ze(this.document.body,this.container):Ze(this.$appendTo(),this.container))}restoreAppend(){this.container&&this.$appendTo()&&this.$appendTo()!=="self"&&Ze(this.el.nativeElement,this.container)}setZIndex(){this.autoZIndex&&ke.set("overlay",this.container,this.baseZIndex+this.config.zIndex.overlay)}align(){if(this.target&&this.container){qt(this.container,this.target,!1);let e=Cn(this.container),n=Cn(this.target),i=this.document.defaultView?.getComputedStyle(this.container).getPropertyValue("border-radius"),r=0;e.left<n.left&&(r=n.left-e.left-parseFloat(i)*2),this.container.style.setProperty(mi("popover.arrow.left").name,`${r}px`),e.top<n.top&&(this.container.setAttribute("data-p-popover-flipped","true"),!this.$unstyled()&&Ut(this.container,"p-popover-flipped"))}}onAnimationStart(e){this.container=e.element,this.container?.setAttribute(this.$attrSelector,""),this.appendOverlay(),this.align(),this.setZIndex(),this.bindDocumentClickListener(),this.bindDocumentResizeListener(),this.bindScrollListener(),this.focusOnShow&&this.focus(),this.overlayEventListener=n=>{this.container&&this.container.contains(n.target)&&(this.selfClick=!0)},this.overlaySubscription=this.overlayService.clickObservable.subscribe(this.overlayEventListener),this.onShow.emit(null)}onAnimationEnd(){this.overlayVisible||(this.destroyCallback&&(this.destroyCallback(),this.destroyCallback=null),this.overlaySubscription&&this.overlaySubscription.unsubscribe(),this.autoZIndex&&ke.clear(this.container),this.onContainerDestroy(),this.onHide.emit({}),this.render=!1,this.container=null)}focus(){let e=Ue(this.container,"[autofocus]");e&&this.zone.runOutsideAngular(()=>{setTimeout(()=>e.focus(),5)})}hide(){this.overlayVisible=!1,this.cd.markForCheck()}onCloseClick(e){this.hide(),e.preventDefault()}onEscapeKeydown(e){this.hide()}onWindowResize(){this.overlayVisible&&!Xe()&&this.hide()}bindDocumentResizeListener(){if(Le(this.platformId)&&!this.documentResizeListener){let e=this.document.defaultView;this.documentResizeListener=this.renderer.listen(e,"resize",this.onWindowResize.bind(this))}}unbindDocumentResizeListener(){this.documentResizeListener&&(this.documentResizeListener(),this.documentResizeListener=null)}bindScrollListener(){Le(this.platformId)&&(this.scrollHandler||(this.scrollHandler=new Qt(this.target,()=>{this.overlayVisible&&this.hide()})),this.scrollHandler.bindScrollListener())}unbindScrollListener(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()}onContainerDestroy(){this.cd.destroyed||(this.target=null),this.unbindDocumentClickListener(),this.unbindDocumentResizeListener(),this.unbindScrollListener()}onDestroy(){this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null),this.container&&this.autoZIndex&&ke.clear(this.container),this.cd.destroyed||(this.target=null),this.destroyCallback=null,this.container&&(this.restoreAppend(),this.onContainerDestroy()),this.overlaySubscription&&this.overlaySubscription.unsubscribe()}static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275cmp=E({type:t,selectors:[["p-popover"]],contentQueries:function(n,i,r){if(n&1&&fe(r,el,4)(r,ce,4),n&2){let a;_(a=y())&&(i.contentTemplate=a.first),_(a=y())&&(i.templates=a)}},hostBindings:function(n,i){n&1&&w("keydown.escape",function(a){return i.onEscapeKeydown(a)},Wn)},inputs:{ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy",dismissable:[2,"dismissable","dismissable",C],style:"style",styleClass:"styleClass",appendTo:[1,"appendTo"],autoZIndex:[2,"autoZIndex","autoZIndex",C],ariaCloseLabel:"ariaCloseLabel",baseZIndex:[2,"baseZIndex","baseZIndex",Se],focusOnShow:[2,"focusOnShow","focusOnShow",C],showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",motionOptions:[1,"motionOptions"]},outputs:{onShow:"onShow",onHide:"onHide"},features:[j([Vo,{provide:Oo,useExisting:t},{provide:X,useExisting:t}]),J([v]),M],ngContentSelectors:tl,decls:1,vars:1,consts:[["role","dialog","pMotionName","p-anchored-overlay",3,"pBind","class","style","ngStyle","pMotion","pMotionAppear","pMotionOptions"],["role","dialog","pMotionName","p-anchored-overlay",3,"click","pMotionOnEnter","pMotionOnAfterLeave","pBind","ngStyle","pMotion","pMotionAppear","pMotionOptions"],[3,"click","mousedown","pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(n,i){n&1&&(he(),q(0,rl,4,19,"div",0)),n&2&&W(i.render?0:-1)},dependencies:[ne,ue,Ke,ae,v,lt,Jt],encapsulation:2,changeDetection:0})}return t})();var kt=(()=>{class t extends cn{required=k(void 0,{transform:C});invalid=k(void 0,{transform:C});disabled=k(void 0,{transform:C});name=k();_disabled=U(!1);$disabled=A(()=>this.disabled()||this._disabled());onModelChange=()=>{};onModelTouched=()=>{};writeDisabledState(e){this._disabled.set(e)}writeControlValue(e,n){}writeValue(e){this.writeControlValue(e,this.writeModelValue.bind(this))}registerOnChange(e){this.onModelChange=e}registerOnTouched(e){this.onModelTouched=e}setDisabledState(e){this.writeDisabledState(e),this.cd.markForCheck()}static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275dir=Te({type:t,inputs:{required:[1,"required"],invalid:[1,"invalid"],disabled:[1,"disabled"],name:[1,"name"]},features:[M]})}return t})();var Ao=`
    .p-toggleswitch {
        display: inline-block;
        width: dt('toggleswitch.width');
        height: dt('toggleswitch.height');
    }

    .p-toggleswitch-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        top: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border-radius: dt('toggleswitch.border.radius');
    }

    .p-toggleswitch-slider {
        cursor: pointer;
        width: 100%;
        height: 100%;
        border-width: dt('toggleswitch.border.width');
        border-style: solid;
        border-color: dt('toggleswitch.border.color');
        background: dt('toggleswitch.background');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            border-color dt('toggleswitch.transition.duration'),
            outline-color dt('toggleswitch.transition.duration'),
            box-shadow dt('toggleswitch.transition.duration');
        border-radius: dt('toggleswitch.border.radius');
        outline-color: transparent;
        box-shadow: dt('toggleswitch.shadow');
    }

    .p-toggleswitch-handle {
        position: absolute;
        top: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: dt('toggleswitch.handle.background');
        color: dt('toggleswitch.handle.color');
        width: dt('toggleswitch.handle.size');
        height: dt('toggleswitch.handle.size');
        inset-inline-start: dt('toggleswitch.gap');
        margin-block-start: calc(-1 * calc(dt('toggleswitch.handle.size') / 2));
        border-radius: dt('toggleswitch.handle.border.radius');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            inset-inline-start dt('toggleswitch.slide.duration'),
            box-shadow dt('toggleswitch.slide.duration');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.background');
        border-color: dt('toggleswitch.checked.border.color');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.background');
        color: dt('toggleswitch.handle.checked.color');
        inset-inline-start: calc(dt('toggleswitch.width') - calc(dt('toggleswitch.handle.size') + dt('toggleswitch.gap')));
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-slider {
        background: dt('toggleswitch.hover.background');
        border-color: dt('toggleswitch.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.hover.background');
        color: dt('toggleswitch.handle.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.hover.background');
        border-color: dt('toggleswitch.checked.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.hover.background');
        color: dt('toggleswitch.handle.checked.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:focus-visible) .p-toggleswitch-slider {
        box-shadow: dt('toggleswitch.focus.ring.shadow');
        outline: dt('toggleswitch.focus.ring.width') dt('toggleswitch.focus.ring.style') dt('toggleswitch.focus.ring.color');
        outline-offset: dt('toggleswitch.focus.ring.offset');
    }

    .p-toggleswitch.p-invalid > .p-toggleswitch-slider {
        border-color: dt('toggleswitch.invalid.border.color');
    }

    .p-toggleswitch.p-disabled {
        opacity: 1;
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-slider {
        background: dt('toggleswitch.disabled.background');
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.disabled.background');
    }
`;var ll=["handle"],cl=["input"],dl=t=>({checked:t});function pl(t,o){t&1&&B(0)}function ul(t,o){if(t&1&&p(0,pl,1,0,"ng-container",3),t&2){let e=l();s("ngTemplateOutlet",e.handleTemplate||e._handleTemplate)("ngTemplateOutletContext",Q(2,dl,e.checked()))}}var ml=`
    ${Ao}

    p-toggleswitch.ng-invalid.ng-dirty > .p-toggleswitch-slider {
        border-color: dt('toggleswitch.invalid.border.color');
    }
`,hl={root:{position:"relative"}},fl={root:({instance:t})=>["p-toggleswitch p-component",{"p-toggleswitch p-component":!0,"p-toggleswitch-checked":t.checked(),"p-disabled":t.$disabled(),"p-invalid":t.invalid()}],input:"p-toggleswitch-input",slider:"p-toggleswitch-slider",handle:"p-toggleswitch-handle"},Fo=(()=>{class t extends te{name="toggleswitch";style=ml;classes=fl;inlineStyles=hl;static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275prov=$({token:t,factory:t.\u0275fac})}return t})();var Po=new L("TOGGLESWITCH_INSTANCE"),gl={provide:ut,useExisting:We(()=>_l),multi:!0},_l=(()=>{class t extends kt{componentName="ToggleSwitch";$pcToggleSwitch=b(Po,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=b(v,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}styleClass;tabindex;inputId;readonly;trueValue=!0;falseValue=!1;ariaLabel;size=k();ariaLabelledBy;autofocus;onChange=new S;input;handleTemplate;_handleTemplate;focused=!1;_componentStyle=b(Fo);templates;onHostClick(e){this.onClick(e)}onAfterContentInit(){this.templates.forEach(e=>{e.getType()==="handle"?this._handleTemplate=e.template:this._handleTemplate=e.template})}onClick(e){!this.$disabled()&&!this.readonly&&(this.writeModelValue(this.checked()?this.falseValue:this.trueValue),this.onModelChange(this.modelValue()),this.onChange.emit({originalEvent:e,checked:this.modelValue()}),this.input.nativeElement.focus())}onFocus(){this.focused=!0}onBlur(){this.focused=!1,this.onModelTouched()}checked(){return this.modelValue()===this.trueValue}writeControlValue(e,n){n(e),this.cd.markForCheck()}get dataP(){return this.cn({checked:this.checked(),disabled:this.$disabled(),invalid:this.invalid()})}static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275cmp=E({type:t,selectors:[["p-toggleswitch"],["p-toggleSwitch"],["p-toggle-switch"]],contentQueries:function(n,i,r){if(n&1&&fe(r,ll,4)(r,ce,4),n&2){let a;_(a=y())&&(i.handleTemplate=a.first),_(a=y())&&(i.templates=a)}},viewQuery:function(n,i){if(n&1&&Ae(cl,5),n&2){let r;_(r=y())&&(i.input=r.first)}},hostVars:7,hostBindings:function(n,i){n&1&&w("click",function(a){return i.onHostClick(a)}),n&2&&(x("data-p-checked",i.checked())("data-p-disabled",i.$disabled())("data-p",i.dataP),ge(i.sx("root")),h(i.cn(i.cx("root"),i.styleClass)))},inputs:{styleClass:"styleClass",tabindex:[2,"tabindex","tabindex",Se],inputId:"inputId",readonly:[2,"readonly","readonly",C],trueValue:"trueValue",falseValue:"falseValue",ariaLabel:"ariaLabel",size:[1,"size"],ariaLabelledBy:"ariaLabelledBy",autofocus:[2,"autofocus","autofocus",C]},outputs:{onChange:"onChange"},features:[j([gl,Fo,{provide:Po,useExisting:t},{provide:X,useExisting:t}]),J([v]),M],decls:5,vars:22,consts:[["input",""],["type","checkbox","role","switch",3,"focus","blur","checked","pAutoFocus","pBind"],[3,"pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(n,i){n&1&&(d(0,"input",1,0),w("focus",function(){return i.onFocus()})("blur",function(){return i.onBlur()}),u(),d(2,"div",2)(3,"div",2),q(4,ul,1,4,"ng-container"),u()()),n&2&&(h(i.cx("input")),s("checked",i.checked())("pAutoFocus",i.autofocus)("pBind",i.ptm("input")),x("id",i.inputId)("required",i.required()?"":void 0)("disabled",i.$disabled()?"":void 0)("aria-checked",i.checked())("aria-labelledby",i.ariaLabelledBy)("aria-label",i.ariaLabel)("name",i.name())("tabindex",i.tabindex),c(2),h(i.cx("slider")),s("pBind",i.ptm("slider")),x("data-p",i.dataP),c(),h(i.cx("handle")),s("pBind",i.ptm("handle")),x("data-p",i.dataP),c(),W(i.handleTemplate||i._handleTemplate?4:-1))},dependencies:[ne,ue,Yt,ae,Ee,v],encapsulation:2,changeDetection:0})}return t})();function No(t){let o=new Map;for(let e of t){if(e.parentId===null)continue;let n=o.get(e.parentId)??[];n.push(e),o.set(e.parentId,n)}return o}function yl(t,o){let e=No(t),n=[],i=[...e.get(o)??[]];for(;i.length>0;){let r=i.shift();n.push(r.id),i.push(...e.get(r.id)??[])}return n}function vg(t,o,e){let n=new Set(e);return n.has(o)?n.delete(o):n.add(o),n}function Cg(t,o){let e=No(t),n=new Map;function i(r){let a=n.get(r.id);if(a)return a;if(o.has(r.id))return n.set(r.id,"checked"),"checked";let m=e.get(r.id)??[],T;if(m.length===0)T="unchecked";else{let O=m.map(i),D=O.every(G=>G==="checked"),ie=O.every(G=>G==="unchecked");T=D?"checked":ie?"unchecked":"indeterminate"}return n.set(r.id,T),T}for(let r of t)i(r);return n}function xg(t,o){let e=new Set(t.filter(a=>a.parentId!==null).map(a=>a.parentId)),n=a=>!e.has(a.id),i=new Map(t.map(a=>[a.id,a])),r=new Set;for(let a of o){let m=i.get(a);if(m){if(n(m)){r.add(a);continue}for(let T of yl(t,a)){let O=i.get(T);O&&n(O)&&r.add(T)}}}return[...r]}function wg(t,o,e){if(e.length===0)return new Set(t.map(a=>a.id));let n=e.toLowerCase(),i=new Map(t.map(a=>[a.id,a])),r=new Set;for(let a of t){if(!o(a.id).toLowerCase().includes(n))continue;let T=a;for(;T;)r.add(T.id),T=T.parentId!==null?i.get(T.parentId):void 0}return r}function Ig(t,o){if(o.length===0)return null;let e=t.toLowerCase().indexOf(o.toLowerCase());return e===-1?null:{before:t.slice(0,e),match:t.slice(e,e+o.length),after:t.slice(e+o.length)}}var bl=(t,o)=>o[0].iso,Ro=(t,o)=>o.iso;function vl(t,o){if(t&1){let e=V();Z(0,"button",15),Qe("click",function(){let i=f(e).$implicit,r=l(2);return g(r.jumpToMonth(i))}),ee(1),oe()}if(t&2){let e=o.$implicit,n=l(2);Ne("is-active",e===n.viewedMonth()),Oe("disabled",n.isMonthDisabled(e)),c(),Ye(" ",n.monthLabels[e-1].slice(0,3)," ")}}function Cl(t,o){if(t&1){let e=V();Z(0,"div",8)(1,"div",9)(2,"button",10),Qe("click",function(){f(e);let i=l();return g(i.jumpPrevYear())}),F(),Z(3,"svg",3),me(4,"polyline",4),oe()(),mt(),Z(5,"span",11),ee(6),oe(),Z(7,"button",12),Qe("click",function(){f(e);let i=l();return g(i.jumpNextYear())}),F(),Z(8,"svg",3),me(9,"polyline",7),oe()()(),mt(),Z(10,"div",13),Ge(11,vl,2,4,"button",14,fn),oe()()}if(t&2){let e=l();c(2),Oe("disabled",!e.canJumpPrevYear()),c(4),ye(e.viewedYear()),c(),Oe("disabled",!e.canJumpNextYear()),c(4),$e(e.monthNumbers)}}function xl(t,o){if(t&1&&(Z(0,"span",17),ee(1),oe()),t&2){let e=o.$implicit;c(),ye(e)}}function wl(t,o){if(t&1){let e=V();Z(0,"button",22),Qe("click",function(i){let r=f(e).$implicit,a=l(4);return g(a.toggle(r,i))}),ee(1),oe()}if(t&2){let e=o.$implicit,n=l(4);Ne("is-outside",!e.inMonth)("is-selected",n.isSelected(e)),c(),Ye(" ",n.dayNumber(e)," ")}}function Il(t,o){if(t&1&&(Z(0,"div",19),Ge(1,wl,2,5,"button",21,Ro),oe()),t&2){let e=l().$implicit;c(),$e(e)}}function Tl(t,o){if(t&1&&(Z(0,"span",25),ee(1),oe()),t&2){let e=o.$implicit,n=l(4);Ne("is-outside",!e.inMonth),c(),Ye(" ",n.dayNumber(e)," ")}}function Sl(t,o){if(t&1){let e=V();Z(0,"button",23),Qe("click",function(i){f(e);let r=l().$implicit,a=l(2);return g(a.toggle(r[0],i))}),Ge(1,Tl,2,3,"span",24,Ro),oe()}if(t&2){let e=l().$implicit,n=l(2);Ne("is-selected",n.isSelected(e[0])),c(),$e(e)}}function kl(t,o){if(t&1&&q(0,Il,3,0,"div",19)(1,Sl,3,2,"button",20),t&2){let e=l(2);W(e.granularity()==="dia"?0:1)}}function Ml(t,o){if(t&1&&(Z(0,"div",16),Ge(1,xl,2,1,"span",17,fn),oe(),Z(3,"div",18),Ge(4,kl,2,1,null,null,bl),oe()),t&2){let e=l();c(),$e(e.weekdayLabels),c(3),$e(e.weeks())}}var dn=ct[0].year,Bo=ct[0].month,pn=ct[ct.length-1].year,Lo=ct[ct.length-1].month,zo={year:2026,month:7},El=["L","M","X","J","V","S","D"],Dl=Array.from({length:12},(t,o)=>o+1),Mt=class t{granularity=k.required();selectedIds=Be.required();viewedYear=U(zo.year);viewedMonth=U(zo.month);showMonthJump=U(!1);weekdayLabels=El;monthLabels=Nt;monthNumbers=Dl;monthLabel=A(()=>`${Nt[this.viewedMonth()-1]} ${this.viewedYear()}`);weeks=A(()=>Mi(this.viewedYear(),this.viewedMonth()));canPrevMonth=A(()=>this.viewedYear()>dn||this.viewedYear()===dn&&this.viewedMonth()>Bo);canNextMonth=A(()=>this.viewedYear()<pn||this.viewedYear()===pn&&this.viewedMonth()<Lo);canJumpPrevYear=A(()=>this.viewedYear()>dn);canJumpNextYear=A(()=>this.viewedYear()<pn);prevMonth(){this.canPrevMonth()&&(this.viewedMonth()===1?(this.viewedYear.update(o=>o-1),this.viewedMonth.set(12)):this.viewedMonth.update(o=>o-1))}nextMonth(){this.canNextMonth()&&(this.viewedMonth()===12?(this.viewedYear.update(o=>o+1),this.viewedMonth.set(1)):this.viewedMonth.update(o=>o+1))}toggleMonthJump(){this.showMonthJump.update(o=>!o)}jumpPrevYear(){this.canJumpPrevYear()&&this.viewedYear.update(o=>o-1)}jumpNextYear(){this.canJumpNextYear()&&this.viewedYear.update(o=>o+1)}isMonthDisabled(o){return this.viewedYear()===dn&&o<Bo||this.viewedYear()===pn&&o>Lo}jumpToMonth(o){this.isMonthDisabled(o)||(this.viewedMonth.set(o),this.showMonthJump.set(!1))}dayNumber(o){return Number(o.iso.slice(8,10))}idFor(o){return this.granularity()==="dia"?o:Oi.get(o)??""}isSelected(o){let e=this.idFor(o.iso);return e!==""&&this.selectedIds().has(e)}rangeAnchorIso=U(null);toggle(o,e){if(this.granularity()==="dia"&&!o.inMonth)return;let n=this.rangeAnchorIso();if(e?.shiftKey&&n){this.selectRange(n,o.iso);return}let i=this.idFor(o.iso);if(!i)return;let r=new Set(this.selectedIds());r.has(i)?r.delete(i):r.add(i),this.selectedIds.set(r),this.rangeAnchorIso.set(o.iso)}selectRange(o,e){let[n,i]=o<=e?[o,e]:[e,o],r=ki(n,i),a=new Set(this.selectedIds());for(let m=0;m<=r;m++){let T=this.idFor(Ve(n,m));T&&a.add(T)}this.selectedIds.set(a)}static \u0275fac=function(e){return new(e||t)};static \u0275cmp=E({type:t,selectors:[["app-calendar-period-picker"]],inputs:{granularity:[1,"granularity"],selectedIds:[1,"selectedIds"]},outputs:{selectedIds:"selectedIdsChange"},decls:12,vars:4,consts:[[1,"calendar"],[1,"calendar-header"],["type","button","aria-label","Mes anterior",1,"calendar-nav-btn",3,"click","disabled"],["width","16","height","16","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round"],["points","15 18 9 12 15 6"],["type","button",1,"calendar-month-label",3,"click"],["type","button","aria-label","Mes siguiente",1,"calendar-nav-btn",3,"click","disabled"],["points","9 18 15 12 9 6"],[1,"calendar-month-jump"],[1,"calendar-month-jump-year-nav"],["type","button","aria-label","A\xF1o anterior",1,"calendar-nav-btn",3,"click","disabled"],[1,"calendar-year-label"],["type","button","aria-label","A\xF1o siguiente",1,"calendar-nav-btn",3,"click","disabled"],[1,"calendar-month-jump-grid"],["type","button",1,"calendar-month-jump-item",3,"is-active","disabled"],["type","button",1,"calendar-month-jump-item",3,"click","disabled"],[1,"calendar-weekdays"],[1,"calendar-weekday"],[1,"calendar-weeks"],[1,"calendar-row"],["type","button",1,"calendar-row","calendar-row--week",3,"is-selected"],["type","button",1,"calendar-cell",3,"is-outside","is-selected"],["type","button",1,"calendar-cell",3,"click"],["type","button",1,"calendar-row","calendar-row--week",3,"click"],[1,"calendar-cell","calendar-cell--week",3,"is-outside"],[1,"calendar-cell","calendar-cell--week"]],template:function(e,n){e&1&&(Z(0,"div",0)(1,"div",1)(2,"button",2),Qe("click",function(){return n.prevMonth()}),F(),Z(3,"svg",3),me(4,"polyline",4),oe()(),mt(),Z(5,"button",5),Qe("click",function(){return n.toggleMonthJump()}),ee(6),oe(),Z(7,"button",6),Qe("click",function(){return n.nextMonth()}),F(),Z(8,"svg",3),me(9,"polyline",7),oe()()(),q(10,Cl,13,3,"div",8)(11,Ml,6,0),oe()),e&2&&(c(2),Oe("disabled",!n.canPrevMonth()),c(4),ye(n.monthLabel()),c(),Oe("disabled",!n.canNextMonth()),c(3),W(n.showMonthJump()?10:11))},styles:["[_nghost-%COMP%]{display:block}.calendar[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.75rem;width:100%}.calendar-header[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:.5rem}.calendar-nav-btn[_ngcontent-%COMP%]{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;width:2rem;height:2rem;border:none;border-radius:999px;background:transparent;color:var(--p-text-muted-color);cursor:pointer}.calendar-nav-btn[_ngcontent-%COMP%]:hover:not(:disabled){background:var(--p-surface-100);color:var(--p-text-color)}.calendar-nav-btn[_ngcontent-%COMP%]:disabled{opacity:.35;cursor:default}.calendar-month-label[_ngcontent-%COMP%]{flex:1;min-width:0;border:none;background:transparent;padding:.375rem .5rem;border-radius:var(--p-border-radius-md);font-size:.9375rem;font-weight:600;color:var(--p-text-color);text-align:center;cursor:pointer}.calendar-month-label[_ngcontent-%COMP%]:hover{background:var(--p-surface-100)}.calendar-weekdays[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(7,1fr)}.calendar-weekday[_ngcontent-%COMP%]{text-align:center;font-size:.6875rem;font-weight:600;letter-spacing:.02em;text-transform:uppercase;color:var(--p-text-muted-color)}.calendar-weeks[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.25rem}.calendar-row[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(7,1fr);gap:.25rem}.calendar-row--week[_ngcontent-%COMP%]{border:1px solid transparent;border-radius:var(--p-border-radius-md);background:transparent;padding:.125rem 0;cursor:pointer}.calendar-row--week[_ngcontent-%COMP%]:hover{background:var(--p-surface-100)}.calendar-row--week.is-selected[_ngcontent-%COMP%]{background:var(--p-primary-color)}.calendar-row--week.is-selected[_ngcontent-%COMP%]:hover{background:var(--p-primary-hover-color)}.calendar-cell[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;aspect-ratio:1;border:none;border-radius:999px;background:transparent;font-size:.8125rem;color:var(--p-text-color);cursor:pointer}button.calendar-cell[_ngcontent-%COMP%]:hover{background:var(--p-surface-100)}.calendar-cell.is-outside[_ngcontent-%COMP%]{color:var(--p-text-muted-color);opacity:.5;cursor:default}.calendar-cell.is-selected[_ngcontent-%COMP%]{background:var(--p-primary-color);color:var(--p-primary-contrast-color)}.calendar-cell--week[_ngcontent-%COMP%]{border-radius:0;color:inherit}.calendar-row--week.is-selected[_ngcontent-%COMP%]   .calendar-cell--week[_ngcontent-%COMP%]{color:var(--p-primary-contrast-color)}.calendar-month-jump[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.75rem}.calendar-month-jump-year-nav[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;gap:.75rem}.calendar-year-label[_ngcontent-%COMP%]{min-width:3.5rem;text-align:center;font-size:1rem;font-weight:600;color:var(--p-text-color)}.calendar-month-jump-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem}.calendar-month-jump-item[_ngcontent-%COMP%]{padding:.5rem;border:1px solid var(--p-content-border-color);border-radius:var(--p-border-radius-md);background:var(--p-surface-0);font-size:.8125rem;color:var(--p-text-color);cursor:pointer}.calendar-month-jump-item[_ngcontent-%COMP%]:hover:not(:disabled){background:var(--p-surface-100);border-color:var(--p-primary-color)}.calendar-month-jump-item.is-active[_ngcontent-%COMP%]{background:var(--p-primary-color);border-color:var(--p-primary-color);color:var(--p-primary-contrast-color)}.calendar-month-jump-item[_ngcontent-%COMP%]:disabled{opacity:.4;cursor:default}@media(max-width:380px){.calendar-cell[_ngcontent-%COMP%]{font-size:.75rem}.calendar-weekday[_ngcontent-%COMP%]{font-size:.625rem}}"],changeDetection:0})};var Ho=`
    .p-checkbox {
        position: relative;
        display: inline-flex;
        user-select: none;
        vertical-align: bottom;
        width: dt('checkbox.width');
        height: dt('checkbox.height');
    }

    .p-checkbox-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border: 1px solid transparent;
        border-radius: dt('checkbox.border.radius');
    }

    .p-checkbox-box {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: dt('checkbox.border.radius');
        border: 1px solid dt('checkbox.border.color');
        background: dt('checkbox.background');
        width: dt('checkbox.width');
        height: dt('checkbox.height');
        transition:
            background dt('checkbox.transition.duration'),
            color dt('checkbox.transition.duration'),
            border-color dt('checkbox.transition.duration'),
            box-shadow dt('checkbox.transition.duration'),
            outline-color dt('checkbox.transition.duration');
        outline-color: transparent;
        box-shadow: dt('checkbox.shadow');
    }

    .p-checkbox-icon {
        transition-duration: dt('checkbox.transition.duration');
        color: dt('checkbox.icon.color');
        font-size: dt('checkbox.icon.size');
        width: dt('checkbox.icon.size');
        height: dt('checkbox.icon.size');
    }

    .p-checkbox:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        border-color: dt('checkbox.hover.border.color');
    }

    .p-checkbox-checked .p-checkbox-box {
        border-color: dt('checkbox.checked.border.color');
        background: dt('checkbox.checked.background');
    }

    .p-checkbox-checked .p-checkbox-icon {
        color: dt('checkbox.icon.checked.color');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        background: dt('checkbox.checked.hover.background');
        border-color: dt('checkbox.checked.hover.border.color');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-icon {
        color: dt('checkbox.icon.checked.hover.color');
    }

    .p-checkbox:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
        border-color: dt('checkbox.focus.border.color');
        box-shadow: dt('checkbox.focus.ring.shadow');
        outline: dt('checkbox.focus.ring.width') dt('checkbox.focus.ring.style') dt('checkbox.focus.ring.color');
        outline-offset: dt('checkbox.focus.ring.offset');
    }

    .p-checkbox-checked:not(.p-disabled):has(.p-checkbox-input:focus-visible) .p-checkbox-box {
        border-color: dt('checkbox.checked.focus.border.color');
    }

    .p-checkbox.p-invalid > .p-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }

    .p-checkbox.p-variant-filled .p-checkbox-box {
        background: dt('checkbox.filled.background');
    }

    .p-checkbox-checked.p-variant-filled .p-checkbox-box {
        background: dt('checkbox.checked.background');
    }

    .p-checkbox-checked.p-variant-filled:not(.p-disabled):has(.p-checkbox-input:hover) .p-checkbox-box {
        background: dt('checkbox.checked.hover.background');
    }

    .p-checkbox.p-disabled {
        opacity: 1;
    }

    .p-checkbox.p-disabled .p-checkbox-box {
        background: dt('checkbox.disabled.background');
        border-color: dt('checkbox.checked.disabled.border.color');
    }

    .p-checkbox.p-disabled .p-checkbox-box .p-checkbox-icon {
        color: dt('checkbox.icon.disabled.color');
    }

    .p-checkbox-sm,
    .p-checkbox-sm .p-checkbox-box {
        width: dt('checkbox.sm.width');
        height: dt('checkbox.sm.height');
    }

    .p-checkbox-sm .p-checkbox-icon {
        font-size: dt('checkbox.icon.sm.size');
        width: dt('checkbox.icon.sm.size');
        height: dt('checkbox.icon.sm.size');
    }

    .p-checkbox-lg,
    .p-checkbox-lg .p-checkbox-box {
        width: dt('checkbox.lg.width');
        height: dt('checkbox.lg.height');
    }

    .p-checkbox-lg .p-checkbox-icon {
        font-size: dt('checkbox.icon.lg.size');
        width: dt('checkbox.icon.lg.size');
        height: dt('checkbox.icon.lg.size');
    }
`;var Vl=["icon"],Ol=["input"],Al=(t,o,e)=>({checked:t,class:o,dataP:e});function Fl(t,o){if(t&1&&N(0,"span",8),t&2){let e=l(3);h(e.cx("icon")),s("ngClass",e.checkboxIcon)("pBind",e.ptm("icon")),x("data-p",e.dataP)}}function Pl(t,o){if(t&1&&(F(),N(0,"svg",9)),t&2){let e=l(3);h(e.cx("icon")),s("pBind",e.ptm("icon")),x("data-p",e.dataP)}}function Nl(t,o){if(t&1&&(R(0),p(1,Fl,1,5,"span",6)(2,Pl,1,4,"svg",7),H()),t&2){let e=l(2);c(),s("ngIf",e.checkboxIcon),c(),s("ngIf",!e.checkboxIcon)}}function Bl(t,o){if(t&1&&(F(),N(0,"svg",10)),t&2){let e=l(2);h(e.cx("icon")),s("pBind",e.ptm("icon")),x("data-p",e.dataP)}}function Ll(t,o){if(t&1&&(R(0),p(1,Nl,3,2,"ng-container",3)(2,Bl,1,4,"svg",5),H()),t&2){let e=l();c(),s("ngIf",e.checked),c(),s("ngIf",e._indeterminate())}}function zl(t,o){}function Rl(t,o){t&1&&p(0,zl,0,0,"ng-template")}var Hl=`
    ${Ho}

    /* For PrimeNG */
    p-checkBox.ng-invalid.ng-dirty .p-checkbox-box,
    p-check-box.ng-invalid.ng-dirty .p-checkbox-box,
    p-checkbox.ng-invalid.ng-dirty .p-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }
`,jl={root:({instance:t})=>["p-checkbox p-component",{"p-checkbox-checked p-highlight":t.checked,"p-disabled":t.$disabled(),"p-invalid":t.invalid(),"p-variant-filled":t.$variant()==="filled","p-checkbox-sm p-inputfield-sm":t.size()==="small","p-checkbox-lg p-inputfield-lg":t.size()==="large"}],box:"p-checkbox-box",input:"p-checkbox-input",icon:"p-checkbox-icon"},jo=(()=>{class t extends te{name="checkbox";style=Hl;classes=jl;static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275prov=$({token:t,factory:t.\u0275fac})}return t})();var Go=new L("CHECKBOX_INSTANCE"),Gl={provide:ut,useExisting:We(()=>Bn),multi:!0},Bn=(()=>{class t extends kt{componentName="Checkbox";hostName="";value;binary;ariaLabelledBy;ariaLabel;tabindex;inputId;inputStyle;styleClass;inputClass;indeterminate=!1;formControl;checkboxIcon;readonly;autofocus;trueValue=!0;falseValue=!1;variant=k();size=k();onChange=new S;onFocus=new S;onBlur=new S;inputViewChild;get checked(){return this._indeterminate()?!1:this.binary?this.modelValue()===this.trueValue:ni(this.value,this.modelValue())}_indeterminate=U(void 0);checkboxIconTemplate;templates;_checkboxIconTemplate;focused=!1;_componentStyle=b(jo);bindDirectiveInstance=b(v,{self:!0});$pcCheckbox=b(Go,{optional:!0,skipSelf:!0})??void 0;$variant=A(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());onAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"icon":this._checkboxIconTemplate=e.template;break;case"checkboxicon":this._checkboxIconTemplate=e.template;break}})}onChanges(e){e.indeterminate&&this._indeterminate.set(e.indeterminate.currentValue)}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}updateModel(e){let n,i=this.injector.get(tt,null,{optional:!0,self:!0}),r=i&&!this.formControl?i.value:this.modelValue();this.binary?(n=this._indeterminate()?this.trueValue:this.checked?this.falseValue:this.trueValue,this.writeModelValue(n),this.onModelChange(n)):(this.checked||this._indeterminate()?n=r.filter(a=>!$t(a,this.value)):n=r?[...r,this.value]:[this.value],this.onModelChange(n),this.writeModelValue(n),this.formControl&&this.formControl.setValue(n)),this._indeterminate()&&this._indeterminate.set(!1),this.onChange.emit({checked:n,originalEvent:e})}handleChange(e){this.readonly||this.updateModel(e)}onInputFocus(e){this.focused=!0,this.onFocus.emit(e)}onInputBlur(e){this.focused=!1,this.onBlur.emit(e),this.onModelTouched()}focus(){this.inputViewChild?.nativeElement.focus()}writeControlValue(e,n){n(e),this.cd.markForCheck()}get dataP(){return this.cn({invalid:this.invalid(),checked:this.checked,disabled:this.$disabled(),filled:this.$variant()==="filled",[this.size()]:this.size()})}static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275cmp=E({type:t,selectors:[["p-checkbox"],["p-checkBox"],["p-check-box"]],contentQueries:function(n,i,r){if(n&1&&fe(r,Vl,4)(r,ce,4),n&2){let a;_(a=y())&&(i.checkboxIconTemplate=a.first),_(a=y())&&(i.templates=a)}},viewQuery:function(n,i){if(n&1&&Ae(Ol,5),n&2){let r;_(r=y())&&(i.inputViewChild=r.first)}},hostVars:6,hostBindings:function(n,i){n&2&&(x("data-p-highlight",i.checked)("data-p-checked",i.checked)("data-p-disabled",i.$disabled())("data-p",i.dataP),h(i.cn(i.cx("root"),i.styleClass)))},inputs:{hostName:"hostName",value:"value",binary:[2,"binary","binary",C],ariaLabelledBy:"ariaLabelledBy",ariaLabel:"ariaLabel",tabindex:[2,"tabindex","tabindex",Se],inputId:"inputId",inputStyle:"inputStyle",styleClass:"styleClass",inputClass:"inputClass",indeterminate:[2,"indeterminate","indeterminate",C],formControl:"formControl",checkboxIcon:"checkboxIcon",readonly:[2,"readonly","readonly",C],autofocus:[2,"autofocus","autofocus",C],trueValue:"trueValue",falseValue:"falseValue",variant:[1,"variant"],size:[1,"size"]},outputs:{onChange:"onChange",onFocus:"onFocus",onBlur:"onBlur"},features:[j([Gl,jo,{provide:Go,useExisting:t},{provide:X,useExisting:t}]),J([v]),M],decls:5,vars:26,consts:[["input",""],["type","checkbox",3,"focus","blur","change","checked","pBind"],[3,"pBind"],[4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["data-p-icon","minus",3,"class","pBind",4,"ngIf"],[3,"class","ngClass","pBind",4,"ngIf"],["data-p-icon","check",3,"class","pBind",4,"ngIf"],[3,"ngClass","pBind"],["data-p-icon","check",3,"pBind"],["data-p-icon","minus",3,"pBind"]],template:function(n,i){n&1&&(d(0,"input",1,0),w("focus",function(a){return i.onInputFocus(a)})("blur",function(a){return i.onInputBlur(a)})("change",function(a){return i.handleChange(a)}),u(),d(2,"div",2),p(3,Ll,3,2,"ng-container",3)(4,Rl,1,0,null,4),u()),n&2&&(ge(i.inputStyle),h(i.cn(i.cx("input"),i.inputClass)),s("checked",i.checked)("pBind",i.ptm("input")),x("id",i.inputId)("value",i.value)("name",i.name())("tabindex",i.tabindex)("required",i.required()?"":void 0)("readonly",i.readonly?"":void 0)("disabled",i.$disabled()?"":void 0)("aria-labelledby",i.ariaLabelledBy)("aria-label",i.ariaLabel),c(2),h(i.cx("box")),s("pBind",i.ptm("box")),x("data-p",i.dataP),c(),s("ngIf",!i.checkboxIconTemplate&&!i._checkboxIconTemplate),c(),s("ngTemplateOutlet",i.checkboxIconTemplate||i._checkboxIconTemplate)("ngTemplateOutletContext",Zn(22,Al,i.checked,i.cx("icon"),i.dataP)))},dependencies:[ne,at,Ie,ue,ae,Zt,so,Ee,v],encapsulation:2,changeDetection:0})}return t})();var $l=(t,o)=>o.id;function Ul(t,o){t&1&&(F(),d(0,"svg",12),N(1,"polyline",14),u())}function ql(t,o){if(t&1){let e=V();d(0,"label",10)(1,"p-checkbox",11),w("onChange",function(){let i=f(e).$implicit,r=l();return g(r.toggle(i.id))}),u(),q(2,Ul,2,0,":svg:svg",12),d(3,"span",13),ee(4),u()()}if(t&2){let e=o.$implicit,n=l();Ne("is-active",n.isSelected(e.id)),c(),s("binary",!0)("ngModel",n.isSelected(e.id)),c(),W(n.isSelected(e.id)?2:-1),c(2),ye(e.label)}}var Wl=bo(dt),Ql=Math.min(...dt.map(t=>t.year)),Yl=Math.max(...dt.map(t=>t.year)),Et=class t{selectedIds=Be.required();viewedYear=U(2026);viewedYearPeriods=A(()=>(Wl.get(this.viewedYear())??[]).slice().sort((o,e)=>o.order-e.order));canGoPrevYear=A(()=>this.viewedYear()>Ql);canGoNextYear=A(()=>this.viewedYear()<Yl);goPrevYear(){this.canGoPrevYear()&&this.viewedYear.update(o=>o-1)}goNextYear(){this.canGoNextYear()&&this.viewedYear.update(o=>o+1)}isSelected(o){return this.selectedIds().has(o)}toggle(o){let e=new Set(this.selectedIds());e.has(o)?e.delete(o):e.add(o),this.selectedIds.set(e)}static \u0275fac=function(e){return new(e||t)};static \u0275cmp=E({type:t,selectors:[["app-month-period-picker"]],inputs:{selectedIds:[1,"selectedIds"]},outputs:{selectedIds:"selectedIdsChange"},decls:13,vars:7,consts:[[1,"month-picker"],[1,"month-picker-year-nav"],["severity","secondary","ariaLabel","A\xF1o anterior",3,"onClick","text","rounded","disabled"],["width","16","height","16","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round"],["points","15 18 9 12 15 6"],[1,"month-picker-year-label"],["severity","secondary","ariaLabel","A\xF1o siguiente",3,"onClick","text","rounded","disabled"],["points","9 18 15 12 9 6"],[1,"month-picker-grid"],[1,"month-chip",3,"is-active"],[1,"month-chip"],[1,"month-chip-input",3,"onChange","binary","ngModel"],["width","12","height","12","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","3","stroke-linecap","round","stroke-linejoin","round",1,"month-chip-check"],[1,"month-chip-label"],["points","20 6 9 17 4 12"]],template:function(e,n){e&1&&(d(0,"div",0)(1,"div",1)(2,"p-button",2),w("onClick",function(){return n.goPrevYear()}),F(),d(3,"svg",3),N(4,"polyline",4),u()(),mt(),d(5,"span",5),ee(6),u(),d(7,"p-button",6),w("onClick",function(){return n.goNextYear()}),F(),d(8,"svg",3),N(9,"polyline",7),u()()(),mt(),d(10,"div",8),Ge(11,ql,5,6,"label",9,$l),u()()),e&2&&(c(2),s("text",!0)("rounded",!0)("disabled",!n.canGoPrevYear()),c(4),ye(n.viewedYear()),c(),s("text",!0)("rounded",!0)("disabled",!n.canGoNextYear()),c(4),$e(n.viewedYearPeriods()))},dependencies:[st,Bn,ln,Zi,Pn],styles:["[_nghost-%COMP%]{display:block}.month-picker[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.625rem;width:100%}.month-picker-year-nav[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;gap:.75rem}.month-picker-year-label[_ngcontent-%COMP%]{min-width:3.5rem;text-align:center;font-size:1rem;font-weight:600;color:var(--p-text-color)}.month-picker-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem}.month-chip[_ngcontent-%COMP%]{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:.375rem;padding:.375rem .75rem;border-radius:999px;border:1px solid var(--p-content-border-color);background:var(--p-surface-0);color:var(--p-text-color);font-size:.8125rem;font-weight:500;line-height:1.4;cursor:pointer;-webkit-user-select:none;user-select:none;transition:background-color .15s ease,border-color .15s ease,color .15s ease,transform .1s ease-out}.month-chip[_ngcontent-%COMP%]:active{transform:scale(.96)}.month-chip-check[_ngcontent-%COMP%]{flex-shrink:0}.month-chip[_ngcontent-%COMP%]:hover{background:var(--p-surface-100);border-color:var(--p-primary-color)}.month-chip.is-active[_ngcontent-%COMP%]{background:var(--p-primary-color);border-color:var(--p-primary-color);color:var(--p-primary-contrast-color)}.month-chip.is-active[_ngcontent-%COMP%]:hover{background:var(--p-primary-hover-color);border-color:var(--p-primary-hover-color)}.month-chip[_ngcontent-%COMP%]:focus-within{outline:2px solid var(--p-primary-color);outline-offset:2px}.month-chip-input[_ngcontent-%COMP%]{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}"],changeDetection:0})};function Kl(t,o){if(t&1){let e=V();d(0,"div",1)(1,"span",2),ee(2,"Alinear por"),u(),d(3,"div",3)(4,"p-button",7),w("onClick",function(){f(e);let i=l();return g(i.alignment.set("calendario"))}),u(),d(5,"p-button",8),w("onClick",function(){f(e);let i=l();return g(i.alignment.set("dia_semana"))}),u()()()}if(t&2){let e=l();c(4),s("outlined",e.alignment()!=="calendario"),c(),s("outlined",e.alignment()!=="dia_semana")}}function Zl(t,o){if(t&1){let e=V();d(0,"app-month-period-picker",11),ot("selectedIdsChange",function(i){f(e);let r=l(2);return it(r.explicitPeriodIds,i)||(r.explicitPeriodIds=i),g(i)}),u()}if(t&2){let e=l(2);nt("selectedIds",e.explicitPeriodIds)}}function Xl(t,o){if(t&1){let e=V();d(0,"app-calendar-period-picker",12),ot("selectedIdsChange",function(i){f(e);let r=l(2);return it(r.explicitPeriodIds,i)||(r.explicitPeriodIds=i),g(i)}),u()}if(t&2){let e=l(2);s("granularity",e.granularity()),nt("selectedIds",e.explicitPeriodIds)}}function Jl(t,o){if(t&1&&(d(0,"div",1),q(1,Zl,1,1,"app-month-period-picker",9)(2,Xl,1,2,"app-calendar-period-picker",10),u()),t&2){let e=l();c(),W(e.granularity()==="mes"?1:2)}}var $o=class t{granularity=k.required();mode=Be.required();alignment=Be.required();explicitPeriodIds=Be.required();showAlignment=A(()=>this.mode()==="periodo_anterior"&&this.granularity()!=="mes");showExplicitPicker=A(()=>this.mode()==="periodo_especifico");static \u0275fac=function(e){return new(e||t)};static \u0275cmp=E({type:t,selectors:[["app-comparison-selector"]],inputs:{granularity:[1,"granularity"],mode:[1,"mode"],alignment:[1,"alignment"],explicitPeriodIds:[1,"explicitPeriodIds"]},outputs:{mode:"modeChange",alignment:"alignmentChange",explicitPeriodIds:"explicitPeriodIdsChange"},decls:10,vars:5,consts:[[1,"comparison-selector-panel"],[1,"comparison-selector-section"],[1,"comparison-selector-section-label"],[1,"comparison-selector-mode-list"],["label","Periodo Anterior","size","small","severity","secondary",3,"onClick","outlined"],["label","Periodo Espec\xEDfico","size","small","severity","secondary",3,"onClick","outlined"],["label","Meta","size","small","severity","secondary",3,"onClick","outlined"],["label","Fecha calendario","size","small","severity","secondary",3,"onClick","outlined"],["label","D\xEDa de semana","size","small","severity","secondary",3,"onClick","outlined"],[3,"selectedIds"],[3,"granularity","selectedIds"],[3,"selectedIdsChange","selectedIds"],[3,"selectedIdsChange","granularity","selectedIds"]],template:function(e,n){e&1&&(d(0,"div",0)(1,"div",1)(2,"span",2),ee(3,"Comparar contra"),u(),d(4,"div",3)(5,"p-button",4),w("onClick",function(){return n.mode.set("periodo_anterior")}),u(),d(6,"p-button",5),w("onClick",function(){return n.mode.set("periodo_especifico")}),u(),d(7,"p-button",6),w("onClick",function(){return n.mode.set("meta")}),u()()(),q(8,Kl,6,2,"div",1),q(9,Jl,3,1,"div",1),u()),e&2&&(c(5),s("outlined",n.mode()!=="periodo_anterior"),c(),s("outlined",n.mode()!=="periodo_especifico"),c(),s("outlined",n.mode()!=="meta"),c(),W(n.showAlignment()?8:-1),c(),W(n.showExplicitPicker()?9:-1))},dependencies:[st,Mt,ln,Et],styles:["[_nghost-%COMP%]{display:block}.comparison-selector-panel[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:1.125rem;width:100%}.comparison-selector-section[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.625rem}.comparison-selector-section-label[_ngcontent-%COMP%]{font-size:.75rem;font-weight:600;letter-spacing:.02em;text-transform:uppercase;color:var(--p-text-muted-color)}.comparison-selector-mode-list[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;gap:.5rem}"],changeDetection:0})};var Uo=`
    .p-iconfield {
        position: relative;
        display: block;
    }

    .p-inputicon {
        position: absolute;
        top: 50%;
        margin-top: calc(-1 * (dt('icon.size') / 2));
        color: dt('iconfield.icon.color');
        line-height: 1;
        z-index: 1;
    }

    .p-iconfield .p-inputicon:first-child {
        inset-inline-start: dt('form.field.padding.x');
    }

    .p-iconfield .p-inputicon:last-child {
        inset-inline-end: dt('form.field.padding.x');
    }

    .p-iconfield .p-inputtext:not(:first-child),
    .p-iconfield .p-inputwrapper:not(:first-child) .p-inputtext {
        padding-inline-start: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-iconfield .p-inputtext:not(:last-child) {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-iconfield:has(.p-inputfield-sm) .p-inputicon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
        margin-top: calc(-1 * (dt('form.field.sm.font.size') / 2));
    }

    .p-iconfield:has(.p-inputfield-lg) .p-inputicon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
        margin-top: calc(-1 * (dt('form.field.lg.font.size') / 2));
    }
`;var ec=["*"],tc={root:({instance:t})=>["p-iconfield",{"p-iconfield-left":t.iconPosition=="left","p-iconfield-right":t.iconPosition=="right"}]},qo=(()=>{class t extends te{name="iconfield";style=Uo;classes=tc;static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275prov=$({token:t,factory:t.\u0275fac})}return t})();var Wo=new L("ICONFIELD_INSTANCE"),Qo=(()=>{class t extends le{componentName="IconField";hostName="";_componentStyle=b(qo);$pcIconField=b(Wo,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=b(v,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}iconPosition="left";styleClass;static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275cmp=E({type:t,selectors:[["p-iconfield"],["p-iconField"],["p-icon-field"]],hostVars:2,hostBindings:function(n,i){n&2&&h(i.cn(i.cx("root"),i.styleClass))},inputs:{hostName:"hostName",iconPosition:"iconPosition",styleClass:"styleClass"},features:[j([qo,{provide:Wo,useExisting:t},{provide:X,useExisting:t}]),J([v]),M],ngContentSelectors:ec,decls:1,vars:0,template:function(n,i){n&1&&(he(),se(0))},dependencies:[ne,Ee],encapsulation:2,changeDetection:0})}return t})();var nc=["*"],ic={root:"p-inputicon"},Yo=(()=>{class t extends te{name="inputicon";classes=ic;static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275prov=$({token:t,factory:t.\u0275fac})}return t})(),Ko=new L("INPUTICON_INSTANCE"),Zo=(()=>{class t extends le{componentName="InputIcon";hostName="";styleClass;_componentStyle=b(Yo);$pcInputIcon=b(Ko,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=b(v,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275cmp=E({type:t,selectors:[["p-inputicon"],["p-inputIcon"]],hostVars:2,hostBindings:function(n,i){n&2&&h(i.cn(i.cx("root"),i.styleClass))},inputs:{hostName:"hostName",styleClass:"styleClass"},features:[j([Yo,{provide:Ko,useExisting:t},{provide:X,useExisting:t}]),J([v]),M],ngContentSelectors:nc,decls:1,vars:0,template:function(n,i){n&1&&(he(),se(0))},dependencies:[ne,ae,Ee],encapsulation:2,changeDetection:0})}return t})();var Xo={retail:{sector:"Sectores",marca:"Marcas",tienda:"Tiendas",contraparte:"Recaudador"}};function oc(t){return t.charAt(0).toUpperCase()+t.slice(1)}function Jo(t,o,e){return o?.[t]??e[t]??oc(t)}var er=class t{currentUser=bi;labelFor(o){return Jo(o,this.currentUser.vocabularyOverrides,Xo[this.currentUser.rubro])}static \u0275fac=function(e){return new(e||t)};static \u0275prov=$({token:t,factory:t.\u0275fac,providedIn:"root"})};function rc(t,o){if(t&1){let e=V();d(0,"app-month-period-picker",7),ot("selectedIdsChange",function(i){f(e);let r=l();return it(r.periodIds,i)||(r.periodIds=i),g(i)}),u()}if(t&2){let e=l();nt("selectedIds",e.periodIds)}}function ac(t,o){if(t&1){let e=V();d(0,"app-calendar-period-picker",8),ot("selectedIdsChange",function(i){f(e);let r=l();return it(r.periodIds,i)||(r.periodIds=i),g(i)}),u()}if(t&2){let e=l();s("granularity",e.granularity()),nt("selectedIds",e.periodIds)}}var tr=class t{granularity=Be.required();periodIds=Be.required();setGranularity(o){o!==this.granularity()&&(this.granularity.set(o),this.periodIds.set(new Set))}static \u0275fac=function(e){return new(e||t)};static \u0275cmp=E({type:t,selectors:[["app-period-picker"]],inputs:{granularity:[1,"granularity"],periodIds:[1,"periodIds"]},outputs:{granularity:"granularityChange",periodIds:"periodIdsChange"},decls:7,vars:4,consts:[[1,"period-picker-panel"],[1,"period-picker-section","period-picker-granularity"],["label","D\xEDa","size","small","severity","secondary",3,"onClick","outlined"],["label","Semana","size","small","severity","secondary",3,"onClick","outlined"],["label","Mes","size","small","severity","secondary",3,"onClick","outlined"],[3,"selectedIds"],[3,"granularity","selectedIds"],[3,"selectedIdsChange","selectedIds"],[3,"selectedIdsChange","granularity","selectedIds"]],template:function(e,n){e&1&&(d(0,"div",0)(1,"div",1)(2,"p-button",2),w("onClick",function(){return n.setGranularity("dia")}),u(),d(3,"p-button",3),w("onClick",function(){return n.setGranularity("semana")}),u(),d(4,"p-button",4),w("onClick",function(){return n.setGranularity("mes")}),u()(),q(5,rc,1,1,"app-month-period-picker",5)(6,ac,1,2,"app-calendar-period-picker",6),u()),e&2&&(c(2),s("outlined",n.granularity()!=="dia"),c(),s("outlined",n.granularity()!=="semana"),c(),s("outlined",n.granularity()!=="mes"),c(),W(n.granularity()==="mes"?5:6))},dependencies:[st,Mt,Et],styles:["[_nghost-%COMP%]{display:block}.period-picker-panel[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:1.125rem;width:100%}.period-picker-section[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.625rem}.period-picker-granularity[_ngcontent-%COMP%]{flex-direction:row;gap:.5rem}"],changeDetection:0})};var nr=`
    .p-message {
        display: grid;
        grid-template-rows: 1fr;
        border-radius: dt('message.border.radius');
        outline-width: dt('message.border.width');
        outline-style: solid;
    }

    .p-message-content-wrapper {
        min-height: 0;
    }

    .p-message-content {
        display: flex;
        align-items: center;
        padding: dt('message.content.padding');
        gap: dt('message.content.gap');
    }

    .p-message-icon {
        flex-shrink: 0;
    }

    .p-message-close-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-inline-start: auto;
        overflow: hidden;
        position: relative;
        width: dt('message.close.button.width');
        height: dt('message.close.button.height');
        border-radius: dt('message.close.button.border.radius');
        background: transparent;
        transition:
            background dt('message.transition.duration'),
            color dt('message.transition.duration'),
            outline-color dt('message.transition.duration'),
            box-shadow dt('message.transition.duration'),
            opacity 0.3s;
        outline-color: transparent;
        color: inherit;
        padding: 0;
        border: none;
        cursor: pointer;
        user-select: none;
    }

    .p-message-close-icon {
        font-size: dt('message.close.icon.size');
        width: dt('message.close.icon.size');
        height: dt('message.close.icon.size');
    }

    .p-message-close-button:focus-visible {
        outline-width: dt('message.close.button.focus.ring.width');
        outline-style: dt('message.close.button.focus.ring.style');
        outline-offset: dt('message.close.button.focus.ring.offset');
    }

    .p-message-info {
        background: dt('message.info.background');
        outline-color: dt('message.info.border.color');
        color: dt('message.info.color');
        box-shadow: dt('message.info.shadow');
    }

    .p-message-info .p-message-close-button:focus-visible {
        outline-color: dt('message.info.close.button.focus.ring.color');
        box-shadow: dt('message.info.close.button.focus.ring.shadow');
    }

    .p-message-info .p-message-close-button:hover {
        background: dt('message.info.close.button.hover.background');
    }

    .p-message-info.p-message-outlined {
        color: dt('message.info.outlined.color');
        outline-color: dt('message.info.outlined.border.color');
    }

    .p-message-info.p-message-simple {
        color: dt('message.info.simple.color');
    }

    .p-message-success {
        background: dt('message.success.background');
        outline-color: dt('message.success.border.color');
        color: dt('message.success.color');
        box-shadow: dt('message.success.shadow');
    }

    .p-message-success .p-message-close-button:focus-visible {
        outline-color: dt('message.success.close.button.focus.ring.color');
        box-shadow: dt('message.success.close.button.focus.ring.shadow');
    }

    .p-message-success .p-message-close-button:hover {
        background: dt('message.success.close.button.hover.background');
    }

    .p-message-success.p-message-outlined {
        color: dt('message.success.outlined.color');
        outline-color: dt('message.success.outlined.border.color');
    }

    .p-message-success.p-message-simple {
        color: dt('message.success.simple.color');
    }

    .p-message-warn {
        background: dt('message.warn.background');
        outline-color: dt('message.warn.border.color');
        color: dt('message.warn.color');
        box-shadow: dt('message.warn.shadow');
    }

    .p-message-warn .p-message-close-button:focus-visible {
        outline-color: dt('message.warn.close.button.focus.ring.color');
        box-shadow: dt('message.warn.close.button.focus.ring.shadow');
    }

    .p-message-warn .p-message-close-button:hover {
        background: dt('message.warn.close.button.hover.background');
    }

    .p-message-warn.p-message-outlined {
        color: dt('message.warn.outlined.color');
        outline-color: dt('message.warn.outlined.border.color');
    }

    .p-message-warn.p-message-simple {
        color: dt('message.warn.simple.color');
    }

    .p-message-error {
        background: dt('message.error.background');
        outline-color: dt('message.error.border.color');
        color: dt('message.error.color');
        box-shadow: dt('message.error.shadow');
    }

    .p-message-error .p-message-close-button:focus-visible {
        outline-color: dt('message.error.close.button.focus.ring.color');
        box-shadow: dt('message.error.close.button.focus.ring.shadow');
    }

    .p-message-error .p-message-close-button:hover {
        background: dt('message.error.close.button.hover.background');
    }

    .p-message-error.p-message-outlined {
        color: dt('message.error.outlined.color');
        outline-color: dt('message.error.outlined.border.color');
    }

    .p-message-error.p-message-simple {
        color: dt('message.error.simple.color');
    }

    .p-message-secondary {
        background: dt('message.secondary.background');
        outline-color: dt('message.secondary.border.color');
        color: dt('message.secondary.color');
        box-shadow: dt('message.secondary.shadow');
    }

    .p-message-secondary .p-message-close-button:focus-visible {
        outline-color: dt('message.secondary.close.button.focus.ring.color');
        box-shadow: dt('message.secondary.close.button.focus.ring.shadow');
    }

    .p-message-secondary .p-message-close-button:hover {
        background: dt('message.secondary.close.button.hover.background');
    }

    .p-message-secondary.p-message-outlined {
        color: dt('message.secondary.outlined.color');
        outline-color: dt('message.secondary.outlined.border.color');
    }

    .p-message-secondary.p-message-simple {
        color: dt('message.secondary.simple.color');
    }

    .p-message-contrast {
        background: dt('message.contrast.background');
        outline-color: dt('message.contrast.border.color');
        color: dt('message.contrast.color');
        box-shadow: dt('message.contrast.shadow');
    }

    .p-message-contrast .p-message-close-button:focus-visible {
        outline-color: dt('message.contrast.close.button.focus.ring.color');
        box-shadow: dt('message.contrast.close.button.focus.ring.shadow');
    }

    .p-message-contrast .p-message-close-button:hover {
        background: dt('message.contrast.close.button.hover.background');
    }

    .p-message-contrast.p-message-outlined {
        color: dt('message.contrast.outlined.color');
        outline-color: dt('message.contrast.outlined.border.color');
    }

    .p-message-contrast.p-message-simple {
        color: dt('message.contrast.simple.color');
    }

    .p-message-text {
        font-size: dt('message.text.font.size');
        font-weight: dt('message.text.font.weight');
    }

    .p-message-icon {
        font-size: dt('message.icon.size');
        width: dt('message.icon.size');
        height: dt('message.icon.size');
    }

    .p-message-sm .p-message-content {
        padding: dt('message.content.sm.padding');
    }

    .p-message-sm .p-message-text {
        font-size: dt('message.text.sm.font.size');
    }

    .p-message-sm .p-message-icon {
        font-size: dt('message.icon.sm.size');
        width: dt('message.icon.sm.size');
        height: dt('message.icon.sm.size');
    }

    .p-message-sm .p-message-close-icon {
        font-size: dt('message.close.icon.sm.size');
        width: dt('message.close.icon.sm.size');
        height: dt('message.close.icon.sm.size');
    }

    .p-message-lg .p-message-content {
        padding: dt('message.content.lg.padding');
    }

    .p-message-lg .p-message-text {
        font-size: dt('message.text.lg.font.size');
    }

    .p-message-lg .p-message-icon {
        font-size: dt('message.icon.lg.size');
        width: dt('message.icon.lg.size');
        height: dt('message.icon.lg.size');
    }

    .p-message-lg .p-message-close-icon {
        font-size: dt('message.close.icon.lg.size');
        width: dt('message.close.icon.lg.size');
        height: dt('message.close.icon.lg.size');
    }

    .p-message-outlined {
        background: transparent;
        outline-width: dt('message.outlined.border.width');
    }

    .p-message-simple {
        background: transparent;
        outline-color: transparent;
        box-shadow: none;
    }

    .p-message-simple .p-message-content {
        padding: dt('message.simple.content.padding');
    }

    .p-message-outlined .p-message-close-button:hover,
    .p-message-simple .p-message-close-button:hover {
        background: transparent;
    }

    .p-message-enter-active {
        animation: p-animate-message-enter 0.3s ease-out forwards;
        overflow: hidden;
    }

    .p-message-leave-active {
        animation: p-animate-message-leave 0.15s ease-in forwards;
        overflow: hidden;
    }

    @keyframes p-animate-message-enter {
        from {
            opacity: 0;
            grid-template-rows: 0fr;
        }
        to {
            opacity: 1;
            grid-template-rows: 1fr;
        }
    }

    @keyframes p-animate-message-leave {
        from {
            opacity: 1;
            grid-template-rows: 1fr;
        }
        to {
            opacity: 0;
            margin: 0;
            grid-template-rows: 0fr;
        }
    }
`;var sc=["container"],lc=["icon"],cc=["closeicon"],dc=["*"],pc=t=>({closeCallback:t});function uc(t,o){t&1&&B(0)}function mc(t,o){if(t&1&&p(0,uc,1,0,"ng-container",4),t&2){let e=l();s("ngTemplateOutlet",e.iconTemplate||e._iconTemplate)}}function hc(t,o){if(t&1&&N(0,"i",1),t&2){let e=l();h(e.cn(e.cx("icon"),e.icon)),s("pBind",e.ptm("icon")),x("data-p",e.dataP)}}function fc(t,o){t&1&&B(0)}function gc(t,o){if(t&1&&p(0,fc,1,0,"ng-container",5),t&2){let e=l();s("ngTemplateOutlet",e.containerTemplate||e._containerTemplate)("ngTemplateOutletContext",Q(2,pc,e.closeCallback))}}function _c(t,o){if(t&1&&N(0,"span",9),t&2){let e=l(3);s("pBind",e.ptm("text"))("ngClass",e.cx("text"))("innerHTML",e.text,Un),x("data-p",e.dataP)}}function yc(t,o){if(t&1&&(d(0,"div"),p(1,_c,1,4,"span",8),u()),t&2){let e=l(2);c(),s("ngIf",!e.escape)}}function bc(t,o){if(t&1&&(d(0,"span",7),ee(1),u()),t&2){let e=l(3);s("pBind",e.ptm("text"))("ngClass",e.cx("text")),x("data-p",e.dataP),c(),ye(e.text)}}function vc(t,o){if(t&1&&p(0,bc,2,4,"span",10),t&2){let e=l(2);s("ngIf",e.escape&&e.text)}}function Cc(t,o){if(t&1&&(p(0,yc,2,1,"div",6)(1,vc,1,1,"ng-template",null,0,pe),d(3,"span",7),se(4),u()),t&2){let e=we(2),n=l();s("ngIf",!n.escape)("ngIfElse",e),c(3),s("pBind",n.ptm("text"))("ngClass",n.cx("text")),x("data-p",n.dataP)}}function xc(t,o){if(t&1&&N(0,"i",7),t&2){let e=l(2);h(e.cn(e.cx("closeIcon"),e.closeIcon)),s("pBind",e.ptm("closeIcon"))("ngClass",e.closeIcon),x("data-p",e.dataP)}}function wc(t,o){t&1&&B(0)}function Ic(t,o){if(t&1&&p(0,wc,1,0,"ng-container",4),t&2){let e=l(2);s("ngTemplateOutlet",e.closeIconTemplate||e._closeIconTemplate)}}function Tc(t,o){if(t&1&&(F(),N(0,"svg",14)),t&2){let e=l(2);h(e.cx("closeIcon")),s("pBind",e.ptm("closeIcon")),x("data-p",e.dataP)}}function Sc(t,o){if(t&1){let e=V();d(0,"button",11),w("click",function(i){f(e);let r=l();return g(r.close(i))}),q(1,xc,1,5,"i",12),q(2,Ic,1,1,"ng-container"),q(3,Tc,1,4,":svg:svg",13),u()}if(t&2){let e=l();h(e.cx("closeButton")),s("pBind",e.ptm("closeButton")),x("aria-label",e.closeAriaLabel)("data-p",e.dataP),c(),W(e.closeIcon?1:-1),c(),W(e.closeIconTemplate||e._closeIconTemplate?2:-1),c(),W(!e.closeIconTemplate&&!e._closeIconTemplate&&!e.closeIcon?3:-1)}}var kc={root:({instance:t})=>["p-message p-component p-message-"+t.severity,t.variant&&"p-message-"+t.variant,{"p-message-sm":t.size==="small","p-message-lg":t.size==="large"}],contentWrapper:"p-message-content-wrapper",content:"p-message-content",icon:"p-message-icon",text:"p-message-text",closeButton:"p-message-close-button",closeIcon:"p-message-close-icon"},ir=(()=>{class t extends te{name="message";style=nr;classes=kc;static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275prov=$({token:t,factory:t.\u0275fac})}return t})();var or=new L("MESSAGE_INSTANCE"),S0=(()=>{class t extends le{componentName="Message";_componentStyle=b(ir);bindDirectiveInstance=b(v,{self:!0});$pcMessage=b(or,{optional:!0,skipSelf:!0})??void 0;onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}severity="info";text;escape=!0;style;styleClass;closable=!1;icon;closeIcon;life;showTransitionOptions="300ms ease-out";hideTransitionOptions="200ms cubic-bezier(0.86, 0, 0.07, 1)";size;variant;motionOptions=k(void 0);computedMotionOptions=A(()=>P(P({},this.ptm("motion")),this.motionOptions()));onClose=new S;get closeAriaLabel(){return this.config.translation.aria?this.config.translation.aria.close:void 0}visible=U(!0);containerTemplate;iconTemplate;closeIconTemplate;templates;_containerTemplate;_iconTemplate;_closeIconTemplate;closeCallback=e=>{this.close(e)};onInit(){this.life&&setTimeout(()=>{this.visible.set(!1)},this.life)}onAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"container":this._containerTemplate=e.template;break;case"icon":this._iconTemplate=e.template;break;case"closeicon":this._closeIconTemplate=e.template;break}})}close(e){this.visible.set(!1),this.onClose.emit({originalEvent:e})}get dataP(){return this.cn({outlined:this.variant==="outlined",simple:this.variant==="simple",[this.severity]:this.severity,[this.size]:this.size})}static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275cmp=E({type:t,selectors:[["p-message"]],contentQueries:function(n,i,r){if(n&1&&fe(r,sc,4)(r,lc,4)(r,cc,4)(r,ce,4),n&2){let a;_(a=y())&&(i.containerTemplate=a.first),_(a=y())&&(i.iconTemplate=a.first),_(a=y())&&(i.closeIconTemplate=a.first),_(a=y())&&(i.templates=a)}},hostAttrs:["role","alert","aria-live","polite"],hostVars:5,hostBindings:function(n,i){n&1&&(Yn(function(){return"p-message-enter-active"}),Kn(function(){return"p-message-leave-active"})),n&2&&(x("data-p",i.dataP),h(i.cn(i.cx("root"),i.styleClass)),Ne("p-message-leave-active",!i.visible()))},inputs:{severity:"severity",text:"text",escape:[2,"escape","escape",C],style:"style",styleClass:"styleClass",closable:[2,"closable","closable",C],icon:"icon",closeIcon:"closeIcon",life:"life",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",size:"size",variant:"variant",motionOptions:[1,"motionOptions"]},outputs:{onClose:"onClose"},features:[j([ir,{provide:or,useExisting:t},{provide:X,useExisting:t}]),J([v]),M],ngContentSelectors:dc,decls:7,vars:12,consts:[["escapeOut",""],[3,"pBind"],[3,"pBind","class"],["pRipple","","type","button",3,"pBind","class"],[4,"ngTemplateOutlet"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[4,"ngIf","ngIfElse"],[3,"pBind","ngClass"],[3,"pBind","ngClass","innerHTML",4,"ngIf"],[3,"pBind","ngClass","innerHTML"],[3,"pBind","ngClass",4,"ngIf"],["pRipple","","type","button",3,"click","pBind"],[3,"pBind","class","ngClass"],["data-p-icon","times",3,"pBind","class"],["data-p-icon","times",3,"pBind"]],template:function(n,i){n&1&&(he(),d(0,"div",1)(1,"div",1),q(2,mc,1,1,"ng-container"),q(3,hc,1,4,"i",2),q(4,gc,1,4,"ng-container")(5,Cc,5,5),q(6,Sc,4,8,"button",3),u()()),n&2&&(h(i.cx("contentWrapper")),s("pBind",i.ptm("contentWrapper")),x("data-p",i.dataP),c(),h(i.cx("content")),s("pBind",i.ptm("content")),x("data-p",i.dataP),c(),W(i.iconTemplate||i._iconTemplate?2:-1),c(),W(i.icon?3:-1),c(),W(i.containerTemplate||i._containerTemplate?4:5),c(2),W(i.closable?6:-1))},dependencies:[ne,at,Ie,ue,wt,Xt,ae,v,lt],encapsulation:2,changeDetection:0})}return t})();var Mc=new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0});function E0(t){let o=t<0,e=Mc.format(Math.abs(t));return{text:o?`(${e})`:e,isNegative:o}}var Ec=-5;function D0(t,o="higher-good",e=0){if(t===null||e>0&&Math.abs(t)<=e)return"medium";let n=o==="lower-good"?-t:t;return n>=0?"good":n<=Ec?"bad":"medium"}var Dc=80,Vc=50;function V0(t){if(t===null)return"medium";let o=t+100;return o>=Dc?"good":o<Vc?"bad":"medium"}var rr=(()=>{class t extends kt{pcFluid=b(Kt,{optional:!0,host:!0,skipSelf:!0});fluid=k(void 0,{transform:C});variant=k();size=k();inputSize=k();pattern=k();min=k();max=k();step=k();minlength=k();maxlength=k();$variant=A(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());get hasFluid(){return this.fluid()??!!this.pcFluid}static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275dir=Te({type:t,inputs:{fluid:[1,"fluid"],variant:[1,"variant"],size:[1,"size"],inputSize:[1,"inputSize"],pattern:[1,"pattern"],min:[1,"min"],max:[1,"max"],step:[1,"step"],minlength:[1,"minlength"],maxlength:[1,"maxlength"]},features:[M]})}return t})();var ar=["content"],Ac=["overlay"],sr=["*","*"],Fc=()=>({mode:null}),dr=t=>({$implicit:t}),Pc=t=>({mode:t});function Nc(t,o){t&1&&B(0)}function Bc(t,o){if(t&1&&(se(0),p(1,Nc,1,0,"ng-container",3)),t&2){let e=l();c(),s("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",Q(3,dr,bt(2,Fc)))}}function Lc(t,o){t&1&&B(0)}function zc(t,o){if(t&1){let e=V();d(0,"div",5,0),w("click",function(){f(e);let i=l(2);return g(i.onOverlayClick())}),d(2,"p-motion",6),w("onBeforeEnter",function(i){f(e);let r=l(2);return g(r.onOverlayBeforeEnter(i))})("onEnter",function(i){f(e);let r=l(2);return g(r.onOverlayEnter(i))})("onAfterEnter",function(i){f(e);let r=l(2);return g(r.onOverlayAfterEnter(i))})("onBeforeLeave",function(i){f(e);let r=l(2);return g(r.onOverlayBeforeLeave(i))})("onLeave",function(i){f(e);let r=l(2);return g(r.onOverlayLeave(i))})("onAfterLeave",function(i){f(e);let r=l(2);return g(r.onOverlayAfterLeave(i))}),d(3,"div",5,1),w("click",function(i){f(e);let r=l(2);return g(r.onOverlayContentClick(i))}),se(5,1),p(6,Lc,1,0,"ng-container",3),u()()()}if(t&2){let e=l(2);ge(e.sx("root")),h(e.cn(e.cx("root"),e.styleClass)),s("pBind",e.ptm("root")),c(2),s("visible",e.visible)("appear",!0)("options",e.computedMotionOptions()),c(),h(e.cn(e.cx("content"),e.contentStyleClass)),s("pBind",e.ptm("content")),c(3),s("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",Q(15,dr,Q(13,Pc,e.overlayMode)))}}function Rc(t,o){if(t&1&&p(0,zc,7,17,"div",4),t&2){let e=l();s("ngIf",e.modalVisible)}}var Hc={root:()=>({position:"absolute",top:"0"})},jc=`
.p-overlay-modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.p-overlay-content {
    transform-origin: inherit;
    will-change: transform;
}

/* Github Issue #18560 */
.p-component-overlay.p-component {
    position: relative;
}

.p-overlay-modal > .p-overlay-content {
    z-index: 1;
    width: 90%;
}

/* Position */
/* top */
.p-overlay-top {
    align-items: flex-start;
}
.p-overlay-top-start {
    align-items: flex-start;
    justify-content: flex-start;
}
.p-overlay-top-end {
    align-items: flex-start;
    justify-content: flex-end;
}

/* bottom */
.p-overlay-bottom {
    align-items: flex-end;
}
.p-overlay-bottom-start {
    align-items: flex-end;
    justify-content: flex-start;
}
.p-overlay-bottom-end {
    align-items: flex-end;
    justify-content: flex-end;
}

/* left */
.p-overlay-left {
    justify-content: flex-start;
}
.p-overlay-left-start {
    justify-content: flex-start;
    align-items: flex-start;
}
.p-overlay-left-end {
    justify-content: flex-start;
    align-items: flex-end;
}

/* right */
.p-overlay-right {
    justify-content: flex-end;
}
.p-overlay-right-start {
    justify-content: flex-end;
    align-items: flex-start;
}
.p-overlay-right-end {
    justify-content: flex-end;
    align-items: flex-end;
}

.p-overlay-content ~ .p-overlay-content {
    display: none;
}
`,Gc={host:"p-overlay-host",root:({instance:t})=>["p-overlay p-component",{"p-overlay-modal p-overlay-mask p-overlay-mask-enter-active":t.modal,"p-overlay-center":t.modal&&t.overlayResponsiveDirection==="center","p-overlay-top":t.modal&&t.overlayResponsiveDirection==="top","p-overlay-top-start":t.modal&&t.overlayResponsiveDirection==="top-start","p-overlay-top-end":t.modal&&t.overlayResponsiveDirection==="top-end","p-overlay-bottom":t.modal&&t.overlayResponsiveDirection==="bottom","p-overlay-bottom-start":t.modal&&t.overlayResponsiveDirection==="bottom-start","p-overlay-bottom-end":t.modal&&t.overlayResponsiveDirection==="bottom-end","p-overlay-left":t.modal&&t.overlayResponsiveDirection==="left","p-overlay-left-start":t.modal&&t.overlayResponsiveDirection==="left-start","p-overlay-left-end":t.modal&&t.overlayResponsiveDirection==="left-end","p-overlay-right":t.modal&&t.overlayResponsiveDirection==="right","p-overlay-right-start":t.modal&&t.overlayResponsiveDirection==="right-start","p-overlay-right-end":t.modal&&t.overlayResponsiveDirection==="right-end"}],content:"p-overlay-content"},lr=(()=>{class t extends te{name="overlay";style=jc;classes=Gc;inlineStyles=Hc;static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275prov=$({token:t,factory:t.\u0275fac})}return t})(),cr=new L("OVERLAY_INSTANCE"),pr=(()=>{class t extends le{overlayService;zone;componentName="Overlay";$pcOverlay=b(cr,{optional:!0,skipSelf:!0})??void 0;hostName="";get visible(){return this._visible}set visible(e){this._visible=e,this._visible&&!this.modalVisible&&(this.modalVisible=!0)}get mode(){return this._mode||this.overlayOptions?.mode}set mode(e){this._mode=e}get style(){return Ft.merge(this._style,this.modal?this.overlayResponsiveOptions?.style:this.overlayOptions?.style)}set style(e){this._style=e}get styleClass(){return Ft.merge(this._styleClass,this.modal?this.overlayResponsiveOptions?.styleClass:this.overlayOptions?.styleClass)}set styleClass(e){this._styleClass=e}get contentStyle(){return Ft.merge(this._contentStyle,this.modal?this.overlayResponsiveOptions?.contentStyle:this.overlayOptions?.contentStyle)}set contentStyle(e){this._contentStyle=e}get contentStyleClass(){return Ft.merge(this._contentStyleClass,this.modal?this.overlayResponsiveOptions?.contentStyleClass:this.overlayOptions?.contentStyleClass)}set contentStyleClass(e){this._contentStyleClass=e}get target(){let e=this._target||this.overlayOptions?.target;return e===void 0?"@prev":e}set target(e){this._target=e}get autoZIndex(){let e=this._autoZIndex||this.overlayOptions?.autoZIndex;return e===void 0?!0:e}set autoZIndex(e){this._autoZIndex=e}get baseZIndex(){let e=this._baseZIndex||this.overlayOptions?.baseZIndex;return e===void 0?0:e}set baseZIndex(e){this._baseZIndex=e}get showTransitionOptions(){let e=this._showTransitionOptions||this.overlayOptions?.showTransitionOptions;return e===void 0?".12s cubic-bezier(0, 0, 0.2, 1)":e}set showTransitionOptions(e){this._showTransitionOptions=e}get hideTransitionOptions(){let e=this._hideTransitionOptions||this.overlayOptions?.hideTransitionOptions;return e===void 0?".1s linear":e}set hideTransitionOptions(e){this._hideTransitionOptions=e}get listener(){return this._listener||this.overlayOptions?.listener}set listener(e){this._listener=e}get responsive(){return this._responsive||this.overlayOptions?.responsive}set responsive(e){this._responsive=e}get options(){return this._options}set options(e){this._options=e}appendTo=k(void 0);inline=k(!1);motionOptions=k(void 0);computedMotionOptions=A(()=>P(P({},this.ptm("motion")),this.motionOptions()||this.overlayOptions?.motionOptions));visibleChange=new S;onBeforeShow=new S;onShow=new S;onBeforeHide=new S;onHide=new S;onAnimationStart=new S;onAnimationDone=new S;onBeforeEnter=new S;onEnter=new S;onAfterEnter=new S;onBeforeLeave=new S;onLeave=new S;onAfterLeave=new S;overlayViewChild;contentViewChild;contentTemplate;templates;hostAttrSelector=k();$appendTo=A(()=>this.appendTo()||this.config.overlayAppendTo());_contentTemplate;_visible=!1;_mode;_style;_styleClass;_contentStyle;_contentStyleClass;_target;_autoZIndex;_baseZIndex;_showTransitionOptions;_hideTransitionOptions;_listener;_responsive;_options;modalVisible=!1;isOverlayClicked=!1;isOverlayContentClicked=!1;scrollHandler;documentClickListener;documentResizeListener;_componentStyle=b(lr);bindDirectiveInstance=b(v,{self:!0});documentKeyboardListener;parentDragSubscription=null;window;transformOptions={default:"scaleY(0.8)",center:"scale(0.7)",top:"translate3d(0px, -100%, 0px)","top-start":"translate3d(0px, -100%, 0px)","top-end":"translate3d(0px, -100%, 0px)",bottom:"translate3d(0px, 100%, 0px)","bottom-start":"translate3d(0px, 100%, 0px)","bottom-end":"translate3d(0px, 100%, 0px)",left:"translate3d(-100%, 0px, 0px)","left-start":"translate3d(-100%, 0px, 0px)","left-end":"translate3d(-100%, 0px, 0px)",right:"translate3d(100%, 0px, 0px)","right-start":"translate3d(100%, 0px, 0px)","right-end":"translate3d(100%, 0px, 0px)"};get modal(){if(Le(this.platformId))return this.mode==="modal"||this.overlayResponsiveOptions&&this.document.defaultView?.matchMedia(this.overlayResponsiveOptions.media?.replace("@media","")||`(max-width: ${this.overlayResponsiveOptions.breakpoint})`).matches}get overlayMode(){return this.mode||(this.modal?"modal":"overlay")}get overlayOptions(){return P(P({},this.config?.overlayOptions),this.options)}get overlayResponsiveOptions(){return P(P({},this.overlayOptions?.responsive),this.responsive)}get overlayResponsiveDirection(){return this.overlayResponsiveOptions?.direction||"center"}get overlayEl(){return this.overlayViewChild?.nativeElement}get contentEl(){return this.contentViewChild?.nativeElement}get targetEl(){return ai(this.target,this.el?.nativeElement)}constructor(e,n){super(),this.overlayService=e,this.zone=n}onAfterContentInit(){this.templates?.forEach(e=>{e.getType()==="content"?this._contentTemplate=e.template:this._contentTemplate=e.template})}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("host"))}show(e,n=!1){this.onVisibleChange(!0),this.handleEvents("onShow",{overlay:e||this.overlayEl,target:this.targetEl,mode:this.overlayMode}),n&&ze(this.targetEl),this.modal&&Ut(this.document?.body,"p-overflow-hidden")}hide(e,n=!1){if(this.visible)this.onVisibleChange(!1),this.handleEvents("onHide",{overlay:e||this.overlayEl,target:this.targetEl,mode:this.overlayMode}),n&&ze(this.targetEl),this.modal&&Vt(this.document?.body,"p-overflow-hidden");else return}onVisibleChange(e){this._visible=e,this.visibleChange.emit(e)}onOverlayClick(){this.isOverlayClicked=!0}onOverlayContentClick(e){this.overlayService.add({originalEvent:e,target:this.targetEl}),this.isOverlayContentClicked=!0}container=U(void 0);onOverlayBeforeEnter(e){this.handleEvents("onBeforeShow",{overlay:this.overlayEl,target:this.targetEl,mode:this.overlayMode}),this.container.set(this.overlayEl||e.element),this.show(this.overlayEl,!0),this.hostAttrSelector()&&this.overlayEl&&this.overlayEl.setAttribute(this.hostAttrSelector(),""),this.appendOverlay(),this.alignOverlay(),this.bindParentDragListener(),this.setZIndex(),this.handleEvents("onBeforeEnter",e)}onOverlayEnter(e){this.handleEvents("onEnter",e)}onOverlayAfterEnter(e){this.bindListeners(),this.handleEvents("onAfterEnter",e)}onOverlayBeforeLeave(e){this.handleEvents("onBeforeHide",{overlay:this.overlayEl,target:this.targetEl,mode:this.overlayMode}),this.handleEvents("onBeforeLeave",e)}onOverlayLeave(e){this.handleEvents("onLeave",e)}onOverlayAfterLeave(e){this.hide(this.overlayEl,!0),this.container.set(null),this.unbindListeners(),this.appendOverlay(),ke.clear(this.overlayEl),this.modalVisible=!1,this.cd.markForCheck(),this.handleEvents("onAfterLeave",e)}handleEvents(e,n){this[e].emit(n),this.options&&this.options[e]&&this.options[e](n),this.config?.overlayOptions&&(this.config?.overlayOptions)[e]&&(this.config?.overlayOptions)[e](n)}setZIndex(){this.autoZIndex&&ke.set(this.overlayMode,this.overlayEl,this.baseZIndex+this.config?.zIndex[this.overlayMode])}appendOverlay(){this.$appendTo()&&this.$appendTo()!=="self"&&(this.$appendTo()==="body"?Ze(this.document.body,this.overlayEl):Ze(this.$appendTo(),this.overlayEl))}alignOverlay(){this.modal||this.overlayEl&&this.targetEl&&(this.overlayEl.style.minWidth=Ot(this.targetEl)+"px",this.$appendTo()==="self"?ri(this.overlayEl,this.targetEl):qt(this.overlayEl,this.targetEl))}bindListeners(){this.bindScrollListener(),this.bindDocumentClickListener(),this.bindDocumentResizeListener(),this.bindDocumentKeyboardListener()}unbindListeners(){this.unbindScrollListener(),this.unbindDocumentClickListener(),this.unbindDocumentResizeListener(),this.unbindDocumentKeyboardListener(),this.unbindParentDragListener()}bindParentDragListener(){!this.parentDragSubscription&&this.$appendTo()!=="self"&&this.targetEl&&(this.parentDragSubscription=this.overlayService.parentDragObservable.subscribe(e=>{e.contains(this.targetEl)&&this.hide(this.overlayEl,!0)}))}unbindParentDragListener(){this.parentDragSubscription&&(this.parentDragSubscription.unsubscribe(),this.parentDragSubscription=null)}bindScrollListener(){this.scrollHandler||(this.scrollHandler=new Qt(this.targetEl,e=>{(!this.listener||this.listener(e,{type:"scroll",mode:this.overlayMode,valid:!0}))&&this.hide(e,!0)})),this.scrollHandler.bindScrollListener()}unbindScrollListener(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()}bindDocumentClickListener(){this.documentClickListener||(this.documentClickListener=this.renderer.listen(this.document,"click",e=>{let i=!(this.targetEl&&(this.targetEl.isSameNode(e.target)||!this.isOverlayClicked&&this.targetEl.contains(e.target)))&&!this.isOverlayContentClicked;(this.listener?this.listener(e,{type:"outside",mode:this.overlayMode,valid:e.which!==3&&i}):i)&&this.hide(e),this.isOverlayClicked=this.isOverlayContentClicked=!1}))}unbindDocumentClickListener(){this.documentClickListener&&(this.documentClickListener(),this.documentClickListener=null)}bindDocumentResizeListener(){this.documentResizeListener||(this.documentResizeListener=this.renderer.listen(this.document.defaultView,"resize",e=>{(this.listener?this.listener(e,{type:"resize",mode:this.overlayMode,valid:!Xe()}):!Xe())&&this.hide(e,!0)}))}unbindDocumentResizeListener(){this.documentResizeListener&&(this.documentResizeListener(),this.documentResizeListener=null)}bindDocumentKeyboardListener(){this.documentKeyboardListener||this.zone.runOutsideAngular(()=>{this.documentKeyboardListener=this.renderer.listen(this.document.defaultView,"keydown",e=>{if(this.overlayOptions.hideOnEscape===!1||e.code!=="Escape")return;(this.listener?this.listener(e,{type:"keydown",mode:this.overlayMode,valid:!Xe()}):!Xe())&&this.zone.run(()=>{this.hide(e,!0)})})})}unbindDocumentKeyboardListener(){this.documentKeyboardListener&&(this.documentKeyboardListener(),this.documentKeyboardListener=null)}onDestroy(){this.hide(this.overlayEl,!0),this.overlayEl&&this.$appendTo()!=="self"&&(this.renderer.appendChild(this.el.nativeElement,this.overlayEl),ke.clear(this.overlayEl)),this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null),this.unbindListeners()}static \u0275fac=function(n){return new(n||t)(de(xt),de(je))};static \u0275cmp=E({type:t,selectors:[["p-overlay"]],contentQueries:function(n,i,r){if(n&1&&fe(r,ar,4)(r,ce,4),n&2){let a;_(a=y())&&(i.contentTemplate=a.first),_(a=y())&&(i.templates=a)}},viewQuery:function(n,i){if(n&1&&Ae(Ac,5)(ar,5),n&2){let r;_(r=y())&&(i.overlayViewChild=r.first),_(r=y())&&(i.contentViewChild=r.first)}},inputs:{hostName:"hostName",visible:"visible",mode:"mode",style:"style",styleClass:"styleClass",contentStyle:"contentStyle",contentStyleClass:"contentStyleClass",target:"target",autoZIndex:"autoZIndex",baseZIndex:"baseZIndex",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",listener:"listener",responsive:"responsive",options:"options",appendTo:[1,"appendTo"],inline:[1,"inline"],motionOptions:[1,"motionOptions"],hostAttrSelector:[1,"hostAttrSelector"]},outputs:{visibleChange:"visibleChange",onBeforeShow:"onBeforeShow",onShow:"onShow",onBeforeHide:"onBeforeHide",onHide:"onHide",onAnimationStart:"onAnimationStart",onAnimationDone:"onAnimationDone",onBeforeEnter:"onBeforeEnter",onEnter:"onEnter",onAfterEnter:"onAfterEnter",onBeforeLeave:"onBeforeLeave",onLeave:"onLeave",onAfterLeave:"onAfterLeave"},features:[j([lr,{provide:cr,useExisting:t},{provide:X,useExisting:t}]),J([v]),M],ngContentSelectors:sr,decls:2,vars:1,consts:[["overlay",""],["content",""],[3,"class","style","pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"class","style","pBind","click",4,"ngIf"],[3,"click","pBind"],["name","p-anchored-overlay",3,"onBeforeEnter","onEnter","onAfterEnter","onBeforeLeave","onLeave","onAfterLeave","visible","appear","options"]],template:function(n,i){n&1&&(he(sr),q(0,Bc,2,5)(1,Rc,1,1,"div",2)),n&2&&W(i.inline()?0:1)},dependencies:[ne,Ie,ue,ae,v,lt,Ci],encapsulation:2,changeDetection:0})}return t})();var ur=["content"],$c=["item"],Uc=["loader"],qc=["loadericon"],Wc=["element"],Qc=["*"],Ln=(t,o)=>({$implicit:t,options:o}),Yc=t=>({numCols:t}),fr=t=>({options:t}),Kc=()=>({styleClass:"p-virtualscroller-loading-icon"}),Zc=(t,o)=>({rows:t,columns:o});function Xc(t,o){t&1&&B(0)}function Jc(t,o){if(t&1&&(R(0),p(1,Xc,1,0,"ng-container",10),H()),t&2){let e=l(2);c(),s("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",rt(2,Ln,e.loadedItems,e.getContentOptions()))}}function ed(t,o){t&1&&B(0)}function td(t,o){if(t&1&&(R(0),p(1,ed,1,0,"ng-container",10),H()),t&2){let e=o.$implicit,n=o.index,i=l(3);c(),s("ngTemplateOutlet",i.itemTemplate||i._itemTemplate)("ngTemplateOutletContext",rt(2,Ln,e,i.getOptions(n)))}}function nd(t,o){if(t&1&&(d(0,"div",11,3),p(2,td,2,5,"ng-container",12),u()),t&2){let e=l(2);ge(e.contentStyle),h(e.cn(e.cx("content"),e.contentStyleClass)),s("pBind",e.ptm("content")),c(2),s("ngForOf",e.loadedItems)("ngForTrackBy",e._trackBy)}}function id(t,o){if(t&1&&N(0,"div",13),t&2){let e=l(2);h(e.cx("spacer")),s("ngStyle",e.spacerStyle)("pBind",e.ptm("spacer"))}}function od(t,o){t&1&&B(0)}function rd(t,o){if(t&1&&(R(0),p(1,od,1,0,"ng-container",10),H()),t&2){let e=o.index,n=l(4);c(),s("ngTemplateOutlet",n.loaderTemplate||n._loaderTemplate)("ngTemplateOutletContext",Q(4,fr,n.getLoaderOptions(e,n.both&&Q(2,Yc,n.numItemsInViewport.cols))))}}function ad(t,o){if(t&1&&(R(0),p(1,rd,2,6,"ng-container",14),H()),t&2){let e=l(3);c(),s("ngForOf",e.loaderArr)}}function sd(t,o){t&1&&B(0)}function ld(t,o){if(t&1&&(R(0),p(1,sd,1,0,"ng-container",10),H()),t&2){let e=l(4);c(),s("ngTemplateOutlet",e.loaderIconTemplate||e._loaderIconTemplate)("ngTemplateOutletContext",Q(3,fr,bt(2,Kc)))}}function cd(t,o){if(t&1&&(F(),N(0,"svg",15)),t&2){let e=l(4);h(e.cx("loadingIcon")),s("spin",!0)("pBind",e.ptm("loadingIcon"))}}function dd(t,o){if(t&1&&p(0,ld,2,5,"ng-container",6)(1,cd,1,4,"ng-template",null,5,pe),t&2){let e=we(2),n=l(3);s("ngIf",n.loaderIconTemplate||n._loaderIconTemplate)("ngIfElse",e)}}function pd(t,o){if(t&1&&(d(0,"div",11),p(1,ad,2,1,"ng-container",6)(2,dd,3,2,"ng-template",null,4,pe),u()),t&2){let e=we(3),n=l(2);h(n.cx("loader")),s("pBind",n.ptm("loader")),c(),s("ngIf",n.loaderTemplate||n._loaderTemplate)("ngIfElse",e)}}function ud(t,o){if(t&1){let e=V();R(0),d(1,"div",7,1),w("scroll",function(i){f(e);let r=l();return g(r.onContainerScroll(i))}),p(3,Jc,2,5,"ng-container",6)(4,nd,3,7,"ng-template",null,2,pe)(6,id,1,4,"div",8)(7,pd,4,5,"div",9),u(),H()}if(t&2){let e=we(5),n=l();c(),h(n.cn(n.cx("root"),n.styleClass)),s("ngStyle",n._style)("pBind",n.ptm("root")),x("id",n._id)("tabindex",n.tabindex),c(2),s("ngIf",n.contentTemplate||n._contentTemplate)("ngIfElse",e),c(3),s("ngIf",n._showSpacer),c(),s("ngIf",!n.loaderDisabled&&n._showLoader&&n.d_loading)}}function md(t,o){t&1&&B(0)}function hd(t,o){if(t&1&&(R(0),p(1,md,1,0,"ng-container",10),H()),t&2){let e=l(2);c(),s("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",rt(5,Ln,e.items,rt(2,Zc,e._items,e.loadedColumns)))}}function fd(t,o){if(t&1&&(se(0),p(1,hd,2,8,"ng-container",16)),t&2){let e=l();c(),s("ngIf",e.contentTemplate||e._contentTemplate)}}var gd=`
.p-virtualscroller {
    position: relative;
    overflow: auto;
    contain: strict;
    transform: translateZ(0);
    will-change: scroll-position;
    outline: 0 none;
}

.p-virtualscroller-content {
    position: absolute;
    top: 0;
    left: 0;
    min-height: 100%;
    min-width: 100%;
    will-change: transform;
}

.p-virtualscroller-spacer {
    position: absolute;
    top: 0;
    left: 0;
    height: 1px;
    width: 1px;
    transform-origin: 0 0;
    pointer-events: none;
}

.p-virtualscroller-loader {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: dt('virtualscroller.loader.mask.background');
    color: dt('virtualscroller.loader.mask.color');
}

.p-virtualscroller-loader-mask {
    display: flex;
    align-items: center;
    justify-content: center;
}

.p-virtualscroller-loading-icon {
    font-size: dt('virtualscroller.loader.icon.size');
    width: dt('virtualscroller.loader.icon.size');
    height: dt('virtualscroller.loader.icon.size');
}

.p-virtualscroller-horizontal > .p-virtualscroller-content {
    display: flex;
}

.p-virtualscroller-inline .p-virtualscroller-content {
    position: static;
}
`,_d={root:({instance:t})=>["p-virtualscroller",{"p-virtualscroller-inline":t.inline,"p-virtualscroller-both p-both-scroll":t.both,"p-virtualscroller-horizontal p-horizontal-scroll":t.horizontal}],content:"p-virtualscroller-content",spacer:"p-virtualscroller-spacer",loader:({instance:t})=>["p-virtualscroller-loader",{"p-virtualscroller-loader-mask":!t.loaderTemplate}],loadingIcon:"p-virtualscroller-loading-icon"},mr=(()=>{class t extends te{name="virtualscroller";css=gd;classes=_d;static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275prov=$({token:t,factory:t.\u0275fac})}return t})();var hr=new L("SCROLLER_INSTANCE"),gr=(()=>{class t extends le{zone;componentName="VirtualScroller";bindDirectiveInstance=b(v,{self:!0});$pcScroller=b(hr,{optional:!0,skipSelf:!0})??void 0;hostName="";get id(){return this._id}set id(e){this._id=e}get style(){return this._style}set style(e){this._style=e}get styleClass(){return this._styleClass}set styleClass(e){this._styleClass=e}get tabindex(){return this._tabindex}set tabindex(e){this._tabindex=e}get items(){return this._items}set items(e){this._items=e}get itemSize(){return this._itemSize}set itemSize(e){this._itemSize=e}get scrollHeight(){return this._scrollHeight}set scrollHeight(e){this._scrollHeight=e}get scrollWidth(){return this._scrollWidth}set scrollWidth(e){this._scrollWidth=e}get orientation(){return this._orientation}set orientation(e){this._orientation=e}get step(){return this._step}set step(e){this._step=e}get delay(){return this._delay}set delay(e){this._delay=e}get resizeDelay(){return this._resizeDelay}set resizeDelay(e){this._resizeDelay=e}get appendOnly(){return this._appendOnly}set appendOnly(e){this._appendOnly=e}get inline(){return this._inline}set inline(e){this._inline=e}get lazy(){return this._lazy}set lazy(e){this._lazy=e}get disabled(){return this._disabled}set disabled(e){this._disabled=e}get loaderDisabled(){return this._loaderDisabled}set loaderDisabled(e){this._loaderDisabled=e}get columns(){return this._columns}set columns(e){this._columns=e}get showSpacer(){return this._showSpacer}set showSpacer(e){this._showSpacer=e}get showLoader(){return this._showLoader}set showLoader(e){this._showLoader=e}get numToleratedItems(){return this._numToleratedItems}set numToleratedItems(e){this._numToleratedItems=e}get loading(){return this._loading}set loading(e){this._loading=e}get autoSize(){return this._autoSize}set autoSize(e){this._autoSize=e}get trackBy(){return this._trackBy}set trackBy(e){this._trackBy=e}get options(){return this._options}set options(e){this._options=e,e&&typeof e=="object"&&(Object.entries(e).forEach(([n,i])=>this[`_${n}`]!==i&&(this[`_${n}`]=i)),Object.entries(e).forEach(([n,i])=>this[`${n}`]!==i&&(this[`${n}`]=i)))}onLazyLoad=new S;onScroll=new S;onScrollIndexChange=new S;elementViewChild;contentViewChild;height;_id;_style;_styleClass;_tabindex=0;_items;_itemSize=0;_scrollHeight;_scrollWidth;_orientation="vertical";_step=0;_delay=0;_resizeDelay=10;_appendOnly=!1;_inline=!1;_lazy=!1;_disabled=!1;_loaderDisabled=!1;_columns;_showSpacer=!0;_showLoader=!1;_numToleratedItems;_loading;_autoSize=!1;_trackBy;_options;d_loading=!1;d_numToleratedItems;contentEl;contentTemplate;itemTemplate;loaderTemplate;loaderIconTemplate;templates;_contentTemplate;_itemTemplate;_loaderTemplate;_loaderIconTemplate;first=0;last=0;page=0;isRangeChanged=!1;numItemsInViewport=0;lastScrollPos=0;lazyLoadState={};loaderArr=[];spacerStyle={};contentStyle={};scrollTimeout;resizeTimeout;initialized=!1;windowResizeListener;defaultWidth;defaultHeight;defaultContentWidth;defaultContentHeight;_contentStyleClass;get contentStyleClass(){return this._contentStyleClass}set contentStyleClass(e){this._contentStyleClass=e}get vertical(){return this._orientation==="vertical"}get horizontal(){return this._orientation==="horizontal"}get both(){return this._orientation==="both"}get loadedItems(){return this._items&&!this.d_loading?this.both?this._items.slice(this._appendOnly?0:this.first.rows,this.last.rows).map(e=>this._columns?e:Array.isArray(e)?e.slice(this._appendOnly?0:this.first.cols,this.last.cols):e):this.horizontal&&this._columns?this._items:this._items.slice(this._appendOnly?0:this.first,this.last):[]}get loadedRows(){return this.d_loading?this._loaderDisabled?this.loaderArr:[]:this.loadedItems}get loadedColumns(){return this._columns&&(this.both||this.horizontal)?this.d_loading&&this._loaderDisabled?this.both?this.loaderArr[0]:this.loaderArr:this._columns.slice(this.both?this.first.cols:this.first,this.both?this.last.cols:this.last):this._columns}_componentStyle=b(mr);constructor(e){super(),this.zone=e}onInit(){this.setInitialState()}onChanges(e){let n=!1;if(this.scrollHeight=="100%"&&(this.height="100%"),e.loading){let{previousValue:i,currentValue:r}=e.loading;this.lazy&&i!==r&&r!==this.d_loading&&(this.d_loading=r,n=!0)}if(e.orientation&&(this.lastScrollPos=this.both?{top:0,left:0}:0),e.numToleratedItems){let{previousValue:i,currentValue:r}=e.numToleratedItems;i!==r&&r!==this.d_numToleratedItems&&(this.d_numToleratedItems=r)}if(e.options){let{previousValue:i,currentValue:r}=e.options;this.lazy&&i?.loading!==r?.loading&&r?.loading!==this.d_loading&&(this.d_loading=r.loading,n=!0),i?.numToleratedItems!==r?.numToleratedItems&&r?.numToleratedItems!==this.d_numToleratedItems&&(this.d_numToleratedItems=r.numToleratedItems)}this.initialized&&!n&&(e.items?.previousValue?.length!==e.items?.currentValue?.length||e.itemSize||e.scrollHeight||e.scrollWidth)&&this.init()}onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"content":this._contentTemplate=e.template;break;case"item":this._itemTemplate=e.template;break;case"loader":this._loaderTemplate=e.template;break;case"loadericon":this._loaderIconTemplate=e.template;break;default:this._itemTemplate=e.template;break}})}onAfterViewInit(){Promise.resolve().then(()=>{this.viewInit()})}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("host")),this.initialized||this.viewInit()}onDestroy(){this.unbindResizeListener(),this.contentEl=null,this.initialized=!1}viewInit(){Le(this.platformId)&&!this.initialized&&xn(this.elementViewChild?.nativeElement)&&(this.setInitialState(),this.setContentEl(this.contentEl),this.init(),this.defaultWidth=gt(this.elementViewChild?.nativeElement),this.defaultHeight=ft(this.elementViewChild?.nativeElement),this.defaultContentWidth=gt(this.contentEl),this.defaultContentHeight=ft(this.contentEl),this.initialized=!0)}init(){this._disabled||(this.bindResizeListener(),setTimeout(()=>{this.setSpacerSize(),this.setSize(),this.calculateOptions(),this.calculateAutoSize(),this.cd.detectChanges()},1))}setContentEl(e){this.contentEl=e||this.contentViewChild?.nativeElement||Ue(this.elementViewChild?.nativeElement,".p-virtualscroller-content")}setInitialState(){this.first=this.both?{rows:0,cols:0}:0,this.last=this.both?{rows:0,cols:0}:0,this.numItemsInViewport=this.both?{rows:0,cols:0}:0,this.lastScrollPos=this.both?{top:0,left:0}:0,(this.d_loading===void 0||this.d_loading===!1)&&(this.d_loading=this._loading||!1),this.d_numToleratedItems=this._numToleratedItems,this.loaderArr=this.loaderArr.length>0?this.loaderArr:[]}getElementRef(){return this.elementViewChild}getPageByFirst(e){return Math.floor(((e??this.first)+this.d_numToleratedItems*4)/(this._step||1))}isPageChanged(e){return this._step?this.page!==this.getPageByFirst(e??this.first):!0}scrollTo(e){this.elementViewChild?.nativeElement?.scrollTo(e)}scrollToIndex(e,n="auto"){if(this.both?e.every(r=>r>-1):e>-1){let r=this.first,{scrollTop:a=0,scrollLeft:m=0}=this.elementViewChild?.nativeElement,{numToleratedItems:T}=this.calculateNumItems(),O=this.getContentPosition(),D=this.itemSize,ie=(K=0,re)=>K<=re?0:K,G=(K,re,Me)=>K*re+Me,_e=(K=0,re=0)=>this.scrollTo({left:K,top:re,behavior:n}),be=this.both?{rows:0,cols:0}:0,qe=!1,z=!1;this.both?(be={rows:ie(e[0],T[0]),cols:ie(e[1],T[1])},_e(G(be.cols,D[1],O.left),G(be.rows,D[0],O.top)),z=this.lastScrollPos.top!==a||this.lastScrollPos.left!==m,qe=be.rows!==r.rows||be.cols!==r.cols):(be=ie(e,T),this.horizontal?_e(G(be,D,O.left),a):_e(m,G(be,D,O.top)),z=this.lastScrollPos!==(this.horizontal?m:a),qe=be!==r),this.isRangeChanged=qe,z&&(this.first=be)}}scrollInView(e,n,i="auto"){if(n){let{first:r,viewport:a}=this.getRenderedRange(),m=(D=0,ie=0)=>this.scrollTo({left:D,top:ie,behavior:i}),T=n==="to-start",O=n==="to-end";if(T){if(this.both)a.first.rows-r.rows>e[0]?m(a.first.cols*this._itemSize[1],(a.first.rows-1)*this._itemSize[0]):a.first.cols-r.cols>e[1]&&m((a.first.cols-1)*this._itemSize[1],a.first.rows*this._itemSize[0]);else if(a.first-r>e){let D=(a.first-1)*this._itemSize;this.horizontal?m(D,0):m(0,D)}}else if(O){if(this.both)a.last.rows-r.rows<=e[0]+1?m(a.first.cols*this._itemSize[1],(a.first.rows+1)*this._itemSize[0]):a.last.cols-r.cols<=e[1]+1&&m((a.first.cols+1)*this._itemSize[1],a.first.rows*this._itemSize[0]);else if(a.last-r<=e+1){let D=(a.first+1)*this._itemSize;this.horizontal?m(D,0):m(0,D)}}}else this.scrollToIndex(e,i)}getRenderedRange(){let e=(r,a)=>a||r?Math.floor(r/(a||r)):0,n=this.first,i=0;if(this.elementViewChild?.nativeElement){let{scrollTop:r,scrollLeft:a}=this.elementViewChild.nativeElement;if(this.both)n={rows:e(r,this._itemSize[0]),cols:e(a,this._itemSize[1])},i={rows:n.rows+this.numItemsInViewport.rows,cols:n.cols+this.numItemsInViewport.cols};else{let m=this.horizontal?a:r;n=e(m,this._itemSize),i=n+this.numItemsInViewport}}return{first:this.first,last:this.last,viewport:{first:n,last:i}}}calculateNumItems(){let e=this.getContentPosition(),n=(this.elementViewChild?.nativeElement?this.elementViewChild.nativeElement.offsetWidth-e.left:0)||0,i=(this.elementViewChild?.nativeElement?this.elementViewChild.nativeElement.offsetHeight-e.top:0)||0,r=(O,D)=>D||O?Math.ceil(O/(D||O)):0,a=O=>Math.ceil(O/2),m=this.both?{rows:r(i,this._itemSize[0]),cols:r(n,this._itemSize[1])}:r(this.horizontal?n:i,this._itemSize),T=this.d_numToleratedItems||(this.both?[a(m.rows),a(m.cols)]:a(m));return{numItemsInViewport:m,numToleratedItems:T}}calculateOptions(){let{numItemsInViewport:e,numToleratedItems:n}=this.calculateNumItems(),i=(m,T,O,D=!1)=>this.getLast(m+T+(m<O?2:3)*O,D),r=this.first,a=this.both?{rows:i(this.first.rows,e.rows,n[0]),cols:i(this.first.cols,e.cols,n[1],!0)}:i(this.first,e,n);this.last=a,this.numItemsInViewport=e,this.d_numToleratedItems=n,this._showLoader&&(this.loaderArr=this.both?Array.from({length:e.rows}).map(()=>Array.from({length:e.cols})):Array.from({length:e})),this._lazy&&Promise.resolve().then(()=>{this.lazyLoadState={first:this._step?this.both?{rows:0,cols:r.cols}:0:r,last:Math.min(this._step?this._step:this.last,this._items.length)},this.handleEvents("onLazyLoad",this.lazyLoadState)})}calculateAutoSize(){this._autoSize&&!this.d_loading&&Promise.resolve().then(()=>{if(this.contentEl){this.contentEl.style.minHeight=this.contentEl.style.minWidth="auto",this.contentEl.style.position="relative",this.elementViewChild.nativeElement.style.contain="none";let[e,n]=[gt(this.contentEl),ft(this.contentEl)];e!==this.defaultContentWidth&&(this.elementViewChild.nativeElement.style.width=""),n!==this.defaultContentHeight&&(this.elementViewChild.nativeElement.style.height="");let[i,r]=[gt(this.elementViewChild.nativeElement),ft(this.elementViewChild.nativeElement)];(this.both||this.horizontal)&&(this.elementViewChild.nativeElement.style.width=i<this.defaultWidth?i+"px":this._scrollWidth||this.defaultWidth+"px"),(this.both||this.vertical)&&(this.elementViewChild.nativeElement.style.height=r<this.defaultHeight?r+"px":this._scrollHeight||this.defaultHeight+"px"),this.contentEl.style.minHeight=this.contentEl.style.minWidth="",this.contentEl.style.position="",this.elementViewChild.nativeElement.style.contain=""}})}getLast(e=0,n=!1){return this._items?Math.min(n?(this._columns||this._items[0]).length:this._items.length,e):0}getContentPosition(){if(this.contentEl){let e=getComputedStyle(this.contentEl),n=parseFloat(e.paddingLeft)+Math.max(parseFloat(e.left)||0,0),i=parseFloat(e.paddingRight)+Math.max(parseFloat(e.right)||0,0),r=parseFloat(e.paddingTop)+Math.max(parseFloat(e.top)||0,0),a=parseFloat(e.paddingBottom)+Math.max(parseFloat(e.bottom)||0,0);return{left:n,right:i,top:r,bottom:a,x:n+i,y:r+a}}return{left:0,right:0,top:0,bottom:0,x:0,y:0}}setSize(){if(this.elementViewChild?.nativeElement){let e=this.elementViewChild.nativeElement,n=e.parentElement?.parentElement,i=e.offsetWidth,r=n?.offsetWidth||0,a=this._scrollWidth||`${i||r}px`,m=e.offsetHeight,T=n?.offsetHeight||0,O=this._scrollHeight||`${m||T}px`,D=(ie,G)=>e.style[ie]=G;this.both||this.horizontal?(D("height",O),D("width",a)):D("height",O)}}setSpacerSize(){if(this._items){let e=this.getContentPosition(),n=(i,r,a,m=0)=>this.spacerStyle=ve(P({},this.spacerStyle),{[`${i}`]:(r||[]).length*a+m+"px"});this.both?(n("height",this._items,this._itemSize[0],e.y),n("width",this._columns||this._items[1],this._itemSize[1],e.x)):this.horizontal?n("width",this._columns||this._items,this._itemSize,e.x):n("height",this._items,this._itemSize,e.y)}}setContentPosition(e){if(this.contentEl&&!this._appendOnly){let n=e?e.first:this.first,i=(a,m)=>a*m,r=(a=0,m=0)=>this.contentStyle=ve(P({},this.contentStyle),{transform:`translate3d(${a}px, ${m}px, 0)`});if(this.both)r(i(n.cols,this._itemSize[1]),i(n.rows,this._itemSize[0]));else{let a=i(n,this._itemSize);this.horizontal?r(a,0):r(0,a)}}}onScrollPositionChange(e){let n=e.target;if(!n)throw new Error("Event target is null");let i=this.getContentPosition(),r=(z,K)=>z?z>K?z-K:z:0,a=(z,K)=>K||z?Math.floor(z/(K||z)):0,m=(z,K,re,Me,Pe,He)=>z<=Pe?Pe:He?re-Me-Pe:K+Pe-1,T=(z,K,re,Me,Pe,He,jt)=>z<=He?0:Math.max(0,jt?z<K?re:z-He:z>K?re:z-2*He),O=(z,K,re,Me,Pe,He=!1)=>{let jt=K+Me+2*Pe;return z>=Pe&&(jt+=Pe+1),this.getLast(jt,He)},D=r(n.scrollTop,i.top),ie=r(n.scrollLeft,i.left),G=this.both?{rows:0,cols:0}:0,_e=this.last,be=!1,qe=this.lastScrollPos;if(this.both){let z=this.lastScrollPos.top<=D,K=this.lastScrollPos.left<=ie;if(!this._appendOnly||this._appendOnly&&(z||K)){let re={rows:a(D,this._itemSize[0]),cols:a(ie,this._itemSize[1])},Me={rows:m(re.rows,this.first.rows,this.last.rows,this.numItemsInViewport.rows,this.d_numToleratedItems[0],z),cols:m(re.cols,this.first.cols,this.last.cols,this.numItemsInViewport.cols,this.d_numToleratedItems[1],K)};G={rows:T(re.rows,Me.rows,this.first.rows,this.last.rows,this.numItemsInViewport.rows,this.d_numToleratedItems[0],z),cols:T(re.cols,Me.cols,this.first.cols,this.last.cols,this.numItemsInViewport.cols,this.d_numToleratedItems[1],K)},_e={rows:O(re.rows,G.rows,this.last.rows,this.numItemsInViewport.rows,this.d_numToleratedItems[0]),cols:O(re.cols,G.cols,this.last.cols,this.numItemsInViewport.cols,this.d_numToleratedItems[1],!0)},be=G.rows!==this.first.rows||_e.rows!==this.last.rows||G.cols!==this.first.cols||_e.cols!==this.last.cols||this.isRangeChanged,qe={top:D,left:ie}}}else{let z=this.horizontal?ie:D,K=this.lastScrollPos<=z;if(!this._appendOnly||this._appendOnly&&K){let re=a(z,this._itemSize),Me=m(re,this.first,this.last,this.numItemsInViewport,this.d_numToleratedItems,K);G=T(re,Me,this.first,this.last,this.numItemsInViewport,this.d_numToleratedItems,K),_e=O(re,G,this.last,this.numItemsInViewport,this.d_numToleratedItems),be=G!==this.first||_e!==this.last||this.isRangeChanged,qe=z}}return{first:G,last:_e,isRangeChanged:be,scrollPos:qe}}onScrollChange(e){let{first:n,last:i,isRangeChanged:r,scrollPos:a}=this.onScrollPositionChange(e);if(r){let m={first:n,last:i};if(this.setContentPosition(m),this.first=n,this.last=i,this.lastScrollPos=a,this.handleEvents("onScrollIndexChange",m),this._lazy&&this.isPageChanged(n)){let T={first:this._step?Math.min(this.getPageByFirst(n)*this._step,this._items.length-this._step):n,last:Math.min(this._step?(this.getPageByFirst(n)+1)*this._step:i,this._items.length)};(this.lazyLoadState.first!==T.first||this.lazyLoadState.last!==T.last)&&this.handleEvents("onLazyLoad",T),this.lazyLoadState=T}}}onContainerScroll(e){if(this.handleEvents("onScroll",{originalEvent:e}),this._delay){if(this.scrollTimeout&&clearTimeout(this.scrollTimeout),!this.d_loading&&this._showLoader){let{isRangeChanged:n}=this.onScrollPositionChange(e);(n||this._step&&this.isPageChanged())&&(this.d_loading=!0,this.cd.detectChanges())}this.scrollTimeout=setTimeout(()=>{this.onScrollChange(e),this.d_loading&&this._showLoader&&(!this._lazy||this._loading===void 0)&&(this.d_loading=!1,this.page=this.getPageByFirst()),this.cd.detectChanges()},this._delay)}else!this.d_loading&&this.onScrollChange(e)}bindResizeListener(){Le(this.platformId)&&(this.windowResizeListener||this.zone.runOutsideAngular(()=>{let e=this.document.defaultView,n=Xe()?"orientationchange":"resize";this.windowResizeListener=this.renderer.listen(e,n,this.onWindowResize.bind(this))}))}unbindResizeListener(){this.windowResizeListener&&(this.windowResizeListener(),this.windowResizeListener=null)}onWindowResize(){this.resizeTimeout&&clearTimeout(this.resizeTimeout),this.resizeTimeout=setTimeout(()=>{if(xn(this.elementViewChild?.nativeElement)){let[e,n]=[gt(this.elementViewChild?.nativeElement),ft(this.elementViewChild?.nativeElement)],[i,r]=[e!==this.defaultWidth,n!==this.defaultHeight];(this.both?i||r:this.horizontal?i:this.vertical&&r)&&this.zone.run(()=>{this.d_numToleratedItems=this._numToleratedItems,this.defaultWidth=e,this.defaultHeight=n,this.defaultContentWidth=gt(this.contentEl),this.defaultContentHeight=ft(this.contentEl),this.init()})}},this._resizeDelay)}handleEvents(e,n){return this.options&&this.options[e]?this.options[e](n):this[e].emit(n)}getContentOptions(){return{contentStyleClass:`p-virtualscroller-content ${this.d_loading?"p-virtualscroller-loading":""}`,items:this.loadedItems,getItemOptions:e=>this.getOptions(e),loading:this.d_loading,getLoaderOptions:(e,n)=>this.getLoaderOptions(e,n),itemSize:this._itemSize,rows:this.loadedRows,columns:this.loadedColumns,spacerStyle:this.spacerStyle,contentStyle:this.contentStyle,vertical:this.vertical,horizontal:this.horizontal,both:this.both,scrollTo:this.scrollTo.bind(this),scrollToIndex:this.scrollToIndex.bind(this),orientation:this._orientation,scrollableElement:this.elementViewChild?.nativeElement}}getOptions(e){let n=(this._items||[]).length,i=this.both?this.first.rows+e:this.first+e;return{index:i,count:n,first:i===0,last:i===n-1,even:i%2===0,odd:i%2!==0}}getLoaderOptions(e,n){let i=this.loaderArr.length;return P({index:e,count:i,first:e===0,last:e===i-1,even:e%2===0,odd:e%2!==0,loading:this.d_loading},n)}static \u0275fac=function(n){return new(n||t)(de(je))};static \u0275cmp=E({type:t,selectors:[["p-scroller"],["p-virtualscroller"],["p-virtual-scroller"],["p-virtualScroller"]],contentQueries:function(n,i,r){if(n&1&&fe(r,ur,4)(r,$c,4)(r,Uc,4)(r,qc,4)(r,ce,4),n&2){let a;_(a=y())&&(i.contentTemplate=a.first),_(a=y())&&(i.itemTemplate=a.first),_(a=y())&&(i.loaderTemplate=a.first),_(a=y())&&(i.loaderIconTemplate=a.first),_(a=y())&&(i.templates=a)}},viewQuery:function(n,i){if(n&1&&Ae(Wc,5)(ur,5),n&2){let r;_(r=y())&&(i.elementViewChild=r.first),_(r=y())&&(i.contentViewChild=r.first)}},hostVars:2,hostBindings:function(n,i){n&2&&yt("height",i.height)},inputs:{hostName:"hostName",id:"id",style:"style",styleClass:"styleClass",tabindex:"tabindex",items:"items",itemSize:"itemSize",scrollHeight:"scrollHeight",scrollWidth:"scrollWidth",orientation:"orientation",step:"step",delay:"delay",resizeDelay:"resizeDelay",appendOnly:"appendOnly",inline:"inline",lazy:"lazy",disabled:"disabled",loaderDisabled:"loaderDisabled",columns:"columns",showSpacer:"showSpacer",showLoader:"showLoader",numToleratedItems:"numToleratedItems",loading:"loading",autoSize:"autoSize",trackBy:"trackBy",options:"options"},outputs:{onLazyLoad:"onLazyLoad",onScroll:"onScroll",onScrollIndexChange:"onScrollIndexChange"},features:[j([mr,{provide:hr,useExisting:t},{provide:X,useExisting:t}]),J([v]),M],ngContentSelectors:Qc,decls:3,vars:2,consts:[["disabledContainer",""],["element",""],["buildInContent",""],["content",""],["buildInLoader",""],["buildInLoaderIcon",""],[4,"ngIf","ngIfElse"],[3,"scroll","ngStyle","pBind"],[3,"class","ngStyle","pBind",4,"ngIf"],[3,"class","pBind",4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"pBind"],[4,"ngFor","ngForOf","ngForTrackBy"],[3,"ngStyle","pBind"],[4,"ngFor","ngForOf"],["data-p-icon","spinner",3,"spin","pBind"],[4,"ngIf"]],template:function(n,i){if(n&1&&(he(),p(0,ud,8,10,"ng-container",6)(1,fd,2,1,"ng-template",null,0,pe)),n&2){let r=we(2);s("ngIf",!i._disabled)("ngIfElse",r)}},dependencies:[ne,Gt,Ie,ue,Ke,fi,ae,v],encapsulation:2})}return t})();var _r=`
    .p-select {
        display: inline-flex;
        cursor: pointer;
        position: relative;
        user-select: none;
        background: dt('select.background');
        border: 1px solid dt('select.border.color');
        transition:
            background dt('select.transition.duration'),
            color dt('select.transition.duration'),
            border-color dt('select.transition.duration'),
            outline-color dt('select.transition.duration'),
            box-shadow dt('select.transition.duration');
        border-radius: dt('select.border.radius');
        outline-color: transparent;
        box-shadow: dt('select.shadow');
    }

    .p-select:not(.p-disabled):hover {
        border-color: dt('select.hover.border.color');
    }

    .p-select:not(.p-disabled).p-focus {
        border-color: dt('select.focus.border.color');
        box-shadow: dt('select.focus.ring.shadow');
        outline: dt('select.focus.ring.width') dt('select.focus.ring.style') dt('select.focus.ring.color');
        outline-offset: dt('select.focus.ring.offset');
    }

    .p-select.p-variant-filled {
        background: dt('select.filled.background');
    }

    .p-select.p-variant-filled:not(.p-disabled):hover {
        background: dt('select.filled.hover.background');
    }

    .p-select.p-variant-filled:not(.p-disabled).p-focus {
        background: dt('select.filled.focus.background');
    }

    .p-select.p-invalid {
        border-color: dt('select.invalid.border.color');
    }

    .p-select.p-disabled {
        opacity: 1;
        background: dt('select.disabled.background');
    }

    .p-select-clear-icon {
        align-self: center;
        color: dt('select.clear.icon.color');
        inset-inline-end: dt('select.dropdown.width');
    }

    .p-select-dropdown {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        background: transparent;
        color: dt('select.dropdown.color');
        width: dt('select.dropdown.width');
        border-start-end-radius: dt('select.border.radius');
        border-end-end-radius: dt('select.border.radius');
    }

    .p-select-label {
        display: block;
        white-space: nowrap;
        overflow: hidden;
        flex: 1 1 auto;
        width: 1%;
        padding: dt('select.padding.y') dt('select.padding.x');
        text-overflow: ellipsis;
        cursor: pointer;
        color: dt('select.color');
        background: transparent;
        border: 0 none;
        outline: 0 none;
        font-size: 1rem;
    }

    .p-select-label.p-placeholder {
        color: dt('select.placeholder.color');
    }

    .p-select.p-invalid .p-select-label.p-placeholder {
        color: dt('select.invalid.placeholder.color');
    }

    .p-select.p-disabled .p-select-label {
        color: dt('select.disabled.color');
    }

    .p-select-label-empty {
        overflow: hidden;
        opacity: 0;
    }

    input.p-select-label {
        cursor: default;
    }

    .p-select-overlay {
        position: absolute;
        top: 0;
        left: 0;
        background: dt('select.overlay.background');
        color: dt('select.overlay.color');
        border: 1px solid dt('select.overlay.border.color');
        border-radius: dt('select.overlay.border.radius');
        box-shadow: dt('select.overlay.shadow');
        min-width: 100%;
        transform-origin: inherit;
        will-change: transform;
    }

    .p-select-header {
        padding: dt('select.list.header.padding');
    }

    .p-select-filter {
        width: 100%;
    }

    .p-select-list-container {
        overflow: auto;
    }

    .p-select-option-group {
        cursor: auto;
        margin: 0;
        padding: dt('select.option.group.padding');
        background: dt('select.option.group.background');
        color: dt('select.option.group.color');
        font-weight: dt('select.option.group.font.weight');
    }

    .p-select-list {
        margin: 0;
        padding: 0;
        list-style-type: none;
        padding: dt('select.list.padding');
        gap: dt('select.list.gap');
        display: flex;
        flex-direction: column;
    }

    .p-select-option {
        cursor: pointer;
        font-weight: normal;
        white-space: nowrap;
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        padding: dt('select.option.padding');
        border: 0 none;
        color: dt('select.option.color');
        background: transparent;
        transition:
            background dt('select.transition.duration'),
            color dt('select.transition.duration'),
            border-color dt('select.transition.duration'),
            box-shadow dt('select.transition.duration'),
            outline-color dt('select.transition.duration');
        border-radius: dt('select.option.border.radius');
    }

    .p-select-option:not(.p-select-option-selected):not(.p-disabled).p-focus {
        background: dt('select.option.focus.background');
        color: dt('select.option.focus.color');
    }

    .p-select-option:not(.p-select-option-selected):not(.p-disabled):hover {
        background: dt('select.option.focus.background');
        color: dt('select.option.focus.color');
    }

    .p-select-option.p-select-option-selected {
        background: dt('select.option.selected.background');
        color: dt('select.option.selected.color');
    }

    .p-select-option.p-select-option-selected.p-focus {
        background: dt('select.option.selected.focus.background');
        color: dt('select.option.selected.focus.color');
    }
   
    .p-select-option-blank-icon {
        flex-shrink: 0;
    }

    .p-select-option-check-icon {
        position: relative;
        flex-shrink: 0;
        margin-inline-start: dt('select.checkmark.gutter.start');
        margin-inline-end: dt('select.checkmark.gutter.end');
        color: dt('select.checkmark.color');
    }

    .p-select-empty-message {
        padding: dt('select.empty.message.padding');
    }

    .p-select-fluid {
        display: flex;
        width: 100%;
    }

    .p-select-sm .p-select-label {
        font-size: dt('select.sm.font.size');
        padding-block: dt('select.sm.padding.y');
        padding-inline: dt('select.sm.padding.x');
    }

    .p-select-sm .p-select-dropdown .p-icon {
        font-size: dt('select.sm.font.size');
        width: dt('select.sm.font.size');
        height: dt('select.sm.font.size');
    }

    .p-select-lg .p-select-label {
        font-size: dt('select.lg.font.size');
        padding-block: dt('select.lg.padding.y');
        padding-inline: dt('select.lg.padding.x');
    }

    .p-select-lg .p-select-dropdown .p-icon {
        font-size: dt('select.lg.font.size');
        width: dt('select.lg.font.size');
        height: dt('select.lg.font.size');
    }

    .p-floatlabel-in .p-select-filter {
        padding-block-start: dt('select.padding.y');
        padding-block-end: dt('select.padding.y');
    }
`;var Ht=t=>({height:t}),zn=t=>({$implicit:t});function yd(t,o){if(t&1&&(F(),N(0,"svg",6)),t&2){let e=l(2);h(e.cx("optionCheckIcon")),s("pBind",e.$pcSelect==null?null:e.$pcSelect.ptm("optionCheckIcon"))}}function bd(t,o){if(t&1&&(F(),N(0,"svg",7)),t&2){let e=l(2);h(e.cx("optionBlankIcon")),s("pBind",e.$pcSelect==null?null:e.$pcSelect.ptm("optionBlankIcon"))}}function vd(t,o){if(t&1&&(R(0),p(1,yd,1,3,"svg",4)(2,bd,1,3,"svg",5),H()),t&2){let e=l();c(),s("ngIf",e.selected),c(),s("ngIf",!e.selected)}}function Cd(t,o){if(t&1&&(d(0,"span",8),ee(1),u()),t&2){let e=l();s("pBind",e.$pcSelect==null?null:e.$pcSelect.ptm("optionLabel")),c(),ye(e.label??"empty")}}function xd(t,o){t&1&&B(0)}var wd=["item"],Id=["group"],Td=["loader"],Sd=["selectedItem"],kd=["header"],yr=["filter"],Md=["footer"],Ed=["emptyfilter"],Dd=["empty"],Vd=["dropdownicon"],Od=["loadingicon"],Ad=["clearicon"],Fd=["filtericon"],Pd=["onicon"],Nd=["officon"],Bd=["cancelicon"],Ld=["focusInput"],zd=["editableInput"],Rd=["items"],Hd=["scroller"],jd=["overlay"],Gd=["firstHiddenFocusableEl"],$d=["lastHiddenFocusableEl"],br=t=>({class:t}),vr=t=>({options:t}),Cr=(t,o)=>({$implicit:t,options:o}),Ud=()=>({});function qd(t,o){if(t&1&&(R(0),ee(1),H()),t&2){let e=l(2);c(),ye(e.label()==="p-emptylabel"?"\xA0":e.label())}}function Wd(t,o){if(t&1&&B(0,24),t&2){let e=l(2);s("ngTemplateOutlet",e.selectedItemTemplate||e._selectedItemTemplate)("ngTemplateOutletContext",Q(2,zn,e.selectedOption))}}function Qd(t,o){if(t&1&&(d(0,"span"),ee(1),u()),t&2){let e=l(3);c(),ye(e.label()==="p-emptylabel"?"\xA0":e.label())}}function Yd(t,o){if(t&1&&p(0,Qd,2,1,"span",18),t&2){let e=l(2);s("ngIf",e.isSelectedOptionEmpty())}}function Kd(t,o){if(t&1){let e=V();d(0,"span",22,3),w("focus",function(i){f(e);let r=l();return g(r.onInputFocus(i))})("blur",function(i){f(e);let r=l();return g(r.onInputBlur(i))})("keydown",function(i){f(e);let r=l();return g(r.onKeyDown(i))}),p(2,qd,2,1,"ng-container",20)(3,Wd,1,4,"ng-container",23)(4,Yd,1,1,"ng-template",null,4,pe),u()}if(t&2){let e=we(5),n=l();h(n.cx("label")),s("pBind",n.ptm("label"))("pTooltip",n.tooltip)("pTooltipUnstyled",n.unstyled())("tooltipPosition",n.tooltipPosition)("positionStyle",n.tooltipPositionStyle)("tooltipStyleClass",n.tooltipStyleClass)("pAutoFocus",n.autofocus),x("aria-disabled",n.$disabled())("id",n.inputId)("aria-label",n.ariaLabel||(n.label()==="p-emptylabel"?void 0:n.label()))("aria-labelledby",n.ariaLabelledBy)("aria-haspopup","listbox")("aria-expanded",n.overlayVisible??!1)("aria-controls",n.overlayVisible?n.id+"_list":null)("tabindex",n.$disabled()?-1:n.tabindex)("aria-activedescendant",n.focused?n.focusedOptionId:void 0)("aria-required",n.required())("required",n.required()?"":void 0)("disabled",n.$disabled()?"":void 0)("data-p",n.labelDataP),c(2),s("ngIf",!n.selectedItemTemplate&&!n._selectedItemTemplate)("ngIfElse",e),c(),s("ngIf",(n.selectedItemTemplate||n._selectedItemTemplate)&&!n.isSelectedOptionEmpty())}}function Zd(t,o){if(t&1){let e=V();d(0,"input",25,5),w("input",function(i){f(e);let r=l();return g(r.onEditableInput(i))})("keydown",function(i){f(e);let r=l();return g(r.onKeyDown(i))})("focus",function(i){f(e);let r=l();return g(r.onInputFocus(i))})("blur",function(i){f(e);let r=l();return g(r.onInputBlur(i))}),u()}if(t&2){let e=l();h(e.cx("label")),s("pBind",e.ptm("label"))("pAutoFocus",e.autofocus),x("id",e.inputId)("aria-haspopup","listbox")("placeholder",e.modelValue()===void 0||e.modelValue()===null?e.placeholder():void 0)("aria-label",e.ariaLabel||(e.label()==="p-emptylabel"?void 0:e.label()))("aria-activedescendant",e.focused?e.focusedOptionId:void 0)("name",e.name())("minlength",e.minlength())("min",e.min())("max",e.max())("pattern",e.pattern())("size",e.inputSize())("maxlength",e.maxlength())("required",e.required()?"":void 0)("readonly",e.readonly?"":void 0)("disabled",e.$disabled()?"":void 0)("data-p",e.labelDataP)}}function Xd(t,o){if(t&1){let e=V();F(),d(0,"svg",28),w("click",function(i){f(e);let r=l(2);return g(r.clear(i))}),u()}if(t&2){let e=l(2);h(e.cx("clearIcon")),s("pBind",e.ptm("clearIcon")),x("data-pc-section","clearicon")}}function Jd(t,o){}function ep(t,o){t&1&&p(0,Jd,0,0,"ng-template")}function tp(t,o){if(t&1){let e=V();d(0,"span",29),w("click",function(i){f(e);let r=l(2);return g(r.clear(i))}),p(1,ep,1,0,null,30),u()}if(t&2){let e=l(2);h(e.cx("clearIcon")),s("pBind",e.ptm("clearIcon")),x("data-pc-section","clearicon"),c(),s("ngTemplateOutlet",e.clearIconTemplate||e._clearIconTemplate)("ngTemplateOutletContext",Q(6,br,e.cx("clearIcon")))}}function np(t,o){if(t&1&&(R(0),p(1,Xd,1,4,"svg",26)(2,tp,2,8,"span",27),H()),t&2){let e=l();c(),s("ngIf",!e.clearIconTemplate&&!e._clearIconTemplate),c(),s("ngIf",e.clearIconTemplate||e._clearIconTemplate)}}function ip(t,o){t&1&&B(0)}function op(t,o){if(t&1&&(R(0),p(1,ip,1,0,"ng-container",31),H()),t&2){let e=l(2);c(),s("ngTemplateOutlet",e.loadingIconTemplate||e._loadingIconTemplate)}}function rp(t,o){if(t&1&&N(0,"span",33),t&2){let e=l(3);h(e.cn(e.cx("loadingIcon"),"pi-spin"+e.loadingIcon)),s("pBind",e.ptm("loadingIcon"))}}function ap(t,o){if(t&1&&N(0,"span",33),t&2){let e=l(3);h(e.cn(e.cx("loadingIcon"),"pi pi-spinner pi-spin")),s("pBind",e.ptm("loadingIcon"))}}function sp(t,o){if(t&1&&(R(0),p(1,rp,1,3,"span",32)(2,ap,1,3,"span",32),H()),t&2){let e=l(2);c(),s("ngIf",e.loadingIcon),c(),s("ngIf",!e.loadingIcon)}}function lp(t,o){if(t&1&&(R(0),p(1,op,2,1,"ng-container",18)(2,sp,3,2,"ng-container",18),H()),t&2){let e=l();c(),s("ngIf",e.loadingIconTemplate||e._loadingIconTemplate),c(),s("ngIf",!e.loadingIconTemplate&&!e._loadingIconTemplate)}}function cp(t,o){if(t&1&&N(0,"span",36),t&2){let e=l(3);h(e.cn(e.cx("dropdownIcon"),e.dropdownIcon)),s("pBind",e.ptm("dropdownIcon"))}}function dp(t,o){if(t&1&&(F(),N(0,"svg",37)),t&2){let e=l(3);h(e.cx("dropdownIcon")),s("pBind",e.ptm("dropdownIcon"))}}function pp(t,o){if(t&1&&(R(0),p(1,cp,1,3,"span",34)(2,dp,1,3,"svg",35),H()),t&2){let e=l(2);c(),s("ngIf",e.dropdownIcon),c(),s("ngIf",!e.dropdownIcon)}}function up(t,o){}function mp(t,o){t&1&&p(0,up,0,0,"ng-template")}function hp(t,o){if(t&1&&(d(0,"span",36),p(1,mp,1,0,null,30),u()),t&2){let e=l(2);h(e.cx("dropdownIcon")),s("pBind",e.ptm("dropdownIcon")),c(),s("ngTemplateOutlet",e.dropdownIconTemplate||e._dropdownIconTemplate)("ngTemplateOutletContext",Q(5,br,e.cx("dropdownIcon")))}}function fp(t,o){if(t&1&&p(0,pp,3,2,"ng-container",18)(1,hp,2,7,"span",34),t&2){let e=l();s("ngIf",!e.dropdownIconTemplate&&!e._dropdownIconTemplate),c(),s("ngIf",e.dropdownIconTemplate||e._dropdownIconTemplate)}}function gp(t,o){t&1&&B(0)}function _p(t,o){t&1&&B(0)}function yp(t,o){if(t&1&&(R(0),p(1,_p,1,0,"ng-container",30),H()),t&2){let e=l(3);c(),s("ngTemplateOutlet",e.filterTemplate||e._filterTemplate)("ngTemplateOutletContext",Q(2,vr,e.filterOptions))}}function bp(t,o){if(t&1&&(F(),N(0,"svg",45)),t&2){let e=l(4);s("pBind",e.ptm("filterIcon"))}}function vp(t,o){}function Cp(t,o){t&1&&p(0,vp,0,0,"ng-template")}function xp(t,o){if(t&1&&(d(0,"span",36),p(1,Cp,1,0,null,31),u()),t&2){let e=l(4);s("pBind",e.ptm("filterIcon")),c(),s("ngTemplateOutlet",e.filterIconTemplate||e._filterIconTemplate)}}function wp(t,o){if(t&1){let e=V();d(0,"p-iconfield",41)(1,"input",42,10),w("input",function(i){f(e);let r=l(3);return g(r.onFilterInputChange(i))})("keydown",function(i){f(e);let r=l(3);return g(r.onFilterKeyDown(i))})("blur",function(i){f(e);let r=l(3);return g(r.onFilterBlur(i))}),u(),d(3,"p-inputicon",41),p(4,bp,1,1,"svg",43)(5,xp,2,2,"span",44),u()()}if(t&2){let e=l(3);s("pt",e.ptm("pcFilterContainer"))("unstyled",e.unstyled()),c(),h(e.cx("pcFilter")),s("pSize",e.size())("value",e._filterValue()||"")("variant",e.$variant())("pt",e.ptm("pcFilter"))("unstyled",e.unstyled()),x("placeholder",e.filterPlaceholder)("aria-owns",e.id+"_list")("aria-label",e.ariaFilterLabel)("aria-activedescendant",e.focusedOptionId),c(2),s("pt",e.ptm("pcFilterIconContainer"))("unstyled",e.unstyled()),c(),s("ngIf",!e.filterIconTemplate&&!e._filterIconTemplate),c(),s("ngIf",e.filterIconTemplate||e._filterIconTemplate)}}function Ip(t,o){if(t&1&&(d(0,"div",29),w("click",function(n){return n.stopPropagation()}),p(1,yp,2,4,"ng-container",20)(2,wp,6,17,"ng-template",null,9,pe),u()),t&2){let e=we(3),n=l(2);h(n.cx("header")),s("pBind",n.ptm("header")),c(),s("ngIf",n.filterTemplate||n._filterTemplate)("ngIfElse",e)}}function Tp(t,o){t&1&&B(0)}function Sp(t,o){if(t&1&&p(0,Tp,1,0,"ng-container",30),t&2){let e=o.$implicit,n=o.options;l(2);let i=we(9);s("ngTemplateOutlet",i)("ngTemplateOutletContext",rt(2,Cr,e,n))}}function kp(t,o){t&1&&B(0)}function Mp(t,o){if(t&1&&p(0,kp,1,0,"ng-container",30),t&2){let e=o.options,n=l(4);s("ngTemplateOutlet",n.loaderTemplate||n._loaderTemplate)("ngTemplateOutletContext",Q(2,vr,e))}}function Ep(t,o){t&1&&(R(0),p(1,Mp,1,4,"ng-template",null,12,pe),H())}function Dp(t,o){if(t&1){let e=V();d(0,"p-scroller",46,11),w("onLazyLoad",function(i){f(e);let r=l(2);return g(r.onLazyLoad.emit(i))}),p(2,Sp,1,5,"ng-template",null,2,pe)(4,Ep,3,0,"ng-container",18),u()}if(t&2){let e=l(2);ge(Q(9,Ht,e.scrollHeight)),s("items",e.visibleOptions())("itemSize",e.virtualScrollItemSize)("autoSize",!0)("lazy",e.lazy)("options",e.virtualScrollOptions)("pt",e.ptm("virtualScroller")),c(4),s("ngIf",e.loaderTemplate||e._loaderTemplate)}}function Vp(t,o){t&1&&B(0)}function Op(t,o){if(t&1&&(R(0),p(1,Vp,1,0,"ng-container",30),H()),t&2){l();let e=we(9),n=l();c(),s("ngTemplateOutlet",e)("ngTemplateOutletContext",rt(3,Cr,n.visibleOptions(),bt(2,Ud)))}}function Ap(t,o){if(t&1&&(d(0,"span",36),ee(1),u()),t&2){let e=l(2).$implicit,n=l(3);h(n.cx("optionGroupLabel")),s("pBind",n.ptm("optionGroupLabel")),c(),ye(n.getOptionGroupLabel(e.optionGroup))}}function Fp(t,o){t&1&&B(0)}function Pp(t,o){if(t&1&&(R(0),d(1,"li",50),p(2,Ap,2,4,"span",34)(3,Fp,1,0,"ng-container",30),u(),H()),t&2){let e=l(),n=e.$implicit,i=e.index,r=l().options,a=l(2);c(),h(a.cx("optionGroup")),s("ngStyle",Q(8,Ht,r.itemSize+"px"))("pBind",a.ptm("optionGroup")),x("id",a.id+"_"+a.getOptionIndex(i,r)),c(),s("ngIf",!a.groupTemplate&&!a._groupTemplate),c(),s("ngTemplateOutlet",a.groupTemplate||a._groupTemplate)("ngTemplateOutletContext",Q(10,zn,n.optionGroup))}}function Np(t,o){if(t&1){let e=V();R(0),d(1,"p-selectItem",51),w("onClick",function(i){f(e);let r=l().$implicit,a=l(3);return g(a.onOptionSelect(i,r))})("onMouseEnter",function(i){f(e);let r=l().index,a=l().options,m=l(2);return g(m.onOptionMouseEnter(i,m.getOptionIndex(r,a)))}),u(),H()}if(t&2){let e=l(),n=e.$implicit,i=e.index,r=l().options,a=l(2);c(),s("id",a.id+"_"+a.getOptionIndex(i,r))("option",n)("checkmark",a.checkmark)("selected",a.isSelected(n))("label",a.getOptionLabel(n))("disabled",a.isOptionDisabled(n))("template",a.itemTemplate||a._itemTemplate)("focused",a.focusedOptionIndex()===a.getOptionIndex(i,r))("ariaPosInset",a.getAriaPosInset(a.getOptionIndex(i,r)))("ariaSetSize",a.ariaSetSize)("index",i)("unstyled",a.unstyled())("scrollerOptions",r)}}function Bp(t,o){if(t&1&&p(0,Pp,4,12,"ng-container",18)(1,Np,2,13,"ng-container",18),t&2){let e=o.$implicit,n=l(3);s("ngIf",n.isOptionGroup(e)),c(),s("ngIf",!n.isOptionGroup(e))}}function Lp(t,o){if(t&1&&ee(0),t&2){let e=l(4);Ye(" ",e.emptyFilterMessageLabel," ")}}function zp(t,o){t&1&&B(0,null,14)}function Rp(t,o){if(t&1&&p(0,zp,2,0,"ng-container",31),t&2){let e=l(4);s("ngTemplateOutlet",e.emptyFilterTemplate||e._emptyFilterTemplate||e.emptyTemplate||e._emptyTemplate)}}function Hp(t,o){if(t&1&&(d(0,"li",50),q(1,Lp,1,1)(2,Rp,1,1,"ng-container"),u()),t&2){let e=l().options,n=l(2);h(n.cx("emptyMessage")),s("ngStyle",Q(5,Ht,e.itemSize+"px"))("pBind",n.ptm("emptyMessage")),c(),W(!n.emptyFilterTemplate&&!n._emptyFilterTemplate&&!n.emptyTemplate?1:2)}}function jp(t,o){if(t&1&&ee(0),t&2){let e=l(4);Ye(" ",e.emptyMessageLabel||e.emptyFilterMessageLabel," ")}}function Gp(t,o){t&1&&B(0,null,15)}function $p(t,o){if(t&1&&p(0,Gp,2,0,"ng-container",31),t&2){let e=l(4);s("ngTemplateOutlet",e.emptyTemplate||e._emptyTemplate)}}function Up(t,o){if(t&1&&(d(0,"li",50),q(1,jp,1,1)(2,$p,1,1,"ng-container"),u()),t&2){let e=l().options,n=l(2);h(n.cx("emptyMessage")),s("ngStyle",Q(5,Ht,e.itemSize+"px"))("pBind",n.ptm("emptyMessage")),c(),W(!n.emptyTemplate&&!n._emptyTemplate?1:2)}}function qp(t,o){if(t&1&&(d(0,"ul",47,13),p(2,Bp,2,2,"ng-template",48)(3,Hp,3,7,"li",49)(4,Up,3,7,"li",49),u()),t&2){let e=o.$implicit,n=o.options,i=l(2);ge(n.contentStyle),h(i.cn(i.cx("list"),n.contentStyleClass)),s("pBind",i.ptm("list")),x("id",i.id+"_list")("aria-label",i.listLabel),c(2),s("ngForOf",e),c(),s("ngIf",i.filterValue&&i.isEmpty()),c(),s("ngIf",!i.filterValue&&i.isEmpty())}}function Wp(t,o){t&1&&B(0)}function Qp(t,o){if(t&1){let e=V();d(0,"div",38)(1,"span",39,6),w("focus",function(i){f(e);let r=l();return g(r.onFirstHiddenFocus(i))}),u(),p(3,gp,1,0,"ng-container",31)(4,Ip,4,5,"div",27),d(5,"div",36),p(6,Dp,5,11,"p-scroller",40)(7,Op,2,6,"ng-container",18)(8,qp,5,10,"ng-template",null,7,pe),u(),p(10,Wp,1,0,"ng-container",31),d(11,"span",39,8),w("focus",function(i){f(e);let r=l();return g(r.onLastHiddenFocus(i))}),u()()}if(t&2){let e=l();h(e.cn(e.cx("overlay"),e.panelStyleClass)),s("ngStyle",e.panelStyle)("pBind",e.ptm("overlay")),x("data-p",e.overlayDataP),c(),s("pBind",e.ptm("hiddenFirstFocusableEl")),x("tabindex",0)("data-p-hidden-accessible",!0)("data-p-hidden-focusable",!0),c(2),s("ngTemplateOutlet",e.headerTemplate||e._headerTemplate),c(),s("ngIf",e.filter),c(),h(e.cx("listContainer")),yt("max-height",e.virtualScroll?"auto":e.scrollHeight||"auto"),s("pBind",e.ptm("listContainer")),c(),s("ngIf",e.virtualScroll),c(),s("ngIf",!e.virtualScroll),c(3),s("ngTemplateOutlet",e.footerTemplate||e._footerTemplate),c(),s("pBind",e.ptm("hiddenLastFocusableEl")),x("tabindex",0)("data-p-hidden-accessible",!0)("data-p-hidden-focusable",!0)}}var Yp=`
    ${_r}

    /* For PrimeNG */
    .p-select-label.p-placeholder {
        color: dt('select.placeholder.color');
    }

    .p-select.ng-invalid.ng-dirty {
        border-color: dt('select.invalid.border.color');
    }

    .p-dropdown.ng-invalid.ng-dirty .p-dropdown-label.p-placeholder,
    .p-select.ng-invalid.ng-dirty .p-select-label.p-placeholder {
        color: dt('select.invalid.placeholder.color');
    }
`,Kp={root:({instance:t})=>["p-select p-component p-inputwrapper",{"p-disabled":t.$disabled(),"p-variant-filled":t.$variant()==="filled","p-focus":t.focused,"p-invalid":t.invalid(),"p-inputwrapper-filled":t.$filled(),"p-inputwrapper-focus":t.focused||t.overlayVisible,"p-select-open":t.overlayVisible,"p-select-fluid":t.hasFluid,"p-select-sm p-inputfield-sm":t.size()==="small","p-select-lg p-inputfield-lg":t.size()==="large"}],label:({instance:t})=>["p-select-label",{"p-placeholder":t.placeholder()&&t.label()===t.placeholder(),"p-select-label-empty":!t.editable&&!t.selectedItemTemplate&&(t.label()===void 0||t.label()===null||t.label()==="p-emptylabel"||t.label().length===0)}],clearIcon:"p-select-clear-icon",dropdown:"p-select-dropdown",loadingIcon:"p-select-loading-icon",dropdownIcon:"p-select-dropdown-icon",overlay:"p-select-overlay p-component-overlay p-component",header:"p-select-header",pcFilter:"p-select-filter",listContainer:"p-select-list-container",list:"p-select-list",optionGroup:"p-select-option-group",optionGroupLabel:"p-select-option-group-label",option:({instance:t})=>["p-select-option",{"p-select-option-selected":t.selected&&!t.checkmark,"p-disabled":t.disabled,"p-focus":t.focused}],optionLabel:"p-select-option-label",optionCheckIcon:"p-select-option-check-icon",optionBlankIcon:"p-select-option-blank-icon",emptyMessage:"p-select-empty-message"},un=(()=>{class t extends te{name="select";style=Yp;classes=Kp;static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275prov=$({token:t,factory:t.\u0275fac})}return t})();var xr=new L("SELECT_INSTANCE"),Zp=new L("SELECT_ITEM_INSTANCE"),Xp={provide:ut,useExisting:We(()=>eu),multi:!0},Jp=(()=>{class t extends le{hostName="select";$pcSelectItem=b(Zp,{optional:!0,skipSelf:!0})??void 0;$pcSelect=b(xr,{optional:!0,skipSelf:!0})??void 0;id;option;selected;focused;label;disabled;visible;itemSize;ariaPosInset;ariaSetSize;template;checkmark;index;scrollerOptions;onClick=new S;onMouseEnter=new S;_componentStyle=b(un);onOptionClick(e){this.onClick.emit(e)}onOptionMouseEnter(e){this.onMouseEnter.emit(e)}getPTOptions(){return this.$pcSelect?.getPTItemOptions?.(this.option,this.scrollerOptions,this.index??0,"option")??this.$pcSelect?.ptm("option",{context:{option:this.option,selected:this.selected,focused:this.focused,disabled:this.disabled}})}static \u0275fac=(()=>{let e;return function(i){return(e||(e=I(t)))(i||t)}})();static \u0275cmp=E({type:t,selectors:[["p-selectItem"]],inputs:{id:"id",option:"option",selected:[2,"selected","selected",C],focused:[2,"focused","focused",C],label:"label",disabled:[2,"disabled","disabled",C],visible:[2,"visible","visible",C],itemSize:[2,"itemSize","itemSize",Se],ariaPosInset:"ariaPosInset",ariaSetSize:"ariaSetSize",template:"template",checkmark:[2,"checkmark","checkmark",C],index:"index",scrollerOptions:"scrollerOptions"},outputs:{onClick:"onClick",onMouseEnter:"onMouseEnter"},features:[j([un,{provide:X,useExisting:t}]),M],decls:4,vars:21,consts:[["role","option","pRipple","",3,"click","mouseenter","id","pBind","ngStyle"],[4,"ngIf"],[3,"pBind",4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["data-p-icon","check",3,"class","pBind",4,"ngIf"],["data-p-icon","blank",3,"class","pBind",4,"ngIf"],["data-p-icon","check",3,"pBind"],["data-p-icon","blank",3,"pBind"],[3,"pBind"]],template:function(n,i){n&1&&(d(0,"li",0),w("click",function(a){return i.onOptionClick(a)})("mouseenter",function(a){return i.onOptionMouseEnter(a)}),p(1,vd,3,2,"ng-container",1)(2,Cd,2,2,"span",2)(3,xd,1,0,"ng-container",3),u()),n&2&&(h(i.cx("option")),s("id",i.id)("pBind",i.getPTOptions())("ngStyle",Q(17,Ht,(i.scrollerOptions==null?null:i.scrollerOptions.itemSize)+"px")),x("aria-label",i.label)("aria-setsize",i.ariaSetSize)("aria-posinset",i.ariaPosInset)("aria-selected",i.selected)("data-p-focused",i.focused)("data-p-highlight",i.selected)("data-p-selected",i.selected)("data-p-disabled",i.disabled),c(),s("ngIf",i.checkmark),c(),s("ngIf",!i.template),c(),s("ngTemplateOutlet",i.template)("ngTemplateOutletContext",Q(19,zn,i.option)))},dependencies:[ne,Ie,ue,Ke,ae,Xt,Zt,ro,Ee,v],encapsulation:2})}return t})(),eu=(()=>{class t extends rr{zone;filterService;componentName="Select";bindDirectiveInstance=b(v,{self:!0});id;scrollHeight="200px";filter;panelStyle;styleClass;panelStyleClass;readonly;editable;tabindex=0;set placeholder(e){this._placeholder.set(e)}get placeholder(){return this._placeholder.asReadonly()}loadingIcon;filterPlaceholder;filterLocale;inputId;dataKey;filterBy;filterFields;autofocus;resetFilterOnHide=!1;checkmark=!1;dropdownIcon;loading=!1;optionLabel;optionValue;optionDisabled;optionGroupLabel="label";optionGroupChildren="items";group;showClear;emptyFilterMessage="";emptyMessage="";lazy=!1;virtualScroll;virtualScrollItemSize;virtualScrollOptions;overlayOptions;ariaFilterLabel;ariaLabel;ariaLabelledBy;filterMatchMode="contains";tooltip="";tooltipPosition="right";tooltipPositionStyle="absolute";tooltipStyleClass;focusOnHover=!0;selectOnFocus=!1;autoOptionFocus=!1;autofocusFilter=!0;get filterValue(){return this._filterValue()}set filterValue(e){setTimeout(()=>{this._filterValue.set(e)})}get options(){return this._options()}set options(e){ti(e,this._options())||this._options.set(e)}appendTo=k(void 0);motionOptions=k(void 0);onChange=new S;onFilter=new S;onFocus=new S;onBlur=new S;onClick=new S;onShow=new S;onHide=new S;onClear=new S;onLazyLoad=new S;_componentStyle=b(un);filterViewChild;focusInputViewChild;editableInputViewChild;itemsViewChild;scroller;overlayViewChild;firstHiddenFocusableElementOnOverlay;lastHiddenFocusableElementOnOverlay;itemsWrapper;$appendTo=A(()=>this.appendTo()||this.config.overlayAppendTo());itemTemplate;groupTemplate;loaderTemplate;selectedItemTemplate;headerTemplate;filterTemplate;footerTemplate;emptyFilterTemplate;emptyTemplate;dropdownIconTemplate;loadingIconTemplate;clearIconTemplate;filterIconTemplate;onIconTemplate;offIconTemplate;cancelIconTemplate;templates;_itemTemplate;_selectedItemTemplate;_headerTemplate;_filterTemplate;_footerTemplate;_emptyFilterTemplate;_emptyTemplate;_groupTemplate;_loaderTemplate;_dropdownIconTemplate;_loadingIconTemplate;_clearIconTemplate;_filterIconTemplate;_cancelIconTemplate;_onIconTemplate;_offIconTemplate;filterOptions;_options=U(null);_placeholder=U(void 0);value;hover;focused;overlayVisible;optionsChanged;panel;dimensionsUpdated;hoveredItem;selectedOptionUpdated;_filterValue=U(null);searchValue;searchIndex;searchTimeout;previousSearchChar;currentSearchChar;preventModelTouched;focusedOptionIndex=U(-1);labelId;listId;clicked=U(!1);get emptyMessageLabel(){return this.emptyMessage||this.config.getTranslation(Je.EMPTY_MESSAGE)}get emptyFilterMessageLabel(){return this.emptyFilterMessage||this.config.getTranslation(Je.EMPTY_FILTER_MESSAGE)}get isVisibleClearIcon(){return this.modelValue()!=null&&this.hasSelectedOption()&&this.showClear&&!this.$disabled()}get listLabel(){return this.config.getTranslation(Je.ARIA).listLabel}get focusedOptionId(){return this.focusedOptionIndex()!==-1?`${this.id}_${this.focusedOptionIndex()}`:null}visibleOptions=A(()=>{let e=this.getAllVisibleAndNonVisibleOptions();if(this._filterValue()){let i=!(this.filterBy||this.optionLabel)&&!this.filterFields&&!this.optionValue?this.options?.filter(r=>r.label?r.label.toString().toLowerCase().indexOf(this._filterValue().toLowerCase().trim())!==-1:r.toString().toLowerCase().indexOf(this._filterValue().toLowerCase().trim())!==-1):this.filterService.filter(e,this.searchFields(),this._filterValue().trim(),this.filterMatchMode,this.filterLocale);if(this.group){let r=this.options||[],a=[];return r.forEach(m=>{let O=this.getOptionGroupChildren(m).filter(D=>i?.includes(D));O.length>0&&a.push(ve(P({},m),{[typeof this.optionGroupChildren=="string"?this.optionGroupChildren:"items"]:[...O]}))}),this.flatOptions(a)}return i}return e});label=A(()=>{let e=this.getAllVisibleAndNonVisibleOptions(),n=e.findIndex(i=>this.isOptionValueEqualsModelValue(i));if(n!==-1){let i=e[n];return this.getOptionLabel(i)}return this.placeholder()||"p-emptylabel"});selectedOption;constructor(e,n){super(),this.zone=e,this.filterService=n,Dt(()=>{let i=this.modelValue(),r=this.visibleOptions();if(r&&vt(r)){let a=this.findSelectedOptionIndex();if(a!==-1||i===void 0||typeof i=="string"&&i.length===0||this.isModelValueNotSet()||this.editable)this.selectedOption=r[a];else{let m=r.findIndex(T=>this.isSelected(T));m!==-1&&(this.selectedOption=r[m])}}_n(r)&&(i===void 0||this.isModelValueNotSet())&&vt(this.selectedOption)&&(this.selectedOption=null),i!==void 0&&this.editable&&this.updateEditableLabel(),this.cd.markForCheck()})}isModelValueNotSet(){return this.modelValue()===null&&!this.isOptionValueEqualsModelValue(this.selectedOption)}getAllVisibleAndNonVisibleOptions(){return this.group?this.flatOptions(this.options):this.options||[]}onInit(){this.id=this.id||Re("pn_id_"),this.autoUpdateModel(),this.filterBy&&(this.filterOptions={filter:e=>this.onFilterInputChange(e),reset:()=>this.resetFilter()})}onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"item":this._itemTemplate=e.template;break;case"selectedItem":this._selectedItemTemplate=e.template;break;case"header":this._headerTemplate=e.template;break;case"filter":this._filterTemplate=e.template;break;case"footer":this._footerTemplate=e.template;break;case"emptyfilter":this._emptyFilterTemplate=e.template;break;case"empty":this._emptyTemplate=e.template;break;case"group":this._groupTemplate=e.template;break;case"loader":this._loaderTemplate=e.template;break;case"dropdownicon":this._dropdownIconTemplate=e.template;break;case"loadingicon":this._loadingIconTemplate=e.template;break;case"clearicon":this._clearIconTemplate=e.template;break;case"filtericon":this._filterIconTemplate=e.template;break;case"cancelicon":this._cancelIconTemplate=e.template;break;case"onicon":this._onIconTemplate=e.template;break;case"officon":this._offIconTemplate=e.template;break;default:this._itemTemplate=e.template;break}})}onAfterViewChecked(){if(this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"])),this.optionsChanged&&this.overlayVisible&&(this.optionsChanged=!1,this.zone.runOutsideAngular(()=>{setTimeout(()=>{this.overlayViewChild&&this.overlayViewChild.alignOverlay()},1)})),this.selectedOptionUpdated&&this.itemsWrapper){let e=Ue(this.overlayViewChild?.overlayViewChild?.nativeElement,'li[data-p-selected="true"]');e&&pi(this.itemsWrapper,e),this.selectedOptionUpdated=!1}}flatOptions(e){return(e||[]).reduce((n,i,r)=>{n.push({optionGroup:i,group:!0,index:r});let a=this.getOptionGroupChildren(i);return a&&a.forEach(m=>n.push(m)),n},[])}autoUpdateModel(){this.selectOnFocus&&this.autoOptionFocus&&!this.hasSelectedOption()&&(this.focusedOptionIndex.set(this.findFirstFocusedOptionIndex()),this.onOptionSelect(null,this.visibleOptions()[this.focusedOptionIndex()],!1))}onOptionSelect(e,n,i=!0,r=!1){if(!this.isOptionDisabled(n)){if(!this.isSelected(n)){let a=this.getOptionValue(n);this.updateModel(a,e),this.focusedOptionIndex.set(this.findSelectedOptionIndex()),r===!1&&this.onChange.emit({originalEvent:e,value:a})}i&&this.hide(!0)}}onOptionMouseEnter(e,n){this.focusOnHover&&this.changeFocusedOptionIndex(e,n)}updateModel(e,n){this.value=e,this.onModelChange(e),this.writeModelValue(e),this.selectedOptionUpdated=!0}allowModelChange(){return!!this.modelValue()&&!this.placeholder()&&(this.modelValue()===void 0||this.modelValue()===null)&&!this.editable&&this.options&&this.options.length}isSelected(e){return this.isOptionValueEqualsModelValue(e)}isOptionValueEqualsModelValue(e){return e!=null&&!this.isOptionGroup(e)&&$t(this.modelValue(),this.getOptionValue(e),this.equalityKey())}onAfterViewInit(){this.editable&&this.updateEditableLabel(),this.updatePlaceHolderForFloatingLabel()}updatePlaceHolderForFloatingLabel(){let e=this.el.nativeElement.parentElement,n=e?.classList.contains("p-float-label");if(e&&n&&!this.selectedOption){let i=e.querySelector("label");i&&this._placeholder.set(i.textContent)}}updateEditableLabel(){this.editableInputViewChild&&(this.editableInputViewChild.nativeElement.value=this.getOptionLabel(this.selectedOption)||this.modelValue()||"")}clearEditableLabel(){this.editableInputViewChild&&(this.editableInputViewChild.nativeElement.value="")}getOptionIndex(e,n){return this.virtualScrollerDisabled?e:n&&n.getItemOptions(e).index}getOptionLabel(e){return this.optionLabel!==void 0&&this.optionLabel!==null?Ct(e,this.optionLabel):e&&e.label!==void 0?e.label:e}getOptionValue(e){return this.optionValue&&this.optionValue!==null?Ct(e,this.optionValue):!this.optionLabel&&e&&e.value!==void 0?e.value:e}getPTItemOptions(e,n,i,r){return this.ptm(r,{context:{option:e,index:i,selected:this.isSelected(e),focused:this.focusedOptionIndex()===this.getOptionIndex(i,n),disabled:this.isOptionDisabled(e)}})}isSelectedOptionEmpty(){return _n(this.selectedOption)}isOptionDisabled(e){return this.optionDisabled?Ct(e,this.optionDisabled):e&&e.disabled!==void 0?e.disabled:!1}getOptionGroupLabel(e){return this.optionGroupLabel!==void 0&&this.optionGroupLabel!==null?Ct(e,this.optionGroupLabel):e&&e.label!==void 0?e.label:e}getOptionGroupChildren(e){return this.optionGroupChildren!==void 0&&this.optionGroupChildren!==null?Ct(e,this.optionGroupChildren):e.items}getAriaPosInset(e){return(this.optionGroupLabel?e-this.visibleOptions().slice(0,e).filter(n=>this.isOptionGroup(n)).length:e)+1}get ariaSetSize(){return this.visibleOptions().filter(e=>!this.isOptionGroup(e)).length}resetFilter(){this._filterValue.set(null),this.filterViewChild&&this.filterViewChild.nativeElement&&(this.filterViewChild.nativeElement.value="")}onContainerClick(e){this.$disabled()||this.readonly||this.loading||e.target.tagName==="INPUT"||e.target.getAttribute("data-pc-section")==="clearicon"||e.target.closest('[data-pc-section="clearicon"]')||((!this.overlayViewChild||!this.overlayViewChild.el.nativeElement.contains(e.target))&&(this.overlayVisible?this.hide(!0):this.show(!0)),this.focusInputViewChild?.nativeElement.focus({preventScroll:!0}),this.onClick.emit(e),this.clicked.set(!0),this.cd.detectChanges())}isEmpty(){return!this._options()||this.visibleOptions()&&this.visibleOptions().length===0}onEditableInput(e){let n=e.target.value;this.searchValue="",!this.searchOptions(e,n)&&this.focusedOptionIndex.set(-1),this.onModelChange(n),this.updateModel(n||null,e),setTimeout(()=>{this.onChange.emit({originalEvent:e,value:n})},1),!this.overlayVisible&&vt(n)&&this.show()}show(e){this.overlayVisible=!0,this.focusedOptionIndex.set(this.focusedOptionIndex()!==-1?this.focusedOptionIndex():this.autoOptionFocus?this.findFirstFocusedOptionIndex():this.editable?-1:this.findSelectedOptionIndex()),e&&ze(this.focusInputViewChild?.nativeElement),this.cd.markForCheck()}onOverlayBeforeEnter(e){if(this.itemsWrapper=Ue(this.overlayViewChild?.overlayViewChild?.nativeElement,this.virtualScroll?'[data-pc-name="virtualscroller"]':'[data-pc-section="listcontainer"]'),this.virtualScroll&&this.scroller?.setContentEl(this.itemsViewChild?.nativeElement),this.options&&this.options.length)if(this.virtualScroll){let n=this.modelValue()?this.focusedOptionIndex():-1;n!==-1&&setTimeout(()=>{this.scroller?.scrollToIndex(n)},10)}else{let n=Ue(this.itemsWrapper,'[data-p-selected="true"]');n&&n.scrollIntoView({block:"nearest",inline:"nearest"})}this.filterViewChild&&this.filterViewChild.nativeElement&&(this.preventModelTouched=!0,this.autofocusFilter&&!this.editable&&this.filterViewChild.nativeElement.focus()),this.onShow.emit(e)}onOverlayAfterLeave(e){this.itemsWrapper=null,this.onModelTouched(),this.onHide.emit(e)}hide(e){this.overlayVisible=!1,this.focusedOptionIndex.set(-1),this.clicked.set(!1),this.searchValue="",this.overlayOptions?.mode==="modal"&&At(),this.filter&&this.resetFilterOnHide&&this.resetFilter(),e&&(this.focusInputViewChild&&ze(this.focusInputViewChild?.nativeElement),this.editable&&this.editableInputViewChild&&ze(this.editableInputViewChild?.nativeElement)),this.cd.markForCheck()}onInputFocus(e){if(this.$disabled())return;this.focused=!0;let n=this.focusedOptionIndex()!==-1?this.focusedOptionIndex():this.overlayVisible&&this.autoOptionFocus?this.findFirstFocusedOptionIndex():-1;this.focusedOptionIndex.set(n),this.overlayVisible&&this.scrollInView(this.focusedOptionIndex()),this.onFocus.emit(e)}onInputBlur(e){this.focused=!1,this.onBlur.emit(e),!this.preventModelTouched&&!this.overlayVisible&&this.onModelTouched(),this.preventModelTouched=!1}onKeyDown(e,n=!1){if(!(this.$disabled()||this.readonly||this.loading)){switch(e.code){case"ArrowDown":this.onArrowDownKey(e);break;case"ArrowUp":this.onArrowUpKey(e,this.editable);break;case"ArrowLeft":case"ArrowRight":this.onArrowLeftKey(e,this.editable);break;case"Delete":this.onDeleteKey(e);break;case"Home":this.onHomeKey(e,this.editable);break;case"End":this.onEndKey(e,this.editable);break;case"PageDown":this.onPageDownKey(e);break;case"PageUp":this.onPageUpKey(e);break;case"Space":this.onSpaceKey(e,n);break;case"Enter":case"NumpadEnter":this.onEnterKey(e);break;case"Escape":this.onEscapeKey(e);break;case"Tab":this.onTabKey(e);break;case"Backspace":this.onBackspaceKey(e,this.editable);break;case"ShiftLeft":case"ShiftRight":break;default:!e.metaKey&&ii(e.key)&&(!this.overlayVisible&&this.show(),!this.editable&&this.searchOptions(e,e.key));break}this.clicked.set(!1)}}onFilterKeyDown(e){switch(e.code){case"ArrowDown":this.onArrowDownKey(e);break;case"ArrowUp":this.onArrowUpKey(e,!0);break;case"ArrowLeft":case"ArrowRight":this.onArrowLeftKey(e,!0);break;case"Home":this.onHomeKey(e,!0);break;case"End":this.onEndKey(e,!0);break;case"Enter":case"NumpadEnter":this.onEnterKey(e,!0);break;case"Escape":this.onEscapeKey(e);break;case"Tab":this.onTabKey(e,!0);break;default:break}}onFilterBlur(e){this.focusedOptionIndex.set(-1)}onArrowDownKey(e){if(!this.overlayVisible)this.show(),this.editable&&this.changeFocusedOptionIndex(e,this.findSelectedOptionIndex());else{let n=this.focusedOptionIndex()!==-1?this.findNextOptionIndex(this.focusedOptionIndex()):this.clicked()?this.findFirstOptionIndex():this.findFirstFocusedOptionIndex();this.changeFocusedOptionIndex(e,n)}e.preventDefault(),e.stopPropagation()}changeFocusedOptionIndex(e,n){if(this.focusedOptionIndex()!==n&&(this.focusedOptionIndex.set(n),this.scrollInView(),this.selectOnFocus)){let i=this.visibleOptions()[n];this.onOptionSelect(e,i,!1)}}get virtualScrollerDisabled(){return!this.virtualScroll}scrollInView(e=-1){let n=e!==-1?`${this.id}_${e}`:this.focusedOptionId;if(this.itemsViewChild&&this.itemsViewChild.nativeElement){let i=Ue(this.itemsViewChild.nativeElement,`li[id="${n}"]`);i?i.scrollIntoView&&i.scrollIntoView({block:"nearest",inline:"nearest"}):this.virtualScrollerDisabled||setTimeout(()=>{this.virtualScroll&&this.scroller?.scrollToIndex(e!==-1?e:this.focusedOptionIndex())},0)}}hasSelectedOption(){return this.modelValue()!==void 0}isValidSelectedOption(e){return this.isValidOption(e)&&this.isSelected(e)}equalityKey(){return this.optionValue?void 0:this.dataKey}findFirstFocusedOptionIndex(){let e=this.findSelectedOptionIndex();return e<0?this.findFirstOptionIndex():e}findFirstOptionIndex(){return this.visibleOptions().findIndex(e=>this.isValidOption(e))}findSelectedOptionIndex(){return this.hasSelectedOption()?this.visibleOptions().findIndex(e=>this.isValidSelectedOption(e)):-1}findNextOptionIndex(e){let n=e<this.visibleOptions().length-1?this.visibleOptions().slice(e+1).findIndex(i=>this.isValidOption(i)):-1;return n>-1?n+e+1:e}findPrevOptionIndex(e){let n=e>0?yn(this.visibleOptions().slice(0,e),i=>this.isValidOption(i)):-1;return n>-1?n:e}findLastOptionIndex(){return yn(this.visibleOptions(),e=>this.isValidOption(e))}findLastFocusedOptionIndex(){let e=this.findSelectedOptionIndex();return e<0?this.findLastOptionIndex():e}isValidOption(e){return e!=null&&!(this.isOptionDisabled(e)||this.isOptionGroup(e))}isOptionGroup(e){return this.optionGroupLabel!==void 0&&this.optionGroupLabel!==null&&e.optionGroup!==void 0&&e.optionGroup!==null&&e.group}onArrowUpKey(e,n=!1){if(e.altKey&&!n){if(this.focusedOptionIndex()!==-1){let i=this.visibleOptions()[this.focusedOptionIndex()];this.onOptionSelect(e,i)}this.overlayVisible&&this.hide()}else{let i=this.focusedOptionIndex()!==-1?this.findPrevOptionIndex(this.focusedOptionIndex()):this.clicked()?this.findLastOptionIndex():this.findLastFocusedOptionIndex();this.changeFocusedOptionIndex(e,i),!this.overlayVisible&&this.show()}e.preventDefault(),e.stopPropagation()}onArrowLeftKey(e,n=!1){n&&this.focusedOptionIndex.set(-1)}onDeleteKey(e){this.showClear&&(this.clear(e),e.preventDefault())}onHomeKey(e,n=!1){if(n&&e.currentTarget&&e.currentTarget.setSelectionRange){let i=e.currentTarget;e.shiftKey?i.setSelectionRange(0,i.value.length):(i.setSelectionRange(0,0),this.focusedOptionIndex.set(-1))}else this.changeFocusedOptionIndex(e,this.findFirstOptionIndex()),!this.overlayVisible&&this.show();e.preventDefault()}onEndKey(e,n=!1){if(n&&e.currentTarget&&e.currentTarget.setSelectionRange){let i=e.currentTarget;if(e.shiftKey)i.setSelectionRange(0,i.value.length);else{let r=i.value.length;i.setSelectionRange(r,r),this.focusedOptionIndex.set(-1)}}else this.changeFocusedOptionIndex(e,this.findLastOptionIndex()),!this.overlayVisible&&this.show();e.preventDefault()}onPageDownKey(e){this.scrollInView(this.visibleOptions().length-1),e.preventDefault()}onPageUpKey(e){this.scrollInView(0),e.preventDefault()}onSpaceKey(e,n=!1){!this.editable&&!n&&this.onEnterKey(e)}onEnterKey(e,n=!1){if(!this.overlayVisible)this.focusedOptionIndex.set(-1),this.onArrowDownKey(e);else{if(this.focusedOptionIndex()!==-1){let i=this.visibleOptions()[this.focusedOptionIndex()];this.onOptionSelect(e,i)}!n&&this.hide()}e.preventDefault()}onEscapeKey(e){this.overlayVisible&&(this.hide(!0),e.preventDefault(),e.stopPropagation())}onTabKey(e,n=!1){if(!n)if(this.overlayVisible&&this.hasFocusableElements())ze(e.shiftKey?this.lastHiddenFocusableElementOnOverlay?.nativeElement:this.firstHiddenFocusableElementOnOverlay?.nativeElement),e.preventDefault();else{if(this.focusedOptionIndex()!==-1&&this.overlayVisible){let i=this.visibleOptions()[this.focusedOptionIndex()];this.onOptionSelect(e,i)}this.overlayVisible&&this.hide(this.filter)}e.stopPropagation()}onFirstHiddenFocus(e){let n=e.relatedTarget===this.focusInputViewChild?.nativeElement?li(this.overlayViewChild?.el?.nativeElement,':not([data-p-hidden-focusable="true"])'):this.focusInputViewChild?.nativeElement;ze(n)}onLastHiddenFocus(e){let n=e.relatedTarget===this.focusInputViewChild?.nativeElement?ci(this.overlayViewChild?.overlayViewChild?.nativeElement,':not([data-p-hidden-focusable="true"])'):this.focusInputViewChild?.nativeElement;ze(n)}hasFocusableElements(){return si(this.overlayViewChild?.overlayViewChild?.nativeElement,':not([data-p-hidden-focusable="true"])').length>0}onBackspaceKey(e,n=!1){n&&!this.overlayVisible&&this.show()}searchFields(){return this.filterBy?.split(",")||this.filterFields||[this.optionLabel]}searchOptions(e,n){this.searchValue=(this.searchValue||"")+n;let i=-1,r=!1;return i=this.visibleOptions().findIndex(a=>this.isOptionMatched(a)),i!==-1&&(r=!0),i===-1&&this.focusedOptionIndex()===-1&&(i=this.findFirstFocusedOptionIndex()),i!==-1&&setTimeout(()=>{this.changeFocusedOptionIndex(e,i)}),this.searchTimeout&&clearTimeout(this.searchTimeout),this.searchTimeout=setTimeout(()=>{this.searchValue="",this.searchTimeout=null},500),r}isOptionMatched(e){return this.isValidOption(e)&&this.getOptionLabel(e).toString().toLocaleLowerCase(this.filterLocale).startsWith(this.searchValue?.toLocaleLowerCase(this.filterLocale))}onFilterInputChange(e){let n=e.target.value;this._filterValue.set(n),this.focusedOptionIndex.set(-1),this.onFilter.emit({originalEvent:e,filter:this._filterValue()}),!this.virtualScrollerDisabled&&this.scroller?.scrollToIndex(0),setTimeout(()=>{this.overlayViewChild?.alignOverlay()}),this.cd.markForCheck()}applyFocus(){this.editable?Ue(this.el.nativeElement,'[data-pc-section="label"]').focus():ze(this.focusInputViewChild?.nativeElement)}focus(){this.applyFocus()}clear(e){this.updateModel(null,e),this.clearEditableLabel(),this.onModelTouched(),this.onChange.emit({originalEvent:e,value:this.value}),this.onClear.emit(e),this.resetFilter()}writeControlValue(e,n){this.filter&&this.resetFilter(),this.value=e,this.allowModelChange()&&this.onModelChange(e),n(this.value),this.updateEditableLabel(),this.cd.markForCheck()}get containerDataP(){return this.cn({invalid:this.invalid(),disabled:this.$disabled(),focus:this.focused,fluid:this.hasFluid,filled:this.$variant()==="filled",[this.size()]:this.size()})}get labelDataP(){return this.cn({placeholder:this.label===this.placeholder,clearable:this.showClear,disabled:this.$disabled(),[this.size()]:this.size(),empty:!this.editable&&!this.selectedItemTemplate&&(!this.label?.()||this.label()==="p-emptylabel"||this.label()?.length===0)})}get dropdownIconDataP(){return this.cn({[this.size()]:this.size()})}get overlayDataP(){return this.cn({["overlay-"+this.$appendTo()]:"overlay-"+this.$appendTo()})}static \u0275fac=function(n){return new(n||t)(de(je),de(ui))};static \u0275cmp=E({type:t,selectors:[["p-select"]],contentQueries:function(n,i,r){if(n&1&&fe(r,wd,4)(r,Id,4)(r,Td,4)(r,Sd,4)(r,kd,4)(r,yr,4)(r,Md,4)(r,Ed,4)(r,Dd,4)(r,Vd,4)(r,Od,4)(r,Ad,4)(r,Fd,4)(r,Pd,4)(r,Nd,4)(r,Bd,4)(r,ce,4),n&2){let a;_(a=y())&&(i.itemTemplate=a.first),_(a=y())&&(i.groupTemplate=a.first),_(a=y())&&(i.loaderTemplate=a.first),_(a=y())&&(i.selectedItemTemplate=a.first),_(a=y())&&(i.headerTemplate=a.first),_(a=y())&&(i.filterTemplate=a.first),_(a=y())&&(i.footerTemplate=a.first),_(a=y())&&(i.emptyFilterTemplate=a.first),_(a=y())&&(i.emptyTemplate=a.first),_(a=y())&&(i.dropdownIconTemplate=a.first),_(a=y())&&(i.loadingIconTemplate=a.first),_(a=y())&&(i.clearIconTemplate=a.first),_(a=y())&&(i.filterIconTemplate=a.first),_(a=y())&&(i.onIconTemplate=a.first),_(a=y())&&(i.offIconTemplate=a.first),_(a=y())&&(i.cancelIconTemplate=a.first),_(a=y())&&(i.templates=a)}},viewQuery:function(n,i){if(n&1&&Ae(yr,5)(Ld,5)(zd,5)(Rd,5)(Hd,5)(jd,5)(Gd,5)($d,5),n&2){let r;_(r=y())&&(i.filterViewChild=r.first),_(r=y())&&(i.focusInputViewChild=r.first),_(r=y())&&(i.editableInputViewChild=r.first),_(r=y())&&(i.itemsViewChild=r.first),_(r=y())&&(i.scroller=r.first),_(r=y())&&(i.overlayViewChild=r.first),_(r=y())&&(i.firstHiddenFocusableElementOnOverlay=r.first),_(r=y())&&(i.lastHiddenFocusableElementOnOverlay=r.first)}},hostVars:4,hostBindings:function(n,i){n&1&&w("click",function(a){return i.onContainerClick(a)}),n&2&&(x("id",i.id)("data-p",i.containerDataP),h(i.cn(i.cx("root"),i.styleClass)))},inputs:{id:"id",scrollHeight:"scrollHeight",filter:[2,"filter","filter",C],panelStyle:"panelStyle",styleClass:"styleClass",panelStyleClass:"panelStyleClass",readonly:[2,"readonly","readonly",C],editable:[2,"editable","editable",C],tabindex:[2,"tabindex","tabindex",Se],placeholder:"placeholder",loadingIcon:"loadingIcon",filterPlaceholder:"filterPlaceholder",filterLocale:"filterLocale",inputId:"inputId",dataKey:"dataKey",filterBy:"filterBy",filterFields:"filterFields",autofocus:[2,"autofocus","autofocus",C],resetFilterOnHide:[2,"resetFilterOnHide","resetFilterOnHide",C],checkmark:[2,"checkmark","checkmark",C],dropdownIcon:"dropdownIcon",loading:[2,"loading","loading",C],optionLabel:"optionLabel",optionValue:"optionValue",optionDisabled:"optionDisabled",optionGroupLabel:"optionGroupLabel",optionGroupChildren:"optionGroupChildren",group:[2,"group","group",C],showClear:[2,"showClear","showClear",C],emptyFilterMessage:"emptyFilterMessage",emptyMessage:"emptyMessage",lazy:[2,"lazy","lazy",C],virtualScroll:[2,"virtualScroll","virtualScroll",C],virtualScrollItemSize:[2,"virtualScrollItemSize","virtualScrollItemSize",Se],virtualScrollOptions:"virtualScrollOptions",overlayOptions:"overlayOptions",ariaFilterLabel:"ariaFilterLabel",ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy",filterMatchMode:"filterMatchMode",tooltip:"tooltip",tooltipPosition:"tooltipPosition",tooltipPositionStyle:"tooltipPositionStyle",tooltipStyleClass:"tooltipStyleClass",focusOnHover:[2,"focusOnHover","focusOnHover",C],selectOnFocus:[2,"selectOnFocus","selectOnFocus",C],autoOptionFocus:[2,"autoOptionFocus","autoOptionFocus",C],autofocusFilter:[2,"autofocusFilter","autofocusFilter",C],filterValue:"filterValue",options:"options",appendTo:[1,"appendTo"],motionOptions:[1,"motionOptions"]},outputs:{onChange:"onChange",onFilter:"onFilter",onFocus:"onFocus",onBlur:"onBlur",onClick:"onClick",onShow:"onShow",onHide:"onHide",onClear:"onClear",onLazyLoad:"onLazyLoad"},features:[j([Xp,un,{provide:xr,useExisting:t},{provide:X,useExisting:t}]),J([v]),M],decls:11,vars:18,consts:[["elseBlock",""],["overlay",""],["content",""],["focusInput",""],["defaultPlaceholder",""],["editableInput",""],["firstHiddenFocusableEl",""],["buildInItems",""],["lastHiddenFocusableEl",""],["builtInFilterElement",""],["filter",""],["scroller",""],["loader",""],["items",""],["emptyFilter",""],["empty",""],["role","combobox",3,"class","pBind","pTooltip","pTooltipUnstyled","tooltipPosition","positionStyle","tooltipStyleClass","pAutoFocus","focus","blur","keydown",4,"ngIf"],["type","text",3,"class","pBind","pAutoFocus","input","keydown","focus","blur",4,"ngIf"],[4,"ngIf"],["role","button","aria-label","dropdown trigger","aria-haspopup","listbox",3,"pBind"],[4,"ngIf","ngIfElse"],[3,"visibleChange","onBeforeEnter","onAfterLeave","onHide","hostAttrSelector","visible","options","target","appendTo","unstyled","pt","motionOptions"],["role","combobox",3,"focus","blur","keydown","pBind","pTooltip","pTooltipUnstyled","tooltipPosition","positionStyle","tooltipStyleClass","pAutoFocus"],[3,"ngTemplateOutlet","ngTemplateOutletContext",4,"ngIf"],[3,"ngTemplateOutlet","ngTemplateOutletContext"],["type","text",3,"input","keydown","focus","blur","pBind","pAutoFocus"],["data-p-icon","times",3,"class","pBind","click",4,"ngIf"],[3,"class","pBind","click",4,"ngIf"],["data-p-icon","times",3,"click","pBind"],[3,"click","pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[4,"ngTemplateOutlet"],["aria-hidden","true",3,"class","pBind",4,"ngIf"],["aria-hidden","true",3,"pBind"],[3,"class","pBind",4,"ngIf"],["data-p-icon","chevron-down",3,"class","pBind",4,"ngIf"],[3,"pBind"],["data-p-icon","chevron-down",3,"pBind"],[3,"ngStyle","pBind"],["role","presentation",1,"p-hidden-accessible","p-hidden-focusable",3,"focus","pBind"],["hostName","select",3,"items","style","itemSize","autoSize","lazy","options","pt","onLazyLoad",4,"ngIf"],[3,"pt","unstyled"],["pInputText","","type","text","role","searchbox","autocomplete","off",3,"input","keydown","blur","pSize","value","variant","pt","unstyled"],["data-p-icon","search",3,"pBind",4,"ngIf"],[3,"pBind",4,"ngIf"],["data-p-icon","search",3,"pBind"],["hostName","select",3,"onLazyLoad","items","itemSize","autoSize","lazy","options","pt"],["role","listbox",3,"pBind"],["ngFor","",3,"ngForOf"],["role","option",3,"class","ngStyle","pBind",4,"ngIf"],["role","option",3,"ngStyle","pBind"],[3,"onClick","onMouseEnter","id","option","checkmark","selected","label","disabled","template","focused","ariaPosInset","ariaSetSize","index","unstyled","scrollerOptions"]],template:function(n,i){if(n&1){let r=V();p(0,Kd,6,25,"span",16)(1,Zd,2,20,"input",17)(2,np,3,2,"ng-container",18),d(3,"div",19),p(4,lp,3,2,"ng-container",20)(5,fp,2,2,"ng-template",null,0,pe),u(),d(7,"p-overlay",21,1),ot("visibleChange",function(m){return f(r),it(i.overlayVisible,m)||(i.overlayVisible=m),g(m)}),w("onBeforeEnter",function(m){return i.onOverlayBeforeEnter(m)})("onAfterLeave",function(m){return i.onOverlayAfterLeave(m)})("onHide",function(){return i.hide()}),p(9,Qp,13,23,"ng-template",null,2,pe),u()}if(n&2){let r=we(6);s("ngIf",!i.editable),c(),s("ngIf",i.editable),c(),s("ngIf",i.isVisibleClearIcon),c(),h(i.cx("dropdown")),s("pBind",i.ptm("dropdown")),x("aria-expanded",i.overlayVisible??!1)("data-pc-section","trigger"),c(),s("ngIf",i.loading)("ngIfElse",r),c(3),s("hostAttrSelector",i.$attrSelector),nt("visible",i.overlayVisible),s("options",i.overlayOptions)("target","@parent")("appendTo",i.$appendTo())("unstyled",i.unstyled())("pt",i.ptm("pcOverlay"))("motionOptions",i.motionOptions())}},dependencies:[ne,Gt,Ie,ue,Ke,Jp,pr,_i,Yt,wt,ao,lo,Eo,Qo,Zo,gr,ae,Ee,v],encapsulation:2,changeDetection:0})}return t})();export{ao as a,Si as b,oh as c,sh as d,lh as e,fo as f,Ve as g,jr as h,ki as i,Tn as j,dt as k,Eu as l,Du as m,Vu as n,Ou as o,Mn as p,hh as q,gh as r,_h as s,yh as t,vh as u,Ch as v,ut as w,Gi as x,tt as y,Zi as z,Pn as A,ln as B,Qh as C,Eo as D,jf as E,kt as F,_l as G,yl as H,vg as I,Cg as J,xg as K,wg as L,Ig as M,Bn as N,$o as O,Qo as P,Zo as Q,er as R,tr as S,S0 as T,E0 as U,D0 as V,V0 as W,oo as X,rr as Y,gr as Z,eu as _};
