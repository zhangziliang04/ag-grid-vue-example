import Vue from "vue";
import {AgGridVue} from "ag-grid-vue";

import "../node_modules/ag-grid/dist/styles/ag-grid.css";
import "../node_modules/ag-grid/dist/styles/ag-theme-fresh.css";

let SquareComponent = Vue.extend({
    template: '<span>{{ valueSquared() }}</span>',
    methods: {
        valueSquared() {
            return this.params.value * this.params.value;
        }
    }
});

export default {
    template: '' +
    '<div style="width: 900px;">' +
    '   <ag-grid-vue style="width: 100%; height: 350px;" class="ag-theme-fresh"' +
    '       :gridOptions="gridOptions"' +
    '       :columnDefs="columnDefs"' +
    '       :rowData="rowData">' +
    '    </ag-grid-vue>' +
    '</div>',
    data: function() {
        return {
            gridOptions: null,
            columnDefs: null,
            rowData: null
        }
    },
    components: {
        'ag-grid-vue': AgGridVue,
        'CubeComponent': {
            template: '<span>{{ valueCubed() }}</span>',
            methods: {
                valueCubed() {
                    return this.params.value * this.params.value * this.params.value;
                }
            }
        },
        ParamsComponent: {
            template: '<span>Field: {{params.colDef.field}}, Value: {{params.value}}</span>',
            methods: {
                valueCubed() {
                    return this.params.value * this.params.value * this.params.value;
                }
            }
        },
        ChildMessageComponent: {
            template: '<span><button style="height: 20px" @click="invokeParentMethod">Invoke Parent</button></span>',
            methods: {
                invokeParentMethod() {
                    this.params.context.componentParent.methodFromParent(`Row: ${this.params.node.rowIndex}, Col: ${this.params.colDef.headerName}`)
                }
            }
        }
    },
    methods: {
        createRowData() {
            const rowData = [];

            for (let i = 0; i < 15; i++) {
                rowData.push({
                    row: "Row " + i,
                    value: i,
                    currency: i + Number(Math.random().toFixed(2))
                });
            }

            this.rowData = rowData;
        },
        createColumnDefs() {
            this.columnDefs = [
                {headerName: "Row", field: "row", width: 100},
                {
                    headerName: "Square",
                    field: "value",
                    cellRendererFramework: SquareComponent,
                    editable: true,
                    colId: "square",
                    width: 100
                },
                {
                    headerName: "Cube",
                    field: "value",
                    cellRendererFramework: 'CubeComponent',
                    colId: "cube",
                    width: 100
                },
                {
                    headerName: "Row Params",
                    field: "row",
                    cellRendererFramework: 'ParamsComponent',
                    colId: "params",
                    width: 215
                },
                {
                    headerName: "Child/Parent",
                    field: "value",
                    cellRendererFramework: 'ChildMessageComponent',
                    colId: "params",
                    width: 120
                }
            ];
        },
        methodFromParent(cell) {
            alert(`"Parent Component Method from ${cell}!`);
        }
    },
    beforeMount() {
        this.gridOptions = {
            context: {
                componentParent: this
            }
        };
        this.createRowData();
        this.createColumnDefs();
    },
    mounted() {
        this.gridOptions.api.sizeColumnsToFit();
    }
}
