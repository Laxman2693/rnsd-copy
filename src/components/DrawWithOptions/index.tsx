import React, { useCallback, useEffect, useState } from 'react';
import {
  Pressable,
  View,
  StyleSheet,
  ViewProps,
  ImageRequireSource,
  ImageURISource,
  Keyboard,
  Dimensions,
  Modal,
  Alert,
  Text
} from 'react-native';
import DoubleHeadSvg from './DoubleHeadSvg';
import CircleSvg from './CircleSvg';
import SquareSvg from './SquareSvg';
import ArrowSvg from './ArrowSvg';
import TextSvg from './TextSvg';
import CloseSvg from './CloseSvg';
import PenSvg from './PenSvg';
import useDrawHook from '../DrawCore/useDrawHook';
import Sliders from '../Slider/Sliders';
import DrawCore from '../DrawCore';
import ThrashSvg from './ThrashSvg';
import CancelSvg from './CancelSvg';
import SendSvg from './SendSvg';
import DrawProvider from '../DrawCore/DrawProvider';
import {Button, Divider, IconButton, List, Menu, PaperProvider} from "react-native-paper";
const {width, height} = Dimensions.get('window')

const styles = StyleSheet.create({
  container: { width:"100%", height:"100%"},
  actionButton: {
    backgroundColor: 'grey',
    padding: 10,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    height: 40,
    borderRadius: 20,
    width: 40,
  },
  option: {
    width: 40,
    padding:10,
    fontColor:"red",
    height: 20,
    // borderRadius:100,
    // backgroundColor:"rgb(115 74 153)",
    // borderColor:"rgb(115 74 153)",
    // borderWidth:1,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap:"wrap",
    marginHorizontal: 8,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 40,
    height: 42,
    paddingTop: -5,
    paddingHorizontal: 15,
  },
  drawOptions: {
    flex: 1,
    paddingHorizontal: 10,
  },
  sendButton: {
    backgroundColor: '#3a6cff',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  bottomToolBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 30,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
});
const gradientColors = [
  '#000000', '#343a40', '#495057', '#c92a2a', '#a61e4d', '#862e9c', 
      '#5f3dc4', '#364fc7', '#1864ab', '#0b7285', '#087f5b', '#2b8a3e', '#5c940d', 
      '#e67700', '#d9480f'
];
type DrawWithOptionsProps = {
  linearGradient: React.ComponentType<{ colors: any[] } & ViewProps>;
  image?: ImageRequireSource | ImageURISource;
  close?: () => void;
  takeSnapshot?: (snap: Promise<string | undefined>) => void;
  backgroundColor?: string;
};

function DrawWithOptionsCore({
  linearGradient,
  image,
  close,
  takeSnapshot,
  backgroundColor,
}: DrawWithOptionsProps) {
  const {
    itemIsSelected,
    cancelLastAction,
    takeSnapshot: takeSnapshotAction,
    deleteSelectedItem,
    dispatchDrawStates,
    color,
    drawState,
  } = useDrawHook();

  const [showToolbar, setShowToolbar] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [colorVisible, setColorVisible] = useState(false);
  const [colorSelected, setColorSelected] = useState('#000000');
  
  const closeMenu = () => setVisible(false);
  const openMenu = () => setVisible(true);
  useEffect(() => {
    const sudDidHide = Keyboard.addListener('keyboardDidHide', () => {
      setShowToolbar(true);
    });

    const sudDidShow = Keyboard.addListener(
      'keyboardDidShow',
      (event: { endCoordinates: { height: number } }) => {
        // avoid events triggered by InputAccessoryView
        if (event.endCoordinates.height > 100) {
          setShowToolbar(false);
        }
      }
    );

    // cleanup function
    return () => {
      sudDidShow.remove();
      sudDidHide.remove();
    };
  }, []);

  const takeSnapshotAndGetUri = useCallback(async () => {
    if (takeSnapshot) {
      takeSnapshot(takeSnapshotAction());
    }
  }, [takeSnapshot, takeSnapshotAction]);

  function hexToHSL(hexColor) {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
  
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
  
    let h, s, l;
    if (max === min) {
      h = 0;
    } else if (max === r) {
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    } else if (max === g) {
      h = ((b - r) / d + 2) / 6;
    } else {
      h = ((r - g) / d + 4) / 6;
    }
  
    l = (max + min) / 2;
  
    if (d === 0) {
      s = 0;
    } else {
      s = d / (1 - Math.abs(2 * l - 1));
    }
  
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
  
    return `hsl(${h}, ${s}%, ${l}%)`;
  }
  
  const handleColorPress=(selectedColor)=>{
    console.log("color", selectedColor)
    setColorVisible(false)
    setColorSelected(selectedColor) 
    const hslColor = hexToHSL(selectedColor);
      console.log("hslColor", hslColor);
    color!.value = hslColor;
  }

  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        {/* <View style={styles.actionButton}>
          <Pressable onPress={close}>
            <CloseSvg height={20} width={20} fill="#ffffff" />
          </Pressable>
        </View> */}
        <Modal animationType="slide" transparent={true} visible={colorVisible}>
          <View
            style={{
              flex: 1,
                justifyContent: "flex-end",
                backgroundColor: "transparent",
            }}
          >
          <View style={{
              backgroundColor: "white",
              padding: 15,
              gap:10,
              borderTopEndRadius: 20,
              flexDirection:"row",
              flexWrap:"wrap",
              borderTopStartRadius:20,
              width: "100%",
              height:'30%'
          }}>        
          <View style={{width:"100%", paddingHorizontal:15}}>            
            <Text style={{fontSize:16}}>Choose Color</Text>          
          </View>

          {gradientColors.map((color, index) => (
          <Pressable key={index} onPress={() => handleColorPress(color)} >
         <View
        //  key={index}
            style={{
              alignSelf: 'center',
              gap:25,
            borderRadius: 25,
              height: 40,
              padding: 10,
            }}
          >
            <View
              // key={index}
              style={{
                backgroundColor: color,
                width: 40,
                height: 40,
                gap:40,
                padding:5,
                borderRadius: 150,
                marginLeft: 2,
              }}
             // Add onPress event for each color
            />
            </View>
            </Pressable>
          ))}
            </View>
        </View>
      </Modal>
        <View style={styles.drawOptions}>
          <View
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              // borderWidth: 1,
              // borderColor: 'grey',
              // backgroundColor:"grey",
              borderRadius: 25,
              height: 40,
              paddingHorizontal: 10,
              paddingVertical: 10,
            }}
          >
        <Menu
          visible={visible}
          style={{width:"35%"}}
          onDismiss={closeMenu}
          anchor={
            <Pressable
              style={styles.option}
              onPress={openMenu}
            >
            {drawState?.drawingMode === "pen"? <PenSvg
                height={23}
                width={22}
                stroke="#323232"
                fill="#323232"
                strokeWidth="2"
                opacity={drawState.drawingMode === 'pen' ? 1 : 0.5}
              />: 
                drawState?.drawingMode === 'ellipse' ?  <CircleSvg
                fill="#323232"
                stroke="#323232"
                height={26}
                width={26}
                opacity={drawState.drawingMode === 'ellipse' ? 1 : 0.5}
              />: drawState.drawingMode === 'doubleHead' ? <DoubleHeadSvg
                  height={20}
                  width={20}
                  fill="#323232"
                  stroke="#323232"
                  // strokeWidth="2"
                  opacity={drawState.drawingMode === 'doubleHead' ? 1 : 0.5}
                />: drawState.drawingMode === 'singleHead' ? <ArrowSvg
                    height={23}
                    width={23}
                    fill="#323232"
                    stroke="#323232"
                    opacity={drawState.drawingMode === 'singleHead' ? 1 : 0.5}
                  />: drawState.drawingMode === 'rectangle' ?<SquareSvg
                  height={27}
                  width={27}
                  fill="#323232"
                  stroke="#323232"
                  opacity={drawState.drawingMode === 'rectangle' ? 1 : 0.5}
              /> :drawState.drawingMode === 'text' && <TextSvg
              height={28}
              width={28}
              fill="#323232"
              stroke="#323232"
              opacity={drawState.drawingMode === 'text' ? 1 : 0.5}
            />}
          </Pressable>         
      }>                     
          <Pressable
            style={{paddingHorizontal:15, flexDirection:"row", alignItems: "center"}}
            onPress={() => {
              dispatchDrawStates({
                type: 'SET_DRAWING_MODE',
                drawingMode: 'pen',
              });
              setVisible(false)
            }}
            >
              <PenSvg
                height={23}
                width={22}
                stroke="grey"
                fill="grey"
                strokeWidth="2"
                opacity={drawState.drawingMode === 'pen' ? 1 : 0.5}
              />   
               <Menu.Item title="Pen" />        
            </Pressable>            
            <Pressable
               style={{paddingHorizontal:15, flexDirection:"row", alignItems: "center"}}
                onPress={() => {
                  dispatchDrawStates({
                    type: 'SET_DRAWING_MODE',
                    drawingMode: 'doubleHead',
                  });
                  setVisible(false)

                }}
              >
              <DoubleHeadSvg
                height={20}
                width={20}
                fill="black"
                stroke="black"
                // strokeWidth="2"
                opacity={drawState.drawingMode === 'doubleHead' ? 1 : 0.5}
              />
              <Menu.Item title="Line" /> 
            </Pressable>            
               <Pressable
                style={{paddingHorizontal:15, flexDirection:"row", alignItems: "center"}}
                onPress={() => {
                dispatchDrawStates({
                  type: 'SET_DRAWING_MODE',
                  drawingMode: 'singleHead',
                });
                setVisible(false)
              }}
            >
              <ArrowSvg
                height={23}
                width={23}
                fill="black"
                stroke="black"
                opacity={drawState.drawingMode === 'singleHead' ? 1 : 0.5}
              />
              <Menu.Item title="Arrow" /> 
            </Pressable>            
             <Pressable
              style={{paddingHorizontal:15, flexDirection:"row", alignItems: "center"}}
              onPress={() => {
              dispatchDrawStates({
                type: 'SET_DRAWING_MODE',
                drawingMode: 'rectangle',
              });
              setVisible(false)
            }}
          >
            <SquareSvg
              height={27}
              width={27}
              fill="black"
              stroke="black"
              opacity={drawState.drawingMode === 'rectangle' ? 1 : 0.5}
            />
            <Menu.Item title="Square" /> 
          </Pressable>             
          <Pressable
            style={{paddingHorizontal:15, flexDirection:"row", alignItems: "center"}}
            onPress={() => {
              dispatchDrawStates({
                type: 'SET_DRAWING_MODE',
                drawingMode: 'ellipse',
              });
              setVisible(false)
            }}
          >
            <CircleSvg
              fill="black"
              stroke="black"
              // color={"#ffffff"}
              height={26}
              width={26}
              opacity={drawState.drawingMode === 'ellipse' ? 1 : 0.5}
            />
            <Menu.Item title="Circle" /> 
          </Pressable>            
          <Pressable
              style={{paddingHorizontal:15, flexDirection:"row", alignItems: "center"}}
              onPress={() => {
              dispatchDrawStates({
                type: 'SET_DRAWING_MODE',
                drawingMode: 'text',
              });
              setVisible(false)
            }}
          >
            <TextSvg
              height={28}
              width={28}
              fill="black"
              stroke="black"
              opacity={drawState.drawingMode === 'text' ? 1 : 0.5}
            />
            <Menu.Item title="Text" /> 
          </Pressable>        
        </Menu>    
            <Pressable style={styles.option} onPress={deleteSelectedItem}>
                  <ThrashSvg
                    width={28}
                    height={28}
                    color="#323232"
                    strokeWidth={2}
                  />
                </Pressable>
                <Pressable style={styles.option} onPress={cancelLastAction}>
                  <CancelSvg
                    width={28}
                    height={28}
                    fill="transparent"
                    color='#323232'
                    stroke="#323232"
                    strokeWidth={2}
                  />
                </Pressable>
                <Pressable
                      style={styles.option}
                      onPress={()=>setColorVisible(true)}
                    >
                    <View
                      style={{
                        backgroundColor: colorSelected ? `${colorSelected}` : "red",
                        width: 25,
                        height: 25,
                        borderRadius: 150,
                        marginLeft: 2,
                      }}
                    // Add onPress event for each color
                    />
          </Pressable>  
          {/* <Pressable style={styles.option} onPress={takeSnapshotAndGetUri}>
            <IconButton
            icon="check"
            iconColor='#323232'  
            size={30}      
            />
        </Pressable> */}
      
          </View>
        </View>
        {/* <View style={styles.actionButton}>
          <Pressable onPress={takeSnapshotAndGetUri}>
            <SendSvg height={20} width={20} fill="#ffffff" />
          </Pressable>
        </View> */}
      </View>
      <View
        style={{
          marginHorizontal: 0,
          flex: 1,
        }}
      >
        <DrawCore image={image} backgroundColor={backgroundColor} />
      </View>
      <View style={{width: '100%', marginBottom:'5%'}}>
      <Sliders linearGradient={linearGradient}/>
      </View>
      <View style={{
        marginTop: 10,       
        borderRadius: 20,        
        width: "100%",
        alignSelf: 'center'
        }}>
      <Button       
        style={{width:"90%", alignSelf: 'center'}}
        // contentStyle={{ flexDirection: 'row-reverse' }}
        mode="contained"
        labelStyle={{ fontSize: 15 }}
        buttonColor="rgb(115 74 153)"
        onPress={takeSnapshotAndGetUri}       >
        Save
    </Button>
    </View>

      {/* <View style={{ height: 70 }}>
        {showToolbar ? (
          <View style={styles.bottomToolBar}>
            {itemIsSelected.value ? (
              <View style={{ ...styles.actionButton, marginRight: 10 }}>
                <Pressable style={styles.option} onPress={deleteSelectedItem}>
                  <ThrashSvg
                    width={28}
                    height={28}
                    color="white"
                    strokeWidth={2}
                  />
                </Pressable>
              </View>
            ) : null}
            {drawState.cancelEnabled ? (
              <View
                style={{
                  ...styles.actionButton,
                }}
              >
                <Pressable style={styles.option} onPress={cancelLastAction}>
                  <CancelSvg
                    width={28}
                    height={28}
                    color={'grey'}
                    strokeWidth={2}
                  />
                </Pressable>
              </View>
            ) : null}
          </View>
        ) : null}
      </View> */}
    </View>
  );
}

export default function DrawWithOptions(props: DrawWithOptionsProps) {
  return (
    <DrawProvider>
      <DrawWithOptionsCore {...props} />
    </DrawProvider>
  );
}
