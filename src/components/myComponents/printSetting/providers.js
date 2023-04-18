/* eslint-disable */
import {hiprint} from 'vue-plugin-hiprint'


// 自定义设计元素1
export const assets = function (ops) {
  var addElementTypes = function (context) {
    context.removePrintElementTypes("assets");
    context.addPrintElementTypes(
      "assets",
      [
        new hiprint.PrintElementTypeGroup("单据", [
          {
            tid: 'aProviderModule.header',
            title: '单据表头',
            data: '单据表头',
            type: 'text',
            options: {
              field: 'orderId',
              testData: '单据表头',
              textType: 'text',
              height: 17,
              fontSize: 20,
              fontWeight: "700",
              textAlign: "center",
              hideTitle: true
            }
          },
          {
            tid: 'aProviderModule.order', title: '单据字段', data: 'XS888888888', type: 'text',
            options: {
              field: 'orderId',
              testData: 'XS888888888',
              height: 16,
              fontSize: 10,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
          {
            tid: 'aProviderModule.datetime', title: '时间字段', data: 'XS888888888', type: 'text',
            options: {
              field: 'orderId',
              testData: 'XS888888888',
              height: 16,
              fontSize: 10,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle",
            },
            formatter: function (title, value, options, templateData, target) {
              if (value && value.indexOf('T')) {
                return value.replace('T', ' ').slice(0, 19)
              }
              return '2020-04-05 09:00:00'
            },
          }, {
            tid: 'bProviderModule.type', title: '类型名称', data: '单据类型', type: 'text',
            options: {
              testData: '单据类型',
              height: 16,
              fontSize: 10,
              textType: 'text',
              fontWeight: "700",
              textAlign: "center",
              hideTitle: true
            }
          },
          {
            tid: 'aProviderModule.barcode', title: '条形码', data: '888888888', type: 'text',
            options: {
              testData: '888888888',
              height: 32,
              fontSize: 12,
              lineHeight: 18,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle",
              textType: "barcode"
            }
          },
          {
            tid: 'aProviderModule.qrcode', title: '二维码', data: 'XS888888888', type: 'text',
            options: {
              testData: 'XS888888888',
              height: 32,
              fontSize: 12,
              lineHeight: 18,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle",
              textType: "qrcode"
            }
          },
          {tid: 'aProviderModule.logo', title: 'Logo', data: '', type: 'image'},
        ]),
        new hiprint.PrintElementTypeGroup("表格", [
          {
            tid: 'aProviderModule.propertyTable', title: '资产数据',
            type: 'table',
            editable: true,
            columnDisplayEditable: true,//列显示是否能编辑
            columnDisplayIndexEditable: true,//列顺序显示是否能编辑
            columnTitleEditable: true,//列标题是否能编辑
            columnResizable: true, //列宽是否能调整
            columnAlignEditable: true,//列对齐是否调整
            isEnableEditField: true, //编辑字段
            isEnableContextMenu: true, //开启右键菜单 默认true
            isEnableInsertRow: true, //插入行
            isEnableDeleteRow: true, //删除行
            isEnableInsertColumn: true, //插入列
            isEnableDeleteColumn: true, //删除列
            isEnableMergeCell: true, //合并单元格
            columns: [
              [
                {title: '资产编码', align: 'center', field: 'no'},
                {title: '资产名称', align: 'center', field: 'name'},
                {title: '资产类型', align: 'center', field: 'type'},
                {title: '序列号', align: 'center', field: 'serial_num'},
                {title: '金额', align: 'center', field: 'amount'},
                {title: '使用人', align: 'center', field: 'user'},
              ],
            ],
            footerFormatter: function (options, rows, data, currentPageGridRowsData) {
              if (data !== undefined) {
                return `<td style="padding:0 10px" colspan="100">${'合计: ' + data['sum']}</td>`
              }
              return '<td style="padding:0 10px" colspan="100">合计: </td>'
            },
          },
          {
            tid: 'aProviderModule.consumablesTable', title: '耗材数据',
            type: 'table',
            editable: true,
            columnDisplayEditable: true,//列显示是否能编辑
            columnDisplayIndexEditable: true,//列顺序显示是否能编辑
            columnTitleEditable: true,//列标题是否能编辑
            columnResizable: true, //列宽是否能调整
            columnAlignEditable: true,//列对齐是否调整
            isEnableEditField: true, //编辑字段
            isEnableContextMenu: true, //开启右键菜单 默认true
            isEnableInsertRow: true, //插入行
            isEnableDeleteRow: true, //删除行
            isEnableInsertColumn: true, //插入列
            isEnableDeleteColumn: true, //删除列
            isEnableMergeCell: true, //合并单元格
            columns: [
              [
                {title: '耗材编码', align: 'center', field: 'no'},
                {
                  title: '耗材名称', align: 'center', field: 'item',
                  formatter: function (value, row, index, options) {
                    if (value) {
                      return value.name
                    }
                    return '/'
                  }
                },
                {
                  title: '耗材类型', align: 'center', field: 'type',
                  formatter: function (value, row, index, options) {
                    if (value) {
                      return value.name
                    }
                    return '/'
                  }
                },
                {title: '规格型号', align: 'center', field: 'sku'},
                {title: '单位', align: 'center', field: 'unit'},
                {title: '数量', align: 'center', field: 'num'},
                {title: '单价', align: 'center', field: 'actual_price'},
                {title: '金额', align: 'center', field: 'amount'},
                {title: '备注', align: 'center', field: 'remarks'},
              ],
            ],
            footerFormatter: function (options, rows, data, currentPageGridRowsData) {
              if (data !== undefined) {
                return `<td style="padding:0 10px" colspan="100">${'合计: ' + data['sum']}</td>`
              }
              return '<td style="padding:0 10px" colspan="100">合计: </td>'
            },
          },
          {
            tid: 'aProviderModule.financeTable', title: '财务数据',
            type: 'table',
            editable: true,
            columnDisplayEditable: true,//列显示是否能编辑
            columnDisplayIndexEditable: true,//列顺序显示是否能编辑
            columnTitleEditable: true,//列标题是否能编辑
            columnResizable: true, //列宽是否能调整
            columnAlignEditable: true,//列对齐是否调整
            isEnableEditField: true, //编辑字段
            isEnableContextMenu: true, //开启右键菜单 默认true
            isEnableInsertRow: true, //插入行
            isEnableDeleteRow: true, //删除行
            isEnableInsertColumn: true, //插入列
            isEnableDeleteColumn: true, //删除列
            isEnableMergeCell: true, //合并单元格
            columns: [
              [
                {title: '编号', align: 'center', field: 'no'},
                {title: '资产名称', align: 'center', field: 'property'},
                {title: '分摊组织', align: 'center', field: 'share_organization'},
                {title: '金额', align: 'center', field: 'sku'},
                {title: '单位', align: 'center', field: 'unit'},
                {title: '净值', align: 'center', field: 'net_worth'},
                {title: '累计折旧', align: 'center', field: 'cumulative_loss'},
                {title: '使用期限', align: 'center', field: 'times_limit'},
                {title: '已使用月数', align: 'center', field: 'use_times'},
              ],
            ],
            footerFormatter: function (options, rows, data, currentPageGridRowsData) {
              if (data !== undefined) {
                return `<td style="padding:0 10px" colspan="100">${'合计: ' + data['sum']}</td>`
              }
              return '<td style="padding:0 10px" colspan="100">合计: </td>'
            },
          },
          {
            tid: 'aProviderModule.imgTable', title: '签字表格',
            type: 'table',
            editable: true,
            columnDisplayEditable: true,//列显示是否能编辑
            columnDisplayIndexEditable: true,//列顺序显示是否能编辑
            columnTitleEditable: true,//列标题是否能编辑
            columnResizable: true, //列宽是否能调整
            columnAlignEditable: true,//列对齐是否调整
            isEnableEditField: true, //编辑字段
            isEnableContextMenu: true, //开启右键菜单 默认true
            isEnableInsertRow: true, //插入行
            isEnableDeleteRow: true, //删除行
            isEnableInsertColumn: true, //插入列
            isEnableDeleteColumn: true, //删除列
            isEnableMergeCell: true, //合并单元格
            columns: [
              [
                {
                  title: '图片',
                  align: 'center',
                  field: 'file',
                  type: 'image'
                },
              ],
            ]
          },
          {tid: 'aProviderModule.customText', title: '文本', customText: '自定义文本', custom: true, type: 'text'},
          {
            tid: 'aProviderModule.longText', title: '长文本', type: 'longText', options: {
              field: 'test.longText',
              width: 200,
              testData: '长文本分页/不分页测试'
            },
          }
        ]),
        new hiprint.PrintElementTypeGroup("辅助", [
          {
            tid: 'aProviderModule.hline',
            title: '横线',
            type: 'hline'
          },
          {
            tid: 'aProviderModule.vline',
            title: '竖线',
            type: 'vline'
          },
          {
            tid: 'aProviderModule.rect',
            title: '矩形',
            type: 'rect'
          },
          {
            tid: 'aProviderModule.oval',
            title: '椭圆',
            type: 'oval'
          }
        ])
      ]
    );
  };
  return {
    addElementTypes: addElementTypes
  };
};

// 自定义设计元素2
export const bProvider = function (ops) {
  var addElementTypes = function (context) {
    context.removePrintElementTypes("bProviderModule");
    context.addPrintElementTypes(
      "bProviderModule",
      [
        new hiprint.PrintElementTypeGroup("常规", [
          {
            tid: 'bProviderModule.header', title: '单据表头', data: '单据表头', type: 'text',
            options: {
              testData: '单据表头',
              height: 17,
              fontSize: 16.5,
              fontWeight: "700",
              textAlign: "center",
              hideTitle: true
            }
          },
          {
            tid: 'bProviderModule.type', title: '单据类型', data: '单据类型', type: 'text',
            options: {
              testData: '单据类型',
              height: 16,
              fontSize: 15,
              fontWeight: "700",
              textAlign: "center",
              hideTitle: true
            }
          },
          {
            tid: 'bProviderModule.order', title: '订单编号', data: 'XS888888888', type: 'text',
            options: {
              field: 'orderId',
              testData: 'XS888888888',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
          {
            tid: 'bProviderModule.date', title: '业务日期', data: '2020-01-01', type: 'text',
            options: {
              field: 'date',
              testData: '2020-01-01',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
          {
            tid: 'bProviderModule.barcode', title: '条形码', data: 'XS888888888', type: 'text',
            options: {
              testData: 'XS888888888',
              height: 32,
              fontSize: 12,
              lineHeight: 18,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle",
              textType: "barcode"
            }
          },
          {
            tid: 'bProviderModule.qrcode', title: '二维码', data: 'XS888888888', type: 'text',
            options: {
              testData: 'XS888888888',
              height: 32,
              fontSize: 12,
              lineHeight: 18,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle",
              textType: "qrcode"
            }
          },
          {
            tid: 'bProviderModule.platform', title: '平台名称', data: '平台名称', type: 'text',
            options: {
              testData: '平台名称',
              height: 17,
              fontSize: 16.5,
              fontWeight: "700",
              textAlign: "center",
              hideTitle: true
            }
          },
          {tid: 'bProviderModule.image', title: 'Logo', data: '', type: 'image'},
        ]),
        new hiprint.PrintElementTypeGroup("客户", [
          {
            tid: 'bProviderModule.khname', title: '客户名称', data: '高级客户', type: 'text',
            options: {
              field: 'name',
              testData: '高级客户',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
          {
            tid: 'bProviderModule.tel', title: '客户电话', data: '18888888888', type: 'text',
            options: {
              field: 'tel',
              testData: '18888888888',
              height: 16,
              fontSize: 6.75,
              fontWeight: "700",
              textAlign: "left",
              textContentVerticalAlign: "middle"
            }
          },
        ]),
        new hiprint.PrintElementTypeGroup("表格/其他", [
          {
            tid: 'bProviderModule.table', title: '订单数据',
            type: 'tableCustom',
            options: {
              field: 'table',
              fields: [
                {text: '名称', field: 'NAME'},
                {text: '数量', field: 'SL'},
                {text: '规格', field: 'GG'},
                {text: '条码', field: 'TM'},
                {text: '单价', field: 'DJ'},
                {text: '金额', field: 'JE'},
                {text: '备注', field: 'DETAIL'},
              ],
            },
            editable: true,
            columnDisplayEditable: true,//列显示是否能编辑
            columnDisplayIndexEditable: true,//列顺序显示是否能编辑
            columnTitleEditable: true,//列标题是否能编辑
            columnResizable: true, //列宽是否能调整
            columnAlignEditable: true,//列对齐是否调整
            columns: [
              [
                {title: '名称', align: 'center', field: 'NAME', width: 100},
                {title: '数量', align: 'center', field: 'SL', width: 100},
                {title: '条码', align: 'center', field: 'TM', width: 100},
                {title: '规格', align: 'center', field: 'GG', width: 100},
                {title: '单价', align: 'center', field: 'DJ', width: 100},
                {title: '金额', align: 'center', field: 'JE', width: 100},
                {title: '备注', align: 'center', field: 'DETAIL', width: 100},
              ]
            ],
            footerFormatter: function (options, rows, data, currentPageGridRowsData) {
              if (data && data['totalCap']) {
                return `<td style="padding:0 10px" colspan="100">${'应收金额大写: ' + data['totalCap']}</td>`
              }
              return '<td style="padding:0 10px" colspan="100">应收金额大写: </td>'
            },
          },
          {tid: 'bProviderModule.customText', title: '文本', customText: '自定义文本', custom: true, type: 'text'},
          {
            tid: 'bProviderModule.longText', title: '长文本', type: 'longText', options: {
              field: 'test.longText',
              width: 200,
              testData: '长文本分页/不分页测试'
            },
          }
        ]),
        new hiprint.PrintElementTypeGroup("辅助", [
          {
            tid: 'bProviderModule.hline',
            title: '横线',
            type: 'hline'
          },
          {
            tid: 'bProviderModule.vline',
            title: '竖线',
            type: 'vline'
          },
          {
            tid: 'bProviderModule.rect',
            title: '矩形',
            type: 'rect'
          },
          {
            tid: 'bProviderModule.oval',
            title: '椭圆',
            type: 'oval'
          }
        ])
      ]
    );
  };
  return {
    addElementTypes: addElementTypes
  };
};

// type: 1供货商 2经销商
export default [{
  name: '固定资产',
  value: 'assets',
  type: 1,
  f: assets()
}, {
  name: 'B设计',
  value: 'bProviderModule',
  type: 2,
  f: bProvider()
}]
