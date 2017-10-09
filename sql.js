let sql = {
    "get:gstin:startdate:enddate": `select gstin=rtrim(gstin),startDate,endDate from acc_setup;`,

    "get:gstr1:b2b": `select 
    bill_memo_gstin = bill_memo.gstin,
    details_gstin = (select GSTIN from details where acc_id = bill_memo.acc_id)
    ,customer_gstin = (select distinct GSTIN from customer where acc_id = bill_memo.acc_id),
    gstin_no = if bill_memo_gstin is not null and rtrim(bill_memo_gstin) <> '' then bill_memo_gstin 
       else if    details_gstin is not null and rtrim(details_gstin) <> '' then details_gstin else customer_gstin endif endif,
    invoice_no=ref_no,
	invoice_date="date",
	invoice_value= if "type" = 'S' then total_amt else -total_amt endif, 
	code = func_getacccode(bill_memo.acc_id),
	tax_code= func_getAccCode(sale_tax_sale_id),
	rate = (select rate= igst + cgst + sgst from tax where acc_id = bill_memo.sale_tax_sale_id),
    taxable_value_temp = (select sum(price * qty) from bill_memo_product where bill_memo_id = bill_memo.bill_memo_id), 
	taxable_value = if "type" = 'S' then taxable_value_temp else -taxable_value_temp endif,
	igst,
	cgst,
	sgst
        from bill_memo where
                gstin_no is not null and rtrim(gstin_no) <> '' 
                and "date" between :sdate and :edate
                    order by "date"`,

    "get:gstr1:b2cs": `select gst_code = func_getaccCode(sale_tax_sale_id),
    rate = (select rate = igst + cgst + sgst from tax where acc_id = bill_memo.sale_tax_sale_id),
    bill_memo_gstin = bill_memo.gstin,
    details_gstin = (select GSTIN from details where acc_id = bill_memo.acc_id)
    ,customer_gstin = (select distinct GSTIN from customer where acc_id = bill_memo.acc_id),
    gstin_no = if bill_memo_gstin is not null and rtrim(bill_memo_gstin) <> '' then bill_memo_gstin 
       else if    details_gstin is not null and rtrim(details_gstin) <> '' then details_gstin else customer_gstin endif endif
    ,taxable_value_temp = (select sum(price * qty) from bill_memo_product where bill_memo_id = bill_memo.bill_memo_id)
	, taxable_value = if "type" = 'S' then taxable_value_temp else -taxable_value_temp endif
    into #temp2    
       from bill_memo 
        where "date" between :sdate and :edate
            and gstin_no is null or rtrim(gstin_no) = ''
                order by "date";
    select gst_code,rate, taxable_value = sum(taxable_value) 
    from #temp2
        group by gst_code, rate
            order by rate`,
                        
    "get:gstr1:hsn": `select serial_no = number(),hsn,
	total_qty = sum(if bill_memo.type = 'S' then qty else -qty endif),
	tax_code= func_getacccode(bill_memo.sale_tax_sale_id),
	rate = (select rate = igst + cgst + sgst from tax where acc_id = bill_memo.sale_tax_sale_id),
    taxable_value = sum(if bill_memo.type = 'S' then  price*qty else -price*qty endif),
    igst_rate = (select igst from tax where tax.acc_Id = bill_memo.sale_tax_sale_id),
    cgst_rate = (select cgst from tax where tax.acc_Id = bill_memo.sale_tax_sale_id),
    sgst_rate = (select sgst from tax where tax.acc_Id = bill_memo.sale_tax_sale_id),
    igst= taxable_value * igst_rate/100,
    cgst = taxable_value * cgst_rate/100,
    sgst = taxable_value * sgst_rate/100,
    total_value = taxable_value + igst + cgst + sgst
    from bill_memo left join bill_memo_product
        where "date" between :sdate and :edate			
                group by hsn,rate,sale_tax_sale_id
                    order by hsn,rate`

};
module.exports = sql;