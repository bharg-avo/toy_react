import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import { classNames } from 'primereact/utils';
import './index.css';
import React, { useState, useEffect, useRef, useMemo } from 'react';

import { AiOutlinePauseCircle, AiOutlineEdit, AiOutlinePlayCircle, AiOutlineClose, AiOutlineCheckCircle } from "react-icons/ai";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { ProductService } from './service/ProductService';
import { Tooltip } from 'primereact/tooltip';
import { Toolbar } from 'primereact/toolbar';
import { Menu } from 'primereact/menu';
import { BlockUI } from 'primereact/blockui';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Divider } from 'primereact/divider';
import { ContextMenu } from 'primereact/contextmenu';
import { MdPlayCircleFilled, MdUndo } from "react-icons/md";
import { FaEraser } from "react-icons/fa";
import { CgMaximize } from "react-icons/cg";
import { GrClose } from "react-icons/gr";
import vector from './Vector.png'
import mindmap from './mindmap.png'
import dots from './dots.png'
import view from './view.png'
import { SpeedDial } from 'primereact/speeddial';
import './ScrollPanelDemo.css';
import './SpeedDialDemo.css';
import './DataTableDemo.css';
import './objectPropertyTable.css'
import useDimensions from './useDimensions'
import { getKeywordList, getObjNameList } from './service/UtilService';
const DataTableEditDemo = ({ saved, pause, port, setBlockedDocument, setScreenNames, projectData, setCloseGeniusWindow, setFinalData, setTempData, stop, tableData, start, screenNames, dataobjects, toggleFullScreen }) => {

  useEffect(() => {
    if (saved) {
      port.postMessage("getMindmap");
      window.chrome.windows.update(projectData.geniusWindowId, { state: "minimized" }, function (windowUpdated) {
        //do whatever with the maximized window
      });
      setBlockedDocument(false);
    }
  }, [saved])

  useEffect(() => {
    setTableAfterOperation(tableDataNew)
  }, [stop, pause])
  let emptyProduct = {
    id: null,
    name: '',
    image: null,
    description: '',
    category: null,
    price: 0,
    quantity: 0,
    rating: 0,
    inventoryStatus: 'INSTOCK'
  };
  let emptyStepData = {
    "stepNo": '',
    "objectName": ' ',
    "custname": '',
    "keywordVal": '',
    "inputVal": [""],
    "outputVal": '',
    "remarks": "",
    "url": ' ',
    "appType": "Web",
    "addDetails": "",
    "cord": ''
  }
  const [rawTable, setRawTable] = useState([])
  const [message, setMessage] = useState('')
  const [dele, setDele] = useState(false)
  const [segrTable, setSegrTable] = useState([])
  const [popup, showPopup] = useState(false)
  const [flag, setFlag] = useState(false)
  const [products1, setProducts1] = useState(null);
  const [products2, setProducts2] = useState(null);
  const [products3, setProducts3] = useState(null);
  const [products4, setProducts4] = useState(null);
  const [editingRows, setEditingRows] = useState({});
  const toast = useRef(null);
  const cm = useRef(null);
  const popupRef = useRef(null)
  const playRef = useRef(null)
  const textRef = useRef(null)
  const menu = useRef(null);
  const [expandedRows, setExpandedRows] = useState(null);
  const [keywordList, setKeywordList] = useState([]);
  const [expand, setExpand] = useState(false)

  const isMounted = useRef(false);
  //  
  const [card, setCard] = useState(false)
  const [popupData, setPopupData] = useState([]);
  const [products, setProducts] = useState(null);
  const [productDialog, setProductDialog] = useState(false);
  const [screenDialog, setScreenDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [displayBasic2, setDisplayBasic2] = useState(false);
  const [position, setPosition] = useState('center');
  const [singleData, setSingleData] = useState(emptyStepData);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [showFullXpath, setShowFullXpath] = useState(false)
  const [stepNoAbove, setStepAbove] = useState(null)
  const [stepNoBelow, setStepBelow] = useState(null)
  const [edit, setEdit] = useState(false)
  const [insert, setInsert] = useState(false)
  const [insertAbove, setInsertAbove] = useState(false);
  const [insertBelow, setInsertBelow] = useState(false)
  const [location, setLocation] = useState({ center: '', bottom: '' })
  const [eraseData, seteraseData] = useState(false);
  const [tableAfterOperation, setTableAfterOperation] = useState([])
  const [createNewIndex, setCreateNewIndex] = useState(null)
  const [insertAtStep, setInsertAtStep] = useState(false)
  // const [blockedDocument, setBlockedDocument] = useState(false);
  const [copiedData, setCopiedData] = useState(null)
  const [closeApp, setCloseApp] = useState(false)
  const [maxGenius, setmaximizeGenius] = useState(false)

  const [step, setStep] = useState(null)
  const popupref = useRef(null);
  const { height, width } = useDimensions()
  const columns = [
    { field: 'code', header: 'Element Name ' },
    { field: 'name', header: 'Keyword' },
    { field: 'quantity', header: 'Test Data' },
    { field: 'price', header: 'Output Data' }
  ];

  const statuses = [
    { label: '@Browser', value: '@Browser' },
    { label: '@BrowserPopup', value: '@BrowserPopup' },
    { label: '@Generic', value: '@Generic' }
  ];
  const KeywordsBrowser = [
    { label: 'navigateToUrl', value: 'navigateToUrl' },
    { label: 'clearCache', value: 'clearCache' },
    { label: 'clearBrowser', value: 'clearBrowser' },
    { label: 'clearSubWindows', value: 'clearSubWindows' },
    { label: 'getBrowserName', value: 'getBrowserName' },
    { label: 'getCurrentUrl', value: 'getCurrentUrl' },
    { label: 'getPageTitle', value: 'getPageTitle' },
    { label: 'maximizeBrowser', value: 'maximizeBrowser' },
    { label: 'navigateBack', value: 'navigateBack' },
    { label: 'navigateWithAuthenticate', value: 'navigateWithAuthenticate' },
    { label: 'openNewTab', value: 'openNewTab' },
    { label: 'refresh', value: 'refresh' },
    { label: 'saveFile', value: 'saveFile' },
    { label: 'sendKeys', value: 'sendKeys' },
    { label: 'switchToWindow', value: 'switchToWindow' },
    { label: 'verifyCurrentURL', value: 'verifyCurrentURL' }
  ]
  const keywordGeneric = [
    { label: 'beautify', value: 'beautify' },
    { label: 'captureScreenshot', value: 'captureScreenshot' },
    { label: 'cellByCellCompare', value: 'navigate' },
  ]

  const dialogFuncMap = {
    'displayBasic2': setDisplayBasic2,
  }

  const dataTableFuncMap = {
    'products1': setProducts1,
    'products2': setProducts2,
    'products3': setProducts3,
    'products4': setProducts4
  };

  const productService = new ProductService();

  useEffect(() => {
    setRawTable([...tableData])
  }, [tableData]); // eslint-disable-line react-hooks/exhaustive-deps



  useEffect(() => {
    if (stop || pause) {
      showPopup(true);
      setMessage('Editing Enabled ')
    }
  }, [stop, pause])
  useEffect(() => {

    setTimeout(() => {
      if (popup)
        popupref.current.style.visibility = "hidden"
      showPopup(false)

    }, 3000)


  }, [popup])
  useEffect(() => {
    if (stop && !start) {
      playRef.current.style.pointerEvents = 'auto'
    }
    else {
      playRef.current.style.pointerEvents = 'none'
    }
  }, [stop, start])

  // useEffect(() => {
  //   let _expandedRows = {};
  //   const index = tableDataNew.length - 1
  //   tableDataNew.forEach((p, idx) => {
  //     if (idx === index)
  //       _expandedRows[`${p.name}`] = true;
  //   })
  //   setExpandedRows(_expandedRows);
  // }, [tableDataNew]);


  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  }
  const hideDialogScreen = () => {
    setSubmitted(false);
    setScreenDialog(false);
  }
  useEffect(() => {
    isMounted.current = true;

  }, [])
  useEffect(() => {
    if (isMounted.current) {
      const summary = expandedRows !== null ? '' : '';

    }
  }, [expandedRows]);

  // const saveProduct = () => {
  //   setSubmitted(true);
  // let savedData=[...rawTable]
  //   // if (product.name.trim()) {
  //   //     let _products = [...products];
  //   //     let _product = {...product};
  //   //     if (product.id) {


  //   //         _products[index] = _product;
  //   //         toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
  //   //     }
  //   //     else {
  //   //         _product.id = createId();
  //   //         _product.image = 'product-placeholder.svg';
  //   //         _products.push(_product);
  //   //         toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
  //   //     }

  //   //     setProducts(_products);
  //   if(!singleData.stepNo){
  //     let data={...singleData}
  //     data.stepNo=rawTable.length+1
  //     savedData.splice(data.stepNo,0,data)
  //     setRawTable(savedData)
  //   }
  //   else{
  //     savedData.splice(singleData.stepNo-1,0,singleData)
  //     console.log(savedData)
  //     setRawTable(savedData)
  //   }
  //        setProductDialog(false);
  //   //     setProduct(emptyProduct);
  //   // }
  //   console.log(singleData)
  //   toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Test Step Added Successfully', life: 3000 });
  // }

  const copyText = () => {

  }
  const pasteData = () => {

    let savedData = [...rawTable]
    let _table = [...tableAfterOperation]
    if (copiedData.stepNo) {
      // let _table = [...rawTable];
      let _tableSingleData = { ...copiedData }
      const objIndex = _table.findIndex(testCase => testCase.name === selectedScreen.name)

      _table[objIndex].testcases.splice(step, 0, _tableSingleData)
      _table[objIndex].testcases.map((element, idx) => {
        element.stepNo = idx + 1;
        return element
      })

      setTableAfterOperation(_table)
      showPopup(true)
      setMessage('Test step pasted successfully')
      // toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Test step pasted successfully', life: 3000 });
      setCopiedData(null)
    }
    else {
      if (!copiedData.stepNo) {
        let data = { ...copiedData }
        data.stepNo = rawTable.length + 1
        savedData.splice(data.stepNo, 0, data)
        setRawTable(savedData)
        setCopiedData(null)
      }
      else {
        savedData.splice(copiedData.stepNo - 1, 0, copiedData)
        console.log(savedData)
        setRawTable(savedData)
        setCopiedData(null)
      }
      console.log(rawTable)
    }
    setProductDialog(false);
    //     setProduct(emptyProduct);
    // }
    console.log(rawTable)

  }

  const saveProduct = () => {
    setSubmitted(true);
    let savedData = [...rawTable]
    let _table = [...tableAfterOperation]
    if (insertAtStep) {
      let data = { ...singleData }
      // console.log(stepNoAbove)

      // savedData.splice(data.stepNo, 0, data)
      const objIndex = _table.findIndex(testCase => testCase.name === selectedScreen.name)

      _table[objIndex].testcases.splice(data.stepNo - 1, 0, data)
      // ((element,idx)=>{
      //   element.stepNo=idx+1
      //   return element
      // })
      _table[objIndex].testcases.forEach((element, idx) => {
        element.stepNo = idx + 1;
        return element
      })
      setTableAfterOperation(_table)
      setProductDialog(false);
    }
    else {
      if (insert) {
        if (insertAbove) {
          let data = { ...singleData }
          // console.log(stepNoAbove)
          data.stepNo = createNewIndex
          // savedData.splice(data.stepNo, 0, data)
          const objIndex = _table.findIndex(testCase => testCase.name === selectedScreen.name)

          _table[objIndex].testcases.splice(createNewIndex, 0, data)
          // ((element,idx)=>{
          //   element.stepNo=idx+1
          //   return element
          // })
          _table[objIndex].testcases.forEach((element, idx) => {
            element.stepNo = idx + 1;
            return element
          })
          console.log(_table)
          // _table[objIndex].testcases=new_table.map((element, idx) => {
          //   element.stepNo = idx + 1;
          //   return element
          // })
          // data.stepNo = selectedScreen.starting_stepNumber+step-2

          // savedData.splice(data.stepNo , 0, data)
          // const newTable = savedData.map((element, idx) => {
          //   element.stepNo = idx + 1;
          //   return element
          // })
          // setRawTable(newTable)
          // console.log('insert above selected ')
          // console.log(selectedRow)
          setTableAfterOperation(_table)
          setProductDialog(false);
        }
        else {
          let data = { ...singleData }

          data.stepNo = createNewIndex

          // savedData.splice(data.stepNo, 0, data)
          // const newTable = savedData.map((element, idx) => {
          //   element.stepNo = idx + 1;
          //   return element
          // })
          // setRawTable(newTable)
          const objIndex = _table.findIndex(testCase => testCase.name === selectedScreen.name)
          _table[objIndex].testcases.splice(createNewIndex - 1, 0, data)
          _table[objIndex].testcases.forEach((element, idx) => {
            element.stepNo = idx + 1;
            return element
          })
          console.log(_table)
          // .map((element, idx) => {
          //     element.stepNo = idx + 1;
          //     return element
          //   })
          // _table[objIndex].testcases=new_table
          console.log(_table[objIndex])
          setTableAfterOperation(_table)
          console.log('insert above selected ')
          console.log(selectedRow)
          setProductDialog(false);
        }
      }
      else {

        if (singleData.stepNo) {

          //logic for new implementation
          console.log(tableAfterOperation)

          // let _table = tableAfterOperation?[...tableAfterOperation]:[...rawTable];
          console.log(_table)
          let _tableSingleData = { ...singleData }
          if (_tableSingleData.stepNo) {
            const objIndex = _table.findIndex(testCase => testCase.name === selectedScreen.name)
            console.log(_table[objIndex])
            console.log('pehle aftertbl')
            console.log(_table)
            const newArr = _table[objIndex].testcases.splice(step - 1, 1, _tableSingleData)
            console.log(newArr)
            console.log('baadme af')
            console.log(_table)
            setTableAfterOperation(_table)
            const target = _table.find(testCase => testCase.name === selectedScreen.name).testcases[step - 1];
            console.log(_tableSingleData)
            console.log(target)
            // Object.assign(target, _tableSingleData);
            console.log(_table)
            //old logic 
            //           const index = findIndexById(selectedScreen.starting_stepNumber+step-1);
            // console.log(index)
            //           _table[index] = _tableSingleData;
            //           setRawTable(_table)
            showPopup(true)
            setMessage('Test step Updated successfully')
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Test Step Updated', life: 3000 });
            //     }
            //     else {
            //         _product.id = createId();
            //         _product.image = 'product-placeholder.svg';
            //         _products.push(_product);
            //         toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
          }
          setProductDialog(false);

        }
        //     setProducts(_products);
        else {

          if (!singleData.stepNo) {
            let data = { ...singleData }
            data.stepNo = createNewIndex
            // savedData.splice(data.stepNo, 0, data)
            const objIndex = _table.findIndex(testCase => testCase.name === selectedScreen.name)
            _table[objIndex].testcases.splice(createNewIndex - 1, 0, data)
            // const newTable = savedData.map((element, idx) => {
            //   element.stepNo = idx + 1;
            //   return element
            // })
            setTableAfterOperation(_table)
            // console.log(newTable)
            // setRawTable(newTable)
          }
          else {
            savedData.splice(singleData.stepNo - 1, 0, singleData)
            console.log(savedData)
            setRawTable(savedData)
          }
        }
        setProductDialog(false);
        //     setProduct(emptyProduct);
        // }
        console.log(singleData)

      }
    }
  }
  const showObjectProp = (e, rowData) => {
    const clickedIcon = e.target.getBoundingClientRect()
    const center = (clickedIcon.left + clickedIcon.right) / 2
    const bottom = clickedIcon.bottom + 10
    setLocation({ center, bottom })
    onClick('displayBasic2', rowData)
  }

  const onClick = (name, popupData) => {
    console.log(popupData)
    dialogFuncMap[`${name}`](true);
    setCard(true)
    const data = []
    data.push(popupData)
    setPopupData(data)

    console.log('hl')
    if (position) {
      setPosition(position);
    }
  }
  const fetchProductData = (productStateKey) => {
    productService.getProductsSmall().then(data => {
      dataTableFuncMap[`${productStateKey}`](data)
    });

  }


  const isPositiveInteger = (val) => {
    let str = String(val);
    str = str.trim();
    if (!str) {
      return false;
    }
    str = str.replace(/^0+/, "") || "0";
    let n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'INSTOCKqwe':
        return 'In Stock';

      case 'LOWSTOCK':
        return 'Low Stock';

      case 'OUTOFSTOCK':
        return 'Out of Stock';

      default:
        return 'NA';
    }
  }

  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;
    console.log(e)
    switch (field) {
      case 'quantity':
      case 'price':
        if (isPositiveInteger(newValue))
          rowData[field] = newValue;
        else
          event.preventDefault();
        break;

      default:
        if (newValue.trim().length !== 0)
          rowData[field] = newValue;
        else
          event.preventDefault();
        break;
    }
  }

  const onRowEditComplete1 = (e) => {
    let _table = [...rawTable];
    let { newData, index } = e;

    _table[index] = newData;

    setRawTable(_table);
  }

  const onRowEditComplete2 = (e) => {
    let _products3 = [...products3];
    let { newData, index } = e;

    _products3[index] = newData;

    setProducts3(_products3);
  }

  const onRowEditChange = (e) => {
    setEditingRows(e.data);
  }

  const setActiveRowIndex = (index) => {
    let _editingRows = { ...editingRows, ...{ [`${products3[index].id}`]: true } };
    setEditingRows(_editingRows);
  }

  const cellEditor = (options) => {
    if (options.field === 'price')
      return priceEditor(options);
    else
      return textEditor(options);
  }

  const textEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  }

  const statusEditor = (options) => {
    return (
      <Dropdown value={options.value} options={statuses} optionLabel="label" optionValue="value"
        onChange={(e) => options.editorCallback(e.value)} placeholder="Select an Object"
      />
    );
  }
  const keywordEditor = (options) => {
    return (
      <Dropdown editable value={options.value} options={KeywordsBrowser} optionLabel="label"
        onChange={(e) => options.editorCallback(e.value)} placeholder="Select a Keyword"
        itemTemplate={(option) => {
          return <span className={`product-badge status-${option.value.toLowerCase()}`}>{option.label}</span>
        }} />
    );
  }

  const priceEditor = (options) => {
    return <InputNumber value={options.value} onValueChange={(e) => options.editorCallback(e.value)} mode="currency" currency="USD" locale="en-US" />
  }

  const statusBodyTemplate = (rowData) => {
    return getStatusLabel(rowData.inventoryStatus);
  }

  const priceBodyTemplate = (rowData) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.price);
  }
  const editProduct = (product) => {
    setKeywordList(getKeywordList(product.custname, projectData.keywordData, "Web", dataobjects)["keywords"])
    setEdit(true)
    console.log(product)
    setSingleData({ ...product })
    setProductDialog(true);
  }
  const editScreen = (product) => {

    console.log(product)
    setSingleData({ ...product })
    setScreenDialog(true);
  }
  const copyData = (data) => {
    console.log(data)
    setCopiedData(data)
    showPopup(true)
    setMessage('Test step copied successfully')
    // toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Test step copied successfully', life: 3000 });
  }

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  }
  const hideDeleteProductDialog = () => {
    if (closeApp) {
      setCloseApp(false)
    }
    else {
      setDeleteProductDialog(false);
    }


  }
  const hideEraseData = () => {
    seteraseData(false)
  }

  const saveScreen = () => {
    console.log(selectedScreen)
    const screenEditTable = [...tableAfterOperation]
    let objIndex = screenEditTable.findIndex(testCase => testCase.name === selectedScreen.name)
    screenEditTable[objIndex].name = singleData.name
    // setScreenNames([...screenNames.map((el) => el === selectedRow.name ? singleData.name : el)])
    setTableAfterOperation(screenEditTable)
    setScreenDialog(false);
  }
  const deleteProduct = () => {

    // let arr=dele?[...tableAfterOperation]:[...tableDataNew]
    let arr = [...tableAfterOperation]
    let objIndex = arr.findIndex(testCase => testCase.name === selectedScreen.name)
    const newArr = arr[objIndex].testcases.filter(element => element.stepNo !== step)
    arr[objIndex].testcases = newArr.map((element, idx) => {
      element.stepNo = idx + 1;
      return element
    })
    const deleteEmptyScreen = arr.filter(screen => screen.testcases.length !== 0)
    setTableAfterOperation(deleteEmptyScreen)
    setDele(true)
    // console.log(arr)
    // console.log(tableDataNew)

    // const tab = rawTable.length === 0 ? tableData : rawTable
    // let _tableData = tab.filter(val => val.stepNo !== product.stepNo+selectedScreen.starting_stepNumber-1);
    // const newTable = _tableData.map((element, idx) => {
    //   element.stepNo = idx + 1;
    //   return element
    // })
    // setRawTable(newTable);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    setFlag(true)
    showPopup(true)
    setMessage('Test step Deleted successfully')
    // toast.current.show({ severity: 'info', summary: 'Successful', detail: 'Test Step Deleted', life: 3000 });
  }


  const menuModel = [
    { label: 'Copy', icon: 'pi pi-fw pi-copy', command: () => copyData(selectedRow) },
    { label: 'Paste', icon: 'pi pi-fw pi-file', command: () => { setCreateNewIndex(step); pasteData() } },
    // {seperator:true},
    { label: 'Edit Test Step', icon: 'pi pi-fw pi-pencil', command: () => { editProduct(selectedRow); setInsert(false); console.log(selectedRow) } },
    { label: 'Delete Test Step', icon: 'pi pi-fw pi-trash', command: () => confirmDeleteProduct(selectedRow) },
    // {seperator:true},
    { label: 'Insert Test Step Above', icon: 'pi pi-fw pi-arrow-up', command: () => { setInsert(true); setInsertAbove(true); setInsertBelow(false); openNew(); setStepAbove(selectedRow.stepNo - 1); setSelectedRow(selectedRow); setCreateNewIndex(step - 1); setInsertAtStep(false) } },
    { label: 'Insert Test Step Below', icon: 'pi pi-fw pi-arrow-down', command: () => { setInsert(true); setInsertAbove(false); setInsertBelow(true); openNew(); setStepBelow(selectedRow.stepNo + 1); setCreateNewIndex(step + 1); setInsertAtStep(false) } },
    { label: 'Insert at Step No.', icon: 'pi pi-fw pi-plus-circle', command: () => { setInsert(false); openNew(); setInsertAtStep(true) } },
    // {seperator:true},
    { label: 'Create Element', icon: 'pi pi-fw pi-plus-circle', command: () => { setInsert(false); openNew(); setInsertAtStep(false) } },


  ];


  const menuModel1 = [
    { label: 'Copy', command: () => copyData(selectedRow) },
    { label: 'Paste', icon: 'pi pi-fw pi-file-import', command: () => pasteData() },
    // {seperator:true},
    { label: 'Edit Test Step', command: () => editProduct(selectedRow) },
    { label: 'Delete Test Step', icon: 'pi pi-fw pi-trash', command: () => confirmDeleteProduct(selectedRow) },
    // {seperator:true},
    { label: 'Insert Test Step Above', disabled: true, command: () => { setInsertAbove(true); setInsertBelow(false); openNew(); console.log(selectedRow.stepNo - 1); setSelectedRow(selectedRow) } },
    { label: 'Insert Test Step Below', command: () => { setInsertAbove(false); setInsertBelow(true); openNew(); setStepBelow(selectedRow.stepNo + 1) } },
    // {seperator:true},
    { label: 'Create Element', command: () => { setInsert(false); openNew() } },

  ];
  const closeGenius = () => {
    window.api.send('close-me')
  }
  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={closeApp ? closeGenius : deleteProduct} />
    </React.Fragment>
  );
  const eraseFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" className="p-button-text" onClick={() => seteraseData(false)} />
      <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={() => {
        setFinalData([]); setTempData([]); seteraseData(false); setTableAfterOperation([]); setRawTable([]); showPopup(true); setMessage('Test Step Erased Successfully.')
      }
      } />
    </React.Fragment>
  );
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span style={((!pause || stop) && (pause || !stop)) ? { fontSize: '14px', opacity: '0.4', cursor: 'not-allowed' } : null} onClick={(event) => { if (stop || pause) menu.current.toggle(event) }} aria-controls="popup_menu" aria-haspopup><i className='pi pi-ellipsis-v' style={{ fontSize: '14px' }} ></i></span>
        {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} /> */}
      </React.Fragment>
    );
  }
  const ActionIconTemplate = (rowData) => {
    const [showFull, setShowFull] = useState(false)
    return (
      <React.Fragment>
        <Tooltip target=".pi-info-circle" />
        <span className="removeEllipsis" style={{}} onMouseEnter={() => { if (rowData.custname.trim().length > 30) setShowFull(true) }} onMouseLeave={() => setShowFull(false)}> {rowData.custname.trim().length > 30 && !showFull ? rowData.custname.trim().substring(0, 20) + "..." : rowData.custname.trim()}</span>
        <span className="info-logo" style={{ cursor: 'pointer', marginTop: '6px', paddingLeft: '1rem', fontSize: '13px' }} onMouseEnter={(e) => { showObjectProp(e, rowData) }} onMouseLeave={() => setCard(false)}> <i className="pi pi-info-circle" style={{ 'fontSize': '1.2em' }} /></span>
      </React.Fragment>
    );
    {/* <span className="info-logo" style={{ cursor: 'pointer', marginTop: '6px', paddingLeft: '1rem', fontSize: '13px' }} onMouseEnter={(e) => { showObjectProp(e, rowData) }} onMouseLeave={() => setCard(false)}> <i className="pi pi-info-circle" style={{ 'fontSize': '1.2em' }} /></span> */ }
  }
  const actionScreen = (rowData) => {
    return (
      <>
        <div style={{ display: "flex", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "90%", color: 'white', backgroundColor: '#5f338f', padding: '6px 15px', borderRadius: '5px', width: 'auto', paddingLeft: 36, position: "absolute", left: "0.7rem" }}>
          <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{rowData.name}</div>
          <div style={{ position: "relative", marginLeft: 20, top: 2 }}>
            <span style={stop ? { marginRight: '0.5rem', cursor: 'pointer' } : { marginRight: '0.5rem', opacity: '0.4', cursor: 'not-allowed' }} onClick={() => { if (stop) { editScreen(selectedRow); setSelectedScreen({ name: selectedRow.name }) } }} aria-controls="popup_menu" aria-haspopup><i className='pi pi-file-edit' style={{ fontSize: '17px' }} ></i></span>
          </div>
        </div>

      </>
    )
  }
  const ActionTestData = (rowData) => {
    const [showFull, setShowFull] = useState(false)
    let isPassField = rowData.custname && rowData.custname.endsWith("_pwdbox");
    return (
      <React.Fragment>
        <Tooltip target=".pi-info-circle" />
        <span className="removeEllipsis__actionData" style={{}} onMouseEnter={() => { if (rowData.inputVal[0].trim().length > 30) setShowFull(true) }} onMouseLeave={() => setShowFull(false)}>
          {Array.isArray(rowData.inputVal) ?
            (
              (rowData.inputVal[0].trim().length > 30 && !showFull) ?
                (isPassField ? "*".repeat(rowData.inputVal[0].trim().length).substring(0, 20) + "..." : rowData.inputVal[0].trim().substring(0, 20) + "...")
                : (isPassField ? "*".repeat(rowData.inputVal[0].trim().length) : rowData.inputVal[0].trim())
            )
            : isPassField ? "*".repeat(rowData.inputVal.trim().length) : rowData.inputVal.trim()}</span>
        {/* <span className="info-logo" style={{cursor:'pointer',marginTop:'6px',paddingLeft:'1rem',fontSize:'13px'}}   onMouseEnter={(e) => {showObjectProp(e,rowData)}}  onMouseLeave={()=>setCard(false)}> <i className="pi pi-info-circle"  style={{'fontSize': '1.2em'}}  /></span> */}
      </React.Fragment>
    );
  }
  const productDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
    </React.Fragment>
  );
  const screenDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialogScreen} />
      <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveScreen} />
    </React.Fragment>
  );
  const onHide = (name) => {
    dialogFuncMap[`${name}`](false);
  }
  const openNew = () => {
    const arr = [...tableAfterOperation]
    let objIndex = arr.findIndex(testCase => testCase.name === selectedScreen.name)
    const Index = arr[objIndex].testcases.length + 1;
    setCreateNewIndex(Index)
    setEdit(false)
    setSingleData(emptyStepData);
    setSubmitted(false);
    setProductDialog(true);
  }

  const maximizeGenius = () => {
    setmaximizeGenius(!maxGenius)
    toggleFullScreen();
  }
  // const segrTableData=()=>{
  //  const segTab=[...rawTable]
  //  const newSegTable=segTab.map((element,idx)=>{
  //   element.screen=`screen_${idx+1}`
  //   return element
  //  })
  //  console.log(newSegTable)
  //  setSegrTable(newSegTable)
  // }
  const findIndexById = (id) => {
    console.log(id)
    let index = -1;
    for (let i = 0; i < rawTable.length; i++) {
      console.log(rawTable[i].stepNo)
      if (rawTable[i].stepNo === id) {
        index = i;
        break;
      }

    }
    console.log(`hi ${index}`)
    return index;
  }

  const createId = () => {
    let id = '';
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
  const renderFooter = (name) => {
    return (
      <div>
        {/* <Button label="No" icon="pi pi-times" onClick={() => onHide(name)} className="p-button-text" />
          <Button label="Yes" icon="pi pi-check" onClick={() => onHide(name)} autoFocus /> */}
      </div>
    );
  }
  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button label="Add New Step" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />

      </React.Fragment>
    )
  }
  const addstep = () => {
    let data = [...rawTable]
    const val = Math.floor(Math.random() * data.length)

    const emptyStepData = {
      "stepNo": `${val}`,
      "objectName": ' ',
      "custname": '',
      "keywordVal": ' keyVal',
      "inputVal": '',
      "outputVal": '',
      "remarks": "",
      "url": ' ',
      "appType": '',
      "addDetails": "",
      "cord": ''
    }
    data.splice(val, 0, emptyStepData)
    setRawTable(data)
  }
  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _tableSingleData = { ...singleData };
    if (typeof _tableSingleData[`${name}`] === "object") {
      _tableSingleData[`${name}`] = [val];
    } else {
      _tableSingleData[`${name}`] = val;
    }
    setSingleData(_tableSingleData);
  }
  const onScreenNameChange = (e, name) => {
    const val = e.target.value;
    let _tableSingleData = { ...singleData };
    _tableSingleData[`${name}`] = val;
    setSingleData(_tableSingleData);
  }
  const onCustChange = (e, name) => {
    const val = e.value;
    if (editableCondition) {
      setKeywordList(getKeywordList(val, projectData.keywordData, "Web", dataobjects)["keywords"])
      setSingleData({ ...singleData, [name]: val })
    }
    // let _tableSingleData = { ...singleData };
    // _tableSingleData[`${name}`] = val;
    // setSingleData(_tableSingleData);
  }
  const onKeywordChange = (e, name) => {
    const val = e.value || 'navigateToUrl';
    let _tableSingleData = { ...singleData };
    _tableSingleData[`${name}`] = val;
    setSingleData(_tableSingleData);
  }
  const returnKeyword = () => {
    let options;
    if (singleData.custname === '@Browser') {
      options = KeywordsBrowser
    }
    if (singleData.custname === '@Generic') {
      options = keywordGeneric
    }

    return options
  }

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _tableSingleData = { ...singleData };
    _tableSingleData[`${name}`] = val;

    setSingleData(_tableSingleData);
  }
  const onRowReorder = (e) => {
    const draggedVale = e.value;
    // let index = 0;
    const _table = [...tableAfterOperation]
    // setRawTable((prevState) => {
    //   const newTable = [...prevState];
    //   for (let i = selectedScreen.starting_stepNumber - 1; i < selectedScreen.starting_stepNumber - 1 + e.value.length; i++) {
    //     newTable[i] = e.value[index];
    //     index += 1;
    //   }
    //   return newTable;
    // })
    const objIndex = _table.findIndex(element => element.name === selectedScreen.name)
    _table[objIndex].testcases = e.value.map((element, idx) => {
      element.stepNo = idx + 1
      return element
    })

    console.log(_table)
    setTableAfterOperation(_table)
    console.log(e.value)
  }
  const onRowSelect = (event) => {
    alert(event.data.custname)
  }

  const expandAll = () => {
    let _expandedRows = {};
    tableDataNew.forEach(p => _expandedRows[`${p.name}`] = true);

    setExpandedRows(_expandedRows);
  }

  let tableDataNew = useMemo(() => {
    let expandable_data = [];
    let index_of_screen = 0;
    let screen_obj = {};
    let stepNumber = 1;
    let totalStepNumbers = 1;
    let tempIndex = 0
    for (let idx = 0; idx < rawTable.length; idx++) {
      if (JSON.stringify(screen_obj) === "{}") {
        screen_obj["name"] = screenNames[index_of_screen];
        screen_obj["testcases"] = [];
        screen_obj["data_objects"] = [];
        screen_obj["screenshot"] = dataobjects[tempIndex] && dataobjects[tempIndex]["screenshot"] ? dataobjects[tempIndex]["screenshot"] : ""
        screen_obj["scrapedurl"] = dataobjects[tempIndex] && dataobjects[tempIndex]["url"] ? dataobjects[tempIndex]["url"] : ""
        screen_obj["starting_stepNumber"] = totalStepNumbers;
        stepNumber = 1;
      }
      if (rawTable[idx]["tempOrderId"]) {
        screen_obj["data_objects"].push(dataobjects[tempIndex]);
      }
      screen_obj["testcases"].push({ ...rawTable[idx], stepNo: stepNumber++ })
      totalStepNumbers += 1;
      if (rawTable[idx + 1] && rawTable[idx + 1]["keywordVal"] === "navigateToURL" && dataobjects[tempIndex + 1] && dataobjects[tempIndex + 1]["tag"] === "browser_navigate" && idx > 0) {
        expandable_data.push(screen_obj);
        screen_obj = {};
        index_of_screen += 1;
      }
      if (rawTable[idx]["tempOrderId"]) {
        tempIndex += 1;
      }
    }
    if (JSON.stringify(screen_obj) !== "{}") {
      expandable_data.push(screen_obj);
      setExpandedRows({ [screen_obj.name]: true })
    };
    return expandable_data;
  }, [screenNames, rawTable]);
  const footer = ` Test Steps count : ${rawTable.length > 0 ? rawTable.length : 0}`;
  const rowexpansion = (data) => {
    return (
      <div className="card p-fluid" style={{ width: '100%' }}>
        {/* <ScrollPanel style={{ width: '100%', height: '60vh' }} className="custombar1"> */}
        <DataTable value={data.testcases ? data.testcases : []} scrollable scrollHeight='72vh' editMode="row" dataKey="stepNo" onRowEditComplete={onRowEditComplete1} responsiveLayout="scroll" size='small'
          contextMenuSelection={selectedRow}
          onContextMenuSelectionChange={e => {
            setSelectedRow(e.value);
            setSingleData(e.value)
            setSelectedScreen({ name: data.name, starting_stepNumber: data.starting_stepNumber })
            setStep(e.value.stepNo)
          }}
          onContextMenu={e => { if (stop || pause) cm.current.show(e.originalEvent) }}
          reorderableRows onRowReorder={onRowReorder}
          selectionMode="single"
          selection={selectedRow}
          onMouseDown={() => {
            setSelectedScreen({ name: data.name, starting_stepNumber: data.starting_stepNumber })
          }}
          onSelectionChange={e => {
            setSelectedRow(e.value);
            setSingleData(e.value);
            setStep(e.value.stepNo)
            setSelectedScreen({ name: data.name, starting_stepNumber: data.starting_stepNumber })
            console.log(tableDataNew)
            console.log(rawTable)
            // setSelectedScreen({ name: data.name, starting_stepNumber: data.starting_stepNumber })
          }}
          footer={` Test Steps count : ${data.testcases.length > 0 ? data.testcases.length : 0}`} style={{ textAlign: 'center' }}
        >

          <Column rowReorder headerStyle={{ justifyContent: "center", backgroundColor: ' #74737f', color: '#fff', width: '10%', minWidth: '4rem', flexGrow: '0.2', borderTopLeftRadius: '8px' }} style={{ flexGrow: '0.2', paddingLeft: '0.8rem', paddingRight: '0.8rem' }} />
          {/* <Column headerStyle={{ backgroundColor: ' #74737f', color: '#fff', width: '10%', minWidth: '4rem',flexGrow:'0.2'}}  editor={(options) => textEditor(options)} header="Step" bodyStyle={{ textAlign: 'center' ,flexGrow:'0.2'}} field="stepNo"  style={{ width: '20%',overflowWrap: 'anywhere',paddingLeft:'0.8rem',paddingRight:'0.8rem' }} onCellEditComplete={onCellEditComplete}></Column> */}
          <Column headerStyle={{ justifyContent: "center", backgroundColor: ' #74737f', color: '#fff', width: '10%', minWidth: '4rem', flexGrow: '0.2' }} header="Step" bodyStyle={{ textAlign: 'center', flexGrow: '0.2' }} field="stepNo" style={{ minWidth: '4rem', width: '20%', overflowWrap: 'anywhere', paddingLeft: '0.8rem', paddingRight: '0.8rem' }} ></Column>
          {/* <Column  headerStyle={{ backgroundColor: ' #74737f', color: '#fff'}} header="Object Property" body={actionIconTemplate}  exportable={false} style={{ minWidth: '8rem' }}></Column> */}
          <Column headerStyle={{ justifyContent: "center", backgroundColor: ' #74737f', color: '#fff' }} body={ActionIconTemplate} header="Element Name" editor={(options) => statusEditor(options)} style={{ width: '20%', overflowWrap: 'anywhere', justifyContent: 'space-between' }} onCellEditComplete={onCellEditComplete}></Column>
          <Column headerStyle={{ justifyContent: "center", backgroundColor: ' #74737f', color: '#fff', width: '100px' }} field="keywordVal" header="Keyword" editor={(options) => keywordEditor(options)} style={{ width: '40%', overflowWrap: 'anywhere', justifyContent: 'flex-start' }} onCellEditComplete={onCellEditComplete}></Column>
          <Column headerStyle={{ justifyContent: "center", backgroundColor: ' #74737f', color: '#fff' }} body={ActionTestData} field="inputVal" header="Test Data" editor={(options) => textEditor(options)} style={{ width: '-40%', overflowWrap: 'anywhere' }} onCellEditComplete={onCellEditComplete}></Column>
          {/* <Column headerStyle={{ backgroundColor: ' #74737f', color: '#fff' }} field="outputVal" header="Output Data" editor={(options) => textEditor(options)} style={{ width: '20%', overflowWrap: 'anywhere' }}></Column> */}
          {/* <Column rowEditor headerStyle={{ width: '10%', minWidth: '4rem', backgroundColor: ' #74737f', backgroundColor: ' #74737f',flexGrow:'0.2' }} bodyStyle={{ textAlign: 'center' ,flexGrow:'0.2'}}></Column> */}
          <Column headerStyle={{ justifyContent: "center", width: '10%', minWidth: '4rem', backgroundColor: ' #74737f', backgroundColor: ' #74737f', flexGrow: '0.2', borderTopRightRadius: '8px' }} body={actionBodyTemplate} bodyStyle={{ textAlign: 'center', flexGrow: '0.2', minWidth: '4rem' }} exportable={false} style={{ minWidth: '8rem' }}></Column>

        </DataTable>
        {/* </ScrollPanel> */}


        {/* POC  */}
      </div>
    )
  }

  // functions to handle row epnsion
  const onRowExpand = (event) => {
    // toast.current.show({severity: 'info', summary: 'Product Expanded', detail: event.data.name, life: 3000});
  }

  const onRowCollapse = (event) => {
    // toast.current.show({severity: 'success', summary: 'Product Collapsed', detail: event.data.name, life: 3000});
  }

  let editableCondition = !edit || ["@Generic", "@Browser", "@System", "@BrowserPopUp", "@Window", "@Oebs", "@Custom", "@Object", "@Email", "@Mobile", "@Action", "@Android_Custom", "@CustomiOS", "@MobileiOS", "@Sap", "@Excel", "@Word", "Mainframe List", "WebService List"].includes(singleData.custname)

  return (
    <>
      {/* <BlockUI autoZIndex={false} blocked={blockedDocument} fullScreen /> */}
      <Menu model={menuModel} popup ref={menu} id="popup_menu" />
      <Tooltip target=".bottombartooltips" />
      <ContextMenu model={menuModel} ref={cm} onHide={() => setSelectedRow(null)} />
      <div className="datatable-editing-demo">
        <Toast ref={toast} position="bottom-center" />
        {/* <div className="card p-fluid">
          
          <DataTable value={stop ? rawTable : null} scrollable scrollHeight='72vh' editMode="row" dataKey="stepNo" onRowEditComplete={onRowEditComplete1} responsiveLayout="scroll" size='small'
            contextMenuSelection={selectedRow}
            onContextMenuSelectionChange={e => setSelectedRow(e.value)}
            onContextMenu={e => cm.current.show(e.originalEvent)}
            reorderableRows onRowReorder={onRowReorder}
            selectionMode="single"
            selection={selectedRow}
            onSelectionChange={e => {setSelectedRow(e.value);console.log(e.value)}}
           
            footer={footer}
          >
             
            <Column rowReorder headerStyle={{ backgroundColor: ' #74737f', color: '#fff', borderTopLeftRadius: '8px', width: '10%', minWidth: '4rem', flexGrow: '0.2' }} style={{ flexGrow: '0.2', paddingLeft: '0.8rem', paddingRight: '0.8rem' }} />
            
            <Column headerStyle={{ backgroundColor: ' #74737f', color: '#fff', width: '10%', minWidth: '4rem',flexGrow:'0.2'}}   header="Step" bodyStyle={{ textAlign: 'center' ,flexGrow:'0.2'}} field="stepNo"  style={{ minWidth:'4rem',width: '20%',overflowWrap: 'anywhere',paddingLeft:'0.8rem',paddingRight:'0.8rem' }} ></Column>
            
            <Column headerStyle={{ backgroundColor: ' #74737f', color: '#fff' }} body={actionIconTemplate} header="Element Name" editor={(options) => statusEditor(options)} style={{ width: '20%', overflowWrap: 'anywhere', justifyContent: 'space-between' }} onCellEditComplete={onCellEditComplete}></Column>
            <Column headerStyle={{ backgroundColor: ' #74737f', color: '#fff', width: '100px' }} field="keywordVal" header="Keyword" editor={(options) => keywordEditor(options)} style={{ width: '40%', overflowWrap: 'anywhere', justifyContent: 'flex-start' }} onCellEditComplete={onCellEditComplete}></Column>
            <Column headerStyle={{ backgroundColor: ' #74737f', color: '#fff' }} body={actionTestData} field="inputVal" header="Test Data" editor={(options) => textEditor(options)} style={{ width: '-40%', overflowWrap: 'anywhere' }} onCellEditComplete={onCellEditComplete}></Column>
           


            
            <Column headerStyle={{ width: '10%', minWidth: '4rem', backgroundColor: ' #74737f', backgroundColor: ' #74737f', flexGrow: '0.2', borderTopRightRadius: '8px' }} body={actionBodyTemplate} bodyStyle={{ textAlign: 'center', flexGrow: '0.2', minWidth: '4rem' }} exportable={false} style={{ minWidth: '8rem' }}></Column>

          </DataTable>



         
        </div> */}
        {/* Parent Data Table */}
        <div className="datatable-rowexpansion-demo">
          <Toast ref={toast} />

          <div className="card">
            <DataTable value={(stop || pause) ? tableAfterOperation : tableDataNew}
              scrollable scrollHeight='72vh'
              responsiveLayout="scroll"
              dataKey="name" expandedRows={expandedRows} onRowToggle={(e) => { debugger; setExpandedRows(e.data); }}
              onRowExpand={onRowExpand} onRowCollapse={onRowCollapse}
              rowExpansionTemplate={rowexpansion}
              id="parentTable"
              size='small'
              selectionMode="single"
              selection={selectedRow}
              onSelectionChange={e => { setSelectedRow(e.value); setSingleData(e.value); setSelectedScreen({ name: e.value.name }) }}
              footer={` Number of Screens : ${tableDataNew.length > 0 ? tableDataNew.length : 0}`} style={{ textAlign: 'center' }}
            >

              <Column expander headerStyle={{ justifyContent: "center", backgroundColor: ' #74737f', color: '#fff', width: '10%', minWidth: '4rem', flexGrow: '0.2', borderTopLeftRadius: '8px' }} style={{ flexGrow: '0.2', paddingLeft: '0.8rem', paddingRight: '0.8rem', justifyContent: "flex-start" }} />
              {/* <Column  headerStyle={{ backgroundColor: ' #74737f', color: '#fff', borderTopLeftRadius: '8px', width: '10%', minWidth: '4rem', flexGrow: '0.2' }} style={{ flexGrow: '0.2', paddingLeft: '0.8rem', paddingRight: '0.8rem' }} /> */}
              {/* <Column headerStyle={{ backgroundColor: ' #74737f', color: '#fff', width: '10%', minWidth: '4rem',flexGrow:'0.2'}}  editor={(options) => textEditor(options)} header="Step" bodyStyle={{ textAlign: 'center' ,flexGrow:'0.2'}} field="stepNo"  style={{ width: '20%',overflowWrap: 'anywhere',paddingLeft:'0.8rem',paddingRight:'0.8rem' }} onCellEditComplete={onCellEditComplete}></Column> */}
              <Column body={actionScreen} headerStyle={{ justifyContent: "center", backgroundColor: ' #74737f', color: '#fff', width: '40%', minWidth: '4rem', flexGrow: '0.2' }} header="Step" bodyStyle={{ textAlign: 'center' }} style={{ minWidth: '4rem', width: '20%', overflowWrap: 'anywhere', paddingLeft: '0.8rem', paddingRight: '0.8rem', justifyContent: 'flex-start' }} ></Column>
              {/* <Column  headerStyle={{ backgroundColor: ' #74737f', color: '#fff'}} header="Object Property" body={actionIconTemplate}  exportable={false} style={{ minWidth: '8rem' }}></Column> */}
              <Column headerStyle={{ justifyContent: "center", backgroundColor: ' #74737f', color: '#fff' }} header="Element Name" style={{ width: '20%', overflowWrap: 'anywhere', justifyContent: 'space-between' }} ></Column>
              <Column headerStyle={{ justifyContent: "center", backgroundColor: ' #74737f', color: '#fff', width: '100px' }} header="Keyword" style={{ width: '40%', overflowWrap: 'anywhere', justifyContent: 'flex-start' }} ></Column>
              <Column headerStyle={{ justifyContent: "center", backgroundColor: ' #74737f', color: '#fff' }} header="Test Data" style={{ justifyContent: 'flex-start', width: '-40%', overflowWrap: 'anywhere' }} ></Column>
              {/* <Column headerStyle={{ backgroundColor: ' #74737f', color: '#fff' }} field="outputVal" header="Output Data" editor={(options) => textEditor(options)} style={{ width: '20%', overflowWrap: 'anywhere' }}></Column> */}


              {/* <Column rowEditor headerStyle={{ width: '10%', minWidth: '4rem', backgroundColor: ' #74737f', backgroundColor: ' #74737f',flexGrow:'0.2' }} bodyStyle={{ textAlign: 'center' ,flexGrow:'0.2'}}></Column> */}
              <Column headerStyle={{ width: '10%', minWidth: '4rem', backgroundColor: ' #74737f', backgroundColor: ' #74737f', flexGrow: '0.2', borderTopRightRadius: '8px' }} bodyStyle={{ textAlign: 'center', flexGrow: '0.2', minWidth: '4rem' }} exportable={false} style={{ minWidth: '8rem' }}></Column>

            </DataTable>
          </div>
        </div>
        <Dialog visible={deleteProductDialog || closeApp} style={{ width: '50vw' }} header="Confirm"

          modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
          <div className="confirmation-content">
            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
            {product && <span>{closeApp ? 'Are you sure you want to close Genius?' : 'Are you sure you want to delete the selected step?'}</span>}
          </div>
        </Dialog>


        {/* <Dialog header="Object Properties" visible={displayBasic2} ref={popupRef} style={{ width: '428px',height:'50vh',position:'absolute',left:`2rem`,top:`${location.bottom}px` }} footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
            <Divider />
                   <h3>Object Name:</h3>
                   <p>{popupData?.custname}</p>
                  
                   <h3>XPath:</h3>
                   <p style={{overflowWrap:'anywhere'}}>{popupData?.objectName}</p>
                    <br />
                   
                </Dialog> */}
        {card && <div className="card-property" ref={popupRef} style={{
          zIndex: '10', backgroundColor: '#fff', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', width: '480px', position: 'absolute', left: `2rem`, top: `${location.bottom - 10}px`, border: 'gray'

        }} onMouseEnter={() => setCard(true)} onMouseLeave={() => setCard(false)}>
          <div className="row2">
            <div className="column2" style={{ backgroundColor: 'gray', height: '33px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }} >
              <h3 style={{ color: '#fff', fontSize: '20px', marginTop: '5px', fontWeight: '400', marginLeft: '-79px' }}>Attribute</h3>
              <h3 style={{ color: '#fff', fontSize: '20px', marginTop: '5px', fontWeight: '400', marginRight: '93px' }}>Value</h3>

            </div>
            <Divider style={{ margin: '0' }} />
            <div className="column2" >
              <p style={{ marginLeft: '-26px' }}>Tag</p>
              <Divider layout="vertical" style={{ position: 'inherit' }} />
              <p style={{ overflowWrap: 'anywhere', width: '42%', marginLeft: '10px' }}>{popupData[0].custname}</p>
            </div>
            <Divider style={{ margin: '0' }} />
            <div className="column2" >
              <p style={{ marginLeft: '-25px' }}>Id</p>
              <Divider layout="vertical" style={{ position: 'inherit' }} />
              <p style={{ overflowWrap: 'anywhere', width: '42%' }}>{popupData[0].keywordVal}</p>
            </div>
            <Divider style={{ margin: '0' }} />
            <div className="column2" >
              <p style={{ marginLeft: '-26px' }}>X-path</p>
              <Divider layout="vertical" style={{ position: 'inherit' }} />
              <p style={{ overflowWrap: 'anywhere', width: '42%', height: 'auto' }} ref={textRef} onClick={copyText} onMouseEnter={() => setShowFullXpath(true)} onMouseLeave={() => setShowFullXpath(false)}>{popupData[0].objectName.trim().length !== 0 ? (popupData[0].objectName.trim().length > 10 && !showFullXpath ? popupData[0].objectName.trim().substring(0, 20) + "..." : popupData[0].objectName.trim()) : 'Not Found'}</p>
            </div>
            <Divider style={{ margin: '0' }} />
          </div>
          {/* <DataTable value={popupData}   style={{margin:'2px'}}showGridlines responsiveLayout="scroll">
                    <Column field="custname" header="Object Name"></Column>
                    <Column field="objectName" header="Xpath" style={{overflowWrap: 'anywhere' }}></Column>
                    </DataTable> */}
        </div>
        }
        <Dialog visible={productDialog} style={{ width: '450px' }} header={edit ? "Edit Test Step" : "Add New Test Step"} modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
          <div className="field">
            <label htmlFor="stepNo">Step No.</label>
            <InputNumber disabled={insertAtStep ? false : true} id="stepNo" value={edit ? singleData.stepNo : insert ? (insertAbove ? stepNoAbove : stepNoBelow) : insertAtStep ? '' : createNewIndex} onValueChange={(e) => onInputNumberChange(e, 'stepNo')} integeronly />
            {submitted && !singleData.custname && <small className="p-error">Object Name is required.</small>}
          </div>
          <div className="field">
            <label htmlFor="custname">Object Name</label>
            <Dropdown editable={editableCondition ? false : true} onBlurCapture={(e) => {
              if (!editableCondition) {
                setSingleData({
                  ...singleData, 'custname': (e.target.value ? (e.target.value.includes("_" + singleData.custname.split("_")[1]) ? e.target.value : e.target.value + "_" + singleData.custname.split("_")[1]) : singleData.custname)
                })
                return
              }
            }} value={singleData.custname} options={
              // statuses
              productDialog ? getObjNameList("Web", tableAfterOperation ? tableAfterOperation.filter(obj => obj.name === selectedScreen.name)?.[0]?.["data_objects"] : tableDataNew.filter(obj => obj.name === selectedScreen.name)?.[0]?.["data_objects"]) : []
            } onChange={(e) => onCustChange(e, 'custname')} placeholder="Select an Object" />

            {/* <InputText id="custname" value={product.custname} onChange={(e) => onInputChange(e, 'custname')} required autoFocus className={classNames({ 'p-invalid': submitted && !singleData.custname })} />
                    {submitted && !singleData.custname && <small className="p-error">Object Name is required.</small>} */}
          </div>
          <div className="field">
            <label htmlFor="keywordVal">Keyword</label>
            <Dropdown value={singleData.keywordVal} options={keywordList} onChange={(e) => onKeywordChange(e, 'keywordVal')} placeholder="Select a keyword" />
            {/* <InputText id="keywordVal" value={product.keywordVal} options={returnKeyword} onChange={(e) => onInputChange(e, 'keywordVal')} required autoFocus className={classNames({ 'p-invalid': submitted && !singleData.custname })} /> */}
            {/* {submitted && !singleData.keywordVal && <small className="p-error">Keyword is required.</small>} */}
          </div>

          <div className="field">
            <label htmlFor="inputVal">Captured Data</label>
            <InputText id="inputVal" value={singleData.inputVal} onChange={(e) => {onInputChange(e, 'inputVal');}} required autoFocus className={classNames({ 'p-invalid': submitted && !singleData.custname })} />
            {submitted && !singleData.inputVal && <small className="p-error">Keyword is required.</small>}
          </div>


        </Dialog>
        <Dialog visible={screenDialog} style={{ width: '450px' }} header={"Edit Screen"} modal className="p-fluid" footer={screenDialogFooter} onHide={hideDialogScreen}>
          <div className="field">
            <label htmlFor="Screen">Screen</label>
            <InputText value={singleData.name} onChange={(e) => onScreenNameChange(e, 'name')} />
            {/* {submitted && !singleData.custname && <small className="p-error">Object Name is required.</small>} */}
          </div>
        </Dialog>
      </div>

      {/* Footer options  */}
      <div class="icon-bar">
        {/* <Button label="Save" icon="pi pi-times" className="p-button-text" onClick={() => {
          port.postMessage({ data: { "module": projectData.module, "project": projectData.project, "scenario": projectData.scenario, "appType": projectData.appType, "screens": tableDataNew } })
        }} /> */}

        <div>
          <span className="bottombartooltips" data-pr-tooltip={expand ? "Collapse All" : "Expand All "} data-pr-position="top" onClick={expand ? () => { setExpandedRows(null); setExpand(false) } : () => { expandAll(); setExpand(true) }} style={{ marginRight: '1rem' }}>{expand ? <i className='pi pi-chevron-circle-right' style={{ fontSize: '18px' }} ></i> : <i className='pi pi-chevron-circle-down' style={{ fontSize: '18px' }} ></i>}</span>
          {/* <span className= "bottombartooltips" data-pr-tooltip="Collapse All " data-pr-position="top"onClick={() => setExpandedRows(null)}>p<i className='pi pi-chevron-circle-right' style={{ fontSize: '18px' }} ></i></span> */}
        </div> {/** undo the last step */}
        <div className="bottombartooltips" data-pr-tooltip="Erase all data " data-pr-position="top" onClick={() => seteraseData(true)}> {/** erase all data */}
          <span><FaEraser size={30} /></span>
          <span>All</span>
        </div>
        <div className="bottombartooltips" data-pr-tooltip="Run test steps " ref={playRef} data-pr-position="top" style={(saved && tableAfterOperation.length !== 0) ? { border: 'none' } : { border: 'none', opacity: '0.5', pointerEvents: 'none' }} onClick={() => {
          if (tableAfterOperation.length !== 0) {
            port.postMessage({ "action": "startDebugging", "data": { "screens": tableAfterOperation } });
            showPopup(true); setMessage('Started running test steps'); popupref.current.style.visibility = "visible"
          }
        }}><img src={vector} /></div>  {/** execute the steps */}
        <div className="bottombartooltips" data-pr-tooltip="Show Mindmap " data-pr-position="top"><img src={mindmap} onClick={() => {
          if (saved) {
            port.postMessage("getMindmap");
            window.chrome.windows.update(projectData.geniusWindowId, { state: "minimized" }, function (windowUpdated) {
              //do whatever with the maximized window
            });
            return
          }
          setBlockedDocument(true);
          port.postMessage({ data: { "module": projectData.module, "project": projectData.project, "scenario": projectData.scenario, "appType": projectData.appType, "screens": tableAfterOperation } })
        }} /></div> {/** view the mindmap */}
        <div ><img src={view} /></div>
        <div className="bottombartooltips" data-pr-tooltip={!maxGenius ? "Maximize " : "Minimize"} data-pr-position="top" style={{ border: 'none' }} onClick={maximizeGenius}><CgMaximize size={30} /></div> {/** maximize genius window */}
        <div className="bottombartooltips" data-pr-tooltip="Close Genius App " data-pr-position="top" style={{ border: 'none' }} onClick={() => { if (tableData.length > 0) { setCloseGeniusWindow(true); } else { window.chrome.runtime.sendMessage({ action: 'CLOSE' }); } }}><GrClose size={25} /></div>{/** close genius window */}
      </div>
      <Dialog visible={eraseData} style={{ width: '50vw', zIndex: '1500' }} header="Confirm"
        modal footer={eraseFooter} onHide={hideEraseData}>
        <div className="confirmation-content">
          <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
          {<span>Are you sure you want Erase complete data ?</span>}
        </div>
      </Dialog>

      {popup && <div id="popover" ref={popupref}>
        <div style={{ marginTop: '2px' }}> <AiOutlineCheckCircle size={17} /></div>
        <div>{message}</div>
        <div style={{ marginTop: '2px', cursor: 'pointer' }} ><AiOutlineClose size={17} /></div>
      </div>
      }
    </>
  );
}
export default DataTableEditDemo;
