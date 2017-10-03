let sql = {
    'gstr1:test':`select acc_name,acc_id from acc_main`,    
    'tunnel:get:todays:sale': `SELECT "pos_name",   
         id="master_id" ,
			sale = (select sum(if type = 'S' then total_amt else -total_amt endif) from bill_memo
			where "date" = date(:mdate) and pos_id in(select pos_id from pointofsale where master_id = a.master_id)),
			gp = (select sum(gross_profit) from bill_memo_product key join bill_memo where "date" = date(:mdate) and pos_id in(select pos_id 
			from pointofsale where master_id = a.master_id)),
			cgp = (select sum(qty * func_getgp(product.pr_id,(price - bill_memo_product.discount))) from 
			bill_memo_product key join inv_main key join product key join bill_memo  where "date" = date(:mdate) and pos_id in(select pos_id 
			from pointofsale where master_id = a.master_id))
            FROM "pos_master"   as a where sale is not null
        union
        SELECT "pos_name" = 'Direct Sale',   
                id =null,
                    sale = (select sum(if type = 'S' then total_amt else -total_amt endif) from bill_memo
                    where "date" = date(:mdate) and pos_id is null ),
                    gp = (select sum(gross_profit) from bill_memo key join bill_memo_product 
                    where "date" = date(:mdate) and pos_id is null) ,
                    cgp = 0
            FROM dummy where sale is not null order by pos_name`,
    'tunnel:get:business:health': `
        declare @customValue varchar(128) 
    	declare @custom decimal 
	    set @customValue = (select MValue from KVSetting where MKey = 'customFigures') 
	    set @custom = (SELECT sum(row_value) FROM sa_split_list( @customValue )) 
	    select OPStockValue=(sum(op * (if P.op_price is null then 0 else P.op_price endif))), 
		ClosStockValue = (sum((op+db-cr) * (if p.last_price is null or P.last_price = 0 then P.op_price else P.last_price endif))), 
	    StockOver90Days = ( select sum((op+db-cr) *(if p1.last_price is null or P1.last_price=0 then P1.op_price else P1.last_price endif)) 
	    from inv_main I1 key join product P1 where P1.last_date < dateAdd(day,-90,getdate())), 
	    StockOver180Days = ( select sum((op+db-cr) *(if p1.last_price is null or P1.last_price=0 then P1.op_price else P1.last_price endif)) 
	    from inv_main I1 key join product P1 where P1.last_date < dateAdd(day,-180,getdate())), 
	    StockOver270Days = ( select sum((op+db-cr) *(if p1.last_price is null or P1.last_price=0 then P1.op_price else P1.last_price endif)) 
	    from inv_main I1 key join product P1 where P1.last_date < dateAdd(day,-270,getdate())), 
	    StockOver360Days = ( select sum((op+db-cr) *(if p1.last_price is null or P1.last_price=0 then P1.op_price else P1.last_price endif)) 
	    from inv_main I1 key join product P1 where P1.last_date < dateAdd(day,-360,getdate())), 
	    StockValueDiff=ClosStockValue - OPStockValue into #Stock 
	    from inv_main I key join product P 
	    select Profit = sum(acc_opBal + acc_db - acc_cr) into #Profit 
	    from acc_main where acc_root in('Y','L') and acc_type in('A','L') 
	    select #Stock.opStockValue, #Stock.closStockValue, #Stock.stockValueDiff,#Stock.stockOver90Days,#Stock.stockOver180Days,#Stock.stockOver270Days,#Stock.stockOver360Days, #Profit.profit, grossProfit = #Stock.stockValueDiff + #Profit.profit  
	    +@custom from #stock, #Profit
        `,
    'tunnel:get:cheque:payments': `SELECT "cheque_payment"."ref_no",   
         "cheque_payment"."cheq_no", 
         "cheque_payment"."cheq_date",  
         "cheque_payment"."cheq_amt",   
         "cheque_payment"."acc_id_bank",   
         "cheque_payment"."remarks", 
    		pay_from = func_getaccname(acc_id_bank),
			pay_to = func_getaccname(acc_id)
        FROM "cheque_payment" order by cheq_date desc`,
        
};
module.exports = sql;