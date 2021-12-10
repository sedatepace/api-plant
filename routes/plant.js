const express = require('express');
const controller = require('../controllers/controller_plant');
const common = require('../config/common');
const msg = require('../value/message');
const router = express.Router();

/**
 * C 식물 등록
 * R 식물 조회(전체, 이름으로 조회)
 * U _id로 수정
 * D _id로 삭제 
 */

//READ 등록된 식물 전체 조회 하기. 
router.get('/', common.ipfilter(common.ips, {mode: 'allow'}), async (req, res) => {
    try{
        let out = await controller.get_all();
        res.send(out);
        return;
    } catch (err) {
        
        console.log({err:err});
    }
});

//READ 특정 식물명으로 조회하기
router.get('/:plant_name', common.ipfilter(common.ips, {mode: 'allow'}), async (req, res) => {
    try{
        let data = req.params;
        if(data.plant_name == undefined ) { // 파라미터값이 undefined 경우
            res.send(common.errorCode(msg.code.E201)); 
            return;
        }

        let out = await controller.get_by_plant_name(data.plant_name);
        res.send(out);
        return;
    } catch (err) {
        
        console.log({err:err});
    }
});


//식물 추가
/**
 * 파라미터
 * plant_name
 * etc
 */
router.post('/', common.ipfilter(common.ips, {mode: 'allow'}), async (req, res)=>{
    console.log({req_body: req.body});
    
    try{
        let data = req.body,
            result = {};

        if(
            (data.plant_name==undefined) || (data.etc==undefined) 
           
        ){
            res.send(common.successCode(0,"파라미터를 확인해주세요."));
            return;
        }else{
            //missing
            // if(valid.missingValidation(data)){
            //     result = {
            //         code: 500,
            //         rows: 0,
            //         output: '파라미터값을 확인해주세요.'
            //     }
            //     res.send(result);
            //     return;
            // }
        }

        let out = await controller.create(data.plant_name, data.etc);

        res.send(out);
        return;
    }catch(err){
        console.log({err:err});
    }
});

//책 삭제(with isbn)
router.delete('/', common.ipfilter(common.ips, {mode: 'allow'}), async (req, res)=>{
    console.log({req_body: req.body});
    try{
        let data = req.body;

        if(data.isbn == undefined || data.isbn =="") { // 파라미터값이 undefined 경우
            res.send(common.errorCode(msg.code.S002)); 
            return;
        }

        if(valid.missingValidation(data)) { // 파라미터값이 null 일 경우
            res.send(common.errorCode(msg.code.S003)); 
            return;
        }

        let out = await controller.book_delete_book(data.isbn);
        res.send(out);
        return;
    }catch(err){
        console.log({err:err});
    }
});

//연구 정보 수정(all columns)
router.post('/changeAll', common.ipfilter(common.ips, {mode: 'allow'}), async (req, res)=>{
    console.log({req_body: req.body});
    try{
        let data = req.body;

        if((data.PRTNO==undefined) || (data.TITLE==undefined) || (data.SPONSORID==undefined) || (data.SAPPL==undefined) || (data.SSEX==undefined) || (data.STARGET==undefined) || (data.SACTIVE==undefined) || (data.SNUM==undefined)) {
            res.send(common.errorCode('입력값을 확인하세요.'));
            return;
        }

        if(valid.missingValidation(data)) {
            res.send(common.errorCode('missing값을 확인하세요.'));
            return;
        }

        let out = await controller.study_change_allColumns(data.PRTNO, data.TITLE, data.SPONSORID, data.SAPPL, data.SSEX, data.STARGET, data.SACTIVE, data.SNUM);
        res.send(out);
        return;
    }catch(err){
        console.log({err:err});
    }
});

//특정 연구자가 참여한 모든 연구 가져오기 (with INVMAIL)
router.post('/getStudiesOfInvestigator', common.ipfilter(common.ips, {mode: 'allow'}), async (req, res)=>{
    console.log({req_body: req.body});
    try{
        let data = req.body;

        if(data.INVMAIL == undefined) {
            res.send(common.errorCode('입력값을 확인하세요.'));
            return;
        }

        if(valid.missingValidation(data)) {
            res.send(common.errorCode('missing값을 확인하세요.'));
            return;
        }

        let out = await controller.study_getStudiesOfInvestigator(data.INVMAIL);
        res.send(out);
        return;
    }catch(err){
        console.log({err:err});
    }
});

module.exports = router;
