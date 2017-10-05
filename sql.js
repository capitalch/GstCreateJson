let sql = {
	"post:gstr1:reg:sale":`select 
    bill_memo_gstin = bill_memo.gstin,
    details_gstin = (select GSTIN from details where acc_id = bill_memo.acc_id)
    ,customer_gstin = (select distinct GSTIN from customer where acc_id = bill_memo.acc_id),
    gstin_no = if bill_memo_gstin is not null and rtrim(bill_memo_gstin) <> '' then bill_memo_gstin 
       else if    details_gstin is not null and rtrim(details_gstin) <> '' then details_gstin else customer_gstin endif endif,
    invoice_no=ref_no,invoice_date="date",invoice_value= total_amt, code = func_getacccode(bill_memo.acc_id),
	tax_code= func_getAccCode(sale_tax_sale_id),
	rate = (select rate= igst + cgst + sgst from tax where acc_id = bill_memo.sale_tax_sale_id),
    taxable_value = (select sum(price * qty) from bill_memo_product where bill_memo_id = bill_memo.bill_memo_id), igst,cgst,sgst
        from bill_memo
            where type='S' 
                and gstin_no is not null and rtrim(gstin_no) <> '' 
                and "date" between :sdate and :edate
                    order by "date"`,

	"post:gstr1:unreg:sale":`select gst_code = func_getaccCode(sale_tax_sale_id),
    rate = (select rate = igst + cgst + sgst from tax where acc_id = bill_memo.sale_tax_sale_id),
    bill_memo_gstin = bill_memo.gstin,
    details_gstin = (select GSTIN from details where acc_id = bill_memo.acc_id)
    ,customer_gstin = (select distinct GSTIN from customer where acc_id = bill_memo.acc_id),
    gstin_no = if bill_memo_gstin is not null and rtrim(bill_memo_gstin) <> '' then bill_memo_gstin 
       else if    details_gstin is not null and rtrim(details_gstin) <> '' then details_gstin else customer_gstin endif endif
    ,taxable_value = (select sum(price * qty) from bill_memo_product where bill_memo_id = bill_memo.bill_memo_id)
    into #temp2    
       from bill_memo 
        where type='S'
            and "date" between :sdate and :edate
            and gstin_no is null or rtrim(gstin_no) = ''
                order by "date";
select gst_code,rate, taxable_value = sum(taxable_value) 
    from #temp2
        group by gst_code, rate
            order by rate`,
	"post:gstr1:hsn:sale":`select serial_no = number(),hsn,total_qty = sum(qty),
	tax_code= func_getacccode(bill_memo.sale_tax_sale_id),
	rate = (select rate = igst + cgst + sgst from tax where acc_id = bill_memo.sale_tax_sale_id),
    taxable_value = sum(price*qty),
    igst_rate = (select igst from tax where tax.acc_Id = bill_memo.sale_tax_sale_id),
    cgst_rate = (select cgst from tax where tax.acc_Id = bill_memo.sale_tax_sale_id),
    sgst_rate = (select sgst from tax where tax.acc_Id = bill_memo.sale_tax_sale_id),
    igst= taxable_value * igst_rate/100,
    cgst = taxable_value * cgst_rate/100,
    sgst = taxable_value * sgst_rate/100,
    total_value = taxable_value + igst + cgst + sgst
    from bill_memo left join bill_memo_product
        where type='S' 
            and "date" between :sdate and :edate
                group by hsn,bill_memo.sale_tax_sale_id
                    order by hsn`,
	"post:gstr2":'select acc_id,acc_code into #temp1 from acc_main; select bill_memo_id into #temp2 from bill_memo; select * from  #temp2',
	"post:acc":`select acc_id,acc_code from acc_main`,
	"post:bill":`select bill_memo_id from bill_memo`,
	"post:product":`select * from bill_memo_product`,
	"post:tax":`select * from tax`,
	"post:invoice":`select * from invoice`,
	"post:gstr1": `
	select 
    bill_memo_gstin = bill_memo.gstin,
    details_gstin = (select GSTIN from details where acc_id = bill_memo.acc_id)
    ,customer_gstin = (select distinct GSTIN from customer where acc_id = bill_memo.acc_id),
    gstin_no = if bill_memo_gstin is not null and rtrim(bill_memo_gstin) <> '' then bill_memo_gstin 
       else if    details_gstin is not null and rtrim(details_gstin) <> '' then details_gstin else customer_gstin endif endif,
    invoice_no=ref_no,invoice_date="date",invoice_value= total_amt, code = func_getacccode(bill_memo.acc_id), tax_code= func_getAccCode(sale_tax_sale_id),
    taxable_value = (select sum(price * qty) from bill_memo_product where bill_memo_id = bill_memo.bill_memo_id), igst,cgst,sgst
        from bill_memo
            where type='S' 
                and gstin_no is not null and rtrim(gstin_no) <> '' 
                and "date" between :sdate and :edate
					order by "date"

	select gst_code = func_getaccCode(sale_tax_sale_id),
					bill_memo_gstin = bill_memo.gstin,
					details_gstin = (select GSTIN from details where acc_id = bill_memo.acc_id)
					,customer_gstin = (select distinct GSTIN from customer where acc_id = bill_memo.acc_id),
					gstin_no = if bill_memo_gstin is not null and rtrim(bill_memo_gstin) <> '' then bill_memo_gstin 
					   else if    details_gstin is not null and rtrim(details_gstin) <> '' then details_gstin else customer_gstin endif endif
					,taxable_value = (select sum(price * qty) from bill_memo_product where bill_memo_id = bill_memo.bill_memo_id)
					into #temp2    
					   from bill_memo 
						where type='S'
							and "date" between :sdate and :edate
							and gstin_no is null or rtrim(gstin_no) = ''
								order by "date"
	
	select gst_code, taxable_value = sum(taxable_value) 
					from #temp2
						group by gst_code
							order by gst_code
	
	select gst_code, taxable_value = sum(taxable_value) 
					from #temp2
						group by gst_code
							order by gst_code				
					`,
	'gstr1:test': `select acc_name,acc_id from acc_main`,
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