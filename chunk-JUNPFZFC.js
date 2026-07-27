import{A as gt,B as pt,F as U,w as Q,z as ct}from"./chunk-WYORCWI7.js";import{Da as u,Ea as K,Ia as dt,Na as ut,f as $,g as z,pa as P,qa as j,ua as G,wa as H,x as R,y as I}from"./chunk-AV3V65LQ.js";import{Ab as L,Bb as it,Db as F,Fb as r,Ib as N,Kb as b,L as O,La as p,Lb as f,M as S,P as M,R as c,Sb as m,Tb as lt,Ub as at,W as J,X as W,Y as X,Za as y,ac as A,bb as D,ca as x,cb as C,cc as Y,db as _,dc as rt,ic as st,jb as k,la as g,mb as v,nb as T,pb as tt,qb as et,qc as w,rb as s,sb as E,tb as B,ub as nt,xb as ot,xc as d,yc as V}from"./chunk-NVGDBBTU.js";var bt=`
    .p-togglebutton {
        display: inline-flex;
        cursor: pointer;
        user-select: none;
        overflow: hidden;
        position: relative;
        color: dt('togglebutton.color');
        background: dt('togglebutton.background');
        border: 1px solid dt('togglebutton.border.color');
        padding: dt('togglebutton.padding');
        font-size: 1rem;
        font-family: inherit;
        font-feature-settings: inherit;
        transition:
            background dt('togglebutton.transition.duration'),
            color dt('togglebutton.transition.duration'),
            border-color dt('togglebutton.transition.duration'),
            outline-color dt('togglebutton.transition.duration'),
            box-shadow dt('togglebutton.transition.duration');
        border-radius: dt('togglebutton.border.radius');
        outline-color: transparent;
        font-weight: dt('togglebutton.font.weight');
    }

    .p-togglebutton-content {
        display: inline-flex;
        flex: 1 1 auto;
        align-items: center;
        justify-content: center;
        gap: dt('togglebutton.gap');
        padding: dt('togglebutton.content.padding');
        background: transparent;
        border-radius: dt('togglebutton.content.border.radius');
        transition:
            background dt('togglebutton.transition.duration'),
            color dt('togglebutton.transition.duration'),
            border-color dt('togglebutton.transition.duration'),
            outline-color dt('togglebutton.transition.duration'),
            box-shadow dt('togglebutton.transition.duration');
    }

    .p-togglebutton:not(:disabled):not(.p-togglebutton-checked):hover {
        background: dt('togglebutton.hover.background');
        color: dt('togglebutton.hover.color');
    }

    .p-togglebutton.p-togglebutton-checked {
        background: dt('togglebutton.checked.background');
        border-color: dt('togglebutton.checked.border.color');
        color: dt('togglebutton.checked.color');
    }

    .p-togglebutton-checked .p-togglebutton-content {
        background: dt('togglebutton.content.checked.background');
        box-shadow: dt('togglebutton.content.checked.shadow');
    }

    .p-togglebutton:focus-visible {
        box-shadow: dt('togglebutton.focus.ring.shadow');
        outline: dt('togglebutton.focus.ring.width') dt('togglebutton.focus.ring.style') dt('togglebutton.focus.ring.color');
        outline-offset: dt('togglebutton.focus.ring.offset');
    }

    .p-togglebutton.p-invalid {
        border-color: dt('togglebutton.invalid.border.color');
    }

    .p-togglebutton:disabled {
        opacity: 1;
        cursor: default;
        background: dt('togglebutton.disabled.background');
        border-color: dt('togglebutton.disabled.border.color');
        color: dt('togglebutton.disabled.color');
    }

    .p-togglebutton-label,
    .p-togglebutton-icon {
        position: relative;
        transition: none;
    }

    .p-togglebutton-icon {
        color: dt('togglebutton.icon.color');
    }

    .p-togglebutton:not(:disabled):not(.p-togglebutton-checked):hover .p-togglebutton-icon {
        color: dt('togglebutton.icon.hover.color');
    }

    .p-togglebutton.p-togglebutton-checked .p-togglebutton-icon {
        color: dt('togglebutton.icon.checked.color');
    }

    .p-togglebutton:disabled .p-togglebutton-icon {
        color: dt('togglebutton.icon.disabled.color');
    }

    .p-togglebutton-sm {
        padding: dt('togglebutton.sm.padding');
        font-size: dt('togglebutton.sm.font.size');
    }

    .p-togglebutton-sm .p-togglebutton-content {
        padding: dt('togglebutton.content.sm.padding');
    }

    .p-togglebutton-lg {
        padding: dt('togglebutton.lg.padding');
        font-size: dt('togglebutton.lg.font.size');
    }

    .p-togglebutton-lg .p-togglebutton-content {
        padding: dt('togglebutton.content.lg.padding');
    }

    .p-togglebutton-fluid {
        width: 100%;
    }
`;var Bt=["icon"],Lt=["content"],yt=e=>({$implicit:e});function wt(e,a){e&1&&L(0)}function It(e,a){if(e&1&&nt(0,"span",0),e&2){let t=r(3);m(t.cn(t.cx("icon"),t.checked?t.onIcon:t.offIcon,t.iconPos==="left"?t.cx("iconLeft"):t.cx("iconRight"))),s("pBind",t.ptm("icon"))}}function Ot(e,a){if(e&1&&v(0,It,1,3,"span",2),e&2){let t=r(2);T(t.onIcon||t.offIcon?0:-1)}}function St(e,a){e&1&&L(0)}function Mt(e,a){if(e&1&&_(0,St,1,0,"ng-container",1),e&2){let t=r(2);s("ngTemplateOutlet",t.iconTemplate||t._iconTemplate)("ngTemplateOutletContext",Y(2,yt,t.checked))}}function Dt(e,a){if(e&1&&(v(0,Ot,1,1)(1,Mt,1,4,"ng-container"),E(2,"span",0),lt(3),B()),e&2){let t=r();T(t.iconTemplate?1:0),p(2),m(t.cx("label")),s("pBind",t.ptm("label")),p(),at(t.checked?t.hasOnLabel?t.onLabel:"\xA0":t.hasOffLabel?t.offLabel:"\xA0")}}var Ft=`
    ${bt}

    /* For PrimeNG (iconPos) */
    .p-togglebutton-icon-right {
        order: 1;
    }

    .p-togglebutton.ng-invalid.ng-dirty {
        border-color: dt('togglebutton.invalid.border.color');
    }
`,Nt={root:({instance:e})=>["p-togglebutton p-component",{"p-togglebutton-checked":e.checked,"p-invalid":e.invalid(),"p-disabled":e.$disabled(),"p-togglebutton-sm p-inputfield-sm":e.size==="small","p-togglebutton-lg p-inputfield-lg":e.size==="large","p-togglebutton-fluid":e.fluid()}],content:"p-togglebutton-content",icon:"p-togglebutton-icon",iconLeft:"p-togglebutton-icon-left",iconRight:"p-togglebutton-icon-right",label:"p-togglebutton-label"},ft=(()=>{class e extends G{name="togglebutton";style=Ft;classes=Nt;static \u0275fac=(()=>{let t;return function(n){return(t||(t=g(e)))(n||e)}})();static \u0275prov=S({token:e,factory:e.\u0275fac})}return e})();var mt=new M("TOGGLEBUTTON_INSTANCE"),At={provide:Q,useExisting:O(()=>Z),multi:!0},Z=(()=>{class e extends U{componentName="ToggleButton";$pcToggleButton=c(mt,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=c(u,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}onKeyDown(t){switch(t.code){case"Enter":this.toggle(t),t.preventDefault();break;case"Space":this.toggle(t),t.preventDefault();break}}toggle(t){!this.$disabled()&&!(this.allowEmpty===!1&&this.checked)&&(this.checked=!this.checked,this.writeModelValue(this.checked),this.onModelChange(this.checked),this.onModelTouched(),this.onChange.emit({originalEvent:t,checked:this.checked}),this.cd.markForCheck())}onLabel="Yes";offLabel="No";onIcon;offIcon;ariaLabel;ariaLabelledBy;styleClass;inputId;tabindex=0;iconPos="left";autofocus;size;allowEmpty;fluid=w(void 0,{transform:d});onChange=new x;iconTemplate;contentTemplate;templates;checked=!1;onInit(){(this.checked===null||this.checked===void 0)&&(this.checked=!1)}_componentStyle=c(ft);onBlur(){this.onModelTouched()}get hasOnLabel(){return this.onLabel&&this.onLabel.length>0}get hasOffLabel(){return this.offLabel&&this.offLabel.length>0}get active(){return this.checked===!0}_iconTemplate;_contentTemplate;onAfterContentInit(){this.templates.forEach(t=>{switch(t.getType()){case"icon":this._iconTemplate=t.template;break;case"content":this._contentTemplate=t.template;break;default:this._contentTemplate=t.template;break}})}writeControlValue(t,o){this.checked=t,o(t),this.cd.markForCheck()}get dataP(){return this.cn({checked:this.active,invalid:this.invalid(),[this.size]:this.size})}static \u0275fac=(()=>{let t;return function(n){return(t||(t=g(e)))(n||e)}})();static \u0275cmp=y({type:e,selectors:[["p-toggleButton"],["p-togglebutton"],["p-toggle-button"]],contentQueries:function(o,n,i){if(o&1&&N(i,Bt,4)(i,Lt,4)(i,P,4),o&2){let l;b(l=f())&&(n.iconTemplate=l.first),b(l=f())&&(n.contentTemplate=l.first),b(l=f())&&(n.templates=l)}},hostVars:11,hostBindings:function(o,n){o&1&&F("keydown",function(l){return n.onKeyDown(l)})("click",function(l){return n.toggle(l)}),o&2&&(k("aria-labelledby",n.ariaLabelledBy)("aria-label",n.ariaLabel)("aria-pressed",n.checked?"true":"false")("role","button")("tabindex",n.tabindex!==void 0?n.tabindex:n.$disabled()?-1:0)("data-pc-name","togglebutton")("data-p-checked",n.active)("data-p-disabled",n.$disabled())("data-p",n.dataP),m(n.cn(n.cx("root"),n.styleClass)))},inputs:{onLabel:"onLabel",offLabel:"offLabel",onIcon:"onIcon",offIcon:"offIcon",ariaLabel:"ariaLabel",ariaLabelledBy:"ariaLabelledBy",styleClass:"styleClass",inputId:"inputId",tabindex:[2,"tabindex","tabindex",V],iconPos:"iconPos",autofocus:[2,"autofocus","autofocus",d],size:"size",allowEmpty:"allowEmpty",fluid:[1,"fluid"]},outputs:{onChange:"onChange"},features:[A([At,ft,{provide:mt,useExisting:e},{provide:H,useExisting:e}]),D([ut,u]),C],decls:3,vars:9,consts:[[3,"pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[3,"class","pBind"]],template:function(o,n){o&1&&(E(0,"span",0),_(1,wt,1,0,"ng-container",1),v(2,Dt,4,5),B()),o&2&&(m(n.cx("content")),s("pBind",n.ptm("content")),k("data-p",n.dataP),p(),s("ngTemplateOutlet",n.contentTemplate||n._contentTemplate)("ngTemplateOutletContext",Y(7,yt,n.checked)),p(),T(n.contentTemplate?-1:2))},dependencies:[z,$,j,K,u],encapsulation:2,changeDetection:0})}return e})();var Ct=`
    .p-selectbutton {
        display: inline-flex;
        user-select: none;
        vertical-align: bottom;
        outline-color: transparent;
        border-radius: dt('selectbutton.border.radius');
    }

    .p-selectbutton .p-togglebutton {
        border-radius: 0;
        border-width: 1px 1px 1px 0;
    }

    .p-selectbutton .p-togglebutton:focus-visible {
        position: relative;
        z-index: 1;
    }

    .p-selectbutton .p-togglebutton:first-child {
        border-inline-start-width: 1px;
        border-start-start-radius: dt('selectbutton.border.radius');
        border-end-start-radius: dt('selectbutton.border.radius');
    }

    .p-selectbutton .p-togglebutton:last-child {
        border-start-end-radius: dt('selectbutton.border.radius');
        border-end-end-radius: dt('selectbutton.border.radius');
    }

    .p-selectbutton.p-invalid {
        outline: 1px solid dt('selectbutton.invalid.border.color');
        outline-offset: 0;
    }

    .p-selectbutton-fluid {
        width: 100%;
    }
    
    .p-selectbutton-fluid .p-togglebutton {
        flex: 1 1 0;
    }
`;var Vt=["item"],$t=(e,a)=>({$implicit:e,index:a});function zt(e,a){return this.getOptionLabel(a)}function Rt(e,a){e&1&&L(0)}function Pt(e,a){if(e&1&&_(0,Rt,1,0,"ng-container",3),e&2){let t=r(2),o=t.$implicit,n=t.$index,i=r();s("ngTemplateOutlet",i.itemTemplate||i._itemTemplate)("ngTemplateOutletContext",rt(2,$t,o,n))}}function jt(e,a){e&1&&_(0,Pt,1,5,"ng-template",null,0,st)}function Gt(e,a){if(e&1){let t=it();E(0,"p-togglebutton",2),F("onChange",function(n){let i=J(t),l=i.$implicit,h=i.$index,q=r();return W(q.onOptionSelect(n,l,h))}),v(1,jt,2,0),B()}if(e&2){let t=a.$implicit,o=r();s("autofocus",o.autofocus)("styleClass",o.styleClass)("ngModel",o.isSelected(t))("onLabel",o.getOptionLabel(t))("offLabel",o.getOptionLabel(t))("disabled",o.$disabled()||o.isOptionDisabled(t))("allowEmpty",o.getAllowEmpty())("size",o.size())("fluid",o.fluid())("pt",o.ptm("pcToggleButton"))("unstyled",o.unstyled()),p(),T(o.itemTemplate||o._itemTemplate?1:-1)}}var Ht=`
    ${Ct}

    /* For PrimeNG */
    .p-selectbutton.ng-invalid.ng-dirty {
        outline: 1px solid dt('selectbutton.invalid.border.color');
        outline-offset: 0;
    }
`,Kt={root:({instance:e})=>["p-selectbutton p-component",{"p-invalid":e.invalid(),"p-selectbutton-fluid":e.fluid()}]},_t=(()=>{class e extends G{name="selectbutton";style=Ht;classes=Kt;static \u0275fac=(()=>{let t;return function(n){return(t||(t=g(e)))(n||e)}})();static \u0275prov=S({token:e,factory:e.\u0275fac})}return e})();var vt=new M("SELECTBUTTON_INSTANCE"),Qt={provide:Q,useExisting:O(()=>Ut),multi:!0},Ut=(()=>{class e extends U{componentName="SelectButton";options;optionLabel;optionValue;optionDisabled;get unselectable(){return this._unselectable}_unselectable=!1;set unselectable(t){this._unselectable=t,this.allowEmpty=!t}tabindex=0;multiple;allowEmpty=!0;styleClass;ariaLabelledBy;dataKey;autofocus;size=w();fluid=w(void 0,{transform:d});onOptionClick=new x;onChange=new x;itemTemplate;_itemTemplate;get equalityKey(){return this.optionValue?null:this.dataKey}value;focusedIndex=0;_componentStyle=c(_t);$pcSelectButton=c(vt,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=c(u,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}getAllowEmpty(){return this.multiple?this.allowEmpty||this.value?.length!==1:this.allowEmpty}getOptionLabel(t){return this.optionLabel?R(t,this.optionLabel):t.label!=null?t.label:t}getOptionValue(t){return this.optionValue?R(t,this.optionValue):this.optionLabel||t.value===void 0?t:t.value}isOptionDisabled(t){return this.optionDisabled?R(t,this.optionDisabled):t.disabled!==void 0?t.disabled:!1}onOptionSelect(t,o,n){if(this.$disabled()||this.isOptionDisabled(o))return;let i=this.isSelected(o);if(i&&this.unselectable)return;let l=this.getOptionValue(o),h;if(this.multiple)i?h=this.value.filter(q=>!I(q,l,this.equalityKey||void 0)):h=this.value?[...this.value,l]:[l];else{if(i&&!this.allowEmpty)return;h=i?null:l}this.focusedIndex=n,this.value=h,this.writeModelValue(this.value),this.onModelChange(this.value),this.onChange.emit({originalEvent:t,value:this.value}),this.onOptionClick.emit({originalEvent:t,option:o,index:n})}changeTabIndexes(t,o){let n,i;for(let l=0;l<=this.el.nativeElement.children.length-1;l++)this.el.nativeElement.children[l].getAttribute("tabindex")==="0"&&(n={elem:this.el.nativeElement.children[l],index:l});o==="prev"?n.index===0?i=this.el.nativeElement.children.length-1:i=n.index-1:n.index===this.el.nativeElement.children.length-1?i=0:i=n.index+1,this.focusedIndex=i,this.el.nativeElement.children[i].focus()}onFocus(t,o){this.focusedIndex=o}onBlur(){this.onModelTouched()}removeOption(t){this.value=this.value.filter(o=>!I(o,this.getOptionValue(t),this.dataKey))}isSelected(t){let o=!1,n=this.getOptionValue(t);if(this.multiple){if(this.value&&Array.isArray(this.value)){for(let i of this.value)if(I(i,n,this.dataKey)){o=!0;break}}}else o=I(this.getOptionValue(t),this.value,this.equalityKey||void 0);return o}templates;onAfterContentInit(){this.templates.forEach(t=>{t.getType()==="item"&&(this._itemTemplate=t.template)})}writeControlValue(t,o){this.value=t,o(this.value),this.cd.markForCheck()}get dataP(){return this.cn({invalid:this.invalid()})}static \u0275fac=(()=>{let t;return function(n){return(t||(t=g(e)))(n||e)}})();static \u0275cmp=y({type:e,selectors:[["p-selectButton"],["p-selectbutton"],["p-select-button"]],contentQueries:function(o,n,i){if(o&1&&N(i,Vt,4)(i,P,4),o&2){let l;b(l=f())&&(n.itemTemplate=l.first),b(l=f())&&(n.templates=l)}},hostVars:5,hostBindings:function(o,n){o&2&&(k("role","group")("aria-labelledby",n.ariaLabelledBy)("data-p",n.dataP),m(n.cx("root")))},inputs:{options:"options",optionLabel:"optionLabel",optionValue:"optionValue",optionDisabled:"optionDisabled",unselectable:[2,"unselectable","unselectable",d],tabindex:[2,"tabindex","tabindex",V],multiple:[2,"multiple","multiple",d],allowEmpty:[2,"allowEmpty","allowEmpty",d],styleClass:"styleClass",ariaLabelledBy:"ariaLabelledBy",dataKey:"dataKey",autofocus:[2,"autofocus","autofocus",d],size:[1,"size"],fluid:[1,"fluid"]},outputs:{onOptionClick:"onOptionClick",onChange:"onChange"},features:[A([Qt,_t,{provide:vt,useExisting:e},{provide:H,useExisting:e}]),D([u]),C],decls:2,vars:0,consts:[["content",""],[3,"autofocus","styleClass","ngModel","onLabel","offLabel","disabled","allowEmpty","size","fluid","pt","unstyled"],[3,"onChange","autofocus","styleClass","ngModel","onLabel","offLabel","disabled","allowEmpty","size","fluid","pt","unstyled"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(o,n){o&1&&tt(0,Gt,2,12,"p-togglebutton",1,zt,!0),o&2&&et(n.options)},dependencies:[Z,pt,ct,gt,z,$,j,K],encapsulation:2,changeDetection:0})}return e})();var qt=["data-p-icon","chevron-right"],je=(()=>{class e extends dt{static \u0275fac=(()=>{let t;return function(n){return(t||(t=g(e)))(n||e)}})();static \u0275cmp=y({type:e,selectors:[["","data-p-icon","chevron-right"]],features:[C],attrs:qt,decls:1,vars:0,consts:[["d","M4.38708 13C4.28408 13.0005 4.18203 12.9804 4.08691 12.9409C3.99178 12.9014 3.9055 12.8433 3.83313 12.7701C3.68634 12.6231 3.60388 12.4238 3.60388 12.2161C3.60388 12.0084 3.68634 11.8091 3.83313 11.6622L8.50507 6.99022L3.83313 2.31827C3.69467 2.16968 3.61928 1.97313 3.62287 1.77005C3.62645 1.56698 3.70872 1.37322 3.85234 1.22959C3.99596 1.08597 4.18972 1.00371 4.3928 1.00012C4.59588 0.996539 4.79242 1.07192 4.94102 1.21039L10.1669 6.43628C10.3137 6.58325 10.3962 6.78249 10.3962 6.99022C10.3962 7.19795 10.3137 7.39718 10.1669 7.54416L4.94102 12.7701C4.86865 12.8433 4.78237 12.9014 4.68724 12.9409C4.59212 12.9804 4.49007 13.0005 4.38708 13Z","fill","currentColor"]],template:function(o,n){o&1&&(X(),ot(0,"path",0))},encapsulation:2})}return e})();export{je as a,Ut as b};
