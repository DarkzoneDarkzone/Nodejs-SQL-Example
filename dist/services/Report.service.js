"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExcel = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const exceljs_1 = __importDefault(require("exceljs"));
const moment_1 = __importDefault(require("moment"));
require("moment/locale/th");
/* Plugins */
let sql;
let dirPath = path.join(__dirname, "../../dist/public/");
/**
 * @param {ARRAY} _data [ [1, "A", "B", "example@gmail.com","male"] ]
 * @param {String} _fileName "fileName"
 * @param {String} _sheetName "sheetName"
 * @param {String} _pathName "upload/2022/01/"
 * @returns pathFileName
 */
const createExcel = (_data = [], _fileName = null, _sheetName = "My report", _pathName = null) => __awaiter(void 0, void 0, void 0, function* () {
    let date = new Date();
    let fileName = ((_fileName) ? _fileName : date.getTime()) + `.xlsx`;
    let folderPath = (_pathName) ? _pathName : `excel/${(0, moment_1.default)().format('YYYY')}/${(0, moment_1.default)().format('MM')}/`;
    let destination = dirPath + folderPath;
    /* สร้างโฟลเดอร์ */
    if (!fs.existsSync(`${destination}`))
        fs.mkdirSync(destination, { recursive: true });
    /* Create a new workbook */
    const workbook = new exceljs_1.default.Workbook();
    /* WorkSheetName */
    const worksheet = workbook.addWorksheet(_sheetName);
    /* Column for data in excel. key must match data key */
    worksheet.columns = [
        { header: "ซุ้มโต๊ะ", key: "B2", width: 10 },
        { header: "ประเภทโซน", key: "A1", width: 20 },
        { header: "โซน", key: "C3", width: 25 },
        { header: "วันที่", key: "F6", width: 20 },
        { header: "เวลา", key: "G7", width: 15 },
        { header: "ชื่อพนักงาน", key: "D4", width: 20 },
        { header: "สถานะ", key: "E5", width: 15 },
    ];
    /* Loop เพิ่มข้อมูลเข้า worksheet */
    yield _data.map((row) => { worksheet.addRow(row); });
    /* เพิ่มสไตล์ไว้เรียกใช้ */
    let addStyle = {
        headFill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '#FF9900' } },
        headFont: { color: { argb: '#ffffff' }, name: 'Arial', bold: true, size: 14, },
        bodyFill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '#ffffff' } },
        bodyFont: { color: { argb: '#000000' }, bold: false },
        bodyFillEmpty: { type: 'pattern', pattern: 'solid', fgColor: { argb: '#4d868c' } },
    };
    try {
        worksheet.eachRow(function (row, rowNumber) {
            /* Loop Column */
            row.eachCell(function (cell, colNumber) {
                if (cell.value != "") {
                    if (rowNumber == 1) {
                        /* Head */
                        row.getCell(colNumber).horizontalCentered = true;
                        row.getCell(colNumber).fill = addStyle.headFill;
                        row.getCell(colNumber).font = addStyle.headFont;
                    }
                    else {
                        /* Body */
                        // row.getCell(colNumber).fill = addStyle.bodyFill
                        row.getCell(colNumber).font = addStyle.bodyFont;
                        row.getCell(colNumber).horizontalCentered = true;
                    }
                }
                else {
                    /* ถ้าเป็นค่าว่าและไม่ใช่ row(1) */
                    if (rowNumber > 1) {
                        // row.getCell(colNumber).fill = addStyle.body  FillEmpty
                    }
                }
            });
        });
        /* Write file */
        yield workbook.xlsx.writeFile(destination + fileName);
        /* Return Path Upload */
        return folderPath + fileName;
    }
    catch (error) {
        throw new Error('Can not create file excel.');
    }
});
exports.createExcel = createExcel;
