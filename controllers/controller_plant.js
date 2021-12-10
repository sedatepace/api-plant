const common = require('../config/common');
const msg = require('../value/message');
require('date-utils');




// 모두 가져오기 
async function get_all() {
    let pool = common.getPool();
    let connection = await pool.getConnection(async conn => conn);
    try {

        var query = `SELECT EXISTS (SELECT * FROM plant) AS SUCCESS;`;
        var output = await connection.query(query);
        var result = {};

        if (output[0][0].SUCCESS == 0) {
            result = {
                code: 500,
                rows: 0,
                output: msg.code.S004
            }
            return result
        } else {
            query = `SELECT * FROM plant;`;
            output = await connection.query(query);

            result = {
                code: 200,
                rows: output[0].length,
                output: output[0]
            }
        }
        return result
    } catch (err) {
        console.error({ err: err })
        var result = {
            code: 500,
            rows: -1,
            output: err
        }
        return result
    } finally {
        connection.release();
    }
}

// 특정 값으로 조회(식물이름)
async function get_by_plant_name(plant_name) {
    let pool = common.getPool();
    let connection = await pool.getConnection(async conn => conn);

    try {
        //존재하는 book_list인지 확인
        let query = `SELECT * FROM plant WHERE name Like  ${connection.escape("%"+plant_name+"%")}`;
        console.log({query});
        let [plat_list] = await connection.query(query);

        if (!plat_list.length) {
            //값이 존재 하지 않는 경우
            return common.successCode(0, msg.code.S005);
        }

        return common.successCode(plat_list.length, plat_list);

    } catch (err) {
        console.log({err});
        return common.errorCode(msg.code.E203);
    } finally {
        connection.release();
    }
}


//측정값 입력하기. 
async function create(plant_name, etc) {
    let pool = common.getPool();
    let connection = await pool.getConnection(async conn => conn)
   

    try {

        //기존 등록된 식물인지
        let query = `SELECT EXISTS (SELECT * FROM plant WHERE name=${connection.escape(plant_name)}) AS SUCCESS;`;
        let [output] = await connection.query(query);
        var result = {};
        if(output[0].SUCCESS!=0){
           return common.successCode(output.length, msg.code.S006); 
        }

        //----------------
        //측정값 추가하기

        query = `INSERT INTO plant(name, etc)
                    VALUES(${connection.escape(plant_name)}, ${connection.escape(etc)});`;
        console.log(query);
        await connection.query(query);
        
        query = `SELECT * FROM plant WHERE name = ${connection.escape(plant_name)} and etc = ${connection.escape(etc)}` 

        output = await connection.query(query);

        return common.successCode(output.length, output[0])
    } catch (err) {
        console.error({ err: err })
        var result = {
            code: 500,
            rows: -1,
            output: msg.code.E203
        }
        return result
    } finally {
        connection.release();
    }
}

//책 삭제 (key=isbn)
async function book_delete_book(isbn) {
    let pool = common.getPool();
    let connection = await pool.getConnection(async conn => conn)

    try {
        //존재하는 책인지 확인
        let query = `SELECT EXISTS (SELECT * FROM book WHERE isbn = ${connection.escape(isbn)}) AS SUCCESS;;`;
        let [output] = await connection.query(query);


        if (output[0].SUCCESS==0) {
            //isbn에 해당 도서가 없습니다.
            return common.successCode(0, `${msg.code.S001}`); // 해당도서가 없습니다.
        }

        query = `DELETE FROM book WHERE isbn=${connection.escape(isbn)};`;
        await connection.query(query);
        return common.successCode(1, `${msg.code.S004}`); //삭제되었습니다.

    } catch (err) {
        return common.errorCode("오류");
    } finally {
        connection.release();
    }
}





module.exports = {
    get_all,
    get_by_plant_name,
    book_delete_book,
    create


}

