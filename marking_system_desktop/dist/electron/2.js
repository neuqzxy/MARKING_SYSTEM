webpackJsonp([2],{180:function(a,b,c){"use strict";Object.defineProperty(b,"__esModule",{value:!0});var d=c(184),e=c(203),f=c(0),g=f(d.a,e.a,!1,function(){c(201)},"data-v-68a5a71c",null);b["default"]=g.exports},184:function(a,b){"use strict";b.a={data:function(){return{}},props:{tableTitle:Array,tableData:Array,markId:String,changeFormState:Function,scores:Object}}},201:function(a,b,c){var d=c(202);"string"==typeof d&&(d=[[a.i,d,""]]),d.locals&&(a.exports=d.locals);c(2)("4ebbf203",d,!0)},202:function(a,b,c){b=a.exports=c(1)(!1),b.push([a.i,".my-table[data-v-68a5a71c]{width:100%;height:100%}.my-table-col-title[data-v-68a5a71c]{color:#606266;margin-top:20px;height:60px;line-height:60px;border-bottom:1px solid #dcdfe6}.my-table-col[data-v-68a5a71c]{color:#606266;height:65px;border-bottom:1px solid #dcdfe6;display:flex;flex-direction:row;justify-content:center;align-items:center;cursor:pointer}.my-table-col[data-v-68a5a71c]:hover{background:#f2f6fc}.flip-list-move[data-v-68a5a71c]{transition:transform 1s}",""])},203:function(a,b){"use strict";b.a={render:function(){var a=this,b=a.$createElement,c=a._self._c||b;return c("div",{staticClass:"my-table"},[c("el-row",a._l(a.tableTitle,function(b,d){return c("el-col",{key:b.value+"-"+d,staticClass:"my-table-col-title",attrs:{span:b.width}},[a._v(a._s(b.value))])})),a._v(" "),c("transition-group",{attrs:{name:"flip-list",tag:"ul"}},a._l(a.tableData,function(b){return c("el-row",{key:b._id,staticClass:"my-table-col",nativeOn:{click:function(){a.changeFormState(b._id,a.markId,"editing")}}},[c("el-col",{key:b.username,staticStyle:{"text-align":"center"},attrs:{span:6}},[a._v(a._s(b.username))]),a._v(" "),c("el-col",{key:b.age,staticStyle:{"text-align":"center"},attrs:{span:6}},[a._v(a._s(b.age))]),a._v(" "),c("el-col",{key:b.sex,staticStyle:{"text-align":"center"},attrs:{span:6}},[a._v(a._s("man"===b.sex?"\u7537":"\u5973"))]),a._v(" "),c("el-col",{key:b.username+"score",staticStyle:{"text-align":"center"},attrs:{span:6}},[a._v(a._s(void 0===a.scores[b.personId]?"\u6682\u65E0":a.scores[b.personId]))])],1)}))],1)},staticRenderFns:[]}}});