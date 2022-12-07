import { DBconnect } from '../util/dbconnect'
import * as fs from 'fs'
import * as path from 'path';
import excelJS from 'exceljs'
import moment from 'moment';
import 'moment/locale/th';

/* Plugins */
let sql: string;
let dirPath = path.join(__dirname, "../../dist/public/")
/**
 * @param {ARRAY} _data [ [1, "A", "B", "example@gmail.com","male"] ]
 * @param {String} _fileName "fileName"
 * @param {String} _sheetName "sheetName"
 * @param {String} _pathName "upload/2022/01/"
 * @returns pathFileName
 */
export const createExcel = async ( _data: any = [],prop: any,  _fileName: any = null, _sheetName:string = "My report", _pathName: any = null) => {
    let date = new Date(); 
    let fileName = ((_fileName)? _fileName : date.getTime()) +`.xlsx` 
    let folderPath = (_pathName)? _pathName : `excel/${moment().format('YYYY')}/${moment().format('MM')}/`
    let destination = dirPath + folderPath;

    /* สร้างโฟลเดอร์ */
    if(!fs.existsSync(`${destination}`)) fs.mkdirSync(destination, { recursive: true }); 
    /* Create a new workbook */
    const workbook = new excelJS.Workbook();   
    /* WorkSheetName */
    const worksheet = workbook.addWorksheet(_sheetName);  

    /* Column for data in excel. key must match data key */
    worksheet.columns = [ 
        { header: "", key: "A", width: 10 }, 
        { header: "", key: "B", width: 20 }, 
        { header: "", key: "C", width: 35 }, 
        { header: "", key: "D", width: 20 }, 
        { header: "", key: "E", width: 15 }, 
        { header: "", key: "F", width: 20 }, 
        { header: "", key: "G", width: 15 }, 
    ]

    /* Loop เพิ่มข้อมูลเข้า worksheet */
    worksheet.addRow([ `กรองข้อมูล : วันที่ ${prop.beginDate} ถึง วันที่ ${prop.endDate} ` ]) 
    worksheet.addRow([ "ซุ้มโต๊ะ","ประเภทโซน","โซน","วันที่","เวลา","ชื่อพนักงาน","สถานะ"]) 
    await _data.map( (row: any) => { 
        worksheet.addRow(row) 
    })

     /* เพิ่มสไตล์ไว้เรียกใช้ */
     let addStyle = {
        titleFill: { type: 'pattern', pattern: 'solid', fgColor: { argb:'#000000' }}, 
        titleFont: { color: { argb: '#ffffff' }, name: 'Arial', bold: false, size: 11, },
        headFill: { type: 'pattern', pattern: 'solid', fgColor: { argb:'#FF9900' }}, 
        headAlign: { vertical: "middle", horizontal: "center" },
        headFont: { color: { argb: '#ffffff' }, name: 'Arial', bold: false, size: 12, },
        bodyFill: { type: 'pattern', pattern: 'solid', fgColor: { argb:'#ffffff' } },
        bodyFont: { color: { argb: '#000000' }, bold: false },
        bodyFillEmpty: { type: 'pattern', pattern: 'solid', fgColor: { argb:'#4d868c' } } 
    }

    try {
        worksheet.eachRow(function(row: any, rowNumber: any){ 
            /* Loop Column */ 
            row.eachCell( function(cell: any, colNumber: any){ 
                if(cell.value != "") {
                    if(rowNumber == 2){
                        /* Head */
                        if(colNumber == 1){
                            worksheet.mergeCells('A2:G2');
                        }
                        row.height = 25
                        row.getCell(colNumber).fill = addStyle.titleFill
                        row.getCell(colNumber).font = addStyle.titleFont
                        row.getCell(colNumber).alignment = addStyle.headAlign

                    }else if(rowNumber == 3){
                        /* Head */
                        row.height = 20
                        row.getCell(colNumber).horizontalCentered = true;
                        row.getCell(colNumber).fill = addStyle.headFill
                        row.getCell(colNumber).font = addStyle.headFont
                        row.getCell(colNumber).alignment = addStyle.headAlign

                        row.getCell(colNumber).border = {
                            top: {style:'thin', color: {argb:'000000'}},
                            left: {style:'thin', color: {argb:'000000'}},
                            bottom: {style:'thin', color: {argb:'000000'}},
                            right: {style:'thin', color: {argb:'000000'}}
                        };
                    
                    } else {
                        /* Body */
                        row.height = 20
                        // row.getCell(colNumber).font = addStyle.bodyFont
                        row.getCell(colNumber).horizontalCentered = true;
                        row.getCell(colNumber).font = (colNumber == 7)
                            ? { color: { argb: row.getCell(colNumber + 1).value }, bold: false }
                            : addStyle.bodyFont;
                        if(colNumber == 8){
                            row.getCell(colNumber).value = ""
                        }
                    }
                } 
            });
        });

        /* Write file */
        await workbook.xlsx.writeFile(destination + fileName);
        /* Return Path Upload */
        return folderPath + fileName
    } catch (error) {
        throw new Error('Can not create file excel.')
    }
}   

export const createBillExcel = async ( _data: any = [], prop: any,  _fileName: any = null, _sheetName:string = "Bill report", _pathName: any = null) => {
    let date = new Date(); 
    let fileName = ((_fileName)? _fileName : date.getTime()) +`.xlsx` 
    let folderPath = (_pathName)? _pathName : `excel/${moment().format('YYYY')}/${moment().format('MM')}/`
    let destination = dirPath + folderPath;

    /* สร้างโฟลเดอร์ */
    if(!fs.existsSync(`${destination}`)) fs.mkdirSync(destination, { recursive: true }); 
    /* Create a new workbook */
    const workbook = new excelJS.Workbook();   
    /* WorkSheetName */
    const worksheet = workbook.addWorksheet(_sheetName);  

    /* เพิ่มสไตล์ไว้เรียกใช้ */
    let addStyle = {
        titleFill: { type: 'pattern', pattern: 'solid', fgColor: { argb:'#000000' }}, 
        titleFont: { color: { argb: '#ffffff' }, name: 'Arial', bold: false, size: 11, },
        headFill: { type: 'pattern', pattern: 'solid', fgColor: { argb:'#FF9900' }}, 
        headAlign: { vertical: "middle", horizontal: "center" },
        headFont: { color: { argb: '#ffffff' }, name: 'Arial', bold: false, size: 12, },
        bodyFill: { type: 'pattern', pattern: 'solid', fgColor: { argb:'#ffffff' } },
        bodyFont: { color: { argb: '#000000' }, bold: false },
        bodyFillEmpty: { type: 'pattern', pattern: 'solid', fgColor: { argb:'#4d868c' } },
    }

    worksheet.columns = [ 
        { header: "", key: "type", width: 15 },
        { header: "", key: "zone", width: 40 },
        { header: "", key: "hut", width: 20 },
        { header: "", key: "count", width: 15 },
    ]

    /* Loop เพิ่มข้อมูลเข้า worksheet */
    worksheet.addRow([ `กรองข้อมูล : วันที่ ${prop.beginDate} ถึง วันที่ ${prop.endDate} `,  '', '',   '' ]) 
    worksheet.addRow([ "ประเภท", "โซน", "ซุ้มโต๊ะ", "จำนวนบิล" ]) 
    await _data.map( (row: any) => { 
        worksheet.addRow(row) 
    })
     
    try {
        worksheet.eachRow(function(row: any, rowNumber: any){ 
            /* Loop Column */ 
            row.eachCell( function(cell: any, colNumber: any){
            
                if(cell.value != "") {
                    if(rowNumber == 2){
                        /* Head */
                        if(colNumber == 1){
                            worksheet.mergeCells('A2:D2');
                        }
                        row.height = 25
                        row.getCell(colNumber).fill = addStyle.titleFill
                        row.getCell(colNumber).font = addStyle.titleFont
                        row.getCell(colNumber).alignment = addStyle.headAlign

                    }else if(rowNumber == 3){
                        /* Head */
                        row.height = 20
                        row.getCell(colNumber).horizontalCentered = true;
                        row.getCell(colNumber).fill = addStyle.headFill
                        row.getCell(colNumber).font = addStyle.headFont
                        row.getCell(colNumber).alignment = addStyle.headAlign

                        row.getCell(colNumber).border = {
                            top: {style:'thin', color: {argb:'000000'}},
                            left: {style:'thin', color: {argb:'000000'}},
                            bottom: {style:'thin', color: {argb:'000000'}},
                            right: {style:'thin', color: {argb:'000000'}}
                        };
                    
                    } else {
                        /* Body */
                        row.height = 20
                        row.getCell(colNumber).font = addStyle.bodyFont
                        row.getCell(colNumber).horizontalCentered = true;
                    }
                } 
            });
        });

        /* Write file */
        await workbook.xlsx.writeFile(destination + fileName);
        /* Return Path Upload */
        return folderPath + fileName
    } catch (error) {
        throw new Error('Can not create file excel.')
    }
}   