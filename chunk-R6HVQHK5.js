import{Aa as jn,Ba as g,C as An,Ca as Ie,D as Pn,E as Lt,F as jt,Fa as Ct,G as Nn,Ga as Ne,H as Ht,Ha as Hn,I as Gt,Ja as xt,Ka as Gn,L as Xe,La as $n,Ma as Fe,Oa as Te,P as Fn,Ra as Un,Sa as qn,Ua as Yn,Xa as wt,Ya as Je,Z as $t,_ as yt,a as Rt,b as Pe,d as De,da as On,e as bt,ea as Bn,f as ce,g as W,ga as Ut,h as Qe,ha as He,ka as vt,m as In,n as Tn,na as te,oa as X,pa as ct,ra as zn,sa as U,u as En,ua as q,va as J,w as Sn,wa as Rn,x as Vn,xa as qt,ya as Yt,za as Ln}from"./chunk-M4DDD5VU.js";import{$a as se,$b as j,Ab as ie,Bb as S,Cb as xe,Db as x,Eb as Se,Fb as l,Gb as ee,Ha as bn,Hb as Z,Ia as yn,Ib as le,J as ft,Jb as $e,Ka as vn,Kb as I,L as Le,La as c,Lb as T,M as L,N as re,Ob as Ue,P,Pb as Mn,Qb as be,R as p,Rb as me,Sb as m,Ta as Bt,Tb as Y,Ua as pe,Ub as he,Vb as qe,W as b,X as y,Xb as Ye,Y as V,Yb as We,Z as je,Za as k,Zb as Ze,_ as Ft,_a as ae,a as A,aa as st,b as ue,bb as $,bc as we,ca as N,cb as w,da as _t,db as h,dc as kn,fb as Cn,g as pn,ha as F,hc as Ae,i as mn,ja as lt,jb as v,k as hn,ka as _n,kb as xn,kc as Me,la as f,lb as wn,lc as D,mb as O,na as Ot,nb as B,ob as zt,p as gn,pb as ve,pc as _,qb as Ce,rb as s,rc as ye,sb as d,sc as Dn,tb as u,ub as z,v as fn,vb as R,wb as G,wc as C,xb as ne,xc as ke,yb as fe,zb as _e}from"./chunk-IQ2M3PKF.js";var Wn=`
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
`;var To=["start"],Eo=["end"],So=["center"],Vo=["*"];function Ao(t,n){t&1&&ie(0)}function Po(t,n){if(t&1&&(d(0,"div",1),h(1,Ao,1,0,"ng-container",2),u()),t&2){let e=l();m(e.cx("start")),s("pBind",e.ptm("start")),c(),s("ngTemplateOutlet",e.startTemplate||e._startTemplate)}}function No(t,n){t&1&&ie(0)}function Fo(t,n){if(t&1&&(d(0,"div",1),h(1,No,1,0,"ng-container",2),u()),t&2){let e=l();m(e.cx("center")),s("pBind",e.ptm("center")),c(),s("ngTemplateOutlet",e.centerTemplate||e._centerTemplate)}}function Oo(t,n){t&1&&ie(0)}function Bo(t,n){if(t&1&&(d(0,"div",1),h(1,Oo,1,0,"ng-container",2),u()),t&2){let e=l();m(e.cx("end")),s("pBind",e.ptm("end")),c(),s("ngTemplateOutlet",e.endTemplate||e._endTemplate)}}var zo={root:()=>["p-toolbar p-component"],start:"p-toolbar-start",center:"p-toolbar-center",end:"p-toolbar-end"},Zn=(()=>{class t extends U{name="toolbar";style=Wn;classes=zo;static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275prov=L({token:t,factory:t.\u0275fac})}return t})();var Qn=new P("TOOLBAR_INSTANCE"),Xn=(()=>{class t extends J{componentName="Toolbar";$pcToolbar=p(Qn,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=p(g,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}styleClass;ariaLabelledBy;_componentStyle=p(Zn);getBlockableElement(){return this.el.nativeElement.children[0]}startTemplate;endTemplate;centerTemplate;templates;_startTemplate;_endTemplate;_centerTemplate;onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"start":case"left":this._startTemplate=e.template;break;case"end":case"right":this._endTemplate=e.template;break;case"center":this._centerTemplate=e.template;break}})}static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275cmp=k({type:t,selectors:[["p-toolbar"]],contentQueries:function(i,o,r){if(i&1&&le(r,To,4)(r,Eo,4)(r,So,4)(r,te,4),i&2){let a;I(a=T())&&(o.startTemplate=a.first),I(a=T())&&(o.endTemplate=a.first),I(a=T())&&(o.centerTemplate=a.first),I(a=T())&&(o.templates=a)}},hostAttrs:["role","toolbar"],hostVars:3,hostBindings:function(i,o){i&2&&(v("aria-labelledby",o.ariaLabelledBy),m(o.cn(o.cx("root"),o.styleClass)))},inputs:{styleClass:"styleClass",ariaLabelledBy:"ariaLabelledBy"},features:[j([Zn,{provide:Qn,useExisting:t},{provide:q,useExisting:t}]),$([g]),w],ngContentSelectors:Vo,decls:4,vars:3,consts:[[3,"class","pBind",4,"ngIf"],[3,"pBind"],[4,"ngTemplateOutlet"]],template:function(i,o){i&1&&(ee(),Z(0),h(1,Po,2,4,"div",0)(2,Fo,2,4,"div",0)(3,Bo,2,4,"div",0)),i&2&&(c(),s("ngIf",o.startTemplate||o._startTemplate),c(),s("ngIf",o.centerTemplate||o._centerTemplate),c(),s("ngIf",o.endTemplate||o._endTemplate))},dependencies:[W,De,ce,X,Ie,g],encapsulation:2,changeDetection:0})}return t})();var Ro=[[["","chips",""]],[["","actions",""]],[["","filters-trigger",""]]],Lo=["[chips]","[actions]","[filters-trigger]"],jo=t=>({exact:t}),Ho=(t,n)=>n.route;function Go(t,n){t&1&&(d(0,"div",5),z(1,"img",6),Z(2,2),u())}function $o(t,n){if(t&1&&(d(0,"a",8),Y(1),u()),t&2){let e=n.$implicit;s("routerLink",e.route)("routerLinkActiveOptions",we(3,jo,e.exact??!1)),c(),qe(" ",e.label," ")}}function Uo(t,n){if(t&1){let e=S();d(0,"nav",7),ve(1,$o,2,5,"a",8,Ho),u(),d(3,"button",9),x("click",function(){b(e);let o=l();return y(o.mobileNav.toggle())}),V(),d(4,"svg",10),z(5,"line",11)(6,"line",12)(7,"line",13),u()()}if(t&2){let e=l();c(),Ce(e.tabs())}}var Jn=class t{mobileNav=p(Un);tabs=_([]);static \u0275fac=function(e){return new(e||t)};static \u0275cmp=k({type:t,selectors:[["app-global-header"]],inputs:{tabs:[1,"tabs"]},ngContentSelectors:Lo,decls:7,vars:0,consts:[[1,"global-header-toolbar"],["pTemplate","start"],["pTemplate","end"],[1,"global-header-chips-scroll"],[1,"global-header-actions-sticky"],[1,"global-header-start"],["src","constellation-icon.svg","alt","Pyxis",1,"global-header-mobile-logo"],[1,"global-header-tabs"],["routerLinkActive","is-active",1,"global-header-nav-link",3,"routerLink","routerLinkActiveOptions"],["type","button","aria-label","Abrir men\xFA",1,"global-header-burger",3,"click"],["width","20","height","20","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round"],["x1","3","y1","6","x2","21","y2","6"],["x1","3","y1","12","x2","21","y2","12"],["x1","3","y1","18","x2","21","y2","18"]],template:function(e,i){e&1&&(ee(Ro),d(0,"p-toolbar",0),h(1,Go,3,0,"ng-template",1)(2,Uo,8,0,"ng-template",2),u(),d(3,"div",3),Z(4),d(5,"div",4),Z(6,1),u()())},dependencies:[Xn,te,In,Tn],styles:["[_nghost-%COMP%]{display:block;position:sticky;top:0;z-index:10;box-shadow:0 1px 3px #00000014,0 1px 2px -1px #0000000f}.global-header-toolbar[_ngcontent-%COMP%]{border:none;border-radius:0;background:var(--p-surface-0);padding:.875rem 1.5rem}.global-header-start[_ngcontent-%COMP%]{display:flex;align-items:center;gap:1.25rem}.global-header-tabs[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.25rem}.global-header-nav-link[_ngcontent-%COMP%]{padding:.375rem .75rem;border-radius:var(--p-border-radius-md);color:var(--p-text-muted-color);font-weight:600;font-size:.875rem;text-decoration:none;transition:background .15s ease,color .15s ease}.global-header-nav-link[_ngcontent-%COMP%]:hover{background:var(--p-surface-100);color:var(--p-text-color)}.global-header-nav-link.is-active[_ngcontent-%COMP%]{background:var(--p-primary-color);color:var(--p-primary-contrast-color)}.global-header-chips-scroll[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.375rem;padding:.375rem 1.5rem;background:var(--p-surface-0);border-top:1px solid var(--p-content-border-color);overflow-x:auto}.global-header-actions-sticky[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.25rem;position:sticky;right:0;flex-shrink:0;margin-left:auto;padding-left:.75rem;background:var(--p-surface-0)}.global-header-mobile-logo[_ngcontent-%COMP%]{display:none;height:24px;width:auto}.global-header-burger[_ngcontent-%COMP%]{display:none;align-items:center;justify-content:center;width:2.25rem;height:2.25rem;margin-left:.5rem;border:1px solid var(--p-content-border-color);border-radius:var(--p-border-radius-md);background:var(--p-surface-0);color:var(--p-text-color);cursor:pointer}.global-header-burger[_ngcontent-%COMP%]:hover{background:var(--p-surface-100)}@media(max-width:900px){.global-header-mobile-logo[_ngcontent-%COMP%]{display:block}.global-header-burger[_ngcontent-%COMP%]{display:flex}.global-header-toolbar[_ngcontent-%COMP%]{padding:.5rem 1rem;position:relative}.global-header-tabs[_ngcontent-%COMP%]{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);gap:0;max-width:calc(100vw - 7rem)}.global-header-nav-link[_ngcontent-%COMP%]{padding:.25rem .375rem;font-size:.6875rem;white-space:nowrap}.global-header-chips-scroll[_ngcontent-%COMP%]{padding:.25rem 1rem}}"],changeDetection:0})};function qo(t){let n=t.getUTCFullYear(),e=String(t.getUTCMonth()+1).padStart(2,"0"),i=String(t.getUTCDate()).padStart(2,"0");return`${n}-${e}-${i}`}function Mt(t){return new Date(`${t}T00:00:00Z`)}function ge(t,n){let e=Mt(t);return e.setUTCDate(e.getUTCDate()+n),qo(e)}function Yo(t){return Mt(t).getUTCDay()}function Kn(t,n){return Math.round((Mt(n).getTime()-Mt(t).getTime())/864e5)}function Wt(t,n){return new Date(Date.UTC(t,n,0)).getUTCDate()}function ei(t,n){let e=`${t}-${String(n).padStart(2,"0")}-01`,i=(Yo(e)+6)%7,o=Wt(t,n),r=(7-(i+o)%7)%7,a=i+o+r,E=[],M=ge(e,-i);for(let K=0;K<a;K++)E.push({iso:M,inMonth:Number(M.slice(5,7))===n}),M=ge(M,1);let Q=[];for(let K=0;K<E.length;K+=7)Q.push(E.slice(K,K+7));return Q}var ti="2024-01-01",ni="2026-12-31",Wo=2024,Zo=2026,ut=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];function Qt(t){let[n,e,i]=t.split("-").map(Number);return{year:n,month:e,day:i}}function Zt(t){let{month:n,day:e}=Qt(t);return`${e} de ${ut[n-1]}`}function Qo(){let t=[],n=ti,e=1;for(;n<=ni;){let{year:i,month:o}=Qt(n);t.push({id:n,label:Zt(n),granularity:"dia",year:i,month:o,order:e,startDate:n,endDate:n}),e++,n=ge(n,1)}return t}function Xo(){let t=[],n=ti,e=1;for(;ge(n,6)<=ni;){let i=ge(n,6),{year:o,month:r}=Qt(n);t.push({id:`week-${n}`,label:`Semana del ${Zt(n)} al ${Zt(i)}`,granularity:"semana",year:o,month:r,order:e,startDate:n,endDate:i}),e++,n=ge(n,7)}return t}function Jo(){let t=[];for(let n=Wo;n<=Zo;n++)for(let e=1;e<=12;e++){let i=`${n}-${String(e).padStart(2,"0")}`,o=String(Wt(n,e)).padStart(2,"0");t.push({id:i,label:ut[e-1],granularity:"mes",year:n,month:e,order:n*12+e,startDate:`${i}-01`,endDate:`${i}-${o}`})}return t}var Oe=Qo(),ii=Xo(),Be=Jo(),sc={dia:Oe,semana:ii,mes:Be},lc=Be,cc=["2026-05","2026-06","2026-07"],dc="mes",oi=(()=>{let t=new Map;for(let n of ii){let e=n.startDate;for(;e<=n.endDate;)t.set(e,n.id),e=ge(e,1)}return t})();var ze=["XS","S","M","L","XL","XXL","3XL"],ri=["Blanco","Negro","Azul Marino","Gris Melange","Rojo","Verde Oliva","Beige","Celeste","Caf\xE9","Amarillo"],kt=["37","38","39","40","41","42","43"],Ko=["2 a\xF1os","4 a\xF1os","6 a\xF1os","8 a\xF1os","10 a\xF1os","12 a\xF1os"],er=["28","30","32","34","36"],tr=["S","M","L"],nr=["Est\xE1ndar","Premium","Edici\xF3n Limitada"],ai=["Chico","Mediano","Grande"],ir=[{categoryId:"cat-vestuario",categoryName:"Vestuario",subcategoryId:"sub-camisas",subcategoryName:"Camisas",bases:["Camisa Slim Fit Azul","Camisa Slim Fit Blanca","Camisa Oxford Celeste","Camisa Cuadros Rojo","Camisa Lino Beige"],variants:ze,count:35},{categoryId:"cat-vestuario",categoryName:"Vestuario",subcategoryId:"sub-jeans",subcategoryName:"Jeans",bases:["Jean Skinny Negro","Jean Recto Azul","Jean Mom Fit","Jean Slim Gris"],variants:ze,count:28},{categoryId:"cat-vestuario",categoryName:"Vestuario",subcategoryId:"sub-vestidos",subcategoryName:"Vestidos",bases:["Vestido Casual Floral","Vestido Midi Negro","Vestido Lino Beige","Vestido Sat\xE9n Rojo"],variants:ze,count:26},{categoryId:"cat-vestuario",categoryName:"Vestuario",subcategoryId:"sub-blazers",subcategoryName:"Blazers",bases:["Blazer Formal Gris","Blazer Cruzado Azul Marino","Blazer Lino Beige"],variants:ze,count:20},{categoryId:"cat-vestuario",categoryName:"Vestuario",subcategoryId:"sub-poleras",subcategoryName:"Poleras",bases:["Polera B\xE1sica Algod\xF3n","Polera Estampada","Polera Cuello V","Polera Oversize"],variants:ri,count:38},{categoryId:"cat-vestuario",categoryName:"Vestuario",subcategoryId:"sub-chaquetas",subcategoryName:"Chaquetas",bases:["Chaqueta Cortavientos","Chaqueta de Cuero","Parka Invierno","Chaqueta Denim"],variants:ze,count:26},{categoryId:"cat-vestuario",categoryName:"Vestuario",subcategoryId:"sub-shorts",subcategoryName:"Shorts",bases:["Short Deportivo","Short Jean","Bermuda Chino"],variants:ze,count:18},{categoryId:"cat-vestuario",categoryName:"Vestuario",subcategoryId:"sub-faldas",subcategoryName:"Faldas",bases:["Falda Plisada","Falda L\xE1piz","Falda Denim"],variants:ze,count:15},{categoryId:"cat-calzado",categoryName:"Calzado",subcategoryId:"sub-running",subcategoryName:"Running",bases:["Zapatilla Running Pro","Zapatilla Running Lite","Zapatilla Trail"],variants:kt,count:20},{categoryId:"cat-calzado",categoryName:"Calzado",subcategoryId:"sub-casual",subcategoryName:"Casual",bases:["Zapatilla Urbana","Zapatilla Lona","N\xE1utico Cuero","Slip-On"],variants:kt,count:26},{categoryId:"cat-calzado",categoryName:"Calzado",subcategoryId:"sub-formal",subcategoryName:"Formal",bases:["Zapato Oxford Cuero","Zapato Derby Negro","Mocas\xEDn Caf\xE9"],variants:kt,count:18},{categoryId:"cat-calzado",categoryName:"Calzado",subcategoryId:"sub-botas",subcategoryName:"Botas",bases:["Bota Chelsea","Bota Trekking","Bota de Cuero"],variants:kt,count:15},{categoryId:"cat-accesorios",categoryName:"Accesorios",subcategoryId:"sub-cinturones",subcategoryName:"Cinturones",bases:["Cintur\xF3n Cuero Caf\xE9","Cintur\xF3n Cuero Negro","Cintur\xF3n Reversible"],variants:tr,count:9},{categoryId:"cat-accesorios",categoryName:"Accesorios",subcategoryId:"sub-bufandas-gorros",subcategoryName:"Bufandas y Gorros",bases:["Bufanda Lana","Bufanda Seda","Gorro de Lana","Gorro Trucker"],variants:ri,count:30},{categoryId:"cat-accesorios",categoryName:"Accesorios",subcategoryId:"sub-relojes-lentes",subcategoryName:"Relojes y Lentes",bases:["Reloj An\xE1logo Acero","Reloj Digital Deportivo","Lentes de Sol Aviador","Lentes de Sol Redondos"],variants:nr,count:12},{categoryId:"cat-accesorios",categoryName:"Accesorios",subcategoryId:"sub-bolsos-mochilas",subcategoryName:"Bolsos y Mochilas",bases:["Mochila Urbana","Bolso Bandolera","Cartera de Mano","Billetera Cuero"],variants:ai,count:12},{categoryId:"cat-deportivo",categoryName:"Deportivo",subcategoryId:"sub-training",subcategoryName:"Training",bases:["Poler\xF3n Training","Calza Deportiva","Top Deportivo","Chaqueta Running","Short Training"],variants:ze,count:35},{categoryId:"cat-deportivo",categoryName:"Deportivo",subcategoryId:"sub-accesorios-deportivos",subcategoryName:"Accesorios Deportivos",bases:["Banda para el Pelo","Guantes de Entrenamiento","Botella Deportiva","Mochila Gym"],variants:ai,count:12},{categoryId:"cat-ninos",categoryName:"Ni\xF1os",subcategoryId:"sub-ropa-infantil",subcategoryName:"Ropa Infantil",bases:["Polera Infantil Estampada","Pantal\xF3n Infantil","Vestido Infantil Floral","Poler\xF3n Infantil"],variants:Ko,count:24},{categoryId:"cat-ninos",categoryName:"Ni\xF1os",subcategoryId:"sub-calzado-infantil",subcategoryName:"Calzado Infantil",bases:["Zapatilla Infantil","Sandalia Infantil"],variants:er,count:10}];function or(t){let n=[],e=0;for(let i of t.variants)for(let o of t.bases){if(e>=t.count)return n;e++,n.push({id:`prod-gen-${t.subcategoryId}-${e}`,name:`${o} ${i}`,categoryId:t.categoryId,categoryName:t.categoryName,subcategoryId:t.subcategoryId,subcategoryName:t.subcategoryName})}return n}var Xt=ir.flatMap(or);var hi=(()=>{class t{_renderer;_elementRef;onChange=e=>{};onTouched=()=>{};constructor(e,i){this._renderer=e,this._elementRef=i}setProperty(e,i){this._renderer.setProperty(this._elementRef.nativeElement,e,i)}registerOnTouched(e){this.onTouched=e}registerOnChange(e){this.onChange=e}setDisabledState(e){this.setProperty("disabled",e)}static \u0275fac=function(i){return new(i||t)(pe(Bt),pe(Ot))};static \u0275dir=se({type:t})}return t})(),rr=(()=>{class t extends hi{static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275dir=se({type:t,features:[w]})}return t})(),nt=new P("");var ar={provide:nt,useExisting:Le(()=>gi),multi:!0};function sr(){let t=Rt()?Rt().getUserAgent():"";return/android (\d+)/.test(t.toLowerCase())}var lr=new P(""),gi=(()=>{class t extends hi{_compositionMode;_composing=!1;constructor(e,i,o){super(e,i),this._compositionMode=o,this._compositionMode==null&&(this._compositionMode=!sr())}writeValue(e){let i=e??"";this.setProperty("value",i)}_handleInput(e){(!this._compositionMode||this._compositionMode&&!this._composing)&&this.onChange(e)}_compositionStart(){this._composing=!0}_compositionEnd(e){this._composing=!1,this._compositionMode&&this.onChange(e)}static \u0275fac=function(i){return new(i||t)(pe(Bt),pe(Ot),pe(lr,8))};static \u0275dir=se({type:t,selectors:[["input","formControlName","",3,"type","checkbox"],["textarea","formControlName",""],["input","formControl","",3,"type","checkbox"],["textarea","formControl",""],["input","ngModel","",3,"type","checkbox"],["textarea","ngModel",""],["","ngDefaultControl",""]],hostBindings:function(i,o){i&1&&x("input",function(a){return o._handleInput(a.target.value)})("blur",function(){return o.onTouched()})("compositionstart",function(){return o._compositionStart()})("compositionend",function(a){return o._compositionEnd(a.target.value)})},standalone:!1,features:[j([ar]),w]})}return t})();var cr=new P(""),dr=new P("");function fi(t){return t!=null}function _i(t){return Cn(t)?hn(t):t}function bi(t){let n={};return t.forEach(e=>{n=e!=null?A(A({},n),e):n}),Object.keys(n).length===0?null:n}function yi(t,n){return n.map(e=>e(t))}function ur(t){return!t.validate}function vi(t){return t.map(n=>ur(n)?n:e=>n.validate(e))}function pr(t){if(!t)return null;let n=t.filter(fi);return n.length==0?null:function(e){return bi(yi(e,n))}}function Ci(t){return t!=null?pr(vi(t)):null}function mr(t){if(!t)return null;let n=t.filter(fi);return n.length==0?null:function(e){let i=yi(e,n).map(_i);return fn(i).pipe(gn(bi))}}function xi(t){return t!=null?mr(vi(t)):null}function si(t,n){return t===null?[n]:Array.isArray(t)?[...t,n]:[t,n]}function hr(t){return t._rawValidators}function gr(t){return t._rawAsyncValidators}function Jt(t){return t?Array.isArray(t)?t:[t]:[]}function It(t,n){return Array.isArray(t)?t.includes(n):t===n}function li(t,n){let e=Jt(n);return Jt(t).forEach(o=>{It(e,o)||e.push(o)}),e}function ci(t,n){return Jt(n).filter(e=>!It(t,e))}var Tt=class{get value(){return this.control?this.control.value:null}get valid(){return this.control?this.control.valid:null}get invalid(){return this.control?this.control.invalid:null}get pending(){return this.control?this.control.pending:null}get disabled(){return this.control?this.control.disabled:null}get enabled(){return this.control?this.control.enabled:null}get errors(){return this.control?this.control.errors:null}get pristine(){return this.control?this.control.pristine:null}get dirty(){return this.control?this.control.dirty:null}get touched(){return this.control?this.control.touched:null}get status(){return this.control?this.control.status:null}get untouched(){return this.control?this.control.untouched:null}get statusChanges(){return this.control?this.control.statusChanges:null}get valueChanges(){return this.control?this.control.valueChanges:null}get path(){return null}_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators=[];_rawAsyncValidators=[];_setValidators(n){this._rawValidators=n||[],this._composedValidatorFn=Ci(this._rawValidators)}_setAsyncValidators(n){this._rawAsyncValidators=n||[],this._composedAsyncValidatorFn=xi(this._rawAsyncValidators)}get validator(){return this._composedValidatorFn||null}get asyncValidator(){return this._composedAsyncValidatorFn||null}_onDestroyCallbacks=[];_registerOnDestroy(n){this._onDestroyCallbacks.push(n)}_invokeOnDestroyCallbacks(){this._onDestroyCallbacks.forEach(n=>n()),this._onDestroyCallbacks=[]}reset(n=void 0){this.control?.reset(n)}hasError(n,e){return this.control?this.control.hasError(n,e):!1}getError(n,e){return this.control?this.control.getError(n,e):null}},Kt=class extends Tt{name;get formDirective(){return null}get path(){return null}},Ve=class extends Tt{_parent=null;name=null;valueAccessor=null},en=class{_cd;constructor(n){this._cd=n}get isTouched(){return this._cd?.control?._touched?.(),!!this._cd?.control?.touched}get isUntouched(){return!!this._cd?.control?.untouched}get isPristine(){return this._cd?.control?._pristine?.(),!!this._cd?.control?.pristine}get isDirty(){return!!this._cd?.control?.dirty}get isValid(){return this._cd?.control?._status?.(),!!this._cd?.control?.valid}get isInvalid(){return!!this._cd?.control?.invalid}get isPending(){return!!this._cd?.control?.pending}get isSubmitted(){return this._cd?._submitted?.(),!!this._cd?.submitted}};var wi=(()=>{class t extends en{constructor(e){super(e)}static \u0275fac=function(i){return new(i||t)(pe(Ve,2))};static \u0275dir=se({type:t,selectors:[["","formControlName",""],["","ngModel",""],["","formControl",""]],hostVars:14,hostBindings:function(i,o){i&2&&be("ng-untouched",o.isUntouched)("ng-touched",o.isTouched)("ng-pristine",o.isPristine)("ng-dirty",o.isDirty)("ng-valid",o.isValid)("ng-invalid",o.isInvalid)("ng-pending",o.isPending)},standalone:!1,features:[w]})}return t})();var pt="VALID",Dt="INVALID",et="PENDING",mt="DISABLED",Ge=class{},Et=class extends Ge{value;source;constructor(n,e){super(),this.value=n,this.source=e}},ht=class extends Ge{pristine;source;constructor(n,e){super(),this.pristine=n,this.source=e}},gt=class extends Ge{touched;source;constructor(n,e){super(),this.touched=n,this.source=e}},tt=class extends Ge{status;source;constructor(n,e){super(),this.status=n,this.source=e}};var tn=class extends Ge{source;constructor(n){super(),this.source=n}};function fr(t){return(St(t)?t.validators:t)||null}function _r(t){return Array.isArray(t)?Ci(t):t||null}function br(t,n){return(St(n)?n.asyncValidators:t)||null}function yr(t){return Array.isArray(t)?xi(t):t||null}function St(t){return t!=null&&!Array.isArray(t)&&typeof t=="object"}var nn=class{_pendingDirty=!1;_hasOwnPendingAsyncValidator=null;_pendingTouched=!1;_onCollectionChange=()=>{};_updateOn;_parent=null;_asyncValidationSubscription;_composedValidatorFn;_composedAsyncValidatorFn;_rawValidators;_rawAsyncValidators;value;constructor(n,e){this._assignValidators(n),this._assignAsyncValidators(e)}get validator(){return this._composedValidatorFn}set validator(n){this._rawValidators=this._composedValidatorFn=n}get asyncValidator(){return this._composedAsyncValidatorFn}set asyncValidator(n){this._rawAsyncValidators=this._composedAsyncValidatorFn=n}get parent(){return this._parent}get status(){return Me(this.statusReactive)}set status(n){Me(()=>this.statusReactive.set(n))}_status=D(()=>this.statusReactive());statusReactive=F(void 0);get valid(){return this.status===pt}get invalid(){return this.status===Dt}get pending(){return this.status===et}get disabled(){return this.status===mt}get enabled(){return this.status!==mt}errors;get pristine(){return Me(this.pristineReactive)}set pristine(n){Me(()=>this.pristineReactive.set(n))}_pristine=D(()=>this.pristineReactive());pristineReactive=F(!0);get dirty(){return!this.pristine}get touched(){return Me(this.touchedReactive)}set touched(n){Me(()=>this.touchedReactive.set(n))}_touched=D(()=>this.touchedReactive());touchedReactive=F(!1);get untouched(){return!this.touched}_events=new pn;events=this._events.asObservable();valueChanges;statusChanges;get updateOn(){return this._updateOn?this._updateOn:this.parent?this.parent.updateOn:"change"}setValidators(n){this._assignValidators(n)}setAsyncValidators(n){this._assignAsyncValidators(n)}addValidators(n){this.setValidators(li(n,this._rawValidators))}addAsyncValidators(n){this.setAsyncValidators(li(n,this._rawAsyncValidators))}removeValidators(n){this.setValidators(ci(n,this._rawValidators))}removeAsyncValidators(n){this.setAsyncValidators(ci(n,this._rawAsyncValidators))}hasValidator(n){return It(this._rawValidators,n)}hasAsyncValidator(n){return It(this._rawAsyncValidators,n)}clearValidators(){this.validator=null}clearAsyncValidators(){this.asyncValidator=null}markAsTouched(n={}){let e=this.touched===!1;this.touched=!0;let i=n.sourceControl??this;n.onlySelf||this._parent?.markAsTouched(ue(A({},n),{sourceControl:i})),e&&n.emitEvent!==!1&&this._events.next(new gt(!0,i))}markAllAsDirty(n={}){this.markAsDirty({onlySelf:!0,emitEvent:n.emitEvent,sourceControl:this}),this._forEachChild(e=>e.markAllAsDirty(n))}markAllAsTouched(n={}){this.markAsTouched({onlySelf:!0,emitEvent:n.emitEvent,sourceControl:this}),this._forEachChild(e=>e.markAllAsTouched(n))}markAsUntouched(n={}){let e=this.touched===!0;this.touched=!1,this._pendingTouched=!1;let i=n.sourceControl??this;this._forEachChild(o=>{o.markAsUntouched({onlySelf:!0,emitEvent:n.emitEvent,sourceControl:i})}),n.onlySelf||this._parent?._updateTouched(n,i),e&&n.emitEvent!==!1&&this._events.next(new gt(!1,i))}markAsDirty(n={}){let e=this.pristine===!0;this.pristine=!1;let i=n.sourceControl??this;n.onlySelf||this._parent?.markAsDirty(ue(A({},n),{sourceControl:i})),e&&n.emitEvent!==!1&&this._events.next(new ht(!1,i))}markAsPristine(n={}){let e=this.pristine===!1;this.pristine=!0,this._pendingDirty=!1;let i=n.sourceControl??this;this._forEachChild(o=>{o.markAsPristine({onlySelf:!0,emitEvent:n.emitEvent})}),n.onlySelf||this._parent?._updatePristine(n,i),e&&n.emitEvent!==!1&&this._events.next(new ht(!0,i))}markAsPending(n={}){this.status=et;let e=n.sourceControl??this;n.emitEvent!==!1&&(this._events.next(new tt(this.status,e)),this.statusChanges.emit(this.status)),n.onlySelf||this._parent?.markAsPending(ue(A({},n),{sourceControl:e}))}disable(n={}){let e=this._parentMarkedDirty(n.onlySelf);this.status=mt,this.errors=null,this._forEachChild(o=>{o.disable(ue(A({},n),{onlySelf:!0}))}),this._updateValue();let i=n.sourceControl??this;n.emitEvent!==!1&&(this._events.next(new Et(this.value,i)),this._events.next(new tt(this.status,i)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),this._updateAncestors(ue(A({},n),{skipPristineCheck:e}),this),this._onDisabledChange.forEach(o=>o(!0))}enable(n={}){let e=this._parentMarkedDirty(n.onlySelf);this.status=pt,this._forEachChild(i=>{i.enable(ue(A({},n),{onlySelf:!0}))}),this.updateValueAndValidity({onlySelf:!0,emitEvent:n.emitEvent}),this._updateAncestors(ue(A({},n),{skipPristineCheck:e}),this),this._onDisabledChange.forEach(i=>i(!1))}_updateAncestors(n,e){n.onlySelf||(this._parent?.updateValueAndValidity(n),n.skipPristineCheck||this._parent?._updatePristine({},e),this._parent?._updateTouched({},e))}setParent(n){this._parent=n}getRawValue(){return this.value}updateValueAndValidity(n={}){if(this._setInitialStatus(),this._updateValue(),this.enabled){let i=this._cancelExistingSubscription();this.errors=this._runValidator(),this.status=this._calculateStatus(),(this.status===pt||this.status===et)&&this._runAsyncValidator(i,n.emitEvent)}let e=n.sourceControl??this;n.emitEvent!==!1&&(this._events.next(new Et(this.value,e)),this._events.next(new tt(this.status,e)),this.valueChanges.emit(this.value),this.statusChanges.emit(this.status)),n.onlySelf||this._parent?.updateValueAndValidity(ue(A({},n),{sourceControl:e}))}_updateTreeValidity(n={emitEvent:!0}){this._forEachChild(e=>e._updateTreeValidity(n)),this.updateValueAndValidity({onlySelf:!0,emitEvent:n.emitEvent})}_setInitialStatus(){this.status=this._allControlsDisabled()?mt:pt}_runValidator(){return this.validator?this.validator(this):null}_runAsyncValidator(n,e){if(this.asyncValidator){this.status=et,this._hasOwnPendingAsyncValidator={emitEvent:e!==!1,shouldHaveEmitted:n!==!1};let i=_i(this.asyncValidator(this));this._asyncValidationSubscription=i.subscribe(o=>{this._hasOwnPendingAsyncValidator=null,this.setErrors(o,{emitEvent:e,shouldHaveEmitted:n})})}}_cancelExistingSubscription(){if(this._asyncValidationSubscription){this._asyncValidationSubscription.unsubscribe();let n=(this._hasOwnPendingAsyncValidator?.emitEvent||this._hasOwnPendingAsyncValidator?.shouldHaveEmitted)??!1;return this._hasOwnPendingAsyncValidator=null,n}return!1}setErrors(n,e={}){this.errors=n,this._updateControlsErrors(e.emitEvent!==!1,this,e.shouldHaveEmitted)}get(n){let e=n;return e==null||(Array.isArray(e)||(e=e.split(".")),e.length===0)?null:e.reduce((i,o)=>i&&i._find(o),this)}getError(n,e){let i=e?this.get(e):this;return i?.errors?i.errors[n]:null}hasError(n,e){return!!this.getError(n,e)}get root(){let n=this;for(;n._parent;)n=n._parent;return n}_updateControlsErrors(n,e,i){this.status=this._calculateStatus(),n&&this.statusChanges.emit(this.status),(n||i)&&this._events.next(new tt(this.status,e)),this._parent&&this._parent._updateControlsErrors(n,e,i)}_initObservables(){this.valueChanges=new N,this.statusChanges=new N}_calculateStatus(){return this._allControlsDisabled()?mt:this.errors?Dt:this._hasOwnPendingAsyncValidator||this._anyControlsHaveStatus(et)?et:this._anyControlsHaveStatus(Dt)?Dt:pt}_anyControlsHaveStatus(n){return this._anyControls(e=>e.status===n)}_anyControlsDirty(){return this._anyControls(n=>n.dirty)}_anyControlsTouched(){return this._anyControls(n=>n.touched)}_updatePristine(n,e){let i=!this._anyControlsDirty(),o=this.pristine!==i;this.pristine=i,n.onlySelf||this._parent?._updatePristine(n,e),o&&this._events.next(new ht(this.pristine,e))}_updateTouched(n={},e){this.touched=this._anyControlsTouched(),this._events.next(new gt(this.touched,e)),n.onlySelf||this._parent?._updateTouched(n,e)}_onDisabledChange=[];_registerOnCollectionChange(n){this._onCollectionChange=n}_setUpdateStrategy(n){St(n)&&n.updateOn!=null&&(this._updateOn=n.updateOn)}_parentMarkedDirty(n){return!n&&!!this._parent?.dirty&&!this._parent._anyControlsDirty()}_find(n){return null}_assignValidators(n){this._rawValidators=Array.isArray(n)?n.slice():n,this._composedValidatorFn=_r(this._rawValidators)}_assignAsyncValidators(n){this._rawAsyncValidators=Array.isArray(n)?n.slice():n,this._composedAsyncValidatorFn=yr(this._rawAsyncValidators)}};var Mi=new P("",{factory:()=>on}),on="always";function vr(t,n){return[...n.path,t]}function Cr(t,n,e=on){wr(t,n),n.valueAccessor.writeValue(t.value),(t.disabled||e==="always")&&n.valueAccessor.setDisabledState?.(t.disabled),Mr(t,n),Dr(t,n),kr(t,n),xr(t,n)}function di(t,n){t.forEach(e=>{e.registerOnValidatorChange&&e.registerOnValidatorChange(n)})}function xr(t,n){if(n.valueAccessor.setDisabledState){let e=i=>{n.valueAccessor.setDisabledState(i)};t.registerOnDisabledChange(e),n._registerOnDestroy(()=>{t._unregisterOnDisabledChange(e)})}}function wr(t,n){let e=hr(t);n.validator!==null?t.setValidators(si(e,n.validator)):typeof e=="function"&&t.setValidators([e]);let i=gr(t);n.asyncValidator!==null?t.setAsyncValidators(si(i,n.asyncValidator)):typeof i=="function"&&t.setAsyncValidators([i]);let o=()=>t.updateValueAndValidity();di(n._rawValidators,o),di(n._rawAsyncValidators,o)}function Mr(t,n){n.valueAccessor.registerOnChange(e=>{t._pendingValue=e,t._pendingChange=!0,t._pendingDirty=!0,t.updateOn==="change"&&ki(t,n)})}function kr(t,n){n.valueAccessor.registerOnTouched(()=>{t._pendingTouched=!0,t.updateOn==="blur"&&t._pendingChange&&ki(t,n),t.updateOn!=="submit"&&t.markAsTouched()})}function ki(t,n){t._pendingDirty&&t.markAsDirty(),t.setValue(t._pendingValue,{emitModelToViewChange:!1}),n.viewToModelUpdate(t._pendingValue),t._pendingChange=!1}function Dr(t,n){let e=(i,o)=>{n.valueAccessor.writeValue(i),o&&n.viewToModelUpdate(i)};t.registerOnChange(e),n._registerOnDestroy(()=>{t._unregisterOnChange(e)})}function Ir(t,n){if(!t.hasOwnProperty("model"))return!1;let e=t.model;return e.isFirstChange()?!0:!Object.is(n,e.currentValue)}function Tr(t){return Object.getPrototypeOf(t.constructor)===rr}function Er(t,n){if(!n)return null;Array.isArray(n);let e,i,o;return n.forEach(r=>{r.constructor===gi?e=r:Tr(r)?i=r:o=r}),o||i||e||null}function ui(t,n){let e=t.indexOf(n);e>-1&&t.splice(e,1)}function pi(t){return typeof t=="object"&&t!==null&&Object.keys(t).length===2&&"value"in t&&"disabled"in t}var Sr=class extends nn{defaultValue=null;_onChange=[];_pendingValue;_pendingChange=!1;constructor(n=null,e,i){super(fr(e),br(i,e)),this._applyFormState(n),this._setUpdateStrategy(e),this._initObservables(),this.updateValueAndValidity({onlySelf:!0,emitEvent:!!this.asyncValidator}),St(e)&&(e.nonNullable||e.initialValueIsDefault)&&(pi(n)?this.defaultValue=n.value:this.defaultValue=n)}setValue(n,e={}){this.value=this._pendingValue=n,this._onChange.length&&e.emitModelToViewChange!==!1&&this._onChange.forEach(i=>i(this.value,e.emitViewToModelChange!==!1)),this.updateValueAndValidity(e)}patchValue(n,e={}){this.setValue(n,e)}reset(n=this.defaultValue,e={}){this._applyFormState(n),this.markAsPristine(e),this.markAsUntouched(e),this.setValue(this.value,e),e.overwriteDefaultValue&&(this.defaultValue=this.value),this._pendingChange=!1,e?.emitEvent!==!1&&this._events.next(new tn(this))}_updateValue(){}_anyControls(n){return!1}_allControlsDisabled(){return this.disabled}registerOnChange(n){this._onChange.push(n)}_unregisterOnChange(n){ui(this._onChange,n)}registerOnDisabledChange(n){this._onDisabledChange.push(n)}_unregisterOnDisabledChange(n){ui(this._onDisabledChange,n)}_forEachChild(n){}_syncPendingControls(){return this.updateOn==="submit"&&(this._pendingDirty&&this.markAsDirty(),this._pendingTouched&&this.markAsTouched(),this._pendingChange)?(this.setValue(this._pendingValue,{onlySelf:!0,emitModelToViewChange:!1}),!0):!1}_applyFormState(n){pi(n)?(this.value=this._pendingValue=n.value,n.disabled?this.disable({onlySelf:!0,emitEvent:!1}):this.enable({onlySelf:!0,emitEvent:!1})):this.value=this._pendingValue=n}};var Vr={provide:Ve,useExisting:Le(()=>rn)},mi=Promise.resolve(),rn=(()=>{class t extends Ve{_changeDetectorRef;callSetDisabledState;control=new Sr;static ngAcceptInputType_isDisabled;_registered=!1;viewModel;name="";isDisabled;model;options;update=new N;constructor(e,i,o,r,a,E){super(),this._changeDetectorRef=a,this.callSetDisabledState=E,this._parent=e,this._setValidators(i),this._setAsyncValidators(o),this.valueAccessor=Er(this,r)}ngOnChanges(e){if(this._checkForErrors(),!this._registered||"name"in e){if(this._registered&&(this._checkName(),this.formDirective)){let i=e.name.previousValue;this.formDirective.removeControl({name:i,path:this._getPath(i)})}this._setUpControl()}"isDisabled"in e&&this._updateDisabled(e),Ir(e,this.viewModel)&&(this._updateValue(this.model),this.viewModel=this.model)}ngOnDestroy(){this.formDirective?.removeControl(this)}get path(){return this._getPath(this.name)}get formDirective(){return this._parent?this._parent.formDirective:null}viewToModelUpdate(e){this.viewModel=e,this.update.emit(e)}_setUpControl(){this._setUpdateStrategy(),this._isStandalone()?this._setUpStandalone():this.formDirective.addControl(this),this._registered=!0}_setUpdateStrategy(){this.options&&this.options.updateOn!=null&&(this.control._updateOn=this.options.updateOn)}_isStandalone(){return!this._parent||!!(this.options&&this.options.standalone)}_setUpStandalone(){Cr(this.control,this,this.callSetDisabledState),this.control.updateValueAndValidity({emitEvent:!1})}_checkForErrors(){this._checkName()}_checkName(){this.options&&this.options.name&&(this.name=this.options.name),!this._isStandalone()&&this.name}_updateValue(e){mi.then(()=>{this.control.setValue(e,{emitViewToModelChange:!1}),this._changeDetectorRef?.markForCheck()})}_updateDisabled(e){let i=e.isDisabled.currentValue,o=i!==0&&C(i);mi.then(()=>{o&&!this.control.disabled?this.control.disable():!o&&this.control.disabled&&this.control.enable(),this._changeDetectorRef?.markForCheck()})}_getPath(e){return this._parent?vr(e,this._parent):[e]}static \u0275fac=function(i){return new(i||t)(pe(Kt,9),pe(cr,10),pe(dr,10),pe(nt,10),pe(Dn,8),pe(Mi,8))};static \u0275dir=se({type:t,selectors:[["","ngModel","",3,"formControlName","",3,"formControl",""]],inputs:{name:"name",isDisabled:[0,"disabled","isDisabled"],model:[0,"ngModel","model"],options:[0,"ngModelOptions","options"]},outputs:{update:"ngModelChange"},exportAs:["ngModel"],standalone:!1,features:[j([Vr]),w,_n]})}return t})();var Ar=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=ae({type:t});static \u0275inj=re({})}return t})();var Vt=(()=>{class t{static withConfig(e){return{ngModule:t,providers:[{provide:Mi,useValue:e.callSetDisabledState??on}]}}static \u0275fac=function(i){return new(i||t)};static \u0275mod=ae({type:t});static \u0275inj=re({imports:[Ar]})}return t})();var Di=`
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
`;var Nr={root:{position:"relative"}},Fr={root:({instance:t})=>["p-skeleton p-component",{"p-skeleton-circle":t.shape==="circle","p-skeleton-animation-none":t.animation==="none"}]},Ii=(()=>{class t extends U{name="skeleton";style=Di;classes=Fr;inlineStyles=Nr;static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275prov=L({token:t,factory:t.\u0275fac})}return t})();var Ti=new P("SKELETON_INSTANCE"),Ei=(()=>{class t extends J{componentName="Skeleton";$pcSkeleton=p(Ti,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=p(g,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}styleClass;shape="rectangle";animation="wave";borderRadius;size;width="100%";height="1rem";_componentStyle=p(Ii);get containerStyle(){let e=this._componentStyle?.inlineStyles.root,i;return this.$unstyled()||(this.size?i=ue(A({},e),{width:this.size,height:this.size,borderRadius:this.borderRadius}):i=ue(A({},e),{width:this.width,height:this.height,borderRadius:this.borderRadius})),i}get dataP(){return this.cn({[this.shape]:this.shape})}static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275cmp=k({type:t,selectors:[["p-skeleton"]],hostVars:6,hostBindings:function(i,o){i&2&&(v("aria-hidden",!0)("data-p",o.dataP),me(o.containerStyle),m(o.cn(o.cx("root"),o.styleClass)))},inputs:{styleClass:"styleClass",shape:"shape",animation:"animation",borderRadius:"borderRadius",size:"size",width:"width",height:"height"},features:[j([Ii,{provide:Ti,useExisting:t},{provide:q,useExisting:t}]),$([g]),w],decls:0,vars:0,template:function(i,o){},dependencies:[W,X],encapsulation:2,changeDetection:0})}return t})();var Si=class t{width=_("100%");height=_("1.5rem");shape=_("rectangle");static \u0275fac=function(e){return new(e||t)};static \u0275cmp=k({type:t,selectors:[["app-loading-skeleton"]],inputs:{width:[1,"width"],height:[1,"height"],shape:[1,"shape"]},decls:1,vars:3,consts:[[3,"width","height","shape"]],template:function(e,i){e&1&&z(0,"p-skeleton",0),e&2&&s("width",i.width())("height",i.height())("shape",i.shape())},dependencies:[Ei],styles:["[_nghost-%COMP%]{display:block}"],changeDetection:0})};var Or=["data-p-icon","chevron-down"],td=(()=>{class t extends Ne{static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275cmp=k({type:t,selectors:[["","data-p-icon","chevron-down"]],features:[w],attrs:Or,decls:1,vars:0,consts:[["d","M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z","fill","currentColor"]],template:function(i,o){i&1&&(V(),ne(0,"path",0))},encapsulation:2})}return t})();var Br=["data-p-icon","minus"],Vi=(()=>{class t extends Ne{static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275cmp=k({type:t,selectors:[["","data-p-icon","minus"]],features:[w],attrs:Br,decls:1,vars:0,consts:[["d","M13.2222 7.77778H0.777778C0.571498 7.77778 0.373667 7.69584 0.227806 7.54998C0.0819442 7.40412 0 7.20629 0 7.00001C0 6.79373 0.0819442 6.5959 0.227806 6.45003C0.373667 6.30417 0.571498 6.22223 0.777778 6.22223H13.2222C13.4285 6.22223 13.6263 6.30417 13.7722 6.45003C13.9181 6.5959 14 6.79373 14 7.00001C14 7.20629 13.9181 7.40412 13.7722 7.54998C13.6263 7.69584 13.4285 7.77778 13.2222 7.77778Z","fill","currentColor"]],template:function(i,o){i&1&&(V(),ne(0,"path",0))},encapsulation:2})}return t})();var zr=["data-p-icon","window-maximize"],Ai=(()=>{class t extends Ne{pathId;onInit(){this.pathId="url(#"+He()+")"}static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275cmp=k({type:t,selectors:[["","data-p-icon","window-maximize"]],features:[w],attrs:zr,decls:5,vars:2,consts:[["fill-rule","evenodd","clip-rule","evenodd","d","M7 14H11.8C12.3835 14 12.9431 13.7682 13.3556 13.3556C13.7682 12.9431 14 12.3835 14 11.8V2.2C14 1.61652 13.7682 1.05694 13.3556 0.644365C12.9431 0.231785 12.3835 0 11.8 0H2.2C1.61652 0 1.05694 0.231785 0.644365 0.644365C0.231785 1.05694 0 1.61652 0 2.2V7C0 7.15913 0.063214 7.31174 0.175736 7.42426C0.288258 7.53679 0.44087 7.6 0.6 7.6C0.75913 7.6 0.911742 7.53679 1.02426 7.42426C1.13679 7.31174 1.2 7.15913 1.2 7V2.2C1.2 1.93478 1.30536 1.68043 1.49289 1.49289C1.68043 1.30536 1.93478 1.2 2.2 1.2H11.8C12.0652 1.2 12.3196 1.30536 12.5071 1.49289C12.6946 1.68043 12.8 1.93478 12.8 2.2V11.8C12.8 12.0652 12.6946 12.3196 12.5071 12.5071C12.3196 12.6946 12.0652 12.8 11.8 12.8H7C6.84087 12.8 6.68826 12.8632 6.57574 12.9757C6.46321 13.0883 6.4 13.2409 6.4 13.4C6.4 13.5591 6.46321 13.7117 6.57574 13.8243C6.68826 13.9368 6.84087 14 7 14ZM9.77805 7.42192C9.89013 7.534 10.0415 7.59788 10.2 7.59995C10.3585 7.59788 10.5099 7.534 10.622 7.42192C10.7341 7.30985 10.798 7.15844 10.8 6.99995V3.94242C10.8066 3.90505 10.8096 3.86689 10.8089 3.82843C10.8079 3.77159 10.7988 3.7157 10.7824 3.6623C10.756 3.55552 10.701 3.45698 10.622 3.37798C10.5099 3.2659 10.3585 3.20202 10.2 3.19995H7.00002C6.84089 3.19995 6.68828 3.26317 6.57576 3.37569C6.46324 3.48821 6.40002 3.64082 6.40002 3.79995C6.40002 3.95908 6.46324 4.11169 6.57576 4.22422C6.68828 4.33674 6.84089 4.39995 7.00002 4.39995H8.80006L6.19997 7.00005C6.10158 7.11005 6.04718 7.25246 6.04718 7.40005C6.04718 7.54763 6.10158 7.69004 6.19997 7.80005C6.30202 7.91645 6.44561 7.98824 6.59997 8.00005C6.75432 7.98824 6.89791 7.91645 6.99997 7.80005L9.60002 5.26841V6.99995C9.6021 7.15844 9.66598 7.30985 9.77805 7.42192ZM1.4 14H3.8C4.17066 13.9979 4.52553 13.8498 4.78763 13.5877C5.04973 13.3256 5.1979 12.9707 5.2 12.6V10.2C5.1979 9.82939 5.04973 9.47452 4.78763 9.21242C4.52553 8.95032 4.17066 8.80215 3.8 8.80005H1.4C1.02934 8.80215 0.674468 8.95032 0.412371 9.21242C0.150274 9.47452 0.00210008 9.82939 0 10.2V12.6C0.00210008 12.9707 0.150274 13.3256 0.412371 13.5877C0.674468 13.8498 1.02934 13.9979 1.4 14ZM1.25858 10.0586C1.29609 10.0211 1.34696 10 1.4 10H3.8C3.85304 10 3.90391 10.0211 3.94142 10.0586C3.97893 10.0961 4 10.147 4 10.2V12.6C4 12.6531 3.97893 12.704 3.94142 12.7415C3.90391 12.779 3.85304 12.8 3.8 12.8H1.4C1.34696 12.8 1.29609 12.779 1.25858 12.7415C1.22107 12.704 1.2 12.6531 1.2 12.6V10.2C1.2 10.147 1.22107 10.0961 1.25858 10.0586Z","fill","currentColor"],[3,"id"],["width","14","height","14","fill","white"]],template:function(i,o){i&1&&(V(),R(0,"g"),ne(1,"path",0),G(),R(2,"defs")(3,"clipPath",1),ne(4,"rect",2),G()()),i&2&&(v("clip-path",o.pathId),c(3),xe("id",o.pathId))},encapsulation:2})}return t})();var Rr=["data-p-icon","window-minimize"],Pi=(()=>{class t extends Ne{pathId;onInit(){this.pathId="url(#"+He()+")"}static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275cmp=k({type:t,selectors:[["","data-p-icon","window-minimize"]],features:[w],attrs:Rr,decls:5,vars:2,consts:[["fill-rule","evenodd","clip-rule","evenodd","d","M11.8 0H2.2C1.61652 0 1.05694 0.231785 0.644365 0.644365C0.231785 1.05694 0 1.61652 0 2.2V7C0 7.15913 0.063214 7.31174 0.175736 7.42426C0.288258 7.53679 0.44087 7.6 0.6 7.6C0.75913 7.6 0.911742 7.53679 1.02426 7.42426C1.13679 7.31174 1.2 7.15913 1.2 7V2.2C1.2 1.93478 1.30536 1.68043 1.49289 1.49289C1.68043 1.30536 1.93478 1.2 2.2 1.2H11.8C12.0652 1.2 12.3196 1.30536 12.5071 1.49289C12.6946 1.68043 12.8 1.93478 12.8 2.2V11.8C12.8 12.0652 12.6946 12.3196 12.5071 12.5071C12.3196 12.6946 12.0652 12.8 11.8 12.8H7C6.84087 12.8 6.68826 12.8632 6.57574 12.9757C6.46321 13.0883 6.4 13.2409 6.4 13.4C6.4 13.5591 6.46321 13.7117 6.57574 13.8243C6.68826 13.9368 6.84087 14 7 14H11.8C12.3835 14 12.9431 13.7682 13.3556 13.3556C13.7682 12.9431 14 12.3835 14 11.8V2.2C14 1.61652 13.7682 1.05694 13.3556 0.644365C12.9431 0.231785 12.3835 0 11.8 0ZM6.368 7.952C6.44137 7.98326 6.52025 7.99958 6.6 8H9.8C9.95913 8 10.1117 7.93678 10.2243 7.82426C10.3368 7.71174 10.4 7.55913 10.4 7.4C10.4 7.24087 10.3368 7.08826 10.2243 6.97574C10.1117 6.86321 9.95913 6.8 9.8 6.8H8.048L10.624 4.224C10.73 4.11026 10.7877 3.95982 10.7849 3.80438C10.7822 3.64894 10.7192 3.50063 10.6093 3.3907C10.4994 3.28077 10.3511 3.2178 10.1956 3.21506C10.0402 3.21232 9.88974 3.27002 9.776 3.376L7.2 5.952V4.2C7.2 4.04087 7.13679 3.88826 7.02426 3.77574C6.91174 3.66321 6.75913 3.6 6.6 3.6C6.44087 3.6 6.28826 3.66321 6.17574 3.77574C6.06321 3.88826 6 4.04087 6 4.2V7.4C6.00042 7.47975 6.01674 7.55862 6.048 7.632C6.07656 7.70442 6.11971 7.7702 6.17475 7.82524C6.2298 7.88029 6.29558 7.92344 6.368 7.952ZM1.4 8.80005H3.8C4.17066 8.80215 4.52553 8.95032 4.78763 9.21242C5.04973 9.47452 5.1979 9.82939 5.2 10.2V12.6C5.1979 12.9707 5.04973 13.3256 4.78763 13.5877C4.52553 13.8498 4.17066 13.9979 3.8 14H1.4C1.02934 13.9979 0.674468 13.8498 0.412371 13.5877C0.150274 13.3256 0.00210008 12.9707 0 12.6V10.2C0.00210008 9.82939 0.150274 9.47452 0.412371 9.21242C0.674468 8.95032 1.02934 8.80215 1.4 8.80005ZM3.94142 12.7415C3.97893 12.704 4 12.6531 4 12.6V10.2C4 10.147 3.97893 10.0961 3.94142 10.0586C3.90391 10.0211 3.85304 10 3.8 10H1.4C1.34696 10 1.29609 10.0211 1.25858 10.0586C1.22107 10.0961 1.2 10.147 1.2 10.2V12.6C1.2 12.6531 1.22107 12.704 1.25858 12.7415C1.29609 12.779 1.34696 12.8 1.4 12.8H3.8C3.85304 12.8 3.90391 12.779 3.94142 12.7415Z","fill","currentColor"],[3,"id"],["width","14","height","14","fill","white"]],template:function(i,o){i&1&&(V(),R(0,"g"),ne(1,"path",0),G(),R(2,"defs")(3,"clipPath",1),ne(4,"rect",2),G()()),i&2&&(v("clip-path",o.pathId),c(3),xe("id",o.pathId))},encapsulation:2})}return t})();var Ni=`
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
`;var Lr=["removeicon"],jr=["*"];function Hr(t,n){if(t&1){let e=S();d(0,"img",4),x("error",function(o){b(e);let r=l();return y(r.imageError(o))}),u()}if(t&2){let e=l();m(e.cx("image")),s("pBind",e.ptm("image"))("src",e.image,yn)("alt",e.alt)}}function Gr(t,n){if(t&1&&z(0,"span",6),t&2){let e=l(2);m(e.icon),s("pBind",e.ptm("icon"))("ngClass",e.cx("icon"))}}function $r(t,n){if(t&1&&h(0,Gr,1,4,"span",5),t&2){let e=l();s("ngIf",e.icon)}}function Ur(t,n){if(t&1&&(d(0,"div",7),Y(1),u()),t&2){let e=l();m(e.cx("label")),s("pBind",e.ptm("label")),c(),he(e.label)}}function qr(t,n){if(t&1){let e=S();d(0,"span",11),x("click",function(o){b(e);let r=l(3);return y(r.close(o))})("keydown",function(o){b(e);let r=l(3);return y(r.onKeydown(o))}),u()}if(t&2){let e=l(3);m(e.removeIcon),s("pBind",e.ptm("removeIcon"))("ngClass",e.cx("removeIcon")),v("tabindex",e.disabled?-1:0)("aria-label",e.removeAriaLabel)}}function Yr(t,n){if(t&1){let e=S();V(),d(0,"svg",12),x("click",function(o){b(e);let r=l(3);return y(r.close(o))})("keydown",function(o){b(e);let r=l(3);return y(r.onKeydown(o))}),u()}if(t&2){let e=l(3);m(e.cx("removeIcon")),s("pBind",e.ptm("removeIcon")),v("tabindex",e.disabled?-1:0)("aria-label",e.removeAriaLabel)}}function Wr(t,n){if(t&1&&(fe(0),h(1,qr,1,6,"span",9)(2,Yr,1,5,"svg",10),_e()),t&2){let e=l(2);c(),s("ngIf",e.removeIcon),c(),s("ngIf",!e.removeIcon)}}function Zr(t,n){}function Qr(t,n){t&1&&h(0,Zr,0,0,"ng-template")}function Xr(t,n){if(t&1){let e=S();d(0,"span",13),x("click",function(o){b(e);let r=l(2);return y(r.close(o))})("keydown",function(o){b(e);let r=l(2);return y(r.onKeydown(o))}),h(1,Qr,1,0,null,14),u()}if(t&2){let e=l(2);m(e.cx("removeIcon")),s("pBind",e.ptm("removeIcon")),v("tabindex",e.disabled?-1:0)("aria-label",e.removeAriaLabel),c(),s("ngTemplateOutlet",e.removeIconTemplate||e._removeIconTemplate)}}function Jr(t,n){if(t&1&&(fe(0),h(1,Wr,3,2,"ng-container",3)(2,Xr,2,6,"span",8),_e()),t&2){let e=l();c(),s("ngIf",!e.removeIconTemplate&&!e._removeIconTemplate),c(),s("ngIf",e.removeIconTemplate||e._removeIconTemplate)}}var Kr={root:({instance:t})=>({display:!t.visible&&"none"})},ea={root:({instance:t})=>["p-chip p-component",{"p-disabled":t.disabled}],image:"p-chip-image",icon:"p-chip-icon",label:"p-chip-label",removeIcon:"p-chip-remove-icon"},Fi=(()=>{class t extends U{name="chip";style=Ni;classes=ea;inlineStyles=Kr;static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275prov=L({token:t,factory:t.\u0275fac})}return t})();var Oi=new P("CHIP_INSTANCE"),Ed=(()=>{class t extends J{componentName="Chip";$pcChip=p(Oi,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=p(g,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}label;icon;image;alt;styleClass;disabled=!1;removable=!1;removeIcon;onRemove=new N;onImageError=new N;visible=!0;get removeAriaLabel(){return this.config.getTranslation(ct.ARIA).removeLabel}get chipProps(){return this._chipProps}set chipProps(e){this._chipProps=e,e&&typeof e=="object"&&Object.entries(e).forEach(([i,o])=>this[`_${i}`]!==o&&(this[`_${i}`]=o))}_chipProps;_componentStyle=p(Fi);removeIconTemplate;templates;_removeIconTemplate;onAfterContentInit(){this.templates.forEach(e=>{e.getType()==="removeicon"?this._removeIconTemplate=e.template:this._removeIconTemplate=e.template})}onChanges(e){if(e.chipProps&&e.chipProps.currentValue){let{currentValue:i}=e.chipProps;i.label!==void 0&&(this.label=i.label),i.icon!==void 0&&(this.icon=i.icon),i.image!==void 0&&(this.image=i.image),i.alt!==void 0&&(this.alt=i.alt),i.styleClass!==void 0&&(this.styleClass=i.styleClass),i.removable!==void 0&&(this.removable=i.removable),i.removeIcon!==void 0&&(this.removeIcon=i.removeIcon)}}close(e){this.visible=!1,this.onRemove.emit(e)}onKeydown(e){(e.key==="Enter"||e.key==="Backspace")&&this.close(e)}imageError(e){this.onImageError.emit(e)}get dataP(){return this.cn({removable:this.removable})}static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275cmp=k({type:t,selectors:[["p-chip"]],contentQueries:function(i,o,r){if(i&1&&le(r,Lr,4)(r,te,4),i&2){let a;I(a=T())&&(o.removeIconTemplate=a.first),I(a=T())&&(o.templates=a)}},hostVars:6,hostBindings:function(i,o){i&2&&(v("aria-label",o.label)("data-p",o.dataP),me(o.sx("root")),m(o.cn(o.cx("root"),o.styleClass)))},inputs:{label:"label",icon:"icon",image:"image",alt:"alt",styleClass:"styleClass",disabled:[2,"disabled","disabled",C],removable:[2,"removable","removable",C],removeIcon:"removeIcon",chipProps:"chipProps"},outputs:{onRemove:"onRemove",onImageError:"onImageError"},features:[j([Fi,{provide:Oi,useExisting:t},{provide:q,useExisting:t}]),$([g]),w],ngContentSelectors:jr,decls:6,vars:4,consts:[["iconTemplate",""],[3,"pBind","class","src","alt","error",4,"ngIf","ngIfElse"],[3,"pBind","class",4,"ngIf"],[4,"ngIf"],[3,"error","pBind","src","alt"],[3,"pBind","class","ngClass",4,"ngIf"],[3,"pBind","ngClass"],[3,"pBind"],["role","button",3,"pBind","class","click","keydown",4,"ngIf"],["role","button",3,"pBind","class","ngClass","click","keydown",4,"ngIf"],["data-p-icon","times-circle","role","button",3,"pBind","class","click","keydown",4,"ngIf"],["role","button",3,"click","keydown","pBind","ngClass"],["data-p-icon","times-circle","role","button",3,"click","keydown","pBind"],["role","button",3,"click","keydown","pBind"],[4,"ngTemplateOutlet"]],template:function(i,o){if(i&1&&(ee(),Z(0),h(1,Hr,1,5,"img",1)(2,$r,1,1,"ng-template",null,0,Ae)(4,Ur,2,4,"div",2)(5,Jr,3,2,"ng-container",3)),i&2){let r=Ue(3);c(),s("ngIf",o.image)("ngIfElse",r),c(3),s("ngIf",o.label),c(),s("ngIf",o.removable)}},dependencies:[W,Pe,De,ce,Gn,X,g],encapsulation:2,changeDetection:0})}return t})();var Ad=[{id:"marca-nortada",label:"Nortada"},{id:"marca-urbano",label:"Urbano"},{id:"marca-andina",label:"Andina"},{id:"marca-lumina",label:"Lumina"}],Pd=[{id:"sector-costanera",label:"Costanera"},{id:"sector-parque-a",label:"Parque A."},{id:"sector-vespucio",label:"Vespucio"}],Bi=[{id:"holding",label:"Holding",type:"HOLDING",parentId:null},{id:"empresa-gastronomia",label:"Empresa Gastron\xF3mica",type:"EMPRESA",parentId:"holding"},{id:"tienda-antofagasta",label:"Antofagasta",type:"TIENDA",parentId:"empresa-gastronomia",marcaId:"marca-nortada",sectorId:"sector-costanera"},{id:"tienda-costanera-center",label:"Costanera Center",type:"TIENDA",parentId:"empresa-gastronomia",marcaId:"marca-nortada",sectorId:"sector-costanera"},{id:"tienda-tanta-cost",label:"Tanta Cost.",type:"TIENDA",parentId:"empresa-gastronomia",marcaId:"marca-urbano",sectorId:"sector-costanera"},{id:"tienda-open-kenn",label:"Open Kenn.",type:"TIENDA",parentId:"empresa-gastronomia",marcaId:"marca-andina",sectorId:"sector-parque-a"},{id:"tienda-parque-arauco",label:"Parque Arauco",type:"TIENDA",parentId:"empresa-gastronomia",marcaId:"marca-andina",sectorId:"sector-parque-a"},{id:"empresa-retail",label:"Empresa Retail",type:"EMPRESA",parentId:"holding"},{id:"tienda-vespucio-mall",label:"Vespucio Mall",type:"TIENDA",parentId:"empresa-retail",marcaId:"marca-lumina",sectorId:"sector-vespucio"},{id:"tienda-vespucio-norte",label:"Vespucio Norte",type:"TIENDA",parentId:"empresa-retail",marcaId:"marca-lumina",sectorId:"sector-vespucio"}];function Ud(t,n){let e=n?.injector??p(Ft),i=new mn(1),o=lt(()=>{let r;try{r=t()}catch(a){Me(()=>i.error(a));return}Me(()=>i.next(r))},{injector:e,manualCleanup:!0});return e.get(st).onDestroy(()=>{o.destroy(),i.complete()}),i.asObservable()}function qd(t,n){let i=!n?.manualCleanup?n?.injector?.get(st)??p(st):null,o=ta(n?.equal),r;n?.requireSync?r=F({kind:0},{equal:o}):r=F({kind:1,value:n?.initialValue},{equal:o});let a,E=t.subscribe({next:M=>r.set({kind:1,value:M}),error:M=>{r.set({kind:2,error:M}),a?.()},complete:()=>{a?.()}});if(n?.requireSync&&r().kind===0)throw new ft(601,!1);return a=i?.onDestroy(E.unsubscribe.bind(E)),D(()=>{let M=r();switch(M.kind){case 1:return M.value;case 2:throw M.error;case 0:throw new ft(601,!1)}},{equal:n?.equal})}function ta(t=Object.is){return(n,e)=>n.kind===1&&e.kind===1&&t(n.value,e.value)}function na(t){let n=t;return()=>{n|=0,n=n+1831565813|0;let e=Math.imul(n^n>>>15,1|n);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function ia(t,n){let e=t.map((a,E)=>E);for(let a=e.length-1;a>0;a--){let E=Math.floor(n()*(a+1));[e[a],e[E]]=[e[E],e[a]]}let i=new Array(t.length);for(let a=0;a<t.length;a++)i[e[a]]=1/Math.pow(a+1,.8);let o=[],r=0;for(let a of i)r+=a,o.push(r);return o}function oa(t,n,e){let i=e()*n[n.length-1],o=0,r=n.length-1;for(;o<r;){let a=o+r>>>1;n[a]<i?o=a+1:r=a}return t[o]}function ra(t){return Number(t.endDate.slice(-2))-Number(t.startDate.slice(-2))+1}var zi={"2026-01":538026949,"2026-02":495310200,"2026-03":612450100},aa=.04,sa=Math.min(...Object.values(zi));function la(t){let n=0;for(let e=0;e<t.length;e++)n=n*31+t.charCodeAt(e)|0;return(n>>>0)/4294967296}function ca(t){let n=zi[t];return n!==void 0?aa*(n/sa):.03+la(t)*.03}function da(){let t=na(20260714),n=Bi.filter(r=>r.type==="TIENDA"),e=ia(Xt,t),i=[],o=0;for(let r of Be){let a=ra(r),E=ca(r.id);for(let M of n){let Q=380+Math.floor(t()*60),K=0;for(let de=0;de<Q;de++){o++;let oe=`tx-${o}`,Re=ge(r.startDate,Math.floor(t()*a)),ln=Math.floor(t()*24),Mo=1+Math.floor(t()*3);for(let cn=0;cn<Mo;cn++){let ko=oa(Xt,e,t),dn=1+Math.floor(t()*3),Do=8e3+t()*8e3,Io=.8+t()*.6,un=Math.round(Do*dn*Io);K+=un,i.push({transactionId:oe,date:Re,storeId:M.id,productId:ko.id,hour:ln,amount:un,quantity:dn})}}o++,i.push({transactionId:`tx-descuento-${o}`,date:ge(r.startDate,Math.floor(t()*a)),storeId:M.id,productId:"descuento-generico",hour:Math.floor(t()*24),amount:-Math.round(K*E),quantity:-1})}}return i}var Kd=da();var Li="pyxis:default-view:";function Ri(t){return t===null||Array.isArray(t)&&t.every(n=>typeof n=="string")}function ua(t){if(typeof t!="object"||t===null)return!1;let n=t;return typeof n.contextId=="string"&&Array.isArray(n.periodIds)&&n.periodIds.every(e=>typeof e=="string")&&(n.granularity==="dia"||n.granularity==="semana"||n.granularity==="mes")&&Ri(n.sectorMarcaTiendaFilter)&&typeof n.compareToPrevious=="boolean"&&(n.comparisonMode==="periodo_anterior"||n.comparisonMode==="periodo_especifico"||n.comparisonMode==="meta")&&(n.comparisonAlignment==="calendario"||n.comparisonAlignment==="dia_semana")&&Ri(n.explicitComparisonPeriodIds)&&(n.ivaMode==="con_iva"||n.ivaMode==="sin_iva")}function tu(t){try{if(typeof localStorage>"u")return null;let n=localStorage.getItem(`${Li}${t}`);if(!n)return null;let e=JSON.parse(n);return ua(e)?e:null}catch{return null}}function nu(t,n){try{if(typeof localStorage>"u")return;localStorage.setItem(`${Li}${t}`,JSON.stringify(n))}catch{}}function iu(t,n){if(t===null||n===null)return t===n;if(t.length!==n.length)return!1;let e=new Set(n);return t.every(i=>e.has(i))}function ji(t){let n=new Map;for(let e of t){let i=n.get(e.year)??[];i.push(e),n.set(e.year,i)}return n}function an(t){return t.year*12+t.month}function pa(t){return`${t.year}-${String(t.month).padStart(2,"0")}-${String(t.day).padStart(2,"0")}`}function it(t,n){let e=pa(n);return t.find(i=>i.startDate<=e&&e<=i.endDate)}var ru=[{key:"mes-actual",label:"Mes Actual",granularity:"mes",resolve:(t,n)=>{let e=an(n);return t.filter(i=>i.order===e).map(i=>i.id)}},{key:"ultimo-trimestre",label:"\xDAltimo Trimestre",granularity:"mes",resolve:(t,n)=>{let e=an(n);return t.filter(i=>i.order>e-3&&i.order<=e).map(i=>i.id)}},{key:"ultimos-6-meses",label:"\xDAltimos 6 Meses",granularity:"mes",resolve:(t,n)=>{let e=an(n);return t.filter(i=>i.order>e-6&&i.order<=e).map(i=>i.id)}},{key:"ano-actual",label:"A\xF1o en Curso",granularity:"mes",resolve:(t,n)=>t.filter(e=>e.year===n.year&&e.month<=n.month).map(e=>e.id)},{key:"ano-anterior",label:"A\xF1o Anterior",granularity:"mes",resolve:(t,n)=>t.filter(e=>e.year===n.year-1).map(e=>e.id)},{key:"ultimos-3-anos",label:"\xDAltimos 3 A\xF1os",granularity:"mes",resolve:(t,n)=>t.filter(e=>e.year>=n.year-2&&e.year<=n.year).map(e=>e.id)},{key:"ultimas-3-semanas",label:"\xDAltimas 3 Semanas",granularity:"semana",resolve:(t,n)=>{let e=it(t,n);return e?t.filter(i=>i.order>e.order-3&&i.order<=e.order).map(i=>i.id):[]}},{key:"ultimas-12-semanas",label:"\xDAltimas 12 Semanas",granularity:"semana",resolve:(t,n)=>{let e=it(t,n);return e?t.filter(i=>i.order>e.order-12&&i.order<=e.order).map(i=>i.id):[]}},{key:"hoy",label:"Hoy",granularity:"dia",resolve:(t,n)=>{let e=it(t,n);return e?[e.id]:[]}},{key:"ayer",label:"Ayer",granularity:"dia",resolve:(t,n)=>{let e=it(t,n);return e?t.filter(i=>i.order===e.order-1).map(i=>i.id):[]}},{key:"ultimos-7-dias",label:"\xDAltimos 7 D\xEDas",granularity:"dia",resolve:(t,n)=>{let e=it(t,n);return e?t.filter(i=>i.order>e.order-7&&i.order<=e.order).map(i=>i.id):[]}},{key:"ultimos-30-dias",label:"\xDAltimos 30 D\xEDas",granularity:"dia",resolve:(t,n)=>{let e=it(t,n);return e?t.filter(i=>i.order>e.order-30&&i.order<=e.order).map(i=>i.id):[]}}];function au(t,n,e,i){if(t.length===0)return[];let o=n==="dia_semana"&&e==="dia"?7*Math.ceil(t.length/7):t.length,r=new Set(t.map(a=>a.order-o));return i.filter(a=>r.has(a.order))}var Hi=`
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
`;var ha=["header"],Gi=["content"],$i=["footer"],ga=["closeicon"],fa=["maximizeicon"],_a=["minimizeicon"],ba=["headless"],ya=["titlebar"],va=["*",[["p-footer"]]],Ca=["*","p-footer"],xa=t=>({ariaLabelledBy:t});function wa(t,n){t&1&&ie(0)}function Ma(t,n){if(t&1&&(fe(0),h(1,wa,1,0,"ng-container",11),_e()),t&2){let e=l(3);c(),s("ngTemplateOutlet",e._headlessTemplate||e.headlessTemplate||e.headlessT)}}function ka(t,n){if(t&1){let e=S();d(0,"div",16),x("mousedown",function(o){b(e);let r=l(4);return y(r.initResize(o))}),u()}if(t&2){let e=l(4);m(e.cx("resizeHandle")),Mn("z-index",90),s("pBind",e.ptm("resizeHandle"))}}function Da(t,n){if(t&1&&(d(0,"span",21),Y(1),u()),t&2){let e=l(5);m(e.cx("title")),s("id",e.ariaLabelledBy)("pBind",e.ptm("title")),c(),he(e.header)}}function Ia(t,n){t&1&&ie(0)}function Ta(t,n){if(t&1&&z(0,"span",25),t&2){let e=l(7);s("ngClass",e.maximized?e.minimizeIcon:e.maximizeIcon)}}function Ea(t,n){t&1&&(V(),z(0,"svg",28))}function Sa(t,n){t&1&&(V(),z(0,"svg",29))}function Va(t,n){if(t&1&&(fe(0),h(1,Ea,1,0,"svg",26)(2,Sa,1,0,"svg",27),_e()),t&2){let e=l(7);c(),s("ngIf",!e.maximized&&!e._maximizeiconTemplate&&!e.maximizeIconTemplate&&!e.maximizeIconT),c(),s("ngIf",e.maximized&&!e._minimizeiconTemplate&&!e.minimizeIconTemplate&&!e.minimizeIconT)}}function Aa(t,n){}function Pa(t,n){t&1&&h(0,Aa,0,0,"ng-template")}function Na(t,n){if(t&1&&(fe(0),h(1,Pa,1,0,null,11),_e()),t&2){let e=l(7);c(),s("ngTemplateOutlet",e._maximizeiconTemplate||e.maximizeIconTemplate||e.maximizeIconT)}}function Fa(t,n){}function Oa(t,n){t&1&&h(0,Fa,0,0,"ng-template")}function Ba(t,n){if(t&1&&(fe(0),h(1,Oa,1,0,null,11),_e()),t&2){let e=l(7);c(),s("ngTemplateOutlet",e._minimizeiconTemplate||e.minimizeIconTemplate||e.minimizeIconT)}}function za(t,n){if(t&1&&h(0,Ta,1,1,"span",23)(1,Va,3,2,"ng-container",24)(2,Na,2,1,"ng-container",24)(3,Ba,2,1,"ng-container",24),t&2){let e=l(6);s("ngIf",e.maximizeIcon&&!e._maximizeiconTemplate&&!e._minimizeiconTemplate),c(),s("ngIf",!e.maximizeIcon&&!(e.maximizeButtonProps!=null&&e.maximizeButtonProps.icon)),c(),s("ngIf",!e.maximized),c(),s("ngIf",e.maximized)}}function Ra(t,n){if(t&1){let e=S();d(0,"p-button",22),x("onClick",function(){b(e);let o=l(5);return y(o.maximize())})("keydown.enter",function(){b(e);let o=l(5);return y(o.maximize())}),h(1,za,4,4,"ng-template",null,4,Ae),u()}if(t&2){let e=l(5);s("pt",e.ptm("pcMaximizeButton"))("styleClass",e.cx("pcMaximizeButton"))("ariaLabel",e.maximized?e.minimizeLabel:e.maximizeLabel)("tabindex",e.maximizable?"0":"-1")("buttonProps",e.maximizeButtonProps)("unstyled",e.unstyled()),v("data-pc-group-section","headericon")}}function La(t,n){if(t&1&&z(0,"span"),t&2){let e=l(8);m(e.closeIcon)}}function ja(t,n){t&1&&(V(),z(0,"svg",32))}function Ha(t,n){if(t&1&&(fe(0),h(1,La,1,2,"span",30)(2,ja,1,0,"svg",31),_e()),t&2){let e=l(7);c(),s("ngIf",e.closeIcon),c(),s("ngIf",!e.closeIcon)}}function Ga(t,n){}function $a(t,n){t&1&&h(0,Ga,0,0,"ng-template")}function Ua(t,n){if(t&1&&(d(0,"span"),h(1,$a,1,0,null,11),u()),t&2){let e=l(7);c(),s("ngTemplateOutlet",e._closeiconTemplate||e.closeIconTemplate||e.closeIconT)}}function qa(t,n){if(t&1&&h(0,Ha,3,2,"ng-container",24)(1,Ua,2,1,"span",24),t&2){let e=l(6);s("ngIf",!e._closeiconTemplate&&!e.closeIconTemplate&&!e.closeIconT&&!(e.closeButtonProps!=null&&e.closeButtonProps.icon)),c(),s("ngIf",e._closeiconTemplate||e.closeIconTemplate||e.closeIconT)}}function Ya(t,n){if(t&1){let e=S();d(0,"p-button",22),x("onClick",function(o){b(e);let r=l(5);return y(r.close(o))})("keydown.enter",function(o){b(e);let r=l(5);return y(r.close(o))}),h(1,qa,2,2,"ng-template",null,4,Ae),u()}if(t&2){let e=l(5);s("pt",e.ptm("pcCloseButton"))("styleClass",e.cx("pcCloseButton"))("ariaLabel",e.closeAriaLabel)("tabindex",e.closeTabindex)("buttonProps",e.closeButtonProps)("unstyled",e.unstyled()),v("data-pc-group-section","headericon")}}function Wa(t,n){if(t&1){let e=S();d(0,"div",16,3),x("mousedown",function(o){b(e);let r=l(4);return y(r.initDrag(o))}),h(2,Da,2,5,"span",17)(3,Ia,1,0,"ng-container",18),d(4,"div",19),h(5,Ra,3,7,"p-button",20)(6,Ya,3,7,"p-button",20),u()()}if(t&2){let e=l(4);m(e.cx("header")),s("pBind",e.ptm("header")),c(2),s("ngIf",!e._headerTemplate&&!e.headerTemplate&&!e.headerT),c(),s("ngTemplateOutlet",e._headerTemplate||e.headerTemplate||e.headerT)("ngTemplateOutletContext",we(11,xa,e.ariaLabelledBy)),c(),m(e.cx("headerActions")),s("pBind",e.ptm("headerActions")),c(),s("ngIf",e.maximizable),c(),s("ngIf",e.closable)}}function Za(t,n){t&1&&ie(0)}function Qa(t,n){t&1&&ie(0)}function Xa(t,n){if(t&1&&(d(0,"div",19,5),Z(2,1),h(3,Qa,1,0,"ng-container",11),u()),t&2){let e=l(4);m(e.cx("footer")),s("pBind",e.ptm("footer")),c(3),s("ngTemplateOutlet",e._footerTemplate||e.footerTemplate||e.footerT)}}function Ja(t,n){if(t&1&&(h(0,ka,1,5,"div",12)(1,Wa,7,13,"div",13),d(2,"div",14,2),Z(4),h(5,Za,1,0,"ng-container",11),u(),h(6,Xa,4,4,"div",15)),t&2){let e=l(3);s("ngIf",e.resizable),c(),s("ngIf",e.showHeader),c(),m(e.cn(e.cx("content"),e.contentStyleClass)),s("ngStyle",e.contentStyle)("pBind",e.ptm("content")),c(3),s("ngTemplateOutlet",e._contentTemplate||e.contentTemplate||e.contentT),c(),s("ngIf",e._footerTemplate||e.footerTemplate||e.footerT)}}function Ka(t,n){if(t&1){let e=S();d(0,"div",9,0),x("pMotionOnBeforeEnter",function(o){b(e);let r=l(2);return y(r.onBeforeEnter(o))})("pMotionOnAfterEnter",function(o){b(e);let r=l(2);return y(r.onAfterEnter(o))})("pMotionOnBeforeLeave",function(o){b(e);let r=l(2);return y(r.onBeforeLeave(o))})("pMotionOnAfterLeave",function(o){b(e);let r=l(2);return y(r.onAfterLeave(o))}),h(2,Ma,2,1,"ng-container",10)(3,Ja,7,8,"ng-template",null,1,Ae),u()}if(t&2){let e=Ue(4),i=l(2);me(i.sx("root")),m(i.cn(i.cx("root"),i.styleClass)),s("ngStyle",i.style)("pBind",i.ptm("root"))("pFocusTrapDisabled",i.focusTrap===!1)("pMotion",i.visible)("pMotionAppear",!0)("pMotionName","p-dialog")("pMotionOptions",i.computedMotionOptions()),v("role",i.role)("aria-labelledby",i.ariaLabelledBy)("aria-modal",!0)("data-p",i.dataP),c(2),s("ngIf",i._headlessTemplate||i.headlessTemplate||i.headlessT)("ngIfElse",e)}}function es(t,n){if(t&1){let e=S();d(0,"div",7),x("pMotionOnAfterLeave",function(){b(e);let o=l();return y(o.onMaskAfterLeave())}),O(1,Ka,5,17,"div",8),u()}if(t&2){let e=l();me(e.sx("mask")),m(e.cn(e.cx("mask"),e.maskStyleClass)),s("ngStyle",e.maskStyle)("pBind",e.ptm("mask"))("pMotion",e.maskVisible)("pMotionAppear",!0)("pMotionEnterActiveClass",e.modal?"p-overlay-mask-enter-active":"")("pMotionLeaveActiveClass",e.modal?"p-overlay-mask-leave-active":"")("pMotionOptions",e.computedMaskMotionOptions()),v("data-p-scrollblocker-active",e.modal||e.blockScroll)("data-p",e.dataP),c(),B(e.renderDialog()?1:-1)}}var ts={mask:({instance:t})=>({position:"fixed",height:"100%",width:"100%",left:0,top:0,display:"flex",justifyContent:t.position==="left"||t.position==="topleft"||t.position==="bottomleft"?"flex-start":t.position==="right"||t.position==="topright"||t.position==="bottomright"?"flex-end":"center",alignItems:t.position==="top"||t.position==="topleft"||t.position==="topright"?"flex-start":t.position==="bottom"||t.position==="bottomleft"||t.position==="bottomright"?"flex-end":"center",pointerEvents:t.modal?"auto":"none"}),root:{display:"flex",flexDirection:"column",pointerEvents:"auto"}},ns={mask:({instance:t})=>{let e=["left","right","top","topleft","topright","bottom","bottomleft","bottomright"].find(i=>i===t.position);return["p-dialog-mask",{"p-overlay-mask":t.modal},e?`p-dialog-${e}`:""]},root:({instance:t})=>["p-dialog p-component",{"p-dialog-maximized":t.maximizable&&t.maximized}],header:"p-dialog-header",title:"p-dialog-title",resizeHandle:"p-resizable-handle",headerActions:"p-dialog-header-actions",pcMaximizeButton:"p-dialog-maximize-button",pcCloseButton:"p-dialog-close-button",content:()=>["p-dialog-content"],footer:"p-dialog-footer"},Ui=(()=>{class t extends U{name="dialog";style=Hi;classes=ns;inlineStyles=ts;static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275prov=L({token:t,factory:t.\u0275fac})}return t})();var qi=new P("DIALOG_INSTANCE"),Pu=(()=>{class t extends J{componentName="Dialog";hostName="";$pcDialog=p(qi,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=p(g,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("host"))}header;draggable=!0;resizable=!0;contentStyle;contentStyleClass;modal=!1;closeOnEscape=!0;dismissableMask=!1;rtl=!1;closable=!0;breakpoints;styleClass;maskStyleClass;maskStyle;showHeader=!0;blockScroll=!1;autoZIndex=!0;baseZIndex=0;minX=0;minY=0;focusOnShow=!0;maximizable=!1;keepInViewport=!0;focusTrap=!0;transitionOptions="150ms cubic-bezier(0, 0, 0.2, 1)";maskMotionOptions=_(void 0);computedMaskMotionOptions=D(()=>A(A({},this.ptm("maskMotion")),this.maskMotionOptions()));motionOptions=_(void 0);computedMotionOptions=D(()=>A(A({},this.ptm("motion")),this.motionOptions()));closeIcon;closeAriaLabel;closeTabindex="0";minimizeIcon;maximizeIcon;closeButtonProps={severity:"secondary",variant:"text",rounded:!0};maximizeButtonProps={severity:"secondary",variant:"text",rounded:!0};get visible(){return this._visible}set visible(e){this._visible=e,this._visible&&!this.maskVisible&&(this.maskVisible=!0,this.renderMask.set(!0),this.renderDialog.set(!0))}get style(){return this._style}set style(e){e&&(this._style=A({},e),this.originalStyle=e)}position;role="dialog";appendTo=_(void 0);onShow=new N;onHide=new N;visibleChange=new N;onResizeInit=new N;onResizeEnd=new N;onDragEnd=new N;onMaximize=new N;headerViewChild;contentViewChild;footerViewChild;headerTemplate;contentTemplate;footerTemplate;closeIconTemplate;maximizeIconTemplate;minimizeIconTemplate;headlessTemplate;_headerTemplate;_contentTemplate;_footerTemplate;_closeiconTemplate;_maximizeiconTemplate;_minimizeiconTemplate;_headlessTemplate;$appendTo=D(()=>this.appendTo()||this.config.overlayAppendTo());renderMask=F(!1);renderDialog=F(!1);_visible=!1;maskVisible;container=F(null);wrapper;dragging;ariaLabelledBy=this.getAriaLabelledBy();documentDragListener;documentDragEndListener;resizing;documentResizeListener;documentResizeEndListener;documentEscapeListener;maskClickListener;lastPageX;lastPageY;preventVisibleChangePropagation;maximized;preMaximizeContentHeight;preMaximizeContainerWidth;preMaximizeContainerHeight;preMaximizePageX;preMaximizePageY;id=He("pn_id_");_style={};originalStyle;transformOptions="scale(0.7)";styleElement;window;_componentStyle=p(Ui);headerT;contentT;footerT;closeIconT;maximizeIconT;minimizeIconT;headlessT;zIndexForLayering;get maximizeLabel(){return this.config.getTranslation(ct.ARIA).maximizeLabel}get minimizeLabel(){return this.config.getTranslation(ct.ARIA).minimizeLabel}zone=p(_t);overlayService=p(vt);get maskClass(){let i=["left","right","top","topleft","topright","bottom","bottomleft","bottomright"].find(o=>o===this.position);return{"p-dialog-mask":!0,"p-overlay-mask":this.modal||this.dismissableMask,[`p-dialog-${i}`]:i}}onInit(){this.breakpoints&&this.createStyle()}templates;onAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"header":this.headerT=e.template;break;case"content":this.contentT=e.template;break;case"footer":this.footerT=e.template;break;case"closeicon":this.closeIconT=e.template;break;case"maximizeicon":this.maximizeIconT=e.template;break;case"minimizeicon":this.minimizeIconT=e.template;break;case"headless":this.headlessT=e.template;break;default:this.contentT=e.template;break}})}getAriaLabelledBy(){return this.header!==null?He("pn_id_")+"_header":null}parseDurationToMilliseconds(e){let i=/([\d\.]+)(ms|s)\b/g,o=0,r;for(;(r=i.exec(e))!==null;){let a=parseFloat(r[1]),E=r[2];E==="ms"?o+=a:E==="s"&&(o+=a*1e3)}if(o!==0)return o}_focus(e){if(e){let i=this.parseDurationToMilliseconds(this.transitionOptions),o=Rn.getFocusableElements(e);if(o&&o.length>0)return this.zone.runOutsideAngular(()=>{setTimeout(()=>o[0].focus(),i||5)}),!0}return!1}focus(e=this.contentViewChild?.nativeElement){let i=this._focus(e);i||(i=this._focus(this.footerViewChild?.nativeElement),i||(i=this._focus(this.headerViewChild?.nativeElement),i||this._focus(this.contentViewChild?.nativeElement)))}close(e){this.visible=!1,this.visibleChange.emit(this.visible),e.preventDefault()}enableModality(){this.closable&&this.dismissableMask&&(this.maskClickListener=this.renderer.listen(this.wrapper,"mousedown",e=>{this.wrapper&&this.wrapper.isSameNode(e.target)&&this.close(e)})),this.modal&&qt()}disableModality(){if(this.wrapper){this.dismissableMask&&this.unbindMaskClickListener();let e=document.querySelectorAll('[data-p-scrollblocker-active="true"]');this.modal&&e&&e.length==1&&Yt(),this.cd.destroyed||this.cd.detectChanges()}}maximize(){this.maximized=!this.maximized,!this.modal&&!this.blockScroll&&(this.maximized?qt():Yt()),this.onMaximize.emit({maximized:this.maximized})}unbindMaskClickListener(){this.maskClickListener&&(this.maskClickListener(),this.maskClickListener=null)}moveOnTop(){this.autoZIndex?(Te.set("modal",this.container(),this.baseZIndex+this.config.zIndex.modal),this.wrapper.style.zIndex=String(parseInt(this.container().style.zIndex,10)-1)):this.zIndexForLayering=Te.generateZIndex("modal",(this.baseZIndex??0)+this.config.zIndex.modal)}createStyle(){if(Qe(this.platformId)&&!this.styleElement&&!this.$unstyled()){this.styleElement=this.renderer.createElement("style"),this.styleElement.type="text/css",Ut(this.styleElement,"nonce",this.config?.csp()?.nonce),this.renderer.appendChild(this.document.head,this.styleElement);let e="";for(let i in this.breakpoints)e+=`
                        @media screen and (max-width: ${i}) {
                            .p-dialog[${this.id}]:not(.p-dialog-maximized) {
                                width: ${this.breakpoints[i]} !important;
                            }
                        }
                    `;this.renderer.setProperty(this.styleElement,"innerHTML",e),Ut(this.styleElement,"nonce",this.config?.csp()?.nonce)}}initDrag(e){e.target.closest("div")?.getAttribute("data-pc-section")!=="headeractions"&&this.draggable&&(this.dragging=!0,this.lastPageX=e.pageX,this.lastPageY=e.pageY,this.container().style.margin="0",this.document.body.setAttribute("data-p-unselectable-text","true"),!this.$unstyled()&&Ht(this.document.body,{"user-select":"none"}))}onDrag(e){if(this.dragging&&this.container()){let i=Gt(this.container()),o=yt(this.container()),r=e.pageX-this.lastPageX,a=e.pageY-this.lastPageY,E=this.container().getBoundingClientRect(),M=getComputedStyle(this.container()),Q=parseFloat(M.marginLeft),K=parseFloat(M.marginTop),de=E.left+r-Q,oe=E.top+a-K,Re=jt();this.container().style.position="fixed",this.keepInViewport?(de>=this.minX&&de+i<Re.width&&(this._style.left=`${de}px`,this.lastPageX=e.pageX,this.container().style.left=`${de}px`),oe>=this.minY&&oe+o<Re.height&&(this._style.top=`${oe}px`,this.lastPageY=e.pageY,this.container().style.top=`${oe}px`)):(this.lastPageX=e.pageX,this.container().style.left=`${de}px`,this.lastPageY=e.pageY,this.container().style.top=`${oe}px`),this.overlayService.emitParentDrag(this.container())}}endDrag(e){this.dragging&&(this.dragging=!1,this.document.body.removeAttribute("data-p-unselectable-text"),!this.$unstyled()&&(this.document.body.style["user-select"]=""),this.cd.detectChanges(),this.onDragEnd.emit(e))}resetPosition(){this.container().style.position="",this.container().style.left="",this.container().style.top="",this.container().style.margin=""}center(){this.resetPosition()}initResize(e){this.resizable&&(this.resizing=!0,this.lastPageX=e.pageX,this.lastPageY=e.pageY,this.document.body.setAttribute("data-p-unselectable-text","true"),!this.$unstyled()&&Ht(this.document.body,{"user-select":"none"}),this.onResizeInit.emit(e))}onResize(e){if(this.resizing){let i=e.pageX-this.lastPageX,o=e.pageY-this.lastPageY,r=Gt(this.container()),a=yt(this.container()),E=yt(this.contentViewChild?.nativeElement),M=r+i,Q=a+o,K=this.container().style.minWidth,de=this.container().style.minHeight,oe=this.container().getBoundingClientRect(),Re=jt();(!parseInt(this.container().style.top)||!parseInt(this.container().style.left))&&(M+=i,Q+=o),(!K||M>parseInt(K))&&oe.left+M<Re.width&&(this._style.width=M+"px",this.container().style.width=this._style.width),(!de||Q>parseInt(de))&&oe.top+Q<Re.height&&(this.contentViewChild.nativeElement.style.height=E+Q-a+"px",this._style.height&&(this._style.height=Q+"px",this.container().style.height=this._style.height)),this.lastPageX=e.pageX,this.lastPageY=e.pageY}}resizeEnd(e){this.resizing&&(this.resizing=!1,this.document.body.removeAttribute("data-p-unselectable-text"),!this.$unstyled()&&(this.document.body.style["user-select"]=""),this.onResizeEnd.emit(e))}bindGlobalListeners(){this.draggable&&(this.bindDocumentDragListener(),this.bindDocumentDragEndListener()),this.resizable&&this.bindDocumentResizeListeners(),this.closeOnEscape&&this.closable&&this.bindDocumentEscapeListener()}unbindGlobalListeners(){this.unbindDocumentDragListener(),this.unbindDocumentDragEndListener(),this.unbindDocumentResizeListeners(),this.unbindDocumentEscapeListener()}bindDocumentDragListener(){this.documentDragListener||this.zone.runOutsideAngular(()=>{this.documentDragListener=this.renderer.listen(this.document.defaultView,"mousemove",this.onDrag.bind(this))})}unbindDocumentDragListener(){this.documentDragListener&&(this.documentDragListener(),this.documentDragListener=null)}bindDocumentDragEndListener(){this.documentDragEndListener||this.zone.runOutsideAngular(()=>{this.documentDragEndListener=this.renderer.listen(this.document.defaultView,"mouseup",this.endDrag.bind(this))})}unbindDocumentDragEndListener(){this.documentDragEndListener&&(this.documentDragEndListener(),this.documentDragEndListener=null)}bindDocumentResizeListeners(){!this.documentResizeListener&&!this.documentResizeEndListener&&this.zone.runOutsideAngular(()=>{this.documentResizeListener=this.renderer.listen(this.document.defaultView,"mousemove",this.onResize.bind(this)),this.documentResizeEndListener=this.renderer.listen(this.document.defaultView,"mouseup",this.resizeEnd.bind(this))})}unbindDocumentResizeListeners(){this.documentResizeListener&&this.documentResizeEndListener&&(this.documentResizeListener(),this.documentResizeEndListener(),this.documentResizeListener=null,this.documentResizeEndListener=null)}bindDocumentEscapeListener(){let e=this.el?this.el.nativeElement.ownerDocument:"document";this.documentEscapeListener=this.renderer.listen(e,"keydown",i=>{if(i.key=="Escape"){let o=this.container();if(!o)return;let r=Te.getCurrent();(parseInt(o.style.zIndex)==r||this.zIndexForLayering==r)&&this.close(i)}})}unbindDocumentEscapeListener(){this.documentEscapeListener&&(this.documentEscapeListener(),this.documentEscapeListener=null)}appendContainer(){this.$appendTo()!=="self"&&Xe(this.document.body,this.wrapper)}restoreAppend(){this.container()&&this.$appendTo()!=="self"&&this.renderer.appendChild(this.el.nativeElement,this.wrapper)}onBeforeEnter(e){this.container.set(e.element),this.wrapper=this.container()?.parentElement,this.$attrSelector&&this.container()?.setAttribute(this.$attrSelector,""),this.appendContainer(),this.moveOnTop(),this.bindGlobalListeners(),this.container()?.setAttribute(this.id,""),this.modal&&this.enableModality()}onAfterEnter(){this.focusOnShow&&this.focus(),this.onShow.emit({})}onBeforeLeave(){this.modal&&(this.maskVisible=!1)}onAfterLeave(){this.onContainerDestroy(),this.renderDialog.set(!1),this.modal?this.renderMask.set(!1):this.maskVisible=!1,this.onHide.emit({}),this.cd.markForCheck()}onMaskAfterLeave(){this.renderDialog()||this.renderMask.set(!1)}onContainerDestroy(){this.unbindGlobalListeners(),this.dragging=!1,this.maximized&&(Lt(this.document.body,"p-overflow-hidden"),this.document.body.style.removeProperty("--scrollbar-width"),this.maximized=!1),this.modal&&this.disableModality(),An(this.document.body,"p-overflow-hidden")&&Lt(this.document.body,"p-overflow-hidden"),this.container()&&this.autoZIndex&&Te.clear(this.container()),this.zIndexForLayering&&Te.revertZIndex(this.zIndexForLayering),this.container.set(null),this.wrapper=null,this._style=this.originalStyle?A({},this.originalStyle):{}}destroyStyle(){this.styleElement&&(this.renderer.removeChild(this.document.head,this.styleElement),this.styleElement=null)}onDestroy(){this.container()&&(this.restoreAppend(),this.onContainerDestroy()),this.destroyStyle()}get dataP(){return this.cn({maximized:this.maximized,modal:this.modal})}static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275cmp=k({type:t,selectors:[["p-dialog"]],contentQueries:function(i,o,r){if(i&1&&le(r,ha,4)(r,Gi,4)(r,$i,4)(r,ga,4)(r,fa,4)(r,_a,4)(r,ba,4)(r,te,4),i&2){let a;I(a=T())&&(o._headerTemplate=a.first),I(a=T())&&(o._contentTemplate=a.first),I(a=T())&&(o._footerTemplate=a.first),I(a=T())&&(o._closeiconTemplate=a.first),I(a=T())&&(o._maximizeiconTemplate=a.first),I(a=T())&&(o._minimizeiconTemplate=a.first),I(a=T())&&(o._headlessTemplate=a.first),I(a=T())&&(o.templates=a)}},viewQuery:function(i,o){if(i&1&&$e(ya,5)(Gi,5)($i,5),i&2){let r;I(r=T())&&(o.headerViewChild=r.first),I(r=T())&&(o.contentViewChild=r.first),I(r=T())&&(o.footerViewChild=r.first)}},inputs:{hostName:"hostName",header:"header",draggable:[2,"draggable","draggable",C],resizable:[2,"resizable","resizable",C],contentStyle:"contentStyle",contentStyleClass:"contentStyleClass",modal:[2,"modal","modal",C],closeOnEscape:[2,"closeOnEscape","closeOnEscape",C],dismissableMask:[2,"dismissableMask","dismissableMask",C],rtl:[2,"rtl","rtl",C],closable:[2,"closable","closable",C],breakpoints:"breakpoints",styleClass:"styleClass",maskStyleClass:"maskStyleClass",maskStyle:"maskStyle",showHeader:[2,"showHeader","showHeader",C],blockScroll:[2,"blockScroll","blockScroll",C],autoZIndex:[2,"autoZIndex","autoZIndex",C],baseZIndex:[2,"baseZIndex","baseZIndex",ke],minX:[2,"minX","minX",ke],minY:[2,"minY","minY",ke],focusOnShow:[2,"focusOnShow","focusOnShow",C],maximizable:[2,"maximizable","maximizable",C],keepInViewport:[2,"keepInViewport","keepInViewport",C],focusTrap:[2,"focusTrap","focusTrap",C],transitionOptions:"transitionOptions",maskMotionOptions:[1,"maskMotionOptions"],motionOptions:[1,"motionOptions"],closeIcon:"closeIcon",closeAriaLabel:"closeAriaLabel",closeTabindex:"closeTabindex",minimizeIcon:"minimizeIcon",maximizeIcon:"maximizeIcon",closeButtonProps:"closeButtonProps",maximizeButtonProps:"maximizeButtonProps",visible:"visible",style:"style",position:"position",role:"role",appendTo:[1,"appendTo"],headerTemplate:[0,"content","headerTemplate"],contentTemplate:"contentTemplate",footerTemplate:"footerTemplate",closeIconTemplate:"closeIconTemplate",maximizeIconTemplate:"maximizeIconTemplate",minimizeIconTemplate:"minimizeIconTemplate",headlessTemplate:"headlessTemplate"},outputs:{onShow:"onShow",onHide:"onHide",visibleChange:"visibleChange",onResizeInit:"onResizeInit",onResizeEnd:"onResizeEnd",onDragEnd:"onDragEnd",onMaximize:"onMaximize"},features:[j([Ui,{provide:qi,useExisting:t},{provide:q,useExisting:t}]),$([g]),w],ngContentSelectors:Ca,decls:1,vars:1,consts:[["container",""],["notHeadless",""],["content",""],["titlebar",""],["icon",""],["footer",""],[3,"class","style","ngStyle","pBind","pMotion","pMotionAppear","pMotionEnterActiveClass","pMotionLeaveActiveClass","pMotionOptions"],[3,"pMotionOnAfterLeave","ngStyle","pBind","pMotion","pMotionAppear","pMotionEnterActiveClass","pMotionLeaveActiveClass","pMotionOptions"],["pFocusTrap","",3,"class","style","ngStyle","pBind","pFocusTrapDisabled","pMotion","pMotionAppear","pMotionName","pMotionOptions"],["pFocusTrap","",3,"pMotionOnBeforeEnter","pMotionOnAfterEnter","pMotionOnBeforeLeave","pMotionOnAfterLeave","ngStyle","pBind","pFocusTrapDisabled","pMotion","pMotionAppear","pMotionName","pMotionOptions"],[4,"ngIf","ngIfElse"],[4,"ngTemplateOutlet"],[3,"class","pBind","z-index","mousedown",4,"ngIf"],[3,"class","pBind","mousedown",4,"ngIf"],[3,"ngStyle","pBind"],[3,"class","pBind",4,"ngIf"],[3,"mousedown","pBind"],[3,"id","class","pBind",4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"pBind"],[3,"pt","styleClass","ariaLabel","tabindex","buttonProps","unstyled","onClick","keydown.enter",4,"ngIf"],[3,"id","pBind"],[3,"onClick","keydown.enter","pt","styleClass","ariaLabel","tabindex","buttonProps","unstyled"],[3,"ngClass",4,"ngIf"],[4,"ngIf"],[3,"ngClass"],["data-p-icon","window-maximize",4,"ngIf"],["data-p-icon","window-minimize",4,"ngIf"],["data-p-icon","window-maximize"],["data-p-icon","window-minimize"],[3,"class",4,"ngIf"],["data-p-icon","times",4,"ngIf"],["data-p-icon","times"]],template:function(i,o){i&1&&(ee(va),O(0,es,2,14,"div",6)),i&2&&B(o.renderMask()?0:-1)},dependencies:[W,Pe,De,ce,bt,Fe,Yn,xt,Ai,Pi,X,g,Je,wt],encapsulation:2,changeDetection:0})}return t})();var At=(()=>{class t extends J{modelValue=F(void 0);$filled=D(()=>En(this.modelValue()));writeModelValue(e){this.modelValue.set(e)}static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275dir=se({type:t,features:[w]})}return t})();var Yi=`
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
`;var is=`
    ${Yi}

    /* For PrimeNG */
   .p-inputtext.ng-invalid.ng-dirty {
        border-color: dt('inputtext.invalid.border.color');
    }

    .p-inputtext.ng-invalid.ng-dirty::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }
`,os={root:({instance:t})=>["p-inputtext p-component",{"p-filled":t.$filled(),"p-inputtext-sm":t.pSize==="small","p-inputtext-lg":t.pSize==="large","p-invalid":t.invalid(),"p-variant-filled":t.$variant()==="filled","p-inputtext-fluid":t.hasFluid}]},Wi=(()=>{class t extends U{name="inputtext";style=is;classes=os;static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275prov=L({token:t,factory:t.\u0275fac})}return t})();var Zi=new P("INPUTTEXT_INSTANCE"),np=(()=>{class t extends At{componentName="InputText";hostName="";ptInputText=_();pInputTextPT=_();pInputTextUnstyled=_();bindDirectiveInstance=p(g,{self:!0});$pcInputText=p(Zi,{optional:!0,skipSelf:!0})??void 0;ngControl=p(Ve,{optional:!0,self:!0});pcFluid=p(Ct,{optional:!0,host:!0,skipSelf:!0});pSize;variant=_();fluid=_(void 0,{transform:C});invalid=_(void 0,{transform:C});$variant=D(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());_componentStyle=p(Wi);constructor(){super(),lt(()=>{let e=this.ptInputText()||this.pInputTextPT();e&&this.directivePT.set(e)}),lt(()=>{this.pInputTextUnstyled()&&this.directiveUnstyled.set(this.pInputTextUnstyled())})}onAfterViewInit(){this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value),this.cd.detectChanges()}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("root"))}onDoCheck(){this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value)}onInput(){this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value)}get hasFluid(){return this.fluid()??!!this.pcFluid}get dataP(){return this.cn({invalid:this.invalid(),fluid:this.hasFluid,filled:this.$variant()==="filled",[this.pSize]:this.pSize})}static \u0275fac=function(i){return new(i||t)};static \u0275dir=se({type:t,selectors:[["","pInputText",""]],hostVars:3,hostBindings:function(i,o){i&1&&x("input",function(){return o.onInput()}),i&2&&(v("data-p",o.dataP),m(o.cx("root")))},inputs:{hostName:"hostName",ptInputText:[1,"ptInputText"],pInputTextPT:[1,"pInputTextPT"],pInputTextUnstyled:[1,"pInputTextUnstyled"],pSize:"pSize",variant:[1,"variant"],fluid:[1,"fluid"],invalid:[1,"invalid"]},features:[j([Wi,{provide:Zi,useExisting:t},{provide:q,useExisting:t}]),$([g]),w]})}return t})();var Qi=`
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
`;var rs=["content"],as=["*"],ss=t=>({closeCallback:t});function ls(t,n){}function cs(t,n){t&1&&h(0,ls,0,0,"ng-template")}function ds(t,n){if(t&1){let e=S();d(0,"div",1),x("click",function(o){b(e);let r=l();return y(r.onOverlayClick(o))})("pMotionOnEnter",function(o){b(e);let r=l();return y(r.onAnimationStart(o))})("pMotionOnAfterLeave",function(){b(e);let o=l();return y(o.onAnimationEnd())}),d(1,"div",2),x("click",function(o){b(e);let r=l();return y(r.onContentClick(o))})("mousedown",function(o){b(e);let r=l();return y(r.onContentClick(o))}),Z(2),h(3,cs,1,0,null,3),u()()}if(t&2){let e=l();me(e.sx("root")),m(e.cn(e.cx("root"),e.styleClass)),s("pBind",e.ptm("root"))("ngStyle",e.style)("pMotion",e.overlayVisible)("pMotionAppear",!0)("pMotionOptions",e.computedMotionOptions()),v("aria-modal",e.overlayVisible)("aria-label",e.ariaLabel)("aria-labelledBy",e.ariaLabelledBy),c(),m(e.cx("content")),s("pBind",e.ptm("content")),c(2),s("ngTemplateOutlet",e.contentTemplate||e._contentTemplate)("ngTemplateOutletContext",we(17,ss,e.onCloseClick.bind(e)))}}var us={root:()=>({position:"absolute"})},ps={root:"p-popover p-component",content:"p-popover-content"},Xi=(()=>{class t extends U{name="popover";style=Qi;classes=ps;inlineStyles=us;static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275prov=L({token:t,factory:t.\u0275fac})}return t})(),Ji=new P("POPOVER_INSTANCE"),Ip=(()=>{class t extends J{componentName="Popover";$pcPopover=p(Ji,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=p(g,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptm("host"))}ariaLabel;ariaLabelledBy;dismissable=!0;style;styleClass;appendTo=_("body");autoZIndex=!0;ariaCloseLabel;baseZIndex=0;focusOnShow=!0;showTransitionOptions=".12s cubic-bezier(0, 0, 0.2, 1)";hideTransitionOptions=".1s linear";motionOptions=_(void 0);computedMotionOptions=D(()=>A(A({},this.ptm("motion")),this.motionOptions()));onShow=new N;onHide=new N;$appendTo=D(()=>this.appendTo()||this.config.overlayAppendTo());container;overlayVisible=!1;render=!1;selfClick=!1;documentClickListener;target;willHide;scrollHandler;documentResizeListener;contentTemplate;templates;_contentTemplate;destroyCallback;overlayEventListener;overlaySubscription;_componentStyle=p(Xi);zone=p(_t);overlayService=p(vt);onAfterContentInit(){this.templates.forEach(e=>{e.getType()==="content"&&(this._contentTemplate=e.template)})}bindDocumentClickListener(){if(Qe(this.platformId)&&!this.documentClickListener){let e=On()?"touchstart":"click",i=this.el?this.el.nativeElement.ownerDocument:this.document;this.documentClickListener=this.renderer.listen(i,e,o=>{this.dismissable&&(!this.container?.contains(o.target)&&this.target!==o.target&&!this.target.contains(o.target)&&!this.selfClick&&this.hide(),this.selfClick=!1,this.cd.markForCheck())})}}unbindDocumentClickListener(){this.documentClickListener&&(this.documentClickListener(),this.documentClickListener=null,this.selfClick=!1)}toggle(e,i){this.overlayVisible?(this.hasTargetChanged(e,i)&&(this.destroyCallback=()=>{this.show(null,i||e.currentTarget||e.target)}),this.hide()):this.show(e,i)}show(e,i){i&&e&&e.stopPropagation(),this.container&&!this.overlayVisible&&(this.container=null),this.target=i||e.currentTarget||e.target,this.overlayVisible=!0,this.render=!0,this.cd.markForCheck()}onOverlayClick(e){this.overlayService.add({originalEvent:e,target:this.el.nativeElement}),this.selfClick=!0}onContentClick(e){let i=e.target;this.selfClick=e.offsetX<i.clientWidth&&e.offsetY<i.clientHeight}hasTargetChanged(e,i){return this.target!=null&&this.target!==(i||e.currentTarget||e.target)}appendOverlay(){this.$appendTo()&&this.$appendTo()!=="self"&&(this.$appendTo()==="body"?Xe(this.document.body,this.container):Xe(this.$appendTo(),this.container))}restoreAppend(){this.container&&this.$appendTo()&&this.$appendTo()!=="self"&&Xe(this.el.nativeElement,this.container)}setZIndex(){this.autoZIndex&&Te.set("overlay",this.container,this.baseZIndex+this.config.zIndex.overlay)}align(){if(this.target&&this.container){Nn(this.container,this.target,!1);let e=$t(this.container),i=$t(this.target),o=this.document.defaultView?.getComputedStyle(this.container).getPropertyValue("border-radius"),r=0;e.left<i.left&&(r=i.left-e.left-parseFloat(o)*2),this.container.style.setProperty(zn("popover.arrow.left").name,`${r}px`),e.top<i.top&&(this.container.setAttribute("data-p-popover-flipped","true"),!this.$unstyled()&&Pn(this.container,"p-popover-flipped"))}}onAnimationStart(e){this.container=e.element,this.container?.setAttribute(this.$attrSelector,""),this.appendOverlay(),this.align(),this.setZIndex(),this.bindDocumentClickListener(),this.bindDocumentResizeListener(),this.bindScrollListener(),this.focusOnShow&&this.focus(),this.overlayEventListener=i=>{this.container&&this.container.contains(i.target)&&(this.selfClick=!0)},this.overlaySubscription=this.overlayService.clickObservable.subscribe(this.overlayEventListener),this.onShow.emit(null)}onAnimationEnd(){this.overlayVisible||(this.destroyCallback&&(this.destroyCallback(),this.destroyCallback=null),this.overlaySubscription&&this.overlaySubscription.unsubscribe(),this.autoZIndex&&Te.clear(this.container),this.onContainerDestroy(),this.onHide.emit({}),this.render=!1,this.container=null)}focus(){let e=Fn(this.container,"[autofocus]");e&&this.zone.runOutsideAngular(()=>{setTimeout(()=>e.focus(),5)})}hide(){this.overlayVisible=!1,this.cd.markForCheck()}onCloseClick(e){this.hide(),e.preventDefault()}onEscapeKeydown(e){this.hide()}onWindowResize(){this.overlayVisible&&!Bn()&&this.hide()}bindDocumentResizeListener(){if(Qe(this.platformId)&&!this.documentResizeListener){let e=this.document.defaultView;this.documentResizeListener=this.renderer.listen(e,"resize",this.onWindowResize.bind(this))}}unbindDocumentResizeListener(){this.documentResizeListener&&(this.documentResizeListener(),this.documentResizeListener=null)}bindScrollListener(){Qe(this.platformId)&&(this.scrollHandler||(this.scrollHandler=new Ln(this.target,()=>{this.overlayVisible&&this.hide()})),this.scrollHandler.bindScrollListener())}unbindScrollListener(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()}onContainerDestroy(){this.cd.destroyed||(this.target=null),this.unbindDocumentClickListener(),this.unbindDocumentResizeListener(),this.unbindScrollListener()}onDestroy(){this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null),this.container&&this.autoZIndex&&Te.clear(this.container),this.cd.destroyed||(this.target=null),this.destroyCallback=null,this.container&&(this.restoreAppend(),this.onContainerDestroy()),this.overlaySubscription&&this.overlaySubscription.unsubscribe()}static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275cmp=k({type:t,selectors:[["p-popover"]],contentQueries:function(i,o,r){if(i&1&&le(r,rs,4)(r,te,4),i&2){let a;I(a=T())&&(o.contentTemplate=a.first),I(a=T())&&(o.templates=a)}},hostBindings:function(i,o){i&1&&x("keydown.escape",function(a){return o.onEscapeKeydown(a)},vn)},inputs:{ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy",dismissable:[2,"dismissable","dismissable",C],style:"style",styleClass:"styleClass",appendTo:[1,"appendTo"],autoZIndex:[2,"autoZIndex","autoZIndex",C],ariaCloseLabel:"ariaCloseLabel",baseZIndex:[2,"baseZIndex","baseZIndex",ke],focusOnShow:[2,"focusOnShow","focusOnShow",C],showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",motionOptions:[1,"motionOptions"]},outputs:{onShow:"onShow",onHide:"onHide"},features:[j([Xi,{provide:Ji,useExisting:t},{provide:q,useExisting:t}]),$([g]),w],ngContentSelectors:as,decls:1,vars:1,consts:[["role","dialog","pMotionName","p-anchored-overlay",3,"pBind","class","style","ngStyle","pMotion","pMotionAppear","pMotionOptions"],["role","dialog","pMotionName","p-anchored-overlay",3,"click","pMotionOnEnter","pMotionOnAfterLeave","pBind","ngStyle","pMotion","pMotionAppear","pMotionOptions"],[3,"click","mousedown","pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(i,o){i&1&&(ee(),O(0,ds,4,19,"div",0)),i&2&&B(o.render?0:-1)},dependencies:[W,ce,bt,X,g,Je,wt],encapsulation:2,changeDetection:0})}return t})();var ot=(()=>{class t extends At{required=_(void 0,{transform:C});invalid=_(void 0,{transform:C});disabled=_(void 0,{transform:C});name=_();_disabled=F(!1);$disabled=D(()=>this.disabled()||this._disabled());onModelChange=()=>{};onModelTouched=()=>{};writeDisabledState(e){this._disabled.set(e)}writeControlValue(e,i){}writeValue(e){this.writeControlValue(e,this.writeModelValue.bind(this))}registerOnChange(e){this.onModelChange=e}registerOnTouched(e){this.onModelTouched=e}setDisabledState(e){this.writeDisabledState(e),this.cd.markForCheck()}static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275dir=se({type:t,inputs:{required:[1,"required"],invalid:[1,"invalid"],disabled:[1,"disabled"],name:[1,"name"]},features:[w]})}return t})();var Ki=`
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
`;var ms=["handle"],hs=["input"],gs=t=>({checked:t});function fs(t,n){t&1&&ie(0)}function _s(t,n){if(t&1&&h(0,fs,1,0,"ng-container",3),t&2){let e=l();s("ngTemplateOutlet",e.handleTemplate||e._handleTemplate)("ngTemplateOutletContext",we(2,gs,e.checked()))}}var bs=`
    ${Ki}

    p-toggleswitch.ng-invalid.ng-dirty > .p-toggleswitch-slider {
        border-color: dt('toggleswitch.invalid.border.color');
    }
`,ys={root:{position:"relative"}},vs={root:({instance:t})=>["p-toggleswitch p-component",{"p-toggleswitch p-component":!0,"p-toggleswitch-checked":t.checked(),"p-disabled":t.$disabled(),"p-invalid":t.invalid()}],input:"p-toggleswitch-input",slider:"p-toggleswitch-slider",handle:"p-toggleswitch-handle"},eo=(()=>{class t extends U{name="toggleswitch";style=bs;classes=vs;inlineStyles=ys;static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275prov=L({token:t,factory:t.\u0275fac})}return t})();var to=new P("TOGGLESWITCH_INSTANCE"),Cs={provide:nt,useExisting:Le(()=>xs),multi:!0},xs=(()=>{class t extends ot{componentName="ToggleSwitch";$pcToggleSwitch=p(to,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=p(g,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}styleClass;tabindex;inputId;readonly;trueValue=!0;falseValue=!1;ariaLabel;size=_();ariaLabelledBy;autofocus;onChange=new N;input;handleTemplate;_handleTemplate;focused=!1;_componentStyle=p(eo);templates;onHostClick(e){this.onClick(e)}onAfterContentInit(){this.templates.forEach(e=>{e.getType()==="handle"?this._handleTemplate=e.template:this._handleTemplate=e.template})}onClick(e){!this.$disabled()&&!this.readonly&&(this.writeModelValue(this.checked()?this.falseValue:this.trueValue),this.onModelChange(this.modelValue()),this.onChange.emit({originalEvent:e,checked:this.modelValue()}),this.input.nativeElement.focus())}onFocus(){this.focused=!0}onBlur(){this.focused=!1,this.onModelTouched()}checked(){return this.modelValue()===this.trueValue}writeControlValue(e,i){i(e),this.cd.markForCheck()}get dataP(){return this.cn({checked:this.checked(),disabled:this.$disabled(),invalid:this.invalid()})}static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275cmp=k({type:t,selectors:[["p-toggleswitch"],["p-toggleSwitch"],["p-toggle-switch"]],contentQueries:function(i,o,r){if(i&1&&le(r,ms,4)(r,te,4),i&2){let a;I(a=T())&&(o.handleTemplate=a.first),I(a=T())&&(o.templates=a)}},viewQuery:function(i,o){if(i&1&&$e(hs,5),i&2){let r;I(r=T())&&(o.input=r.first)}},hostVars:7,hostBindings:function(i,o){i&1&&x("click",function(a){return o.onHostClick(a)}),i&2&&(v("data-p-checked",o.checked())("data-p-disabled",o.$disabled())("data-p",o.dataP),me(o.sx("root")),m(o.cn(o.cx("root"),o.styleClass)))},inputs:{styleClass:"styleClass",tabindex:[2,"tabindex","tabindex",ke],inputId:"inputId",readonly:[2,"readonly","readonly",C],trueValue:"trueValue",falseValue:"falseValue",ariaLabel:"ariaLabel",size:[1,"size"],ariaLabelledBy:"ariaLabelledBy",autofocus:[2,"autofocus","autofocus",C]},outputs:{onChange:"onChange"},features:[j([Cs,eo,{provide:to,useExisting:t},{provide:q,useExisting:t}]),$([g]),w],decls:5,vars:22,consts:[["input",""],["type","checkbox","role","switch",3,"focus","blur","checked","pAutoFocus","pBind"],[3,"pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(i,o){i&1&&(d(0,"input",1,0),x("focus",function(){return o.onFocus()})("blur",function(){return o.onBlur()}),u(),d(2,"div",2)(3,"div",2),O(4,_s,1,4,"ng-container"),u()()),i&2&&(m(o.cx("input")),s("checked",o.checked())("pAutoFocus",o.autofocus)("pBind",o.ptm("input")),v("id",o.inputId)("required",o.required()?"":void 0)("disabled",o.$disabled()?"":void 0)("aria-checked",o.checked())("aria-labelledby",o.ariaLabelledBy)("aria-label",o.ariaLabel)("name",o.name())("tabindex",o.tabindex),c(2),m(o.cx("slider")),s("pBind",o.ptm("slider")),v("data-p",o.dataP),c(),m(o.cx("handle")),s("pBind",o.ptm("handle")),v("data-p",o.dataP),c(),B(o.handleTemplate||o._handleTemplate?4:-1))},dependencies:[W,ce,jn,X,Ie,g],encapsulation:2,changeDetection:0})}return t})();function no(t){let n=new Map;for(let e of t){if(e.parentId===null)continue;let i=n.get(e.parentId)??[];i.push(e),n.set(e.parentId,i)}return n}function ws(t,n){let e=no(t),i=[],o=[...e.get(n)??[]];for(;o.length>0;){let r=o.shift();i.push(r.id),o.push(...e.get(r.id)??[])}return i}function rm(t,n,e){let i=new Set(e);return i.has(n)?i.delete(n):i.add(n),i}function am(t,n){let e=no(t),i=new Map;function o(r){let a=i.get(r.id);if(a)return a;if(n.has(r.id))return i.set(r.id,"checked"),"checked";let E=e.get(r.id)??[],M;if(E.length===0)M="unchecked";else{let Q=E.map(o),K=Q.every(oe=>oe==="checked"),de=Q.every(oe=>oe==="unchecked");M=K?"checked":de?"unchecked":"indeterminate"}return i.set(r.id,M),M}for(let r of t)o(r);return i}function sm(t,n){let e=new Set(t.filter(a=>a.parentId!==null).map(a=>a.parentId)),i=a=>!e.has(a.id),o=new Map(t.map(a=>[a.id,a])),r=new Set;for(let a of n){let E=o.get(a);if(E){if(i(E)){r.add(a);continue}for(let M of ws(t,a)){let Q=o.get(M);Q&&i(Q)&&r.add(M)}}}return[...r]}function lm(t,n,e){if(e.length===0)return new Set(t.map(a=>a.id));let i=e.toLowerCase(),o=new Map(t.map(a=>[a.id,a])),r=new Set;for(let a of t){if(!n(a.id).toLowerCase().includes(i))continue;let M=a;for(;M;)r.add(M.id),M=M.parentId!==null?o.get(M.parentId):void 0}return r}function cm(t,n){if(n.length===0)return null;let e=t.toLowerCase().indexOf(n.toLowerCase());return e===-1?null:{before:t.slice(0,e),match:t.slice(e,e+n.length),after:t.slice(e+n.length)}}var Ms=(t,n)=>n[0].iso,ao=(t,n)=>n.iso;function ks(t,n){if(t&1){let e=S();R(0,"button",15),Se("click",function(){let o=b(e).$implicit,r=l(2);return y(r.jumpToMonth(o))}),Y(1),G()}if(t&2){let e=n.$implicit,i=l(2);be("is-active",e===i.viewedMonth()),xe("disabled",i.isMonthDisabled(e)),c(),qe(" ",i.monthLabels[e-1].slice(0,3)," ")}}function Ds(t,n){if(t&1){let e=S();R(0,"div",8)(1,"div",9)(2,"button",10),Se("click",function(){b(e);let o=l();return y(o.jumpPrevYear())}),V(),R(3,"svg",3),ne(4,"polyline",4),G()(),je(),R(5,"span",11),Y(6),G(),R(7,"button",12),Se("click",function(){b(e);let o=l();return y(o.jumpNextYear())}),V(),R(8,"svg",3),ne(9,"polyline",7),G()()(),je(),R(10,"div",13),ve(11,ks,2,4,"button",14,zt),G()()}if(t&2){let e=l();c(2),xe("disabled",!e.canJumpPrevYear()),c(4),he(e.viewedYear()),c(),xe("disabled",!e.canJumpNextYear()),c(4),Ce(e.monthNumbers)}}function Is(t,n){if(t&1&&(R(0,"span",17),Y(1),G()),t&2){let e=n.$implicit;c(),he(e)}}function Ts(t,n){if(t&1){let e=S();R(0,"button",22),Se("click",function(o){let r=b(e).$implicit,a=l(4);return y(a.toggle(r,o))}),Y(1),G()}if(t&2){let e=n.$implicit,i=l(4);be("is-outside",!e.inMonth)("is-selected",i.isSelected(e)),c(),qe(" ",i.dayNumber(e)," ")}}function Es(t,n){if(t&1&&(R(0,"div",19),ve(1,Ts,2,5,"button",21,ao),G()),t&2){let e=l().$implicit;c(),Ce(e)}}function Ss(t,n){if(t&1&&(R(0,"span",25),Y(1),G()),t&2){let e=n.$implicit,i=l(4);be("is-outside",!e.inMonth),c(),qe(" ",i.dayNumber(e)," ")}}function Vs(t,n){if(t&1){let e=S();R(0,"button",23),Se("click",function(o){b(e);let r=l().$implicit,a=l(2);return y(a.toggle(r[0],o))}),ve(1,Ss,2,3,"span",24,ao),G()}if(t&2){let e=l().$implicit,i=l(2);be("is-selected",i.isSelected(e[0])),c(),Ce(e)}}function As(t,n){if(t&1&&O(0,Es,3,0,"div",19)(1,Vs,3,2,"button",20),t&2){let e=l(2);B(e.granularity()==="dia"?0:1)}}function Ps(t,n){if(t&1&&(R(0,"div",16),ve(1,Is,2,1,"span",17,zt),G(),R(3,"div",18),ve(4,As,2,1,null,null,Ms),G()),t&2){let e=l();c(),Ce(e.weekdayLabels),c(3),Ce(e.weeks())}}var Pt=Oe[0].year,io=Oe[0].month,Nt=Oe[Oe.length-1].year,oo=Oe[Oe.length-1].month,ro={year:2026,month:7},Ns=["L","M","X","J","V","S","D"],Fs=Array.from({length:12},(t,n)=>n+1),rt=class t{granularity=_.required();selectedIds=ye.required();viewedYear=F(ro.year);viewedMonth=F(ro.month);showMonthJump=F(!1);weekdayLabels=Ns;monthLabels=ut;monthNumbers=Fs;monthLabel=D(()=>`${ut[this.viewedMonth()-1]} ${this.viewedYear()}`);weeks=D(()=>ei(this.viewedYear(),this.viewedMonth()));canPrevMonth=D(()=>this.viewedYear()>Pt||this.viewedYear()===Pt&&this.viewedMonth()>io);canNextMonth=D(()=>this.viewedYear()<Nt||this.viewedYear()===Nt&&this.viewedMonth()<oo);canJumpPrevYear=D(()=>this.viewedYear()>Pt);canJumpNextYear=D(()=>this.viewedYear()<Nt);prevMonth(){this.canPrevMonth()&&(this.viewedMonth()===1?(this.viewedYear.update(n=>n-1),this.viewedMonth.set(12)):this.viewedMonth.update(n=>n-1))}nextMonth(){this.canNextMonth()&&(this.viewedMonth()===12?(this.viewedYear.update(n=>n+1),this.viewedMonth.set(1)):this.viewedMonth.update(n=>n+1))}toggleMonthJump(){this.showMonthJump.update(n=>!n)}jumpPrevYear(){this.canJumpPrevYear()&&this.viewedYear.update(n=>n-1)}jumpNextYear(){this.canJumpNextYear()&&this.viewedYear.update(n=>n+1)}isMonthDisabled(n){return this.viewedYear()===Pt&&n<io||this.viewedYear()===Nt&&n>oo}jumpToMonth(n){this.isMonthDisabled(n)||(this.viewedMonth.set(n),this.showMonthJump.set(!1))}dayNumber(n){return Number(n.iso.slice(8,10))}idFor(n){return this.granularity()==="dia"?n:oi.get(n)??""}isSelected(n){let e=this.idFor(n.iso);return e!==""&&this.selectedIds().has(e)}rangeAnchorIso=F(null);toggle(n,e){if(this.granularity()==="dia"&&!n.inMonth)return;let i=this.rangeAnchorIso();if(e?.shiftKey&&i){this.selectRange(i,n.iso);return}let o=this.idFor(n.iso);if(!o)return;let r=new Set(this.selectedIds());r.has(o)?r.delete(o):r.add(o),this.selectedIds.set(r),this.rangeAnchorIso.set(n.iso)}selectRange(n,e){let[i,o]=n<=e?[n,e]:[e,n],r=Kn(i,o),a=new Set(this.selectedIds());for(let E=0;E<=r;E++){let M=this.idFor(ge(i,E));M&&a.add(M)}this.selectedIds.set(a)}static \u0275fac=function(e){return new(e||t)};static \u0275cmp=k({type:t,selectors:[["app-calendar-period-picker"]],inputs:{granularity:[1,"granularity"],selectedIds:[1,"selectedIds"]},outputs:{selectedIds:"selectedIdsChange"},decls:12,vars:4,consts:[[1,"calendar"],[1,"calendar-header"],["type","button","aria-label","Mes anterior",1,"calendar-nav-btn",3,"click","disabled"],["width","16","height","16","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round"],["points","15 18 9 12 15 6"],["type","button",1,"calendar-month-label",3,"click"],["type","button","aria-label","Mes siguiente",1,"calendar-nav-btn",3,"click","disabled"],["points","9 18 15 12 9 6"],[1,"calendar-month-jump"],[1,"calendar-month-jump-year-nav"],["type","button","aria-label","A\xF1o anterior",1,"calendar-nav-btn",3,"click","disabled"],[1,"calendar-year-label"],["type","button","aria-label","A\xF1o siguiente",1,"calendar-nav-btn",3,"click","disabled"],[1,"calendar-month-jump-grid"],["type","button",1,"calendar-month-jump-item",3,"is-active","disabled"],["type","button",1,"calendar-month-jump-item",3,"click","disabled"],[1,"calendar-weekdays"],[1,"calendar-weekday"],[1,"calendar-weeks"],[1,"calendar-row"],["type","button",1,"calendar-row","calendar-row--week",3,"is-selected"],["type","button",1,"calendar-cell",3,"is-outside","is-selected"],["type","button",1,"calendar-cell",3,"click"],["type","button",1,"calendar-row","calendar-row--week",3,"click"],[1,"calendar-cell","calendar-cell--week",3,"is-outside"],[1,"calendar-cell","calendar-cell--week"]],template:function(e,i){e&1&&(R(0,"div",0)(1,"div",1)(2,"button",2),Se("click",function(){return i.prevMonth()}),V(),R(3,"svg",3),ne(4,"polyline",4),G()(),je(),R(5,"button",5),Se("click",function(){return i.toggleMonthJump()}),Y(6),G(),R(7,"button",6),Se("click",function(){return i.nextMonth()}),V(),R(8,"svg",3),ne(9,"polyline",7),G()()(),O(10,Ds,13,3,"div",8)(11,Ps,6,0),G()),e&2&&(c(2),xe("disabled",!i.canPrevMonth()),c(4),he(i.monthLabel()),c(),xe("disabled",!i.canNextMonth()),c(3),B(i.showMonthJump()?10:11))},styles:["[_nghost-%COMP%]{display:block}.calendar[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.75rem;width:100%}.calendar-header[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;gap:.5rem}.calendar-nav-btn[_ngcontent-%COMP%]{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;width:2rem;height:2rem;border:none;border-radius:999px;background:transparent;color:var(--p-text-muted-color);cursor:pointer}.calendar-nav-btn[_ngcontent-%COMP%]:hover:not(:disabled){background:var(--p-surface-100);color:var(--p-text-color)}.calendar-nav-btn[_ngcontent-%COMP%]:disabled{opacity:.35;cursor:default}.calendar-month-label[_ngcontent-%COMP%]{flex:1;min-width:0;border:none;background:transparent;padding:.375rem .5rem;border-radius:var(--p-border-radius-md);font-size:.9375rem;font-weight:600;color:var(--p-text-color);text-align:center;cursor:pointer}.calendar-month-label[_ngcontent-%COMP%]:hover{background:var(--p-surface-100)}.calendar-weekdays[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(7,1fr)}.calendar-weekday[_ngcontent-%COMP%]{text-align:center;font-size:.6875rem;font-weight:600;letter-spacing:.02em;text-transform:uppercase;color:var(--p-text-muted-color)}.calendar-weeks[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.25rem}.calendar-row[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(7,1fr);gap:.25rem}.calendar-row--week[_ngcontent-%COMP%]{border:1px solid transparent;border-radius:var(--p-border-radius-md);background:transparent;padding:.125rem 0;cursor:pointer}.calendar-row--week[_ngcontent-%COMP%]:hover{background:var(--p-surface-100)}.calendar-row--week.is-selected[_ngcontent-%COMP%]{background:var(--p-primary-color)}.calendar-row--week.is-selected[_ngcontent-%COMP%]:hover{background:var(--p-primary-hover-color)}.calendar-cell[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;aspect-ratio:1;border:none;border-radius:999px;background:transparent;font-size:.8125rem;color:var(--p-text-color);cursor:pointer}button.calendar-cell[_ngcontent-%COMP%]:hover{background:var(--p-surface-100)}.calendar-cell.is-outside[_ngcontent-%COMP%]{color:var(--p-text-muted-color);opacity:.5;cursor:default}.calendar-cell.is-selected[_ngcontent-%COMP%]{background:var(--p-primary-color);color:var(--p-primary-contrast-color)}.calendar-cell--week[_ngcontent-%COMP%]{border-radius:0;color:inherit}.calendar-row--week.is-selected[_ngcontent-%COMP%]   .calendar-cell--week[_ngcontent-%COMP%]{color:var(--p-primary-contrast-color)}.calendar-month-jump[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.75rem}.calendar-month-jump-year-nav[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;gap:.75rem}.calendar-year-label[_ngcontent-%COMP%]{min-width:3.5rem;text-align:center;font-size:1rem;font-weight:600;color:var(--p-text-color)}.calendar-month-jump-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem}.calendar-month-jump-item[_ngcontent-%COMP%]{padding:.5rem;border:1px solid var(--p-content-border-color);border-radius:var(--p-border-radius-md);background:var(--p-surface-0);font-size:.8125rem;color:var(--p-text-color);cursor:pointer}.calendar-month-jump-item[_ngcontent-%COMP%]:hover:not(:disabled){background:var(--p-surface-100);border-color:var(--p-primary-color)}.calendar-month-jump-item.is-active[_ngcontent-%COMP%]{background:var(--p-primary-color);border-color:var(--p-primary-color);color:var(--p-primary-contrast-color)}.calendar-month-jump-item[_ngcontent-%COMP%]:disabled{opacity:.4;cursor:default}@media(max-width:380px){.calendar-cell[_ngcontent-%COMP%]{font-size:.75rem}.calendar-weekday[_ngcontent-%COMP%]{font-size:.625rem}}"],changeDetection:0})};var so=`
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
`;var Os=["icon"],Bs=["input"],zs=(t,n,e)=>({checked:t,class:n,dataP:e});function Rs(t,n){if(t&1&&z(0,"span",8),t&2){let e=l(3);m(e.cx("icon")),s("ngClass",e.checkboxIcon)("pBind",e.ptm("icon")),v("data-p",e.dataP)}}function Ls(t,n){if(t&1&&(V(),z(0,"svg",9)),t&2){let e=l(3);m(e.cx("icon")),s("pBind",e.ptm("icon")),v("data-p",e.dataP)}}function js(t,n){if(t&1&&(fe(0),h(1,Rs,1,5,"span",6)(2,Ls,1,4,"svg",7),_e()),t&2){let e=l(2);c(),s("ngIf",e.checkboxIcon),c(),s("ngIf",!e.checkboxIcon)}}function Hs(t,n){if(t&1&&(V(),z(0,"svg",10)),t&2){let e=l(2);m(e.cx("icon")),s("pBind",e.ptm("icon")),v("data-p",e.dataP)}}function Gs(t,n){if(t&1&&(fe(0),h(1,js,3,2,"ng-container",3)(2,Hs,1,4,"svg",5),_e()),t&2){let e=l();c(),s("ngIf",e.checked),c(),s("ngIf",e._indeterminate())}}function $s(t,n){}function Us(t,n){t&1&&h(0,$s,0,0,"ng-template")}var qs=`
    ${so}

    /* For PrimeNG */
    p-checkBox.ng-invalid.ng-dirty .p-checkbox-box,
    p-check-box.ng-invalid.ng-dirty .p-checkbox-box,
    p-checkbox.ng-invalid.ng-dirty .p-checkbox-box {
        border-color: dt('checkbox.invalid.border.color');
    }
`,Ys={root:({instance:t})=>["p-checkbox p-component",{"p-checkbox-checked p-highlight":t.checked,"p-disabled":t.$disabled(),"p-invalid":t.invalid(),"p-variant-filled":t.$variant()==="filled","p-checkbox-sm p-inputfield-sm":t.size()==="small","p-checkbox-lg p-inputfield-lg":t.size()==="large"}],box:"p-checkbox-box",input:"p-checkbox-input",icon:"p-checkbox-icon"},lo=(()=>{class t extends U{name="checkbox";style=qs;classes=Ys;static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275prov=L({token:t,factory:t.\u0275fac})}return t})();var co=new P("CHECKBOX_INSTANCE"),Ws={provide:nt,useExisting:Le(()=>sn),multi:!0},sn=(()=>{class t extends ot{componentName="Checkbox";hostName="";value;binary;ariaLabelledBy;ariaLabel;tabindex;inputId;inputStyle;styleClass;inputClass;indeterminate=!1;formControl;checkboxIcon;readonly;autofocus;trueValue=!0;falseValue=!1;variant=_();size=_();onChange=new N;onFocus=new N;onBlur=new N;inputViewChild;get checked(){return this._indeterminate()?!1:this.binary?this.modelValue()===this.trueValue:Vn(this.value,this.modelValue())}_indeterminate=F(void 0);checkboxIconTemplate;templates;_checkboxIconTemplate;focused=!1;_componentStyle=p(lo);bindDirectiveInstance=p(g,{self:!0});$pcCheckbox=p(co,{optional:!0,skipSelf:!0})??void 0;$variant=D(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());onAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"icon":this._checkboxIconTemplate=e.template;break;case"checkboxicon":this._checkboxIconTemplate=e.template;break}})}onChanges(e){e.indeterminate&&this._indeterminate.set(e.indeterminate.currentValue)}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}updateModel(e){let i,o=this.injector.get(Ve,null,{optional:!0,self:!0}),r=o&&!this.formControl?o.value:this.modelValue();this.binary?(i=this._indeterminate()?this.trueValue:this.checked?this.falseValue:this.trueValue,this.writeModelValue(i),this.onModelChange(i)):(this.checked||this._indeterminate()?i=r.filter(a=>!Sn(a,this.value)):i=r?[...r,this.value]:[this.value],this.onModelChange(i),this.writeModelValue(i),this.formControl&&this.formControl.setValue(i)),this._indeterminate()&&this._indeterminate.set(!1),this.onChange.emit({checked:i,originalEvent:e})}handleChange(e){this.readonly||this.updateModel(e)}onInputFocus(e){this.focused=!0,this.onFocus.emit(e)}onInputBlur(e){this.focused=!1,this.onBlur.emit(e),this.onModelTouched()}focus(){this.inputViewChild?.nativeElement.focus()}writeControlValue(e,i){i(e),this.cd.markForCheck()}get dataP(){return this.cn({invalid:this.invalid(),checked:this.checked,disabled:this.$disabled(),filled:this.$variant()==="filled",[this.size()]:this.size()})}static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275cmp=k({type:t,selectors:[["p-checkbox"],["p-checkBox"],["p-check-box"]],contentQueries:function(i,o,r){if(i&1&&le(r,Os,4)(r,te,4),i&2){let a;I(a=T())&&(o.checkboxIconTemplate=a.first),I(a=T())&&(o.templates=a)}},viewQuery:function(i,o){if(i&1&&$e(Bs,5),i&2){let r;I(r=T())&&(o.inputViewChild=r.first)}},hostVars:6,hostBindings:function(i,o){i&2&&(v("data-p-highlight",o.checked)("data-p-checked",o.checked)("data-p-disabled",o.$disabled())("data-p",o.dataP),m(o.cn(o.cx("root"),o.styleClass)))},inputs:{hostName:"hostName",value:"value",binary:[2,"binary","binary",C],ariaLabelledBy:"ariaLabelledBy",ariaLabel:"ariaLabel",tabindex:[2,"tabindex","tabindex",ke],inputId:"inputId",inputStyle:"inputStyle",styleClass:"styleClass",inputClass:"inputClass",indeterminate:[2,"indeterminate","indeterminate",C],formControl:"formControl",checkboxIcon:"checkboxIcon",readonly:[2,"readonly","readonly",C],autofocus:[2,"autofocus","autofocus",C],trueValue:"trueValue",falseValue:"falseValue",variant:[1,"variant"],size:[1,"size"]},outputs:{onChange:"onChange",onFocus:"onFocus",onBlur:"onBlur"},features:[j([Ws,lo,{provide:co,useExisting:t},{provide:q,useExisting:t}]),$([g]),w],decls:5,vars:26,consts:[["input",""],["type","checkbox",3,"focus","blur","change","checked","pBind"],[3,"pBind"],[4,"ngIf"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["data-p-icon","minus",3,"class","pBind",4,"ngIf"],[3,"class","ngClass","pBind",4,"ngIf"],["data-p-icon","check",3,"class","pBind",4,"ngIf"],[3,"ngClass","pBind"],["data-p-icon","check",3,"pBind"],["data-p-icon","minus",3,"pBind"]],template:function(i,o){i&1&&(d(0,"input",1,0),x("focus",function(a){return o.onInputFocus(a)})("blur",function(a){return o.onInputBlur(a)})("change",function(a){return o.handleChange(a)}),u(),d(2,"div",2),h(3,Gs,3,2,"ng-container",3)(4,Us,1,0,null,4),u()),i&2&&(me(o.inputStyle),m(o.cn(o.cx("input"),o.inputClass)),s("checked",o.checked)("pBind",o.ptm("input")),v("id",o.inputId)("value",o.value)("name",o.name())("tabindex",o.tabindex)("required",o.required()?"":void 0)("readonly",o.readonly?"":void 0)("disabled",o.$disabled()?"":void 0)("aria-labelledby",o.ariaLabelledBy)("aria-label",o.ariaLabel),c(2),m(o.cx("box")),s("pBind",o.ptm("box")),v("data-p",o.dataP),c(),s("ngIf",!o.checkboxIconTemplate&&!o._checkboxIconTemplate),c(),s("ngTemplateOutlet",o.checkboxIconTemplate||o._checkboxIconTemplate)("ngTemplateOutletContext",kn(22,zs,o.checked,o.cx("icon"),o.dataP)))},dependencies:[W,Pe,De,ce,X,Hn,Vi,Ie,g],encapsulation:2,changeDetection:0})}return t})();var Zs=(t,n)=>n.id;function Qs(t,n){t&1&&(V(),d(0,"svg",12),z(1,"polyline",14),u())}function Xs(t,n){if(t&1){let e=S();d(0,"label",10)(1,"p-checkbox",11),x("onChange",function(){let o=b(e).$implicit,r=l();return y(r.toggle(o.id))}),u(),O(2,Qs,2,0,":svg:svg",12),d(3,"span",13),Y(4),u()()}if(t&2){let e=n.$implicit,i=l();be("is-active",i.isSelected(e.id)),c(),s("binary",!0)("ngModel",i.isSelected(e.id)),c(),B(i.isSelected(e.id)?2:-1),c(2),he(e.label)}}var Js=ji(Be),Ks=Math.min(...Be.map(t=>t.year)),el=Math.max(...Be.map(t=>t.year)),at=class t{selectedIds=ye.required();viewedYear=F(2026);viewedYearPeriods=D(()=>(Js.get(this.viewedYear())??[]).slice().sort((n,e)=>n.order-e.order));canGoPrevYear=D(()=>this.viewedYear()>Ks);canGoNextYear=D(()=>this.viewedYear()<el);goPrevYear(){this.canGoPrevYear()&&this.viewedYear.update(n=>n-1)}goNextYear(){this.canGoNextYear()&&this.viewedYear.update(n=>n+1)}isSelected(n){return this.selectedIds().has(n)}toggle(n){let e=new Set(this.selectedIds());e.has(n)?e.delete(n):e.add(n),this.selectedIds.set(e)}static \u0275fac=function(e){return new(e||t)};static \u0275cmp=k({type:t,selectors:[["app-month-period-picker"]],inputs:{selectedIds:[1,"selectedIds"]},outputs:{selectedIds:"selectedIdsChange"},decls:13,vars:7,consts:[[1,"month-picker"],[1,"month-picker-year-nav"],["severity","secondary","ariaLabel","A\xF1o anterior",3,"onClick","text","rounded","disabled"],["width","16","height","16","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","2","stroke-linecap","round","stroke-linejoin","round"],["points","15 18 9 12 15 6"],[1,"month-picker-year-label"],["severity","secondary","ariaLabel","A\xF1o siguiente",3,"onClick","text","rounded","disabled"],["points","9 18 15 12 9 6"],[1,"month-picker-grid"],[1,"month-chip",3,"is-active"],[1,"month-chip"],[1,"month-chip-input",3,"onChange","binary","ngModel"],["width","12","height","12","viewBox","0 0 24 24","fill","none","stroke","currentColor","stroke-width","3","stroke-linecap","round","stroke-linejoin","round",1,"month-chip-check"],[1,"month-chip-label"],["points","20 6 9 17 4 12"]],template:function(e,i){e&1&&(d(0,"div",0)(1,"div",1)(2,"p-button",2),x("onClick",function(){return i.goPrevYear()}),V(),d(3,"svg",3),z(4,"polyline",4),u()(),je(),d(5,"span",5),Y(6),u(),d(7,"p-button",6),x("onClick",function(){return i.goNextYear()}),V(),d(8,"svg",3),z(9,"polyline",7),u()()(),je(),d(10,"div",8),ve(11,Xs,5,6,"label",9,Zs),u()()),e&2&&(c(2),s("text",!0)("rounded",!0)("disabled",!i.canGoPrevYear()),c(4),he(i.viewedYear()),c(),s("text",!0)("rounded",!0)("disabled",!i.canGoNextYear()),c(4),Ce(i.viewedYearPeriods()))},dependencies:[Fe,sn,Vt,wi,rn],styles:["[_nghost-%COMP%]{display:block}.month-picker[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.625rem;width:100%}.month-picker-year-nav[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;gap:.75rem}.month-picker-year-label[_ngcontent-%COMP%]{min-width:3.5rem;text-align:center;font-size:1rem;font-weight:600;color:var(--p-text-color)}.month-picker-grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem}.month-chip[_ngcontent-%COMP%]{position:relative;display:inline-flex;align-items:center;justify-content:center;gap:.375rem;padding:.375rem .75rem;border-radius:999px;border:1px solid var(--p-content-border-color);background:var(--p-surface-0);color:var(--p-text-color);font-size:.8125rem;font-weight:500;line-height:1.4;cursor:pointer;-webkit-user-select:none;user-select:none;transition:background-color .15s ease,border-color .15s ease,color .15s ease,transform .1s ease-out}.month-chip[_ngcontent-%COMP%]:active{transform:scale(.96)}.month-chip-check[_ngcontent-%COMP%]{flex-shrink:0}.month-chip[_ngcontent-%COMP%]:hover{background:var(--p-surface-100);border-color:var(--p-primary-color)}.month-chip.is-active[_ngcontent-%COMP%]{background:var(--p-primary-color);border-color:var(--p-primary-color);color:var(--p-primary-contrast-color)}.month-chip.is-active[_ngcontent-%COMP%]:hover{background:var(--p-primary-hover-color);border-color:var(--p-primary-hover-color)}.month-chip[_ngcontent-%COMP%]:focus-within{outline:2px solid var(--p-primary-color);outline-offset:2px}.month-chip-input[_ngcontent-%COMP%]{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}"],changeDetection:0})};function tl(t,n){if(t&1){let e=S();d(0,"div",1)(1,"span",2),Y(2,"Alinear por"),u(),d(3,"div",3)(4,"p-button",7),x("onClick",function(){b(e);let o=l();return y(o.alignment.set("calendario"))}),u(),d(5,"p-button",8),x("onClick",function(){b(e);let o=l();return y(o.alignment.set("dia_semana"))}),u()()()}if(t&2){let e=l();c(4),s("outlined",e.alignment()!=="calendario"),c(),s("outlined",e.alignment()!=="dia_semana")}}function nl(t,n){if(t&1){let e=S();d(0,"app-month-period-picker",11),Ze("selectedIdsChange",function(o){b(e);let r=l(2);return We(r.explicitPeriodIds,o)||(r.explicitPeriodIds=o),y(o)}),u()}if(t&2){let e=l(2);Ye("selectedIds",e.explicitPeriodIds)}}function il(t,n){if(t&1){let e=S();d(0,"app-calendar-period-picker",12),Ze("selectedIdsChange",function(o){b(e);let r=l(2);return We(r.explicitPeriodIds,o)||(r.explicitPeriodIds=o),y(o)}),u()}if(t&2){let e=l(2);s("granularity",e.granularity()),Ye("selectedIds",e.explicitPeriodIds)}}function ol(t,n){if(t&1&&(d(0,"div",1),O(1,nl,1,1,"app-month-period-picker",9)(2,il,1,2,"app-calendar-period-picker",10),u()),t&2){let e=l();c(),B(e.granularity()==="mes"?1:2)}}var uo=class t{granularity=_.required();mode=ye.required();alignment=ye.required();explicitPeriodIds=ye.required();showAlignment=D(()=>this.mode()==="periodo_anterior"&&this.granularity()!=="mes");showExplicitPicker=D(()=>this.mode()==="periodo_especifico");static \u0275fac=function(e){return new(e||t)};static \u0275cmp=k({type:t,selectors:[["app-comparison-selector"]],inputs:{granularity:[1,"granularity"],mode:[1,"mode"],alignment:[1,"alignment"],explicitPeriodIds:[1,"explicitPeriodIds"]},outputs:{mode:"modeChange",alignment:"alignmentChange",explicitPeriodIds:"explicitPeriodIdsChange"},decls:10,vars:5,consts:[[1,"comparison-selector-panel"],[1,"comparison-selector-section"],[1,"comparison-selector-section-label"],[1,"comparison-selector-mode-list"],["label","Periodo Anterior","size","small","severity","secondary",3,"onClick","outlined"],["label","Periodo Espec\xEDfico","size","small","severity","secondary",3,"onClick","outlined"],["label","Meta","size","small","severity","secondary",3,"onClick","outlined"],["label","Fecha calendario","size","small","severity","secondary",3,"onClick","outlined"],["label","D\xEDa de semana","size","small","severity","secondary",3,"onClick","outlined"],[3,"selectedIds"],[3,"granularity","selectedIds"],[3,"selectedIdsChange","selectedIds"],[3,"selectedIdsChange","granularity","selectedIds"]],template:function(e,i){e&1&&(d(0,"div",0)(1,"div",1)(2,"span",2),Y(3,"Comparar contra"),u(),d(4,"div",3)(5,"p-button",4),x("onClick",function(){return i.mode.set("periodo_anterior")}),u(),d(6,"p-button",5),x("onClick",function(){return i.mode.set("periodo_especifico")}),u(),d(7,"p-button",6),x("onClick",function(){return i.mode.set("meta")}),u()()(),O(8,tl,6,2,"div",1),O(9,ol,3,1,"div",1),u()),e&2&&(c(5),s("outlined",i.mode()!=="periodo_anterior"),c(),s("outlined",i.mode()!=="periodo_especifico"),c(),s("outlined",i.mode()!=="meta"),c(),B(i.showAlignment()?8:-1),c(),B(i.showExplicitPicker()?9:-1))},dependencies:[Fe,rt,Vt,at],styles:["[_nghost-%COMP%]{display:block}.comparison-selector-panel[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:1.125rem;width:100%}.comparison-selector-section[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.625rem}.comparison-selector-section-label[_ngcontent-%COMP%]{font-size:.75rem;font-weight:600;letter-spacing:.02em;text-transform:uppercase;color:var(--p-text-muted-color)}.comparison-selector-mode-list[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;gap:.5rem}"],changeDetection:0})};var po=`
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
`;var rl=["*"],al={root:({instance:t})=>["p-iconfield",{"p-iconfield-left":t.iconPosition=="left","p-iconfield-right":t.iconPosition=="right"}]},mo=(()=>{class t extends U{name="iconfield";style=po;classes=al;static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275prov=L({token:t,factory:t.\u0275fac})}return t})();var ho=new P("ICONFIELD_INSTANCE"),bh=(()=>{class t extends J{componentName="IconField";hostName="";_componentStyle=p(mo);$pcIconField=p(ho,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=p(g,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}iconPosition="left";styleClass;static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275cmp=k({type:t,selectors:[["p-iconfield"],["p-iconField"],["p-icon-field"]],hostVars:2,hostBindings:function(i,o){i&2&&m(o.cn(o.cx("root"),o.styleClass))},inputs:{hostName:"hostName",iconPosition:"iconPosition",styleClass:"styleClass"},features:[j([mo,{provide:ho,useExisting:t},{provide:q,useExisting:t}]),$([g]),w],ngContentSelectors:rl,decls:1,vars:0,template:function(i,o){i&1&&(ee(),Z(0))},dependencies:[W,Ie],encapsulation:2,changeDetection:0})}return t})();var sl=["*"],ll={root:"p-inputicon"},go=(()=>{class t extends U{name="inputicon";classes=ll;static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275prov=L({token:t,factory:t.\u0275fac})}return t})(),fo=new P("INPUTICON_INSTANCE"),Ah=(()=>{class t extends J{componentName="InputIcon";hostName="";styleClass;_componentStyle=p(go);$pcInputIcon=p(fo,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=p(g,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275cmp=k({type:t,selectors:[["p-inputicon"],["p-inputIcon"]],hostVars:2,hostBindings:function(i,o){i&2&&m(o.cn(o.cx("root"),o.styleClass))},inputs:{hostName:"hostName",styleClass:"styleClass"},features:[j([go,{provide:fo,useExisting:t},{provide:q,useExisting:t}]),$([g]),w],ngContentSelectors:sl,decls:1,vars:0,template:function(i,o){i&1&&(ee(),Z(0))},dependencies:[W,X,Ie],encapsulation:2,changeDetection:0})}return t})();var _o={retail:{sector:"Sectores",marca:"Marcas",tienda:"Tiendas",contraparte:"Recaudador"}};function cl(t){return t.charAt(0).toUpperCase()+t.slice(1)}function bo(t,n,e){return n?.[t]??e[t]??cl(t)}var yo=class t{currentUser=qn;labelFor(n){return bo(n,this.currentUser.vocabularyOverrides,_o[this.currentUser.rubro])}static \u0275fac=function(e){return new(e||t)};static \u0275prov=L({token:t,factory:t.\u0275fac,providedIn:"root"})};function dl(t,n){if(t&1){let e=S();d(0,"app-month-period-picker",7),Ze("selectedIdsChange",function(o){b(e);let r=l();return We(r.periodIds,o)||(r.periodIds=o),y(o)}),u()}if(t&2){let e=l();Ye("selectedIds",e.periodIds)}}function ul(t,n){if(t&1){let e=S();d(0,"app-calendar-period-picker",8),Ze("selectedIdsChange",function(o){b(e);let r=l();return We(r.periodIds,o)||(r.periodIds=o),y(o)}),u()}if(t&2){let e=l();s("granularity",e.granularity()),Ye("selectedIds",e.periodIds)}}var vo=class t{granularity=ye.required();periodIds=ye.required();setGranularity(n){n!==this.granularity()&&(this.granularity.set(n),this.periodIds.set(new Set))}static \u0275fac=function(e){return new(e||t)};static \u0275cmp=k({type:t,selectors:[["app-period-picker"]],inputs:{granularity:[1,"granularity"],periodIds:[1,"periodIds"]},outputs:{granularity:"granularityChange",periodIds:"periodIdsChange"},decls:7,vars:4,consts:[[1,"period-picker-panel"],[1,"period-picker-section","period-picker-granularity"],["label","D\xEDa","size","small","severity","secondary",3,"onClick","outlined"],["label","Semana","size","small","severity","secondary",3,"onClick","outlined"],["label","Mes","size","small","severity","secondary",3,"onClick","outlined"],[3,"selectedIds"],[3,"granularity","selectedIds"],[3,"selectedIdsChange","selectedIds"],[3,"selectedIdsChange","granularity","selectedIds"]],template:function(e,i){e&1&&(d(0,"div",0)(1,"div",1)(2,"p-button",2),x("onClick",function(){return i.setGranularity("dia")}),u(),d(3,"p-button",3),x("onClick",function(){return i.setGranularity("semana")}),u(),d(4,"p-button",4),x("onClick",function(){return i.setGranularity("mes")}),u()(),O(5,dl,1,1,"app-month-period-picker",5)(6,ul,1,2,"app-calendar-period-picker",6),u()),e&2&&(c(2),s("outlined",i.granularity()!=="dia"),c(),s("outlined",i.granularity()!=="semana"),c(),s("outlined",i.granularity()!=="mes"),c(),B(i.granularity()==="mes"?5:6))},dependencies:[Fe,rt,at],styles:["[_nghost-%COMP%]{display:block}.period-picker-panel[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:1.125rem;width:100%}.period-picker-section[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.625rem}.period-picker-granularity[_ngcontent-%COMP%]{flex-direction:row;gap:.5rem}"],changeDetection:0})};var Co=`
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
`;var pl=["container"],ml=["icon"],hl=["closeicon"],gl=["*"],fl=t=>({closeCallback:t});function _l(t,n){t&1&&ie(0)}function bl(t,n){if(t&1&&h(0,_l,1,0,"ng-container",4),t&2){let e=l();s("ngTemplateOutlet",e.iconTemplate||e._iconTemplate)}}function yl(t,n){if(t&1&&z(0,"i",1),t&2){let e=l();m(e.cn(e.cx("icon"),e.icon)),s("pBind",e.ptm("icon")),v("data-p",e.dataP)}}function vl(t,n){t&1&&ie(0)}function Cl(t,n){if(t&1&&h(0,vl,1,0,"ng-container",5),t&2){let e=l();s("ngTemplateOutlet",e.containerTemplate||e._containerTemplate)("ngTemplateOutletContext",we(2,fl,e.closeCallback))}}function xl(t,n){if(t&1&&z(0,"span",9),t&2){let e=l(3);s("pBind",e.ptm("text"))("ngClass",e.cx("text"))("innerHTML",e.text,bn),v("data-p",e.dataP)}}function wl(t,n){if(t&1&&(d(0,"div"),h(1,xl,1,4,"span",8),u()),t&2){let e=l(2);c(),s("ngIf",!e.escape)}}function Ml(t,n){if(t&1&&(d(0,"span",7),Y(1),u()),t&2){let e=l(3);s("pBind",e.ptm("text"))("ngClass",e.cx("text")),v("data-p",e.dataP),c(),he(e.text)}}function kl(t,n){if(t&1&&h(0,Ml,2,4,"span",10),t&2){let e=l(2);s("ngIf",e.escape&&e.text)}}function Dl(t,n){if(t&1&&(h(0,wl,2,1,"div",6)(1,kl,1,1,"ng-template",null,0,Ae),d(3,"span",7),Z(4),u()),t&2){let e=Ue(2),i=l();s("ngIf",!i.escape)("ngIfElse",e),c(3),s("pBind",i.ptm("text"))("ngClass",i.cx("text")),v("data-p",i.dataP)}}function Il(t,n){if(t&1&&z(0,"i",7),t&2){let e=l(2);m(e.cn(e.cx("closeIcon"),e.closeIcon)),s("pBind",e.ptm("closeIcon"))("ngClass",e.closeIcon),v("data-p",e.dataP)}}function Tl(t,n){t&1&&ie(0)}function El(t,n){if(t&1&&h(0,Tl,1,0,"ng-container",4),t&2){let e=l(2);s("ngTemplateOutlet",e.closeIconTemplate||e._closeIconTemplate)}}function Sl(t,n){if(t&1&&(V(),z(0,"svg",14)),t&2){let e=l(2);m(e.cx("closeIcon")),s("pBind",e.ptm("closeIcon")),v("data-p",e.dataP)}}function Vl(t,n){if(t&1){let e=S();d(0,"button",11),x("click",function(o){b(e);let r=l();return y(r.close(o))}),O(1,Il,1,5,"i",12),O(2,El,1,1,"ng-container"),O(3,Sl,1,4,":svg:svg",13),u()}if(t&2){let e=l();m(e.cx("closeButton")),s("pBind",e.ptm("closeButton")),v("aria-label",e.closeAriaLabel)("data-p",e.dataP),c(),B(e.closeIcon?1:-1),c(),B(e.closeIconTemplate||e._closeIconTemplate?2:-1),c(),B(!e.closeIconTemplate&&!e._closeIconTemplate&&!e.closeIcon?3:-1)}}var Al={root:({instance:t})=>["p-message p-component p-message-"+t.severity,t.variant&&"p-message-"+t.variant,{"p-message-sm":t.size==="small","p-message-lg":t.size==="large"}],contentWrapper:"p-message-content-wrapper",content:"p-message-content",icon:"p-message-icon",text:"p-message-text",closeButton:"p-message-close-button",closeIcon:"p-message-close-icon"},xo=(()=>{class t extends U{name="message";style=Co;classes=Al;static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275prov=L({token:t,factory:t.\u0275fac})}return t})();var wo=new P("MESSAGE_INSTANCE"),mg=(()=>{class t extends J{componentName="Message";_componentStyle=p(xo);bindDirectiveInstance=p(g,{self:!0});$pcMessage=p(wo,{optional:!0,skipSelf:!0})??void 0;onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}severity="info";text;escape=!0;style;styleClass;closable=!1;icon;closeIcon;life;showTransitionOptions="300ms ease-out";hideTransitionOptions="200ms cubic-bezier(0.86, 0, 0.07, 1)";size;variant;motionOptions=_(void 0);computedMotionOptions=D(()=>A(A({},this.ptm("motion")),this.motionOptions()));onClose=new N;get closeAriaLabel(){return this.config.translation.aria?this.config.translation.aria.close:void 0}visible=F(!0);containerTemplate;iconTemplate;closeIconTemplate;templates;_containerTemplate;_iconTemplate;_closeIconTemplate;closeCallback=e=>{this.close(e)};onInit(){this.life&&setTimeout(()=>{this.visible.set(!1)},this.life)}onAfterContentInit(){this.templates?.forEach(e=>{switch(e.getType()){case"container":this._containerTemplate=e.template;break;case"icon":this._iconTemplate=e.template;break;case"closeicon":this._closeIconTemplate=e.template;break}})}close(e){this.visible.set(!1),this.onClose.emit({originalEvent:e})}get dataP(){return this.cn({outlined:this.variant==="outlined",simple:this.variant==="simple",[this.severity]:this.severity,[this.size]:this.size})}static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275cmp=k({type:t,selectors:[["p-message"]],contentQueries:function(i,o,r){if(i&1&&le(r,pl,4)(r,ml,4)(r,hl,4)(r,te,4),i&2){let a;I(a=T())&&(o.containerTemplate=a.first),I(a=T())&&(o.iconTemplate=a.first),I(a=T())&&(o.closeIconTemplate=a.first),I(a=T())&&(o.templates=a)}},hostAttrs:["role","alert","aria-live","polite"],hostVars:5,hostBindings:function(i,o){i&1&&(xn(function(){return"p-message-enter-active"}),wn(function(){return"p-message-leave-active"})),i&2&&(v("data-p",o.dataP),m(o.cn(o.cx("root"),o.styleClass)),be("p-message-leave-active",!o.visible()))},inputs:{severity:"severity",text:"text",escape:[2,"escape","escape",C],style:"style",styleClass:"styleClass",closable:[2,"closable","closable",C],icon:"icon",closeIcon:"closeIcon",life:"life",showTransitionOptions:"showTransitionOptions",hideTransitionOptions:"hideTransitionOptions",size:"size",variant:"variant",motionOptions:[1,"motionOptions"]},outputs:{onClose:"onClose"},features:[j([xo,{provide:wo,useExisting:t},{provide:q,useExisting:t}]),$([g]),w],ngContentSelectors:gl,decls:7,vars:12,consts:[["escapeOut",""],[3,"pBind"],[3,"pBind","class"],["pRipple","","type","button",3,"pBind","class"],[4,"ngTemplateOutlet"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[4,"ngIf","ngIfElse"],[3,"pBind","ngClass"],[3,"pBind","ngClass","innerHTML",4,"ngIf"],[3,"pBind","ngClass","innerHTML"],[3,"pBind","ngClass",4,"ngIf"],["pRipple","","type","button",3,"click","pBind"],[3,"pBind","class","ngClass"],["data-p-icon","times",3,"pBind","class"],["data-p-icon","times",3,"pBind"]],template:function(i,o){i&1&&(ee(),d(0,"div",1)(1,"div",1),O(2,bl,1,1,"ng-container"),O(3,yl,1,4,"i",2),O(4,Cl,1,4,"ng-container")(5,Dl,5,5),O(6,Vl,4,8,"button",3),u()()),i&2&&(m(o.cx("contentWrapper")),s("pBind",o.ptm("contentWrapper")),v("data-p",o.dataP),c(),m(o.cx("content")),s("pBind",o.ptm("content")),v("data-p",o.dataP),c(),B(o.iconTemplate||o._iconTemplate?2:-1),c(),B(o.icon?3:-1),c(),B(o.containerTemplate||o._containerTemplate?4:5),c(2),B(o.closable?6:-1))},dependencies:[W,Pe,De,ce,xt,$n,X,g,Je],encapsulation:2,changeDetection:0})}return t})();var vg=(()=>{class t extends ot{pcFluid=p(Ct,{optional:!0,host:!0,skipSelf:!0});fluid=_(void 0,{transform:C});variant=_();size=_();inputSize=_();pattern=_();min=_();max=_();step=_();minlength=_();maxlength=_();$variant=D(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());get hasFluid(){return this.fluid()??!!this.pcFluid}static \u0275fac=(()=>{let e;return function(o){return(e||(e=f(t)))(o||t)}})();static \u0275dir=se({type:t,inputs:{fluid:[1,"fluid"],variant:[1,"variant"],size:[1,"size"],inputSize:[1,"inputSize"],pattern:[1,"pattern"],min:[1,"min"],max:[1,"max"],step:[1,"step"],minlength:[1,"minlength"],maxlength:[1,"maxlength"]},features:[w]})}return t})();export{td as a,Jn as b,Ed as c,Ad as d,Pd as e,Bi as f,Ud as g,qd as h,ge as i,Yo as j,Kn as k,Be as l,sc as m,lc as n,cc as o,dc as p,Xt as q,Kd as r,tu as s,nu as t,iu as u,ru as v,au as w,nt as x,gi as y,Ve as z,wi as A,rn as B,Vt as C,Pu as D,np as E,Ip as F,ot as G,xs as H,ws as I,rm as J,am as K,sm as L,lm as M,cm as N,sn as O,uo as P,bh as Q,Ah as R,yo as S,vo as T,mg as U,Si as V,vg as W};
