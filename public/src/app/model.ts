export class b2bChild {
    "ctin": string;
    "inv": [
        {
            "inum": string,
            "idt": string,
            "val": number,
            "pos": string,
            "rchrg": string,
            "inv_typ": string,
            "itms": [
                {
                    "num": number,
                    "itm_det": {
                        "txval": number,
                        "rt": number,
                        "camt": number,
                        "samt": number
                    }
                }
            ]
        }
    ]
};
export function getb2bInstance() {
    let b2bInstance = {
        "ctin": "",
        "inv": [
            {
                "inum": "",
                "idt": "",
                "val": 0,
                "pos": "",
                "rchrg": "",
                "inv_typ": "",
                "itms": [
                    {
                        "num": 0,
                        "itm_det": {
                            "txval": 0,
                            "rt": 0,
                            "camt": 0,
                            "samt": 0
                        }
                    }
                ]
            }
        ]
    };
    return(b2bInstance);
}
