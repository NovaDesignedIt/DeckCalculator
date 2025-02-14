import React, { useState } from 'react'
import { FaPlusSquare } from "react-icons/fa";
import { FaSquareMinus, FaSquarePlus } from "react-icons/fa6";

import './App.css'
import { Alert, Button, Divider, FormControl, FormControlLabel, FormLabel, InputLabel, MenuItem, Modal, Radio, RadioGroup, Select, SelectChangeEvent, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Zoom } from '@mui/material';
import { Modalstyle, BaseType, ExtType, Pallet, pallet12A, pallet12B, pallet12C, pallet16A, pallet16B, pallet16C } from './Utility';
import { BiSpreadsheet } from "react-icons/bi";
const textColor = "rgba(0, 0, 0, 0.6)";
const headerstyle = { padding: '4px 10px', color: textColor, fontWeight: '900' };
import { FaTrashAlt } from "react-icons/fa";
import { TbRuler } from 'react-icons/tb';

class Order {
  OrderNumber: string = "";
  baseType: BaseType | undefined;
  Extensions: ExtType[] = [];
};

function App() {

  const [Orders, UpdateSelectedOrders] = React.useState<Order[]>([]);
  const [focusedOrder, SetFocusedOrder] = React.useState<Order>(new Order);
  const [FocusedOrderNumber, SetFocusedOrderNumber] = React.useState("");
  const [ModalOpen, SetModalOpen] = React.useState(false);
  const [selectedPallet, setSelectedPallet] = React.useState<Pallet>(new Pallet());
  const [view, setView] = React.useState(0);

  const Pallets: Pallet[] = [
    pallet12A,
    pallet12B,
    pallet12C,
    pallet16A,
    pallet16B,
    pallet16C
  ];

  const GetPallet = (e: BaseType | ExtType | undefined) => {
    return Pallets.find(p => p.PalletType === e)
  }

  const SetPallet: any = (e: ExtType | BaseType | undefined) => {
    const p = Pallets.find(d => d.PalletType === e)
    if (p) {
      setSelectedPallet(p);
      return p;
    }

  }

  const breakdownOrder = (o: Order) => {

    const bp: Pallet | undefined = GetPallet(o.baseType);
    const p: (Pallet | undefined)[] = o.Extensions.map((e, i) => GetPallet(e));
    if (!bp) {
      return <></>
    }
    const lp = p.flatMap(x => Object.entries(x?.items ?? []));
    const combinedList = Object.entries(bp.items).concat(lp);
    const groupedItems = combinedList.reduce((acc: { [key: string]: number }, [item, quantity]) => {
      if (acc[item]) {
        acc[item] += quantity; // Add to existing quantity
      } else {
        acc[item] = quantity; // Initialize new item
      }
      return acc;
    }, {});
    return <>
      <Stack>
        {Object.entries(groupedItems).map((e, i) =>
        (
          <Stack direction={"row"}>
            <p style={{ margin: "0", width: "100px" }}> {e[0]}</p>
            <p style={{ margin: "0" }}> {e[1]}</p>
          </Stack>
        ))}
      </Stack>
    </>
  }

  const breakdownHardware = (o: Order) => {
    const bp: Pallet | undefined = GetPallet(o.baseType);
    const p: (Pallet | undefined)[] = o.Extensions.map((e, i) => GetPallet(e));

    if (!bp) {
      return <></>
    }
    const lp = p.flatMap(x => Object.entries(x?.Hardware.items ?? []));
    const combinedList = Object.entries(bp.Hardware.items).concat(lp);
    const groupedItems = combinedList.reduce((acc: { [key: string]: number }, [item, quantity]) => {
      if (acc[item]) {
        acc[item] += quantity; // Add to existing quantity
      } else {
        acc[item] = quantity; // Initialize new item
      }
      return acc;
    }, {});
    return <>
      <Stack>
        {Object.entries(groupedItems).map((e, i) =>
        (
          <Stack direction={"row"}>
            <p style={{ margin: "0", width: "100px" }}> {e[0]}</p>
            <p style={{ margin: "0" }}> {e[1]}</p>
          </Stack>
        ))}
      </Stack>
    </>
  }

  function mergeAllCounts(...objects: Record<string, number>[]): Record<string, number> {
    return objects.reduce((acc, obj) => {
      for (const [key, value] of Object.entries(obj)) {
        acc[key] = (acc[key] || 0) + value; // Sum the counts for each key
      }
      return acc;
    }, {} as Record<string, number>);
  }

  const breakdownNumberOrders = (single: boolean = true) => {
    var ExtensionsNum: Record<string, number>[] = [];
    const orders = single ? Orders.filter(x => x.OrderNumber === FocusedOrderNumber) : Orders;

    orders.forEach((e, i) => {
      const countMap = e.Extensions.reduce((acc: Record<string, number>, item) => {
        acc[item] = (acc[item] || 0) + 1; // Increment count if exists, otherwise initialize to 1
        return acc;
      }, {});
      ExtensionsNum.push(countMap);
    }
    )
    const mergedExtensions = ExtensionsNum.reduce((acc, obj) => {
      for (const [key, value] of Object.entries(obj)) {
        acc[key] = (acc[key] || 0) + value;
      }
      return acc;
    }, {} as Record<string, number>);
    return mergedExtensions;
  }

  const UpdateNumberOfOrders = () => {
    const order = new Order();
    order.OrderNumber = crypto.randomUUID().replace(/-/g, "").substring(0, 10);;
    UpdateSelectedOrders(prevOrders => [...prevOrders, order]);
  };

  const updateItem = (ord: Order) => {
    UpdateSelectedOrders((prevItems) =>
      prevItems.map((item) =>
        item.OrderNumber === ord.OrderNumber ? ord : item
      )
    );
  };

  const updateItemProperty = (id: string, property: keyof Order, value: any) => {
    if (property === 'baseType') {
      updateItemProperty(id, 'Extensions', [])
    }
    UpdateSelectedOrders((prevItems) =>
      prevItems.map((item) =>
        item.OrderNumber === id ? { ...item, [property]: value } : item
      )
    );
  };

  const getColorForExtension = (type: BaseType | ExtType) => {
    switch (type) {
      case BaseType.A12: return "#ffec4f";
      case ExtType.B12: return "#ffee62";
      case ExtType.C12: return "#fff076";
      case BaseType.A16: return "#ffad4e";
      case ExtType.B16: return "#ffb661";
      case ExtType.C16: return "#ffc077";
      default: return "";
    }
  }

  const returnExtenstion = (btype: BaseType | undefined, ext: number): ExtType | undefined => {
    if (btype === BaseType.A12) {
      if (ext === 6) {
        return ExtType.B12
      } else if (ext === 8) {
        return ExtType.C12
      }
    }
    if (btype === BaseType.A16) {
      if (ext === 6) {

        return ExtType.B16
      } else if (ext === 8) {
        return ExtType.C16
      }
    }
  }

  const RemoveOrder = () => {
    UpdateSelectedOrders(prevOrders => prevOrders.filter(order => order.OrderNumber !== FocusedOrderNumber));
  };

  React.useEffect(() => {
  }, []);

  return (

    <Stack
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: "center"
      }}>

      <Stack
        sx={{
          display: 'flex',
          width: "100%",
          justifyContent: "center",
          flexDirection: "row"
        }}>
        <h1 style={{ margin: "0" }} > Deck Dimensions Calculator</h1>
      </Stack>

      <hr />
      <Stack
        sx={{
          height: '5%',
          width: '90%',
          padding: "10px",
          display: 'flex',
          flexDirection: "row",
          justifyContent: "space-between",

          alignItems: "center",
        }}>
        <Stack direction={"row"} sx={{ width: "150px", justifyContent: "space-between" }}>
          <FaTrashAlt style={{ fontSize: "30px", cursor: "pointer" }} onClick={() => RemoveOrder()} >
            Remove
          </FaTrashAlt>
          <h1 style={{ margin: "0" }} > {Orders.length} </h1>
          <FaSquarePlus style={{ fontSize: "30px", cursor: "pointer" }} onClick={() => UpdateNumberOfOrders()}>
            Add New
          </FaSquarePlus>
        </Stack>

        <Stack sx={{ backgroundColor: "#DDD", gap: "100px", borderRadius: "15px", border: "2px solid #444" }} padding={"5px"} direction={"row"}>
          <h4 style={{ margin: "0" }}>ID: {FocusedOrderNumber}</h4>
          <h4 style={{ margin: "0" }}>BaseType: {GetPallet(Orders.find(x => x.OrderNumber === FocusedOrderNumber)?.baseType)?.description}</h4>
        </Stack>



        <Button sx={{
          marginRight: "30px",
          fontSize: "12px",
          bgcolor: "black",
          color: "white",
          border: "1px solid #444",
          boxShadow: "none",
          width: "25%",
          height: "40px",
          "&:hover": {
            bgcolor: "#555", // Remove hover background
          },
        }}>
          Download Packing Slip
        </Button>



      </Stack>

      <Stack
        sx={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
          gap: "10px",
          padding: "20px",
          overflow: "scroll",
          backgroundColor: "#111",
          border: "2px solid #444"
        }}>

        {
          Orders.map((e, i) =>
            <Stack onClick={() => SetFocusedOrderNumber(e.OrderNumber)}
              sx={{
                backgroundColor: FocusedOrderNumber === e.OrderNumber ? "#DDD" : "#EEE",
                maxHeight: "50%",
                width: "95%",
                gap: "10px",
                padding: "10px",
                cursor: "pointer",
                borderRadius: "10px"
              }}>

              <Stack onClick={() => SetFocusedOrderNumber(e.OrderNumber)}
                sx={{
                  height: "10%",
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between"

                }}>
                <Stack onClick={() => SetFocusedOrderNumber(e.OrderNumber)}
                  sx={{
                    height: "100%",
                    width: "15%",
                    flexDirection: "row",
                    justifyContent: "space-between"

                  }}>
                  <Stack sx={{ backgroundColor: "#000", gap: "100px", borderRadius: "15px", border: "2px solid #444" }} padding={"5px"} direction={"row"}>
                    <p style={{ margin: "0", color: "#fff", fontSize: "10px" }}>
                      {e.OrderNumber}
                    </p>
                  </Stack>

                  <Stack sx={{
                    flexDirection: "row",

                    cursor: "pointer",
                    alignItems: "center",


                  }}>

                    <p style={{ margin: "0", color: "#000", fontSize: "16px" }}>
                      12 x 12
                    </p>
                    <Radio
                      checked={e.baseType === BaseType.A12}
                      onChange={() => updateItemProperty(e.OrderNumber, 'baseType', BaseType.A12)}
                      value={BaseType.A12}
                      name="radio-buttons"
                      inputProps={{ 'aria-label': 'A' }}
                    />
                    <p style={{ margin: "0", color: "#000", fontSize: "16px" }}>
                      16 x 16
                    </p>
                    <Radio
                      checked={e.baseType === BaseType.A16}
                      onChange={() => updateItemProperty(e.OrderNumber, 'baseType', BaseType.A16)}
                      value={BaseType.A16}
                      name="radio-buttons"
                      inputProps={{ 'aria-label': 'B' }}
                    />

                  </Stack>
                </Stack>
                <Stack sx={{
                  flexDirection: "row",

                  cursor: "pointer",
                  gap: "40px",
                  alignItems: "center"
                }}>
                  <Stack onClick={() => { setView(2); SetFocusedOrder(Orders.find(p => p.OrderNumber === FocusedOrderNumber) ?? new Order); SetModalOpen(true); }} direction={"row"} sx={{ alignItems: "center", padding: "5px" }}>
                    <p style={{ margin: "0" }}>Breakdown</p>
                    <BiSpreadsheet style={{ fontSize: "30px" }} />
                  </Stack>

                  <Divider orientation='vertical'></Divider>
                  <FaSquareMinus
                    onClick={() => {
                      // Find the index of the first instance of '1' (or any item you want to remove)
                      const exttype = returnExtenstion(e.baseType, 6);
                      if (exttype) {
                        const index = e.Extensions.indexOf(exttype); // Replace '1' with the specific item you want to remove
                        // Check if the item exists in the array
                        if (index !== -1) {
                          // Create a new array without the first occurrence of the item
                          const newExtensions = [...e.Extensions]; // Create a copy of the original array
                          newExtensions.splice(index, 1); // Remove the first occurrence
                          // Update the item property
                          updateItemProperty(e.OrderNumber, 'Extensions', newExtensions);
                        }
                      }
                    }}
                    style={{ fontSize: "30px" }}
                  />
                  6ft Extension
                  <FaPlusSquare onClick={() => updateItemProperty(e.OrderNumber, 'Extensions',
                    [...e.Extensions, returnExtenstion(e.baseType, 6)]
                  )}
                    style={{ fontSize: "30px" }} />

                  <Divider orientation='vertical'></Divider>
                  <FaSquareMinus
                    onClick={() => {
                      // Find the index of the first instance of '1' (or any item you want to remove)
                      const exttype = returnExtenstion(e.baseType, 8);
                      if (exttype) {
                        const index = e.Extensions.indexOf(exttype); // Replace '1' with the specific item you want to remove
                        // Check if the item exists in the array
                        if (index !== -1) {
                          // Create a new array without the first occurrence of the item
                          const newExtensions = [...e.Extensions]; // Create a copy of the original array
                          newExtensions.splice(index, 1); // Remove the first occurrence
                          // Update the item property
                          updateItemProperty(e.OrderNumber, 'Extensions', newExtensions);
                        }
                      }
                    }}
                    style={{ fontSize: "30px" }}
                  />
                  8ft Extension
                  <FaPlusSquare
                    onClick={() => updateItemProperty(e.OrderNumber, 'Extensions',
                      [...e.Extensions, returnExtenstion(e.baseType, 8)]
                    )}
                    style={{ fontSize: "30px" }} />
                </Stack>

              </Stack>


              <Stack onClick={() => SetFocusedOrderNumber(e.OrderNumber)}
                sx={{
                  height: "100%",
                  width: "100%",
                  flexDirection: "row",
                  gap: "10px",
                  overflow: "scroll",
                  cursor: "pointer",
                  borderRadius: "10px",
                  alignItems: "Start",
                  justifyContent: "start"
                }}>

                {e.baseType !== undefined &&
                  <Zoom in={e.baseType !== undefined}>
                    <Stack onClick={() => { setView(1); SetPallet(e.baseType); SetModalOpen(true); }} width={250} height={150} minWidth={250}
                      sx={{
                        borderRadius: "10px",
                        backgroundColor: getColorForExtension(e.baseType),
                        padding: "10px"
                      }}>


                      {(() => {
                        const p = GetPallet(e.baseType);
                        return <Stack>
                          <h5 style={{ margin: "0" }}>
                            {p?.description}
                          </h5>
                          <p style={{ margin: "0" }}>
                            Length: {p?.dimensions.length} Width: {p?.dimensions.width}
                          </p>

                        </Stack>; // or <></> for an empty fragment
                      })()}



                    </Stack>
                  </Zoom>
                }

                {e.Extensions.map((e, i) =>
                  <Zoom in={e !== undefined}>
                    <Stack onClick={() => { setView(1); SetPallet(e); SetModalOpen(true); }} width={250} height={150} minWidth={250}
                      sx={{
                        borderRadius: "10px",
                        backgroundColor: getColorForExtension(e),
                        padding: "10px"
                      }}>


                      {(() => {
                        const p = GetPallet(e);
                        return <Stack>
                          <h5 style={{ margin: "0" }}>
                            {p?.description}
                          </h5>
                          <p style={{ margin: "0" }}>
                            Length: {p?.dimensions.length} Width: {p?.dimensions.width}
                          </p>
                          <Divider></Divider>
                          <p style={{ margin: "0" }}>
                            Hardware box : {p?.Hardware.hardwareNumber}
                          </p>


                        </Stack>; // or <></> for an empty fragment
                      })()}



                    </Stack>
                  </Zoom>
                )}

              </Stack>

            </Stack>
          )
        }

      </Stack>


      <Modal
        open={ModalOpen}
        onClose={() => {

          SetModalOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Stack
          direction={"column"}
          spacing={"10px"}
          sx={{
            ...Modalstyle,
            width: "70%",
            height: "80%",
            padding: "20px",
            borderRadius: "5px",
          }}
        >
          {
            view === 1 &&
            <>
              <h1 style={{ margin: 0 }}>{selectedPallet.description}</h1>
              <Stack direction={"row"} sx={{ gap: "10px" }} color={"#666"}>
                <h2 style={{ margin: 0 }}>Length: {selectedPallet.dimensions.length}</h2>
                <Divider orientation='vertical'></Divider>
                <h2 style={{ margin: 0 }}>Width: {selectedPallet.dimensions.width}</h2>
              </Stack>
              <Divider orientation='horizontal'></Divider>
              <Stack direction={"row"} sx={{ width: "60%", height: "90%", justifyContent: "space-between" }}>


                <Stack direction={"column"}>
                  <h2 style={{ margin: 0 }}>Material List:</h2>
                  <Divider orientation='horizontal'></Divider>
                  {Object.entries(selectedPallet.items).map(([item, quantity]: [string, number], index: number) => (
                    <Stack direction={"row"} sx={{ gap: "10px", width: "100%" }} key={index}>
                      <p style={{ margin: 0, width: "100px" }}>{item}</p>
                      <p style={{ margin: 0, width: "40px" }}>{quantity}</p>
                    </Stack>
                  ))}
                </Stack>

                <Stack direction={"column"}>
                  <h2 style={{ margin: 0 }}>Hardware List:</h2>
                  <Divider orientation='horizontal'></Divider>
                  {Object.entries(selectedPallet.Hardware.items).map(([item, quantity]: [string, number], index: number) => (
                    <Stack direction={"row"} sx={{ gap: "10px", width: "100%" }} key={index}>
                      <p style={{ margin: 0, width: "100px" }}>{item}</p>
                      <p style={{ margin: 0, width: "100px" }}>{quantity}</p>
                    </Stack>
                  ))}
                </Stack>


              </Stack>
            </>
          }

          {
            view === 2 &&
            <>
              <p style={{ color: "#666" }}>{focusedOrder.OrderNumber}</p>
              <h1 style={{ margin: 0 }}>{GetPallet(Orders.find(p => p.OrderNumber === FocusedOrderNumber)?.baseType)?.description}</h1>

              <Divider></Divider>
              <h2 style={{ margin: 0 }}>Extension Description:</h2>
              {
                Object.entries(breakdownNumberOrders(true)).map(([key, value]) => (
                  <Stack direction={"row"} sx={{ alignItems: "center", gap: "20px" }} key={key}>
                     <h1 style={{ margin: "0",width:"100px"  }}> <strong>{value}   X </strong></h1>  <h3 style={{ margin: "0"}}>   <strong> {GetPallet(Number(key))?.description} </strong> </h3> 
                  </Stack>
                ))

              }
              <Divider></Divider>

              <Stack direction={"row"} sx={{ width: "60%", height: "90%", justifyContent: "space-between" }}>


                <Stack direction={"column"}>
                  <h2 style={{ margin: 0 }}>Material Summary:</h2>
                  <Stack>
                    {breakdownOrder(focusedOrder)}
                  </Stack>
                </Stack>


                <Stack direction={"column"}>
                  <h2 style={{ margin: 0 }}>Hardware Summary:</h2>
                  <Stack>
                    {breakdownHardware(focusedOrder)}
                  </Stack>
                </Stack>



              </Stack>
            </>
          }

        </Stack>
      </Modal>
    </Stack>
  )
}

export default App
