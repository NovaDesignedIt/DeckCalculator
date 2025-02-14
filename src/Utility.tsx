export const themeText = {
  borderRadius: "3px",
  fontSize:"25px",
  display: 'flex', // Use flexbox for the select container
  alignItems: 'center', // Vertically center the text inside the select
  justifyContent: 'center', // Horizontally center the text inside the select
  backgroundColor: "white",
  '& .MuiInputBase-input': {
    color: 'white', // Input text color
    textAlign: 'center', // Horizontally center the text
  },
  "& .MuiSvgIcon-root" :{
    color:"white"
  },

  '& .MuiFilledInput-root.Mui-focused': {
    borderBottom: '2px solid white', // Change border color when focused
  },


  "& .MuiOutlinedInput-root": {
      ":Hover,focus,selected,fieldset, &:not(:focus)": {
          "& > fieldset": { outline: "white", borderRadius: 0},
   
      },
      display: 'flex', // Flexbox inside the input
      alignItems: 'center', // Vertically center the input text

  },       
  input: { color: 'white'},
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)'
}

export const Modalstyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: "1px solid #333",
  boxShadow: 24,
  p: 4,
};

export enum BaseType {
  A12=1,
  A16=2,
}

export enum ExtType {
  B12=3,
  B16=4,
  C12=5,
  C16=6
}




/////////////////////

export class Hardware {
  hardwareNumber: string = "N/A";
  price: number = 0.0;
  includesLabor: boolean = false;
  description: string = "";
  items: Record<string, number> = {};
}


const hardware12A :Hardware = {
  hardwareNumber: "12A",
  price: 238.33,
  includesLabor: true,
  description: "12x12 Hardware",
  items: {
    "SCR-3DS": 1850,
    "SCR-1.58BS": 200,
    "BRK-L": 48,
    "FTB-01": 9,
    "SPCR-01": 1,
    "SCR-BIT": 2
  }
};

const hardware12B :Hardware = {
  hardwareNumber: "12B",
  price: 115.00,
  includesLabor: true,
  description: "6x12 Extension Hardware",
  items: {
    "SCR-3DS": 1050,
    "SCR-1.58BS": 120,
    "BRK-L": 24,
    "FTB-01": 3,
    "SPCR-01": 1,
    "SCR-BIT": 2
  }
};

const hardware16A  :Hardware = {
  hardwareNumber: "16A",
  price: 312.51,
  includesLabor: true,
  description: "16x16 Hardware",
  items: {
    "SCR-3DS": 2750,
    "SCR-1.58BS": 300,
    "BRK-L": 72,
    "FTB-01": 9,
    "SPCR-01": 1,
    "SCR-BIT": 2
  }
};


const hardware16B :Hardware = {
  hardwareNumber: "16B",
  price: 147.00,
  includesLabor: true,
  description: "8WIDE x16 Extension Hardware",
  items: {
    "SCR-3DS": 1400,
    "SCR-1.58BS": 150,
    "BRK-L": 36,
    "FTB-01": 3,
    "SPCR-01": 1,
    "SCR-BIT": 2
  }
};


//////////////////////////////////////////

export class Pallet {
  PalletType: BaseType | ExtType = BaseType.A12;
  dimensions: { length: number; width: number } = { length: 0, width: 0 };
  Hardware: Hardware = hardware12A;
  description: string = "";
  items: Record<string, number> = {};
}

export const pallet12A : Pallet = {
  PalletType: BaseType.A12,
  dimensions: {
    length: 12,
    width: 12
  }, 
  description: "12'l x 12'w Deck",
  items: {
    "6EJT": 4,
    "6JT": 20,
    "6PFBC": 6,
    "6EBM": 6,
    "6RJ": 4,
    "6PF": 4,
    "6DVD": 2,
    "6DB": 50,
    "6EXDB": 0,
    "6EXRJ": 0,
    "6EXBM": 0,
    "FBL": 6,
    "FBS": 3,
    "BMC": 3
  },
  Hardware: hardware12A
};

export const pallet12B : Pallet  = {
  PalletType: ExtType.B12,
  dimensions: {
    length: 12,
    width: 6
  },
  description: "6'w x 12'l Deck Extension (6' wide Addition to a 12x12 Deck)",
  items: {
    "6JT": 10,
    "6PFBC": 2,
    "6DVD": 2,
    "6DB": 25,
    "6EXRJ": 2,
    "6EXBM": 3,
    "FBL": 3,
    "FBS": 3,
    "BMC": 3
  },
  Hardware: hardware12B
};

export const pallet12C : Pallet  = {
  PalletType: ExtType.C12,
  dimensions: {
    length: 12,
    width: 8
  },
  description: "8'w x 12'l Extension (8' wide Addition to a 12x12 Deck)",
  items: {
    "6JT": 14,
    "6PFBC": 2,
    "6DVD": 2,
    "8DB": 25,
    "8EXRJ": 2,
    "8EXBM": 3,
    "FBL": 3,
    "FBS": 3,
    "BMC": 3
  },
  Hardware: hardware16B
};


export const pallet16A  : Pallet = {
  PalletType: BaseType.A16,
  dimensions: {
    length: 16,
    width: 16
  },
  description: "16'l x 16'w Deck",
  items: {
    "8EJT": 4,
    "8JT": 28,
    "8PFBC": 6,
    "8EBM": 6,
    "8RJ": 4,
    "8PF": 4,
    "8DVD": 2,
    "8DB": 64,
    "8EXDB": 0,
    "8EXRJ": 0,
    "8EXBM": 0,
    "FBL": 6,
    "FBS": 3,
    "BMC": 3
  },
  Hardware: hardware16A
};

export const pallet16C : Pallet  = {
  PalletType:ExtType.C16,
  dimensions: {
    length: 16,
    width: 8
  },
  description: "8'w x 16'l Deck Extension (8' wide Addition to a 16'x16' Deck)",
  items: {
    "8JT": 14,
    "8PFBC": 2,
    "8DVD": 2,
    "8DB": 32,
    "8EXRJ": 2,
    "8EXBM": 3,
    "FBL": 9,
    "FBS": 3,
    "BMC": 3
  },
  Hardware: hardware16B
};

export const pallet16B : Pallet  = {
  PalletType: ExtType.B16,
  dimensions: {
    length: 16,
    width: 6
  },
  description: "6'w x 16'l Extension (6' wide Addition to a 16'x16' Deck)",
  items: {
    "8JT": 10,
    "8PFBC": 2,
    "8DVD": 2,
    "6DB": 32,
    "6EXRJ": 2,
    "6EXBM": 3,
    "FBL": 3,
    "FBS": 3,
    "BMC": 3
  },
  Hardware: hardware16B
};



