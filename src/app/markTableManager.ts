import '../assets/style/selectableTable.scss'
import AttrSort from '../components/widgets/attrSort';
import { dragableCanvas } from '../components/widgets/dragableCanvas';
import Tool from '../util/tool';
import { chartManager } from "./chartManager"
import { MarkSelector } from './markSelector';

export class MarkTableManager {
    static selection: Set<string> = new Set();
    static disabledMarks: Set<string> = new Set();
    render() {
        const dataTableMarks = chartManager.markTables;
        const dataTabelContainer = document.getElementById("dataTabelContainer");
        dataTabelContainer.innerHTML = '';
        if(!dataTableMarks){
            return;
        }
        dataTableMarks.forEach((dataTableMark) => {
            const dataTable = document.createElement('table');
            dataTable.className = 'selectable-table';
            const headerTr: HTMLTableRowElement = document.createElement('tr');
            const th: HTMLTableHeaderCellElement = document.createElement('th');
            th.className = 'no-activate-th';
            const thContainer: HTMLDivElement = document.createElement('div');
            thContainer.className = 'th-container';
            const titleContent: HTMLParagraphElement = document.createElement('p');
            titleContent.innerHTML = 'Id';
            titleContent.className = 'non-activate-p';
            thContainer.appendChild(titleContent);
            //create sort button
            const sortBtn: HTMLSpanElement = document.createElement('span');
            let iconCls: string = '';
            if (dataTableMark.sortId === AttrSort.ASSCENDING_ORDER) {
                iconCls = `${AttrSort.ASSCENDING_ORDER}-icon activate-sort-btn`;
                th.title = `markId in asscending order`;
                titleContent.classList.remove('non-activate-p');
                th.classList.remove('no-activate-th');
            } else if (dataTableMark.sortId === AttrSort.DESCENDING_ORDER) {
                iconCls = `${AttrSort.DESCENDING_ORDER}-icon activate-sort-btn`;
                th.title = `markId in descending order`;
                titleContent.classList.remove('non-activate-p');
                th.classList.remove('no-activate-th');
            } else if (dataTableMark.sortId === 'none') {
                th.title = `Click to sort by markId`;
            }
            sortBtn.className = `sort-btn ${iconCls}`;
            th.onclick = () => {
                dataTableMark.sortAttribute = dataTableMark.sortAttribute.map(() => 'none');
                if (dataTableMark.sortId === 'none') {
                    dataTableMark.sortId = AttrSort.ASSCENDING_ORDER;
                }
                else if (dataTableMark.sortId === AttrSort.ASSCENDING_ORDER) {
                    dataTableMark.sortId = AttrSort.DESCENDING_ORDER;
                }
                else if (dataTableMark.sortId === AttrSort.DESCENDING_ORDER) {
                    dataTableMark.sortId = AttrSort.ASSCENDING_ORDER;
                }
                dataTableMark.items.sort((a, b) => {
                    if (dataTableMark.sortId === AttrSort.ASSCENDING_ORDER) {
                        if (parseFloat(a.id.split('mark')[1]) > parseFloat(b.id.split('mark')[1])) {
                            return 1;
                        } else if (parseFloat(a.id.split('mark')[1]) < parseFloat(b.id.split('mark')[1])) {
                            return -1;
                        } else {
                            return 0;
                        }
                    } else if (dataTableMark.sortId === AttrSort.DESCENDING_ORDER) {
                        if (parseFloat(a.id.split('mark')[1]) > parseFloat(b.id.split('mark')[1])) {
                            return -1;
                        } else if (parseFloat(a.id.split('mark')[1]) < parseFloat(b.id.split('mark')[1])) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                });
                this.render();
            }
            thContainer.appendChild(sortBtn);
            th.appendChild(thContainer);
            headerTr.appendChild(th);
            //attributes
            dataTableMark.fieldNames.forEach((fieldName, index) => {
                const th: HTMLTableHeaderCellElement = document.createElement('th');
                th.className = 'no-activate-th';
                const thContainer: HTMLDivElement = document.createElement('div');
                thContainer.className = 'th-container';
                const titleContent: HTMLParagraphElement = document.createElement('p');
                if (fieldName === '_MARKID') {
                    titleContent.innerHTML = 'Type';
                } else {
                    titleContent.innerHTML = fieldName;
                }
                titleContent.className = 'non-activate-p';
                thContainer.appendChild(titleContent);
                const sortBtn: HTMLSpanElement = document.createElement('span');
                let iconCls: string = '';
                if (dataTableMark.sortAttribute[index] === AttrSort.ASSCENDING_ORDER) {
                    iconCls = `${AttrSort.ASSCENDING_ORDER}-icon activate-sort-btn`;
                    th.title = `${fieldName} in asscending order`;
                    titleContent.classList.remove('non-activate-p');
                    th.classList.remove('no-activate-th');
                } else if (dataTableMark.sortAttribute[index] === AttrSort.DESCENDING_ORDER) {
                    iconCls = `${AttrSort.DESCENDING_ORDER}-icon activate-sort-btn`;
                    th.title = `${fieldName} in descending order`;
                    titleContent.classList.remove('non-activate-p');
                    th.classList.remove('no-activate-th');
                } else if (dataTableMark.sortAttribute[index] === 'none') {
                    th.title = `Click to sort by ${fieldName}`;
                }
                sortBtn.className = `sort-btn ${iconCls}`;
                th.onclick = () => {
                    dataTableMark.sortId = 'none';
                    dataTableMark.sortAttribute = dataTableMark.sortAttribute.map((value, i) => {
                        if (i === index) {
                            return value;
                        } else {
                            return 'none';
                        }
                    });
                    if (dataTableMark.sortAttribute[index] === 'none') {
                        dataTableMark.sortAttribute[index] = AttrSort.ASSCENDING_ORDER;
                    }
                    else if (dataTableMark.sortAttribute[index] === AttrSort.ASSCENDING_ORDER) {
                        dataTableMark.sortAttribute[index] = AttrSort.DESCENDING_ORDER;
                    }
                    else if (dataTableMark.sortAttribute[index] === AttrSort.DESCENDING_ORDER) {
                        dataTableMark.sortAttribute[index] = AttrSort.ASSCENDING_ORDER;
                    }
                    dataTableMark.sortAttribute.forEach((value, i) => {
                        const attributesType: string = dataTableMark.fieldType[i];
                        if (attributesType === 'string') {
                            if (value === AttrSort.ASSCENDING_ORDER) {
                                dataTableMark.items.sort((a, b) => {
                                    if (a.attributes[i] > b.attributes[i]) {
                                        return 1;
                                    } else if (a.attributes[i] < b.attributes[i]) {
                                        return -1;
                                    } else {
                                        return 0;
                                    }
                                })
                            } else if (value === AttrSort.DESCENDING_ORDER) {
                                dataTableMark.items.sort((a, b) => {
                                    if (a.attributes[i] > b.attributes[i]) {
                                        return -1;
                                    } else if (a.attributes[i] < b.attributes[i]) {
                                        return 1;
                                    } else {
                                        return 0;
                                    }
                                })
                            }

                        } else if (attributesType === 'number') {
                            if (value === AttrSort.ASSCENDING_ORDER) {
                                dataTableMark.items.sort((a, b) => {
                                    if (parseFloat(a.attributes[i]) > parseFloat(b.attributes[i])) {
                                        return 1;
                                    } else if (parseFloat(a.attributes[i]) < parseFloat(b.attributes[i])) {
                                        return -1;
                                    } else {
                                        return 0;
                                    }
                                })
                            } else if (value === AttrSort.DESCENDING_ORDER) {
                                dataTableMark.items.sort((a, b) => {
                                    if (parseFloat(a.attributes[i]) > parseFloat(b.attributes[i])) {
                                        return -1;
                                    } else if (parseFloat(a.attributes[i]) < parseFloat(b.attributes[i])) {
                                        return 1;
                                    } else {
                                        return 0;
                                    }
                                })
                            }
                        } else if (attributesType === 'month') {
                            //reverse order
                            if (!(value === AttrSort.ASSCENDING_ORDER && (dataTableMark.items[0].attributes.includes('Jan') || dataTableMark.items[0].attributes.includes('January')))) {
                                dataTableMark.items.sort((a, b) => {
                                    return -1;
                                })
                            }
                        }


                    })

                    this.render();
                }
                thContainer.appendChild(sortBtn);
                th.appendChild(thContainer);
                headerTr.appendChild(th);
            })
            dataTable.appendChild(headerTr);

            dataTableMark.items.forEach((item) => {
                const tr: HTMLTableRowElement = document.createElement('tr');
                tr.setAttribute('dataItem', item.id);
                const td: HTMLTableDataCellElement = document.createElement('td');
                td.innerText = item.id;
                tr.appendChild(td);
                item.attributes.forEach((value, index) => {
                    const td: HTMLTableDataCellElement = document.createElement('td');
                    td.innerText = value;
                    tr.appendChild(td);
                })
                tr.onmousedown = (downEvent) => {
                    let lastMouseX = downEvent.pageX, lastMouseY = downEvent.pageY;
                    const mouseMoveThsh: number = 3;

                    document.onmousemove = (moveEvt) => {
                        if (Tool.pointDist(lastMouseX, moveEvt.pageX, lastMouseY, moveEvt.pageY) > mouseMoveThsh) {
                            if (MarkTableManager.selection.size > 0) {
                                dragableCanvas.createCanvas(document.querySelector('#chartContainer > svg:first-of-type'), { x: downEvent.pageX, y: downEvent.pageY });
                            }
                        }
                    }
                    document.onmouseup = (upEvt) => {
                        if (Tool.pointDist(lastMouseX, upEvt.pageX, lastMouseY, upEvt.pageY) < mouseMoveThsh) {
                            MarkSelector.updateSelection([item.id]);
                        }
                        document.onmousemove = null;
                        document.onmouseup = null;
                    }
                }
                dataTable.appendChild(tr);
            })
            dataTabelContainer.appendChild(dataTable);
        })
        MarkTableManager.disabledMarks.forEach((id) => {
            this.notOptional(id);
        })
        MarkTableManager.selection.forEach((id) => {
            this.addHighLightRow(id);
        })

    }
    notOptional(id: string) {
        const tr: HTMLTableRowElement = document.querySelector(`tr[dataItem="${id}"]`);
        if (tr) {
            tr.setAttribute('style', 'opacity: 0.5');
        }
    }
    removeNotOptional(id: string) {
        const tr: HTMLTableRowElement = document.querySelector(`tr[dataItem="${id}"]`);
        if (tr) {
            tr.setAttribute('style', 'opacity: 1');
        }
    }
    addHighLightRow(id: string) {
        const tr: HTMLTableRowElement = document.querySelector(`tr[dataItem="${id}"]`);
        if (tr) {
            tr.classList.add('selected-td');
            tr.setAttribute('style', 'opacity: 1')
        }
    }
    removeHighLightRow(id: string) {
        const tr: HTMLTableRowElement = document.querySelector(`tr[dataItem="${id}"]`);
        if (tr) {
            tr.classList.remove('selected-td');
        }
    }
    reset() {
        MarkTableManager.selection.clear();
        MarkTableManager.disabledMarks.clear();
    }
}
export const markTableManager = new MarkTableManager()