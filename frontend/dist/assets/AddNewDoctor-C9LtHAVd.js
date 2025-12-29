import{j as p,e as aa,r as z,d as ra,f as Pr,T as Nr,u as _t,b7 as Ir,m as kr,b8 as Er,y as M,b9 as Fr,ba as jr}from"./index-D_CM1r6M.js";import{P as m}from"./index-DKThCUkT.js";import{g as Tr}from"./getRoleRoute-Do-Qfut4.js";import{I as na}from"./FormFields-cbkv4QEu.js";import{F as rt,a as oa}from"./FormSection-CqnVxHJP.js";import"./index-CVhLpNpZ.js";import"./iconBase-DSUUJbys.js";import"./index-jLjFIv2f.js";import"./index-DK6bWzrh.js";import"./index-Dskypj5f.js";m.node.isRequired,m.shape({base:m.number,md:m.number}),m.number,m.string;const ia=({children:e,shadow:t="shadow-md",rounded:a="rounded-xl",bg:r="bg-white",className:n=""})=>p.jsx("div",{className:`${r} ${a} ${t} overflow-hidden ${n}`,children:e});ia.propTypes={children:m.node.isRequired,shadow:m.string,rounded:m.string,bg:m.string,className:m.string};const sa=({title:e,description:t,bgColor:a="bg-primary-600",textColor:r="text-white",lineColor:n="bg-primary-300",size:o="lg"})=>{const i={sm:{heading:"text-xl",line:"h-8 w-1",spacing:"px-4 py-4"},md:{heading:"text-2xl",line:"h-10 w-1",spacing:"px-5 py-6"},lg:{heading:"text-3xl",line:"h-12 w-1",spacing:"px-6 py-8"}};return p.jsx("div",{className:`${a} rounded-t-md ${r} ${i[o].spacing} shadow-md`,children:p.jsxs("div",{className:"flex items-center",children:[p.jsx("div",{className:`${i[o].line} ${n} mr-4 rounded-full`}),p.jsxs("div",{children:[p.jsx("h1",{className:`${i[o].heading} font-bold`,children:e}),t&&p.jsx("p",{className:"text-primary-100 mt-1",children:t})]})]})})};sa.propTypes={title:m.string.isRequired,description:m.string,bgColor:m.string,textColor:m.string,lineColor:m.string,size:m.oneOf(["sm","md","lg"])};m.string.isRequired,m.node.isRequired,m.bool,m.object,m.string;function We(e,t){(t==null||t>e.length)&&(t=e.length);for(var a=0,r=Array(t);a<t;a++)r[a]=e[a];return r}function Or(e){if(Array.isArray(e))return e}function $r(e){if(Array.isArray(e))return We(e)}function Dr(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function Lr(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,la(r.key),r)}}function Mr(e,t,a){return t&&Lr(e.prototype,t),Object.defineProperty(e,"prototype",{writable:!1}),e}function Ce(e,t){var a=typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(!a){if(Array.isArray(e)||(a=nt(e))||t){a&&(e=a);var r=0,n=function(){};return{s:n,n:function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}},e:function(l){throw l},f:n}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var o,i=!0,s=!1;return{s:function(){a=a.call(e)},n:function(){var l=a.next();return i=l.done,l},e:function(l){s=!0,o=l},f:function(){try{i||a.return==null||a.return()}finally{if(s)throw o}}}}function _(e,t,a){return(t=la(t))in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function Rr(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function zr(e,t){var a=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(a!=null){var r,n,o,i,s=[],l=!0,c=!1;try{if(o=(a=a.call(e)).next,t===0){if(Object(a)!==a)return;l=!1}else for(;!(l=(r=o.call(a)).done)&&(s.push(r.value),s.length!==t);l=!0);}catch(d){c=!0,n=d}finally{try{if(!l&&a.return!=null&&(i=a.return(),Object(i)!==i))return}finally{if(c)throw n}}return s}}function Ur(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Wr(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Ct(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable})),a.push.apply(a,r)}return a}function f(e){for(var t=1;t<arguments.length;t++){var a=arguments[t]!=null?arguments[t]:{};t%2?Ct(Object(a),!0).forEach(function(r){_(e,r,a[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):Ct(Object(a)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(a,r))})}return e}function ke(e,t){return Or(e)||zr(e,t)||nt(e,t)||Ur()}function W(e){return $r(e)||Rr(e)||nt(e)||Wr()}function Xr(e,t){if(typeof e!="object"||!e)return e;var a=e[Symbol.toPrimitive];if(a!==void 0){var r=a.call(e,t);if(typeof r!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function la(e){var t=Xr(e,"string");return typeof t=="symbol"?t:t+""}function Pe(e){"@babel/helpers - typeof";return Pe=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Pe(e)}function nt(e,t){if(e){if(typeof e=="string")return We(e,t);var a={}.toString.call(e).slice(8,-1);return a==="Object"&&e.constructor&&(a=e.constructor.name),a==="Map"||a==="Set"?Array.from(e):a==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a)?We(e,t):void 0}}var St=function(){},ot={},ca={},fa=null,ua={mark:St,measure:St};try{typeof window<"u"&&(ot=window),typeof document<"u"&&(ca=document),typeof MutationObserver<"u"&&(fa=MutationObserver),typeof performance<"u"&&(ua=performance)}catch{}var qr=ot.navigator||{},At=qr.userAgent,Pt=At===void 0?"":At,Z=ot,k=ca,Nt=fa,we=ua;Z.document;var K=!!k.documentElement&&!!k.head&&typeof k.addEventListener=="function"&&typeof k.createElement=="function",da=~Pt.indexOf("MSIE")||~Pt.indexOf("Trident/"),$e,Yr=/fa(k|kd|s|r|l|t|d|dr|dl|dt|b|slr|slpr|wsb|tl|ns|nds|es|jr|jfr|jdr|usb|ufsb|udsb|cr|ss|sr|sl|st|sds|sdr|sdl|sdt)?[\-\ ]/,Hr=/Font ?Awesome ?([567 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit|Notdog Duo|Notdog|Chisel|Etch|Thumbprint|Jelly Fill|Jelly Duo|Jelly|Utility|Utility Fill|Utility Duo|Slab Press|Slab|Whiteboard)?.*/i,ma={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fab:"brands","fa-brands":"brands"},duotone:{fa:"solid",fad:"solid","fa-solid":"solid","fa-duotone":"solid",fadr:"regular","fa-regular":"regular",fadl:"light","fa-light":"light",fadt:"thin","fa-thin":"thin"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid",fasdr:"regular","fa-regular":"regular",fasdl:"light","fa-light":"light",fasdt:"thin","fa-thin":"thin"},slab:{"fa-regular":"regular",faslr:"regular"},"slab-press":{"fa-regular":"regular",faslpr:"regular"},thumbprint:{"fa-light":"light",fatl:"light"},whiteboard:{"fa-semibold":"semibold",fawsb:"semibold"},notdog:{"fa-solid":"solid",fans:"solid"},"notdog-duo":{"fa-solid":"solid",fands:"solid"},etch:{"fa-solid":"solid",faes:"solid"},jelly:{"fa-regular":"regular",fajr:"regular"},"jelly-fill":{"fa-regular":"regular",fajfr:"regular"},"jelly-duo":{"fa-regular":"regular",fajdr:"regular"},chisel:{"fa-regular":"regular",facr:"regular"},utility:{"fa-semibold":"semibold",fausb:"semibold"},"utility-duo":{"fa-semibold":"semibold",faudsb:"semibold"},"utility-fill":{"fa-semibold":"semibold",faufsb:"semibold"}},Br={GROUP:"duotone-group",PRIMARY:"primary",SECONDARY:"secondary"},pa=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-utility","fa-utility-duo","fa-utility-fill"],$="classic",be="duotone",ga="sharp",ha="sharp-duotone",va="chisel",ba="etch",ya="jelly",xa="jelly-duo",wa="jelly-fill",_a="notdog",Ca="notdog-duo",Sa="slab",Aa="slab-press",Pa="thumbprint",Na="utility",Ia="utility-duo",ka="utility-fill",Ea="whiteboard",Gr="Classic",Jr="Duotone",Vr="Sharp",Kr="Sharp Duotone",Qr="Chisel",Zr="Etch",en="Jelly",tn="Jelly Duo",an="Jelly Fill",rn="Notdog",nn="Notdog Duo",on="Slab",sn="Slab Press",ln="Thumbprint",cn="Utility",fn="Utility Duo",un="Utility Fill",dn="Whiteboard",Fa=[$,be,ga,ha,va,ba,ya,xa,wa,_a,Ca,Sa,Aa,Pa,Na,Ia,ka,Ea];$e={},_(_(_(_(_(_(_(_(_(_($e,$,Gr),be,Jr),ga,Vr),ha,Kr),va,Qr),ba,Zr),ya,en),xa,tn),wa,an),_a,rn),_(_(_(_(_(_(_(_($e,Ca,nn),Sa,on),Aa,sn),Pa,ln),Na,cn),Ia,fn),ka,un),Ea,dn);var mn={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},duotone:{900:"fad",400:"fadr",300:"fadl",100:"fadt"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds",400:"fasdr",300:"fasdl",100:"fasdt"},slab:{400:"faslr"},"slab-press":{400:"faslpr"},whiteboard:{600:"fawsb"},thumbprint:{300:"fatl"},notdog:{900:"fans"},"notdog-duo":{900:"fands"},etch:{900:"faes"},chisel:{400:"facr"},jelly:{400:"fajr"},"jelly-fill":{400:"fajfr"},"jelly-duo":{400:"fajdr"},utility:{600:"fausb"},"utility-duo":{600:"faudsb"},"utility-fill":{600:"faufsb"}},pn={"Font Awesome 7 Free":{900:"fas",400:"far"},"Font Awesome 7 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 7 Brands":{400:"fab",normal:"fab"},"Font Awesome 7 Duotone":{900:"fad",400:"fadr",normal:"fadr",300:"fadl",100:"fadt"},"Font Awesome 7 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 7 Sharp Duotone":{900:"fasds",400:"fasdr",normal:"fasdr",300:"fasdl",100:"fasdt"},"Font Awesome 7 Jelly":{400:"fajr",normal:"fajr"},"Font Awesome 7 Jelly Fill":{400:"fajfr",normal:"fajfr"},"Font Awesome 7 Jelly Duo":{400:"fajdr",normal:"fajdr"},"Font Awesome 7 Slab":{400:"faslr",normal:"faslr"},"Font Awesome 7 Slab Press":{400:"faslpr",normal:"faslpr"},"Font Awesome 7 Thumbprint":{300:"fatl",normal:"fatl"},"Font Awesome 7 Notdog":{900:"fans",normal:"fans"},"Font Awesome 7 Notdog Duo":{900:"fands",normal:"fands"},"Font Awesome 7 Etch":{900:"faes",normal:"faes"},"Font Awesome 7 Chisel":{400:"facr",normal:"facr"},"Font Awesome 7 Whiteboard":{600:"fawsb",normal:"fawsb"},"Font Awesome 7 Utility":{600:"fausb",normal:"fausb"},"Font Awesome 7 Utility Duo":{600:"faudsb",normal:"faudsb"},"Font Awesome 7 Utility Fill":{600:"faufsb",normal:"faufsb"}},gn=new Map([["classic",{defaultShortPrefixId:"fas",defaultStyleId:"solid",styleIds:["solid","regular","light","thin","brands"],futureStyleIds:[],defaultFontWeight:900}],["duotone",{defaultShortPrefixId:"fad",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp",{defaultShortPrefixId:"fass",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp-duotone",{defaultShortPrefixId:"fasds",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["chisel",{defaultShortPrefixId:"facr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["etch",{defaultShortPrefixId:"faes",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["jelly",{defaultShortPrefixId:"fajr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-duo",{defaultShortPrefixId:"fajdr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-fill",{defaultShortPrefixId:"fajfr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["notdog",{defaultShortPrefixId:"fans",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["notdog-duo",{defaultShortPrefixId:"fands",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["slab",{defaultShortPrefixId:"faslr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["slab-press",{defaultShortPrefixId:"faslpr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["thumbprint",{defaultShortPrefixId:"fatl",defaultStyleId:"light",styleIds:["light"],futureStyleIds:[],defaultFontWeight:300}],["utility",{defaultShortPrefixId:"fausb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-duo",{defaultShortPrefixId:"faudsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-fill",{defaultShortPrefixId:"faufsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["whiteboard",{defaultShortPrefixId:"fawsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}]]),hn={chisel:{regular:"facr"},classic:{brands:"fab",light:"fal",regular:"far",solid:"fas",thin:"fat"},duotone:{light:"fadl",regular:"fadr",solid:"fad",thin:"fadt"},etch:{solid:"faes"},jelly:{regular:"fajr"},"jelly-duo":{regular:"fajdr"},"jelly-fill":{regular:"fajfr"},notdog:{solid:"fans"},"notdog-duo":{solid:"fands"},sharp:{light:"fasl",regular:"fasr",solid:"fass",thin:"fast"},"sharp-duotone":{light:"fasdl",regular:"fasdr",solid:"fasds",thin:"fasdt"},slab:{regular:"faslr"},"slab-press":{regular:"faslpr"},thumbprint:{light:"fatl"},utility:{semibold:"fausb"},"utility-duo":{semibold:"faudsb"},"utility-fill":{semibold:"faufsb"},whiteboard:{semibold:"fawsb"}},ja=["fak","fa-kit","fakd","fa-kit-duotone"],It={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},vn=["kit"],bn="kit",yn="kit-duotone",xn="Kit",wn="Kit Duotone";_(_({},bn,xn),yn,wn);var _n={kit:{"fa-kit":"fak"}},Cn={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},Sn={kit:{fak:"fa-kit"}},kt={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},De,_e={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},An=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-utility","fa-utility-duo","fa-utility-fill"],Pn="classic",Nn="duotone",In="sharp",kn="sharp-duotone",En="chisel",Fn="etch",jn="jelly",Tn="jelly-duo",On="jelly-fill",$n="notdog",Dn="notdog-duo",Ln="slab",Mn="slab-press",Rn="thumbprint",zn="utility",Un="utility-duo",Wn="utility-fill",Xn="whiteboard",qn="Classic",Yn="Duotone",Hn="Sharp",Bn="Sharp Duotone",Gn="Chisel",Jn="Etch",Vn="Jelly",Kn="Jelly Duo",Qn="Jelly Fill",Zn="Notdog",eo="Notdog Duo",to="Slab",ao="Slab Press",ro="Thumbprint",no="Utility",oo="Utility Duo",io="Utility Fill",so="Whiteboard";De={},_(_(_(_(_(_(_(_(_(_(De,Pn,qn),Nn,Yn),In,Hn),kn,Bn),En,Gn),Fn,Jn),jn,Vn),Tn,Kn),On,Qn),$n,Zn),_(_(_(_(_(_(_(_(De,Dn,eo),Ln,to),Mn,ao),Rn,ro),zn,no),Un,oo),Wn,io),Xn,so);var lo="kit",co="kit-duotone",fo="Kit",uo="Kit Duotone";_(_({},lo,fo),co,uo);var mo={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},duotone:{"fa-regular":"fadr","fa-light":"fadl","fa-thin":"fadt"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds","fa-regular":"fasdr","fa-light":"fasdl","fa-thin":"fasdt"},slab:{"fa-regular":"faslr"},"slab-press":{"fa-regular":"faslpr"},whiteboard:{"fa-semibold":"fawsb"},thumbprint:{"fa-light":"fatl"},notdog:{"fa-solid":"fans"},"notdog-duo":{"fa-solid":"fands"},etch:{"fa-solid":"faes"},jelly:{"fa-regular":"fajr"},"jelly-fill":{"fa-regular":"fajfr"},"jelly-duo":{"fa-regular":"fajdr"},chisel:{"fa-regular":"facr"},utility:{"fa-semibold":"fausb"},"utility-duo":{"fa-semibold":"faudsb"},"utility-fill":{"fa-semibold":"faufsb"}},po={classic:["fas","far","fal","fat","fad"],duotone:["fadr","fadl","fadt"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds","fasdr","fasdl","fasdt"],slab:["faslr"],"slab-press":["faslpr"],whiteboard:["fawsb"],thumbprint:["fatl"],notdog:["fans"],"notdog-duo":["fands"],etch:["faes"],jelly:["fajr"],"jelly-fill":["fajfr"],"jelly-duo":["fajdr"],chisel:["facr"],utility:["fausb"],"utility-duo":["faudsb"],"utility-fill":["faufsb"]},Xe={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},duotone:{fadr:"fa-regular",fadl:"fa-light",fadt:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid",fasdr:"fa-regular",fasdl:"fa-light",fasdt:"fa-thin"},slab:{faslr:"fa-regular"},"slab-press":{faslpr:"fa-regular"},whiteboard:{fawsb:"fa-semibold"},thumbprint:{fatl:"fa-light"},notdog:{fans:"fa-solid"},"notdog-duo":{fands:"fa-solid"},etch:{faes:"fa-solid"},jelly:{fajr:"fa-regular"},"jelly-fill":{fajfr:"fa-regular"},"jelly-duo":{fajdr:"fa-regular"},chisel:{facr:"fa-regular"},utility:{fausb:"fa-semibold"},"utility-duo":{faudsb:"fa-semibold"},"utility-fill":{faufsb:"fa-semibold"}},go=["fa-solid","fa-regular","fa-light","fa-thin","fa-duotone","fa-brands","fa-semibold"],Ta=["fa","fas","far","fal","fat","fad","fadr","fadl","fadt","fab","fass","fasr","fasl","fast","fasds","fasdr","fasdl","fasdt","faslr","faslpr","fawsb","fatl","fans","fands","faes","fajr","fajfr","fajdr","facr","fausb","faudsb","faufsb"].concat(An,go),ho=["solid","regular","light","thin","duotone","brands","semibold"],Oa=[1,2,3,4,5,6,7,8,9,10],vo=Oa.concat([11,12,13,14,15,16,17,18,19,20]),bo=["aw","fw","pull-left","pull-right"],yo=[].concat(W(Object.keys(po)),ho,bo,["2xs","xs","sm","lg","xl","2xl","beat","border","fade","beat-fade","bounce","flip-both","flip-horizontal","flip-vertical","flip","inverse","layers","layers-bottom-left","layers-bottom-right","layers-counter","layers-text","layers-top-left","layers-top-right","li","pull-end","pull-start","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","stack-1x","stack-2x","stack","ul","width-auto","width-fixed",_e.GROUP,_e.SWAP_OPACITY,_e.PRIMARY,_e.SECONDARY]).concat(Oa.map(function(e){return"".concat(e,"x")})).concat(vo.map(function(e){return"w-".concat(e)})),xo={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}},J="___FONT_AWESOME___",qe=16,$a="fa",Da="svg-inline--fa",re="data-fa-i2svg",Ye="data-fa-pseudo-element",wo="data-fa-pseudo-element-pending",it="data-prefix",st="data-icon",Et="fontawesome-i2svg",_o="async",Co=["HTML","HEAD","STYLE","SCRIPT"],La=["::before","::after",":before",":after"],Ma=(function(){try{return!0}catch{return!1}})();function ye(e){return new Proxy(e,{get:function(a,r){return r in a?a[r]:a[$]}})}var Ra=f({},ma);Ra[$]=f(f(f(f({},{"fa-duotone":"duotone"}),ma[$]),It.kit),It["kit-duotone"]);var So=ye(Ra),He=f({},hn);He[$]=f(f(f(f({},{duotone:"fad"}),He[$]),kt.kit),kt["kit-duotone"]);var Ft=ye(He),Be=f({},Xe);Be[$]=f(f({},Be[$]),Sn.kit);var lt=ye(Be),Ge=f({},mo);Ge[$]=f(f({},Ge[$]),_n.kit);ye(Ge);var Ao=Yr,za="fa-layers-text",Po=Hr,No=f({},mn);ye(No);var Io=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],Le=Br,ko=[].concat(W(vn),W(yo)),de=Z.FontAwesomeConfig||{};function Eo(e){var t=k.querySelector("script["+e+"]");if(t)return t.getAttribute(e)}function Fo(e){return e===""?!0:e==="false"?!1:e==="true"?!0:e}if(k&&typeof k.querySelector=="function"){var jo=[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-search-pseudo-elements","searchPseudoElements"],["data-search-pseudo-elements-warnings","searchPseudoElementsWarnings"],["data-search-pseudo-elements-full-scan","searchPseudoElementsFullScan"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]];jo.forEach(function(e){var t=ke(e,2),a=t[0],r=t[1],n=Fo(Eo(a));n!=null&&(de[r]=n)})}var Ua={styleDefault:"solid",familyDefault:$,cssPrefix:$a,replacementClass:Da,autoReplaceSvg:!0,autoAddCss:!0,searchPseudoElements:!1,searchPseudoElementsWarnings:!0,searchPseudoElementsFullScan:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};de.familyPrefix&&(de.cssPrefix=de.familyPrefix);var ce=f(f({},Ua),de);ce.autoReplaceSvg||(ce.observeMutations=!1);var h={};Object.keys(Ua).forEach(function(e){Object.defineProperty(h,e,{enumerable:!0,set:function(a){ce[e]=a,me.forEach(function(r){return r(h)})},get:function(){return ce[e]}})});Object.defineProperty(h,"familyPrefix",{enumerable:!0,set:function(t){ce.cssPrefix=t,me.forEach(function(a){return a(h)})},get:function(){return ce.cssPrefix}});Z.FontAwesomeConfig=h;var me=[];function To(e){return me.push(e),function(){me.splice(me.indexOf(e),1)}}var oe=qe,Y={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function Oo(e){if(!(!e||!K)){var t=k.createElement("style");t.setAttribute("type","text/css"),t.innerHTML=e;for(var a=k.head.childNodes,r=null,n=a.length-1;n>-1;n--){var o=a[n],i=(o.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(i)>-1&&(r=o)}return k.head.insertBefore(t,r),e}}var $o="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function jt(){for(var e=12,t="";e-- >0;)t+=$o[Math.random()*62|0];return t}function fe(e){for(var t=[],a=(e||[]).length>>>0;a--;)t[a]=e[a];return t}function ct(e){return e.classList?fe(e.classList):(e.getAttribute("class")||"").split(" ").filter(function(t){return t})}function Wa(e){return"".concat(e).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Do(e){return Object.keys(e||{}).reduce(function(t,a){return t+"".concat(a,'="').concat(Wa(e[a]),'" ')},"").trim()}function Ee(e){return Object.keys(e||{}).reduce(function(t,a){return t+"".concat(a,": ").concat(e[a].trim(),";")},"")}function ft(e){return e.size!==Y.size||e.x!==Y.x||e.y!==Y.y||e.rotate!==Y.rotate||e.flipX||e.flipY}function Lo(e){var t=e.transform,a=e.containerWidth,r=e.iconWidth,n={transform:"translate(".concat(a/2," 256)")},o="translate(".concat(t.x*32,", ").concat(t.y*32,") "),i="scale(".concat(t.size/16*(t.flipX?-1:1),", ").concat(t.size/16*(t.flipY?-1:1),") "),s="rotate(".concat(t.rotate," 0 0)"),l={transform:"".concat(o," ").concat(i," ").concat(s)},c={transform:"translate(".concat(r/2*-1," -256)")};return{outer:n,inner:l,path:c}}function Mo(e){var t=e.transform,a=e.width,r=a===void 0?qe:a,n=e.height,o=n===void 0?qe:n,i="";return da?i+="translate(".concat(t.x/oe-r/2,"em, ").concat(t.y/oe-o/2,"em) "):i+="translate(calc(-50% + ".concat(t.x/oe,"em), calc(-50% + ").concat(t.y/oe,"em)) "),i+="scale(".concat(t.size/oe*(t.flipX?-1:1),", ").concat(t.size/oe*(t.flipY?-1:1),") "),i+="rotate(".concat(t.rotate,"deg) "),i}var Ro=`:root, :host {
  --fa-font-solid: normal 900 1em/1 "Font Awesome 7 Free";
  --fa-font-regular: normal 400 1em/1 "Font Awesome 7 Free";
  --fa-font-light: normal 300 1em/1 "Font Awesome 7 Pro";
  --fa-font-thin: normal 100 1em/1 "Font Awesome 7 Pro";
  --fa-font-duotone: normal 900 1em/1 "Font Awesome 7 Duotone";
  --fa-font-duotone-regular: normal 400 1em/1 "Font Awesome 7 Duotone";
  --fa-font-duotone-light: normal 300 1em/1 "Font Awesome 7 Duotone";
  --fa-font-duotone-thin: normal 100 1em/1 "Font Awesome 7 Duotone";
  --fa-font-brands: normal 400 1em/1 "Font Awesome 7 Brands";
  --fa-font-sharp-solid: normal 900 1em/1 "Font Awesome 7 Sharp";
  --fa-font-sharp-regular: normal 400 1em/1 "Font Awesome 7 Sharp";
  --fa-font-sharp-light: normal 300 1em/1 "Font Awesome 7 Sharp";
  --fa-font-sharp-thin: normal 100 1em/1 "Font Awesome 7 Sharp";
  --fa-font-sharp-duotone-solid: normal 900 1em/1 "Font Awesome 7 Sharp Duotone";
  --fa-font-sharp-duotone-regular: normal 400 1em/1 "Font Awesome 7 Sharp Duotone";
  --fa-font-sharp-duotone-light: normal 300 1em/1 "Font Awesome 7 Sharp Duotone";
  --fa-font-sharp-duotone-thin: normal 100 1em/1 "Font Awesome 7 Sharp Duotone";
  --fa-font-slab-regular: normal 400 1em/1 "Font Awesome 7 Slab";
  --fa-font-slab-press-regular: normal 400 1em/1 "Font Awesome 7 Slab Press";
  --fa-font-whiteboard-semibold: normal 600 1em/1 "Font Awesome 7 Whiteboard";
  --fa-font-thumbprint-light: normal 300 1em/1 "Font Awesome 7 Thumbprint";
  --fa-font-notdog-solid: normal 900 1em/1 "Font Awesome 7 Notdog";
  --fa-font-notdog-duo-solid: normal 900 1em/1 "Font Awesome 7 Notdog Duo";
  --fa-font-etch-solid: normal 900 1em/1 "Font Awesome 7 Etch";
  --fa-font-jelly-regular: normal 400 1em/1 "Font Awesome 7 Jelly";
  --fa-font-jelly-fill-regular: normal 400 1em/1 "Font Awesome 7 Jelly Fill";
  --fa-font-jelly-duo-regular: normal 400 1em/1 "Font Awesome 7 Jelly Duo";
  --fa-font-chisel-regular: normal 400 1em/1 "Font Awesome 7 Chisel";
  --fa-font-utility-semibold: normal 600 1em/1 "Font Awesome 7 Utility";
  --fa-font-utility-duo-semibold: normal 600 1em/1 "Font Awesome 7 Utility Duo";
  --fa-font-utility-fill-semibold: normal 600 1em/1 "Font Awesome 7 Utility Fill";
}

.svg-inline--fa {
  box-sizing: content-box;
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285714em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left,
.svg-inline--fa .fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-pull-right,
.svg-inline--fa .fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  inset-block-start: 0.25em; /* syncing vertical alignment with Web Font rendering */
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.fa-layers .svg-inline--fa {
  inset: 0;
  margin: auto;
  position: absolute;
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: calc(10 / 16 * 1em); /* converts a 10px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 10 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 10 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xs {
  font-size: calc(12 / 16 * 1em); /* converts a 12px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 12 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 12 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-sm {
  font-size: calc(14 / 16 * 1em); /* converts a 14px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 14 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 14 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-lg {
  font-size: calc(20 / 16 * 1em); /* converts a 20px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 20 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 20 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xl {
  font-size: calc(24 / 16 * 1em); /* converts a 24px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 24 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 24 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-2xl {
  font-size: calc(32 / 16 * 1em); /* converts a 32px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 32 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 32 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-width-auto {
  --fa-width: auto;
}

.fa-fw,
.fa-width-fixed {
  --fa-width: 1.25em;
}

.fa-ul {
  list-style-type: none;
  margin-inline-start: var(--fa-li-margin, 2.5em);
  padding-inline-start: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

/* Heads Up: Bordered Icons will not be supported in the future!
  - This feature will be deprecated in the next major release of Font Awesome (v8)!
  - You may continue to use it in this version *v7), but it will not be supported in Font Awesome v8.
*/
/* Notes:
* --@{v.$css-prefix}-border-width = 1/16 by default (to render as ~1px based on a 16px default font-size)
* --@{v.$css-prefix}-border-padding =
  ** 3/16 for vertical padding (to give ~2px of vertical whitespace around an icon considering it's vertical alignment)
  ** 4/16 for horizontal padding (to give ~4px of horizontal whitespace around an icon)
*/
.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.0625em);
  box-sizing: var(--fa-border-box-sizing, content-box);
  padding: var(--fa-border-padding, 0.1875em 0.25em);
}

.fa-pull-left,
.fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right,
.fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.4, 0, 0.6, 1));
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
  .fa-bounce,
  .fa-fade,
  .fa-beat-fade,
  .fa-flip,
  .fa-pulse,
  .fa-shake,
  .fa-spin,
  .fa-spin-pulse {
    animation: none !important;
    transition: none !important;
  }
}
@keyframes fa-beat {
  0%, 90% {
    transform: scale(1);
  }
  45% {
    transform: scale(var(--fa-beat-scale, 1.25));
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
  }
  10% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);
  }
  30% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));
  }
  50% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.05), var(--fa-bounce-land-scale-y, 0.95)) translateY(0);
  }
  57% {
    transform: scale(1, 1) translateY(var(--fa-bounce-rebound, -0.125em));
  }
  64% {
    transform: scale(1, 1) translateY(0);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  50% {
    opacity: var(--fa-fade-opacity, 0.4);
  }
}
@keyframes fa-beat-fade {
  0%, 100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.125));
  }
}
@keyframes fa-flip {
  50% {
    transform: rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(-15deg);
  }
  4% {
    transform: rotate(15deg);
  }
  8%, 24% {
    transform: rotate(-18deg);
  }
  12%, 28% {
    transform: rotate(18deg);
  }
  16% {
    transform: rotate(-22deg);
  }
  20% {
    transform: rotate(22deg);
  }
  32% {
    transform: rotate(-12deg);
  }
  36% {
    transform: rotate(12deg);
  }
  40%, 100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}

.svg-inline--fa.fa-inverse {
  fill: var(--fa-inverse, #fff);
}

.fa-stack {
  display: inline-block;
  height: 2em;
  line-height: 2em;
  position: relative;
  vertical-align: middle;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.svg-inline--fa.fa-stack-1x {
  --fa-width: 1.25em;
  height: 1em;
  width: var(--fa-width);
}
.svg-inline--fa.fa-stack-2x {
  --fa-width: 2.5em;
  height: 2em;
  width: var(--fa-width);
}

.fa-stack-1x,
.fa-stack-2x {
  inset: 0;
  margin: auto;
  position: absolute;
  z-index: var(--fa-stack-z-index, auto);
}`;function Xa(){var e=$a,t=Da,a=h.cssPrefix,r=h.replacementClass,n=Ro;if(a!==e||r!==t){var o=new RegExp("\\.".concat(e,"\\-"),"g"),i=new RegExp("\\--".concat(e,"\\-"),"g"),s=new RegExp("\\.".concat(t),"g");n=n.replace(o,".".concat(a,"-")).replace(i,"--".concat(a,"-")).replace(s,".".concat(r))}return n}var Tt=!1;function Me(){h.autoAddCss&&!Tt&&(Oo(Xa()),Tt=!0)}var zo={mixout:function(){return{dom:{css:Xa,insertCss:Me}}},hooks:function(){return{beforeDOMElementCreation:function(){Me()},beforeI2svg:function(){Me()}}}},V=Z||{};V[J]||(V[J]={});V[J].styles||(V[J].styles={});V[J].hooks||(V[J].hooks={});V[J].shims||(V[J].shims=[]);var U=V[J],qa=[],Ya=function(){k.removeEventListener("DOMContentLoaded",Ya),Ne=1,qa.map(function(t){return t()})},Ne=!1;K&&(Ne=(k.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(k.readyState),Ne||k.addEventListener("DOMContentLoaded",Ya));function Uo(e){K&&(Ne?setTimeout(e,0):qa.push(e))}function xe(e){var t=e.tag,a=e.attributes,r=a===void 0?{}:a,n=e.children,o=n===void 0?[]:n;return typeof e=="string"?Wa(e):"<".concat(t," ").concat(Do(r),">").concat(o.map(xe).join(""),"</").concat(t,">")}function Ot(e,t,a){if(e&&e[t]&&e[t][a])return{prefix:t,iconName:a,icon:e[t][a]}}var Re=function(t,a,r,n){var o=Object.keys(t),i=o.length,s=a,l,c,d;for(r===void 0?(l=1,d=t[o[0]]):(l=0,d=r);l<i;l++)c=o[l],d=s(d,t[c],c,t);return d};function Ha(e){return W(e).length!==1?null:e.codePointAt(0).toString(16)}function $t(e){return Object.keys(e).reduce(function(t,a){var r=e[a],n=!!r.icon;return n?t[r.iconName]=r.icon:t[a]=r,t},{})}function Je(e,t){var a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},r=a.skipHooks,n=r===void 0?!1:r,o=$t(t);typeof U.hooks.addPack=="function"&&!n?U.hooks.addPack(e,$t(t)):U.styles[e]=f(f({},U.styles[e]||{}),o),e==="fas"&&Je("fa",t)}var ge=U.styles,Wo=U.shims,Ba=Object.keys(lt),Xo=Ba.reduce(function(e,t){return e[t]=Object.keys(lt[t]),e},{}),ut=null,Ga={},Ja={},Va={},Ka={},Qa={};function qo(e){return~ko.indexOf(e)}function Yo(e,t){var a=t.split("-"),r=a[0],n=a.slice(1).join("-");return r===e&&n!==""&&!qo(n)?n:null}var Za=function(){var t=function(o){return Re(ge,function(i,s,l){return i[l]=Re(s,o,{}),i},{})};Ga=t(function(n,o,i){if(o[3]&&(n[o[3]]=i),o[2]){var s=o[2].filter(function(l){return typeof l=="number"});s.forEach(function(l){n[l.toString(16)]=i})}return n}),Ja=t(function(n,o,i){if(n[i]=i,o[2]){var s=o[2].filter(function(l){return typeof l=="string"});s.forEach(function(l){n[l]=i})}return n}),Qa=t(function(n,o,i){var s=o[2];return n[i]=i,s.forEach(function(l){n[l]=i}),n});var a="far"in ge||h.autoFetchSvg,r=Re(Wo,function(n,o){var i=o[0],s=o[1],l=o[2];return s==="far"&&!a&&(s="fas"),typeof i=="string"&&(n.names[i]={prefix:s,iconName:l}),typeof i=="number"&&(n.unicodes[i.toString(16)]={prefix:s,iconName:l}),n},{names:{},unicodes:{}});Va=r.names,Ka=r.unicodes,ut=Fe(h.styleDefault,{family:h.familyDefault})};To(function(e){ut=Fe(e.styleDefault,{family:h.familyDefault})});Za();function dt(e,t){return(Ga[e]||{})[t]}function Ho(e,t){return(Ja[e]||{})[t]}function ae(e,t){return(Qa[e]||{})[t]}function er(e){return Va[e]||{prefix:null,iconName:null}}function Bo(e){var t=Ka[e],a=dt("fas",e);return t||(a?{prefix:"fas",iconName:a}:null)||{prefix:null,iconName:null}}function ee(){return ut}var tr=function(){return{prefix:null,iconName:null,rest:[]}};function Go(e){var t=$,a=Ba.reduce(function(r,n){return r[n]="".concat(h.cssPrefix,"-").concat(n),r},{});return Fa.forEach(function(r){(e.includes(a[r])||e.some(function(n){return Xo[r].includes(n)}))&&(t=r)}),t}function Fe(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=t.family,r=a===void 0?$:a,n=So[r][e];if(r===be&&!e)return"fad";var o=Ft[r][e]||Ft[r][n],i=e in U.styles?e:null,s=o||i||null;return s}function Jo(e){var t=[],a=null;return e.forEach(function(r){var n=Yo(h.cssPrefix,r);n?a=n:r&&t.push(r)}),{iconName:a,rest:t}}function Dt(e){return e.sort().filter(function(t,a,r){return r.indexOf(t)===a})}var Lt=Ta.concat(ja);function je(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=t.skipLookups,r=a===void 0?!1:a,n=null,o=Dt(e.filter(function(g){return Lt.includes(g)})),i=Dt(e.filter(function(g){return!Lt.includes(g)})),s=o.filter(function(g){return n=g,!pa.includes(g)}),l=ke(s,1),c=l[0],d=c===void 0?null:c,u=Go(o),v=f(f({},Jo(i)),{},{prefix:Fe(d,{family:u})});return f(f(f({},v),Zo({values:e,family:u,styles:ge,config:h,canonical:v,givenPrefix:n})),Vo(r,n,v))}function Vo(e,t,a){var r=a.prefix,n=a.iconName;if(e||!r||!n)return{prefix:r,iconName:n};var o=t==="fa"?er(n):{},i=ae(r,n);return n=o.iconName||i||n,r=o.prefix||r,r==="far"&&!ge.far&&ge.fas&&!h.autoFetchSvg&&(r="fas"),{prefix:r,iconName:n}}var Ko=Fa.filter(function(e){return e!==$||e!==be}),Qo=Object.keys(Xe).filter(function(e){return e!==$}).map(function(e){return Object.keys(Xe[e])}).flat();function Zo(e){var t=e.values,a=e.family,r=e.canonical,n=e.givenPrefix,o=n===void 0?"":n,i=e.styles,s=i===void 0?{}:i,l=e.config,c=l===void 0?{}:l,d=a===be,u=t.includes("fa-duotone")||t.includes("fad"),v=c.familyDefault==="duotone",g=r.prefix==="fad"||r.prefix==="fa-duotone";if(!d&&(u||v||g)&&(r.prefix="fad"),(t.includes("fa-brands")||t.includes("fab"))&&(r.prefix="fab"),!r.prefix&&Ko.includes(a)){var x=Object.keys(s).find(function(N){return Qo.includes(N)});if(x||c.autoFetchSvg){var S=gn.get(a).defaultShortPrefixId;r.prefix=S,r.iconName=ae(r.prefix,r.iconName)||r.iconName}}return(r.prefix==="fa"||o==="fa")&&(r.prefix=ee()||"fas"),r}var ei=(function(){function e(){Dr(this,e),this.definitions={}}return Mr(e,[{key:"add",value:function(){for(var a=this,r=arguments.length,n=new Array(r),o=0;o<r;o++)n[o]=arguments[o];var i=n.reduce(this._pullDefinitions,{});Object.keys(i).forEach(function(s){a.definitions[s]=f(f({},a.definitions[s]||{}),i[s]),Je(s,i[s]);var l=lt[$][s];l&&Je(l,i[s]),Za()})}},{key:"reset",value:function(){this.definitions={}}},{key:"_pullDefinitions",value:function(a,r){var n=r.prefix&&r.iconName&&r.icon?{0:r}:r;return Object.keys(n).map(function(o){var i=n[o],s=i.prefix,l=i.iconName,c=i.icon,d=c[2];a[s]||(a[s]={}),d.length>0&&d.forEach(function(u){typeof u=="string"&&(a[s][u]=c)}),a[s][l]=c}),a}}])})(),Mt=[],se={},le={},ti=Object.keys(le);function ai(e,t){var a=t.mixoutsTo;return Mt=e,se={},Object.keys(le).forEach(function(r){ti.indexOf(r)===-1&&delete le[r]}),Mt.forEach(function(r){var n=r.mixout?r.mixout():{};if(Object.keys(n).forEach(function(i){typeof n[i]=="function"&&(a[i]=n[i]),Pe(n[i])==="object"&&Object.keys(n[i]).forEach(function(s){a[i]||(a[i]={}),a[i][s]=n[i][s]})}),r.hooks){var o=r.hooks();Object.keys(o).forEach(function(i){se[i]||(se[i]=[]),se[i].push(o[i])})}r.provides&&r.provides(le)}),a}function Ve(e,t){for(var a=arguments.length,r=new Array(a>2?a-2:0),n=2;n<a;n++)r[n-2]=arguments[n];var o=se[e]||[];return o.forEach(function(i){t=i.apply(null,[t].concat(r))}),t}function ne(e){for(var t=arguments.length,a=new Array(t>1?t-1:0),r=1;r<t;r++)a[r-1]=arguments[r];var n=se[e]||[];n.forEach(function(o){o.apply(null,a)})}function te(){var e=arguments[0],t=Array.prototype.slice.call(arguments,1);return le[e]?le[e].apply(null,t):void 0}function Ke(e){e.prefix==="fa"&&(e.prefix="fas");var t=e.iconName,a=e.prefix||ee();if(t)return t=ae(a,t)||t,Ot(ar.definitions,a,t)||Ot(U.styles,a,t)}var ar=new ei,ri=function(){h.autoReplaceSvg=!1,h.observeMutations=!1,ne("noAuto")},ni={i2svg:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return K?(ne("beforeI2svg",t),te("pseudoElements2svg",t),te("i2svg",t)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},a=t.autoReplaceSvgRoot;h.autoReplaceSvg===!1&&(h.autoReplaceSvg=!0),h.observeMutations=!0,Uo(function(){ii({autoReplaceSvgRoot:a}),ne("watch",t)})}},oi={icon:function(t){if(t===null)return null;if(Pe(t)==="object"&&t.prefix&&t.iconName)return{prefix:t.prefix,iconName:ae(t.prefix,t.iconName)||t.iconName};if(Array.isArray(t)&&t.length===2){var a=t[1].indexOf("fa-")===0?t[1].slice(3):t[1],r=Fe(t[0]);return{prefix:r,iconName:ae(r,a)||a}}if(typeof t=="string"&&(t.indexOf("".concat(h.cssPrefix,"-"))>-1||t.match(Ao))){var n=je(t.split(" "),{skipLookups:!0});return{prefix:n.prefix||ee(),iconName:ae(n.prefix,n.iconName)||n.iconName}}if(typeof t=="string"){var o=ee();return{prefix:o,iconName:ae(o,t)||t}}}},R={noAuto:ri,config:h,dom:ni,parse:oi,library:ar,findIconDefinition:Ke,toHtml:xe},ii=function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},a=t.autoReplaceSvgRoot,r=a===void 0?k:a;(Object.keys(U.styles).length>0||h.autoFetchSvg)&&K&&h.autoReplaceSvg&&R.dom.i2svg({node:r})};function Te(e,t){return Object.defineProperty(e,"abstract",{get:t}),Object.defineProperty(e,"html",{get:function(){return e.abstract.map(function(r){return xe(r)})}}),Object.defineProperty(e,"node",{get:function(){if(K){var r=k.createElement("div");return r.innerHTML=e.html,r.children}}}),e}function si(e){var t=e.children,a=e.main,r=e.mask,n=e.attributes,o=e.styles,i=e.transform;if(ft(i)&&a.found&&!r.found){var s=a.width,l=a.height,c={x:s/l/2,y:.5};n.style=Ee(f(f({},o),{},{"transform-origin":"".concat(c.x+i.x/16,"em ").concat(c.y+i.y/16,"em")}))}return[{tag:"svg",attributes:n,children:t}]}function li(e){var t=e.prefix,a=e.iconName,r=e.children,n=e.attributes,o=e.symbol,i=o===!0?"".concat(t,"-").concat(h.cssPrefix,"-").concat(a):o;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:f(f({},n),{},{id:i}),children:r}]}]}function ci(e){var t=["aria-label","aria-labelledby","title","role"];return t.some(function(a){return a in e})}function mt(e){var t=e.icons,a=t.main,r=t.mask,n=e.prefix,o=e.iconName,i=e.transform,s=e.symbol,l=e.maskId,c=e.extra,d=e.watchable,u=d===void 0?!1:d,v=r.found?r:a,g=v.width,x=v.height,S=[h.replacementClass,o?"".concat(h.cssPrefix,"-").concat(o):""].filter(function(b){return c.classes.indexOf(b)===-1}).filter(function(b){return b!==""||!!b}).concat(c.classes).join(" "),N={children:[],attributes:f(f({},c.attributes),{},{"data-prefix":n,"data-icon":o,class:S,role:c.attributes.role||"img",viewBox:"0 0 ".concat(g," ").concat(x)})};!ci(c.attributes)&&!c.attributes["aria-hidden"]&&(N.attributes["aria-hidden"]="true"),u&&(N.attributes[re]="");var I=f(f({},N),{},{prefix:n,iconName:o,main:a,mask:r,maskId:l,transform:i,symbol:s,styles:f({},c.styles)}),j=r.found&&a.found?te("generateAbstractMask",I)||{children:[],attributes:{}}:te("generateAbstractIcon",I)||{children:[],attributes:{}},T=j.children,C=j.attributes;return I.children=T,I.attributes=C,s?li(I):si(I)}function Rt(e){var t=e.content,a=e.width,r=e.height,n=e.transform,o=e.extra,i=e.watchable,s=i===void 0?!1:i,l=f(f({},o.attributes),{},{class:o.classes.join(" ")});s&&(l[re]="");var c=f({},o.styles);ft(n)&&(c.transform=Mo({transform:n,width:a,height:r}),c["-webkit-transform"]=c.transform);var d=Ee(c);d.length>0&&(l.style=d);var u=[];return u.push({tag:"span",attributes:l,children:[t]}),u}function fi(e){var t=e.content,a=e.extra,r=f(f({},a.attributes),{},{class:a.classes.join(" ")}),n=Ee(a.styles);n.length>0&&(r.style=n);var o=[];return o.push({tag:"span",attributes:r,children:[t]}),o}var ze=U.styles;function Qe(e){var t=e[0],a=e[1],r=e.slice(4),n=ke(r,1),o=n[0],i=null;return Array.isArray(o)?i={tag:"g",attributes:{class:"".concat(h.cssPrefix,"-").concat(Le.GROUP)},children:[{tag:"path",attributes:{class:"".concat(h.cssPrefix,"-").concat(Le.SECONDARY),fill:"currentColor",d:o[0]}},{tag:"path",attributes:{class:"".concat(h.cssPrefix,"-").concat(Le.PRIMARY),fill:"currentColor",d:o[1]}}]}:i={tag:"path",attributes:{fill:"currentColor",d:o}},{found:!0,width:t,height:a,icon:i}}var ui={found:!1,width:512,height:512};function di(e,t){!Ma&&!h.showMissingIcons&&e&&console.error('Icon with name "'.concat(e,'" and prefix "').concat(t,'" is missing.'))}function Ze(e,t){var a=t;return t==="fa"&&h.styleDefault!==null&&(t=ee()),new Promise(function(r,n){if(a==="fa"){var o=er(e)||{};e=o.iconName||e,t=o.prefix||t}if(e&&t&&ze[t]&&ze[t][e]){var i=ze[t][e];return r(Qe(i))}di(e,t),r(f(f({},ui),{},{icon:h.showMissingIcons&&e?te("missingIconAbstract")||{}:{}}))})}var zt=function(){},et=h.measurePerformance&&we&&we.mark&&we.measure?we:{mark:zt,measure:zt},ue='FA "7.1.0"',mi=function(t){return et.mark("".concat(ue," ").concat(t," begins")),function(){return rr(t)}},rr=function(t){et.mark("".concat(ue," ").concat(t," ends")),et.measure("".concat(ue," ").concat(t),"".concat(ue," ").concat(t," begins"),"".concat(ue," ").concat(t," ends"))},pt={begin:mi,end:rr},Se=function(){};function Ut(e){var t=e.getAttribute?e.getAttribute(re):null;return typeof t=="string"}function pi(e){var t=e.getAttribute?e.getAttribute(it):null,a=e.getAttribute?e.getAttribute(st):null;return t&&a}function gi(e){return e&&e.classList&&e.classList.contains&&e.classList.contains(h.replacementClass)}function hi(){if(h.autoReplaceSvg===!0)return Ae.replace;var e=Ae[h.autoReplaceSvg];return e||Ae.replace}function vi(e){return k.createElementNS("http://www.w3.org/2000/svg",e)}function bi(e){return k.createElement(e)}function nr(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},a=t.ceFn,r=a===void 0?e.tag==="svg"?vi:bi:a;if(typeof e=="string")return k.createTextNode(e);var n=r(e.tag);Object.keys(e.attributes||[]).forEach(function(i){n.setAttribute(i,e.attributes[i])});var o=e.children||[];return o.forEach(function(i){n.appendChild(nr(i,{ceFn:r}))}),n}function yi(e){var t=" ".concat(e.outerHTML," ");return t="".concat(t,"Font Awesome fontawesome.com "),t}var Ae={replace:function(t){var a=t[0];if(a.parentNode)if(t[1].forEach(function(n){a.parentNode.insertBefore(nr(n),a)}),a.getAttribute(re)===null&&h.keepOriginalSource){var r=k.createComment(yi(a));a.parentNode.replaceChild(r,a)}else a.remove()},nest:function(t){var a=t[0],r=t[1];if(~ct(a).indexOf(h.replacementClass))return Ae.replace(t);var n=new RegExp("".concat(h.cssPrefix,"-.*"));if(delete r[0].attributes.id,r[0].attributes.class){var o=r[0].attributes.class.split(" ").reduce(function(s,l){return l===h.replacementClass||l.match(n)?s.toSvg.push(l):s.toNode.push(l),s},{toNode:[],toSvg:[]});r[0].attributes.class=o.toSvg.join(" "),o.toNode.length===0?a.removeAttribute("class"):a.setAttribute("class",o.toNode.join(" "))}var i=r.map(function(s){return xe(s)}).join(`
`);a.setAttribute(re,""),a.innerHTML=i}};function Wt(e){e()}function or(e,t){var a=typeof t=="function"?t:Se;if(e.length===0)a();else{var r=Wt;h.mutateApproach===_o&&(r=Z.requestAnimationFrame||Wt),r(function(){var n=hi(),o=pt.begin("mutate");e.map(n),o(),a()})}}var gt=!1;function ir(){gt=!0}function tt(){gt=!1}var Ie=null;function Xt(e){if(Nt&&h.observeMutations){var t=e.treeCallback,a=t===void 0?Se:t,r=e.nodeCallback,n=r===void 0?Se:r,o=e.pseudoElementsCallback,i=o===void 0?Se:o,s=e.observeMutationsRoot,l=s===void 0?k:s;Ie=new Nt(function(c){if(!gt){var d=ee();fe(c).forEach(function(u){if(u.type==="childList"&&u.addedNodes.length>0&&!Ut(u.addedNodes[0])&&(h.searchPseudoElements&&i(u.target),a(u.target)),u.type==="attributes"&&u.target.parentNode&&h.searchPseudoElements&&i([u.target],!0),u.type==="attributes"&&Ut(u.target)&&~Io.indexOf(u.attributeName))if(u.attributeName==="class"&&pi(u.target)){var v=je(ct(u.target)),g=v.prefix,x=v.iconName;u.target.setAttribute(it,g||d),x&&u.target.setAttribute(st,x)}else gi(u.target)&&n(u.target)})}}),K&&Ie.observe(l,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}}function xi(){Ie&&Ie.disconnect()}function wi(e){var t=e.getAttribute("style"),a=[];return t&&(a=t.split(";").reduce(function(r,n){var o=n.split(":"),i=o[0],s=o.slice(1);return i&&s.length>0&&(r[i]=s.join(":").trim()),r},{})),a}function _i(e){var t=e.getAttribute("data-prefix"),a=e.getAttribute("data-icon"),r=e.innerText!==void 0?e.innerText.trim():"",n=je(ct(e));return n.prefix||(n.prefix=ee()),t&&a&&(n.prefix=t,n.iconName=a),n.iconName&&n.prefix||(n.prefix&&r.length>0&&(n.iconName=Ho(n.prefix,e.innerText)||dt(n.prefix,Ha(e.innerText))),!n.iconName&&h.autoFetchSvg&&e.firstChild&&e.firstChild.nodeType===Node.TEXT_NODE&&(n.iconName=e.firstChild.data)),n}function Ci(e){var t=fe(e.attributes).reduce(function(a,r){return a.name!=="class"&&a.name!=="style"&&(a[r.name]=r.value),a},{});return t}function Si(){return{iconName:null,prefix:null,transform:Y,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function qt(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},a=_i(e),r=a.iconName,n=a.prefix,o=a.rest,i=Ci(e),s=Ve("parseNodeAttributes",{},e),l=t.styleParser?wi(e):[];return f({iconName:r,prefix:n,transform:Y,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:o,styles:l,attributes:i}},s)}var Ai=U.styles;function sr(e){var t=h.autoReplaceSvg==="nest"?qt(e,{styleParser:!1}):qt(e);return~t.extra.classes.indexOf(za)?te("generateLayersText",e,t):te("generateSvgReplacementMutation",e,t)}function Pi(){return[].concat(W(ja),W(Ta))}function Yt(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!K)return Promise.resolve();var a=k.documentElement.classList,r=function(u){return a.add("".concat(Et,"-").concat(u))},n=function(u){return a.remove("".concat(Et,"-").concat(u))},o=h.autoFetchSvg?Pi():pa.concat(Object.keys(Ai));o.includes("fa")||o.push("fa");var i=[".".concat(za,":not([").concat(re,"])")].concat(o.map(function(d){return".".concat(d,":not([").concat(re,"])")})).join(", ");if(i.length===0)return Promise.resolve();var s=[];try{s=fe(e.querySelectorAll(i))}catch{}if(s.length>0)r("pending"),n("complete");else return Promise.resolve();var l=pt.begin("onTree"),c=s.reduce(function(d,u){try{var v=sr(u);v&&d.push(v)}catch(g){Ma||g.name==="MissingIcon"&&console.error(g)}return d},[]);return new Promise(function(d,u){Promise.all(c).then(function(v){or(v,function(){r("active"),r("complete"),n("pending"),typeof t=="function"&&t(),l(),d()})}).catch(function(v){l(),u(v)})})}function Ni(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;sr(e).then(function(a){a&&or([a],t)})}function Ii(e){return function(t){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=(t||{}).icon?t:Ke(t||{}),n=a.mask;return n&&(n=(n||{}).icon?n:Ke(n||{})),e(r,f(f({},a),{},{mask:n}))}}var ki=function(t){var a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=a.transform,n=r===void 0?Y:r,o=a.symbol,i=o===void 0?!1:o,s=a.mask,l=s===void 0?null:s,c=a.maskId,d=c===void 0?null:c,u=a.classes,v=u===void 0?[]:u,g=a.attributes,x=g===void 0?{}:g,S=a.styles,N=S===void 0?{}:S;if(t){var I=t.prefix,j=t.iconName,T=t.icon;return Te(f({type:"icon"},t),function(){return ne("beforeDOMElementCreation",{iconDefinition:t,params:a}),mt({icons:{main:Qe(T),mask:l?Qe(l.icon):{found:!1,width:null,height:null,icon:{}}},prefix:I,iconName:j,transform:f(f({},Y),n),symbol:i,maskId:d,extra:{attributes:x,styles:N,classes:v}})})}},Ei={mixout:function(){return{icon:Ii(ki)}},hooks:function(){return{mutationObserverCallbacks:function(a){return a.treeCallback=Yt,a.nodeCallback=Ni,a}}},provides:function(t){t.i2svg=function(a){var r=a.node,n=r===void 0?k:r,o=a.callback,i=o===void 0?function(){}:o;return Yt(n,i)},t.generateSvgReplacementMutation=function(a,r){var n=r.iconName,o=r.prefix,i=r.transform,s=r.symbol,l=r.mask,c=r.maskId,d=r.extra;return new Promise(function(u,v){Promise.all([Ze(n,o),l.iconName?Ze(l.iconName,l.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(function(g){var x=ke(g,2),S=x[0],N=x[1];u([a,mt({icons:{main:S,mask:N},prefix:o,iconName:n,transform:i,symbol:s,maskId:c,extra:d,watchable:!0})])}).catch(v)})},t.generateAbstractIcon=function(a){var r=a.children,n=a.attributes,o=a.main,i=a.transform,s=a.styles,l=Ee(s);l.length>0&&(n.style=l);var c;return ft(i)&&(c=te("generateAbstractTransformGrouping",{main:o,transform:i,containerWidth:o.width,iconWidth:o.width})),r.push(c||o.icon),{children:r,attributes:n}}}},Fi={mixout:function(){return{layer:function(a){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=r.classes,o=n===void 0?[]:n;return Te({type:"layer"},function(){ne("beforeDOMElementCreation",{assembler:a,params:r});var i=[];return a(function(s){Array.isArray(s)?s.map(function(l){i=i.concat(l.abstract)}):i=i.concat(s.abstract)}),[{tag:"span",attributes:{class:["".concat(h.cssPrefix,"-layers")].concat(W(o)).join(" ")},children:i}]})}}}},ji={mixout:function(){return{counter:function(a){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};r.title;var n=r.classes,o=n===void 0?[]:n,i=r.attributes,s=i===void 0?{}:i,l=r.styles,c=l===void 0?{}:l;return Te({type:"counter",content:a},function(){return ne("beforeDOMElementCreation",{content:a,params:r}),fi({content:a.toString(),extra:{attributes:s,styles:c,classes:["".concat(h.cssPrefix,"-layers-counter")].concat(W(o))}})})}}}},Ti={mixout:function(){return{text:function(a){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=r.transform,o=n===void 0?Y:n,i=r.classes,s=i===void 0?[]:i,l=r.attributes,c=l===void 0?{}:l,d=r.styles,u=d===void 0?{}:d;return Te({type:"text",content:a},function(){return ne("beforeDOMElementCreation",{content:a,params:r}),Rt({content:a,transform:f(f({},Y),o),extra:{attributes:c,styles:u,classes:["".concat(h.cssPrefix,"-layers-text")].concat(W(s))}})})}}},provides:function(t){t.generateLayersText=function(a,r){var n=r.transform,o=r.extra,i=null,s=null;if(da){var l=parseInt(getComputedStyle(a).fontSize,10),c=a.getBoundingClientRect();i=c.width/l,s=c.height/l}return Promise.resolve([a,Rt({content:a.innerHTML,width:i,height:s,transform:n,extra:o,watchable:!0})])}}},lr=new RegExp('"',"ug"),Ht=[1105920,1112319],Bt=f(f(f(f({},{FontAwesome:{normal:"fas",400:"fas"}}),pn),xo),Cn),at=Object.keys(Bt).reduce(function(e,t){return e[t.toLowerCase()]=Bt[t],e},{}),Oi=Object.keys(at).reduce(function(e,t){var a=at[t];return e[t]=a[900]||W(Object.entries(a))[0][1],e},{});function $i(e){var t=e.replace(lr,"");return Ha(W(t)[0]||"")}function Di(e){var t=e.getPropertyValue("font-feature-settings").includes("ss01"),a=e.getPropertyValue("content"),r=a.replace(lr,""),n=r.codePointAt(0),o=n>=Ht[0]&&n<=Ht[1],i=r.length===2?r[0]===r[1]:!1;return o||i||t}function Li(e,t){var a=e.replace(/^['"]|['"]$/g,"").toLowerCase(),r=parseInt(t),n=isNaN(r)?"normal":r;return(at[a]||{})[n]||Oi[a]}function Gt(e,t){var a="".concat(wo).concat(t.replace(":","-"));return new Promise(function(r,n){if(e.getAttribute(a)!==null)return r();var o=fe(e.children),i=o.filter(function(O){return O.getAttribute(Ye)===t})[0],s=Z.getComputedStyle(e,t),l=s.getPropertyValue("font-family"),c=l.match(Po),d=s.getPropertyValue("font-weight"),u=s.getPropertyValue("content");if(i&&!c)return e.removeChild(i),r();if(c&&u!=="none"&&u!==""){var v=s.getPropertyValue("content"),g=Li(l,d),x=$i(v),S=c[0].startsWith("FontAwesome"),N=Di(s),I=dt(g,x),j=I;if(S){var T=Bo(x);T.iconName&&T.prefix&&(I=T.iconName,g=T.prefix)}if(I&&!N&&(!i||i.getAttribute(it)!==g||i.getAttribute(st)!==j)){e.setAttribute(a,j),i&&e.removeChild(i);var C=Si(),b=C.extra;b.attributes[Ye]=t,Ze(I,g).then(function(O){var vt=mt(f(f({},C),{},{icons:{main:O,mask:tr()},prefix:g,iconName:j,extra:b,watchable:!0})),X=k.createElementNS("http://www.w3.org/2000/svg","svg");t==="::before"?e.insertBefore(X,e.firstChild):e.appendChild(X),X.outerHTML=vt.map(function(q){return xe(q)}).join(`
`),e.removeAttribute(a),r()}).catch(n)}else r()}else r()})}function Mi(e){return Promise.all([Gt(e,"::before"),Gt(e,"::after")])}function Ri(e){return e.parentNode!==document.head&&!~Co.indexOf(e.tagName.toUpperCase())&&!e.getAttribute(Ye)&&(!e.parentNode||e.parentNode.tagName!=="svg")}var zi=function(t){return!!t&&La.some(function(a){return t.includes(a)})},Ui=function(t){if(!t)return[];var a=new Set,r=t.split(/,(?![^()]*\))/).map(function(l){return l.trim()});r=r.flatMap(function(l){return l.includes("(")?l:l.split(",").map(function(c){return c.trim()})});var n=Ce(r),o;try{for(n.s();!(o=n.n()).done;){var i=o.value;if(zi(i)){var s=La.reduce(function(l,c){return l.replace(c,"")},i);s!==""&&s!=="*"&&a.add(s)}}}catch(l){n.e(l)}finally{n.f()}return a};function Jt(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;if(K){var a;if(t)a=e;else if(h.searchPseudoElementsFullScan)a=e.querySelectorAll("*");else{var r=new Set,n=Ce(document.styleSheets),o;try{for(n.s();!(o=n.n()).done;){var i=o.value;try{var s=Ce(i.cssRules),l;try{for(s.s();!(l=s.n()).done;){var c=l.value,d=Ui(c.selectorText),u=Ce(d),v;try{for(u.s();!(v=u.n()).done;){var g=v.value;r.add(g)}}catch(S){u.e(S)}finally{u.f()}}}catch(S){s.e(S)}finally{s.f()}}catch(S){h.searchPseudoElementsWarnings&&console.warn("Font Awesome: cannot parse stylesheet: ".concat(i.href," (").concat(S.message,`)
If it declares any Font Awesome CSS pseudo-elements, they will not be rendered as SVG icons. Add crossorigin="anonymous" to the <link>, enable searchPseudoElementsFullScan for slower but more thorough DOM parsing, or suppress this warning by setting searchPseudoElementsWarnings to false.`))}}}catch(S){n.e(S)}finally{n.f()}if(!r.size)return;var x=Array.from(r).join(", ");try{a=e.querySelectorAll(x)}catch{}}return new Promise(function(S,N){var I=fe(a).filter(Ri).map(Mi),j=pt.begin("searchPseudoElements");ir(),Promise.all(I).then(function(){j(),tt(),S()}).catch(function(){j(),tt(),N()})})}}var Wi={hooks:function(){return{mutationObserverCallbacks:function(a){return a.pseudoElementsCallback=Jt,a}}},provides:function(t){t.pseudoElements2svg=function(a){var r=a.node,n=r===void 0?k:r;h.searchPseudoElements&&Jt(n)}}},Vt=!1,Xi={mixout:function(){return{dom:{unwatch:function(){ir(),Vt=!0}}}},hooks:function(){return{bootstrap:function(){Xt(Ve("mutationObserverCallbacks",{}))},noAuto:function(){xi()},watch:function(a){var r=a.observeMutationsRoot;Vt?tt():Xt(Ve("mutationObserverCallbacks",{observeMutationsRoot:r}))}}}},Kt=function(t){var a={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return t.toLowerCase().split(" ").reduce(function(r,n){var o=n.toLowerCase().split("-"),i=o[0],s=o.slice(1).join("-");if(i&&s==="h")return r.flipX=!0,r;if(i&&s==="v")return r.flipY=!0,r;if(s=parseFloat(s),isNaN(s))return r;switch(i){case"grow":r.size=r.size+s;break;case"shrink":r.size=r.size-s;break;case"left":r.x=r.x-s;break;case"right":r.x=r.x+s;break;case"up":r.y=r.y-s;break;case"down":r.y=r.y+s;break;case"rotate":r.rotate=r.rotate+s;break}return r},a)},qi={mixout:function(){return{parse:{transform:function(a){return Kt(a)}}}},hooks:function(){return{parseNodeAttributes:function(a,r){var n=r.getAttribute("data-fa-transform");return n&&(a.transform=Kt(n)),a}}},provides:function(t){t.generateAbstractTransformGrouping=function(a){var r=a.main,n=a.transform,o=a.containerWidth,i=a.iconWidth,s={transform:"translate(".concat(o/2," 256)")},l="translate(".concat(n.x*32,", ").concat(n.y*32,") "),c="scale(".concat(n.size/16*(n.flipX?-1:1),", ").concat(n.size/16*(n.flipY?-1:1),") "),d="rotate(".concat(n.rotate," 0 0)"),u={transform:"".concat(l," ").concat(c," ").concat(d)},v={transform:"translate(".concat(i/2*-1," -256)")},g={outer:s,inner:u,path:v};return{tag:"g",attributes:f({},g.outer),children:[{tag:"g",attributes:f({},g.inner),children:[{tag:r.icon.tag,children:r.icon.children,attributes:f(f({},r.icon.attributes),g.path)}]}]}}}},Ue={x:0,y:0,width:"100%",height:"100%"};function Qt(e){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return e.attributes&&(e.attributes.fill||t)&&(e.attributes.fill="black"),e}function Yi(e){return e.tag==="g"?e.children:[e]}var Hi={hooks:function(){return{parseNodeAttributes:function(a,r){var n=r.getAttribute("data-fa-mask"),o=n?je(n.split(" ").map(function(i){return i.trim()})):tr();return o.prefix||(o.prefix=ee()),a.mask=o,a.maskId=r.getAttribute("data-fa-mask-id"),a}}},provides:function(t){t.generateAbstractMask=function(a){var r=a.children,n=a.attributes,o=a.main,i=a.mask,s=a.maskId,l=a.transform,c=o.width,d=o.icon,u=i.width,v=i.icon,g=Lo({transform:l,containerWidth:u,iconWidth:c}),x={tag:"rect",attributes:f(f({},Ue),{},{fill:"white"})},S=d.children?{children:d.children.map(Qt)}:{},N={tag:"g",attributes:f({},g.inner),children:[Qt(f({tag:d.tag,attributes:f(f({},d.attributes),g.path)},S))]},I={tag:"g",attributes:f({},g.outer),children:[N]},j="mask-".concat(s||jt()),T="clip-".concat(s||jt()),C={tag:"mask",attributes:f(f({},Ue),{},{id:j,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[x,I]},b={tag:"defs",children:[{tag:"clipPath",attributes:{id:T},children:Yi(v)},C]};return r.push(b,{tag:"rect",attributes:f({fill:"currentColor","clip-path":"url(#".concat(T,")"),mask:"url(#".concat(j,")")},Ue)}),{children:r,attributes:n}}}},Bi={provides:function(t){var a=!1;Z.matchMedia&&(a=Z.matchMedia("(prefers-reduced-motion: reduce)").matches),t.missingIconAbstract=function(){var r=[],n={fill:"currentColor"},o={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};r.push({tag:"path",attributes:f(f({},n),{},{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});var i=f(f({},o),{},{attributeName:"opacity"}),s={tag:"circle",attributes:f(f({},n),{},{cx:"256",cy:"364",r:"28"}),children:[]};return a||s.children.push({tag:"animate",attributes:f(f({},o),{},{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:f(f({},i),{},{values:"1;0;1;1;0;1;"})}),r.push(s),r.push({tag:"path",attributes:f(f({},n),{},{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:a?[]:[{tag:"animate",attributes:f(f({},i),{},{values:"1;0;0;0;0;1;"})}]}),a||r.push({tag:"path",attributes:f(f({},n),{},{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:f(f({},i),{},{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:r}}}},Gi={hooks:function(){return{parseNodeAttributes:function(a,r){var n=r.getAttribute("data-fa-symbol"),o=n===null?!1:n===""?!0:n;return a.symbol=o,a}}}},Ji=[zo,Ei,Fi,ji,Ti,Wi,Xi,qi,Hi,Bi,Gi];ai(Ji,{mixoutsTo:R});R.noAuto;var he=R.config;R.library;R.dom;var cr=R.parse;R.findIconDefinition;R.toHtml;var Vi=R.icon;R.layer;R.text;R.counter;function Ki(e){return e=e-0,e===e}function fr(e){return Ki(e)?e:(e=e.replace(/[_-]+(.)?/g,(t,a)=>a?a.toUpperCase():""),e.charAt(0).toLowerCase()+e.slice(1))}function Qi(e){return e.charAt(0).toUpperCase()+e.slice(1)}var ie=new Map,Zi=1e3;function es(e){if(ie.has(e))return ie.get(e);const t={};let a=0;const r=e.length;for(;a<r;){const n=e.indexOf(";",a),o=n===-1?r:n,i=e.slice(a,o).trim();if(i){const s=i.indexOf(":");if(s>0){const l=i.slice(0,s).trim(),c=i.slice(s+1).trim();if(l&&c){const d=fr(l);t[d.startsWith("webkit")?Qi(d):d]=c}}}a=o+1}if(ie.size===Zi){const n=ie.keys().next().value;n&&ie.delete(n)}return ie.set(e,t),t}function ur(e,t,a={}){if(typeof t=="string")return t;const r=(t.children||[]).map(d=>ur(e,d)),n=t.attributes||{},o={};for(const[d,u]of Object.entries(n))switch(!0){case d==="class":{o.className=u;break}case d==="style":{o.style=es(String(u));break}case d.startsWith("aria-"):case d.startsWith("data-"):{o[d.toLowerCase()]=u;break}default:o[fr(d)]=u}const{style:i,role:s,"aria-label":l,...c}=a;return i&&(o.style=o.style?{...o.style,...i}:i),s&&(o.role=s),l&&(o["aria-label"]=l,o["aria-hidden"]="false"),e(t.tag,{...c,...o},...r)}var ts=ur.bind(null,aa.createElement),Zt=(e,t)=>{const a=z.useId();return e||(t?a:void 0)},as=class{constructor(e="react-fontawesome"){this.enabled=!1;let t=!1;try{t=typeof process<"u"&&!1}catch{}this.scope=e,this.enabled=t}log(...e){this.enabled&&console.log(`[${this.scope}]`,...e)}warn(...e){this.enabled&&console.warn(`[${this.scope}]`,...e)}error(...e){this.enabled&&console.error(`[${this.scope}]`,...e)}},rs="searchPseudoElementsFullScan"in he?"7.0.0":"6.0.0",ns=Number.parseInt(rs)>=7,pe="fa",B={beat:"fa-beat",fade:"fa-fade",beatFade:"fa-beat-fade",bounce:"fa-bounce",shake:"fa-shake",spin:"fa-spin",spinPulse:"fa-spin-pulse",spinReverse:"fa-spin-reverse",pulse:"fa-pulse"},os={left:"fa-pull-left",right:"fa-pull-right"},is={90:"fa-rotate-90",180:"fa-rotate-180",270:"fa-rotate-270"},ss={"2xs":"fa-2xs",xs:"fa-xs",sm:"fa-sm",lg:"fa-lg",xl:"fa-xl","2xl":"fa-2xl","1x":"fa-1x","2x":"fa-2x","3x":"fa-3x","4x":"fa-4x","5x":"fa-5x","6x":"fa-6x","7x":"fa-7x","8x":"fa-8x","9x":"fa-9x","10x":"fa-10x"},G={border:"fa-border",fixedWidth:"fa-fw",flip:"fa-flip",flipHorizontal:"fa-flip-horizontal",flipVertical:"fa-flip-vertical",inverse:"fa-inverse",rotateBy:"fa-rotate-by",swapOpacity:"fa-swap-opacity",widthAuto:"fa-width-auto"};function ls(e){const t=he.cssPrefix||he.familyPrefix||pe;return t===pe?e:e.replace(new RegExp(String.raw`(?<=^|\s)${pe}-`,"g"),`${t}-`)}function cs(e){const{beat:t,fade:a,beatFade:r,bounce:n,shake:o,spin:i,spinPulse:s,spinReverse:l,pulse:c,fixedWidth:d,inverse:u,border:v,flip:g,size:x,rotation:S,pull:N,swapOpacity:I,rotateBy:j,widthAuto:T,className:C}=e,b=[];return C&&b.push(...C.split(" ")),t&&b.push(B.beat),a&&b.push(B.fade),r&&b.push(B.beatFade),n&&b.push(B.bounce),o&&b.push(B.shake),i&&b.push(B.spin),l&&b.push(B.spinReverse),s&&b.push(B.spinPulse),c&&b.push(B.pulse),d&&b.push(G.fixedWidth),u&&b.push(G.inverse),v&&b.push(G.border),g===!0&&b.push(G.flip),(g==="horizontal"||g==="both")&&b.push(G.flipHorizontal),(g==="vertical"||g==="both")&&b.push(G.flipVertical),x!=null&&b.push(ss[x]),S!=null&&S!==0&&b.push(is[S]),N!=null&&b.push(os[N]),I&&b.push(G.swapOpacity),ns?(j&&b.push(G.rotateBy),T&&b.push(G.widthAuto),(he.cssPrefix||he.familyPrefix||pe)===pe?b:b.map(ls)):b}var fs=e=>typeof e=="object"&&"icon"in e&&!!e.icon;function ea(e){if(e)return fs(e)?e:cr.icon(e)}function us(e){return Object.keys(e)}var ta=new as("FontAwesomeIcon"),dr={border:!1,className:"",mask:void 0,maskId:void 0,fixedWidth:!1,inverse:!1,flip:!1,icon:void 0,listItem:!1,pull:void 0,pulse:!1,rotation:void 0,rotateBy:!1,size:void 0,spin:!1,spinPulse:!1,spinReverse:!1,beat:!1,fade:!1,beatFade:!1,bounce:!1,shake:!1,symbol:!1,title:"",titleId:void 0,transform:void 0,swapOpacity:!1,widthAuto:!1},ds=new Set(Object.keys(dr)),ve=aa.forwardRef((e,t)=>{const a={...dr,...e},{icon:r,mask:n,symbol:o,title:i,titleId:s,maskId:l,transform:c}=a,d=Zt(l,!!n),u=Zt(s,!!i),v=ea(r);if(!v)return ta.error("Icon lookup is undefined",r),null;const g=cs(a),x=typeof c=="string"?cr.transform(c):c,S=ea(n),N=Vi(v,{...g.length>0&&{classes:g},...x&&{transform:x},...S&&{mask:S},symbol:o,title:i,titleId:u,maskId:d});if(!N)return ta.error("Could not find icon",v),null;const{abstract:I}=N,j={ref:t};for(const T of us(a))ds.has(T)||(j[T]=a[T]);return ts(I[0],j)});ve.displayName="FontAwesomeIcon";var ms={prefix:"fas",iconName:"file-image",icon:[384,512,[128443],"f1c5","M0 64C0 28.7 28.7 0 64 0L213.5 0c17 0 33.3 6.7 45.3 18.7L365.3 125.3c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm208-5.5l0 93.5c0 13.3 10.7 24 24 24L325.5 176 208 58.5zM128 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM92.6 448l198.8 0c15.8 0 28.6-12.8 28.6-28.6 0-7.3-2.8-14.4-7.9-19.7L215.3 297.9c-6-6.3-14.4-9.9-23.2-9.9l-.3 0c-8.8 0-17.1 3.6-23.2 9.9L71.9 399.7C66.8 405 64 412.1 64 419.4 64 435.2 76.8 448 92.6 448z"]},ps={prefix:"fas",iconName:"file-lines",icon:[384,512,[128441,128462,61686,"file-alt","file-text"],"f15c","M0 64C0 28.7 28.7 0 64 0L213.5 0c17 0 33.3 6.7 45.3 18.7L365.3 125.3c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm208-5.5l0 93.5c0 13.3 10.7 24 24 24L325.5 176 208 58.5zM120 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z"]},gs=ps,hs={prefix:"fas",iconName:"graduation-cap",icon:[576,512,[127891,"mortar-board"],"f19d","M48 195.8l209.2 86.1c9.8 4 20.2 6.1 30.8 6.1s21-2.1 30.8-6.1l242.4-99.8c9-3.7 14.8-12.4 14.8-22.1s-5.8-18.4-14.8-22.1L318.8 38.1C309 34.1 298.6 32 288 32s-21 2.1-30.8 6.1L14.8 137.9C5.8 141.6 0 150.3 0 160L0 456c0 13.3 10.7 24 24 24s24-10.7 24-24l0-260.2zm48 71.7L96 384c0 53 86 96 192 96s192-43 192-96l0-116.6-142.9 58.9c-15.6 6.4-32.2 9.7-49.1 9.7s-33.5-3.3-49.1-9.7L96 267.4z"]};const mr=({id:e="file-upload",name:t="file",previewText:a,isEditMode:r=!1,required:n=!1,handleFileChange:o,accept:i=".pdf,.doc,.docx",uploadText:s="Upload File",helpText:l="PDF, DOC, DOCX",icon:c=gs,label:d="File",containerClass:u="",borderClass:v="border-2 border-dashed border-primary-300",hoverClass:g="hover:border-primary-500",iconSize:x="text-3xl"})=>p.jsxs("div",{className:`space-y-1 ${u}`,children:[d&&p.jsxs("label",{className:"block text-sm font-medium text-gray-700",children:[d," ",n&&p.jsx("span",{className:"text-red-500",children:"*"})]}),p.jsx("label",{htmlFor:e,className:"cursor-pointer",children:p.jsx("div",{className:`rounded-md p-4 text-center transition-colors ${v} ${g}`,children:a?p.jsxs("div",{className:"text-primary-800",children:[p.jsx(ve,{icon:c,className:`${x} mb-2`}),p.jsxs("p",{className:"text-sm font-medium",children:[r?"Current: ":"",a]}),r&&p.jsx("p",{className:"text-xs text-gray-500 mt-1",children:"Click to upload new file"})]}):p.jsxs("div",{className:"text-primary-800",children:[p.jsx(ve,{icon:c,className:`${x} mb-2`}),p.jsx("p",{className:"text-sm font-medium",children:s}),p.jsx("p",{className:"text-xs text-gray-500",children:l})]})})}),p.jsx("input",{type:"file",id:e,name:t,onChange:o,className:"hidden",accept:i,required:n})]});mr.propTypes={error:m.oneOfType([m.bool,m.string]),id:m.string,name:m.string,previewText:m.string,isEditMode:m.bool,required:m.bool,handleFileChange:m.func.isRequired,accept:m.string,uploadText:m.string,helpText:m.string,icon:m.object,label:m.string,containerClass:m.string,borderClass:m.string,hoverClass:m.string,iconSize:m.string};const pr=({id:e="image-upload",name:t="image",previewImage:a,required:r=!1,handleFileChange:n,accept:o="image/*",uploadText:i="Upload Image",helpText:s="JPG, JPEG, PNG",containerClass:l="w-48 h-48",borderClass:c="border-4 border-dashed border-primary-300",hoverClass:d="hover:border-primary-500",iconSize:u="text-5xl",label:v="",labelClass:g="",error:x=!1})=>p.jsxs("div",{className:"flex flex-col items-center",children:[v&&p.jsxs("label",{className:`block text-sm font-medium ${x?"text-red-600":"text-gray-700"} ${g}`,children:[v," ",r&&p.jsx("span",{className:"text-red-500",children:"*"})]}),p.jsx("label",{htmlFor:e,className:`cursor-pointer mt-1 w-full flex flex-col items-center ${x?"border-red-500":""}`,children:p.jsx("div",{className:`rounded-lg flex items-center justify-center transition-colors ${l} ${c} ${d} ${x?"border-red-500":""}`,children:a?p.jsx("div",{className:"relative w-full h-full overflow-hidden",children:p.jsx("img",{src:a,alt:"Preview",className:"w-full h-full rounded-lg object-cover",onError:S=>{console.error("Image failed to load",S),S.target.style.display="none"}})}):p.jsxs("div",{className:`text-center p-4 ${x?"text-red-600":"text-primary-800"}`,children:[p.jsx(ve,{icon:ms,className:`${u} mb-2`}),p.jsx("p",{className:"text-sm font-medium",children:i}),p.jsx("span",{className:"text-xs",children:s})]})})}),p.jsx("input",{type:"file",id:e,name:t,className:"hidden",onChange:n,accept:o,required:r}),x&&p.jsx("p",{className:"mt-1 text-sm text-red-600",children:typeof x=="string"?x:"This field is required"})]});pr.propTypes={error:m.oneOfType([m.bool,m.string]),id:m.string,name:m.string,previewImage:m.string,required:m.bool,handleFileChange:m.func.isRequired,accept:m.string,uploadText:m.string,helpText:m.string,containerClass:m.string,borderClass:m.string,hoverClass:m.string,iconSize:m.string,label:m.string,labelClass:m.string};const ht=({items:e=[],onRemove:t,containerClass:a="space-y-2",itemClass:r="flex items-center justify-between py-2 px-4 rounded-md",itemBorder:n="border border-primary-500 border-t-primary-200",itemBg:o="bg-gray-50",textClass:i="text-gray-800 underline italic font-medium",buttonClass:s="px-2 py-1 rounded-md focus:outline-none",buttonBg:l="bg-red-500 hover:bg-red-600",buttonText:c="text-white",buttonTextContent:d="Remove",emptyMessage:u="No qualifications added yet",emptyMessageClass:v="text-gray-500 italic text-center py-4"})=>p.jsx("div",{className:a,children:e.length>0?e.map((g,x)=>p.jsxs("div",{className:`${r} ${n} ${o}`,children:[p.jsx("span",{className:i,children:g}),p.jsx("button",{type:"button",onClick:()=>t(x),className:`${s} ${l} ${c}`,children:d})]},x)):p.jsx("div",{className:v,children:u})});ht.propTypes={items:m.arrayOf(m.string),onRemove:m.func.isRequired,containerClass:m.string,itemClass:m.string,itemBorder:m.string,itemBg:m.string,textClass:m.string,buttonClass:m.string,buttonBg:m.string,buttonText:m.string,buttonTextContent:m.string,emptyMessage:m.string,emptyMessageClass:m.string};ht.defaultProps={items:[],buttonTextContent:"Remove",emptyMessage:"No qualifications added yet"};const vs=({formData:e,handleChange:t,handleEmailChange:a,handlePhoneChange:r,handleCNICChange:n,fieldErrors:o,departments:i,doctorTypes:s,isEditMode:l})=>{const c=[{label:"Full Name",name:"doctor_Name",icon:"user",placeholder:"Enter Doctor Name",value:e.doctor_Name,onChange:t,required:!0,error:o.doctor_Name},{label:"Email Address",name:"doctor_Email",icon:"envelope",placeholder:"Enter Doctor Email (optional)",type:"email",value:e.doctor_Email,onChange:a,className:o.doctor_Email?"border-red-500":"",error:o.doctor_Email,required:!1},{label:"Password",name:"doctor_password",icon:"lock",placeholder:"Enter password",type:"password",value:e.doctor_password,onChange:t,required:!l,error:o.doctor_password},{label:"Contact Number",name:"doctor_Contact",icon:"phone",placeholder:"03XX-XXXXXXX",type:"tel",value:e.doctor_Contact,onChange:r,maxLength:12,required:!0,error:o.doctor_Contact},{label:"CNIC Number",name:"doctor_CNIC",icon:"idCard",placeholder:"XXXXX-XXXXXXX-X",value:e.doctor_CNIC,onChange:n,maxLength:15,required:!0,error:o.doctor_CNIC},{label:"Address",name:"doctor_Address",icon:"mapMarkerAlt",placeholder:"Enter Address",value:e.doctor_Address,onChange:t,required:!1,error:o.doctor_Address},{label:"Department",name:"doctor_Department",icon:"stethoscope",type:"select",options:i.map(u=>u.name),value:e.doctor_Department,onChange:t,required:!1,error:o.doctor_Department},{label:"Doctor Type",name:"doctor_Type",icon:"tableList",type:"select",options:s,value:e.doctor_Type,onChange:t,required:!1,error:o.doctor_Type},{label:"Specialization",name:"doctor_Specialization",icon:"userDoctor",placeholder:"Enter Specialization",value:e.doctor_Specialization,onChange:t,required:!1,error:o.doctor_Specialization},{label:"License Number",name:"doctor_LicenseNumber",icon:"fileSignature",placeholder:"Enter License Number",value:e.doctor_LicenseNumber,onChange:t,required:!1,error:o.doctor_LicenseNumber},{label:"Consultation Fee",name:"doctor_Fee",icon:"moneyBillWave",placeholder:"Enter Fee",type:"number",value:e.doctor_Fee,onChange:t,required:!1}],d={};return c.forEach(u=>{if(u.required){const v={doctor_Name:"Doctor name",doctor_Contact:"Contact number",doctor_CNIC:"CNIC",doctor_Address:"Address",doctor_Department:"Department",doctor_Type:"Doctor type",doctor_Specialization:"Specialization",doctor_LicenseNumber:"License number",doctor_password:"Password"};d[u.name]=v[u.name]}}),p.jsx(rt,{title:"Basic Information",children:p.jsx(oa,{cols:{base:1,md:2},gap:6,children:c.map((u,v)=>p.jsx(na,{...u},v))})})},bs=e=>({doctor_Name:"Doctor name",doctor_Contact:"Contact number",doctor_CNIC:"CNIC",...e?{}:{doctor_password:"Password"}}),ys=({formData:e,handleChange:t,handlePercentageChange:a,fieldErrors:r,agreementPreview:n,handleFileChange:o,isEditMode:i})=>{const s=[{label:"Doctor Percentage",name:"contract_doctor_Percentage",icon:"percentage",placeholder:"Enter Doctor Percentage",type:"number",onChange:a,min:0,max:100,step:"0.01",value:e.doctor_Contract.doctor_Percentage,required:!1},{label:"Hospital Percentage",name:"contract_hospital_Percentage",icon:"percentage",placeholder:"Enter Hospital Percentage",type:"number",onChange:a,min:0,max:100,step:"0.01",value:e.doctor_Contract.hospital_Percentage,required:!1},{label:"Contract Time",name:"contract_contract_Time",icon:"clock",required:!1,placeholder:"Enter Contract Time",value:e.doctor_Contract.contract_Time,onChange:t},{label:"Joining Date",name:"contract_doctor_JoiningDate",icon:"calendarAlt",placeholder:"Enter Joining Date",type:"date",value:e.doctor_Contract.doctor_JoiningDate,onChange:t,error:r.contract_doctor_JoiningDate,required:!1}];return p.jsx(rt,{title:"Contract Details",children:p.jsxs(oa,{cols:{base:1,md:2},gap:6,children:[s.map((l,c)=>p.jsx(na,{...l},c)),p.jsx(mr,{previewText:n,handleFileChange:o,label:"Doctor Agreement",required:!1,helpText:"PDF, DOC, DOCX (max 10MB)",name:"doctor_Agreement",accept:".pdf,.doc,.docx"})]})})},xs=()=>({}),ws=({qualificationInput:e,setQualificationInput:t,formData:a,handleAddQualification:r,handleRemoveQualification:n})=>p.jsxs(rt,{title:"Qualifications",children:[p.jsxs("div",{className:"flex gap-4 mb-6",children:[p.jsxs("div",{className:"flex-1 relative",children:[p.jsx("div",{className:"absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",children:p.jsx(ve,{icon:hs,className:"text-primary-600"})}),p.jsx("input",{type:"text",value:e,onChange:o=>t(o.target.value),placeholder:"Add Qualification",className:"block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"})]}),p.jsx("button",{type:"button",onClick:r,className:"bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors",children:"Add"})]}),p.jsx(ht,{items:a.doctor_Qualifications,onRemove:n})]}),_s=({status:e,isEditMode:t,onSubmit:a})=>{const r=ra(),n=t?"Update Doctor":"Register Doctor",o=t?"Updating...":"Processing...";return p.jsxs("div",{className:"flex justify-between pt-6 border-t border-gray-200",children:[p.jsx("button",{type:"button",onClick:()=>r(-1),className:"px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500",children:"Cancel"}),p.jsx("button",{type:"submit",disabled:e==="loading",onClick:a,className:`px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${e==="loading"?"opacity-70 cursor-not-allowed":""}`,children:e==="loading"?p.jsxs("span",{className:"flex items-center justify-center",children:[p.jsxs("svg",{className:"animate-spin -ml-1 mr-3 h-5 w-5 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[p.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),p.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),o]}):n})]})},Cs=e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e),Os=({mode:e="create"})=>{const t="http://192.168.88.29:5002",a=ra(),r=Pr(),{doctorId:n}=Nr(),{currentDoctor:o,status:i,error:s}=_t(w=>w.doctor),{departments:l}=_t(w=>w.department),c={doctor_Name:"",doctor_Email:"",doctor_Contact:"",doctor_Address:"",doctor_Department:"",doctor_CNIC:"",doctor_Type:"",doctor_Specialization:"",doctor_Qualifications:[],doctor_LicenseNumber:"",doctor_Fee:0,doctor_password:"",doctor_Contract:{doctor_Percentage:0,hospital_Percentage:0,contract_Time:"",doctor_JoiningDate:""}},[d,u]=z.useState(null),[v,g]=z.useState(null),[x,S]=z.useState(""),[N,I]=z.useState(null),[j,T]=z.useState(null),[C,b]=z.useState(c),[O,vt]=z.useState(e==="edit"),[X,q]=z.useState({}),gr=["Senior Doctor","General Doctor","Specialist Doctor","Assistant Doctor","Internee Doctor","Consultant","Surgeon","Resident Doctor"];z.useEffect(()=>{O&&n&&r(Ir(n)),r(kr())},[r,n,O]),z.useEffect(()=>{if(O&&o){if(b({doctor_Name:o.user.user_Name||"",doctor_Email:o.user.user_Email||"",doctor_Password:o.user.user_Password||"",doctor_Contact:o.user.user_Contact||"",doctor_Address:o.user.user_Address||"",doctor_Department:o.doctor_Department||"",doctor_CNIC:o.user.user_CNIC||"",doctor_Type:o.doctor_Type||"",doctor_Specialization:o.doctor_Specialization||"",doctor_Qualifications:o.doctor_Qualifications||[],doctor_LicenseNumber:o.doctor_LicenseNumber||"",doctor_Fee:o.doctor_Fee||0,doctor_Contract:o.doctor_Contract||{doctor_Percentage:0,hospital_Percentage:0,contract_Time:"",doctor_JoiningDate:""}}),o.doctor_Image?.filePath&&u(o.doctor_Image?.filePath?`${t}${o.doctor_Image.filePath}`:`https://ui-avatars.com/api/?name=${encodeURIComponent(o.doctor_Name||"D")}&background=random`),o.doctor_Contract?.doctor_Agreement?.filePath){T(null);const w=o.doctor_Contract.doctor_Agreement.filePath.split("/").pop()||"Existing Agreement";g(w)}I(null)}},[o,O,t]),z.useEffect(()=>()=>{r(Er())},[r]);const hr=()=>{b(c),u(null),g(null),I(null),T(null),S(""),q({})},vr=()=>{x.trim()&&(b(w=>({...w,doctor_Qualifications:[...w.doctor_Qualifications,x]})),S(""))},br=w=>{b(y=>({...y,doctor_Qualifications:y.doctor_Qualifications.filter((P,E)=>E!==w)}))},yr=w=>{const{value:y}=w.target;b(P=>({...P,doctor_Email:y})),X.doctor_Email&&q(P=>{const E={...P};return delete E.doctor_Email,E})},bt=w=>{const{name:y,value:P}=w.target;if(X[y]&&q(E=>{const D={...E};return delete D[y],D}),y.startsWith("contract_")){const E=y.replace("contract_","");b(D=>({...D,doctor_Contract:{...D.doctor_Contract,[E]:P}}))}else b(E=>({...E,[y]:P}))},yt=w=>{const y=w.target.files[0],P=w.target.name;if(!y)return;if(y.size>10*1024*1024){M.error("File size should be less than 10MB");return}const E=["image/jpeg","image/png","image/jpg"],D=["application/pdf","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"];if(P==="doctor_Image"){if(!E.includes(y.type)){M.error("Invalid image format. Please upload JPEG, JPG, or PNG");return}const F=URL.createObjectURL(y);u(F),I(y)}else if(P==="doctor_Agreement"){if(!D.includes(y.type)){M.error("Invalid file format. Please upload PDF, DOC, or DOCX");return}T(y),g(y.name)}},xr=w=>{if(!w)return w;const y=w.replace(/[^\d]/g,""),P=y.length;return P<4?y:P<8?`${y.slice(0,4)}-${y.slice(4)}`:`${y.slice(0,4)}-${y.slice(4,11)}`},wr=w=>{if(!w)return w;const y=w.replace(/[^\d]/g,""),P=y.length;return P<6?y:P<13?`${y.slice(0,5)}-${y.slice(5)}`:`${y.slice(0,5)}-${y.slice(5,12)}-${y.slice(12,13)}`},_r=w=>{const y=xr(w.target.value);b({...C,doctor_Contact:y}),X.doctor_Contact&&q(P=>{const E={...P};return delete E.doctor_Contact,E})},Cr=w=>{const y=wr(w.target.value);b({...C,doctor_CNIC:y}),X.doctor_CNIC&&q(P=>{const E={...P};return delete E.doctor_CNIC,E})},Sr=w=>{const{name:y,value:P}=w.target,E=P===""?0:parseFloat(P);if(isNaN(E)){M.error("Please enter a valid number for percentage");return}const D=Math.min(100,Math.max(0,E)),F=parseFloat(D.toFixed(2));y==="contract_doctor_Percentage"?b(A=>({...A,doctor_Contract:{...A.doctor_Contract,doctor_Percentage:F,hospital_Percentage:parseFloat((100-F).toFixed(2))}})):y==="contract_hospital_Percentage"&&b(A=>({...A,doctor_Contract:{...A.doctor_Contract,hospital_Percentage:F,doctor_Percentage:parseFloat((100-F).toFixed(2))}}))},Ar=w=>{console.error("API Error:",w);const y=w?.payload??w;if(y){const{statusCode:P,message:E,errorType:D,field:F,value:A,errors:L}=y,Q={user_Email:"email",email:"email",user_CNIC:"CNIC",cnic:"CNIC",user_Contact:"contact number",contact:"contact number"}[F]||F||"value";M.error(`This ${Q} (${A??""}) is already registered. Please use a different ${Q}.`),q(Oe=>({...Oe,[F==="user_Email"||F==="email"?"doctor_Email":F==="user_CNIC"||F==="cnic"?"doctor_CNIC":F==="user_Contact"||F==="contact"?"doctor_Contact":"doctor_Email"]:`This ${Q} is already registered`}));return}if(errors&&Array.isArray(errors)&&errors.length){M.error(`Validation error: ${errors.join(", ")}`);return}if(message){M.error(message);return}if(w.message&&w.message.includes("Network Error")){M.error("Network error. Please check your connection and try again.");return}if(w.status&&w.status>=500){M.error("Server error. Please try again later.");return}M.error(`Failed to ${O?"update":"create"} doctor. Please try again.`)},xt=async w=>{w.preventDefault(),q({});const y=bs(O),P=xs(),E={...y,...P},D=[],F={};if(Object.entries(E).forEach(([L,H])=>{let Q;if(L.startsWith("contract_")){const Oe=L.replace("contract_","");Q=C.doctor_Contract[Oe]}else Q=C[L];(!Q||!Q.toString().trim())&&(D.push(H),F[L]=`${H} is required`)}),!O&&!C.doctor_password&&(D.push("Password"),F.doctor_password="Password is required"),C.doctor_Contact&&!/^\d{4}-\d{7}$/.test(C.doctor_Contact)&&(F.doctor_Contact="Contact must be in format 03XX-XXXXXXX"),C.doctor_Email&&!Cs(C.doctor_Email)&&(F.doctor_Email="Please enter a valid email address"),Object.keys(F).length>0){q(F),D.length>0?M.error(`Please fill in all required fields: ${D.join(", ")}`):M.error("Please fix the validation errors");const L=Object.keys(F)[0],H=document.querySelector(`[name="${L}"]`);H&&(H.scrollIntoView({behavior:"smooth",block:"center"}),H.focus());return}const A=new FormData;A.append("user_Name",C.doctor_Name),A.append("user_Email",C.doctor_Email||""),A.append("user_Contact",C.doctor_Contact),A.append("user_Address",C.doctor_Address),A.append("user_CNIC",C.doctor_CNIC),C.doctor_password?.trim()&&A.append("user_Password",C.doctor_password.trim()),A.append("doctor_Department",C.doctor_Department),A.append("doctor_Type",C.doctor_Type),A.append("doctor_Specialization",C.doctor_Specialization),A.append("doctor_LicenseNumber",C.doctor_LicenseNumber),A.append("doctor_Fee",String(Number(C.doctor_Fee))),C.doctor_Qualifications.forEach((L,H)=>{A.append(`doctor_Qualifications[${H}]`,L)}),A.append("doctor_Contract[doctor_Percentage]",String(Number(C.doctor_Contract.doctor_Percentage))),A.append("doctor_Contract[hospital_Percentage]",String(Number(C.doctor_Contract.hospital_Percentage))),A.append("doctor_Contract[contract_Time]",C.doctor_Contract.contract_Time),A.append("doctor_Contract[doctor_JoiningDate]",C.doctor_Contract.doctor_JoiningDate),N&&A.append("doctor_Image",N),j&&A.append("doctor_Agreement",j);try{let L;O&&n?(L=await r(Fr({doctorId:n,updatedData:A})).unwrap(),M.success("Doctor updated successfully!")):(L=await r(jr(A)).unwrap(),M.success("Doctor created successfully!"),hr()),setTimeout(()=>{a(Tr("doctors"))},1500)}catch(L){Ar(L)}},wt={title:O?"Edit Doctor":"Doctor Registration",description:O?"Update the doctor details below":"Please fill in the doctor details below"};return p.jsxs(ia,{children:[p.jsx(sa,{title:wt.title,description:wt.description,bgColor:"bg-primary-600",textColor:"text-white"}),p.jsxs("form",{className:"w-full p-6",onSubmit:xt,children:[p.jsx("div",{className:"mb-6",children:p.jsx(pr,{previewImage:d,handleFileChange:yt,label:"Doctor Image",helpText:"JPG, JPEG, PNG (max 10MB)",containerClass:"w-48 h-48 mx-auto",name:"doctor_Image"})}),p.jsx(vs,{formData:C,handleChange:bt,handleEmailChange:yr,handlePhoneChange:_r,handleCNICChange:Cr,fieldErrors:X,departments:l,doctorTypes:gr,isEditMode:O}),p.jsx(ws,{qualificationInput:x,setQualificationInput:S,formData:C,handleAddQualification:vr,handleRemoveQualification:br}),p.jsx(ys,{formData:C,handleChange:bt,handlePercentageChange:Sr,fieldErrors:X,agreementPreview:v,handleFileChange:yt,isEditMode:O}),p.jsx(_s,{status:i,isEditMode:O,onSubmit:xt})]})]})};export{Os as default};
